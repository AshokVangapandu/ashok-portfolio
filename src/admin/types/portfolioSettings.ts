/* src/admin/types/portfolioSettings.ts */

export type PortfolioVisibility = 'public' | 'maintenance' | 'private';
export type SiteMode = PortfolioVisibility;

export interface PortfolioSettings {
  visibility: PortfolioVisibility;
  isOpenForWork: boolean;
  resumeFileName: string;
  resumeLastUpdated: string;
  resumeStatus: string;
}
