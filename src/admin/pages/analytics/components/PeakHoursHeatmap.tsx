import React, { useState, useEffect } from 'react';
import { PeakHours } from '../../../types/analytics';

interface PeakHoursHeatmapProps {
  peakHours: PeakHours[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({
  peakHours = [],
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{ show: boolean; hour: string; value: number; x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatHourLabel = (h: string) => {
    const num = h.slice(0, -1);
    const ampm = h.slice(-1) === 'a' ? 'AM' : 'PM';
    return `${num} ${ampm}`;
  };

  const maxVal = Math.max(...(peakHours || []).map(p => p.value), 1);

  const getIntensityColor = (val: number) => {
    if (val === 0) return '#F8FAFC';
    // Scale opacity from 0.15 to 1.0 based on maximum value returned
    const targetOpacity = (val / maxVal) * 0.85 + 0.15;
    const opacity = mounted ? targetOpacity : 0.15;
    return `rgba(124, 58, 237, ${opacity})`;
  };

  const getIntensityTextColor = (val: number) => {
    return val > (maxVal * 0.5) ? '#FFFFFF' : 'var(--admin-text)';
  };

  const firstRow = (peakHours || []).slice(0, 12);
  const secondRow = (peakHours || []).slice(12);

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
        fontFamily: "'Inter', sans-serif",
        position: 'relative'
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        ⏰ Peak Visiting Hours
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '140px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load peak visiting hours.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #EF4444',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="skeleton-cell" style={{ height: '110px', borderRadius: '8px' }} />
        ) : (peakHours || []).length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No peak hour analytics available yet.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            
            {/* AM Row */}
            <div style={{ display: 'flex', gap: '6px', minWidth: '480px', width: '100%' }}>
              {firstRow.map((ph) => (
                <div
                  key={ph.hour}
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
                    minWidth: '24px',
                    cursor: 'pointer',
                    transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease'
                  }}
                  onMouseEnter={() => setTooltip({ show: true, hour: ph.hour, value: ph.value, x: 0, y: 0 })}
                  onMouseLeave={() => setTooltip(null)}
                  onMouseMove={(e) => {
                    const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
                    if (parentRect) {
                      setTooltip(prev => prev ? {
                        ...prev,
                        x: e.clientX - parentRect.left,
                        y: e.clientY - parentRect.top - 12
                      } : null);
                    }
                  }}
                >
                  <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.9 }}>{ph.hour.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* PM Row */}
            <div style={{ display: 'flex', gap: '6px', minWidth: '480px', width: '100%' }}>
              {secondRow.map((ph) => (
                <div
                  key={ph.hour}
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
                    minWidth: '24px',
                    cursor: 'pointer',
                    transition: 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease'
                  }}
                  onMouseEnter={() => setTooltip({ show: true, hour: ph.hour, value: ph.value, x: 0, y: 0 })}
                  onMouseLeave={() => setTooltip(null)}
                  onMouseMove={(e) => {
                    const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
                    if (parentRect) {
                      setTooltip(prev => prev ? {
                        ...prev,
                        x: e.clientX - parentRect.left,
                        y: e.clientY - parentRect.top - 12
                      } : null);
                    }
                  }}
                >
                  <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.9 }}>{ph.hour.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--admin-text-secondary)', marginTop: '8px', fontWeight: 600 }}>
              <span>Low</span>
              {[0, 2.5, 5, 7.5, 10].map((val) => (
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

      {/* Floating Tooltip */}
      {tooltip && tooltip.show && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            color: '#FFFFFF',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 650,
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
            transition: 'left 0.05s ease, top 0.05s ease'
          }}
        >
          <span style={{ fontWeight: 700 }}>{formatHourLabel(tooltip.hour)}</span>
          <span style={{ color: '#E2E8F0' }}>{tooltip.value} Visitors</span>
        </div>
      )}

    </div>
  );
};

export default PeakHoursHeatmap;
