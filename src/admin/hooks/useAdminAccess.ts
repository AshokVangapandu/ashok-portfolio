/* src/admin/hooks/useAdminAccess.ts */
import { useState, useEffect, useCallback } from 'react';
import { adminAccessService } from '../services/adminAccessService';
import { AdminUser, AdminAccessSummary, AdminRole, AdminStatus } from '../types/adminAccess';

export const useAdminAccess = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<AdminAccessSummary | null>(null);
  const [members, setMembers] = useState<AdminUser[]>([]);

  // Search & Filter state definitions
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<AdminRole | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<AdminStatus | 'All'>('All');

  // Modals visibility toggles
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [detailsModalUser, setDetailsModalUser] = useState<AdminUser | null>(null);

  const fetchAccessData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumData, memList] = await Promise.all([
        adminAccessService.getSummary(),
        adminAccessService.getMembers({ search, role: roleFilter, status: statusFilter })
      ]);
      setSummary(sumData);
      setMembers(memList);
    } catch (err) {
      console.error('[useAdminAccess] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchAccessData();
  }, [fetchAccessData]);

  const handleInviteSubmit = async (email: string, role: AdminRole) => {
    setLoading(true);
    try {
      await adminAccessService.inviteAdmin(email, role);
      await fetchAccessData();
      setInviteModalOpen(false);
    } catch (err) {
      console.error('[useAdminAccess] Invite submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    setLoading(true);
    try {
      await adminAccessService.deactivateAdmin(id);
      await fetchAccessData();
      if ((window as any).showToast) {
        (window as any).showToast('Administrator deactivated successfully.', 'info');
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Deactivate error:', err);
      alert(err?.message || 'Failed to deactivate administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (id: string) => {
    setLoading(true);
    try {
      await adminAccessService.reactivateAdmin(id);
      await fetchAccessData();
      if ((window as any).showToast) {
        (window as any).showToast('Administrator reactivated successfully.', 'success');
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Reactivate error:', err);
      alert(err?.message || 'Failed to reactivate administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccess = async (id: string) => {
    setLoading(true);
    try {
      await adminAccessService.removeAdmin(id);
      await fetchAccessData();
      if ((window as any).showToast) {
        (window as any).showToast('Administrator access removed successfully.', 'warning');
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Remove access error:', err);
      alert(err?.message || 'Failed to remove administrator access.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    summary,
    members,
    
    // Filters state
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,

    // Modals controls
    inviteModalOpen,
    setInviteModalOpen,
    detailsModalUser,
    setDetailsModalUser,

    // Refresh action
    refresh: fetchAccessData,
    handleInviteSubmit,
    handleDeactivate,
    handleReactivate,
    handleRemoveAccess
  };
};

export default useAdminAccess;
