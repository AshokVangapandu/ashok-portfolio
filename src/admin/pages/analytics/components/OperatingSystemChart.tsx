/* src/admin/pages/analytics/components/OperatingSystemChart.tsx */
import React from 'react';
import { AnalyticsOperatingSystem } from '../../../types/analytics';

interface OperatingSystemChartProps {
  operatingSystems: AnalyticsOperatingSystem[];
  loading?: boolean;
}

export const OperatingSystemChart: React.FC<OperatingSystemChartProps> = ({
  operatingSystems,
  loading = false,
}) => {
  const chartHeight = 100; // max Y pixels for vertical bars

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
        💻 Operating Systems
      </h3>

      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', justifyContent: 'space-around', gap: '8px', minHeight: '140px' }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-cell" style={{ width: '32px', height: '100px', borderRadius: '4px' }} />
          ))
        ) : (
          operatingSystems.map((os) => {
            const barHeight = (os.percentage / 100) * chartHeight;
            return (
              <div
                key={os.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1
                }}
              >
                {/* Percentage label (on top of bar) */}
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text)' }}>
                  {os.percentage}%
                </span>

                {/* Vertical Bar shape */}
                <div
                  style={{
                    height: `${chartHeight}px`,
                    width: '32px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: `${barHeight}px`,
                      width: '100%',
                      backgroundColor: 'var(--admin-primary)',
                      borderRadius: '0 0 6px 6px',
                      transition: 'height 0.3s ease'
                    }}
                  />
                </div>

                {/* OS Name label */}
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {os.name}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OperatingSystemChart;
