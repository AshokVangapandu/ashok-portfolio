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

// Animated value counting hook
const useAnimatedValue = (targetValue: string | number, loading: boolean, duration = 800) => {
  const [displayValue, setDisplayValue] = useState<string | number>(targetValue);
  const prevValueRef = useRef<string | number>(targetValue);

  const parseVal = (val: string | number): { type: 'duration' | 'number' | 'text'; numericVal: number; rawText?: string } => {
    const str = val.toString().trim();
    const durationRegex = /^(?:(\d+)m\s*)?(\d+)s$/i;
    const durationMatch = str.match(durationRegex);
    if (durationMatch) {
      const mins = durationMatch[1] ? parseInt(durationMatch[1], 10) : 0;
      const secs = parseInt(durationMatch[2], 10);
      return { type: 'duration', numericVal: mins * 60 + secs };
    }
    const cleaned = str.replace(/,/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num) && isFinite(num)) {
      return { type: 'number', numericVal: num };
    }
    return { type: 'text', numericVal: 0, rawText: str };
  };

  const formatVal = (numericVal: number, type: 'duration' | 'number' | 'text', rawText = ''): string => {
    if (type === 'text') return rawText;
    if (type === 'duration') {
      const totalSecs = Math.round(numericVal);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      if (mins > 0) return `${mins}m ${secs}s`;
      return `${secs}s`;
    }
    return Math.round(numericVal).toLocaleString();
  };

  useEffect(() => {
    if (loading) return; // Do not animate while loading state is active

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
      setDisplayValue(targetValue);
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
  }, [targetValue, loading, duration]);

  return displayValue;
};

// Locally scoped Stat Card component (with animation, skeleton loaders, and memoization)
const KPIStatCard: React.FC<{
  index: number;
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  loading?: boolean;
}> = React.memo(({ index, title, value, trend, icon, loading = false }) => {
  const displayValue = useAnimatedValue(value, loading);
  const animationDelay = `${index * 80}ms`;

  return (
    <div
      className="premium-kpi-card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        minWidth: '160px',
        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        animationDelay,
      }}
      onMouseOver={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="kpi-icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div className="kpi-skeleton kpi-skeleton-icon" />
          ) : (
            <div
              className="kpi-icon-content"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(124, 58, 237, 0.08)',
                color: 'var(--admin-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="kpi-trend-container">
          {loading ? (
            <div className="kpi-skeleton kpi-skeleton-trend" />
          ) : (
            <span
              key={trend}
              className="kpi-trend-badge"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--admin-primary)',
                backgroundColor: 'rgba(124, 58, 237, 0.06)',
                padding: '4px 10px',
                borderRadius: '12px',
                display: 'inline-block'
              }}
            >
              {trend}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {loading ? (
          <div className="kpi-skeleton kpi-skeleton-value" />
        ) : (
          <span
            className="kpi-value-text"
            style={{ fontSize: '24px', fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.02em' }}
          >
            {displayValue}
          </span>
        )}

        {loading ? (
          <div className="kpi-skeleton kpi-skeleton-label" />
        ) : (
          <span
            className="kpi-label-text"
            style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}
          >
            {title}
          </span>
        )}
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
            trend={summary.trends.totalVisitors}
            icon={totalVisitorsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={1}
            title="Unique Visitors"
            value={summary.uniqueVisitors}
            trend={summary.trends.uniqueVisitors}
            icon={uniqueVisitorsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={2}
            title="Avg Session"
            value={summary.avgSessionTime}
            trend={summary.trends.avgSessionTime}
            icon={avgSessionIcon}
            loading={loading}
          />
          <KPIStatCard
            index={3}
            title="Form Submissions"
            value={summary.formSubmissions}
            trend={summary.trends.formSubmissions}
            icon={formSubmissionsIcon}
            loading={loading}
          />
          <KPIStatCard
            index={4}
            title="Testimonials"
            value={summary.testimonialsCount}
            trend={summary.trends.testimonialsCount}
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
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <BrowserChart
          browsers={browsers}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
        <OperatingSystemChart
          operatingSystems={operatingSystems}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </div>

      {/* 5. Comparison & Heatmaps row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%', marginBottom: '24px' }}>
        <VisitorComparisonCard
          comparison={visitorComparison}
          loading={loading}
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
