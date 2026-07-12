/* src/admin/services/analyticsService.ts */
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

export interface VisitorQueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const analyticsService = {
  async getSummary() {
    return MOCK_ANALYTICS_SUMMARY;
  },

  async getTrends(mode: 'daily' | 'weekly' | 'monthly' = 'daily') {
    if (mode === 'weekly') return MOCK_TRENDS_WEEKLY;
    if (mode === 'monthly') return MOCK_TRENDS_MONTHLY;
    return MOCK_TRENDS_DAILY;
  },

  async getActivities() {
    return MOCK_ACTIVITIES;
  },

  async getLocations() {
    return MOCK_LOCATIONS;
  },

  async getSources() {
    return MOCK_SOURCES;
  },

  async getDevices() {
    return MOCK_DEVICES;
  },

  async getBrowsers() {
    return MOCK_BROWSERS;
  },

  async getOS() {
    return MOCK_OS;
  },

  async getVisitorComparison() {
    return MOCK_VISITOR_COMPARISON;
  },

  async getPeakHours() {
    return MOCK_PEAK_HOURS;
  },

  /**
   * Queries and filters visitor sessions for the List View.
   */
  async getVisitors(options: VisitorQueryOptions = {}) {
    let list = [...MOCK_ANALYTICS_VISITORS];
    
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.visitorName.toLowerCase().includes(q) ||
          (v.visitorEmail && v.visitorEmail.toLowerCase().includes(q)) ||
          v.country.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.source.toLowerCase().includes(q) ||
          v.pageViewed.toLowerCase().includes(q)
      );
    }

    const totalCount = 386; // Retain static mockup count matching specifications.
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIdx = (page - 1) * pageSize;
    
    const sliced = list.slice(startIdx, startIdx + pageSize);

    return {
      data: sliced,
      totalCount
    };
  }
};

export default analyticsService;
