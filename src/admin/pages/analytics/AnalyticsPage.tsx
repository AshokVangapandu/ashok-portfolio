/* src/admin/pages/analytics/AnalyticsPage.tsx */
import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsFilters } from './components/AnalyticsFilters';
import { AnalyticsListView } from './components/AnalyticsListView';
import { AnalyticsGridView } from './components/AnalyticsGridView';
import { VisitorDetailsModal } from './components/VisitorDetailsModal';
import { AnalyticsSkeleton } from './components/AnalyticsSkeleton';
import { AnalyticsVisitor } from '../../types/analytics';

export const AnalyticsPage: React.FC = () => {
  const [selectedVisitor, setSelectedVisitor] = useState<AnalyticsVisitor | null>(null);

  const {
    loading,
    timeRange,
    setTimeRange,
    viewMode,
    setViewMode,
    trendMode,
    setTrendMode,
    
    // List state bindings
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    visitors,
    totalVisitorsCount,
    
    // Data states
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
    error,
    refresh
  } = useAnalytics();

  // Loading skeleton state evaluation
  const isSkeleton = loading && !summary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-6)', boxSizing: 'border-box' }}>
      
      {/* 1. Header controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
        <AnalyticsHeader />
        
        <AnalyticsFilters
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={refresh}
        />
      </div>

      {/* 2. Main presentation views with transition wrappers */}
      {isSkeleton ? (
        <AnalyticsSkeleton />
      ) : (
        <div
          key={viewMode} // Re-mount or re-render to trigger smooth keyframe fade animations
          style={{
            animation: 'viewFadeIn 250ms ease-out',
            boxSizing: 'border-box'
          }}
        >
          {viewMode === 'list' ? (
            <AnalyticsListView
              visitors={visitors}
              totalCount={totalVisitorsCount}
              search={search}
              setSearch={setSearch}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              onRefresh={refresh}
              onViewDetails={setSelectedVisitor}
            />
          ) : (
            <AnalyticsGridView
              summary={summary}
              trends={trends}
              activities={activities}
              locations={locations}
              sources={sources}
              devices={devices}
              browsers={browsers}
              operatingSystems={operatingSystems}
              visitorComparison={visitorComparison}
              peakHours={peakHours}
              loading={loading}
              error={error}
              timeRange={timeRange}
              trendMode={trendMode}
              setTrendMode={setTrendMode}
              onRetry={refresh}
            />
          )}
        </div>
      )}

      {/* 3. Detailed inspection modal overlay */}
      <VisitorDetailsModal
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
      />

      {/* Embedded view transition keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes viewFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AnalyticsPage;
