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
  AnalyticsVisitor
} from '../types/analytics';

export const useAnalytics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | '90days'>('30days');
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
  const [visitors, setVisitors] = useState<AnalyticsVisitor[]>([]);
  const [totalVisitorsCount, setTotalVisitorsCount] = useState<number>(386);

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
        visitorData
      ] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getTrends(trendMode),
        analyticsService.getActivities(),
        analyticsService.getLocations(),
        analyticsService.getSources(),
        analyticsService.getDevices(),
        analyticsService.getBrowsers(),
        analyticsService.getOS(),
        analyticsService.getVisitorComparison(),
        analyticsService.getPeakHours(),
        analyticsService.getVisitors({ search, page, pageSize })
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
      setVisitors(visitorData.data);
      setTotalVisitorsCount(visitorData.totalCount);
    } catch (err) {
      console.error('[useAnalytics] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [trendMode, search, page, pageSize]);

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
    
    refresh: fetchAnalytics
  };
};

export default useAnalytics;
