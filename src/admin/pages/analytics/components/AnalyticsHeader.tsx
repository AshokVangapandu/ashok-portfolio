/* src/admin/pages/analytics/components/AnalyticsHeader.tsx */
import React from 'react';

export const AnalyticsHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--admin-space-2)' }}>
      <h1
        style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--admin-text)',
          letterSpacing: '-0.02em'
        }}
      >
        Portfolio Analytics
      </h1>
      <p
        style={{
          margin: 0,
          color: 'var(--admin-text-secondary)',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        Monitor portfolio traffic, visitor engagement and project performance in real time.
      </p>
    </div>
  );
};

export default AnalyticsHeader;
