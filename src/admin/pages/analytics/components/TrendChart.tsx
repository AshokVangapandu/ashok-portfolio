/* src/admin/pages/analytics/components/TrendChart.tsx */
import React from 'react';
import { AnalyticsTrend } from '../../../types/analytics';

interface TrendChartProps {
  trends: AnalyticsTrend[];
  trendMode: 'daily' | 'weekly' | 'monthly';
  setTrendMode: (val: 'daily' | 'weekly' | 'monthly') => void;
  loading?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  trends,
  trendMode,
  setTrendMode,
  loading = false,
}) => {
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  // Calculate coordinates
  const maxVal = trends.length > 0 ? Math.max(...trends.map((t) => t.visitors)) * 1.15 : 6000;
  const points = trends.map((t, idx) => {
    const x = paddingX + (idx / (trends.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (t.visitors / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, label: t.label, value: t.visitors };
  });

  // Calculate path
  const getCurvePath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = getCurvePath();
  
  // Filled area path
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const modes: { id: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

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
        fontFamily: "'Inter', sans-serif"
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
            Last 7 days • Updated just now
          </span>
        </div>

        {/* Daily/Weekly/Monthly Toggle */}
        <div style={{ display: 'flex', backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '2px' }}>
          {modes.map((m) => {
            const isActive = trendMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setTrendMode(m.id)}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Canvas view */}
      <div style={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        {loading ? (
          <div style={{ height: `${chartHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton-cell" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            width="100%"
            height={chartHeight}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              {/* Curve gradient shadow fill */}
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

            {/* Filled area */}
            {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}

            {/* Spline curve line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="var(--admin-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Circle points on line */}
            {points.map((p, idx) => (
              <g key={idx}>
                {/* Visual tooltip trigger area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill="var(--admin-primary)"
                  style={{ opacity: 0.15, cursor: 'pointer' }}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#FFFFFF"
                  stroke="var(--admin-primary)"
                  strokeWidth="2.5"
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${p.label}: ${p.value.toLocaleString()}`}</title>
                </circle>
                {/* X Axis label */}
                <text
                  x={p.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill="var(--admin-text-secondary)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
