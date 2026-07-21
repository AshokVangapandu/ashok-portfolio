/* src/services/maintenanceService.ts */
import { supabase } from './supabase/client';

export interface SubscribeResult {
  success: boolean;
  isDuplicate: boolean;
  message: string;
}

export const maintenanceService = {
  async subscribeToNotify(rawEmail: string): Promise<SubscribeResult> {
    const email = (rawEmail || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        isDuplicate: false,
        message: 'Please enter a valid email address.'
      };
    }

    try {
      // 1. Check for existing subscription
      const { data: existing, error: checkError } = await supabase
        .from('maintenance_subscribers')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.warn('[maintenanceService] Error checking existing subscriber:', checkError);
      }

      if (existing) {
        if (existing.status === 'pending' || existing.status === 'queued') {
          return {
            success: true,
            isDuplicate: true,
            message: "You're already subscribed. We'll notify you when the portfolio is live again."
          };
        } else {
          // If status was 'notified' from a previous maintenance cycle, re-arm subscriber to 'pending'
          await supabase
            .from('maintenance_subscribers')
            .update({ status: 'pending', updated_at: new Date().toISOString() })
            .eq('id', existing.id);

          return {
            success: true,
            isDuplicate: false,
            message: "Thank you! We'll notify you as soon as the portfolio is live."
          };
        }
      }

      // 2. Insert subscriber
      const { error: insertError } = await supabase
        .from('maintenance_subscribers')
        .insert({
          email,
          status: 'pending',
          source: 'maintenance_page'
        });

      if (insertError) {
        // Handle Postgres unique constraint violation
        if (insertError.code === '23505') {
          return {
            success: true,
            isDuplicate: true,
            message: "You're already subscribed. We'll notify you when the portfolio is live again."
          };
        }
        console.error('[maintenanceService] Error inserting subscriber:', insertError);
        throw insertError;
      }

      return {
        success: true,
        isDuplicate: false,
        message: "Thank you! We'll notify you as soon as the portfolio is live."
      };
    } catch (err: any) {
      console.error('[maintenanceService] Unexpected error:', err);
      return {
        success: false,
        isDuplicate: false,
        message: 'Failed to save subscription. Please try again.'
      };
    }
  },

  async checkSubscriptionStatus(rawEmail: string): Promise<{ isSubscribed: boolean; message?: string }> {
    const email = (rawEmail || '').trim().toLowerCase();
    if (!email) return { isSubscribed: false };
    try {
      const { data, error } = await supabase
        .from('maintenance_subscribers')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.warn('[maintenanceService] Error checking subscriber:', error);
        return { isSubscribed: false };
      }

      if (data && (data.status === 'pending' || data.status === 'queued')) {
        return {
          isSubscribed: true,
          message: "You're already subscribed! We'll notify you as soon as the portfolio is live again."
        };
      }
      return { isSubscribed: false };
    } catch (err) {
      console.error('[maintenanceService] Unexpected error checking status:', err);
      return { isSubscribed: false };
    }
  }
};

export default maintenanceService;
