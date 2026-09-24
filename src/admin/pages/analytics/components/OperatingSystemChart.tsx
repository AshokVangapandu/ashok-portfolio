/* src/admin/pages/analytics/components/OperatingSystemChart.tsx */
import React, { useState, useEffect } from 'react';
import osDecorImg from '../../../../../assets/images/analytics-os-decor.png';
import { AnalyticsOperatingSystem } from '../../../types/analytics';

interface OperatingSystemChartProps {
  operatingSystems: AnalyticsOperatingSystem[];
  totalVisitors?: number;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface OSVisualConfig {
  icon: React.ReactNode;
  bg: string;
  color: string;
  chartColor: string;
}

const getOSVisualConfig = (name: string): OSVisualConfig => {
  const lower = (name || '').toLowerCase().trim();

  // Windows
  if (lower.includes('windows')) {
    return {
      bg: '#EFF6FF',
      color: '#0078D7',
      chartColor: '#7C3AED',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#0078D7">
          <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
        </svg>
      ),
    };
  }

  // macOS / iOS / Apple
  if (lower.includes('mac') || lower.includes('ios') || lower.includes('apple') || lower.includes('os x')) {
    return {
      bg: '#F1F5F9',
      color: '#1E293B',
      chartColor: '#38BDF8',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#1E293B">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.8 16.32 3.32 8.78 7.37 8.3c1.4.17 2.27.97 3.03.97.74 0 1.9-.99 3.53-.83 1.68.16 2.94.88 3.56 2.23-3.4 2.1-2.83 6.64.44 7.95-.66 1.62-1.4 3.2-2.12 3.66M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.54-3.74 4.25z" />
        </svg>
      ),
    };
  }

  // Linux
  if (lower.includes('linux') || lower.includes('ubuntu') || lower.includes('debian')) {
    return {
      bg: '#FFFBEB',
      color: '#D97706',
      chartColor: '#F59E0B',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <ellipse cx="12" cy="13" rx="7" ry="8" fill="#1E293B" />
          <ellipse cx="12" cy="14" rx="4.5" ry="6" fill="#FFFFFF" />
          <circle cx="9.5" cy="8.5" r="1" fill="#FFFFFF" />
          <circle cx="14.5" cy="8.5" r="1" fill="#FFFFFF" />
          <polygon points="12,10 10.5,13 13.5,13" fill="#F59E0B" />
          <ellipse cx="8" cy="20" rx="3.5" ry="1.5" fill="#F59E0B" />
          <ellipse cx="16" cy="20" rx="3.5" ry="1.5" fill="#F59E0B" />
        </svg>
      ),
    };
  }

  // Android
  if (lower.includes('android')) {
    return {
      bg: '#ECFDF5',
      color: '#10B981',
      chartColor: '#10B981',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#10B981">
          <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 6.01 6 8h12c0-1.99-.97-3.75-2.47-4.84zM10 5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm4 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" />
        </svg>
      ),
    };
  }

  // ChromeOS
  if (lower.includes('chrome')) {
    return {
      bg: '#FFF7ED',
      color: '#EA580C',
      chartColor: '#F97316',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16">
          <circle cx="12" cy="12" r="10" fill="#EA4335" />
          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
        </svg>
      ),
    };
  }

  // Default / Other
  return {
    bg: '#F3E8FF',
    color: '#7C3AED',
    chartColor: '#C084FC',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  };
};

