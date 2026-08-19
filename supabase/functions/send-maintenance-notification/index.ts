import "@supabase/functions-js/edge-runtime.d.ts";
import { renderPortfolioEmail } from "../_shared/emailTemplate.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { corsHeaders, jsonResponse, requireAdmin } from "../_shared/functionAuth.ts";

console.log("send-maintenance-notification function initialized");

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
    const subscriberId = payload.subscriber_id || payload.record?.id;

    if (!email) {
      return jsonResponse({ error: "Missing recipient email address." }, 400);
    }

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || payload.portfolio_url || 'https://ashokvangapandu.com';
    const displayDomain = portfolioUrl.replace(/^https?:\/\/(www\.)?/, '');

    // Render HTML Email via shared portfolio template
    const htmlContent = renderPortfolioEmail({
      badge: '✨ PORTFOLIO LIVE',
      title: 'We are back online!',
      subtitle: 'Maintenance complete — explore the latest updates.',
      contentHtml: `
        <p style="margin-top: 0;">Hello,</p>
        <p>Thank you for your patience while the portfolio was undergoing planned maintenance and updates.</p>
        <p>All system updates have been successfully deployed. The site is now live and fully operational for you to view projects, case studies, and latest work.</p>
        <p style="margin-bottom: 0;">Click below to visit the live site:</p>
      `,
      ctaText: 'Visit Portfolio',
      ctaUrl: portfolioUrl,
      footerNote: `You received this notification because you subscribed to updates on ${displayDomain}.`,
      portfolioUrl: portfolioUrl
    });

    const plainTextContent = `
Portfolio is Now Live!
----------------------
Hello,

Thank you for your patience while the portfolio was undergoing planned maintenance and updates.

All system updates have been successfully deployed. The site is now live and fully operational.

Visit Portfolio: ${portfolioUrl}

Best regards,
Ashok Vangapandu
    `.trim();

    console.log(`[send-maintenance-notification] Sending email to ${email}...`);

    const result = await sendEmail({
      to: { email },
      subject: "🚀 Portfolio is Live! Maintenance Complete",
      html: htmlContent,
      text: plainTextContent
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to dispatch email via shared email provider.");
    }

    console.log(`[send-maintenance-notification] Successfully sent to ${email}. Message ID: ${result.messageId}`);

    return jsonResponse({
      success: true,
      id: result.messageId,
      email,
      subscriber_id: subscriberId
    });

  } catch (error: any) {
    console.error("[send-maintenance-notification] Error dispatching email:", error.message || error);
    return jsonResponse({
      success: false,
      error: error.message || 'Unknown error occurred while sending email.'
    }, 500);
  }
});
