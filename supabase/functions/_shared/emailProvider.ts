/* supabase/functions/_shared/emailProvider.ts */

/**
 * Utility to parse legacy "Name <email@domain.com>" string format into clean components.
 */
function parseEmailString(str: string): { name?: string; email: string } {
  const trimmed = (str || '').trim();
  const match = trimmed.match(/^(?:"?([^"]*)"?\s)?<([^>]+)>$/);
  if (match) {
    return {
      name: match[1]?.trim() || undefined,
      email: match[2].trim()
    };
  }
  return { email: trimmed };
}

/**
 * Interface representing an email recipient.
 */
export interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Interface representing an email sender.
 */
export interface EmailSender {
  email: string;
  name?: string;
}

/**
 * Unified email sending options passed to sendEmail().
 */
export interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  text?: string;
  from?: EmailSender;
  replyTo?: EmailRecipient;
}

/**
 * Standardized result returned by sendEmail().
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode?: number;
  rawResponse?: any;
}

/**
 * Abstract Interface for Email Providers (Brevo, SendGrid, AWS SES, Mailgun, etc.)
 */
export interface IEmailProvider {
  name: string;
  send(options: SendEmailOptions): Promise<SendEmailResult>;
}

/**
 * Brevo (formerly Sendinblue) Transactional Email Provider.
 * Uses Brevo v3 SMTP API (POST https://api.brevo.com/v3/smtp/email).
 */
export class BrevoEmailProvider implements IEmailProvider {
  readonly name = 'Brevo';

  private apiKey: string;
  private defaultSender: EmailSender;
  private endpoint = 'https://api.brevo.com/v3/smtp/email';
  private timeoutMs = 15000;

  constructor() {
    // Read Brevo config from Deno/environment variables with sensible defaults/fallbacks
    const envApiKey = 
      (typeof Deno !== 'undefined' ? Deno.env.get('BREVO_API_KEY') : null) ||
      (typeof process !== 'undefined' ? process.env?.BREVO_API_KEY : null) ||
      '';

    const rawName = 
      (typeof Deno !== 'undefined' ? Deno.env.get('BREVO_SENDER_NAME') || Deno.env.get('NOTIFICATION_EMAIL_FROM') : null) ||
      'Ashok Portfolio';

    const rawEmail = 
      (typeof Deno !== 'undefined' ? Deno.env.get('BREVO_SENDER_EMAIL') : null) ||
      'noreply@ashokvangapandu.com';

    const parsedSender = parseEmailString(rawName.includes('<') ? rawName : `${rawName} <${rawEmail}>`);

    this.apiKey = envApiKey.trim();
    this.defaultSender = {
      name: parsedSender.name || 'Ashok Portfolio',
      email: parsedSender.email || 'noreply@ashokvangapandu.com'
    };
  }

  /**
   * Formats recipients array for Brevo API JSON schema.
   */
  private formatRecipients(recipients: EmailRecipient | EmailRecipient[]): Array<{ email: string; name?: string }> {
    const list = Array.isArray(recipients) ? recipients : [recipients];
    return list.map(r => {
      const parsed = parseEmailString(r.email);
      return {
        email: parsed.email,
        name: r.name || parsed.name
      };
    });
  }

  /**
   * Sends transactional email using Brevo REST API.
   */
  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    console.log(`[emailProvider:${this.name}] Preparing email: "${options.subject}"`);

    if (!this.apiKey) {
      const errMsg = `[emailProvider:${this.name}] Missing API Key. Please set BREVO_API_KEY environment secret.`;
      console.error(errMsg);
      return {
        success: false,
        error: 'Email provider configuration missing (BREVO_API_KEY missing).'
      };
    }

    // Format sender object
    let sender = this.defaultSender;
    if (options.from) {
      const parsedFrom = parseEmailString(options.from.email.includes('<') ? options.from.email : `${options.from.name || ''} <${options.from.email}>`);
      sender = {
        name: options.from.name || parsedFrom.name || this.defaultSender.name,
        email: parsedFrom.email || this.defaultSender.email
      };
    }

    // Format recipients array
    const to = this.formatRecipients(options.to);
    if (!to || to.length === 0) {
      return {
        success: false,
        error: 'Missing recipient email address.'
      };
    }

    // Construct Brevo v3 SMTP API Payload
    const payload: any = {
      sender,
      to,
      subject: options.subject,
      htmlContent: options.html,
      ...(options.text ? { textContent: options.text } : {}),
      ...(options.replyTo ? { replyTo: { email: options.replyTo.email, ...(options.replyTo.name ? { name: options.replyTo.name } : {}) } } : {})
    };

    try {
      console.log(`[emailProvider:${this.name}] Dispatching POST ${this.endpoint} to ${to.map(t => t.email).join(', ')}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      let res: Response;
      try {
        res = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const rawText = await res.text().catch(() => '');
      const responseBody = rawText ? (() => {
        try {
          return JSON.parse(rawText);
        } catch (_) {
          return { raw: rawText };
        }
      })() : {};

      if (!res.ok) {
        const errorDetail = responseBody?.message || responseBody?.code || `HTTP Status ${res.status}`;
        console.error(`[emailProvider:${this.name}] Request failed [${res.status}]:`, responseBody);
        return {
          success: false,
          statusCode: res.status,
          error: `Brevo API Error: ${errorDetail}`,
          rawResponse: responseBody
        };
      }

      const messageId = responseBody?.messageId || responseBody?.id;
      if (!messageId) {
        console.warn(`[emailProvider:${this.name}] Provider returned success without a message ID.`, responseBody);
      } else {
        console.log(`[emailProvider:${this.name}] Email accepted by provider. Message ID:`, messageId);
      }

      return {
        success: true,
        messageId,
        statusCode: res.status,
        rawResponse: responseBody
      };
    } catch (err: any) {
      console.error(`[emailProvider:${this.name}] Unexpected fetch error:`, err);
      return {
        success: false,
        error: err?.name === 'AbortError'
          ? `Email provider request timed out after ${this.timeoutMs}ms.`
          : err?.message || 'Unexpected network error during email dispatch.'
      };
    }
  }
}

// Instantiate default provider instance
const activeProvider: IEmailProvider = new BrevoEmailProvider();

/**
 * Public, provider-agnostic function used by Edge Functions to dispatch emails.
 * Edge Functions do NOT need to know endpoints, headers, or vendor-specific payloads.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  return activeProvider.send(options);
}
