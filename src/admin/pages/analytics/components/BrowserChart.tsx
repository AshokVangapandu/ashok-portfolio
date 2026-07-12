/* src/admin/pages/analytics/components/BrowserChart.tsx */
import React from 'react';
import { AnalyticsBrowser } from '../../../types/analytics';

interface BrowserChartProps {
  browsers: AnalyticsBrowser[];
  loading?: boolean;
}

export const BrowserChart: React.FC<BrowserChartProps> = ({
  browsers,
  loading = false,
}) => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '220px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        🌐 Browser Usage
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-cell" style={{ height: '24px', borderRadius: '4px' }} />
          ))
        ) : (
          browsers.map((br) => (
            <div key={br.name} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 40px', alignItems: 'center', gap: '12px' }}>
              {/* Name */}
              <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                {br.name}
              </span>

              {/* Progress Bar line */}
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${br.percentage}%`,
                    backgroundColor: 'var(--admin-primary)',
                    borderRadius: '3px'
                  }}
                />
              </div>

              {/* Percentage label */}
              <span style={{ fontSize: '12.5px', color: 'var(--admin-text)', fontWeight: 700, textAlign: 'right' }}>
                {br.percentage}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowserChart;
