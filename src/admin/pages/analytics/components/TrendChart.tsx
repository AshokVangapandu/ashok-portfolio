/* src/admin/pages/analytics/components/TrendChart.tsx */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnalyticsTrend } from '../../../types/analytics';

interface TrendChartProps {
  trends: AnalyticsTrend[];
  trendMode: 'daily' | 'weekly' | 'monthly';
  setTrendMode: (val: 'daily' | 'weekly' | 'monthly') => void;
  loading?: boolean;
  error?: boolean;
  timeRange?: string;
  onRetry?: () => void;
}

export const TrendChart: React.FC<TrendChartProps> = React.memo(({
  trends = [],
  trendMode,
  setTrendMode,
  loading = false,
  error = false,
  timeRange = '30days',
  onRetry,
}) => {
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const [activeTooltip, setActiveTooltip] = useState<{
    clientX: number;
    clientY: number;
    label: string;
    value: number;
    position: 'top' | 'bottom';
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseEnter = (p: typeof points[0]) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = rect.left + (p.x / chartWidth) * rect.width;
    const clientY = rect.top + (p.y / chartHeight) * rect.height;

    // Determine if space above is less than 60px to flip below
    const position = clientY < 60 ? 'bottom' : 'top';

    setActiveTooltip({
      clientX,
      clientY,
      label: p.label,
      value: p.value,
      position
    });
  };

  useEffect(() => {
    const handleScroll = () => setActiveTooltip(null);
    const handleResize = () => setActiveTooltip(null);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render Tooltip Portal
  const renderTooltipPortal = () => {
    if (!activeTooltip) return null;

    const tooltipWidth = 130;
    const margin = 12;
    const leftBoundary = tooltipWidth / 2 + margin;
    const rightBoundary = window.innerWidth - (tooltipWidth / 2) - margin;
    
    const adjustedX = Math.max(leftBoundary, Math.min(activeTooltip.clientX, rightBoundary));
    const arrowOffset = activeTooltip.clientX - adjustedX;
    
    const isTop = activeTooltip.position === 'top';
    const topValue = isTop ? activeTooltip.clientY - 8 : activeTooltip.clientY + 8;
    const transformValue = isTop ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
    const animationName = isTop ? 'tooltipRevealTop' : 'tooltipRevealBottom';

    return createPortal(
      <div
        style={{
          position: 'fixed',
          left: `${adjustedX}px`,
          top: `${topValue}px`,
          transform: transformValue,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.15)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          alignItems: 'center',
          animation: `${animationName} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`
        }}
      >
        <span style={{ fontWeight: 650, fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {activeTooltip.label}
        </span>
        <span style={{ fontSize: '12.5px', fontWeight: 700 }}>
          {activeTooltip.value.toLocaleString()} visitors
        </span>
        
        {/* Tooltip arrow pointing directly at coordinate */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            position: 'absolute',
            left: `calc(50% + ${arrowOffset}px)`,
            transform: 'translateX(-50%)',
            ...(isTop ? {
              bottom: '-4px',
              borderTop: '4px solid #0F172A',
              borderBottom: 'none'
            } : {
              top: '-4px',
              borderBottom: '4px solid #0F172A',
              borderTop: 'none'
            })
          }}
        />
      </div>,
      document.body
    );
  };

  // Subtitle formatting based on date filter
  const subtitleText = useMemo(() => {
    const labels: Record<string, string> = {
      today: 'Today',
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
      '90days': 'Last 90 Days',
    };
    return `${labels[timeRange] || 'Last 30 Days'} • Updated just now`;
  }, [timeRange]);

  // Calculate coordinates
  const { points, maxVal, linePath, areaPath } = useMemo(() => {
    console.log('[TrendChart RPC Output] trends data received from database:', trends);
    if (!trends || trends.length === 0) {
      return { points: [], maxVal: 6000, linePath: '', areaPath: '' };
    }

    const visitorsList = trends.map((t) => Number(t.visitors) || 0);
    const maxVal = Math.max(...visitorsList) * 1.15 || 10;
    const len = trends.length;

    const points = trends.map((t, idx) => {
      // Avoid division by zero when only 1 trend entry exists
      const divisor = len - 1 || 1;
      const x = paddingX + (idx / divisor) * (chartWidth - paddingX * 2);
      const val = Number(t.visitors) || 0;
      const y = chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
      return { x, y, label: t.label, value: val };
    });

    // Spline curve generator path
    let linePath = '';
    if (points.length > 0) {
      linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cpX1 = curr.x + (next.x - curr.x) / 2;
        const cpY1 = curr.y;
        const cpX2 = curr.x + (next.x - curr.x) / 2;
        const cpY2 = next.y;
        linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
      }
    }

    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
      : '';

    return { points, maxVal, linePath, areaPath };
  }, [trends]);

  const modes: { id: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  // Helper render for SVG Skeleton
  const renderSkeleton = () => (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      width="100%"
      height={chartHeight}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Horizontal grid lines */}
      {[0, 1, 2, 3].map((gIdx) => {
        const gridY = paddingY + (gIdx / 3) * (chartHeight - paddingY * 2);
        return (
          <line
            key={gIdx}
            x1={paddingX}
            y1={gridY}
            x2={chartWidth - paddingX}
            y2={gridY}
            stroke="#EEF2FF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        );
      })}
      {/* Wave shape line placeholder */}
      <path
        d={`M ${paddingX} ${chartHeight - paddingY - 15} 
            C ${chartWidth * 0.25} ${chartHeight - paddingY - 80}, 
              ${chartWidth * 0.5} ${chartHeight - paddingY - 20}, 
              ${chartWidth * 0.75} ${chartHeight - paddingY - 110}, 
              ${chartWidth - paddingX} ${chartHeight - paddingY - 45}`}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="2.5"
        className="chart-skeleton-line"
        strokeDasharray="8 8"
      />
      {/* Wave area placeholder */}
      <path
        d={`M ${paddingX} ${chartHeight - paddingY - 15} 
            C ${chartWidth * 0.25} ${chartHeight - paddingY - 80}, 
              ${chartWidth * 0.5} ${chartHeight - paddingY - 20}, 
              ${chartWidth * 0.75} ${chartHeight - paddingY - 110}, 
              ${chartWidth - paddingX} ${chartHeight - paddingY - 45}
            L ${chartWidth - paddingX} ${chartHeight - paddingY}
            L ${paddingX} ${chartHeight - paddingY} Z`}
        fill="#F8FAFC"
        className="chart-skeleton-area"
      />
      {/* X-axis labels placeholders */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const x = paddingX + (idx / 5) * (chartWidth - paddingX * 2);
        return (
          <rect
            key={idx}
            x={x - 12}
            y={chartHeight - 12}
            width="24"
            height="8"
            rx="3"
            fill="#E2E8F0"
            className="chart-skeleton-text"
          />
        );
      })}
    </svg>
  );

  const shouldShowLabel = (idx: number, total: number) => {
    if (trendMode === 'weekly' || trendMode === 'monthly') return true;
    if (timeRange === 'today') {
      return idx % 4 === 0 || idx === total - 1;
    }
    if (timeRange === '7days') return true;
    if (timeRange === '30days') {
      if (idx === total - 2) return false;
      return idx % 5 === 0 || idx === total - 1;
    }
    if (timeRange === '90days') {
      if (idx === total - 2 || idx === total - 3 || idx === total - 4) return false;
      return idx % 15 === 0 || idx === total - 1;
    }
    return true;
  };

  return (
    <div
      style={{
        flex: 1.5,
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
        position: 'relative',
        height: '335px'
      }}
    >
      {/* Chart Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
            Visitor Trend
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
            {subtitleText}
          </span>
        </div>

        {/* Granularity Toggle */}
        <div style={{ display: 'flex', backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '2px' }}>
          {modes.map((m) => {
            const isActive = trendMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => !loading && !error && setTrendMode(m.id)}
                disabled={loading || error}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: (loading || error) ? 'not-allowed' : 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s ease',
                  opacity: (loading || error) ? 0.6 : 1
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>


        {/* Conditional Layout Rendering */}
        {error ? (
          <div style={{ height: `${chartHeight}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load visitor trends.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  border: '1px solid #EF4444',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="chart-retry-btn"
              >
                Retry
              </button>
            )}
          </div>
        ) : loading && (!trends || trends.length === 0) ? (
          renderSkeleton()
        ) : !loading && (!trends || trends.length === 0) ? (
          <div style={{ height: `${chartHeight}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="17" x2="9" y2="10" />
              <line x1="15" y1="17" x2="15" y2="12" />
              <line x1="12" y1="17" x2="12" y2="14" />
            </svg>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No visitor activity during this period.
            </span>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              width="100%"
              height={chartHeight}
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--admin-primary)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--admin-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 1, 2, 3].map((gIdx) => {
                const gridY = paddingY + (gIdx / 3) * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={gIdx}
                    x1={paddingX}
                    y1={gridY}
                    x2={chartWidth - paddingX}
                    y2={gridY}
                    stroke="#EEF2FF"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Filled Area with transitions */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill="url(#chart-area-grad)"
                  className="trend-path-area"
                />
              )}

              {/* Spline curve line with transitions */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--admin-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="trend-path-line"
                />
              )}

              {/* Visual circle markers on line with coordinate transitions */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="var(--admin-primary)"
                    style={{ opacity: 0.15, cursor: 'pointer' }}
                    className="trend-circle-point"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="var(--admin-primary)"
                    strokeWidth="2.5"
                    style={{ cursor: 'pointer' }}
                    className="trend-circle-point"
                  />
                  {/* X Axis label */}
                  {shouldShowLabel(idx, points.length) && (
                    <text
                      x={p.x}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      fill="var(--admin-text-secondary)"
                      fontSize="10.5"
                      fontWeight="600"
                      className={idx % 2 !== 0 ? 'kpi-axis-label-mid' : ''}
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Invisible interactive overlay rects for snappable tooltips */}
              {points.map((p, idx) => {
                const colWidth = (chartWidth - paddingX * 2) / (points.length - 1 || 1);
                const xStart = p.x - colWidth / 2;
                return (
                  <rect
                    key={`hover-${idx}`}
                    x={xStart}
                    y={paddingY}
                    width={colWidth}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => handleMouseEnter(p)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                );
              })}
            </svg>

            {/* Skeleton overlay on top for refreshes (preserves size and positions) */}
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(1px)',
                  animation: 'shimmerFadeIn 200ms ease-out forwards',
                  borderRadius: '8px'
                }}
              >
                <div style={{ width: '100%' }}>{renderSkeleton()}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tooltipRevealTop {
          from { opacity: 0; transform: translate(-50%, -90%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }

        @keyframes tooltipRevealBottom {
          from { opacity: 0; transform: translate(-50%, 10%); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes shimmerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.75; }
        }

        .chart-skeleton-line, .chart-skeleton-area, .chart-skeleton-text {
          animation: skeletonPulse 1.5s infinite ease-in-out;
        }

        /* SVG morph path transitions */
        .trend-path-line, .trend-path-area {
          transition: d 350ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* circle coordinate coordinate transitions */
        .trend-circle-point {
          transition: cx 350ms cubic-bezier(0.4, 0, 0.2, 1), cy 350ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chart-retry-btn:hover {
          background-color: #FEF2F2 !important;
        }

        @media (max-width: 580px) {
          .kpi-axis-label-mid {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trend-path-line, .trend-path-area, .trend-circle-point {
            transition: none !important;
          }
          .chart-skeleton-line, .chart-skeleton-area, .chart-skeleton-text {
            animation: none !important;
            opacity: 0.6 !important;
          }
        }
      `}} />
      {renderTooltipPortal()}
    </div>
  );
});

export default TrendChart;
