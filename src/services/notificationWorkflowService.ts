/* src/services/notificationWorkflowService.ts */
import { supabase } from './supabase/client';
import { SiteMode } from '../admin/types/portfolioSettings';

export interface WorkflowResult {
  triggered: boolean;
  queuedCount: number;
  message?: string;
}

export interface NotificationLog {
  id: string;
  subscriberId: string | null;
  email: string;
  transitionEvent: string | null;
  status: string;
  queuedAt: string;
  sentAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

export const notificationWorkflowService = {
  async triggerRecoveryWorkflow(previousMode: SiteMode, newMode: SiteMode): Promise<WorkflowResult> {
    // Only trigger on recovery transition: maintenance -> public
    if (previousMode !== 'maintenance' || newMode !== 'public') {
      return { triggered: false, queuedCount: 0 };
    }

    try {
      // 1. Fetch pending subscribers who haven't been queued/notified yet
      const { data: pendingSubscribers, error: fetchError } = await supabase
        .from('maintenance_subscribers')
        .select('id, email')
        .eq('status', 'pending');

      if (fetchError) {
        console.error('[notificationWorkflowService] Error fetching pending subscribers:', fetchError);
        throw fetchError;
      }

      if (!pendingSubscribers || pendingSubscribers.length === 0) {
        return {
          triggered: true,
          queuedCount: 0,
          message: 'Portfolio is now live. No pending subscribers to queue.'
        };
      }

      const subscriberIds = pendingSubscribers.map((s) => s.id);

      // 2. Idempotent status update to 'queued'
      const { error: updateError } = await supabase
        .from('maintenance_subscribers')
        .update({
          status: 'queued',
          updated_at: new Date().toISOString()
        })
        .in('id', subscriberIds);

      if (updateError) {
        console.error('[notificationWorkflowService] Error updating subscriber status to queued:', updateError);
        throw updateError;
      }

      // 3. Batch insert into maintenance_notification_logs
      const logPayload = pendingSubscribers.map((sub) => ({
        subscriber_id: sub.id,
        email: sub.email,
        transition_event: 'maintenance_to_public',
        status: 'queued'
      }));

      const { error: logError } = await supabase
        .from('maintenance_notification_logs')
        .insert(logPayload);

      if (logError) {
        console.error('[notificationWorkflowService] Error logging queued notifications:', logError);
        // Do not throw; subscribers are already marked queued in database
      }

      return {
        triggered: true,
        queuedCount: pendingSubscribers.length,
        message: `Portfolio is now live. ${pendingSubscribers.length} subscriber notification(s) have been queued.`
      };
    } catch (err: any) {
      console.error('[notificationWorkflowService] Unexpected workflow error:', err);
      return {
        triggered: true,
        queuedCount: 0,
        message: 'Portfolio is now live. Workflow encountered an issue queuing subscribers.'
      };
    }
  },

  async getNotificationLogs(): Promise<NotificationLog[]> {
    const { data, error } = await supabase
      .from('maintenance_notification_logs')
      .select('*')
      .order('queued_at', { ascending: false });

    if (error) {
      console.error('[notificationWorkflowService] Error fetching logs:', error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      subscriberId: item.subscriber_id,
      email: item.email,
      transitionEvent: item.transition_event,
      status: item.status,
      queuedAt: item.queued_at,
      sentAt: item.sent_at,
      failureReason: item.failure_reason,
      createdAt: item.created_at
    }));
  }
};

export default notificationWorkflowService;
