/* src/admin/services/authorizedUsersService.ts */
import { supabase } from '../../services/supabase/client';
import {
  AuthorizedUser,
  CreateAuthorizedUserPayload,
  UpdateAuthorizedUserPayload,
  UserStatus
} from '../types/authorizedUsers';

export const authorizedUsersService = {
  async getUsers(): Promise<AuthorizedUser[]> {
    const { data, error } = await supabase
      .from('authorized_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[authorizedUsersService] Error fetching users:', error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      email: item.email,
      fullName: item.full_name,
      accessStatus: item.access_status as UserStatus,
      accessLevel: item.access_level as any,
      invitedAt: item.invited_at,
      lastAccess: item.last_access,
      notes: item.notes,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  async createUser(payload: CreateAuthorizedUserPayload): Promise<AuthorizedUser> {
    const email = payload.email.trim().toLowerCase();

    // Check for existing user with same email
    const { data: existing } = await supabase
      .from('authorized_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      throw new Error('An authorized user with this email address already exists.');
    }

    const { data, error } = await supabase
      .from('authorized_users')
      .insert({
        email: email,
        full_name: payload.fullName?.trim() || null,
        access_level: payload.accessLevel || 'viewer',
        notes: payload.notes?.trim() || null,
        access_status: 'enabled'
      })
      .select('*')
      .single();

    if (error) {
      console.error('[authorizedUsersService] Error creating user:', error);
      throw error;
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      accessStatus: data.access_status as UserStatus,
      accessLevel: data.access_level as any,
      invitedAt: data.invited_at,
      lastAccess: data.last_access,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  async updateUser(id: string, payload: UpdateAuthorizedUserPayload): Promise<boolean> {
    const updateData: {
      full_name?: string | null;
      access_status?: UserStatus;
      access_level?: any;
      notes?: string | null;
      updated_at?: string;
    } = {
      updated_at: new Date().toISOString()
    };

    if (payload.fullName !== undefined) updateData.full_name = payload.fullName.trim() || null;
    if (payload.accessStatus !== undefined) updateData.access_status = payload.accessStatus;
    if (payload.accessLevel !== undefined) updateData.access_level = payload.accessLevel;
    if (payload.notes !== undefined) updateData.notes = payload.notes.trim() || null;

    const { error } = await supabase
      .from('authorized_users')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('[authorizedUsersService] Error updating user:', error);
      throw error;
    }

    return true;
  },

  async toggleUserStatus(id: string, currentStatus: UserStatus): Promise<UserStatus> {
    const newStatus: UserStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    await this.updateUser(id, { accessStatus: newStatus });
    return newStatus;
  },

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('authorized_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[authorizedUsersService] Error deleting user:', error);
      throw error;
    }

    return true;
  }
};

export default authorizedUsersService;
