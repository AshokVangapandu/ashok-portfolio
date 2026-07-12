/* src/admin/types/contact.ts */

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'reply_pending' | 'replied';
  avatarUrl?: string | null;
}
