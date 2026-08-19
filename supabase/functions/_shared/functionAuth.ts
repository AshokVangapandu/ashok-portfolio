import { createClient } from "npm:@supabase/supabase-js@^2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

export function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

export function requireWebhookSecret(req: Request): Response | null {
  const expectedSecret = Deno.env.get("WEBHOOK_SECRET");
  const providedSecret = req.headers.get("x-webhook-secret");

  if (expectedSecret && providedSecret && providedSecret === expectedSecret) {
    return null;
  }

  console.warn("[edge-auth] Missing or invalid webhook secret.");
  return jsonResponse({ error: "Unauthorized" }, 401);
}

export async function requireAdmin(
  req: Request,
  options: { superAdmin?: boolean } = {},
): Promise<
  | { ok: true; admin: { email: string; role: string } }
  | { ok: false; response: Response }
> {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    console.warn("[edge-auth] Missing authorization bearer token.");
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[edge-auth] Missing Supabase service configuration.");
    return { ok: false, response: jsonResponse({ error: "Server authentication is not configured." }, 500) };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  const email = userData?.user?.email?.trim().toLowerCase();

  if (userError || !email) {
    console.warn("[edge-auth] Invalid authorization bearer token.", userError?.message);
    return { ok: false, response: jsonResponse({ error: "Unauthorized" }, 401) };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("role, is_active")
    .eq("email", email)
    .maybeSingle();

  if (adminError) {
    console.error("[edge-auth] Admin lookup failed.", adminError.message);
    return { ok: false, response: jsonResponse({ error: "Authorization lookup failed." }, 500) };
  }

  if (!admin?.is_active) {
    console.warn(`[edge-auth] Non-admin or inactive admin rejected: ${email}`);
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }

  if (options.superAdmin && admin.role !== "super_admin") {
    console.warn(`[edge-auth] Non-super-admin rejected: ${email}`);
    return { ok: false, response: jsonResponse({ error: "Forbidden" }, 403) };
  }

  return { ok: true, admin: { email, role: admin.role } };
}
