/* src/admin/services/config.mock.ts */
import { DashboardConfig } from '../types/dashboardConfig';

export const MOCK_DASHBOARD_CONFIG: DashboardConfig = {
  general: {
    portfolioName: 'Ashok Vangapandu Portfolio',
    adminName: 'Ashok Vangapandu',
    portfolioStatus: 'public',
    timezone: 'Asia/Kolkata',
    defaultCity: 'Hyderabad'
  },
  profile: {
    avatar: null,
    displayName: 'Ashok',
    designation: 'Senior Software Engineer'
  },
  weather: {
    enableWeather: true,
    useCurrentLocation: true,
    fallbackCity: 'Hyderabad',
    temperatureUnit: 'celsius',
    refreshInterval: 15
  },
  edith: {
    enableInsights: true,
    enableMotivationalMessages: true,
    refreshInterval: 15
  },
  analytics: {
    defaultRange: '30d',
    realtimeEnabled: true
  },
  resume: {
    activeResume: 'Resume_v4_2026.pdf',
    downloadEnabled: true
  },
  quickActions: {
    enabledActions: ['add_project', 'edit_profile', 'download_resume', 'toggle_status']
  }
};
