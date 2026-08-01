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
        joinedDate: u.invitation_accepted_at ? formatDate(u.invitation_accepted_at) : formatDate(u.created_at),
        recentLogin: formatDateTime(u.last_login),
        lastActivity: formatDateTime(u.last_login),
        invitationAcceptedDate: u.invitation_accepted_at ? formatDate(u.invitation_accepted_at) : null,
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

  async inviteAdmin(email: string, role: AdminRole): Promise<{ success: boolean; emailSent: boolean; emailError: string | null; isReinvite?: boolean }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const dbRole = mapUiRoleToDb(role);

    console.log('[adminAccessService.inviteAdmin] Started. email:', cleanEmail, 'role:', dbRole);

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

    console.log('[adminAccessService.inviteAdmin] Checking if admin already exists with email:', cleanEmail);
    const { data: existingAdmin, error: checkError } = await (supabase as any)
      .from('admins')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (checkError) {
      console.error('[adminAccessService.inviteAdmin] Database check failed:', checkError);
      throw checkError;
    }

    let isReinvite = false;

    if (existingAdmin) {
      console.log('[adminAccessService.inviteAdmin] Admin record already exists:', existingAdmin);
      isReinvite = true;

      // Update existing record to reactivate/re-invite
      const { error: updateError } = await (supabase as any)
        .from('admins')
        .update({
          role: dbRole,
          status: 'Pending',
          is_active: true,
          permissions: defaultPermissions
        })
        .eq('id', existingAdmin.id);

      if (updateError) {
        console.error('[adminAccessService.inviteAdmin] Database update failed:', updateError);
        throw updateError;
      }
      console.log('[adminAccessService.inviteAdmin] Database update succeeded. Now invoking Edge Function...');
    } else {
      const payload = {
        email: cleanEmail,
        role: dbRole,
        status: 'Pending',
        is_active: true,
        full_name: 'Pending Invite',
        permissions: defaultPermissions
      };

      console.log('[adminAccessService.inviteAdmin] Inserting pending admin record in database. Payload:', payload);
      const { error: insertError } = await (supabase as any)
        .from('admins')
        .insert(payload);

      if (insertError) {
        console.error('[adminAccessService.inviteAdmin] Database insert failed:', insertError);
        throw insertError;
      }
      console.log('[adminAccessService.inviteAdmin] Database insert succeeded. Now invoking Edge Function...');
    }

    // Invoke the send-admin-invitation edge function to send welcome email
    let emailSent = true;
    let emailError: string | null = null;
    try {
      console.log('[adminAccessService.inviteAdmin] Invoking Edge Function via supabase.functions.invoke("send-admin-invitation")...');
      const { data: invokeData, error: invokeError } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          email: cleanEmail,
          role: role
        }
      });
      console.log('[adminAccessService.inviteAdmin] Edge Function returned. Data:', invokeData, 'Error:', invokeError);
      if (invokeError) {
        console.error('[adminAccessService] send-admin-invitation edge function returned error:', invokeError);
        emailSent = false;
        emailError = invokeError.message || 'Failed to trigger invitation email';
      }
    } catch (invokeErr: any) {
      console.error('[adminAccessService] send-admin-invitation edge function exception:', invokeErr);
      emailSent = false;
      emailError = invokeErr.message || 'Exception occurred during email invitation dispatch';
    }

    return { success: true, emailSent, emailError, isReinvite };
  },

  async deactivateAdmin(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('admins')
      .update({ status: 'Inactive', is_active: false })
      .eq('id', id);

    if (error) {
      console.error('[adminAccessService] Error deactivating admin:', error);
      throw error;
    }
    return true;
  },

  async reactivateAdmin(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('admins')
      .update({ status: 'Active', is_active: true })
      .eq('id', id);

    if (error) {
      console.error('[adminAccessService] Error reactivating admin:', error);
      throw error;
    }
    return true;
  },

  async removeAdmin(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[adminAccessService] Error removing admin:', error);
      throw error;
    }
    return true;
  }
};

export default adminAccessService;
