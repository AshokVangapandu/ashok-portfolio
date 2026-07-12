/* src/admin/services/adminAccessService.ts */
import { MOCK_ADMIN_SUMMARY, MOCK_ADMIN_USERS } from './adminUsers.mock';
import { AdminRole, AdminStatus } from '../types/adminAccess';

export interface AdminUserQueryOptions {
  search?: string;
  role?: AdminRole | 'All';
  status?: AdminStatus | 'All';
}

export const adminAccessService = {
  async getSummary() {
    return MOCK_ADMIN_SUMMARY;
  },

  async getMembers(options: AdminUserQueryOptions = {}) {
    let list = [...MOCK_ADMIN_USERS];

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (options.role && options.role !== 'All') {
      list = list.filter((u) => u.role === options.role);
    }

    if (options.status && options.status !== 'All') {
      list = list.filter((u) => u.status === options.status);
    }

    return list;
  },

  async inviteAdmin(email: string, role: AdminRole) {
    // Stub mock for inviting administration members
    console.log(`[adminAccessService] Invited ${email} with role ${role}`);
    return true;
  }
};

export default adminAccessService;
