import "@supabase/functions-js/edge-runtime.d.ts";
import { renderPortfolioEmail } from "../_shared/emailTemplate.ts";
import { sendEmail } from "../_shared/emailProvider.ts";

console.log("send-admin-invitation function initialized");

Deno.serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const payload = await req.json().catch(() => ({}));
    const email = payload.email;
    const role = payload.role || 'administrator';

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing recipient email address." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || 'https://ashokvangapandu.com';
    const adminUrl = `${portfolioUrl.endsWith('/') ? portfolioUrl : portfolioUrl + '/'}admin`;

    // Render HTML Email via shared portfolio template
    const htmlContent = renderPortfolioEmail({
      badge: '💼 ADMIN INVITATION',
      title: 'Administrator Access Granted',
      subtitle: 'You have been invited as an Administrator.',
      contentHtml: `
        <p style="margin-top: 0;">Hi,</p>
        <p>You have been granted <strong>Administrator</strong> privileges (Role: <strong>${role}</strong>) for Ashok Vangapandu's Portfolio Dashboard.</p>
        <p>Your account will become active automatically when you sign in for the first time.</p>
        <p style="margin-bottom: 0;">Please click the button below to sign in using your Google account (${email}) and access the admin dashboard.</p>
      `,
      ctaText: 'Access Admin Dashboard',
      ctaUrl: adminUrl,
      footerNote: "If you weren't expecting this invitation, you can safely ignore this email.",
      portfolioUrl: portfolioUrl
    });

    const plainTextContent = `
Hi,

You have been granted Administrator privileges (Role: ${role}) for Ashok Vangapandu's Portfolio Dashboard.

Your account will become active automatically when you sign in for the first time.

Please open the link below to sign in using your Google account (${email}) and access the admin dashboard.

Link: ${adminUrl}

If you weren't expecting this invitation, you can safely ignore this email.
    `.trim();

    console.log(`[send-admin-invitation] Sending invitation email to ${email}...`);

    const result = await sendEmail({
      to: { email },
      subject: '💼 Invitation: Administrator Access Granted',
      html: htmlContent,
      text: plainTextContent
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to send email via shared provider");
    }

    console.log("[send-admin-invitation] Email sent successfully. Message ID:", result.messageId);
    return new Response(JSON.stringify({ success: true, id: result.messageId }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error("[send-admin-invitation] Error sending notification:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
