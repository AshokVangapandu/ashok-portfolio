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
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect');
      if (redirectPath && redirectPath.startsWith('/admin')) {
        const fullUrl = window.location.origin + redirectPath + window.location.hash;
        window.history.replaceState(null, '', fullUrl);
        return redirectPath;
      }
      return window.location.pathname;
    }
    return '/admin/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      let cleanPath = path;
      if (cleanPath.startsWith('/ashok-portfolio')) {
        cleanPath = cleanPath.substring('/ashok-portfolio'.length);
      }
      
      if (!cleanPath.startsWith('/admin')) {
        // Force a hard reload to fetch the actual public HTML file from the server
        window.location.href = window.location.href;
        return;
      }
      
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
