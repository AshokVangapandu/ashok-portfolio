import "@supabase/functions-js/edge-runtime.d.ts";

console.log("send-testimonial-email function initialized");

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
    const record = payload.record;
    if (!record) {
      throw new Error("No record found in payload");
    }

    // Log successful database save event
    console.log("✔ Testimonial saved:", record.id);

    const { google_name, google_email, google_avatar, linkedin_url, testimonial, consent_public, status, created_at } = record;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not set");
      return new Response(JSON.stringify({ error: "Email configuration missing." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Recipient email (ADMIN_NOTIFICATION_EMAIL or default to ashok's email)
    const toEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'ashokvangapandu45@gmail.com';
    const fromEmail = Deno.env.get('NOTIFICATION_EMAIL_FROM') || 'Portfolio Testimonials <onboarding@resend.dev>';
    const submittedTime = created_at ? new Date(created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC' : new Date().toLocaleString();

    const emailBody = {
      from: fromEmail,
      to: toEmail,
      subject: "🎉 New Testimonial Submitted",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>New Testimonial Submitted</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #090d16;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #ffffff;
            }
            .email-container {
              max-width: 600px;
              margin: 30px auto;
              padding: 32px;
              background: radial-gradient(circle at top right, rgba(143, 133, 255, 0.05), transparent 45%), #0d111c;
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .header {
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .logo-text {
              font-size: 22px;
              font-weight: 800;
              background: linear-gradient(135deg, #8f85ff, #3cbcff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin: 0;
            }
            .subject-title {
              font-size: 20px;
              font-weight: 700;
              color: #ffffff;
              margin-top: 10px;
              margin-bottom: 0;
            }
            .card {
              background: rgba(255, 255, 255, 0.02);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 24px;
            }
            .meta-row {
              display: flex;
              margin-bottom: 14px;
              font-size: 13px;
            }
            .meta-label {
              font-weight: bold;
              color: rgba(255, 255, 255, 0.4);
              width: 140px;
              flex-shrink: 0;
            }
            .meta-value {
              color: #ffffff;
            }
            .meta-value a {
              color: #3cbcff;
              text-decoration: none;
            }
            .testimonial-box {
              margin-top: 20px;
              padding: 18px;
              background: rgba(143, 133, 255, 0.05);
              border-left: 3px solid #8f85ff;
              border-radius: 0 12px 12px 0;
              color: rgba(255, 255, 255, 0.85);
              font-style: italic;
              font-size: 14px;
              line-height: 1.6;
            }
            .divider {
              height: 1px;
              background: rgba(255, 255, 255, 0.1);
              margin: 24px 0;
            }
            .footer {
              font-size: 11px;
              color: rgba(255, 255, 255, 0.3);
              text-align: center;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo-text">Ashok Vangapandu</div>
              <h1 class="subject-title">🎉 New Testimonial Submitted</h1>
            </div>
            
            <div class="card">
              <div class="meta-row">
                <span class="meta-label">Name:</span>
                <span class="meta-value"><strong>${google_name || "Anonymous"}</strong></span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Email:</span>
                <span class="meta-value"><a href="mailto:${google_email}">${google_email}</a></span>
              </div>
              <div class="meta-row">
                <span class="meta-label">LinkedIn:</span>
                <span class="meta-value">${linkedin_url ? `<a href="${linkedin_url}" target="_blank">${linkedin_url}</a>` : '<em style="color:rgba(255,255,255,0.3);">Not provided</em>'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Submitted At:</span>
                <span class="meta-value">${submittedTime}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Consent to Display:</span>
                <span class="meta-value">${consent_public ? "✅ Yes" : "❌ No"}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Status:</span>
                <span class="meta-value"><span style="padding: 3px 8px; background: rgba(255, 165, 0, 0.15); border: 1px solid rgba(255, 165, 0, 0.3); border-radius: 6px; font-size: 11px; color: #ffa500; text-transform: uppercase; font-weight: bold;">${status}</span></span>
              </div>
              
              <div class="divider"></div>
              
              <h3 style="color:#ffffff; font-size:14px; margin:0 0 10px 0; font-weight:700;">Testimonial Content:</h3>
              <div class="testimonial-box">
                "${testimonial}"
              </div>
            </div>
            
            <div class="footer">
              This notification was generated automatically by your portfolio database webhook.<br>
              Login to your <a href="https://txoszrnjkrlbjzpjisvp.supabase.co" style="color:#8f85ff; text-decoration:none;">Supabase Dashboard</a> to manage approvals.
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Testimonial Submitted
        ----------------------------
        Name: ${google_name || "Anonymous"}
        Email: ${google_email}
        LinkedIn: ${linkedin_url || "Not provided"}
        Submitted At: ${submittedTime}
        Consent to Display: ${consent_public ? "Yes" : "No"}
        Status: ${status}

        Testimonial:
        "${testimonial}"
      `
    };

    console.log(`Sending testimonial notification email to ${toEmail}...`);
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

    console.log("✔ Email sent successfully. Resend ID:", result.id);
    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error("❌ Email failed:", error.message);
    // Return status 200/success so the PostgreSQL transaction is never aborted or blocked
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
