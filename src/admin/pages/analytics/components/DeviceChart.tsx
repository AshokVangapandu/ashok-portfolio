/* src/admin/pages/analytics/components/DeviceChart.tsx */
import React from 'react';
import { AnalyticsDevice } from '../../../types/analytics';

interface DeviceChartProps {
  devices: AnalyticsDevice[];
  loading?: boolean;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({
  devices,
  loading = false,
}) => {
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // 251.3
  const center = 50;

  // Colors mapping for rings
  const colors = [
    'var(--admin-primary)', // Purple
    '#9061F9', // Medium purple
    '#CABFFD', // Light purple
  ];

  let accumulatedPercent = 0;

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
        📱 Device Distribution
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'center' }}>
        {loading ? (
          <div className="skeleton-cell" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around', gap: '16px', flexWrap: 'wrap' }}>
            {/* SVG Donut Circle */}
            <svg
              viewBox="0 0 100 100"
              width="100"
              height="100"
              style={{ transform: 'rotate(-90deg)', overflow: 'visible', flexShrink: 0 }}
            >
              {/* Inactive background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />

              {devices.map((dev, idx) => {
                const strokeLength = (dev.percentage / 100) * circumference;
                const strokeOffset = circumference - ((accumulatedPercent / 100) * circumference);
                accumulatedPercent += dev.percentage;

                return (
                  <circle
                    key={dev.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={colors[idx % colors.length]}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                  />
                );
              })}
            </svg>

            {/* Legend indicators list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {devices.map((dev, idx) => (
                <div key={dev.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors[idx % colors.length]
                    }}
                  />
                  <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                    {dev.name}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--admin-text)', fontWeight: 700, marginLeft: 'auto' }}>
                    {dev.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceChart;
