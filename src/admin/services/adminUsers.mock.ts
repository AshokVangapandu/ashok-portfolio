/* src/admin/services/adminUsers.mock.ts */
import { AdminUser, AdminAccessSummary } from '../types/adminAccess';

export const MOCK_ADMIN_SUMMARY: AdminAccessSummary = {
  superAdmins: 1,
  portfolioViewers: 2,
  pendingInvitations: 1,
  activeMembers: 3
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'Ashok Kumar',
    email: 'ashok@portfolio.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today, 10:42 AM',
    permissions: [
      'Dashboard',
      'Inquiries',
      'Testimonials',
      'Resume Downloads',
      'Analytics',
      'Projects',
      'Portfolio Configuration',
      'Access Management'
    ],
    joinedDate: 'Oct 01, 2023',
    recentLogin: 'Today · 10:42 AM',
    lastActivity: 'Today · 10:45 AM',
    invitationAcceptedDate: 'Oct 01, 2023',
    isYou: true
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@designstudio.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'Portfolio Viewer',
    status: 'Active',
    lastLogin: 'Jan 14, 2024',
    permissions: [
      'Dashboard',
      'Inquiries',
      'Testimonials',
      'Resume Downloads',
      'Analytics'
    ],
    joinedDate: 'Nov 10, 2023',
    recentLogin: 'Jan 14, 2024 · 3:55 PM',
    lastActivity: 'Jan 14, 2024',
    invitationAcceptedDate: 'Nov 11, 2023',
    isYou: false
  },
  {
    id: 'u3',
    name: 'Marcus Chen',
    email: 'marcus@techcorp.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Portfolio Viewer',
    status: 'Pending',
    lastLogin: '—',
    permissions: [
      'Dashboard',
      'Analytics'
    ],
    joinedDate: 'Jan 15, 2024',
    recentLogin: null,
    lastActivity: null,
    invitationAcceptedDate: null,
    isYou: false
  }
];
