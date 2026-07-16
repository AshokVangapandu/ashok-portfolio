/* src/admin/services/contactService.ts */
import { ContactSubmission } from '../types/contact';
import { supabase } from '../../services/supabase/client';

export const contactService = {
  /**
   * Fetches contact submissions from Supabase supporting search, filter, sorting, and pagination.
   */
  async getSubmissions(options?: {
    search?: string;
    status?: string;
    sortBy?: 'newest' | 'oldest';
    page?: number;
    pageSize?: number;
  }): Promise<{ data: ContactSubmission[]; count: number }> {
    try {
      const search = options?.search || '';
      const status = options?.status || 'all';
      const sortBy = options?.sortBy || 'newest';
      const page = options?.page || 1;
      const pageSize = options?.pageSize || 8;

      let query = (supabase as any)
        .from('contact_messages')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (status !== 'all') {
        if (status === 'open') {
          // Open messages are 'New' or 'open'
          query = query.or('status.eq.New,status.eq.open,status.is.null');
        } else if (status === 'replied') {
          query = query.or('status.eq.replied,status.eq.REPLIED');
        } else if (status === 'archived') {
          query = query.or('status.eq.archived,status.eq.ARCHIVED');
        } else {
          query = query.eq('status', status);
        }
      }

      // Apply search query
      if (search.trim()) {
        const queryStr = `%${search.trim()}%`;
        query = query.or(`full_name.ilike.${queryStr},email.ilike.${queryStr},company.ilike.${queryStr},subject.ilike.${queryStr}`);
      }

      // Apply sorting
      if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else {
        // Default: newest first
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination only if page and pageSize are explicitly provided
      if (options?.page && options?.pageSize) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data, count, error } = await query;

      if (error) {
        throw error;
      }

      const submissions = (data || []).map((msg: any): ContactSubmission => {
        // Format Date beautifully
        let formattedDate = 'N/A';
        if (msg.created_at) {
          const dateObj = new Date(msg.created_at);
          formattedDate = dateObj.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
        }

        const msgStatus = msg.status || 'open';

        return {
          id: msg.id,
          name: msg.full_name,
          email: msg.email,
          company: msg.company || '',
          phoneNumber: msg.phone_number || null,
          subject: msg.subject,
          message: msg.message,
          date: formattedDate,
          status: msgStatus,
          avatarUrl: null,
          updatedAt: formattedDate, // Default to formattedDate/created_at
          isRead: msg.is_read || false,
          repliedAt: msg.replied_at || null
        };
      });

      return {
        data: submissions,
        count: count || 0
      };
    } catch (err: any) {
      console.error('[contactService] Error fetching contact submissions:', err);
      throw new Error(err?.message || 'Failed to fetch contact submissions from database.');
    }
  },

  /**
   * Fetches a single contact submission by ID from Supabase.
   */
  async getContactById(id: string): Promise<ContactSubmission | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) return null;

      // Format Date beautifully
      let formattedDate = 'N/A';
      if (data.created_at) {
        const dateObj = new Date(data.created_at);
        formattedDate = dateObj.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }

      const status = data.status || 'open';

      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        company: data.company || '',
        phoneNumber: data.phone_number || null,
        subject: data.subject,
        message: data.message,
        date: formattedDate,
        status,
        avatarUrl: null,
        updatedAt: formattedDate,
        isRead: data.is_read || false,
        repliedAt: data.replied_at || null
      };
    } catch (err: any) {
      console.error('[contactService] Error fetching contact by ID:', err);
      throw new Error(err?.message || 'Failed to fetch contact details from database.');
    }
  },

  /**
   * Marks a contact as Replied in the database.
   */
  async replyToContact(id: string): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const { error } = await (supabase as any)
        .from('contact_messages')
        .update({
          status: 'REPLIED',
          is_read: true,
          replied_at: now,
          updated_at: now
        })
        .eq('id', id);

      if (error) {
        throw error;
      }
      return true;
    } catch (err: any) {
      console.error('[contactService] Error updating reply status:', err);
      throw new Error(err?.message || 'Failed to update contact status in database.');
    }
  },

  /**
   * Archives a contact message in the database.
   */
  async archiveContact(id: string): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const { error } = await (supabase as any)
        .from('contact_messages')
        .update({
          status: 'ARCHIVED',
          updated_at: now
        })
        .eq('id', id);

      if (error) {
        throw error;
      }
      return true;
    } catch (err: any) {
      console.error('[contactService] Error archiving contact:', err);
      throw new Error(err?.message || 'Failed to archive contact in database.');
    }
  }
};

export default contactService;
