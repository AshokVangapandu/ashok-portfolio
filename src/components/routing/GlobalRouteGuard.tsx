/* src/components/routing/GlobalRouteGuard.tsx */
import React, { ReactNode } from 'react';
import { usePortfolioSettingsContext } from '../../context/PortfolioSettingsContext';
import {
  GlobalLoadingScreen,
  GlobalErrorScreen,
  MaintenanceModePlaceholder,
  PrivateModePlaceholder,
} from './VisibilityPlaceholders';

import { privateAccessService } from '../../services/privateAccessService';

interface GlobalRouteGuardProps {
  children: ReactNode;
}

export const GlobalRouteGuard: React.FC<GlobalRouteGuardProps> = ({ children }) => {
  const { siteMode, isLoading, error, refreshSiteMode } = usePortfolioSettingsContext();

  if (isLoading) {
    return <GlobalLoadingScreen />;
  }

  if (error) {
    return <GlobalErrorScreen onRetry={refreshSiteMode} />;
  }

  switch (siteMode) {
    case 'maintenance':
      return <MaintenanceModePlaceholder />;
    case 'private':
      if (privateAccessService.hasValidSession()) {
        return <>{children}</>;
      }
      return <PrivateModePlaceholder />;
    case 'public':
    default:
      return <>{children}</>;
  }
};

export default GlobalRouteGuard;
