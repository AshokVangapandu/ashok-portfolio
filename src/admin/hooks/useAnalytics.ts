/* src/admin/hooks/useAnalytics.ts */
import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
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
  PeakHours,
  AnalyticsVisitor,
  VisitorSession
} from '../types/analytics';

export const useAnalytics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | '90days'>('7days');
  const [trendMode, setTrendMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Remember view mode during navigation using localStorage
  const [viewMode, setViewModeState] = useState<'list' | 'grid'>(() => {
    const cached = localStorage.getItem('admin_analytics_view_mode');
    return (cached === 'list' || cached === 'grid') ? cached : 'grid';
  });

  const setViewMode = (val: 'list' | 'grid') => {
    setViewModeState(val);
    localStorage.setItem('admin_analytics_view_mode', val);
  };

  // Search & Pagination for List View
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [visitorSessions, setVisitorSessions] = useState<VisitorSession[]>([]);
  const [totalVisitorsCount, setTotalVisitorsCount] = useState<number>(0);

  // Stats Data
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrend[]>([]);
  const [activities, setActivities] = useState<AnalyticsActivity[]>([]);
  const [locations, setLocations] = useState<AnalyticsLocation[]>([]);
  const [sources, setSources] = useState<AnalyticsSource[]>([]);
  const [devices, setDevices] = useState<AnalyticsDevice[]>([]);
  const [browsers, setBrowsers] = useState<AnalyticsBrowser[]>([]);
  const [operatingSystems, setOperatingSystems] = useState<AnalyticsOperatingSystem[]>([]);
  const [visitorComparison, setVisitorComparison] = useState<VisitorComparison | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHours[]>([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [
        sumData,
        trendData,
        actData,
        locData,
        srcData,
        devData,
        brData,
        osData,
        compData,
        peakData,
        visitorSessionsData
      ] = await Promise.all([
        analyticsService.getSummary(timeRange),
        analyticsService.getTrends(timeRange, trendMode),
        analyticsService.getActivities(timeRange),
        analyticsService.getLocations(timeRange),
        analyticsService.getSources(timeRange),
        analyticsService.getDevices(timeRange),
        analyticsService.getBrowsers(timeRange),
        analyticsService.getOS(timeRange),
        analyticsService.getVisitorComparison(timeRange),
        analyticsService.getPeakHours(timeRange),
        analyticsService.getVisitorSessions({ search, page, pageSize, timeRange })
      ]);

      setSummary(sumData);
      setTrends(trendData);
      setActivities(actData);
      setLocations(locData);
      setSources(srcData);
      setDevices(devData);
      setBrowsers(brData);
      setOperatingSystems(osData);
      setVisitorComparison(compData);
      setPeakHours(peakData);
      setVisitorSessions(visitorSessionsData.data);
      setTotalVisitorsCount(visitorSessionsData.totalCount);
    } catch (err) {
      console.error('[useAnalytics] Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [timeRange, trendMode, search, page, pageSize]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
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
    visitorSessions,
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
    
    refresh: fetchAnalytics
  };
};

export default useAnalytics;
