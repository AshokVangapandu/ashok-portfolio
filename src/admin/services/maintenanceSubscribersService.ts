/* src/admin/services/maintenanceSubscribersService.ts */
import { supabase } from '../../services/supabase/client';
import { MaintenanceSubscriber } from '../types/maintenanceSubscribers';

export const maintenanceSubscribersService = {
  async getSubscribers(): Promise<MaintenanceSubscriber[]> {
    const { data, error } = await supabase
      .from('maintenance_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('[maintenanceSubscribersService] Error loading subscribers:', error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      email: item.email,
      status: item.status as any,
      notifiedAt: item.notified_at,
      source: item.source,
      subscribedAt: item.subscribed_at,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  async markAsNotified(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('maintenance_subscribers')
      .update({
        status: 'notified',
        notified_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('[maintenanceSubscribersService] Error updating status:', error);
      throw error;
    }

    return true;
  },

  async deleteSubscriber(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('maintenance_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[maintenanceSubscribersService] Error deleting subscriber:', error);
      throw error;
    }

    return true;
  }
};

export default maintenanceSubscribersService;
