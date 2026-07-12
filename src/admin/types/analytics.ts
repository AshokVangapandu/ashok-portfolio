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
}

export interface AnalyticsLocation {
  country: string;
  count: number;
  percentage: number;
  code: string;
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
