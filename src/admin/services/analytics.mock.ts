/* src/admin/services/analytics.mock.ts */
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

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  totalVisitors: 24312,
  uniqueVisitors: 18740,
  avgSessionTime: '3m 42s',
  formSubmissions: 386,
  testimonialsCount: 47,
  trends: {
    totalVisitors: '+12.4%',
    uniqueVisitors: '+9.1%',
    avgSessionTime: '+5.7%',
    formSubmissions: '+18.2%',
    testimonialsCount: '+3.0%'
  }
};

export const MOCK_TRENDS_DAILY: AnalyticsTrend[] = [
  { label: 'Mon', visitors: 1200 },
  { label: 'Tue', visitors: 2800 },
  { label: 'Wed', visitors: 2100 },
  { label: 'Thu', visitors: 4100 },
  { label: 'Fri', visitors: 3800 },
  { label: 'Sat', visitors: 5400 },
  { label: 'Sun', visitors: 4900 }
];

export const MOCK_TRENDS_WEEKLY: AnalyticsTrend[] = [
  { label: 'Wk 1', visitors: 12400 },
  { label: 'Wk 2', visitors: 15300 },
  { label: 'Wk 3', visitors: 18700 },
  { label: 'Wk 4', visitors: 24312 }
];

export const MOCK_TRENDS_MONTHLY: AnalyticsTrend[] = [
  { label: 'Jan', visitors: 45000 },
  { label: 'Feb', visitors: 56000 },
  { label: 'Mar', visitors: 62000 },
  { label: 'Apr', visitors: 78000 }
];

export const MOCK_ACTIVITIES: AnalyticsActivity[] = [
  {
    id: 'a1',
    type: 'visit',
    title: 'New visitor from LinkedIn',
    subtitle: 'Mumbai, India',
    time: '2m ago'
  },
  {
    id: 'a2',
    type: 'submission',
    title: 'Contact form submitted',
    subtitle: 'john@example.com',
    time: '14m ago'
  },
  {
    id: 'a3',
    type: 'testimonial',
    title: 'Testimonial received',
    subtitle: '5 stars - Sarah K.',
    time: '1h ago'
  },
  {
    id: 'a4',
    type: 'project',
    title: 'Digital Twin Viewer viewed',
    subtitle: 'Berlin, Germany',
    time: '2h ago'
  },
  {
    id: 'a5',
    type: 'download',
    title: 'Resume downloaded',
    subtitle: 'Toronto, Canada',
    time: '3h ago'
  }
];

export const MOCK_LOCATIONS: AnalyticsLocation[] = [
  { country: 'India', count: 8240, percentage: 34, code: 'IN' },
  { country: 'United States', count: 6110, percentage: 25, code: 'US' },
  { country: 'Germany', count: 3820, percentage: 16, code: 'DE' },
  { country: 'United Kingdom', count: 2950, percentage: 12, code: 'GB' },
  { country: 'Canada', count: 1870, percentage: 8, code: 'CA' },
  { country: 'Other', count: 1322, percentage: 5, code: 'GLOBE' }
];

export const MOCK_SOURCES: AnalyticsSource[] = [
  { rank: 1, source: 'LinkedIn', percentage: 38, type: 'linkedin' },
  { rank: 2, source: 'Google Search', percentage: 27, type: 'google' },
  { rank: 3, source: 'GitHub', percentage: 18, type: 'github' },
  { rank: 4, source: 'Direct', percentage: 12, type: 'direct' },
  { rank: 5, source: 'Other', percentage: 5, type: 'other' }
];

export const MOCK_DEVICES: AnalyticsDevice[] = [
  { name: 'Desktop', percentage: 56 },
  { name: 'Mobile', percentage: 34 },
  { name: 'Tablet', percentage: 10 }
];

export const MOCK_BROWSERS: AnalyticsBrowser[] = [
  { name: 'Chrome', percentage: 64 },
  { name: 'Edge', percentage: 14 },
  { name: 'Safari', percentage: 11 },
  { name: 'Firefox', percentage: 7 },
  { name: 'Other', percentage: 4 }
];

export const MOCK_OS: AnalyticsOperatingSystem[] = [
  { name: 'Windows', percentage: 42 },
  { name: 'macOS', percentage: 28 },
  { name: 'Android', percentage: 14 },
  { name: 'iOS', percentage: 10 },
  { name: 'Linux', percentage: 6 }
];

export const MOCK_VISITOR_COMPARISON: VisitorComparison = {
  newPercentage: 68,
  returningPercentage: 32,
  newTrend: '+12.5%',
  returningTrend: '+8.3%'
};

