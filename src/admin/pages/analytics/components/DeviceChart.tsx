import React, { useState, useEffect } from 'react';
import { AnalyticsDevice } from '../../../types/analytics';

interface DeviceChartProps {
  devices: AnalyticsDevice[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({
  devices,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ show: boolean; name: string; percentage: number; x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDeviceIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'desktop':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        );
      case 'mobile':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      case 'tablet':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
    }
  };

  // Build full devices dataset
  const defaultDevices = [
    { name: 'Desktop', percentage: 0 },
    { name: 'Mobile', percentage: 0 },
    { name: 'Tablet', percentage: 0 },
    { name: 'Other', percentage: 0 }
  ];

  const deviceMap = new Map((devices || []).map(d => [d.name, d.percentage]));
  const mappedDevices = defaultDevices.map(d => ({
    ...d,
    percentage: deviceMap.has(d.name) ? deviceMap.get(d.name)! : 0
  })).sort((a, b) => b.percentage - a.percentage);

  const totalPercent = mappedDevices.reduce((sum, d) => sum + d.percentage, 0);

  // SVG parameters
  const radius = 38;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const center = 50;

  // Colors mapping (dashboard purple shades)
  const colors: Record<string, string> = {
    'Desktop': 'var(--admin-primary)',
    'Mobile': '#9061F9',
    'Tablet': '#C084FC',
    'Other': '#E9D5FF'
  };

  // Find target item for center text: hovered element or largest element
  const topDevice = mappedDevices[0];
  const activeDevice = hoveredSegment 
    ? mappedDevices.find(d => d.name === hoveredSegment) 
    : (totalPercent > 0 ? topDevice : null);

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
        minWidth: '300px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative'
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        📱 Device Distribution
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load device analytics.
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div className="skeleton-cell" style={{ width: '110px', height: '110px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-cell" style={{ height: '36px', borderRadius: '6px' }} />
              ))}
            </div>
          </div>
        ) : totalPercent === 0 && (devices || []).length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No device analytics available yet.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
            
            {/* Donut Container */}
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg
                viewBox="0 0 100 100"
                width="120"
                height="120"
                style={{ transform: 'rotate(-90deg)', overflow: 'visible', flexShrink: 0 }}
              >
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth={strokeWidth}
                />

                {mappedDevices.map((dev) => {
                  const strokeLength = (dev.percentage / 100) * circumference;
                  const strokeOffset = circumference - ((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += dev.percentage;

                  if (dev.percentage === 0) return null;

                  const isHovered = hoveredSegment === dev.name;
                  const segmentColor = colors[dev.name] || 'var(--admin-primary)';

                  return (
                    <circle
                      key={dev.name}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke={segmentColor}
                      strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                      strokeDasharray={`${strokeLength} ${circumference}`}
                      strokeDashoffset={mounted ? strokeOffset : circumference}
                      strokeLinecap="round"
                      style={{
                        transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.2s ease, opacity 0.2s ease',
                        opacity: hoveredSegment ? (isHovered ? 1 : 0.4) : 1,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoveredSegment(dev.name)}
                      onMouseLeave={() => {
                        setHoveredSegment(null);
                        setTooltip(null);
                      }}
                      onMouseMove={(e) => {
                        const parentRect = e.currentTarget.ownerSVGElement?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
                        if (parentRect) {
                          setTooltip({
                            show: true,
                            name: dev.name,
                            percentage: dev.percentage,
                            x: e.clientX - parentRect.left,
                            y: e.clientY - parentRect.top - 12
                          });
                        }
                      }}
                    />
                  );
                })}
              </svg>

              {/* Center Labels */}
              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  textAlign: 'center'
                }}
              >
                {activeDevice ? (
                  <>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1.1 }}>
                      {activeDevice.percentage}%
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                      {activeDevice.name}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-text-secondary)' }}>
                    No Data
                  </span>
                )}
              </div>
            </div>

            {/* Legend / Stacked progress list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {mappedDevices.map((dev) => {
                const isHovered = hoveredSegment === dev.name;
                const segmentColor = colors[dev.name] || 'var(--admin-primary)';

                return (
                  <div
                    key={dev.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      padding: '8px 12px',
                      backgroundColor: isHovered ? 'rgba(124, 58, 237, 0.04)' : 'rgba(248, 250, 252, 0.5)',
                      border: '1px solid',
                      borderColor: isHovered ? 'var(--admin-primary)' : 'var(--admin-border)',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered ? 'translateY(-1px)' : 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredSegment(dev.name)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    {/* Header: Icon + Name (left) & Percentage (right) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(124, 58, 237, 0.08)',
                            color: segmentColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {getDeviceIcon(dev.name)}
                        </div>
                        <span style={{ fontSize: '12.5px', color: 'var(--admin-text)', fontWeight: 700 }}>
                          {dev.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text)', fontWeight: 800 }}>
                        {dev.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar (width matching Traffic Sources progress) */}
                    <div
                      style={{
                        height: '6px',
                        width: '100%',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: mounted ? `${dev.percentage}%` : '0%',
                          backgroundColor: segmentColor,
                          borderRadius: '3px',
                          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
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
            transition: 'left 0.1s ease, top 0.1s ease'
          }}
        >
          <span style={{ fontWeight: 700 }}>{tooltip.name}</span>
          <span style={{ color: '#E2E8F0' }}>{tooltip.percentage}%</span>
        </div>
      )}

    </div>
  );
};

export default DeviceChart;
