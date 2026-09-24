/* src/admin/pages/dashboard/DashboardPage.tsx */
import React from 'react';
import analyticsBg from '../../../../assets/images/analytics-dashboard-bg.png';
import { DashboardGrid } from '../../../components/admin/DashboardGrid';

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', boxSizing: 'border-box' }}>
      {/* Fixed background: softened & lightened matching Analytics page */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${analyticsBg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--admin-space-4)',
        }}
      >
        <DashboardGrid />
      </div>
    </div>
  );
};

export default DashboardPage;

