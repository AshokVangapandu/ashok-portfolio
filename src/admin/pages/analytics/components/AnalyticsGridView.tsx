/* src/admin/pages/analytics/components/AnalyticsGridView.tsx */
import React from 'react';
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

// Locally scoped Stat Card component
const KPIStatCard: React.FC<{
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
}> = ({ title, value, trend, icon }) => {
  return (
    <div
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
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.05)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
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
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--admin-primary)',
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
            padding: '4px 10px',
            borderRadius: '12px'
          }}
        >
          {trend}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
          {title}
        </span>
      </div>
    </div>
  );
};

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
  trendMode: 'daily' | 'weekly' | 'monthly';
  setTrendMode: (val: 'daily' | 'weekly' | 'monthly') => void;
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
  trendMode,
  setTrendMode,
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
            title="Total Visitors"
            value={summary.totalVisitors.toLocaleString()}
            trend={summary.trends.totalVisitors}
            icon={totalVisitorsIcon}
          />
          <KPIStatCard
            title="Unique Visitors"
            value={summary.uniqueVisitors.toLocaleString()}
            trend={summary.trends.uniqueVisitors}
            icon={uniqueVisitorsIcon}
          />
          <KPIStatCard
            title="Avg Session"
            value={summary.avgSessionTime}
            trend={summary.trends.avgSessionTime}
            icon={avgSessionIcon}
          />
          <KPIStatCard
            title="Form Submissions"
            value={summary.formSubmissions.toLocaleString()}
            trend={summary.trends.formSubmissions}
            icon={formSubmissionsIcon}
          />
          <KPIStatCard
            title="Testimonials"
            value={summary.testimonialsCount.toLocaleString()}
            trend={summary.trends.testimonialsCount}
            icon={testimonialsIcon}
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
        />
        <ActivityFeed
          activities={activities}
          loading={loading}
        />
      </div>

      {/* 3. Ranked Country & Sources lists */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        <CountryDistribution
          locations={locations}
          loading={loading}
        />
        <TrafficSourceList
          sources={sources}
          loading={loading}
        />
      </div>

      {/* 4. Device, Browser, OS row */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        <DeviceChart
          devices={devices}
          loading={loading}
        />
        <BrowserChart
          browsers={browsers}
          loading={loading}
        />
        <OperatingSystemChart
          operatingSystems={operatingSystems}
          loading={loading}
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
        />
      </div>
    </div>
  );
};

export default AnalyticsGridView;
