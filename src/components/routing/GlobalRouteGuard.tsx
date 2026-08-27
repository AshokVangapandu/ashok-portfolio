/* src/components/routing/GlobalRouteGuard.tsx */
import React, { ReactNode, useState, useEffect } from 'react';
import { usePortfolioSettingsContext } from '../../context/PortfolioSettingsContext';
import { useAuth } from '../../hooks/useAuth';
import {
  GlobalLoadingScreen,
  GlobalErrorScreen,
  MaintenanceModePlaceholder,
  PrivateModePlaceholder,
} from './VisibilityPlaceholders';

import { privateAccessService } from '../../services/privateAccessService';
import { supabase } from '../../services/supabase/client';

interface GlobalRouteGuardProps {
  children: ReactNode;
}

function AdminBypassDot({ mode }: { mode: 'maintenance' | 'private' }) {
  const isMaint = mode === 'maintenance';
  const dotColor = isMaint ? '#F59E0B' : '#A855F7';
  const titleText = isMaint
    ? 'Admin Mode — Maintenance Mode Active (Bypass Active)'
    : 'Admin Mode — Private Mode Active (Bypass Active)';

  useEffect(() => {
    let existing = document.getElementById('admin-bypass-banner');
    if (existing) existing.remove();

    if (!document.getElementById('admin-dot-style')) {
      const style = document.createElement('style');
      style.id = 'admin-dot-style';
      style.textContent = `
        @keyframes adminDotPulse {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 2px #020617, 0 0 10px ${dotColor}, 0 0 16px ${dotColor}; }
          50% { transform: scale(1.3); opacity: 0.85; box-shadow: 0 0 0 2px #020617, 0 0 16px ${dotColor}, 0 0 24px ${dotColor}; }
        }
        .admin-dot-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .admin-dot-bubble {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: ${dotColor};
          animation: adminDotPulse 2.2s infinite ease-in-out;
          cursor: pointer;
          transition: transform 0.2s ease;
          display: block;
        }
        .admin-dot-bubble:hover {
          transform: scale(1.35) !important;
        }
        .admin-dot-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid ${isMaint ? 'rgba(245, 158, 11, 0.35)' : 'rgba(168, 85, 247, 0.35)'};
          color: #F8FAFC;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
          padding: 5px 12px;
          border-radius: 9999px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
          z-index: 999999;
          font-family: 'Manrope', system-ui, sans-serif;
        }
        .admin-dot-wrapper:hover .admin-dot-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `;
      document.head.appendChild(style);
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'admin-bypass-banner';
    wrapper.className = 'admin-dot-wrapper';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-label', titleText);
    wrapper.innerHTML = `
      <span class="admin-dot-bubble" title="${titleText}"></span>
      <span class="admin-dot-tooltip">${isMaint ? '🟠 Admin Mode (Maintenance Active)' : '🔒 Admin Mode (Private Active)'}</span>
    `;

    const attachDot = () => {
      const brandMark = document.querySelector('.brand-mark') || document.querySelector('.brand');
      if (brandMark) {
        if (getComputedStyle(brandMark).overflow === 'hidden') {
          (brandMark as HTMLElement).style.overflow = 'visible';
        }
        if (getComputedStyle(brandMark).position === 'static') {
          (brandMark as HTMLElement).style.position = 'relative';
        }
        wrapper.style.cssText = 'position: absolute; top: -3px; right: -3px; z-index: 99;';
        brandMark.appendChild(wrapper);
      } else {
        wrapper.style.cssText = 'position: fixed; top: 16px; left: 16px; z-index: 999999;';
        document.body.appendChild(wrapper);
      }
    };

    const timer = setTimeout(attachDot, 100);
    return () => {
      clearTimeout(timer);
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };
  }, [mode, isMaint, dotColor, titleText]);

  return null;
}

export const GlobalRouteGuard: React.FC<GlobalRouteGuardProps> = ({ children }) => {
  const { siteMode, isLoading, error, refreshSiteMode } = usePortfolioSettingsContext();
  const { isAdmin, user, loading: authLoading } = useAuth();
  const [dbAuthorized, setDbAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Reset dbAuthorized if user email, siteMode, or admin status changes
    setDbAuthorized(null);
  }, [user?.email, siteMode, isAdmin]);

  useEffect(() => {
    if (siteMode !== 'private') {
      return;
    }
    if (isAdmin) {
      setDbAuthorized(true);
      return;
    }
    if (authLoading) {
      return;
    }
    if (!user?.email) {
      setDbAuthorized(false);
      return;
    }

    let active = true;
    const checkDbAccess = async () => {
      try {
        const { data, error } = await supabase
          .from('authorized_users')
          .select('access_status')
          .ilike('email', user.email!)
          .eq('access_status', 'enabled')
          .maybeSingle();

        if (active) {
          if (!error && data && data.access_status === 'enabled') {
            setDbAuthorized(true);
            // Sync with sessionStorage session
            const session = {
              email: user.email!.trim().toLowerCase(),
              token: btoa(`${user.email!.trim().toLowerCase()}:${Date.now()}`),
              verifiedAt: new Date().toISOString()
            };
            sessionStorage.setItem('portfolio_private_session', JSON.stringify(session));
          } else {
            setDbAuthorized(false);
            sessionStorage.removeItem('portfolio_private_session');
          }
        }
      } catch (err) {
        if (active) {
          setDbAuthorized(false);
          sessionStorage.removeItem('portfolio_private_session');
        }
      }
    };

    checkDbAccess();

    return () => {
      active = false;
    };
  }, [user?.email, siteMode, isAdmin, authLoading]);

  if (isLoading || authLoading || (siteMode === 'private' && !isAdmin && dbAuthorized === null)) {
    return <GlobalLoadingScreen />;
  }

  if (error) {
    return <GlobalErrorScreen onRetry={refreshSiteMode} />;
  }

  // Admin Bypass Architecture: Authenticated active administrators bypass siteMode restrictions
  if (isAdmin) {
    if (siteMode === 'maintenance' || siteMode === 'private') {
      return (
        <>
          <AdminBypassDot mode={siteMode} />
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
      if (dbAuthorized === true) {
        return <>{children}</>;
      }
      return <PrivateModePlaceholder />;
    case 'public':
    default:
      return <>{children}</>;
  }
};

export default GlobalRouteGuard;


