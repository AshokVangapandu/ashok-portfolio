import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2";
import { renderPortfolioEmail } from "../_shared/emailTemplate.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { corsHeaders, jsonResponse, requireWebhookSecret } from "../_shared/functionAuth.ts";

console.log("notify-admins-new-request function initialized");

Deno.serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const unauthorized = requireWebhookSecret(req);
    if (unauthorized) return unauthorized;

    const payload = await req.json().catch(() => ({}));
    const record = payload.record || payload;
    if (!record) {
      throw new Error("No record found in payload");
    }

    const visitorName = record.full_name || 'Visitor';
    const visitorEmail = record.email;
    const company = record.company || 'Not Provided';
    const jobTitle = record.job_title || 'Not Provided';
    const reason = record.reason || 'No reason provided';

    if (!visitorEmail) {
      return jsonResponse({ error: "Missing visitor email." }, 400);
    }

    // Initialize Supabase client using Service Role key to query active admins
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Missing Supabase configuration environment keys.");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Fetch active admin emails from database
    const { data: admins, error: adminQueryError } = await supabaseClient
      .from('admins')
      .select('email')
      .eq('is_active', true);

    if (adminQueryError) {
      console.error("[notify-admins-new-request] Database admin query failed:", adminQueryError);
    }

    // Form recipient list, fallback to configuration emails if query is empty
    let recipients = [];
    if (admins && admins.length > 0) {
      recipients = admins.map(admin => ({ email: admin.email }));
    } else {
      const fallback = Deno.env.get('NOTIFICATION_EMAIL_TO') || Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'contact@ashokvangapandu.com';
      console.warn(`[notify-admins-new-request] No active admins found. Falling back to: ${fallback}`);
      recipients = [{ email: fallback }];
    }

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || 'https://ashokvangapandu.com';
    const base = portfolioUrl.endsWith('/') ? portfolioUrl : `${portfolioUrl}/`;
    const adminUrl = `${base}admin/settings/portfolio?tab=access-requests`;

    // Render HTML Email via shared template layout
    const htmlContent = renderPortfolioEmail({
      badge: '🔔 NEW ACCESS REQUEST',
      title: 'New Access Request',
      subtitle: 'A visitor has requested access to your private portfolio.',
      contentHtml: `
        <p style="margin-top: 0;">Hi Ashok,</p>
        <p>A new visitor has requested access to your private portfolio.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; font-size: 14px;">
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
            <td style="padding: 12px 16px; font-weight: 700; color: #94A3B8; width: 130px;">Visitor Name:</td>
            <td style="padding: 12px 16px; color: #F8FAFC;">${visitorName}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
            <td style="padding: 12px 16px; font-weight: 700; color: #94A3B8;">Visitor Email:</td>
            <td style="padding: 12px 16px; color: #F8FAFC;"><a href="mailto:${visitorEmail}" style="color: #A78BFA; text-decoration: none;">${visitorEmail}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
            <td style="padding: 12px 16px; font-weight: 700; color: #94A3B8;">Company:</td>
            <td style="padding: 12px 16px; color: #F8FAFC;">${company}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
            <td style="padding: 12px 16px; font-weight: 700; color: #94A3B8;">Role / Title:</td>
            <td style="padding: 12px 16px; color: #F8FAFC;">${jobTitle}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: 700; color: #94A3B8; vertical-align: top;">Reason:</td>
            <td style="padding: 12px 16px; color: #E2E8F0; line-height: 1.5; white-space: pre-wrap;">${reason}</td>
          </tr>
        </table>
        <p style="margin-bottom: 0;">You can review this request from the Admin Dashboard.</p>
      `,
      ctaText: 'Open Access Requests',
      ctaUrl: adminUrl,
      footerNote: "You received this email because you are registered as an active administrator for Ashok Vangapandu's Portfolio.",
      portfolioUrl: portfolioUrl
    });

    const plainTextContent = `
Hi Ashok,

A new visitor has requested access to your private portfolio.

Visitor Name: ${visitorName}
Visitor Email: ${visitorEmail}
Company: ${company}
Role / Title: ${jobTitle}

Reason:
${reason}

You can review this request from the Admin Dashboard.
Link: ${adminUrl}

You received this email because you are registered as an active administrator for Ashok Vangapandu's Portfolio.
    `.trim();

    console.log(`[notify-admins-new-request] Dispatching emails to ${recipients.length} admins...`);

    const result = await sendEmail({
      to: recipients,
      subject: '🔔 New Portfolio Access Request',
      html: htmlContent,
      text: plainTextContent
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to send email via shared provider");
    }

    console.log("[notify-admins-new-request] Email dispatched successfully. Message ID:", result.messageId);
    return jsonResponse({ success: true, id: result.messageId });

  } catch (error: any) {
    console.error("[notify-admins-new-request] Error sending notification:", error.message);
    return jsonResponse({ error: error.message }, 400);
  }
});
