import React from 'react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AdminLayout } from '../components/admin/AdminLayout';

/**
 * Admin Dashboard Page.
 * Restricts access to authorized administrators and renders the core layout frame.
 */
export const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute adminOnly fallbackPath="/">
      <AdminLayout />
    </ProtectedRoute>
  );
};

export default AdminPage;
