/* src/admin/services/analyticsService.ts */
import { supabase } from '../../services/supabase/client';
import {
  MOCK_ANALYTICS_SUMMARY,
  MOCK_TRENDS_DAILY,
  MOCK_TRENDS_WEEKLY,
  MOCK_TRENDS_MONTHLY,
  MOCK_ACTIVITIES,
  MOCK_LOCATIONS,
  MOCK_SOURCES,
  MOCK_DEVICES,
  MOCK_BROWSERS,
  MOCK_OS,
  MOCK_VISITOR_COMPARISON,
  MOCK_PEAK_HOURS,
  MOCK_ANALYTICS_VISITORS
} from './analytics.mock';
import { AnalyticsVisitor, VisitorSession } from '../types/analytics';
import { PeakHours } from '../types/analytics';

export interface VisitorQueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  timeRange?: string;
}

const getTimerangeStart = (range: string): Date => {
  const now = new Date();
  if (range === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === '7days') {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === '90days') {
    return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else { // 30days
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
};

const normalizePeakHours = (rows: PeakHours[] = []): PeakHours[] => {
  return rows.map((row) => ({
    ...row,
    value: Number(row.value) || 0,
    count: typeof row.count === 'number' ? row.count : undefined,
    label: row.label || row.hour,
    timezone: row.timezone
  }));
};

export const analyticsService = {
  async getSummary(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_summary', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_ANALYTICS_SUMMARY;
    } catch (err) {
      console.warn('[analyticsService.getSummary] Failed, returning mock data:', err);
      return MOCK_ANALYTICS_SUMMARY;
    }
  },

  async getLiveVisitorsCount(): Promise<number> {
    try {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count, error } = await (supabase as any)
        .from('visitor_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', fiveMinsAgo);

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[analyticsService.getLiveVisitorsCount] Error fetching live count:', err);
      return 0;
    }
  },

  async getTrends(timeRange: string = '30days', mode: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const { data, error } = await (supabase as any).rpc('get_analytics_trends', { range_filter: timeRange, trend_mode: mode });
    if (error) throw error;
    return data || [];
  },

  async getActivities(timeRange: string = '7days') {
    const { data, error } = await (supabase as any).rpc('get_analytics_activities', { range_filter: timeRange });
    if (error) throw error;
    return data || [];
  },

  async getLocations(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_locations', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_LOCATIONS;
    } catch (err) {
      console.warn('[analyticsService.getLocations] Failed, returning mock data:', err);
      return MOCK_LOCATIONS;
    }
  },

  async getSources(timeRange: string = '30days') {
    const { data, error } = await (supabase as any).rpc('get_analytics_sources', { range_filter: timeRange });
    if (error) throw error;
    return data || [];
  },

  async getDevices(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_devices', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_DEVICES;
    } catch (err) {
      console.warn('[analyticsService.getDevices] Failed, returning mock data:', err);
      return MOCK_DEVICES;
    }
  },

  async getBrowsers(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_browsers', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_BROWSERS;
    } catch (err) {
      console.warn('[analyticsService.getBrowsers] Failed, returning mock data:', err);
      return MOCK_BROWSERS;
    }
  },

  async getOS(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_operating_systems', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_OS;
    } catch (err) {
      console.warn('[analyticsService.getOS] Failed, returning mock data:', err);
      return MOCK_OS;
    }
  },

  async getVisitorComparison(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_visitor_comparison', { range_filter: timeRange });
      if (error) throw error;
      return data || MOCK_VISITOR_COMPARISON;
    } catch (err) {
      console.warn('[analyticsService.getVisitorComparison] Failed, returning mock data:', err);
      return MOCK_VISITOR_COMPARISON;
    }
  },

  async getPeakHours(timeRange: string = '30days') {
    try {
      const { data, error } = await (supabase as any).rpc('get_analytics_peak_hours', { range_filter: timeRange });
      if (error) throw error;
      return normalizePeakHours(data || MOCK_PEAK_HOURS);
    } catch (err) {
      console.warn('[analyticsService.getPeakHours] Failed, returning mock data:', err);
      return normalizePeakHours(MOCK_PEAK_HOURS);
    }
  },

  /**
   * Queries and filters visitor sessions for the List View.
   */
  async getVisitors(options: VisitorQueryOptions = {}): Promise<{
    data: AnalyticsVisitor[];
    totalCount: number;
  }> {
    try {
      let query = (supabase as any)
        .from('visitor_sessions')
        .select('*, visitor_profiles(full_name, email, avatar_url), page_views(page_path, page_title)', { count: 'exact' });

      // Apply range filter bounds
      if (options.timeRange) {
        const startBound = getTimerangeStart(options.timeRange);
        query = query.gte('created_at', startBound.toISOString());
      }

      // Range Pagination limits
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      query = query.range(start, end).order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;

      let mappedList = (data || []).map((v: any): AnalyticsVisitor => {
        const isKnown = !!v.visitor_profiles;
        const profile = v.visitor_profiles || {};
        const pViews = v.page_views || [];
        const lastView = pViews[0] || {}; // sorted desc by page view index or ordering

        // Format dates into target string
        const d = new Date(v.created_at);
        const formattedDate = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const formattedTime = d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        // Helper to format elapsed time in minutes/seconds
        const durationSec = Number(v.duration_seconds) || 0;
        const durationMin = Math.floor(durationSec / 60);
        const durationRemSec = durationSec % 60;
        const durationStr = durationMin > 0 ? `${durationMin}m ${durationRemSec}s` : `${durationRemSec}s`;

        return {
          id: v.id,
          dateTime: `${formattedDate}\n${formattedTime}`,
          visitorName: profile.full_name || `Visitor (${v.visitor_id.substring(0, 6)})`,
          visitorEmail: profile.email || null,
          avatarUrl: profile.avatar_url || null,
          isKnown,
          country: v.country || 'Unknown',
          city: v.city || 'Unknown',
          device: v.device_type === 'Mobile' || v.device_type === 'Tablet' ? v.device_type : 'Desktop',
          source: v.traffic_source || 'Direct',
          pageViewed: lastView.page_title || lastView.page_path || 'Home Page',
          duration: durationStr,
          browser: v.browser || 'Unknown',
          os: v.operating_system || 'Unknown',
          status: isKnown ? 'Known Visitor' : 'Anonymous'
        };
      });

      // Filter local search on name, email, country, city, source, browser
      if (options.search) {
        const q = options.search.toLowerCase().trim();
        mappedList = mappedList.filter(
          (v: AnalyticsVisitor) =>
            v.visitorName.toLowerCase().includes(q) ||
            (v.visitorEmail && v.visitorEmail.toLowerCase().includes(q)) ||
            v.country.toLowerCase().includes(q) ||
            v.city.toLowerCase().includes(q) ||
            v.source.toLowerCase().includes(q) ||
            v.pageViewed.toLowerCase().includes(q)
        );
      }

      return {
        data: mappedList,
        totalCount: count || mappedList.length
      };
    } catch (err) {
      console.warn('[analyticsService.getVisitors] Failed, returning empty dataset:', err);
      return {
        data: [],
        totalCount: 0
      };
    }
  },

  async getVisitorSessions(options: VisitorQueryOptions): Promise<{ data: VisitorSession[]; totalCount: number }> {
    try {
      let query = (supabase as any)
        .from('visitor_sessions')
        .select('*, visitor_profiles(full_name, email, avatar_url), page_views(page_path, page_title)', { count: 'exact' });

      // Apply range filter bounds
      if (options.timeRange) {
        const startBound = getTimerangeStart(options.timeRange);
        query = query.gte('created_at', startBound.toISOString());
      }

      // Range Pagination limits
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      query = query.range(start, end).order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;

      let mappedList = (data || []).map((v: any): VisitorSession => {
        const isKnown = !!v.visitor_profiles;
        const profile = v.visitor_profiles || {};
        const pViews = v.page_views || [];
        const lastView = pViews[0] || {};

        // Format dates into target string
        const d = new Date(v.created_at);
        const formattedDate = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const formattedTime = d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        return {
          id: v.id,
          visitedAt: `${formattedDate}\n${formattedTime}`,
          visitorName: profile.full_name || `Visitor (${v.visitor_id.substring(0, 6)})`,
          visitorEmail: profile.email || null,
          avatarUrl: profile.avatar_url || null,
          country: v.country || 'Unknown',
          city: v.city || 'Unknown',
          device: v.device_type === 'Mobile' || v.device_type === 'Tablet' ? v.device_type : 'Desktop',
          browser: v.browser || 'Unknown',
          os: v.operating_system || 'Unknown',
          source: v.traffic_source || 'Direct',
          landingPage: lastView.page_title || lastView.page_path || 'Home Page',
          sessionDuration: Number(v.duration_seconds) || 0,
          isKnownVisitor: isKnown,
          lastActivity: v.updated_at
        };
      });

      // Filter local search on name, email, country, city, source, landingPage
      if (options.search) {
        const q = options.search.toLowerCase().trim();
        mappedList = mappedList.filter(
          (v: VisitorSession) =>
            (v.visitorName && v.visitorName.toLowerCase().includes(q)) ||
            (v.visitorEmail && v.visitorEmail.toLowerCase().includes(q)) ||
            (v.country && v.country.toLowerCase().includes(q)) ||
            (v.city && v.city.toLowerCase().includes(q)) ||
            v.source.toLowerCase().includes(q) ||
            v.landingPage.toLowerCase().includes(q)
        );
      }

      return {
        data: mappedList,
        totalCount: count || mappedList.length
      };
    } catch (err) {
      console.warn('[analyticsService.getVisitorSessions] Failed, returning empty dataset:', err);
      return {
        data: [],
        totalCount: 0
      };
    }
  }
};

export default analyticsService;
