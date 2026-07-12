/* src/admin/pages/analytics/components/PeakHoursHeatmap.tsx */
import React from 'react';
import { PeakHours } from '../../../types/analytics';

interface PeakHoursHeatmapProps {
  peakHours: PeakHours[];
  loading?: boolean;
}

export const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({
  peakHours,
  loading = false,
}) => {
  // Get color opacity matching traffic intensity values (0-9)
  const getIntensityColor = (val: number) => {
    if (val === 0) return '#F8FAFC'; // Low/none
    const opacity = (val / 9) * 0.9 + 0.1; // Scale opacity from 0.1 to 1.0
    return `rgba(124, 58, 237, ${opacity})`;
  };

  const getIntensityTextColor = (val: number) => {
    return val > 5 ? '#FFFFFF' : 'var(--admin-text)';
  };

  // Split hours into two rows of 12 items or display in a responsive grid
  const firstRow = peakHours.slice(0, 16);
  const secondRow = peakHours.slice(16);

  return (
    <div
      style={{
        flex: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '320px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        ⏰ Peak Visiting Hours
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {loading ? (
          <div className="skeleton-cell" style={{ height: '110px', borderRadius: '8px' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            
            {/* First Row of Hours */}
            <div style={{ display: 'flex', gap: '6px', minWidth: '480px' }}>
              {firstRow.map((ph) => (
                <div
                  key={ph.hour}
                  title={`${ph.hour}: level ${ph.value}`}
                  style={{
                    flex: 1,
                    aspectRatio: '1',
                    borderRadius: '6px',
                    backgroundColor: getIntensityColor(ph.value),
                    color: getIntensityTextColor(ph.value),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    boxSizing: 'border-box',
                    minWidth: '24px'
                  }}
                >
                  <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.8 }}>{ph.hour}</span>
                </div>
              ))}
            </div>

            {/* Second Row of Hours */}
            <div style={{ display: 'flex', gap: '6px', minWidth: '480px' }}>
              {secondRow.map((ph) => (
                <div
                  key={ph.hour}
                  title={`${ph.hour}: level ${ph.value}`}
                  style={{
                    flex: 1,
                    aspectRatio: '1',
                    borderRadius: '6px',
                    backgroundColor: getIntensityColor(ph.value),
                    color: getIntensityTextColor(ph.value),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    boxSizing: 'border-box',
                    minWidth: '24px'
                  }}
                >
                  <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.8 }}>{ph.hour}</span>
                </div>
              ))}
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--admin-text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              <span>Low</span>
              {[0, 2, 4, 6, 8].map((val) => (
                <div
                  key={val}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: getIntensityColor(val)
                  }}
                />
              ))}
              <span>High</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeakHoursHeatmap;
