/* src/context/PortfolioSettingsContext.tsx */
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { portfolioSettingsService } from '../admin/services/portfolioSettingsService';
import { SiteMode } from '../admin/types/portfolioSettings';

interface PortfolioSettingsContextType {
  siteMode: SiteMode;
  isLoading: boolean;
  error: string | null;
  refreshSiteMode: () => Promise<void>;
}

const PortfolioSettingsContext = createContext<PortfolioSettingsContextType | undefined>(undefined);

export interface PortfolioSettingsProviderProps {
  children: ReactNode;
}

export const PortfolioSettingsProvider: React.FC<PortfolioSettingsProviderProps> = ({ children }) => {
  const [siteMode, setSiteMode] = useState<SiteMode>('public');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSiteMode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mode = await portfolioSettingsService.getSiteMode();
      setSiteMode(mode);
    } catch (err: any) {
      console.warn('[PortfolioSettingsProvider] Error fetching site_mode; failing closed:', err);
      setSiteMode('maintenance');
      setError(err?.message || 'Unable to verify portfolio visibility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteMode();
  }, [refreshSiteMode]);

  return (
    <PortfolioSettingsContext.Provider
      value={{
        siteMode,
        isLoading,
        error,
        refreshSiteMode,
      }}
    >
      {children}
    </PortfolioSettingsContext.Provider>
  );
};

export const usePortfolioSettingsContext = (): PortfolioSettingsContextType => {
  const context = useContext(PortfolioSettingsContext);
  if (!context) {
    throw new Error('usePortfolioSettingsContext must be used within a PortfolioSettingsProvider');
  }
  return context;
};

export const useSiteMode = (): { siteMode: SiteMode; isLoading: boolean; error: string | null } => {
  const { siteMode, isLoading, error } = usePortfolioSettingsContext();
  return { siteMode, isLoading, error };
};

export default PortfolioSettingsContext;
