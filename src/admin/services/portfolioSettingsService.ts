/* src/admin/services/portfolioSettingsService.ts */
import { MOCK_PORTFOLIO_SETTINGS } from './portfolioSettings.mock';
import { PortfolioSettings } from '../types/portfolioSettings';

export const portfolioSettingsService = {
  async getSettings() {
    return { ...MOCK_PORTFOLIO_SETTINGS };
  },

  async updateSettings(settings: PortfolioSettings) {
    console.log('[portfolioSettingsService] Update payload:', settings);
    return true;
  }
};

export default portfolioSettingsService;
