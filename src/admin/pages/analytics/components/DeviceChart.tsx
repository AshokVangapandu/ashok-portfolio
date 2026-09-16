/* src/admin/pages/analytics/components/DeviceChart.tsx */
import React, { useState, useEffect } from 'react';
import devicesDecorImg from '../../../../../assets/images/analytics-devices-decor.png';
import { AnalyticsDevice } from '../../../types/analytics';

interface DeviceChartProps {
  devices: AnalyticsDevice[];
  totalVisitors?: number;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface ProcessedDeviceRow {
  name: 'Desktop' | 'Mobile' | 'Others';
  percentage: number;
  visits: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export const DeviceChart: React.FC<DeviceChartProps> = ({
  devices = [],
  totalVisitors,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Consolidate data into Desktop, Mobile, and Others (including Tablet)
  const desktopItem = devices.find((d) => d.name.toLowerCase() === 'desktop');
  const mobileItem = devices.find((d) => d.name.toLowerCase() === 'mobile');
  const otherItems = devices.filter(
    (d) => !['desktop', 'mobile'].includes(d.name.toLowerCase())
  );

  const rawDesktopCount = Number((desktopItem as any)?.count ?? (desktopItem as any)?.visits ?? 0);
  const rawMobileCount = Number((mobileItem as any)?.count ?? (mobileItem as any)?.visits ?? 0);
  const rawOthersCount = otherItems.reduce(
    (sum, d) => sum + Number((d as any)?.count ?? (d as any)?.visits ?? 0),
    0
  );

  // Percentage calculations
  let desktopPct = desktopItem?.percentage ?? 0;
  let mobilePct = mobileItem?.percentage ?? 0;
  let othersPct = otherItems.reduce((sum, d) => sum + (d.percentage || 0), 0);

  const sumCounts = rawDesktopCount + rawMobileCount + rawOthersCount;
  const effectiveTotal = typeof totalVisitors === 'number' && totalVisitors > 0
    ? totalVisitors
    : sumCounts > 0
    ? sumCounts
    : 14;

  // If percentages are 0 but counts exist, calculate dynamically
  if (desktopPct === 0 && mobilePct === 0 && othersPct === 0 && sumCounts > 0) {
    desktopPct = Math.round((rawDesktopCount / sumCounts) * 100);
    mobilePct = Math.round((rawMobileCount / sumCounts) * 100);
    othersPct = Math.max(0, 100 - (desktopPct + mobilePct));
  }

  // Calculate visits for each category (using raw counts or derived from percentage)
  const desktopVisits = rawDesktopCount > 0
    ? rawDesktopCount
    : Math.round((desktopPct / 100) * effectiveTotal);

  const mobileVisits = rawMobileCount > 0
    ? rawMobileCount
    : Math.round((mobilePct / 100) * effectiveTotal);

  const othersVisits = rawOthersCount > 0
    ? rawOthersCount
    : Math.max(0, effectiveTotal - (desktopVisits + mobileVisits));

  // Determine dominant category for donut center callout
  let dominantName = 'Desktop';
  let dominantPct = desktopPct;
  if (mobilePct > dominantPct) {
    dominantName = 'Mobile';
    dominantPct = mobilePct;
  }
  if (othersPct > dominantPct) {
    dominantName = 'Others';
    dominantPct = othersPct;
  }

  // Icons
  const desktopIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );

  const mobileIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );

  const othersIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );

  const deviceRows: ProcessedDeviceRow[] = [
    {
      name: 'Desktop',
      percentage: desktopPct,
      visits: desktopVisits,
      icon: desktopIcon,
      iconBg: '#F3E8FF',
      iconColor: '#7C3AED',
    },
    {
      name: 'Mobile',
      percentage: mobilePct,
      visits: mobileVisits,
      icon: mobileIcon,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
    },
    {
      name: 'Others',
      percentage: othersPct,
      visits: othersVisits,
      icon: othersIcon,
      iconBg: '#F3E8FF',
      iconColor: '#7C3AED',
    },
  ];

  // Donut SVG parameters - compact, responsive dimensions
  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const center = 48;

  const desktopStroke = (desktopPct / 100) * circumference;
  const mobileStroke = (mobilePct / 100) * circumference;
  const othersStroke = (othersPct / 100) * circumference;

  return (
    <div
      className="device-distribution-card"
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
          {desktopIcon}
        </div>

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
            Device Distribution
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
            Devices used to visit your portfolio
          </p>
        </div>
      </div>

      {/* Content Section */}
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
            Failed to load device analytics.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="dev-shimmer" style={{ width: '96px', height: '96px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="dev-shimmer" style={{ width: '70px', height: '12px', borderRadius: '4px' }} />
              <div className="dev-shimmer" style={{ width: '50px', height: '24px', borderRadius: '6px' }} />
              <div className="dev-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="dev-shimmer"
                style={{ height: '52px', borderRadius: '16px' }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          {/* Upper Visual Area: Compact Donut + Total Visits + Right-anchored Decorative Artwork */}
          <div
            className="device-upper-visual"
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

                  {/* Desktop arc (Primary Purple) */}
                  {desktopPct > 0 && (
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke="#7C3AED"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${desktopStroke} ${circumference}`}
                      strokeDashoffset={mounted ? 0 : circumference}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  )}

                  {/* Mobile arc (Sky Blue) */}
                  {mobilePct > 0 && (
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke="#38BDF8"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${mobileStroke} ${circumference}`}
                      strokeDashoffset={mounted ? -desktopStroke : circumference}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  )}

                  {/* Others arc (Pastel Lavender) */}
                  {othersPct > 0 && (
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="transparent"
                      stroke="#C084FC"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${othersStroke} ${circumference}`}
                      strokeDashoffset={mounted ? -(desktopStroke + mobileStroke) : circumference}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  )}
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
                    {dominantPct}%
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#64748B',
                      marginTop: '2px',
                      lineHeight: 1,
                    }}
                  >
                    {dominantName}
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

            {/* Right Side: Responsive Decorative Device Artwork */}
            <div
              className="decorative-device-art"
              aria-hidden="true"
            >
              <img
                src={devicesDecorImg}
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

          {/* Lower Section: Exactly 3 Device Detail Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', zIndex: 1 }}>
            {deviceRows.map((row) => (
              <div
                key={row.name}
                className="device-detail-row"
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
                {/* 1. Icon */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: row.iconBg,
                    color: row.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {row.icon}
                </div>

                {/* 2. Device Name & Visits */}
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
                    }}
                  >
                    {row.name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#64748B',
                      lineHeight: 1.2,
                    }}
                  >
                    {row.visits} {row.visits === 1 ? 'Visit' : 'Visits'}
                  </span>
                </div>

                {/* 3. Progress Bar */}
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
                      width: mounted ? `${Math.min(100, Math.max(row.percentage > 0 ? 3 : 0, row.percentage))}%` : '0%',
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>

                {/* 4. Percentage Callout */}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#7C3AED',
                    width: '42px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {row.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .decorative-device-art {
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
          .decorative-device-art {
            height: 90px;
            max-width: 30%;
            opacity: 0.22;
          }
        }

        @media (max-width: 1200px) {
          .decorative-device-art {
            height: 75px;
            max-width: 26%;
            opacity: 0.18;
          }
        }

        @media (max-width: 800px) {
          .decorative-device-art {
            display: none;
          }
        }

        .device-detail-row:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
        }

        @keyframes devShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .dev-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: devShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }
      ` }} />
    </div>
  );
};

export default DeviceChart;