export const OperatingSystemChart: React.FC<OperatingSystemChartProps> = ({
  operatingSystems = [],
  totalVisitors,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort operating systems descending by count/percentage, positioning Others at the end
  const nonOthers = (operatingSystems || []).filter((o) => o.name?.toLowerCase() !== 'others');
  const backendOthers = (operatingSystems || []).find((o) => o.name?.toLowerCase() === 'others');

  const sortedOS = [
    ...nonOthers
      .sort((a, b) => (b.count || b.percentage || 0) - (a.count || a.percentage || 0))
      .map((os, index) => ({
        ...os,
        rank: index + 1,
      })),
    ...(backendOthers ? [{ ...backendOthers, rank: undefined }] : []),
  ];

  const rawSumCounts = sortedOS.reduce(
    (sum, os) => sum + Number(os.count ?? os.visits ?? 0),
    0
  );

  const effectiveTotal = typeof totalVisitors === 'number' && totalVisitors > 0
    ? totalVisitors
    : rawSumCounts;

  // Hare-Niemeyer (Largest Remainder Method) for exact 100% percentage distribution
  const normalizedOS = (() => {
    if (sortedOS.length === 0 || effectiveTotal === 0) {
      return sortedOS.map((os) => ({ ...os, percentage: 0 }));
    }

    const raw = sortedOS.map((os, index) => {
      const visits = Number(os.count ?? os.visits ?? 0);
      const rawPct = (visits / effectiveTotal) * 100;
      const floor = Math.floor(rawPct);
      const rem = rawPct - floor;
      return { index, visits, rawPct, floor, rem };
    });

    const sumFloor = raw.reduce((sum, r) => sum + r.floor, 0);
    const diff = Math.max(0, 100 - sumFloor);

    // Sort by remainder descending, then by visits descending
    const sortedByRem = [...raw].sort((a, b) => {
      if (b.rem !== a.rem) return b.rem - a.rem;
      return b.visits - a.visits;
    });

    const finalPcts = new Array(sortedOS.length).fill(0);
    sortedByRem.forEach((r, rank) => {
      finalPcts[r.index] = r.floor + (rank < diff ? 1 : 0);
    });

    return sortedOS.map((os, idx) => ({
      ...os,
      percentage: finalPcts[idx],
    }));
  })();

  const topOS = normalizedOS.length > 0 ? normalizedOS[0] : null;

  // Donut SVG parameters - compact, responsive dimensions
  const radius = 38;
  const strokeWidth = 7.5;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const center = 48;

  // Compute chained stroke lengths & offsets for donut
  let accumulatedPercent = 0;
  const donutSegments = normalizedOS.map((os) => {
    const pct = os.percentage || 0;
    const strokeLength = (pct / 100) * circumference;
    const offset = -(accumulatedPercent / 100) * circumference;
    accumulatedPercent += pct;
    const config = getOSVisualConfig(os.name);
    return {
      name: os.name,
      pct,
      strokeLength,
      offset,
      color: config.chartColor,
    };
  });

  return (
    <div
      className="os-distribution-card"
      style={{
        flex: 1,
        minWidth: '320px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '22px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        {/* Softly Rounded Square Purple Icon Box */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#F3E8FF',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.06)',
          }}
        >
          {/* Laptop / OS Icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Operating Systems
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 500,
              color: '#64748B',
              lineHeight: 1.2,
            }}
          >
            Operating systems used to visit your portfolio
          </p>
        </div>
      </div>

      {/* Content Section: Error, Loading Skeleton, Empty State, or OS Details */}
      {error ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '220px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>
            Failed to load operating system analytics.
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #EF4444',
                backgroundColor: 'transparent',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Retry
            </button>
          )}
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="os-shimmer" style={{ width: '96px', height: '96px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="os-shimmer" style={{ width: '70px', height: '12px', borderRadius: '4px' }} />
              <div className="os-shimmer" style={{ width: '50px', height: '24px', borderRadius: '6px' }} />
              <div className="os-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="os-shimmer" style={{ height: '52px', borderRadius: '16px' }} />
            ))}
          </div>
        </div>
      ) : normalizedOS.length === 0 || effectiveTotal === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '220px',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
            No operating system analytics available yet.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          {/* Upper Visual Area: Compact Donut + Total Visits + Decorative OS Artwork */}
          <div
            className="os-upper-visual"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '115px',
              padding: '4px 0',
              overflow: 'hidden',
            }}
          >
            {/* Left Group: Compact Donut Ring & Total Visits Metric */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1, minWidth: 0 }}>
              {/* Donut Gauge */}
              <div
                style={{
                  position: 'relative',
                  width: '96px',
                  height: '96px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 96 96"
                  width="96"
                  height="96"
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

                  {/* Multi-arc OS segments */}
                  {donutSegments.map((seg) => {
                    if (seg.pct <= 0) return null;
                    return (
                      <circle
                        key={seg.name}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${seg.strokeLength} ${circumference}`}
                        strokeDashoffset={mounted ? seg.offset : circumference}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                    );
                  })}
                </svg>

                {/* Donut Center Text - Compact & well-spaced */}
                <div
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    width: '100%',
                    padding: '0 4px',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {topOS ? `${topOS.percentage}%` : '0%'}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#64748B',
                      marginTop: '2px',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '65px',
                    }}
                  >
                    {topOS ? topOS.name : 'OS'}
                  </span>
                  <span
                    style={{
                      fontSize: '7px',
                      fontWeight: 500,
                      color: '#94A3B8',
                      marginTop: '1.5px',
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    of total visits
                  </span>
                </div>
              </div>

              {/* Total Visits Metric Block */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  borderLeft: '1px solid rgba(226, 232, 240, 0.8)',
                  paddingLeft: '14px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#64748B',
                    lineHeight: 1,
                  }}
                >
                  Total Visits
                </span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {effectiveTotal}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#16A34A',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '5px',
                      lineHeight: 1.2,
                    }}
                  >
                    ↑ 12%
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: '#94A3B8',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    vs last 7 days
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Responsive Decorative OS Artwork (Reference Image 2) */}
            <div
              className="decorative-os-art"
              aria-hidden="true"
            >
              <img
                src={osDecorImg}
                alt=""
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'saturate(1.05)',
                }}
              />
            </div>
          </div>

          {/* Lower Section: OS Detail Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', zIndex: 1 }}>
            {normalizedOS.map((os) => {
              const config = getOSVisualConfig(os.name);
              const visits = Number(os.count ?? os.visits ?? 0);

              return (
                <div
                  key={os.name}
                  className="os-detail-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(226, 232, 240, 0.85)',
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* 1. Rank Badge */}
                  {os.rank ? (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#7C3AED',
                        backgroundColor: '#F3E8FF',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        minWidth: '22px',
                        textAlign: 'center',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      #{os.rank}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#64748B',
                        backgroundColor: '#F1F5F9',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        minWidth: '22px',
                        textAlign: 'center',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  )}

                  {/* 2. OS Icon Container */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: config.bg,
                      color: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    {config.icon}
                  </div>

                  {/* 3. OS Name & Visits */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      width: '85px',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={os.name}
                    >
                      {os.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#64748B',
                        lineHeight: 1.2,
                      }}
                    >
                      {visits} {visits === 1 ? 'Visit' : 'Visits'}
                    </span>
                  </div>

                  {/* 4. Progress Bar */}
                  <div
                    style={{
                      flex: 1,
                      height: '6px',
                      backgroundColor: '#F1F5F9',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: mounted ? `${Math.min(100, Math.max(os.percentage > 0 ? 3 : 0, os.percentage))}%` : '0%',
                        background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>

                  {/* 5. Percentage Callout */}
                  <div
                    style={{
                      backgroundColor: '#F3E8FF',
                      color: '#7C3AED',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      minWidth: '44px',
                      textAlign: 'center',
                      flexShrink: 0,
                      marginLeft: '4px',
                    }}
                  >
                    {os.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .decorative-os-art {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          height: 105px;
          max-width: 36%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          pointer-events: none;
          opacity: 0.26;
          z-index: 0;
          transition: all 0.25s ease;
        }

        @media (max-width: 1440px) {
          .decorative-os-art {
            height: 90px;
            max-width: 30%;
            opacity: 0.22;
          }
        }

        @media (max-width: 1200px) {
          .decorative-os-art {
            height: 75px;
            max-width: 26%;
            opacity: 0.18;
          }
        }

        @media (max-width: 800px) {
          .decorative-os-art {
            display: none;
          }
        }

        .os-detail-row:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
        }

        @keyframes osShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .os-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: osShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }
      ` }} />
    </div>
  );
};

export default OperatingSystemChart;
