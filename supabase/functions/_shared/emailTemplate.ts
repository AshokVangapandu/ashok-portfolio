/* supabase/functions/_shared/emailTemplate.ts */

export interface EmailLayoutOptions {
  badge?: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  portfolioUrl?: string;
}

export interface TestimonialConfirmationEmailOptions {
  name?: string;
  portfolioUrl?: string;
}

export interface TestimonialApprovedEmailOptions {
  name?: string;
  testimonial?: string;
  testimonialUrl?: string;
  portfolioUrl?: string;
}

export interface ContactConfirmationEmailOptions {
  name?: string;
  portfolioUrl?: string;
}

// Canonical Public CDN Base URL for Email Assets
const EMAIL_ASSETS_BASE = 
  (typeof Deno !== 'undefined' ? Deno.env.get('EMAIL_ASSETS_BASE_URL') : null) ||
  'https://xpuhbtsgwhgbcvmwzlyd.supabase.co/storage/v1/object/public/email-assets';

export const EMAIL_IMAGE_URLS = {
  logo: `${EMAIL_ASSETS_BASE}/av-logo.png`,
  testimonialReceived: `${EMAIL_ASSETS_BASE}/testimonial-received.png`,
  testimonialApproved: `${EMAIL_ASSETS_BASE}/testimonial-approved-card.png?v=3`,
  contactReceived: `${EMAIL_ASSETS_BASE}/contact-message-received.png`,
  nextStep: `${EMAIL_ASSETS_BASE}/email-next-step.png`,
  view: `${EMAIL_ASSETS_BASE}/email-icon-view.png`,
  check: `${EMAIL_ASSETS_BASE}/email-check.png`,
  portfolio: `${EMAIL_ASSETS_BASE}/portfolio-icon.png`,
  linkedin: `${EMAIL_ASSETS_BASE}/linkedin-icon.png`,
  github: `${EMAIL_ASSETS_BASE}/github-icon.png`,
};

/**
 * Generates the premium Testimonial Submission Confirmation HTML Email matching Reference 2.
 */
