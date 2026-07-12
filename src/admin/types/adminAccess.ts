/* src/admin/types/adminAccess.ts */

export type AdminRole = 'Super Admin' | 'Admin' | 'Portfolio Viewer';
export type AdminStatus = 'Active' | 'Pending' | 'Inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: AdminRole;
  status: AdminStatus;
  lastLogin: string; // e.g. "Today, 10:42 AM", "Jan 14, 2024", "—"
  permissions: string[];
  joinedDate: string; // e.g. "Nov 10, 2023"
  recentLogin?: string | null; // e.g. "Jan 14, 2024 · 3:55 PM"
  lastActivity?: string | null; // e.g. "Jan 14, 2024"
  invitationAcceptedDate?: string | null; // e.g. "Nov 11, 2023"
  isYou?: boolean;
}

export interface AdminAccessSummary {
  superAdmins: number;
  portfolioViewers: number;
  pendingInvitations: number;
  activeMembers: number;
}
