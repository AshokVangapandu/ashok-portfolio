/* src/services/notificationWorkflowService.ts */
import { supabase } from './supabase/client';
import { SiteMode } from '../admin/types/portfolioSettings';

export interface WorkflowResult {
  triggered: boolean;
  queuedCount: number;
  sentCount?: number;
  failedCount?: number;
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
      return { triggered: false, queuedCount: 0, sentCount: 0, failedCount: 0 };
    }

    try {
      // 1. Fetch subscribers awaiting notification (pending or already queued)
      const { data: eligibleSubscribers, error: fetchError } = await supabase
        .from('maintenance_subscribers')
        .select('id, email')
        .in('status', ['pending', 'queued']);

      if (fetchError) {
        console.error('[notificationWorkflowService] Error fetching subscribers:', fetchError);
        throw fetchError;
      }

      if (!eligibleSubscribers || eligibleSubscribers.length === 0) {
        return {
          triggered: true,
          queuedCount: 0,
          sentCount: 0,
          failedCount: 0,
          message: 'Portfolio is now live. No pending or queued subscribers to notify.'
        };
      }

      const subscriberIds = eligibleSubscribers.map((s) => s.id);

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

      // 3. Batch insert into maintenance_notification_logs for queued subscribers
      const logPayload = eligibleSubscribers.map((sub) => ({
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
        // Continue execution even if log insert fails
      }

      // 4. Dispatch emails via Edge Function with isolated error handling per subscriber
      let sentCount = 0;
      let failedCount = 0;

      for (const sub of eligibleSubscribers) {
        try {
          let isSuccess = false;
          let failureReason = '';

          // 1. Invoke Supabase Edge Function
          try {
            const { data, error } = await supabase.functions.invoke('send-maintenance-notification', {
              body: { subscriber_id: sub.id, email: sub.email }
            });
            if (!error && data?.success !== false) {
              isSuccess = true;
            } else {
              failureReason = error?.message || data?.error || 'Edge Function execution failed';
            }
          } catch (fnErr: any) {
            failureReason = fnErr?.message || 'Edge Function invocation error';
          }

          const nowIso = new Date().toISOString();

          if (isSuccess) {
            // Update subscriber status -> notified
            await supabase
              .from('maintenance_subscribers')
              .update({
                status: 'notified',
                notified_at: nowIso,
                updated_at: nowIso
              })
              .eq('id', sub.id);

            // Update log status -> sent
            await supabase
              .from('maintenance_notification_logs')
              .update({
                status: 'sent',
                sent_at: nowIso
              })
              .eq('subscriber_id', sub.id)
              .eq('status', 'queued');

            sentCount++;
          } else {
            console.error(`[notificationWorkflowService] Failed email for ${sub.email}:`, failureReason);

            // Log failure reason & preserve subscriber in queued status for future retry
            await supabase
              .from('maintenance_notification_logs')
              .update({
                status: 'failed',
                failure_reason: failureReason
              })
              .eq('subscriber_id', sub.id)
              .eq('status', 'queued');

            failedCount++;
          }
        } catch (singleErr: any) {
          const failureReason = singleErr?.message || 'Unexpected processing error';
          console.error(`[notificationWorkflowService] Isolated error for ${sub.email}:`, singleErr);

          await supabase
            .from('maintenance_notification_logs')
            .update({
              status: 'failed',
              failure_reason: failureReason
            })
            .eq('subscriber_id', sub.id)
            .eq('status', 'queued');

          failedCount++;
        }
      }

      return {
        triggered: true,
        queuedCount: eligibleSubscribers.length,
        sentCount,
        failedCount,
        message: `Portfolio is now live. ${sentCount} notification(s) sent successfully${failedCount > 0 ? `, ${failedCount} failed (${eligibleSubscribers.length - sentCount} remaining in queue).` : '.'}`
      };
    } catch (err: any) {
      console.error('[notificationWorkflowService] Unexpected workflow error:', err);
      return {
        triggered: true,
        queuedCount: 0,
        sentCount: 0,
        failedCount: 0,
        message: 'Portfolio is now live. Workflow encountered an issue processing notifications.'
      };
    }
  },

  async retryQueuedNotifications(): Promise<WorkflowResult> {
    try {
      const { data: queuedSubscribers, error: fetchError } = await supabase
        .from('maintenance_subscribers')
        .select('id, email')
        .eq('status', 'queued');

      if (fetchError || !queuedSubscribers || queuedSubscribers.length === 0) {
        return { triggered: false, queuedCount: 0, sentCount: 0, failedCount: 0, message: 'No queued subscribers awaiting retry.' };
      }

      let sentCount = 0;
      let failedCount = 0;
      let lastFailureReason = '';

      for (const sub of queuedSubscribers) {
        let isSuccess = false;
        let failureReason = '';

        try {
          const { data, error } = await supabase.functions.invoke('send-maintenance-notification', {
            body: { subscriber_id: sub.id, email: sub.email }
          });
          if (!error && data?.success !== false) {
            isSuccess = true;
          } else {
            failureReason = error?.message || data?.error || 'Edge Function execution failed';
          }
        } catch (fnErr: any) {
          failureReason = fnErr?.message || 'Edge Function invocation error';
        }



        const nowIso = new Date().toISOString();

        if (isSuccess) {
          await supabase
            .from('maintenance_subscribers')
            .update({ status: 'notified', notified_at: nowIso, updated_at: nowIso })
            .eq('id', sub.id);

          await supabase
            .from('maintenance_notification_logs')
            .update({ status: 'sent', sent_at: nowIso })
            .eq('subscriber_id', sub.id)
            .eq('status', 'queued');

          sentCount++;
        } else {
          lastFailureReason = failureReason;
          await supabase
            .from('maintenance_notification_logs')
            .update({ status: 'failed', failure_reason: failureReason })
            .eq('subscriber_id', sub.id)
            .eq('status', 'queued');

          failedCount++;
        }
      }

      return {
        triggered: true,
        queuedCount: queuedSubscribers.length,
        sentCount,
        failedCount,
        message: `Retry process complete: ${sentCount} email(s) sent successfully${failedCount > 0 ? `, ${failedCount} failed (${lastFailureReason || 'check Supabase/Brevo settings'}).` : '.'}`
      };
    } catch (err: any) {
      console.error('[notificationWorkflowService] Retry error:', err);
      return { triggered: false, queuedCount: 0, sentCount: 0, failedCount: 0, message: err?.message || 'Retry failed.' };
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
