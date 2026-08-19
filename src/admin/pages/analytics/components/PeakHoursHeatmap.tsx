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
  hour: string;
  label: string;
  value: number;
  count?: number;
  x: number;
  y: number;
}

const FALLBACK_TIMEZONE = 'Asia/Kolkata';
const IST_OFFSET_MINUTES = 5 * 60 + 30;

const formatHourLabel = (hour: string, label?: string) => {
  if (label && label !== hour) return label;

  const match = /^(\d{1,2})(a|p)$/i.exec(hour);
  if (!match) return hour.toUpperCase();

  const suffix = match[2].toLowerCase() === 'a' ? 'AM' : 'PM';
  return `${match[1]} ${suffix}`;
};

const pluralizeVisits = (count: number) => `${count} ${count === 1 ? 'visit' : 'visits'}`;

const parseHourBucketStartMinutes = (hour: string): number | null => {
  const match = /^(\d{1,2})(a|p)$/i.exec(hour);
  if (!match) return null;

  const hourNumber = Number(match[1]);
  const suffix = match[2].toLowerCase();
  const normalizedHour = suffix === 'a'
    ? hourNumber % 12
    : (hourNumber % 12) + 12;

  return normalizedHour * 60;
};

const formatClock = (totalMinutes: number) => {
  const minutesInDay = 24 * 60;
  const normalizedMinutes = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour24 = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const suffix = hour24 < 12 ? 'AM' : 'PM';
  const hour12 = hour24 % 12 || 12;
  const minuteText = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`;

  return `${hour12}${minuteText} ${suffix}`;
};

const getIstEstimateFromUtcBucket = (hour: string) => {
  const utcStartMinutes = parseHourBucketStartMinutes(hour);
  if (utcStartMinutes === null) return '';
  return formatClock(utcStartMinutes + IST_OFFSET_MINUTES);
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

  const normalizedHours = useMemo(() => {
    return (peakHours || []).map((item) => ({
      ...item,
      value: Number(item.value) || 0,
      count: typeof item.count === 'number' ? item.count : undefined,
      label: formatHourLabel(item.hour, item.label),
      timezone: item.timezone || '',
    }));
  }, [peakHours]);

  const hasActualCounts = normalizedHours.some((item) => typeof item.count === 'number');
  const maxVal = Math.max(...normalizedHours.map((item) => item.value), 1);
  const maxCount = Math.max(...normalizedHours.map((item) => item.count || 0), 0);
  const totalVisits = normalizedHours.reduce((sum, item) => sum + (item.count || 0), 0);
  const timezone = normalizedHours.find((item) => item.timezone)?.timezone || '';
  const isExactLocalTime = Boolean(timezone);
  const timezoneLabel = timezone
    ? timezone === FALLBACK_TIMEZONE ? 'IST' : timezone.replace('_', ' ')
    : 'UTC/server buckets';
  const timeSubtitle = isExactLocalTime
    ? `Local time - ${timezoneLabel}`
    : 'UTC/server buckets - IST estimate shown';

  const topHours = useMemo(() => {
    if (normalizedHours.length === 0) return [];

    const peakMetric = hasActualCounts ? maxCount : maxVal;
    if (peakMetric <= 0) return [];

    return normalizedHours.filter((item) => {
      const metric = hasActualCounts ? item.count || 0 : item.value;
      return metric === peakMetric;
    });
  }, [hasActualCounts, maxCount, maxVal, normalizedHours]);

  const visibleTopHours = topHours.slice(0, 2);
  const topHoursLabel = visibleTopHours.length > 0
    ? visibleTopHours.map((item) => isExactLocalTime ? item.label : `${item.hour.toUpperCase()} UTC`).join(' + ')
    : 'No peak yet';
  const topHoursEstimateLabel = !isExactLocalTime && visibleTopHours.length > 0
    ? `≈ ${visibleTopHours.map((item) => getIstEstimateFromUtcBucket(item.hour)).filter(Boolean).join(' + ')} IST`
    : '';

  const firstRow = normalizedHours.slice(0, 12);
  const secondRow = normalizedHours.slice(12);

  const getIntensityBackground = (value: number) => {
    if (value === 0) return '#F8FAFC';

    const ratio = Math.min(value / maxVal, 1);
    const opacity = mounted ? ratio : 0.2;

    if (ratio >= 0.85) {
      return `linear-gradient(135deg, rgba(124, 58, 237, ${opacity}) 0%, rgba(37, 99, 235, ${opacity}) 58%, rgba(6, 182, 212, ${opacity}) 100%)`;
    }

    if (ratio >= 0.45) {
      return `rgba(124, 58, 237, ${Math.max(opacity * 0.75, 0.35)})`;
    }

    return `rgba(167, 139, 250, ${Math.max(opacity * 0.6, 0.18)})`;
  };

  const getIntensityTextColor = (value: number) => {
    return value > maxVal * 0.45 ? '#FFFFFF' : 'var(--admin-text)';
  };

  const renderHourCell = (ph: PeakHours & { label: string; timezone: string }) => {
    const isPeak = topHours.some((item) => item.hour === ph.hour) && ph.value > 0;
    const displayCount = typeof ph.count === 'number' ? ph.count : undefined;

    return (
      <div
        key={ph.hour}
        style={{
          flex: 1,
          aspectRatio: '1',
          borderRadius: '8px',
          background: getIntensityBackground(ph.value),
          color: getIntensityTextColor(ph.value),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '4px',
          boxSizing: 'border-box',
          minWidth: '32px',
          position: 'relative',
          cursor: 'pointer',
          border: isPeak ? '1px solid rgba(14, 165, 233, 0.55)' : '1px solid rgba(15, 23, 42, 0.04)',
          boxShadow: isPeak ? '0 10px 22px rgba(37, 99, 235, 0.22)' : 'none',
          transition: 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease, box-shadow 0.15s ease'
        }}
        onMouseEnter={() => setTooltip({
          show: true,
          hour: ph.hour,
          label: isExactLocalTime ? ph.label : `${ph.label} UTC bucket`,
          value: ph.value,
          count: displayCount,
          x: 0,
          y: 0
        })}
        onMouseLeave={() => setTooltip(null)}
        onMouseMove={(e) => {
          const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
          if (parentRect) {
            setTooltip((prev) => prev ? {
              ...prev,
              x: e.clientX - parentRect.left,
              y: e.clientY - parentRect.top - 12
            } : null);
          }
        }}
      >
        <span style={{ fontSize: '9px', fontWeight: 800, opacity: 0.92 }}>{ph.hour.toUpperCase()}</span>
        {hasActualCounts && displayCount !== undefined && ph.value > 0 && (
          <span style={{ fontSize: '13px', fontWeight: 850, lineHeight: 1 }}>{displayCount}</span>
        )}
        {isPeak && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '5px',
              height: '5px',
              borderRadius: '999px',
              background: '#22D3EE',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.9)'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '320px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: '4px',
          background: 'linear-gradient(90deg, #7C3AED, #2563EB, #06B6D4)'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--admin-text)' }}>
            Peak Visiting Hours
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)', fontWeight: 650 }}>
            {timeSubtitle}
          </span>
        </div>

        {!loading && !error && normalizedHours.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.08))',
              border: '1px solid rgba(124, 58, 237, 0.18)',
              borderRadius: '10px',
              padding: '8px 12px',
              minWidth: '168px',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Busiest
              </span>
              <span style={{ fontSize: '13px', color: '#111827', fontWeight: 850 }}>
                {topHoursLabel}
              </span>
              {topHoursEstimateLabel && (
                <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700 }}>
                  {topHoursEstimateLabel}
                </span>
              )}
            </div>
            <div style={{ width: '1px', height: '26px', background: 'rgba(15, 23, 42, 0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {hasActualCounts ? 'Visits' : 'Score'}
              </span>
              <span style={{ fontSize: '13px', color: '#111827', fontWeight: 850 }}>
                {hasActualCounts ? totalVisits : `${maxVal}/10`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '140px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>
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
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="skeleton-cell" style={{ height: '132px', borderRadius: '10px' }} />
        ) : normalizedHours.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
              No peak hour analytics available yet.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', gap: '7px', minWidth: '520px', width: '100%' }}>
              {firstRow.map(renderHourCell)}
            </div>

            <div style={{ display: 'flex', gap: '7px', minWidth: '520px', width: '100%' }}>
              {secondRow.map(renderHourCell)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 700 }}>
                <span>Quiet</span>
                {[0, 2.5, 5, 7.5, 10].map((val) => (
                  <div
                    key={val}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '4px',
                      background: getIntensityBackground(val),
                      border: '1px solid rgba(15, 23, 42, 0.04)'
                    }}
                  />
                ))}
                <span>Busy</span>
              </div>

              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 650 }}>
                {hasActualCounts
                  ? 'Number = visits, color = relative traffic'
                  : 'Legacy UTC buckets. Apply migration for exact IST hours.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {tooltip && tooltip.show && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            color: '#FFFFFF',
            padding: '8px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap'
          }}
        >
          <span>{tooltip.label} {timezoneLabel}</span>
          {!isExactLocalTime && (
            <span style={{ color: '#BAE6FD' }}>
              ≈ {getIstEstimateFromUtcBucket(tooltip.hour)} IST
            </span>
          )}
          <span style={{ color: '#C4B5FD' }}>
            {typeof tooltip.count === 'number' ? pluralizeVisits(tooltip.count) : `Intensity ${tooltip.value}/10`}
          </span>
        </div>
      )}
    </div>
  );
};

export default PeakHoursHeatmap;
