/* src/admin/layout/Sidebar.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  currentPath,
  onNavigate,
}) => {
  const { logout } = useAuth();
  const settingsRef = useRef<HTMLButtonElement>(null);

  // Layout responsiveness listeners
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
  const [submenuTop, setSubmenuTop] = useState<number>(0);

  // Check if active settings route is matched
  const isSettingsActive = currentPath.startsWith('/admin/settings') || 
                           currentPath === '/admin/social-links' || 
                           currentPath === '/admin/access';

  // Mobile accordion expand state - default open if inside settings sub-paths
  const [mobileExpand, setMobileExpand] = useState<boolean>(isSettingsActive);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const mobileMode = window.innerWidth < 980;
        setIsMobile(mobileMode);
        if (mobileMode) {
          setShowSubmenu(false); // Disable desktop floating popup on mobile
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Update mobile accordion expansion when active sub-path transitions
  useEffect(() => {
    if (isSettingsActive) {
      setMobileExpand(true);
    }
  }, [isSettingsActive]);

  const menuItems: MenuItem[] = [
    { 
      label: 'Dashboard', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      path: '/admin/' 
    },
    { 
      label: 'Contacts', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), 
      path: '/admin/contacts' 
    },
    { 
      label: 'Testimonials', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ), 
      path: '/admin/testimonials' 
    },
    { 
      label: 'Resume Downloads', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), 
      path: '/admin/resume' 
    },
    { 
      label: 'Analytics', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ), 
      path: '/admin/analytics' 
    }
  ];

  const subNavItems = [
    {
      label: 'Portfolio Settings',
      path: '/admin/settings/portfolio',
      paths: ['/admin/settings/portfolio', '/admin/settings']
    },
    {
      label: 'Social Links',
      path: '/admin/settings/social-links',
      paths: ['/admin/settings/social-links', '/admin/social-links']
    },
    {
      label: 'Admin Access',
      path: '/admin/settings/admin-access',
      paths: ['/admin/settings/admin-access', '/admin/access']
    }
  ];

  // Triggers settings sub-menu clicks
  const handleSettingsClick = () => {
    if (isMobile) {
      setMobileExpand(!mobileExpand);
    } else {
      if (settingsRef.current) {
        const rect = settingsRef.current.getBoundingClientRect();
        setSubmenuTop(rect.top);
      }
      setShowSubmenu(!showSubmenu);
    }
  };

  const handleSubNavigate = (path: string) => {
    onNavigate(path);
    setShowSubmenu(false); // Close submenu popup on select
  };

  const sidebarWidth = collapsed ? '72px' : '260px';

  return (
    <>
      <aside
        className="transition-layout"
        style={{
          width: sidebarWidth,
          background: '#FFFFFF',
          borderRight: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 200,
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'width 250ms cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {/* 1. Header Profile block */}
        <div
          style={{
            padding: '0 var(--admin-space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid var(--admin-border)',
            height: '82px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--admin-gradient-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '15px',
                boxShadow: 'var(--admin-shadow-sm)',
                flexShrink: 0
              }}
            >
              A
            </div>

            {!collapsed && (
              <div 
                className="animate-fade-in"
                style={{ 
                  marginLeft: '12px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)', lineHeight: 1.2 }}>
                  Ashok
                </span>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.1, marginTop: '1px' }}>
                  Portfolio Admin
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Menu Link List */}
        <ul
          style={{
            listStyle: 'none',
            padding: 'var(--admin-space-4) var(--admin-space-3)',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--admin-space-2)',
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className="hover-scale active-press"
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: collapsed ? '0' : '12px',
                    padding: '12px 14px',
                    border: '1px solid transparent',
                    borderRadius: 'var(--admin-radius-sm)',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.06)' : 'transparent',
                    borderColor: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                    color: isActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '13.5px',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
                      e.currentTarget.style.color = 'var(--admin-primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--admin-text-secondary)';
                    }
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '25%',
                        height: '50%',
                        width: '3px',
                        backgroundColor: 'var(--admin-primary)',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}
                  
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  
                  {!collapsed && (
                    <span className="animate-fade-in" style={{ whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}

          {/* SETTINGS MENU BUTTON */}
          <li>
            <button
              ref={settingsRef}
              onClick={handleSettingsClick}
              className="hover-scale active-press"
              title={collapsed ? 'Settings' : undefined}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? '0' : '12px',
                padding: '12px 14px',
                border: '1px solid transparent',
                borderRadius: 'var(--admin-radius-sm)',
                cursor: 'pointer',
                backgroundColor: isSettingsActive ? 'rgba(124, 58, 237, 0.06)' : 'transparent',
                borderColor: isSettingsActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                color: isSettingsActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                fontWeight: isSettingsActive ? 600 : 500,
                fontSize: '13.5px',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (!isSettingsActive) {
                  e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
                  e.currentTarget.style.color = 'var(--admin-primary)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSettingsActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--admin-text-secondary)';
                }
              }}
            >
              {isSettingsActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: '3px',
                    backgroundColor: 'var(--admin-primary)',
                    borderRadius: '0 4px 4px 0'
                  }}
                />
              )}
              
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </span>
              
              {!collapsed && (
                <>
                  <span className="animate-fade-in" style={{ whiteSpace: 'nowrap', flex: 1 }}>
                    Settings
                  </span>
                  
                  {/* Accordion indicator for mobile, arrow for desktop */}
                  {isMobile ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: mobileExpand ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        opacity: 0.6
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        opacity: 0.5,
                        transform: showSubmenu ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </>
              )}
            </button>

            {/* MOBILE ACCORDION INLINE SUBMENU LIST */}
            {isMobile && mobileExpand && !collapsed && (
              <ul
                style={{
                  listStyle: 'none',
                  padding: '4px 0 4px 28px',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  animation: 'mobileSubmenuFade 200ms ease-out'
                }}
              >
                {subNavItems.map((subItem) => {
                  const isSubActive = subItem.paths.includes(currentPath);
                  return (
                    <li key={subItem.label}>
                      <button
                        onClick={() => onNavigate(subItem.path)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: isSubActive ? 'rgba(124, 58, 237, 0.04)' : 'transparent',
                          color: isSubActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                          fontSize: '12.5px',
                          fontWeight: isSubActive ? 600 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {subItem.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>

        {/* 3. Bottom Sign Out section */}
        <div
          style={{
            padding: '16px var(--admin-space-4)',
            borderTop: '1px solid var(--admin-border)',
            boxSizing: 'border-box'
          }}
        >
          <button
            onClick={logout}
            className="hover-scale active-press"
            title={collapsed ? 'Sign Out' : undefined}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: collapsed ? '0' : '12px',
              padding: '12px 14px',
              border: 'none',
              borderRadius: 'var(--admin-radius-sm)',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: 'var(--admin-text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.15s ease',
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
              e.currentTarget.style.color = 'var(--admin-danger)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--admin-text-secondary)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {!collapsed && (
              <span className="animate-fade-in" style={{ whiteSpace: 'nowrap' }}>
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* DESKTOP FLOATING FLY-OUT SUBMENU POPUP */}
      {!isMobile && showSubmenu && (
        <>
          {/* Overlay mask for clicking outside to dismiss */}
          <div
            onClick={() => setShowSubmenu(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              backgroundColor: 'transparent'
            }}
          />

          {/* Submenu floating panel */}
          <div
            style={{
              position: 'fixed',
              left: collapsed ? '80px' : '268px',
              top: `${submenuTop}px`,
              zIndex: 1000,
              width: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
              border: '1px solid var(--admin-border)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              boxSizing: 'border-box',
              animation: 'submenuSlideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {subNavItems.map((subItem) => {
              const isSubActive = subItem.paths.includes(currentPath);
              return (
                <button
                  key={subItem.label}
                  onClick={() => handleSubNavigate(subItem.path)}
                  className="hover-scale active-press"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isSubActive ? 'rgba(124, 58, 237, 0.06)' : 'transparent',
                    color: isSubActive ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                    fontSize: '13px',
                    fontWeight: isSubActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
                      e.currentTarget.style.color = 'var(--admin-primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--admin-text-secondary)';
                    }
                  }}
                >
                  {subItem.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Submenu Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes submenuSlideIn {
          from { opacity: 0; transform: translateX(-8px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes mobileSubmenuFade {
          from { opacity: 0; max-height: 0; overflow: hidden; }
          to { opacity: 1; max-height: 200px; }
        }
      `}} />
    </>
  );
};

export default Sidebar;
