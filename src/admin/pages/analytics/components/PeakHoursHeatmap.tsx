/* src/admin/pages/analytics/components/PeakHoursHeatmap.tsx */
import React, { useMemo, useState, useEffect } from 'react';
import { PeakHours } from '../../../types/analytics';

interface PeakHoursHeatmapProps {
  peakHours: PeakHours[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface TooltipState {
  show: boolean;
  hourText: string;
  countText: string;
  x: number;
  y: number;
}

// Generate the standard 24 hours (12A..11A, 12P..11P)
const DEFAULT_HOURS: string[] = [
  '12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
  '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'
];

const formatClockTime = (hourStr: string): string => {
  const match = /^(\d{1,2})(a|p)$/i.exec(hourStr);
  if (!match) return hourStr.toUpperCase();
  const num = match[1];
  const suffix = match[2].toLowerCase() === 'a' ? 'AM' : 'PM';
  return `${num}:00 ${suffix}`;
};

export const PeakHoursHeatmap: React.FC<PeakHoursHeatmapProps> = ({
  peakHours = [],
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map input peakHours to a full 24-hour array
  const fullHours = useMemo(() => {
    const dataMap = new Map<string, PeakHours>();
    (peakHours || []).forEach((item) => {
      if (item && item.hour) {
        dataMap.set(item.hour.toLowerCase(), item);
      }
    });

    return DEFAULT_HOURS.map((h) => {
      const existing = dataMap.get(h);
      return {
        hour: h,
        value: Number(existing?.value) || 0,
        count: typeof existing?.count === 'number' ? existing.count : undefined,
        label: existing?.label || formatClockTime(h),
      };
    });
  }, [peakHours]);

  const maxVal = Math.max(...fullHours.map((item) => item.value), 1);
  const maxCount = Math.max(...fullHours.map((item) => item.count || 0), 0);
  const hasActualCounts = fullHours.some((item) => typeof item.count === 'number');

  // Identify the peak/highest hour
  const peakMetric = hasActualCounts ? maxCount : maxVal;
  const isPeakHour = (h: { hour: string; value: number; count?: number }) => {
    if (peakMetric <= 0) return false;
    const currentMetric = hasActualCounts ? h.count || 0 : h.value;
    return currentMetric === peakMetric && currentMetric > 0;
  };

  const firstRow = fullHours.slice(0, 12);
  const secondRow = fullHours.slice(12, 24);

  // Dynamic intensity styling
  const getCellStyles = (h: { hour: string; value: number; count?: number }) => {
    const isPeak = isPeakHour(h);
    if (isPeak) {
      return {
        background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
        color: '#FFFFFF',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.28)',
      };
    }

    if (h.value === 0 && (!h.count || h.count === 0)) {
      return {
        background: '#F8FAFC',
        color: '#64748B',
        border: '1px solid rgba(226, 232, 240, 0.75)',
        boxShadow: 'none',
      };
    }

    const ratio = Math.min(h.value / maxVal, 1);
    if (ratio >= 0.75) {
      return {
        background: '#A78BFA',
        color: '#FFFFFF',
        border: '1px solid rgba(167, 139, 250, 0.5)',
        boxShadow: 'none',
      };
    }
    if (ratio >= 0.45) {
      return {
        background: '#DDD6FE',
        color: '#0F172A',
        border: '1px solid rgba(221, 214, 254, 0.7)',
        boxShadow: 'none',
      };
    }
    return {
      background: '#F3E8FF',
      color: '#0F172A',
      border: '1px solid rgba(243, 232, 255, 0.9)',
      boxShadow: 'none',
    };
  };

  const renderHourCell = (h: { hour: string; value: number; count?: number; label: string }) => {
    const isPeak = isPeakHour(h);
    const styles = getCellStyles(h);
    const displayCount = typeof h.count === 'number' ? h.count : h.value;
    const visitsLabel = displayCount === 1 ? '1 Visit' : `${displayCount} Visits`;

    return (
      <div
        key={h.hour}
        className="hourly-card"
        style={{
          flex: 1,
          minWidth: '38px',
          height: '52px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          position: 'relative',
          cursor: 'pointer',
          background: styles.background,
          color: styles.color,
          border: styles.border,
          boxShadow: styles.boxShadow,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={() =>
          setTooltip({
            show: true,
            hourText: `${formatClockTime(h.hour)} (IST)`,
            countText: h.value > 0 ? visitsLabel : '0 Visits',
            x: 0,
            y: 0,
          })
        }
        onMouseLeave={() => setTooltip(null)}
        onMouseMove={(e) => {
          const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
          if (parentRect) {
            setTooltip((prev) =>
              prev
                ? {
                    ...prev,
                    x: e.clientX - parentRect.left,
                    y: e.clientY - parentRect.top - 10,
                  }
                : null
            );
          }
        }}
      >
        {/* Hour Label */}
        <span style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>
          {h.hour.toUpperCase()}
        </span>

        {/* Highlight Glowing Dot for Peak Hour */}
        {isPeak && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#22D3EE',
              boxShadow: '0 0 8px #22D3EE',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="peak-hours-card"
      style={{
        flex: 2,
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
      {/* Decorative subtle ambient wave in upper right header */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '45%',
          height: '110px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.45,
        }}
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="peak-wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path
          d="M 0 30 C 70 30 110 85 180 40 C 230 10 270 50 300 20 L 300 0 L 0 0 Z"
          fill="url(#peak-wave-grad)"
        />
      </svg>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          {/* Left: Icon Box + Title & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              {/* Clock Icon */}
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
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

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
                Peak Visiting Hours
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
                See when visitors are most active on your portfolio
              </p>
            </div>
          </div>

          {/* Right: Subtle Decorative Quote/Badge matching Reference */}
          <div
            className="peak-header-decor"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingRight: '6px',
            }}
          >
            {/* Mini 3 soft bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
              <div style={{ width: '4px', height: '8px', borderRadius: '2px', backgroundColor: '#DDD6FE' }} />
              <div style={{ width: '4px', height: '14px', borderRadius: '2px', backgroundColor: '#A78BFA' }} />
              <div style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: '#818CF8' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic', lineHeight: 1.2 }}>
                Every visit
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, fontStyle: 'italic', lineHeight: 1.2 }}>
                tells a story
              </span>
            </div>
          </div>
        </div>

        {/* Content Body: Error, Loading Skeleton, or 2-Row Heatmap */}
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
              Failed to load peak visiting hours.
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
            <div className="peak-shimmer" style={{ height: '52px', borderRadius: '12px', width: '100%' }} />
            <div className="peak-shimmer" style={{ height: '52px', borderRadius: '12px', width: '100%' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', overflowX: 'auto', paddingBottom: '2px' }}>
            {/* Row 1: 12A - 11A */}
            <div style={{ display: 'flex', gap: '10px', minWidth: '560px', width: '100%' }}>
              {firstRow.map(renderHourCell)}
            </div>

            {/* Row 2: 12P - 11P */}
            <div style={{ display: 'flex', gap: '10px', minWidth: '560px', width: '100%' }}>
              {secondRow.map(renderHourCell)}
            </div>

            {/* Bottom Footer: Legend on Left, Timezone on Right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Left: Visitor Activity Scale */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                  Visitor activity
                </span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', marginLeft: '4px' }}>
                  Low
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F8FAFC', border: '1px solid rgba(226, 232, 240, 0.9)' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F3E8FF' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#DDD6FE' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#A78BFA' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#4F46E5' }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>
                  Busy
                </span>
              </div>

              {/* Right: IST Timezone Clarification */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  i
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>
                  Times are shown in IST (Asia/Kolkata)
                </span>
              </div>
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
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            color: '#FFFFFF',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '11.5px',
            fontWeight: 700,
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{tooltip.hourText}</span>
          <span style={{ color: '#C4B5FD', fontWeight: 600 }}>{tooltip.countText}</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .hourly-card:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }

        @keyframes peakShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .peak-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: peakShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .peak-header-decor {
            display: none !important;
          }
        }
      ` }} />
    </div>
  );
};

export default PeakHoursHeatmap;
