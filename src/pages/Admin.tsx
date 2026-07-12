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
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
  };

  const { component, pageTitle } = resolveRoute(currentPath);

  return (
    <ProtectedRoute adminOnly fallbackPath="/">
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