export function renderTestimonialConfirmationEmail(options: TestimonialConfirmationEmailOptions): string {
  const {
    name = 'there',
    portfolioUrl = 'https://ashokvangapandu.com'
  } = options;

  const base = portfolioUrl.replace(/\/+$/, '');
  const displayDomain = base.replace(/^https?:\/\/(www\.)?/, '');
  const displayName = (name || 'there').trim();
  const utmQuery = '?utm_source=email&utm_medium=recruiter';
  const portfolioLink = `${base}/${utmQuery}`;
  const projectsLink = `${base}/${utmQuery}#projects`;
  const blogLink = `${base}/${utmQuery}#writing`;

  const logoUrl = EMAIL_IMAGE_URLS.logo;
  const illustrationUrl = EMAIL_IMAGE_URLS.testimonialReceived;
  const iconCheckUrl = EMAIL_IMAGE_URLS.check;
  const iconClockUrl = EMAIL_IMAGE_URLS.nextStep;
  const iconPortfolioUrl = EMAIL_IMAGE_URLS.portfolio;
  const iconLinkedinUrl = EMAIL_IMAGE_URLS.linkedin;
  const iconGithubUrl = EMAIL_IMAGE_URLS.github;

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
    body, table, td, p, a, li {
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
  <!-- Anti-collapse Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; opacity: 0; color: #070B14; mso-hide: all;">
    Thank you for sharing your experience on Ashok Vangapandu's portfolio.&#847;&zwnj;&nbsp;&#8199;
  </div>
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
                          <a href="${portfolioLink}" target="_blank" style="text-decoration: none; display: block;">
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
                    <a href="${portfolioLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">PORTFOLIO</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${projectsLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">PROJECTS</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${blogLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">BLOG</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. STATUS BADGE & HERO SECTION -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 32px 24px 32px;">
              
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

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-hero-col" valign="middle" align="left" style="padding-right: 16px;">
                    <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; color: #FFFFFF; line-height: 1.15; letter-spacing: -0.02em;">
                      Thank you for<br />
                      <span style="color: #38BDF8;">your kind words</span> ❤️
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
                  <td class="mobile-footer-col" valign="top" width="33%" style="padding-right: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <a href="${portfolioLink}" target="_blank" style="text-decoration: none;">
                            <img src="${iconPortfolioUrl}" width="34" height="34" alt="Portfolio" style="display: block; width: 34px; height: 34px;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">Portfolio</div>
                          <div>
                            <a href="${portfolioLink}" target="_blank" style="color: #38BDF8; font-size: 11px; text-decoration: none; line-height: 1.2;">${displayDomain}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>

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

/**
 * Generates the premium Testimonial Approved HTML Email matching Reference 1 & 2.
 */
export function renderTestimonialApprovedEmail(options: TestimonialApprovedEmailOptions): string {
  const {
    name = 'there',
    portfolioUrl = 'https://ashokvangapandu.com',
    testimonialUrl
  } = options;

  const base = portfolioUrl.replace(/\/+$/, '');
  const displayDomain = base.replace(/^https?:\/\/(www\.)?/, '');
  const displayName = (name || 'there').trim();
  const utmQuery = '?utm_source=email&utm_medium=recruiter';
  const portfolioLink = `${base}/${utmQuery}`;
  const projectsLink = `${base}/${utmQuery}#projects`;
  const blogLink = `${base}/${utmQuery}#writing`;
  const targetTestimonialUrl = testimonialUrl || `${base}/${utmQuery}#testimonials`;

  const logoUrl = EMAIL_IMAGE_URLS.logo;
  const illustrationUrl = EMAIL_IMAGE_URLS.testimonialApproved;
  const iconCheckUrl = EMAIL_IMAGE_URLS.check;
  const iconPortfolioUrl = EMAIL_IMAGE_URLS.portfolio;
  const iconLinkedinUrl = EMAIL_IMAGE_URLS.linkedin;
  const iconGithubUrl = EMAIL_IMAGE_URLS.github;

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Your testimonial is now live 🎉</title>
  <style type="text/css">
    body, table, td, p, a, li {
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
        width: 180px !important;
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
  <!-- Anti-collapse Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; opacity: 0; color: #070B14; mso-hide: all;">
    Your testimonial has been approved and is now live on Ashok Vangapandu's portfolio.&#847;&zwnj;&nbsp;&#8199;
  </div>
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
                          <a href="${portfolioLink}" target="_blank" style="text-decoration: none; display: block;">
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
                    <a href="${portfolioLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">PORTFOLIO</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${projectsLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">PROJECTS</a>
                    <span style="color: rgba(255, 255, 255, 0.2); padding: 0 8px;">|</span>
                    <a href="${blogLink}" target="_blank" style="color: #94A3B8; text-decoration: none;">BLOG</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. STATUS BADGE & HERO SECTION -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 32px 24px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 9999px; padding: 5px 14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 6px;">
                          <img src="${iconCheckUrl}" width="14" height="14" alt="Check" style="display: block; width: 14px; height: 14px;" />
                        </td>
                        <td valign="middle" style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #34D399; text-transform: uppercase; line-height: 1;">
                          TESTIMONIAL APPROVED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-hero-col" valign="middle" align="left" style="padding-right: 16px;">
                    <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; color: #FFFFFF; line-height: 1.15; letter-spacing: -0.02em;">
                      Your testimonial<br />
                      <span style="color: #38BDF8;">is now live</span> 🎉
                    </h1>
                    <p style="margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.55; max-width: 320px;">
                      Thank you once again for sharing<br />your experience. It means a lot to me.
                    </p>
                  </td>

                  <td class="mobile-hero-img-col" valign="middle" align="right" width="190" style="width: 190px;">
                    <img src="${illustrationUrl}" class="mobile-hero-img" width="180" height="150" alt="Testimonial approved illustration" style="display: block; width: 180px; height: auto; border: 0;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. PERSONALIZED BODY CONTENT -->
          <tr>
            <td class="mobile-padding" style="padding: 0 32px 28px 32px; font-size: 14.5px; color: #CBD5E1; line-height: 1.65;">
              <p style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                Hi ${displayName},
              </p>
              <p style="margin: 0 0 14px 0;">
                I’m happy to let you know that your testimonial has been reviewed and is now featured on my portfolio.
              </p>
              <p style="margin: 0 0 14px 0;">
                Your kind words truly mean a lot to me, and I’m grateful that you took the time to share your experience.
              </p>
              <p style="margin: 0 0 22px 0;">
                If you’d like to see how your testimonial appears, you can view it on my portfolio.
              </p>

              <!-- 4. VIEW ON PORTFOLIO CTA BUTTON -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="left">
                    <a href="${targetTestimonialUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; background: linear-gradient(135deg, #6C3CFF 0%, #38BDF8 100%); background-color: #6C3CFF; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 14px rgba(108, 60, 255, 0.35);">
                      View on Portfolio &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 5. QUOTE SECTION -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0 24px 0;">
                <tr>
                  <td align="center">
                    <div style="font-size: 26px; color: #818CF8; line-height: 1; margin-bottom: 8px;">❝</div>
                    <div style="font-size: 14px; font-style: italic; color: #E2E8F0; line-height: 1.5; margin-bottom: 8px;">
                      "Your feedback helps me keep learning and creating."
                    </div>
                    <div style="font-size: 9.5px; font-weight: 700; color: #64748B; letter-spacing: 1.4px; text-transform: uppercase;">
                      — THANK YOU FOR BEING A PART OF THIS JOURNEY —
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 24px 0 20px 0;"></div>
            </td>
          </tr>

          <!-- 6. FOOTER SOCIAL LINKS -->
          <tr>
            <td class="mobile-padding" style="padding: 0 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-footer-col" valign="top" width="33%" style="padding-right: 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 10px;">
                          <a href="${portfolioLink}" target="_blank" style="text-decoration: none;">
                            <img src="${iconPortfolioUrl}" width="34" height="34" alt="Portfolio" style="display: block; width: 34px; height: 34px;" />
                          </a>
                        </td>
                        <td valign="middle">
                          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">Portfolio</div>
                          <div>
                            <a href="${portfolioLink}" target="_blank" style="color: #38BDF8; font-size: 11px; text-decoration: none; line-height: 1.2;">${displayDomain}</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>

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

              <!-- 7. AUTOMATED FOOTER NOTE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px;">
                <tr>
                  <td align="center" style="font-size: 11px; color: #64748B; line-height: 1.6;">
                    <div>This is an automated email sent after your testimonial was approved.</div>
                    <div style="margin-top: 2px;">Thank you for your support! 💙</div>
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

/**
 * Generates a unified, high-aesthetic HTML email string matching the portfolio branding.
 */
export function renderPortfolioEmail(options: EmailLayoutOptions): string {
  const {
    badge = 'PORTFOLIO UPDATE',
    title,
    subtitle,
    contentHtml,
    ctaText,
    ctaUrl,
    footerNote = 'Sent automatically from Ashok Vangapandu\'s Portfolio.',
    portfolioUrl = 'https://ashokvangapandu.com'
  } = options;

  const displayDomain = portfolioUrl.replace(/^https?:\/\/(www\.)?/, '');
  const logoUrl = EMAIL_IMAGE_URLS.logo;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #090d16;
      padding: 36px 16px;
      box-sizing: border-box;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: radial-gradient(circle at top right, rgba(108, 60, 255, 0.12), transparent 50%), #0d111c;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      overflow: hidden;
    }
    .header {
      padding: 28px 32px 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(108, 60, 255, 0.15);
      border: 1px solid rgba(108, 60, 255, 0.3);
      border-radius: 9999px;
      color: #a78bfa;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0;
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .body-content {
      padding: 28px 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
    }
    .cta-container {
      margin-top: 28px;
      margin-bottom: 8px;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6C3CFF 0%, #8F85FF 100%);
      color: #ffffff !important;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(108, 60, 255, 0.35);
      transition: all 0.2s ease;
    }
    .footer {
      padding: 20px 32px 28px 32px;
      background-color: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer a {
      color: #818cf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
          <tr>
            <td valign="middle" style="padding-right: 10px;">
              <img src="${logoUrl}" width="32" height="28" alt="AV Logo" style="display: block; width: 32px; height: 28px;" />
            </td>
            <td valign="middle" style="font-size: 15px; font-weight: 700; color: #FFFFFF;">
              Ashok Vangapandu
            </td>
          </tr>
        </table>
        ${badge ? `<div class="badge">${badge}</div>` : ''}
        <h1 class="title">${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
      </div>
      <div class="body-content">
        ${contentHtml}
        ${ctaText && ctaUrl ? `
          <div class="cta-container">
            <a href="${ctaUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">${ctaText} &rarr;</a>
          </div>
        ` : ''}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0;">${footerNote}</p>
        <p style="margin: 0;">
          <a href="${portfolioUrl}" target="_blank" rel="noopener noreferrer">${displayDomain}</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates the premium Contact Form Confirmation HTML Email matching Reference 1.
 */
export function renderContactConfirmationEmail(options: ContactConfirmationEmailOptions): string {
  const {
    name = 'there',
    portfolioUrl = 'https://ashokvangapandu.com'
  } = options;

  const base = portfolioUrl.replace(/\/+$/, '');
  const displayDomain = base.replace(/^https?:\/\/(www\.)?/, '');
  const displayName = (name || 'there').trim();
  const utmQuery = '?utm_source=email&utm_medium=recruiter';
  const portfolioLink = `${base}/${utmQuery}`;
  const linkedinLink = 'https://www.linkedin.com/in/ashok-vangapandu/';
  const githubLink = 'https://github.com/AshokVangapandu';

  const logoUrl = EMAIL_IMAGE_URLS.logo;
  const heroIllustrationUrl = EMAIL_IMAGE_URLS.contactReceived;
  const iconCheckUrl = EMAIL_IMAGE_URLS.check;
  const iconPortfolioUrl = EMAIL_IMAGE_URLS.portfolio;
  const iconLinkedinUrl = EMAIL_IMAGE_URLS.linkedin;
  const iconGithubUrl = EMAIL_IMAGE_URLS.github;

  const uniqueNonce = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Thanks for reaching out! 💙</title>
  <style type="text/css">
    body, table, td, p, a, li {
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
        width: 170px !important;
        height: auto !important;
      }
      .mobile-footer-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 12px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Anti-collapse Preheader -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; opacity: 0; color: #070B14; mso-hide: all;">
    Thank you for reaching out! I've received your message and will get back to you soon.&#847;&zwnj;&nbsp;&#8199;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #070B14; margin: 0; padding: 36px 12px;">
    <tr>
      <td align="center" valign="top">
        
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #0B0F19 radial-gradient(circle at top right, rgba(56, 189, 248, 0.12) 0%, transparent 60%); background-color: #0B0F19; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
          
          <!-- 1. HEADER SECTION (No top navigation) -->
          <tr>
            <td class="mobile-padding" style="padding: 28px 32px 24px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 12px;">
                          <a href="${portfolioLink}" target="_blank" style="text-decoration: none; display: block;">
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
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. STATUS BADGE & HERO SECTION -->
          <tr>
            <td class="mobile-padding" style="padding: 32px 32px 24px 32px;">
              
              <!-- Badge: MESSAGE RECEIVED -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px;">
                <tr>
                  <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 9999px; padding: 5px 14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle" style="padding-right: 6px;">
                          <img src="${iconCheckUrl}" width="14" height="14" alt="Check" style="display: block; width: 14px; height: 14px;" />
                        </td>
                        <td valign="middle" style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #34D399; text-transform: uppercase; line-height: 1;">
                          MESSAGE RECEIVED
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Hero Content: Text on Left, 3D Mail on Right -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-hero-col" valign="middle" align="left" style="padding-right: 16px;">
                    <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 800; color: #FFFFFF; line-height: 1.15; letter-spacing: -0.02em;">
                      Thank you for<br />
                      <span style="color: #38BDF8;">reaching out!</span>
                    </h1>
                    <p style="margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.55; max-width: 320px;">
                      I’ve received your message and really appreciate you taking the time to get in touch.
                    </p>
                  </td>

                  <td class="mobile-hero-img-col" valign="middle" align="right" width="190" style="width: 190px;">
                    <img src="${heroIllustrationUrl}" class="mobile-hero-img" width="180" height="155" alt="Message received illustration" style="display: block; width: 180px; height: auto; border: 0;" />
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
                Thank you for reaching out through my portfolio. I’ve received your message and will get back to you as soon as possible.
              </p>
              <p style="margin: 0 0 14px 0;">
                I usually respond within 24–48 hours. If your message is urgent, feel free to connect with me on <a href="${linkedinLink}" target="_blank" style="color: #38BDF8; text-decoration: none; font-weight: 600;">LinkedIn</a>.
              </p>
              <p style="margin: 0 0 14px 0;">
                In the meantime, feel free to explore my work through the links below.
              </p>
              <p style="margin: 0 0 10px 0;">
                Thanks again for your interest! 💙
              </p>

              <!-- Divider -->
              <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 24px 0 20px 0;"></div>

              <!-- 4. SOCIAL / EXPLORE CARDS (Portfolio, LinkedIn, GitHub) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Card 1: Portfolio -->
                  <td class="mobile-footer-col" valign="top" style="padding-right: 6px; width: 33.33%;">
                    <a href="${portfolioLink}" target="_blank" style="display: block; text-decoration: none; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 10px; box-sizing: border-box;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="26" valign="middle" style="padding-right: 8px;">
                            <img src="${iconPortfolioUrl}" width="24" height="24" alt="Portfolio" style="display: block; width: 24px; height: 24px;" />
                          </td>
                          <td valign="middle">
                            <div style="font-size: 11px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">Portfolio</div>
                            <div style="font-size: 9px; color: #38BDF8; line-height: 1.2; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 105px;">${displayDomain}</div>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>

                  <!-- Card 2: LinkedIn -->
                  <td class="mobile-footer-col" valign="top" style="padding: 0 3px; width: 33.33%;">
                    <a href="${linkedinLink}" target="_blank" style="display: block; text-decoration: none; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 10px; box-sizing: border-box;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="26" valign="middle" style="padding-right: 8px;">
                            <img src="${iconLinkedinUrl}" width="24" height="24" alt="LinkedIn" style="display: block; width: 24px; height: 24px;" />
                          </td>
                          <td valign="middle">
                            <div style="font-size: 11px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">LinkedIn</div>
                            <div style="font-size: 9px; color: #38BDF8; line-height: 1.2; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 105px;">ashok-vangapandu</div>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>

                  <!-- Card 3: GitHub -->
                  <td class="mobile-footer-col" valign="top" style="padding-left: 6px; width: 33.33%;">
                    <a href="${githubLink}" target="_blank" style="display: block; text-decoration: none; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 10px; box-sizing: border-box;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="26" valign="middle" style="padding-right: 8px;">
                            <img src="${iconGithubUrl}" width="24" height="24" alt="GitHub" style="display: block; width: 24px; height: 24px;" />
                          </td>
                          <td valign="middle">
                            <div style="font-size: 11px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">GitHub</div>
                            <div style="font-size: 9px; color: #38BDF8; line-height: 1.2; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 105px;">AshokVangapandu</div>
                          </td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 5. FOOTER SUBTEXT NOTE -->
          <tr>
            <td class="mobile-padding" align="center" style="padding: 0 32px 28px 32px; font-size: 11.5px; color: #64748B; line-height: 1.6; text-align: center;">
              This is an automated email sent after you submitted a message through my portfolio.<br />
              Thank you for your interest! 💙
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  <!-- Invisible Anti-Collapse Nonce -->
  <span style="display:none !important; font-size:0; line-height:0; opacity:0; mso-hide:all;">[msg-token:${uniqueNonce}]</span>
</body>
</html>
  `.trim();
}

/**
 * Plain-text fallback for Contact Form Confirmation.
 */
export function renderContactConfirmationText(options: ContactConfirmationEmailOptions): string {
  const displayName = (options.name || 'there').trim();
  const portfolioUrl = options.portfolioUrl || 'https://ashokvangapandu.com';
  const base = portfolioUrl.replace(/\/+$/, '');
  const utmQuery = '?utm_source=email&utm_medium=recruiter';

  return `
Ashok Vangapandu
TURNING IDEAS INTO IMPACT

MESSAGE RECEIVED

Thank you for reaching out!
I’ve received your message and really appreciate you taking the time to get in touch.

Hi ${displayName},

Thank you for reaching out through my portfolio. I’ve received your message and will get back to you as soon as possible.

I usually respond within 24–48 hours. If your message is urgent, feel free to connect with me on LinkedIn:
https://www.linkedin.com/in/ashok-vangapandu/

In the meantime, feel free to explore my work through the links below:

Portfolio: ${base}/${utmQuery}
LinkedIn: https://www.linkedin.com/in/ashok-vangapandu/
GitHub: https://github.com/AshokVangapandu

Thanks again for your interest! 💙

This is an automated email sent after you submitted a message through my portfolio.
`.trim();
}


