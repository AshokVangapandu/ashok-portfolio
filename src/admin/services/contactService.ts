/* src/admin/services/contactService.ts */
import { ContactSubmission } from '../types/contact';
import { mockContactSubmissions } from './contactSubmissions.mock';

export const contactService = {
  /**
   * Fetches all contact submissions.
   * Currently retrieves mock data, but structure can be easily swapped for Supabase.
   */
  async getSubmissions(): Promise<ContactSubmission[]> {
    // Simulating a network delay so loading states can be tested
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockContactSubmissions]);
      }, 200);
    });
  }
};

export default contactService;
