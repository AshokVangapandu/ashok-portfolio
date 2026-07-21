/* src/components/routing/GlobalRouteGuard.tsx */
import React, { ReactNode } from 'react';
import { usePortfolioSettingsContext } from '../../context/PortfolioSettingsContext';
import { useAuth } from '../../hooks/useAuth';
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
  const { isAdmin, loading: authLoading } = useAuth();

  if (isLoading || authLoading) {
    return <GlobalLoadingScreen />;
  }

  if (error) {
    return <GlobalErrorScreen onRetry={refreshSiteMode} />;
  }

  // Admin Bypass Architecture: Authenticated active administrators bypass siteMode restrictions
  if (isAdmin) {
    if (siteMode === 'maintenance' || siteMode === 'private') {
      const isMaint = siteMode === 'maintenance';
      return (
        <>
          <div
            role="status"
            aria-live="polite"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 99999,
              width: '100%',
              backgroundColor: isMaint ? '#1E1B13' : '#171426',
              borderBottom: isMaint ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(124, 58, 237, 0.4)',
              color: isMaint ? '#FBBF24' : '#C4B5FD',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              fontFamily: "'Inter', system-ui, sans-serif",
              boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: '14px' }}>{isMaint ? '🟠' : '🔒'}</span>
            <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isMaint ? 'Admin Mode' : 'Admin Preview'}
            </span>
            <span style={{ color: '#E2E8F0', fontWeight: 500 }}>
              — {isMaint ? 'Portfolio is currently in Maintenance Mode. Visitors are seeing the Maintenance page.' : 'Portfolio is in Private Mode. Visitors see the Private Access page.'}
            </span>
          </div>
          {children}
        </>
      );
    }
    return <>{children}</>;
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

