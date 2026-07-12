/* src/admin/pages/dashboard/DashboardPage.tsx */
import React from 'react';
import { DashboardGrid } from '../../../components/admin/DashboardGrid';

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
      <DashboardGrid />
    </div>
  );
};

export default DashboardPage;
