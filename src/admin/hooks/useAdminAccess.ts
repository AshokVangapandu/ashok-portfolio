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
    handleInviteSubmit
  };
};

export default useAdminAccess;
