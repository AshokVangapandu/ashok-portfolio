/* src/admin/pages/analytics/components/VisitorComparisonCard.tsx */
import React, { useState, useEffect } from 'react';
import { VisitorComparison } from '../../../types/analytics';

interface VisitorComparisonCardProps {
  comparison: VisitorComparison | null;
  totalVisitors?: number;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const useAnimatedValue = (target: number, duration: number = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return value;
};

export const VisitorComparisonCard: React.FC<VisitorComparisonCardProps> = ({
  comparison,
  totalVisitors,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const newPct = comparison?.newPercentage ?? 0;
  const returningPct = comparison?.returningPercentage ?? 0;

  const animatedNew = useAnimatedValue(newPct);
  const animatedReturning = useAnimatedValue(returningPct);

  // Derive counts proportionally from totalVisitors if available
  const newVisitorCount = totalVisitors !== undefined
    ? Math.round((newPct / 100) * totalVisitors)
    : (newPct > 0 ? 1 : 0);

  const returningVisitorCount = totalVisitors !== undefined
    ? Math.round((returningPct / 100) * totalVisitors)
    : (returningPct > 0 ? 1 : 0);

  const parseTrend = (trendStr: string | undefined | null) => {
    if (!trendStr) {
      return {
        text: '0.0%',
        arrow: '',
        color: '#64748B',
        bg: '#F1F5F9',
      };
    }

    const cleanStr = trendStr.trim();
    const isNegative = cleanStr.startsWith('-');
    const isZero =
      cleanStr === '0%' ||
      cleanStr === '+0.0%' ||
      cleanStr === '-0.0%' ||
      cleanStr === '0.0%' ||
      cleanStr === '0' ||
      parseFloat(cleanStr) === 0;

    if (isZero) {
      return {
        text: '0.0%',
        arrow: '',
        color: '#64748B',
        bg: '#F1F5F9',
      };
    } else if (isNegative) {
      return {
        text: cleanStr,
        arrow: '▼',
        color: '#DC2626',
        bg: '#FEE2E2',
      };
    } else {
      const displayStr = cleanStr.startsWith('+') ? cleanStr : `+${cleanStr}`;
      return {
        text: displayStr,
        arrow: '▲',
        color: '#16A34A',
        bg: '#DCFCE7',
      };
    }
  };

  const trendObj = parseTrend(comparison?.returningTrend || comparison?.newTrend);

  return (
    <div
      className="visitor-comparison-card"
      style={{
        flex: 1.5,
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          gap: '12px',
        }}
      >
        {/* Left: Icon Box + Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Softly Rounded Square Purple Icon Box */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '13px',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.06)',
            }}
          >
            {/* Users Icon */}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '17px',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              New vs Returning Visitors
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#64748B',
                lineHeight: 1.2,
              }}
            >
              Share of first-time and returning visitors
            </p>
          </div>
        </div>

        {/* Right: Info Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: '1.5px solid #94A3B8',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9.5px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            i
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#64748B' }}>
            Based on unique visitors
          </span>
        </div>
      </div>

      {/* Content Area */}
      {error ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '140px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>
            Failed to load visitor comparison data.
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', padding: '8px 0' }}>
          <div className="vc-shimmer" style={{ height: '60px', borderRadius: '12px', width: '100%' }} />
          <div className="vc-shimmer" style={{ height: '10px', borderRadius: '6px', width: '100%' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {/* Metrics Row: 2 Clean Aligned Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            {/* Column 1: New Visitors */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#DDD6FE',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#64748B' }}>
                  New Visitors
                </span>
              </div>

              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  margin: '2px 0 6px 0',
                }}
              >
                {animatedNew}%
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>
                {/* User Icon */}
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>
                  {newVisitorCount} {newVisitorCount === 1 ? 'visitor' : 'visitors'}
                </span>
              </div>
            </div>

            {/* Column 2: Returning Visitors */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#7C3AED',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#64748B' }}>
                  Returning Visitors
                </span>
              </div>

              {/* Number + Trend Badge side by side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '2px 0 6px 0' }}>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                  }}
                >
                  {animatedReturning}%
                </span>

                {trendObj && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: trendObj.bg,
                        color: trendObj.color,
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {trendObj.arrow && <span style={{ fontSize: '10px' }}>{trendObj.arrow}</span>}
                      <span>{trendObj.text}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '3px' }}>
                      vs last period
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>
                {/* User Icon */}
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span>
                  {returningVisitorCount} {returningVisitorCount === 1 ? 'visitor' : 'visitors'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Scale */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '20px 0 16px 0' }}>
            <div
              style={{
                height: '10px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                overflow: 'hidden',
                display: 'flex',
              }}
            >
              {/* New Visitors segment */}
              <div
                style={{
                  width: mounted ? `${newPct}%` : '0%',
                  height: '100%',
                  backgroundColor: '#DDD6FE',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              {/* Returning Visitors segment */}
              <div
                style={{
                  width: mounted ? `${returningPct}%` : '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #9333EA 0%, #7C3AED 100%)',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>0%</span>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>100%</span>
            </div>
          </div>

          {/* Bottom Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#DDD6FE', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>New Visitors</span>
            </div>

            <span style={{ width: '1px', height: '12px', backgroundColor: '#E2E8F0', display: 'inline-block' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#7C3AED', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>Returning Visitors</span>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vcShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .vc-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: vcShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }
      ` }} />
    </div>
  );
};

export default VisitorComparisonCard;
