/* src/admin/types/maintenanceSubscribers.ts */

export type SubscriberStatus = 'pending' | 'queued' | 'notified' | 'unsubscribed';

export interface MaintenanceSubscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  notifiedAt: string | null;
  source: string | null;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberStats {
  total: number;
  pending: number;
  queued: number;
  notified: number;
  todayNew: number;
}
