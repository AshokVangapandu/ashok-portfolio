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
        return {
          success: true,
          isDuplicate: true,
          message: "You're already subscribed. We'll notify you when the portfolio is live again."
        };
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
  }
};

export default maintenanceService;
