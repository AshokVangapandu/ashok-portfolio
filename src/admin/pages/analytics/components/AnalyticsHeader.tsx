/* src/admin/pages/analytics/components/AnalyticsHeader.tsx */
import React from 'react';

export const AnalyticsHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <h1
        style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: 800,
          color: '#0F172A',
          letterSpacing: '-0.025em',
          lineHeight: '1.2',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>Portfolio</span>
        <span
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Analytics
        </span>
      </h1>
      <p
        style={{
          margin: 0,
          color: '#64748B',
          fontSize: '14.5px',
          fontWeight: 500,
          lineHeight: '1.4'
        }}
      >
        Monitor portfolio traffic, visitor engagement and project performance in real time.
      </p>
    </div>
  );
};

export default AnalyticsHeader;

