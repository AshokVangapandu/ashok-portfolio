import "@supabase/functions-js/edge-runtime.d.ts";
import { renderPortfolioEmail } from "../_shared/emailTemplate.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/functionAuth.ts";

console.log("send-access-approval-email function initialized");

Deno.serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;

    const payload = await req.json().catch(() => ({}));
    const email = payload.email || payload.record?.email;
    const name = payload.name || payload.record?.full_name || 'there';

    if (!email) {
      return jsonResponse({ error: "Missing recipient email address." }, 400);
    }

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || payload.portfolio_url || 'https://ashokvangapandu.com';

    // Render HTML Email via shared portfolio template
    const htmlContent = renderPortfolioEmail({
      badge: '🔒 ACCESS APPROVED',
      title: 'Access Request Approved',
      subtitle: 'Explore projects, experience, and other work.',
      contentHtml: `
        <p style="margin-top: 0;">Hi ${name},</p>
        <p>Great news!</p>
        <p>Your request to access my private portfolio has been approved.</p>
        <p>You can now explore my projects, experience, certifications, and other work.</p>
        <p style="margin-bottom: 0;">Simply click the button below and continue signing in with the same Google account you used when requesting access.</p>
      `,
      ctaText: 'Open Portfolio',
      ctaUrl: portfolioUrl,
      footerNote: "If you didn't request access, you can safely ignore this email.",
      portfolioUrl: portfolioUrl
    });

    const plainTextContent = `
Hi ${name},

Great news!

Your request to access my private portfolio has been approved.

You can now explore my projects, experience, certifications, and other work.

Simply open the link below and continue signing in with the same Google account you used when requesting access.

Link: ${portfolioUrl}

If you didn't request access, you can safely ignore this email.
    `.trim();

    console.log(`[send-access-approval-email] Sending email to ${email}...`);

    const result = await sendEmail({
      to: { email },
      subject: '🎉 Your Portfolio Access Request Has Been Approved',
      html: htmlContent,
      text: plainTextContent
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to send email via shared provider");
    }

    console.log("[send-access-approval-email] Email sent successfully. Message ID:", result.messageId);
    return jsonResponse({ success: true, id: result.messageId });

  } catch (error: any) {
    console.error("[send-access-approval-email] Error sending notification:", error.message);
    return jsonResponse({ error: error.message }, 400);
  }
});
