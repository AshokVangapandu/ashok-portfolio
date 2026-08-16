import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@^2";
import { renderPortfolioEmail } from "../_shared/emailTemplate.ts";
import { sendEmail } from "../_shared/emailProvider.ts";

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

  const debugInfo: any = {
    logs: [],
    webhookPayload: null,
    googleEmail: null,
    adminEmails: [],
    thankYouResStatus: null,
    thankYouResBody: null,
    thankYouError: null,
    approvalResStatus: null,
    approvalResBody: null,
    approvalError: null
  };

  const debugLog = (msg: string) => {
    console.log(msg);
    debugInfo.logs.push(msg);
  };

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
    debugInfo.webhookPayload = payload;
    const record = payload.record;
    if (!record) {
      throw new Error("No record found in payload");
    }

    debugInfo.googleEmail = record.google_email;
    const { google_name, google_email, google_avatar, linkedin_url, designation, company, rating, testimonial, consent_public, status, created_at } = record;

    const portfolioUrl = Deno.env.get('PORTFOLIO_URL') || 'https://ashokvangapandu.com';
    const base = portfolioUrl.endsWith('/') ? portfolioUrl : `${portfolioUrl}/`;
    const adminUrl = Deno.env.get('ADMIN_PORTAL_URL') || `${base}admin`;
    const submittedTime = created_at ? new Date(created_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC' : new Date().toLocaleString();

    if (status === 'approved') {
      // Testimonial Approved: Send approval email to submitter
      if (!google_email) {
        debugLog("Testimonial approved but no google_email found. Skipping approval email.");
        return new Response(JSON.stringify({ success: true, message: "Skipped - no email" }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      debugLog(`Testimonial approved: ${record.id}. Sending approval email to ${google_email}...`);

      const approvalHtml = renderPortfolioEmail({
        badge: '💖 WALL OF LOVE',
        title: 'Your Testimonial is Approved! 🎉',
        subtitle: 'Thank you for sharing your experience.',
        contentHtml: `
          <p style="margin-top: 0;">Hi ${google_name || 'there'},</p>
          <p>I am happy to let you know that your testimonial has been approved and published to the Wall of Love on my portfolio website.</p>
          
          <div style="margin: 24px 0; padding: 18px; background: rgba(143, 133, 255, 0.04); border-left: 3px solid #8f85ff; border-radius: 0 12px 12px 0; color: rgba(255, 255, 255, 0.85); font-style: italic; font-size: 14px; line-height: 1.6;">
            "${testimonial}"
          </div>
          
          <p>I truly appreciate your kind words and professional support. You can see it live on my portfolio Wall of Love section.</p>
          
          <p style="margin-bottom: 4px;">Regards,</p>
          <p><strong>Ashok Vangapandu</strong><br><span style="font-size: 13px; color: rgba(255,255,255,0.6);">UI Manager | Mendix UI Specialist</span></p>
        `,
        ctaText: 'View Wall of Love',
        ctaUrl: portfolioUrl,
        footerNote: 'You received this email because your testimonial was approved on Ashok Vangapandu\'s Portfolio.',
        portfolioUrl: portfolioUrl
      });

      const approvalText = `
        Hi ${google_name || 'there'},

        Your testimonial has been approved and is now live on my portfolio Wall of Love!

        "${testimonial}"

        Thank you for your support!

        Link: ${portfolioUrl}

        Regards,
        Ashok Vangapandu
      `.trim();

      const approvalResult = await sendEmail({
        to: { email: google_email, name: google_name || 'Valued Visitor' },
        subject: '🎉 Your Testimonial Has Been Approved & Published!',
        html: approvalHtml,
        text: approvalText
      });

      debugInfo.approvalResStatus = approvalResult.statusCode || (approvalResult.success ? 200 : 400);
      debugInfo.approvalResBody = approvalResult.messageId || approvalResult.error;

      if (!approvalResult.success) {
        throw new Error(approvalResult.error || 'Failed to send approval email');
      }

      debugLog("Approval email sent successfully.");

      return new Response(JSON.stringify({ 
        success: true, 
        id: approvalResult.messageId,
        debug: debugInfo
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } else {
      // Testimonial Pending (New Submission): Send Admin Notification & Submitter Thank You
      debugLog("✔ Testimonial saved: " + record.id);
      debugLog("Webhook payload: " + JSON.stringify(payload));
      debugLog("Parsed google_email: " + record.google_email);

      // Fetch active admin emails dynamically from database
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      let adminRecipients = [];

      if (supabaseUrl && supabaseServiceRoleKey) {
        try {
          const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
          const { data: admins, error: adminQueryError } = await supabaseClient
            .from('admins')
            .select('email')
            .eq('is_active', true);

          if (adminQueryError) {
            console.error("Database admin query failed:", adminQueryError);
          } else if (admins && admins.length > 0) {
            adminRecipients = admins.map(admin => ({ email: admin.email }));
          }
        } catch (err) {
          console.error("Failed to query active admins:", err);
        }
      }

      if (adminRecipients.length === 0) {
        const fallbackEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || Deno.env.get('NOTIFICATION_EMAIL_TO') || 'contact@ashokvangapandu.com';
        debugLog(`No active admins resolved. Falling back to: ${fallbackEmail}`);
        adminRecipients = [{ email: fallbackEmail }];
      }

      debugInfo.adminEmails = adminRecipients.map(r => r.email);
      debugLog(`Resolved admin recipients: ${debugInfo.adminEmails.join(', ')}`);

      const emailBody = {
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>New Testimonial Awaiting Approval</title>
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
                <h1 class="subject-title">🎉 New Testimonial Awaiting Approval</h1>
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
                  <span class="meta-label">Role:</span>
                  <span class="meta-value">${designation || '<em style="color:rgba(255,255,255,0.3);">Not specified</em>'}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Company:</span>
                  <span class="meta-value">${company || '<em style="color:rgba(255,255,255,0.3);">Not specified</em>'}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Rating:</span>
                  <span class="meta-value" style="color: #f59e0b; font-weight: bold;">${'★'.repeat(rating || 5)}${'☆'.repeat(5 - (rating || 5))} (${rating || 5}/5)</span>
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
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8f85ff, #2563eb); color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; box-shadow: 0 4px 14px rgba(143, 133, 255, 0.3);">
                    Review Testimonial in Admin Portal
                  </a>
                </div>
              </div>
              
              <div class="footer">
                This notification was generated automatically by your portfolio database webhook.<br>
                Login to your <a href="${adminUrl}" style="color:#8f85ff; text-decoration:none;">Admin Portal</a> to manage approvals.
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          New Testimonial Awaiting Approval
          ----------------------------
          Name: ${google_name || "Anonymous"}
          Email: ${google_email}
          Role: ${designation || "Not specified"}
          Company: ${company || "Not specified"}
          Rating: ${rating || 5}/5
          LinkedIn: ${linkedin_url || "Not provided"}
          Submitted At: ${submittedTime}
          Consent to Display: ${consent_public ? "Yes" : "No"}
          Status: ${status}

          Testimonial:
          "${testimonial}"

          Review here: ${adminUrl}
        `
      };

      console.log(`Sending testimonial notification email to admin...`);
      const adminResult = await sendEmail({
        to: adminRecipients,
        subject: "New Testimonial Awaiting Approval",
        html: emailBody.html,
        text: emailBody.text
      });

      if (!adminResult.success) {
        throw new Error(adminResult.error || "Failed to send admin notification email");
      }

      console.log("✔ Admin notification email sent successfully. Message ID:", adminResult.messageId);

      // Send thank-you email to submitter
      try {
        if (google_email) {
          console.log(`Sending thank-you email to submitter: ${google_email}...`);
          const thankYouEmailBody = {
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Thank You for Your Testimonial</title>
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
                  .content-box {
                    line-height: 1.6;
                    font-size: 15px;
                    color: rgba(255, 255, 255, 0.9);
                  }
                  .content-box p {
                    margin-top: 0;
                    margin-bottom: 16px;
                  }
                  .highlight-box {
                    margin: 24px 0;
                    padding: 18px;
                    background: rgba(143, 133, 255, 0.04);
                    border-left: 3px solid #8f85ff;
                    border-radius: 0 12px 12px 0;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 14px;
                  }
                  .links-section {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                  }
                  .link-item {
                    margin-bottom: 10px;
                    font-size: 13px;
                  }
                  .link-item a {
                    color: #3cbcff;
                    text-decoration: none;
                  }
                  .footer {
                    margin-top: 30px;
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
                    <h1 class="subject-title">Thank you for sharing your experience ❤️</h1>
                  </div>
                  
                  <div class="content-box">
                    <p>Hi ${google_name || "there"},</p>
                    <p>Thank you for taking the time to share your experience.</p>
                    <p>Your testimonial has been received successfully and is currently under review.</p>
                    <p>Once approved, it may appear on my portfolio's Wall of Love.</p>
                    <p>I truly appreciate your support.</p>
                    
                    <div class="highlight-box">
                      <strong>Please Note:</strong> Submissions are moderated to ensure high-quality interactions. You will receive an automated update once approval status updates.
                    </div>
                    
                    <p style="margin-bottom: 4px;">Regards,</p>
                    <p><strong>Ashok Vangapandu</strong><br><span style="font-size: 13px; color: rgba(255,255,255,0.6);">UI Manager | Mendix UI Specialist</span></p>
                  </div>
  
                  <div class="links-section">
                    <div class="link-item">🌐 <strong>Portfolio:</strong> <a href="https://ashokvangapandu.github.io/ashok-portfolio/" target="_blank">ashokvangapandu.github.io/ashok-portfolio</a></div>
                    <div class="link-item">🔗 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ashok-vangapandu/" target="_blank">linkedin.com/in/ashok-vangapandu</a></div>
                    <div class="link-item">💻 <strong>GitHub:</strong> <a href="https://github.com/AshokVangapandu" target="_blank">github.com/AshokVangapandu</a></div>
                  </div>
                  
                  <div class="footer">
                    This confirmation was generated automatically because you submitted a testimonial.
                  </div>
                </div>
              </body>
              </html>
            `,
            text: `
              Hi ${google_name || "there"},
  
              Thank you for taking the time to share your experience.
  
              Your testimonial has been received successfully and is currently under review.
  
              Once approved, it may appear on my portfolio's Wall of Love.
  
              I truly appreciate your support.
  
              Regards,
              Ashok Vangapandu
              UI Manager | Mendix UI Specialist
  
              Portfolio: https://ashokvangapandu.github.io/ashok-portfolio/
              LinkedIn: https://www.linkedin.com/in/ashok-vangapandu/
              GitHub: https://github.com/AshokVangapandu
            `
          };

          const thankYouResult = await sendEmail({
            to: { email: google_email, name: google_name || 'Valued Visitor' },
            subject: 'Thank you for sharing your experience ❤️',
            html: thankYouEmailBody.html,
            text: thankYouEmailBody.text
          });

          debugInfo.thankYouResStatus = thankYouResult.statusCode || (thankYouResult.success ? 200 : 400);
          debugInfo.thankYouResBody = thankYouResult.messageId || thankYouResult.error;

          if (!thankYouResult.success) {
            throw new Error(thankYouResult.error || 'Failed to send thank-you email');
          }
          debugLog("Thank-you email sent.");
        }
      } catch (thankYouError: any) {
        debugInfo.thankYouError = thankYouError.message;
        console.error("Failed to send thank-you email.");
        console.error("Error Message:", thankYouError.message);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        id: adminResult.messageId,
        debug: debugInfo
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error: any) {
    console.error("❌ Email failed:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      debug: debugInfo
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
