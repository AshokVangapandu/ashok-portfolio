/* src/admin/router.tsx */
import React from 'react';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ContactsPage } from './pages/contacts/ContactsPage';
import { TestimonialsPage } from './pages/testimonials/TestimonialsPage';
import { ResumePage } from './pages/resume/ResumePage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { PortfolioSettingsPage } from './pages/settings/PortfolioSettingsPage';
import { SocialLinksPage } from './pages/social-links/SocialLinksPage';
import { AdminAccessPage } from './pages/admin-access/AdminAccessPage';
import { CertificationsPage } from './pages/certifications/CertificationsPage';

interface RouteResolution {
  component: React.ReactNode;
  pageTitle: string;
}

/**
 * Resolves the browser path to a specific page component and header title.
 */
export const resolveRoute = (path: string): RouteResolution => {
  // Normalize paths for matching (strip trailing slash)
  const normalizedPath = path.replace(/\/$/, '').toLowerCase();

  switch (normalizedPath) {
    case '/admin':
    case '/admin/index.html':
      return {
        component: <DashboardPage />,
        pageTitle: 'Admin Dashboard',
      };
    case '/admin/certifications':
      return {
        component: <CertificationsPage />,
        pageTitle: 'Certifications',
      };
    case '/admin/contacts':
      return {
        component: <ContactsPage />,
        pageTitle: 'Contacts',
      };
    case '/admin/testimonials':
      return {
        component: <TestimonialsPage />,
        pageTitle: 'Testimonials Manager',
      };
    case '/admin/resume':
      return {
        component: <ResumePage />,
        pageTitle: 'Resume Downloads',
      };
    case '/admin/analytics':
      return {
        component: <AnalyticsPage />,
        pageTitle: 'Visitor Analytics',
      };
    case '/admin/settings':
      return {
        component: <PortfolioSettingsPage />,
        pageTitle: 'Settings',
      };
    case '/admin/settings/portfolio':
      return {
        component: <PortfolioSettingsPage />,
        pageTitle: 'Portfolio Settings',
      };
    case '/admin/settings/social-links':
      return {
        component: <SocialLinksPage />,
        pageTitle: 'Social Links',
      };
    case '/admin/settings/admin-access':
      return {
        component: <AdminAccessPage />,
        pageTitle: 'Admin Access',
      };
    case '/admin/social-links':
      return {
        component: <SocialLinksPage />,
        pageTitle: 'Social Media Links',
      };
    case '/admin/access':
      return {
        component: <AdminAccessPage />,
        pageTitle: 'Access Privilege Control',
      };
    default:
      // Fallback redirect if path matches nothing
      return {
        component: <DashboardPage />,
        pageTitle: 'Admin Dashboard',
      };
  }
};
