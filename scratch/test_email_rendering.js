// scratch/test_email_rendering.js
import fs from 'fs';
import path from 'path';

// Import emailTemplate function or re-evaluate with local asset links for visual verification
function renderTestimonialConfirmationEmail(options) {
  const {
    name = 'there',
    portfolioUrl = 'https://ashokvangapandu.com',
    localAssets = false
  } = options;

  const base = portfolioUrl.replace(/\/+$/, '');
  const assetBase = localAssets ? '../assets/images' : `${base}/assets/images`;
  const displayDomain = base.replace(/^https?:\/\/(www\.)?/, '');
  const displayName = (name || 'there').trim();

  const logoUrl = `${assetBase}/av-brand-icon.png`;
  const illustrationUrl = `${assetBase}/testimonial-email-illustration.png`;
  const iconCheckUrl = `${assetBase}/email-icon-check.png`;
  const iconClockUrl = `${assetBase}/email-icon-clock.png`;
  const iconPortfolioUrl = `${assetBase}/email-icon-portfolio.png`;
  const iconLinkedinUrl = `${assetBase}/email-icon-linkedin.png`;
  const iconGithubUrl = `${assetBase}/email-icon-github.png`;

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Thank you for your kind words ❤️</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #070B14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .mobile-hero-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        text-align: left !important;
      }
      .mobile-hero-img-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
        padding-top: 16px !important;
      }
      .mobile-hero-img {
        margin: 0 auto !important;
        width: 160px !important;
        height: auto !important;
      }
      .mobile-footer-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 12px !important;
      }
      .mobile-header-links {
        display: none !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #070B14; margin: 0; padding: 36px 12px;">
    <tr>
      <td align="center" valign="top">
        
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #0B0F19 radial-gradient(circle at top right, rgba(108, 60, 255, 0.15) 0%, transparent 60%); background-color: #0B0F19; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
          
          <!-- 1. HEADER SECTION -->
          <tr>
            <td class="mobile-padding" style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 12px;">
                          <a href="${base}" target="_blank" style="text-decoration: none; display: block;">
                            <img src="${logoUrl}" width="38" height="34" alt="AV Logo" style="display: block; width: 38px; height: 34px; border: 0;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.01em; line-height: 1.2;">Ashok Vangapandu</div>
                          <div style="font-size: 9px; font-weight: 700; color: #64748B; letter-spacing: 1.2px; text-transform: uppercase; line-height: 1.2; margin-top: 2px;">TURNING IDEAS INTO IMPACT</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <td align="right" valign="middle" class="mobile-header-links" style="font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #94A3B8;">
                    <a href="${base}" target="_blank" style="color: #94A3B8; text-decoration: none;">PORTFOLIO</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${base}#projects" target="_blank" style="color: #94A3B8; text-decoration: none;">PROJECTS</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${base}#writing" target="_blank" style="color: #94A3B8; text-decoration: none;">BLOG</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. STATUS BADGE & HERO SECTION -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 32px 24px 32px;">
              
              <!-- Status Badge Pill -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 9999px; padding: 5px 14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 6px;">
                          <img src="${iconCheckUrl}" width="14" height="14" alt="Check" style="display: block; width: 14px; height: 14px;" />
                        </td>
                        <td valign="middle" style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #34D399; text-transform: uppercase; line-height: 1;">
                          TESTIMONIAL RECEIVED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Hero 2-Column Row (Headline & 3D Illustration) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-hero-col" valign="middle" align="left" style="padding-right: 16px;">
                    <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; color: #FFFFFF; line-height: 1.15; letter-spacing: -0.02em;">
                      Thank you for<br />
                      <span style="color: #38BDF8; background: linear-gradient(90deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">your kind words</span> ❤️
                    </h1>
                    <p style="margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.55; max-width: 320px;">
                      Your feedback truly means a lot. I'm grateful you took the time to share your experience.
                    </p>
                  </td>

                  <td class="mobile-hero-img-col" valign="middle" align="right" width="180" style="width: 180px;">
                    <img src="${illustrationUrl}" class="mobile-hero-img" width="170" height="152" alt="Email illustration with a heart" style="display: block; width: 170px; height: auto; border: 0;" />
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 3. PERSONAL MESSAGE CONTENT -->
          <tr>
            <td class="mobile-padding" style="padding: 0 32px 28px 32px; font-size: 14.5px; color: #CBD5E1; line-height: 1.65;">
              <p style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                Hi ${displayName},
              </p>
              <p style="margin: 0 0 14px 0;">
                Thank you for taking the time to share your experience. I really appreciate your feedback and support.
              </p>
              <p style="margin: 0 0 14px 0;">
                Your testimonial has been received and is currently under review.
              </p>
              <p style="margin: 0 0 14px 0;">
                Once approved, it may be featured in the Testimonials section of my portfolio.
              </p>
              <p style="margin: 0 0 24px 0;">
                Thank you again for being a part of this journey!
              </p>

              <!-- 4. WHAT HAPPENS NEXT CARD -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, rgba(108, 60, 255, 0.14) 0%, rgba(14, 20, 36, 0.85) 100%), #0D1322; background-color: #0E1424; border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 14px; margin: 8px 0 24px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="top" width="46" style="width: 46px; padding-right: 16px;">
                          <img src="${iconClockUrl}" width="42" height="42" alt="Clock" style="display: block; width: 42px; height: 42px;" />
                        </td>
                        <td valign="top">
                          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-bottom: 4px; line-height: 1.3;">
                            What happens next?
                          </div>
                          <div style="font-size: 13px; color: #94A3B8; line-height: 1.5;">
                            I'll review your testimonial and let you know once the review is complete. You'll receive another email with an update.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 24px 0 20px 0;"></div>

              <p style="margin: 0; font-size: 14.5px; color: #E2E8F0;">
                Thanks again for your support!
              </p>
            </td>
          </tr>

          <!-- 5. FOOTER SOCIAL LINKS -->
          <tr>
            <td class="mobile-padding" style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Portfolio link block -->
                  <td class="mobile-footer-col" valign="top" width="33%" style="padding-right: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <a href="${base}" target="_blank" style="text-decoration: none;">
                            <img src="${iconPortfolioUrl}" width="34" height="34" alt="Portfolio" style="display: block; width: 34px; height: 34px;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">Portfolio</div>
                          <div>
                            <a href="${base}" target="_blank" style="color: #38BDF8; font-size: 11px; text-decoration: none; line-height: 1.2;">${displayDomain}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- LinkedIn link block -->
                  <td class="mobile-footer-col" valign="top" width="33%" style="padding: 0 4px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <a href="https://www.linkedin.com/in/ashok-vangapandu/" target="_blank" style="text-decoration: none;">
                            <img src="${iconLinkedinUrl}" width="34" height="34" alt="LinkedIn" style="display: block; width: 34px; height: 34px;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">LinkedIn</div>
                          <div>
                            <a href="https://www.linkedin.com/in/ashok-vangapandu/" target="_blank" style="color: #38BDF8; font-size: 11px; text-decoration: none; line-height: 1.2;">linkedin.com/in/ashok-vangapandu</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- GitHub link block -->
                  <td class="mobile-footer-col" valign="top" width="34%" style="padding-left: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <a href="https://github.com/AshokVangapandu" target="_blank" style="text-decoration: none;">
                            <img src="${iconGithubUrl}" width="34" height="34" alt="GitHub" style="display: block; width: 34px; height: 34px;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">GitHub</div>
                          <div>
                            <a href="https://github.com/AshokVangapandu" target="_blank" style="color: #38BDF8; font-size: 11px; text-decoration: none; line-height: 1.2;">github.com/AshokVangapandu</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- 6. AUTOMATED FOOTER NOTE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px;">
                <tr>
                  <td align="center" style="font-size: 11px; color: #64748B; line-height: 1.6;">
                    <div>This is an automated email sent after you submitted a testimonial.</div>
                    <div style="margin-top: 2px;">Thank you for your support! ❤️</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// 1. Generate preview for "Jarvis"
const previewJarvis = renderTestimonialConfirmationEmail({
  name: 'Jarvis',
  portfolioUrl: 'https://ashokvangapandu.com',
  localAssets: true
});

fs.writeFileSync(path.resolve('scratch/preview_testimonial_email.html'), previewJarvis, 'utf-8');
console.log('Generated scratch/preview_testimonial_email.html');