export const MOCK_PEAK_HOURS: PeakHours[] = [
  { hour: '12a', value: 2 },
  { hour: '1a', value: 1 },
  { hour: '2a', value: 1 },
  { hour: '3a', value: 0 },
  { hour: '4a', value: 0 },
  { hour: '5a', value: 1 },
  { hour: '6a', value: 3 },
  { hour: '7a', value: 4 },
  { hour: '8a', value: 7 },
  { hour: '9a', value: 8 },
  { hour: '10a', value: 6 },
  { hour: '11a', value: 7 },
  { hour: '12p', value: 9 },
  { hour: '1p', value: 8 },
  { hour: '2p', value: 7 },
  { hour: '3p', value: 8 },
  { hour: '4p', value: 9 },
  { hour: '5p', value: 8 },
  { hour: '6p', value: 6 },
  { hour: '7p', value: 5 },
  { hour: '8p', value: 4 },
  { hour: '9p', value: 3 },
  { hour: '10p', value: 2 },
  { hour: '11p', value: 1 }
];

export const MOCK_ANALYTICS_VISITORS: AnalyticsVisitor[] = [
  {
    id: 'v1',
    dateTime: 'Jan 15, 2024\n10:42 AM',
    visitorName: 'Sarah Johnson',
    visitorEmail: 'sarah.johnson@designstudio.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isKnown: true,
    country: 'United States',
    city: 'New York',
    device: 'Desktop',
    source: 'LinkedIn',
    pageViewed: 'Hero Section',
    duration: '8m 22s',
    browser: 'Chrome 120',
    os: 'macOS Sonoma',
    status: 'Known Visitor'
  },
  {
    id: 'v2',
    dateTime: 'Jan 15, 2024\n09:18 AM',
    visitorName: 'Anonymous Visitor',
    visitorEmail: null,
    avatarUrl: null,
    isKnown: false,
    country: 'Germany',
    city: 'Berlin',
    device: 'Desktop',
    source: 'Google Search',
    pageViewed: 'About Page',
    duration: '5m 10s',
    browser: 'Chrome 120',
    os: 'Windows 11',
    status: 'Anonymous'
  },
  {
    id: 'v3',
    dateTime: 'Jan 14, 2024\n3:55 PM',
    visitorName: 'Marcus Chen',
    visitorEmail: 'marcus@techcorp.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isKnown: true,
    country: 'Singapore',
    city: 'Singapore',
    device: 'Mobile',
    source: 'GitHub',
    pageViewed: 'Projects Page',
    duration: '12m 04s',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    status: 'Known Visitor'
  },
  {
    id: 'v4',
    dateTime: 'Jan 14, 2024\n11:29 AM',
    visitorName: 'Emma Williams',
    visitorEmail: 'emma.w@creativeagency.co',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isKnown: true,
    country: 'United Kingdom',
    city: 'London',
    device: 'Desktop',
    source: 'Direct',
    pageViewed: 'Home Page',
    duration: '6m 47s',
    browser: 'Safari 17',
    os: 'macOS Sonoma',
    status: 'Known Visitor'
  },
  {
    id: 'v5',
    dateTime: 'Jan 13, 2024\n7:02 PM',
    visitorName: 'Anonymous Visitor',
    visitorEmail: null,
    avatarUrl: null,
    isKnown: false,
    country: 'Canada',
    city: 'Toronto',
    device: 'Tablet',
    source: 'Direct',
    pageViewed: 'About Page',
    duration: '3m 15s',
    browser: 'Safari Mobile',
    os: 'iOS 17',
    status: 'Anonymous'
  },
  {
    id: 'v6',
    dateTime: 'Jan 13, 2024\n2:14 PM',
    visitorName: 'David Park',
    visitorEmail: 'd.park@startup.xyz',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isKnown: true,
    country: 'South Korea',
    city: 'Seoul',
    device: 'Desktop',
    source: 'LinkedIn',
    pageViewed: 'Hero Section',
    duration: '9m 38s',
    browser: 'Chrome 120',
    os: 'Windows 11',
    status: 'Known Visitor'
  },
  {
    id: 'v7',
    dateTime: 'Jan 12, 2024\n5:33 PM',
    visitorName: 'Olivia Martinez',
    visitorEmail: 'olivia@digitalmedia.es',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isKnown: true,
    country: 'Spain',
    city: 'Madrid',
    device: 'Desktop',
    source: 'Google Search',
    pageViewed: 'Projects Page',
    duration: '14m 51s',
    browser: 'Safari 17',
    os: 'macOS Sonoma',
    status: 'Known Visitor'
  },
  {
    id: 'v8',
    dateTime: 'Jan 12, 2024\n1:47 PM',
    visitorName: 'Anonymous Visitor',
    visitorEmail: null,
    avatarUrl: null,
    isKnown: false,
    country: 'India',
    city: 'Bangalore',
    device: 'Mobile',
    source: 'GitHub',
    pageViewed: 'Home Page',
    duration: '2m 09s',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    status: 'Anonymous'
  },
  {
    id: 'v9',
    dateTime: 'Jan 11, 2024\n10:05 AM',
    visitorName: 'Lars Andersen',
    visitorEmail: 'lars@nordic.dk',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    isKnown: true,
    country: 'Denmark',
    city: 'Copenhagen',
    device: 'Desktop',
    source: 'Direct',
    pageViewed: 'About Page',
    duration: '7m 22s',
    browser: 'Firefox 121',
    os: 'macOS Sonoma',
    status: 'Known Visitor'
  }
];

