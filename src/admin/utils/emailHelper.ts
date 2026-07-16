/* src/admin/utils/emailHelper.ts */

export interface EmailComposeOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Generates the compose window URL for the configured email provider.
 * Easily modifiable in one place to swap providers (e.g. Outlook, Mailto link, custom server).
 */
export function getEmailComposeUrl(options: EmailComposeOptions): string {
  const { to, subject, body } = options;
  
  // Google Gmail Compose URL with parameters
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
