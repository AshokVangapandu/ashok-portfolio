/* src/admin/pages/analytics/components/AnalyticsGridView.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { TrendChart } from './TrendChart';
import { ActivityFeed } from './ActivityFeed';
import { CountryDistribution } from './CountryDistribution';
import { TrafficSourceList } from './TrafficSourceList';
import { DeviceChart } from './DeviceChart';
import { BrowserChart } from './BrowserChart';
import { OperatingSystemChart } from './OperatingSystemChart';
import { VisitorComparisonCard } from './VisitorComparisonCard';
import { PeakHoursHeatmap } from './PeakHoursHeatmap';
import {
  AnalyticsSummary,
  AnalyticsTrend,
  AnalyticsActivity,
  AnalyticsLocation,
  AnalyticsSource,
  AnalyticsDevice,
  AnalyticsBrowser,
  AnalyticsOperatingSystem,
  VisitorComparison,
  PeakHours
} from '../../../types/analytics';

// Easing helper
const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

//// Dedicated duration formatter: strips seconds completely, formats >=60m as e.g. "1h 8m", <60m as "Xm"
export const formatSessionDuration = (val: string | number | null | undefined): string => {
  if (val === undefined || val === null || val === '') return '0m';

  // If number (seconds)
  if (typeof val === 'number') {
    if (val <= 0) return '0m';
    const totalMins = Math.floor(val / 60);
    if (totalMins >= 60) {
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${Math.max(1, totalMins)}m`;
  }

  const str = val.toString().trim();
  if (!str || str === '0' || str === '0s' || str === '0m') return '0m';

  // Check for hours, minutes, seconds in text (e.g. "1h 8m 15s", "13m 13s", "13 mins", "1 hour 8 mins", "45s")
  const hMatch = str.match(/(\d+)\s*(?:h|hr|hour|hours)/i);
  const mMatch = str.match(/(\d+)\s*(?:m|min|minute|minutes)/i);
  const sMatch = str.match(/(\d+)\s*(?:s|sec|second|seconds)/i);

  if (hMatch || mMatch || sMatch) {
    const hrs = hMatch ? parseInt(hMatch[1], 10) : 0;
    const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
    const totalMins = hrs * 60 + mins;

    if (totalMins >= 60) {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    if (totalMins === 0 && sMatch) {
      // If only seconds under a minute, e.g. "45s" -> show "<1m" or "1m"
      return '<1m';
    }
    return `${Math.max(1, totalMins)}m`;
  }

  // Handle "MM:SS" or "HH:MM:SS"
  if (str.includes(':')) {
    const parts = str.split(':').map(Number);
    if (parts.length === 2) {
      const mins = parts[0] || 0;
      if (mins >= 60) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
      }
      return `${Math.max(1, mins)}m`;
    }
    if (parts.length === 3) {
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const totalMins = h * 60 + m;
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  }

  const num = parseFloat(str.replace(/,/g, ''));
  if (!isNaN(num) && isFinite(num)) {
    const totalMins = Math.floor(num / 60);
    if (totalMins >= 60) {
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${Math.max(1, totalMins)}m`;
  }

  return str;
};

/// Animated value counting hook with duration handling
const useAnimatedValue = (targetValue: string | number, isDuration: boolean = false, loading: boolean = false, duration = 800) => {
  const [displayValue, setDisplayValue] = useState<string | number>(() => {
    return isDuration ? formatSessionDuration(targetValue) : targetValue;
  });
  const prevValueRef = useRef<string | number>(targetValue);

  const parseVal = (val: string | number): { type: 'duration' | 'number' | 'text'; numericVal: number; rawText?: string } => {
    if (isDuration) {
      const str = val.toString().trim();
      const hmsRegex = /^(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)?$/i;
      const match = str.match(hmsRegex);
      if (match && (match[1] || match[2] || match[3])) {
        const hrs = match[1] ? parseInt(match[1], 10) : 0;
        const mins = match[2] ? parseInt(match[2], 10) : 0;
        const secs = match[3] ? parseInt(match[3], 10) : 0;
        return { type: 'duration', numericVal: hrs * 3600 + mins * 60 + secs };
      }
    }
    const cleaned = val.toString().replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    if (!isNaN(num) && isFinite(num)) {
      return { type: 'number', numericVal: num };
    }
    return { type: 'text', numericVal: 0, rawText: val.toString() };
  };

  const formatVal = (numericVal: number, type: 'duration' | 'number' | 'text', rawText = ''): string => {
    if (type === 'text') return rawText;
    if (isDuration || type === 'duration') {
      const totalSecs = Math.round(numericVal);
      const totalMins = Math.round(totalSecs / 60);
      if (totalMins >= 60) {
        const hours = Math.floor(totalMins / 60);
        const remainingMins = totalMins % 60;
        return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
      }
      return `${Math.max(1, totalMins)}m`;
    }
    return Math.round(numericVal).toLocaleString();
  };

  useEffect(() => {
    if (loading) return;

    if (isDuration) {
      setDisplayValue(formatSessionDuration(targetValue));
      prevValueRef.current = targetValue;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const startInfo = parseVal(prevValueRef.current);
    const endInfo = parseVal(targetValue);

    if (startInfo.type === 'text' || endInfo.type === 'text' || startInfo.type !== endInfo.type) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const startVal = startInfo.numericVal;
    const endVal = endInfo.numericVal;

    if (startVal === endVal) {
      setDisplayValue(isDuration ? formatSessionDuration(targetValue) : targetValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = startVal + (endVal - startVal) * easedProgress;

      setDisplayValue(formatVal(currentVal, endInfo.type, endInfo.rawText));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, loading, isDuration, duration]);

  return displayValue;
};

///// Card color, subtle ambient background tint & terrain graph configurations matching Image 1
const KPI_THEMES = [
  {
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(224, 242, 254, 0.35) 100%)',
    borderColor: 'rgba(186, 230, 254, 0.7)',
    gradStart: '#38BDF8',
    gradMid: '#7DD3FC',
    gradEnd: '#BAE6FD',
  },
  {
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(243, 232, 255, 0.35) 100%)',
    borderColor: 'rgba(233, 213, 255, 0.7)',
    gradStart: '#A855F7',
    gradMid: '#C084FC',
    gradEnd: '#E9D5FF',
  },
  {
    iconBg: '#DCFCE7',
    iconColor: '#10B981',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(220, 252, 231, 0.35) 100%)',
    borderColor: 'rgba(167, 243, 208, 0.7)',
    gradStart: '#34D399',
    gradMid: '#6EE7B7',
    gradEnd: '#A7F3D0',
  },
  {
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(255, 228, 230, 0.35) 100%)',
    borderColor: 'rgba(254, 205, 211, 0.7)',
    gradStart: '#FB7185',
    gradMid: '#FDA4AF',
    gradEnd: '#FECDD3',
  },
  {
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(254, 243, 199, 0.35) 100%)',
    borderColor: 'rgba(253, 230, 138, 0.7)',
    gradStart: '#FBBF24',
    gradMid: '#FCD34D',
    gradEnd: '#FEF3C7',
  },
];

// Locally scoped Stat Card component (with animation, skeleton loaders, and memoization)
const KPIStatCard: React.FC<{
  index: number;
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  isDuration?: boolean;
  loading?: boolean;
}> = React.memo(({ index, title, value, icon, isDuration = false, loading = false }) => {
  const displayValue = useAnimatedValue(value, isDuration, loading);
  const animationDelay = `${index * 60}ms`;
  const theme = KPI_THEMES[index % KPI_THEMES.length];

  return (
    <div
      className="premium-kpi-card"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.borderColor}`,
        borderRadius: '18px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        minWidth: '160px',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        animationDelay,
      }}
      onMouseOver={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(0, 0, 0, 0.06)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(0, 0, 0, 0.03)';
      }}
    >
      {/* 2 soft, lighter multi-layered terrain graph hills in bottom right */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '52%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`kpi-layer1-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.gradStart} stopOpacity="0.16" />
            <stop offset="60%" stopColor={theme.gradMid} stopOpacity="0.05" />
            <stop offset="100%" stopColor={theme.gradEnd} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={`kpi-layer2-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.gradStart} stopOpacity="0.26" />
            <stop offset="65%" stopColor={theme.gradMid} stopOpacity="0.08" />
            <stop offset="100%" stopColor={theme.gradEnd} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Layer 1 (Back / Soft gentle crest) */}
        <path
          d="M 0 100 C 40 100 70 45 110 40 C 145 35 170 55 200 32 L 200 100 L 0 100 Z"
          fill={`url(#kpi-layer1-${index})`}
        />

        {/* Layer 2 (Front / Subtle rolling curve) */}
        <path
          d="M 45 100 C 80 100 115 58 150 52 C 172 48 188 58 200 48 L 200 100 L 45 100 Z"
          fill={`url(#kpi-layer2-${index})`}
        />
      </svg>

      {/* Main Content: Row layout with Icon on left and Value + Label on right */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
        }}
      >
        {/* Left: Clean pleasant Icon box (no heavy shadow) */}
        <div className="kpi-icon-container" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div className="kpi-skeleton kpi-skeleton-icon" style={{ width: '44px', height: '44px', borderRadius: '14px' }} />
          ) : (
            <div
              className="kpi-icon-content"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: theme.iconBg,
                color: theme.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Right: Value (top) & Title (bottom) group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          {loading ? (
            <>
              <div className="kpi-skeleton kpi-skeleton-value" style={{ width: '48px', height: '22px' }} />
              <div className="kpi-skeleton kpi-skeleton-label" style={{ width: '75px', height: '12px', marginTop: '2px' }} />
            </>
          ) : (
            <>
              <span
                className="kpi-value-text"
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.2',
                }}
              >
                {displayValue}
              </span>
              <span
                className="kpi-label-text"
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                {title}
              </span>
            </>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kpiCardReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .premium-kpi-card {
          opacity: 0;
          animation: kpiCardReveal 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes badgeReveal {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kpi-trend-badge {
          animation: badgeReveal 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes kpiShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .kpi-skeleton {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: kpiShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }

        .kpi-skeleton-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
        }

        .kpi-skeleton-trend {
          width: 50px;
          height: 18px;
          border-radius: 12px;
        }

        .kpi-skeleton-value {
          width: 80px;
          height: 28px;
          border-radius: 6px;
          margin-top: 4px;
          margin-bottom: 2px;
        }

        .kpi-skeleton-label {
          width: 100px;
          height: 16px;
          border-radius: 4px;
          margin-top: 3px;
        }

        @keyframes kpiFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .kpi-icon-content, .kpi-value-text, .kpi-label-text {
          animation: kpiFadeIn 300ms ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-kpi-card {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .kpi-trend-badge, .kpi-icon-content, .kpi-value-text, .kpi-label-text {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .kpi-skeleton {
            animation: none !important;
            background: #E2E8F0 !important;
          }
        }
      ` }} />
    </div>
  );
});

interface AnalyticsGridViewProps {
  summary: AnalyticsSummary | null;
  trends: AnalyticsTrend[];
  activities: AnalyticsActivity[];
  locations: AnalyticsLocation[];
  sources: AnalyticsSource[];
  devices: AnalyticsDevice[];
  browsers: AnalyticsBrowser[];
  operatingSystems: AnalyticsOperatingSystem[];
  visitorComparison: VisitorComparison | null;
  peakHours: PeakHours[];
  loading: boolean;
  error?: boolean;
  timeRange: string;
  trendMode: 'daily' | 'weekly' | 'monthly';
  setTrendMode: (val: 'daily' | 'weekly' | 'monthly') => void;
  onRetry?: () => void;
}

export const AnalyticsGridView: React.FC<AnalyticsGridViewProps> = ({
  summary,
  trends,
  activities,
  locations,
  sources,
  devices,
  browsers,
  operatingSystems,
  visitorComparison,
  peakHours,
  loading,
  error = false,
  timeRange,
  trendMode,
  setTrendMode,
  onRetry,
}) => {
  // SVGs definitions
  const totalVisitorsIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const uniqueVisitorsIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const avgSessionIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const formSubmissionsIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const testimonialsIcon = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Summary KPI row */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <KPIStatCard
            index={0}
            title="Total Visitors"
            value={summary.totalVisitors}
            icon={totalVisitorsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={1}
            title="Unique Visitors"
            value={summary.uniqueVisitors}
            icon={uniqueVisitorsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={2}
            title="Avg Session"
            value={summary.avgSessionTime}
            icon={avgSessionIcon}
            isDuration={true}
            loading={loading}
          />
          <KPIStatCard
            index={3}
            title="Form Submissions"
            value={summary.formSubmissions}
            icon={formSubmissionsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={4}
            title="Testimonials"
            value={summary.testimonialsCount}
            icon={testimonialsIcon}
            loading={loading}
          />
        </div>
      )}

      {/* 2. Trend & Activities row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        <TrendChart
          trends={trends}
          trendMode={trendMode}
          setTrendMode={setTrendMode}
          loading={loading}
          error={error}
          timeRange={timeRange}
          onRetry={onRetry}
        />
        <ActivityFeed
          activities={activities}
          loading={loading}
          error={error}
          timeRange={timeRange}
          onRetry={onRetry}
        />
      </div>

      {/* 3. Ranked Country & Sources lists */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        <CountryDistribution
          locations={locations}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <TrafficSourceList
          sources={sources}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </div>

      {/* 4. Device, Browser, OS row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        <DeviceChart
          devices={devices}
          totalVisitors={summary?.totalVisitors}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <BrowserChart
          browsers={browsers}
          totalVisitors={summary?.totalVisitors}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <OperatingSystemChart
          operatingSystems={operatingSystems}
          totalVisitors={summary?.totalVisitors}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </div>

      {/* 5. Comparison & Heatmaps row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%', marginBottom: '24px' }}>
        <VisitorComparisonCard
          comparison={visitorComparison}
          totalVisitors={summary?.totalVisitors}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <PeakHoursHeatmap
          peakHours={peakHours}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
};

export default AnalyticsGridView;
