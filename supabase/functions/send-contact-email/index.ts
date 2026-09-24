import "@supabase/functions-js/edge-runtime.d.ts";
import { sendEmail } from "../_shared/emailProvider.ts";
import { 
  renderContactConfirmationEmail, 
  renderContactConfirmationText 
} from "../_shared/emailTemplate.ts";

console.log("send-contact-email function initialized");

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
      }
    });
  }

  try {
    // Verify Webhook Secret if configured
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
    if (expectedSecret && webhookSecret && webhookSecret !== expectedSecret) {
      console.warn("Unauthorized request attempt: Webhook secret mismatch.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload));

    const record = payload.record || payload;
    if (!record) {
      throw new Error("No record found in payload");
    }

    const { full_name, email, subject, message, created_at } = record;

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || 'https://ashokvangapandu.com';
    const toAdminEmail = Deno.env.get('NOTIFICATION_EMAIL_TO') || Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'ashokvangapandu45@gmail.com';
    const submittedTime = created_at ? new Date(created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC' : new Date().toLocaleString();

    let confirmationResult = null;

    // 1. Send Branded Confirmation Email to Visitor
    if (email && email.includes('@')) {
      console.log(`Sending Contact Form Confirmation email to visitor: ${email} (${full_name})...`);
      
      const visitorHtml = renderContactConfirmationEmail({
        name: full_name || 'there',
        portfolioUrl: portfolioUrl
      });

      const visitorText = renderContactConfirmationText({
        name: full_name || 'there',
        portfolioUrl: portfolioUrl
      });

      confirmationResult = await sendEmail({
        to: { email: email.trim(), name: full_name || undefined },
        subject: 'Thanks for reaching out! 💙',
        html: visitorHtml,
        text: visitorText
      });

      if (confirmationResult.success) {
        console.log(`Visitor confirmation email sent successfully. ID: ${confirmationResult.messageId}`);
      } else {
        console.error(`Failed to send visitor confirmation email: ${confirmationResult.error}`);
      }
    } else {
      console.warn("No valid visitor email provided in record. Skipping confirmation email.");
    }

    // 2. Send Admin Notification to Ashok
    let adminResult = null;
    if (toAdminEmail) {
      console.log(`Sending admin notification email to: ${toAdminEmail}...`);
      
      const adminHtmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #6C3CFF; margin-top: 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Portfolio Contact Message</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #4b5563;">${full_name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Sender Email:</td>
              <td style="padding: 8px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #6C3CFF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
              <td style="padding: 8px 0; color: #4b5563; font-weight: 500;">${subject || 'No Subject'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Submitted At:</td>
              <td style="padding: 8px 0; color: #4b5563;">${submittedTime}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #6C3CFF;">
            <p style="margin: 0; font-weight: bold; color: #374151; margin-bottom: 5px;">Message:</p>
            <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.5;">${message || ''}</p>
          </div>

          <div style="margin-top: 25px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            Sent automatically from your portfolio website database webhook.
          </div>
        </div>
      `;

      const adminTextContent = `
New Portfolio Contact Message
----------------------------
Sender Name: ${full_name}
Sender Email: ${email}
Subject: ${subject || 'No Subject'}
Submitted At: ${submittedTime}

Message:
${message || ''}
      `.trim();

      adminResult = await sendEmail({
        to: { email: toAdminEmail },
        subject: `New Portfolio Message: ${subject || full_name || 'Contact Submission'}`,
        html: adminHtmlContent,
        text: adminTextContent
      });

      if (adminResult.success) {
        console.log(`Admin notification email sent successfully. ID: ${adminResult.messageId}`);
      } else {
        console.error(`Failed to send admin notification email: ${adminResult.error}`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      confirmationMessageId: confirmationResult?.messageId || null,
      adminMessageId: adminResult?.messageId || null
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error("Error in send-contact-email function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
