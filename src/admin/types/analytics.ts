/* src/admin/types/analytics.ts */

export interface AnalyticsSummary {
  totalVisitors: number;
  uniqueVisitors: number;
  avgSessionTime: string;
  formSubmissions: number;
  testimonialsCount: number;
  trends: {
    totalVisitors: string;
    uniqueVisitors: string;
    avgSessionTime: string;
    formSubmissions: string;
    testimonialsCount: string;
  };
}

export interface AnalyticsTrend {
  label: string;
  visitors: number;
}

export interface AnalyticsActivity {
  id: string;
  type: 'visit' | 'submission' | 'testimonial' | 'download' | 'project';
  title: string;
  subtitle: string;
  time: string;
  event_time?: string;
}

export interface AnalyticsLocation {
  country: string;
  count: number;
  percentage: number;
  code?: string;
  countryCode?: string;
  cities?: string[];
  isOthers?: boolean;
}

export interface AnalyticsSourceItem {
  rank?: number;
  source: string;
  display?: string;
  count: number;
  percentage: number;
  type: string;
}

export interface AnalyticsSourcesOthers {
  count: number;
  percentage: number;
  sources: AnalyticsSourceItem[];
}

export interface AnalyticsSourcesResponse {
  totalCount?: number;
  topSources: AnalyticsSourceItem[];
  others: AnalyticsSourcesOthers;
}

export interface AnalyticsSource {
  rank?: number;
  source: string;
  display?: string;
  count?: number;
  visits?: number;
  percentage: number;
  type?: string;
  isOthers?: boolean;
  otherSources?: AnalyticsSourceItem[];
}

export interface AnalyticsDevice {
  name: string;
  count?: number;
  visits?: number;
  percentage: number;
}

export interface AnalyticsBrowser {
  name: string;
  count?: number;
  visits?: number;
  percentage: number;
  rank?: number;
}

export interface AnalyticsOperatingSystem {
  name: string;
  count?: number;
  visits?: number;
  percentage: number;
  rank?: number;
}

export interface VisitorComparison {
  totalUniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  newPercentage: number;
  returningPercentage: number;
  newTrend: string;
  returningTrend: string;
}

export interface PeakHours {
  hour: string;
  value: number; // 0 to 10 scale representing low to high
  count?: number; // actual visitor sessions in this hour, when returned by the analytics RPC
  label?: string; // display-ready local time label, e.g. 6 AM
  timezone?: string;
}

export interface AnalyticsVisitor {
  id: string;
  dateTime: string; // e.g. Jan 15, 2024\n10:42 AM
  visitorName: string;
  visitorEmail?: string | null;
  avatarUrl?: string | null;
  isKnown: boolean;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  source: string; // traffic source
  pageViewed: string; // downloadedFrom / section viewed e.g. Hero Section, Home Page
  duration: string; // session length
  browser: string;
  os: string;
  status: 'Known Visitor' | 'Anonymous';
}

export interface VisitorSession {
  id: string;
  visitedAt: string; // "Jan 15, 2024\n10:42 AM"
  visitorName: string | null;
  visitorEmail: string | null;
  avatarUrl: string | null;
  country: string;
  city: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  source: string;
  landingPage: string;
  sessionDuration: number; // duration in seconds
  isKnownVisitor: boolean;
  lastActivity: string;
}
