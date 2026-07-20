/* src/admin/types/authorizedUsers.ts */

export type UserStatus = 'enabled' | 'disabled';
export type AccessLevel = 'viewer' | 'recruiter' | 'client' | 'admin';

export interface AuthorizedUser {
  id: string;
  email: string;
  fullName: string | null;
  accessStatus: UserStatus;
  accessLevel: AccessLevel;
  invitedAt: string | null;
  lastAccess: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizedUsersStats {
  total: number;
  active: number;
  disabled: number;
  pendingInvitations: number;
}

export interface CreateAuthorizedUserPayload {
  email: string;
  fullName?: string;
  accessLevel?: AccessLevel;
  notes?: string;
}

export interface UpdateAuthorizedUserPayload {
  fullName?: string;
  accessStatus?: UserStatus;
  accessLevel?: AccessLevel;
  notes?: string;
}
