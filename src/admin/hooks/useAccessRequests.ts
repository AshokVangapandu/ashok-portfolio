/* src/admin/hooks/useAccessRequests.ts */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { accessRequestService } from '../../services/accessRequestService';
import { AccessRequest, AccessRequestsStats, RequestStatus } from '../types/accessRequests';
import { useAuth } from '../../hooks/useAuth';

export const useAccessRequests = () => {
  const { user: currentUser } = useAuth();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accessRequestService.getRequests();
      setRequests(data);
    } catch (err: any) {
      console.error('[useAccessRequests] Fetch error:', err);
      setError(err?.message || 'Failed to load access requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        r.email.toLowerCase().includes(query) ||
        r.fullName.toLowerCase().includes(query) ||
        (r.company && r.company.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'all' || r.requestStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats: AccessRequestsStats = useMemo(() => {
    let total = requests.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    requests.forEach((r) => {
      if (r.requestStatus === 'pending') pending++;
      if (r.requestStatus === 'approved') approved++;
      if (r.requestStatus === 'rejected') rejected++;
    });

    return { total, pending, approved, rejected };
  }, [requests]);

  const approveRequest = async (
    id: string,
    options?: { role?: string; comment?: string; sendEmail?: boolean }
  ): Promise<{ success: boolean; warning?: string }> => {
    try {
      const adminEmail = currentUser?.email || 'admin';
      const result = await accessRequestService.approveRequest(id, adminEmail, options);
      
      // Update local state instantly
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                requestStatus: 'approved',
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminEmail,
                notes: options?.comment || r.notes,
                updatedAt: new Date().toISOString()
              }
            : r
        )
      );

      // Re-fetch all requests to sync counts and other lists
      await fetchRequests();
      
      return result;
    } catch (err: any) {
      console.error('[useAccessRequests] Approve error:', err);
      throw err;
    }
  };

  const rejectRequest = async (id: string, notes?: string): Promise<boolean> => {
    try {
      const adminEmail = currentUser?.email || 'admin';
      await accessRequestService.rejectRequest(id, adminEmail, notes);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                requestStatus: 'rejected',
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminEmail,
                notes: notes || r.notes,
                updatedAt: new Date().toISOString()
              }
            : r
        )
      );
      return true;
    } catch (err: any) {
      console.error('[useAccessRequests] Reject error:', err);
      throw err;
    }
  };

  return {
    requests,
    filteredRequests,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    approveRequest,
    rejectRequest,
    refresh: fetchRequests
  };
};

export default useAccessRequests;
