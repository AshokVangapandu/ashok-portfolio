/* src/admin/hooks/useAuthorizedUsers.ts */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { authorizedUsersService } from '../services/authorizedUsersService';
import {
  AuthorizedUser,
  AuthorizedUsersStats,
  CreateAuthorizedUserPayload,
  UpdateAuthorizedUserPayload,
  UserStatus
} from '../types/authorizedUsers';

export const useAuthorizedUsers = () => {
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authorizedUsersService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('[useAuthorizedUsers] Fetch error:', err);
      setError(err?.message || 'Failed to load authorized users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        u.email.toLowerCase().includes(query) ||
        (u.fullName && u.fullName.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'all' || u.accessStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const stats: AuthorizedUsersStats = useMemo(() => {
    let total = users.length;
    let active = 0;
    let disabled = 0;

    users.forEach((u) => {
      if (u.accessStatus === 'enabled') active++;
      if (u.accessStatus === 'disabled') disabled++;
    });

    return { total, active, disabled, pendingInvitations: 0 };
  }, [users]);

  const createUser = async (payload: CreateAuthorizedUserPayload): Promise<boolean> => {
    try {
      const newUser = await authorizedUsersService.createUser(payload);
      setUsers((prev) => [newUser, ...prev]);
      return true;
    } catch (err: any) {
      console.error('[useAuthorizedUsers] Create error:', err);
      throw err;
    }
  };

  const updateUser = async (id: string, payload: UpdateAuthorizedUserPayload): Promise<boolean> => {
    try {
      await authorizedUsersService.updateUser(id, payload);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...payload, updatedAt: new Date().toISOString() } : u))
      );
      return true;
    } catch (err: any) {
      console.error('[useAuthorizedUsers] Update error:', err);
      throw err;
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: UserStatus): Promise<boolean> => {
    try {
      const newStatus = await authorizedUsersService.toggleUserStatus(id, currentStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, accessStatus: newStatus, updatedAt: new Date().toISOString() } : u
        )
      );
      return true;
    } catch (err: any) {
      console.error('[useAuthorizedUsers] Toggle status error:', err);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await authorizedUsersService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (err: any) {
      console.error('[useAuthorizedUsers] Delete error:', err);
      return false;
    }
  };

  return {
    users,
    filteredUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    refresh: fetchUsers
  };
};

export default useAuthorizedUsers;
