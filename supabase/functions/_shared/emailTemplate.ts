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
      padding: 32px 32px 20px 32px;
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
