/* src/admin/pages/analytics/components/BrowserChart.tsx */
import React, { useState, useEffect } from 'react';
import { AnalyticsBrowser } from '../../../types/analytics';

interface BrowserChartProps {
  browsers: AnalyticsBrowser[];
  totalVisitors?: number;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface BrowserVisualConfig {
  icon: React.ReactNode;
  bg: string;
  color: string;
}

const getBrowserVisualConfig = (name: string): BrowserVisualConfig => {
  const lower = (name || '').toLowerCase().trim();

  // Chrome
  if (lower.includes('chrome')) {
    return {
      bg: '#FFF7ED',
      color: '#EA580C',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#EA4335" />
          <path d="M12 2a10 10 0 0 1 8.66 5H12z" fill="#FBBC05" />
          <path d="M20.66 7A10 10 0 0 1 12 22l4.33-7.5z" fill="#34A853" />
          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
        </svg>
      ),
    };
  }

  // Safari
  if (lower.includes('safari')) {
    return {
      bg: '#EFF6FF',
      color: '#0284C7',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#0284C7" />
          <polygon points="12,5 15,12 12,19 9,12" fill="#FFFFFF" />
          <polygon points="12,5 15,12 12,12" fill="#EF4444" />
          <polygon points="12,19 9,12 12,12" fill="#E2E8F0" />
        </svg>
      ),
    };
  }

  // Edge
  if (lower.includes('edge') || lower.includes('microsoft')) {
    return {
      bg: '#F0FDFA',
      color: '#0D9488',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#0078D7" />
          <path d="M4 14c0 4 3 6 8 6 4 0 7-2 7-6 0-3-2-5-5-5-4 0-6 2-6 5 0 2 1 3 3 3 1 0 2 0 3-1" fill="none" stroke="#00C7B7" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    };
  }

  // Firefox
  if (lower.includes('firefox')) {
    return {
      bg: '#FFF7ED',
      color: '#EA580C',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#FF7139" />
          <path d="M12 4a8 8 0 0 0-8 8c0 4.4 3.6 8 8 8a8 8 0 0 0 7.5-5.2c-1.2.7-2.6.9-4 .5 2-1 3-3 3-5.3a6 6 0 0 0-6.5-6z" fill="#FFE885" />
          <circle cx="12" cy="12" r="4.5" fill="#00539F" />
        </svg>
      ),
    };
  }

  // Opera
  if (lower.includes('opera')) {
    return {
      bg: '#FEF2F2',
      color: '#DC2626',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="#FF1B2D" />
          <ellipse cx="12" cy="12" rx="4.5" ry="7" fill="#FFFFFF" />
        </svg>
      ),
    };
  }

  // Brave
  if (lower.includes('brave')) {
    return {
      bg: '#FFF7ED',
      color: '#F97316',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#FB542B" stroke="#FB542B" />
          <path d="M9 10h6M12 8v4" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      ),
    };
  }

  // Default / Other
  return {
    bg: '#F3E8FF',
    color: '#7C3AED',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  };
};

export const BrowserChart: React.FC<BrowserChartProps> = ({
  browsers = [],
  totalVisitors,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort browsers descending by percentage / count
  const sortedBrowsers = [...(browsers || [])]
    .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    .map((br, index) => ({
      ...br,
      rank: index + 1,
    }));

  const rawSumCounts = sortedBrowsers.reduce(
    (sum, br) => sum + Number((br as any).count ?? (br as any).visits ?? 0),
    0
  );

  const effectiveTotal = typeof totalVisitors === 'number' && totalVisitors > 0
    ? totalVisitors
    : rawSumCounts > 0
    ? rawSumCounts
    : 14;

  const topBrowser = sortedBrowsers.length > 0 ? sortedBrowsers[0] : null;

  return (
    <div
      className="browser-usage-card"
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
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Header Section with Title on left and Total Visits badge on right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '12px',
        }}
      >
        {/* Left: Icon + Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
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
            {/* Globe Icon */}
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>

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
              Browser Usage
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
              Browsers used to visit your portfolio
            </p>
          </div>
        </div>

        {/* Right: Compact Total Visits Summary Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            padding: '8px 14px',
            flexShrink: 0,
          }}
        >
          {/* Mini Bar Chart Icon */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 20v-4" />
              <path d="M12 20v-10" />
              <path d="M18 20v-7" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', lineHeight: 1 }}>
              Total Visits
            </span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {effectiveTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section: Error, Loading Skeleton, Empty State, or Rows */}
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
            Failed to load browser analytics.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="br-skeleton-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(241, 245, 249, 0.9)',
                borderRadius: '16px',
              }}
            >
              <div className="br-shimmer" style={{ width: '28px', height: '22px', borderRadius: '6px' }} />
              <div className="br-shimmer" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="br-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
                  <div className="br-shimmer" style={{ width: '50px', height: '12px', borderRadius: '4px' }} />
                </div>
                <div className="br-shimmer" style={{ width: '100%', height: '6px', borderRadius: '999px' }} />
              </div>
              <div className="br-shimmer" style={{ width: '48px', height: '26px', borderRadius: '20px' }} />
            </div>
          ))}
        </div>
      ) : sortedBrowsers.length === 0 ? (
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
            No browser analytics available yet.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {sortedBrowsers.map((br) => {
            const config = getBrowserVisualConfig(br.name);
            const rawCount = Number((br as any).count ?? (br as any).visits ?? 0);
            const visits = rawCount > 0
              ? rawCount
              : Math.max(1, Math.round(((br.percentage || 0) / 100) * effectiveTotal));

            return (
              <div
                key={br.name}
                className="browser-item-row"
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
                  #{br.rank}
                </span>

                {/* 2. Browser Icon Container */}
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

                {/* 3. Browser Name & Visits */}
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
                    title={br.name}
                  >
                    {br.name}
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
                      width: mounted ? `${Math.min(100, Math.max(br.percentage > 0 ? 3 : 0, br.percentage))}%` : '0%',
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>

                {/* 5. Percentage Badge */}
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
                  {br.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .browser-item-row:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
        }

        @keyframes brShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .br-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: brShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }
      ` }} />
    </div>
  );
};

export default BrowserChart;
