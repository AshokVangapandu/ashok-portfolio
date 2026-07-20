/* src/admin/hooks/useMaintenanceSubscribers.ts */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { maintenanceSubscribersService } from '../services/maintenanceSubscribersService';
import { MaintenanceSubscriber, SubscriberStats, SubscriberStatus } from '../types/maintenanceSubscribers';

export const useMaintenanceSubscribers = () => {
  const [subscribers, setSubscribers] = useState<MaintenanceSubscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriberStatus>('all');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceSubscribersService.getSubscribers();
      setSubscribers(data);
    } catch (err: any) {
      console.error('[useMaintenanceSubscribers] Fetch error:', err);
      setError(err?.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((item) => {
      const matchesSearch = item.email.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, statusFilter]);

  const stats: SubscriberStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let total = subscribers.length;
    let pending = 0;
    let queued = 0;
    let notified = 0;
    let todayNew = 0;

    subscribers.forEach((item) => {
      if (item.status === 'pending') pending++;
      if (item.status === 'queued') queued++;
      if (item.status === 'notified') notified++;
      if (item.subscribedAt && item.subscribedAt.startsWith(todayStr)) todayNew++;
    });

    return { total, pending, queued, notified, todayNew };
  }, [subscribers]);

  const markAsNotified = async (id: string): Promise<boolean> => {
    try {
      await maintenanceSubscribersService.markAsNotified(id);
      setSubscribers((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'notified', notifiedAt: new Date().toISOString() }
            : item
        )
      );
      return true;
    } catch (err) {
      console.error('[useMaintenanceSubscribers] Error marking as notified:', err);
      return false;
    }
  };

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    try {
      await maintenanceSubscribersService.deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error('[useMaintenanceSubscribers] Error deleting subscriber:', err);
      return false;
    }
  };

  return {
    subscribers,
    filteredSubscribers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    markAsNotified,
    deleteSubscriber,
    refresh: fetchSubscribers
  };
};

export default useMaintenanceSubscribers;
