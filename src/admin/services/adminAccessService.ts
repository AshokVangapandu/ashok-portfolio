/* src/admin/services/adminAccessService.ts */
import { supabase } from '../../services/supabase/client';
import { AdminRole, AdminStatus, AdminUser, AdminAccessSummary } from '../types/adminAccess';

export interface AdminUserQueryOptions {
  search?: string;
  role?: AdminRole | 'All';
  status?: AdminStatus | 'All';
}

const mapDbRoleToUi = (role: string): AdminRole => {
  if (role === 'super_admin') return 'Super Admin';
  if (role === 'portfolio_viewer') return 'Portfolio Viewer';
  return 'Admin';
};

const mapUiRoleToDb = (role: AdminRole): string => {
  if (role === 'Super Admin') return 'super_admin';
  if (role === 'Portfolio Viewer') return 'portfolio_viewer';
  return 'admin';
};

const formatDate = (isoString: string | null): string => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatDateTime = (isoString: string | null): string => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  if (isToday) {
    return `Today, ${timeStr}`;
  }
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  return `${dateStr}, ${timeStr}`;
};

export const adminAccessService = {
  async getSummary(): Promise<AdminAccessSummary> {
    const { data, error } = await (supabase as any)
      .from('admins')
      .select('role, status, is_active');

    if (error) {
      console.error('[adminAccessService] Error loading summary counts:', error);
      throw error;
    }

    const list = data || [];
    const superAdmins = list.filter((u: any) => u.role === 'super_admin' && u.is_active).length;
    const portfolioViewers = list.filter((u: any) => u.role === 'portfolio_viewer' && u.is_active).length;
    const pendingInvitations = list.filter((u: any) => u.status === 'Pending').length;
    const activeMembers = list.filter((u: any) => u.status === 'Active' && u.is_active).length;

    return {
      superAdmins,
      portfolioViewers,
      pendingInvitations,
      activeMembers
    };
  },

  async getMembers(options: AdminUserQueryOptions = {}): Promise<AdminUser[]> {
    const { data, error } = await (supabase as any)
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[adminAccessService] Error loading members:', error);
      throw error;
    }

    const { data: authData } = await supabase.auth.getUser();
    const currentUserEmail = authData?.user?.email;

    let list: AdminUser[] = (data || []).map((u: any) => {
      const uiRole = mapDbRoleToUi(u.role);
      return {
        id: u.id,
        name: u.full_name || 'Pending Invite',
        email: u.email,
        avatarUrl: u.avatar_url,
        role: uiRole,
        status: u.status as AdminStatus,
        lastLogin: formatDateTime(u.last_login),
        permissions: u.permissions || [],
        joinedDate: formatDate(u.created_at),
        recentLogin: formatDateTime(u.last_login),
        lastActivity: formatDateTime(u.last_login),
        invitationAcceptedDate: u.status === 'Active' ? formatDate(u.created_at) : null,
        isYou: u.email === currentUserEmail
      };
    });

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (u: AdminUser) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (options.role && options.role !== 'All') {
      list = list.filter((u: AdminUser) => u.role === options.role);
    }

    if (options.status && options.status !== 'All') {
      list = list.filter((u: AdminUser) => u.status === options.status);
    }

    return list;
  },

  async inviteAdmin(email: string, role: AdminRole): Promise<boolean> {
    const dbRole = mapUiRoleToDb(role);

    // Dynamic data-driven default permissions
    let defaultPermissions: string[] = [];
    if (dbRole === 'super_admin') {
      defaultPermissions = [
        'Dashboard',
        'Inquiries',
        'Testimonials',
        'Resume Downloads',
        'Analytics',
        'Projects',
        'Portfolio Configuration',
        'Access Management'
      ];
    } else if (dbRole === 'admin') {
      defaultPermissions = [
        'Dashboard',
        'Inquiries',
        'Testimonials',
        'Resume Downloads',
        'Analytics',
        'Projects',
        'Portfolio Configuration'
      ];
    } else {
      defaultPermissions = [
        'Dashboard',
        'Inquiries',
        'Testimonials',
        'Resume Downloads',
        'Analytics'
      ];
    }

    const payload = {
      email,
      role: dbRole,
      status: 'Pending',
      is_active: true,
      full_name: 'Pending Invite',
      permissions: defaultPermissions
    };

    const { error } = await (supabase as any)
      .from('admins')
      .insert(payload);

    if (error) {
      console.error('[adminAccessService] Error inviting admin:', error);
      throw error;
    }

    return true;
  }
};

export default adminAccessService;
