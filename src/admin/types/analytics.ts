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
  code: string;
  countryCode?: string;
  cities?: string[];
}

export interface AnalyticsSource {
  rank: number;
  source: string;
  percentage: number;
  type: 'linkedin' | 'google' | 'github' | 'direct' | 'other';
}

export interface AnalyticsDevice {
  name: string;
  percentage: number;
}

export interface AnalyticsBrowser {
  name: string;
  percentage: number;
}

export interface AnalyticsOperatingSystem {
  name: string;
  percentage: number;
}

export interface VisitorComparison {
  newPercentage: number;
  returningPercentage: number;
  newTrend: string;
  returningTrend: string;
}

export interface PeakHours {
  hour: string;
  value: number; // 0 to 10 scale representing low to high
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
  avatarUrl?: string | null;
  country: string | null;
  city: string | null;
  device: string;
  browser: string;
  os?: string; // Add optional fields to map easily if needed
  source: string;
  landingPage: string;
  sessionDuration: number; // Duration in seconds
  isKnownVisitor: boolean;
  lastActivity: string; // ISO timestamp string or formatted date
}
