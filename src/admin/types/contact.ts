/* src/admin/types/contact.ts */

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  phoneNumber?: string | null;
  subject: string;
  message: string;
  date: string;
  status: 'open' | 'reply_pending' | 'replied' | 'REPLIED' | 'New' | string;
  avatarUrl?: string | null;
  updatedAt?: string;
  isRead?: boolean;
  repliedAt?: string | null;
}
