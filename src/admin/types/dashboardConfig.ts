/* src/admin/types/dashboardConfig.ts */

export interface GeneralConfig {
  portfolioName: string;
  adminName: string;
  portfolioStatus: 'public' | 'maintenance' | 'private';
  timezone: string;
  defaultCity: string;
}

export interface ProfileConfig {
  avatar: string | null;
  displayName: string;
  designation: string;
}

export interface WeatherConfig {
  enableWeather: boolean;
  useCurrentLocation: boolean;
  fallbackCity: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  refreshInterval: number; // in minutes
}

export interface EdithConfig {
  enableInsights: boolean;
  enableMotivationalMessages: boolean;
  refreshInterval: number; // in minutes
}

export interface AnalyticsConfig {
  defaultRange: '7d' | '30d' | '90d' | 'all';
  realtimeEnabled: boolean;
}

export interface ResumeConfig {
  activeResume: string;
  downloadEnabled: boolean;
}

export interface QuickActionsConfig {
  enabledActions: string[];
}

export interface DashboardConfig {
  general: GeneralConfig;
  profile: ProfileConfig;
  weather: WeatherConfig;
  edith: EdithConfig;
  analytics: AnalyticsConfig;
  resume: ResumeConfig;
  quickActions: QuickActionsConfig;
}
