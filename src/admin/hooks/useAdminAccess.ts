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
    console.log('[useAdminAccess] handleInviteSubmit started. Email:', email, 'Role:', role);
    setLoading(true);
    try {
      console.log('[useAdminAccess] Invoking adminAccessService.inviteAdmin...');
      const result = await adminAccessService.inviteAdmin(email, role);
      console.log('[useAdminAccess] adminAccessService.inviteAdmin completed. Result:', result);
      
      console.log('[useAdminAccess] Refreshing access control list...');
      await fetchAccessData();
      setInviteModalOpen(false);
      
      if (result.emailSent) {
        console.log('[useAdminAccess] Email sent successfully. Showing success toast...');
        if ((window as any).showToast) {
          const title = result.isReinvite ? 'Invitation Re-sent' : 'Invitation Sent';
          const msg = result.isReinvite
            ? `Invitation has been re-sent successfully to ${email}.`
            : `Welcome email has been sent successfully to ${email}.`;
          (window as any).showToast('success', title, msg, 5000);
        }
      } else {
        console.warn('[useAdminAccess] Email dispatch warning. Showing warning toast...');
        if ((window as any).showToast) {
          (window as any).showToast('warning', 'Invitation Warning', `Administrator registered, but welcome email failed: ${result.emailError || 'Provider error'}.`, 6000);
        }
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Invite submit error:', err);
      if ((window as any).showToast) {
        let errorMsg = err?.message || 'Failed to invite administrator.';
        if (err?.code === '23505') {
          errorMsg = 'This administrator has already been invited.';
        }
        (window as any).showToast('error', 'Invitation Failed', errorMsg, 5000);
      }
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
        (window as any).showToast('info', 'Administrator Deactivated', 'The administrator has been deactivated successfully.', 4000);
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Deactivate error:', err);
      if ((window as any).showToast) {
        (window as any).showToast('error', 'Deactivation Failed', err?.message || 'Failed to deactivate administrator.', 5000);
      } else {
        alert(err?.message || 'Failed to deactivate administrator.');
      }
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
        (window as any).showToast('success', 'Administrator Reactivated', 'The administrator has been reactivated successfully.', 4000);
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Reactivate error:', err);
      if ((window as any).showToast) {
        (window as any).showToast('error', 'Reactivation Failed', err?.message || 'Failed to reactivate administrator.', 5000);
      } else {
        alert(err?.message || 'Failed to reactivate administrator.');
      }
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
        (window as any).showToast('success', 'Access Removed', 'The administrator access has been permanently removed.', 4000);
      }
    } catch (err: any) {
      console.error('[useAdminAccess] Remove access error:', err);
      if ((window as any).showToast) {
        (window as any).showToast('error', 'Removal Failed', err?.message || 'Failed to remove administrator access.', 5000);
      } else {
        alert(err?.message || 'Failed to remove administrator access.');
      }
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
