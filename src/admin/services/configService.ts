/* src/admin/services/configService.ts */
import { DashboardConfig } from '../types/dashboardConfig';
import { MOCK_DASHBOARD_CONFIG } from './config.mock';

export interface IConfigProvider {
  getConfig(): Promise<DashboardConfig>;
  updateConfig(config: Partial<DashboardConfig>): Promise<boolean>;
}

/**
 * Local memory config provider (reads/writes in local state/session memory).
 */
export class LocalConfigProvider implements IConfigProvider {
  private config: DashboardConfig = { ...MOCK_DASHBOARD_CONFIG };

  async getConfig(): Promise<DashboardConfig> {
    return { ...this.config };
  }

  async updateConfig(newConfig: Partial<DashboardConfig>): Promise<boolean> {
    this.config = {
      ...this.config,
      ...newConfig
    };
    console.log('[LocalConfigProvider] Config updated:', this.config);
    return true;
  }
}

/**
 * Environment variables config provider. 
 * Reads values from Vite's import.meta.env at build/runtime.
 * Note: Env variables are read-only at runtime.
 */
export class EnvConfigProvider implements IConfigProvider {
  async getConfig(): Promise<DashboardConfig> {
    return {
      general: {
        portfolioName: import.meta.env.VITE_PORTFOLIO_NAME || MOCK_DASHBOARD_CONFIG.general.portfolioName,
        adminName: import.meta.env.VITE_ADMIN_NAME || MOCK_DASHBOARD_CONFIG.general.adminName,
        portfolioStatus: (import.meta.env.VITE_PORTFOLIO_STATUS as any) || MOCK_DASHBOARD_CONFIG.general.portfolioStatus,
        timezone: import.meta.env.VITE_TIMEZONE || MOCK_DASHBOARD_CONFIG.general.timezone,
        defaultCity: import.meta.env.VITE_DEFAULT_CITY || MOCK_DASHBOARD_CONFIG.general.defaultCity
      },
      profile: {
        avatar: import.meta.env.VITE_PROFILE_AVATAR || MOCK_DASHBOARD_CONFIG.profile.avatar,
        displayName: import.meta.env.VITE_PROFILE_DISPLAY_NAME || MOCK_DASHBOARD_CONFIG.profile.displayName,
        designation: import.meta.env.VITE_PROFILE_DESIGNATION || MOCK_DASHBOARD_CONFIG.profile.designation
      },
      weather: {
        enableWeather: import.meta.env.VITE_ENABLE_WEATHER === 'true' || MOCK_DASHBOARD_CONFIG.weather.enableWeather,
        useCurrentLocation: import.meta.env.VITE_WEATHER_USE_CURRENT === 'true' || MOCK_DASHBOARD_CONFIG.weather.useCurrentLocation,
        fallbackCity: import.meta.env.VITE_WEATHER_FALLBACK_CITY || MOCK_DASHBOARD_CONFIG.weather.fallbackCity,
        temperatureUnit: (import.meta.env.VITE_WEATHER_TEMP_UNIT as any) || MOCK_DASHBOARD_CONFIG.weather.temperatureUnit,
        refreshInterval: parseInt(import.meta.env.VITE_WEATHER_REFRESH || '', 10) || MOCK_DASHBOARD_CONFIG.weather.refreshInterval
      },
      edith: {
        enableInsights: import.meta.env.VITE_EDITH_INSIGHTS === 'true' || MOCK_DASHBOARD_CONFIG.edith.enableInsights,
        enableMotivationalMessages: import.meta.env.VITE_EDITH_MOTIVATION === 'true' || MOCK_DASHBOARD_CONFIG.edith.enableMotivationalMessages,
        refreshInterval: parseInt(import.meta.env.VITE_EDITH_REFRESH || '', 10) || MOCK_DASHBOARD_CONFIG.edith.refreshInterval
      },
      analytics: {
        defaultRange: (import.meta.env.VITE_ANALYTICS_RANGE as any) || MOCK_DASHBOARD_CONFIG.analytics.defaultRange,
        realtimeEnabled: import.meta.env.VITE_ANALYTICS_REALTIME === 'true' || MOCK_DASHBOARD_CONFIG.analytics.realtimeEnabled
      },
      resume: {
        activeResume: import.meta.env.VITE_ACTIVE_RESUME || MOCK_DASHBOARD_CONFIG.resume.activeResume,
        downloadEnabled: import.meta.env.VITE_RESUME_DOWNLOAD === 'true' || MOCK_DASHBOARD_CONFIG.resume.downloadEnabled
      },
      quickActions: {
        enabledActions: MOCK_DASHBOARD_CONFIG.quickActions.enabledActions
      }
    };
  }

  async updateConfig(): Promise<boolean> {
    console.warn('[EnvConfigProvider] Environment variables are read-only at runtime.');
    return false;
  }
}

/**
 * Database config provider. Retrieves and updates configurations stored on Supabase.
 */
export class SupabaseConfigProvider implements IConfigProvider {
  async getConfig(): Promise<DashboardConfig> {
    // Placeholder - will connect to Supabase database settings table in later phases
    console.log('[SupabaseConfigProvider] Fetching configuration from database...');
    return { ...MOCK_DASHBOARD_CONFIG };
  }

  async updateConfig(newConfig: Partial<DashboardConfig>): Promise<boolean> {
    // Placeholder - will update Supabase settings table in later phases
    console.log('[SupabaseConfigProvider] Syncing configuration updates to database:', newConfig);
    return true;
  }
}

// ----------------------------------------------------
// Active Provider Routing
// ----------------------------------------------------
// Checks VITE_CONFIG_SOURCE environment setting to select active adapter
const getActiveProvider = (): IConfigProvider => {
  const source = import.meta.env.VITE_CONFIG_SOURCE || 'mock';
  switch (source) {
    case 'env':
      return new EnvConfigProvider();
    case 'supabase':
      return new SupabaseConfigProvider();
    case 'mock':
    default:
      return new LocalConfigProvider();
  }
};

const activeProvider = getActiveProvider();

export const configService = {
  async getConfig(): Promise<DashboardConfig> {
    return activeProvider.getConfig();
  },

  async updateConfig(config: Partial<DashboardConfig>): Promise<boolean> {
    return activeProvider.updateConfig(config);
  }
};

export default configService;
