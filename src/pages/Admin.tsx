import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { PageLayout } from '../admin/layout/PageLayout';
import { resolveRoute } from '../admin/router';

/**
 * Admin Dashboard Page.
 * Restricts access to authorized administrators and renders the core layout frame.
 */
export const AdminPage: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/admin/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const hasBase = window.location.pathname.startsWith('/ashok-portfolio');
      const targetPath = hasBase ? `/ashok-portfolio${path}` : path;
      window.history.pushState(null, '', targetPath);
      setCurrentPath(targetPath);
    }
  };

  const getFallbackPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/ashok-portfolio') ? '/ashok-portfolio/' : '/';
    }
    return '/';
  };

  const { component, pageTitle } = resolveRoute(currentPath);

  return (
    <ProtectedRoute adminOnly fallbackPath={getFallbackPath()}>
      <PageLayout
        currentPath={currentPath}
        onNavigate={handleNavigate}
        pageTitle={pageTitle}
      >
        {component}
      </PageLayout>
    </ProtectedRoute>
  );
};

export default AdminPage;
