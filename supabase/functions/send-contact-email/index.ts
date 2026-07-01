import "@supabase/functions-js/edge-runtime.d.ts";

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
    // Verify Webhook Secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
    if (!webhookSecret || webhookSecret !== expectedSecret) {
      console.warn("Unauthorized request attempt: Webhook secret mismatch.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload));

    const record = payload.record;
    if (!record) {
      throw new Error("No record found in payload");
    }

    const { full_name, email, subject, message, created_at } = record;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(JSON.stringify({ error: "Email configuration missing." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const toEmail = Deno.env.get('NOTIFICATION_EMAIL_TO') || 'ashokvangapandu45@gmail.com';
    const fromEmail = Deno.env.get('NOTIFICATION_EMAIL_FROM') || 'Portfolio Contact <onboarding@resend.dev>';
    const submittedTime = created_at ? new Date(created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC' : new Date().toLocaleString();

    const emailBody = {
      from: fromEmail,
      to: toEmail,
      subject: `New Portfolio Message: ${subject || 'No Subject'}`,
      html: `
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
              <td style="padding: 8px 0; color: #4b5563; font-weight: 500;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Submitted At:</td>
              <td style="padding: 8px 0; color: #4b5563;">${submittedTime}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #6C3CFF;">
            <p style="margin: 0; font-weight: bold; color: #374151; margin-bottom: 5px;">Message:</p>
            <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.5;">${message}</p>
          </div>

          <div style="margin-top: 25px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            Sent automatically from your portfolio website database webhook.
          </div>
        </div>
      `,
      text: `
        New Portfolio Contact Message
        ----------------------------
        Sender Name: ${full_name}
        Sender Email: ${email}
        Subject: ${subject}
        Submitted At: ${submittedTime}

        Message:
        ${message}
      `
    };

    console.log(`Sending email from ${fromEmail} to ${toEmail}...`);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify(emailBody)
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Failed to send email via Resend");
    }

    console.log("Email sent successfully. Resend ID:", result.id);
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error("Error sending notification:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
