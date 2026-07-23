/* src/admin/layout/Sidebar.tsx */
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
  path: string;
}

interface SidebarProps {
  collapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  currentPath,
  onNavigate,
  onToggleSidebar,
}) => {
  const { logout } = useAuth();
  const [settingsExpanded, setSettingsExpanded] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      return path.includes('/settings') || path.includes('/social-links') || path.includes('/access');
    }
    return false;
  });
  const [portfolioContentExpanded, setPortfolioContentExpanded] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      return path.includes('/admin/projects') || path.includes('/admin/certifications') || path.includes('/admin/tools-products');
    }
    return false;
  });

  // Normalize current path for comparisons (strip /ashok-portfolio and trailing slash)
  let cleanPath = currentPath.toLowerCase().replace(/\/$/, '');
  if (cleanPath.startsWith('/ashok-portfolio')) {
    cleanPath = cleanPath.substring('/ashok-portfolio'.length);
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  const menuItems: MenuItem[] = [
    { 
      label: 'Dashboard', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ), 
      path: '/admin/' 
    },
    {
      label: 'Portfolio Content',
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      path: '/admin/portfolio-content'
    },
    { 
      label: 'Contacts', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ), 
      path: '/admin/contacts' 
    },
    { 
      label: 'Testimonials', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ), 
      path: '/admin/testimonials' 
    },
    { 
      label: 'Resume Downloads', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      ), 
      path: '/admin/resume' 
    },
    { 
      label: 'Analytics', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ), 
      path: '/admin/analytics' 
    },
    { 
      label: 'Settings', 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ), 
      path: '/admin/settings' 
    }
  ];

  return (
    <>
      <aside
        className={`premium-sidebar admin-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
        style={{
          width: collapsed ? '72px' : '240px',
          background: '#080720',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1010,
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'visible',
          transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Toggle Collapse Button floating on the right border */}
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle-btn"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          )}
        </button>

        {/* 1. Header Logo & Title block */}
        <a
          href={window.location.pathname.startsWith('/ashok-portfolio') ? '/ashok-portfolio/' : '/'}
          title="Back to Portfolio Site"
          style={{
            padding: collapsed ? '0' : '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            height: '72px',
            boxSizing: 'border-box',
            width: '100%',
            transition: 'padding 280ms cubic-bezier(0.4, 0, 0.2, 1)',
            textDecoration: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', width: '100%' }}>
            {/* Logo Icon */}
            <div
              className="premium-sidebar-logo"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* Profile Info (Labels) - Persistent in DOM, collapsed via CSS */}
            <div className="sidebar-profile-info" style={{ display: collapsed ? 'none' : 'flex', flexDirection: 'column', marginLeft: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                Ashok V
              </span>
              <span style={{ fontSize: '11px', color: '#8E8EA8', fontWeight: 550, lineHeight: 1.1, marginTop: '2.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Website
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </span>
            </div>
          </div>
        </a>

        {/* 2. Menu Navigation Links List */}
        <ul className="premium-menu-list">
          {menuItems.map((item) => {
            const isDashboard = item.path === '/admin/';
            const isSettings = item.label === 'Settings';
            const isPortfolioContent = item.label === 'Portfolio Content';
            const isActive = isDashboard 
              ? (cleanPath === '/admin' || cleanPath === '/admin/')
              : (isSettings
                ? (cleanPath.startsWith('/admin/settings') || cleanPath === '/admin/social-links' || cleanPath === '/admin/access')
                : (isPortfolioContent
                  ? (cleanPath === '/admin/projects' || cleanPath === '/admin/certifications' || cleanPath === '/admin/tools-products')
                  : cleanPath === item.path.replace(/\/$/, '').toLowerCase()));

            const subItems = [
              { label: 'Portfolio Settings', path: '/admin/settings/portfolio' },
              { label: 'Social Links', path: '/admin/settings/social-links' },
              { label: 'Admin Access', path: '/admin/settings/admin-access' }
            ];

            const portfolioSubItems = [
              { label: 'Projects', path: '/admin/projects' },
              { label: 'Certifications', path: '/admin/certifications' },
              { label: 'Tools & Products', path: '/admin/tools-products' }
            ];

            return (
              <li 
                key={item.label} 
                style={{ width: '100%', position: 'relative' }}
                className="menu-item-wrapper"
              >
                <button
                  onClick={() => {
                    if (isSettings) {
                      setSettingsExpanded(!settingsExpanded);
                    } else if (isPortfolioContent) {
                      setPortfolioContentExpanded(!portfolioContentExpanded);
                    } else {
                      onNavigate(item.path);
                    }
                  }}
                  className={`premium-menu-btn ${collapsed ? 'collapsed' : 'expanded'} ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="menu-icon">
                    {item.icon(isActive)}
                  </span>
                  
                  <span className="menu-label">
                    {item.label}
                  </span>

                  {(isSettings || isPortfolioContent) && (
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      style={{
                        marginLeft: 'auto',
                        transform: (isSettings ? settingsExpanded : portfolioContentExpanded) ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 200ms ease',
                        display: collapsed ? 'none' : 'block',
                        color: isActive ? '#FFFFFF' : '#8E8EA8'
                      }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>

                {isPortfolioContent && (
                  <>
                    {/* Expanded Sidebar Submenu */}
                    <div
                      className="portfolio-content-submenu-container"
                      style={{
                        maxHeight: (!collapsed && portfolioContentExpanded) ? '150px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: collapsed ? '0' : '28px',
                        marginTop: (!collapsed && portfolioContentExpanded) ? '4px' : '0px'
                      }}
                    >
                      {portfolioSubItems.map((sub) => {
                        const isSubActive = cleanPath === sub.path;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => onNavigate(sub.path)}
                            className={`submenu-item ${isSubActive ? 'active' : ''}`}
                            style={{
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: '8px',
                              color: isSubActive ? '#FFFFFF' : '#8E8EA8',
                              cursor: 'pointer',
                              padding: '0 16px',
                              fontSize: '12.5px',
                              fontWeight: isSubActive ? 600 : 500,
                              textAlign: 'left',
                              position: 'relative',
                              transition: 'all 200ms ease',
                              textDecoration: 'none',
                              outline: 'none',
                              width: '100%'
                            }}
                          >
                            {isSubActive && (
                              <span
                                style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#6366F1',
                                  position: 'absolute',
                                  left: '6px',
                                  top: '50%',
                                  transform: 'translateY(-50%)'
                                }}
                              />
                            )}
                            <span style={{ marginLeft: isSubActive ? '4px' : '0' }}>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Collapsed Sidebar Floating Submenu */}
                    {collapsed && (
                      <div className="floating-submenu">
                        <div
                          style={{
                            padding: '6px 12px',
                            borderBottom: '1px solid #F1F5F9',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#94A3B8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '4px'
                          }}
                        >
                          Portfolio Content
                        </div>
                        {portfolioSubItems.map((sub) => {
                          const isSubActive = cleanPath === sub.path;
                          return (
                            <button
                              key={sub.label}
                              onClick={() => onNavigate(sub.path)}
                              style={{
                                height: '32px',
                                border: 'none',
                                background: isSubActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                                borderRadius: '6px',
                                color: isSubActive ? 'var(--admin-primary)' : '#475569',
                                cursor: 'pointer',
                                padding: '0 12px',
                                fontSize: '12px',
                                fontWeight: isSubActive ? 600 : 500,
                                textAlign: 'left',
                                transition: 'all 150ms ease',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = 'var(--admin-primary)';
                                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.04)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = '#475569';
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {isSettings && (
                  <>
                    {/* Expanded Sidebar Submenu */}
                    <div
                      className="settings-submenu-container"
                      style={{
                        maxHeight: (!collapsed && settingsExpanded) ? '150px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingLeft: collapsed ? '0' : '28px',
                        marginTop: (!collapsed && settingsExpanded) ? '4px' : '0px'
                      }}
                    >
                      {subItems.map((sub) => {
                        const isSubActive = sub.label === 'Portfolio Settings'
                          ? (cleanPath === '/admin/settings/portfolio' || cleanPath === '/admin/settings')
                          : cleanPath === sub.path;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => onNavigate(sub.path)}
                            className={`submenu-item ${isSubActive ? 'active' : ''}`}
                            style={{
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              border: 'none',
                              background: 'transparent',
                              borderRadius: '8px',
                              color: isSubActive ? '#FFFFFF' : '#8E8EA8',
                              cursor: 'pointer',
                              padding: '0 16px',
                              fontSize: '12.5px',
                              fontWeight: isSubActive ? 600 : 500,
                              textAlign: 'left',
                              position: 'relative',
                              transition: 'all 200ms ease',
                              textDecoration: 'none',
                              outline: 'none',
                              width: '100%'
                            }}
                          >
                            {isSubActive && (
                              <span
                                style={{
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: '#6366F1',
                                  position: 'absolute',
                                  left: '6px',
                                  top: '50%',
                                  transform: 'translateY(-50%)'
                                }}
                              />
                            )}
                            <span style={{ marginLeft: isSubActive ? '4px' : '0' }}>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Collapsed Sidebar Floating Submenu */}
                    {collapsed && (
                      <div className="floating-submenu">
                        <div
                          style={{
                            padding: '6px 12px',
                            borderBottom: '1px solid #F1F5F9',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#94A3B8',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '4px'
                          }}
                        >
                          Settings
                        </div>
                        {subItems.map((sub) => {
                          const isSubActive = sub.label === 'Portfolio Settings'
                            ? (cleanPath === '/admin/settings/portfolio' || cleanPath === '/admin/settings')
                            : cleanPath === sub.path;
                          return (
                            <button
                              key={sub.label}
                              onClick={() => onNavigate(sub.path)}
                              style={{
                                height: '32px',
                                border: 'none',
                                background: isSubActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                                borderRadius: '6px',
                                color: isSubActive ? 'var(--admin-primary)' : '#475569',
                                cursor: 'pointer',
                                padding: '0 12px',
                                fontSize: '12px',
                                fontWeight: isSubActive ? 600 : 500,
                                textAlign: 'left',
                                transition: 'all 150ms ease',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = 'var(--admin-primary)';
                                  e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.04)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = '#475569';
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>

        {/* 3. Edith AI Card Widget - Persistent in DOM, collapsed via CSS */}
        <div className="edith-card">
          <div className="edith-card-header">
            <div className="edith-spark-icon">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 2l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4z" />
              </svg>
            </div>
            <span className="edith-title">Edith AI</span>
            <span className="edith-badge">AI</span>
          </div>
          
          <p className="edith-text">
            Your smart portfolio assistant is here to help you grow.
          </p>

          <div className="edith-visual">
            <svg viewBox="0 0 100 50" width="100" height="50" style={{ overflow: 'visible' }}>
              {/* Glowing Outer Face Circle */}
              <circle cx="50" cy="25" r="21" fill="#0B0A26" stroke="#4F46E5" strokeWidth="1.5" style={{ opacity: 0.9, filter: 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.4))' }} />
              
              {/* Pulsing Eyes */}
              <circle className="edith-eye" cx="42" cy="22" r="2.5" fill="#A78BFA" />
              <circle className="edith-eye" cx="58" cy="22" r="2.5" fill="#A78BFA" />
              
              {/* Heartbeat/AI Soundwave curve */}
              <path 
                className="edith-wave"
                d="M37 32 Q 42 27, 46 32 T 50 30 T 54 34 T 59 30 T 63 32" 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          <button className="edith-ask-btn">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ask Edith
          </button>
        </div>

        {/* 4. Bottom Sign Out section */}
        <div className="sidebar-footer">
          <button
            onClick={logout}
            className={`signout-btn ${collapsed ? 'collapsed' : 'expanded'}`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <span className="menu-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span className="menu-label">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Scoped CSS Stylesheet (Avoids conflict with light theme variables) */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Overriding .admin-sidebar default light overrides with higher specificity */
        .premium-sidebar.admin-sidebar {
          background-color: #080720 !important;
          border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25) !important;
        }

        .premium-sidebar .sidebar-toggle-btn {
          position: absolute;
          top: 22px;
          right: -14px;
          z-index: 210;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #080720;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8E8EA8;
          cursor: pointer;
          transition: all 200ms ease;
          outline: none;
        }

        .premium-sidebar .sidebar-toggle-btn:hover {
          background-color: #4F46E5;
          color: #FFFFFF;
          border-color: #4F46E5;
          transform: scale(1.1);
        }

        /* Profile Labels wrapper animation transitions */
        .premium-sidebar .sidebar-profile-info {
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          white-space: nowrap;
          opacity: 1;
          max-width: 160px;
          transition: opacity 200ms ease, max-width 280ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .premium-sidebar.collapsed .sidebar-profile-info {
          opacity: 0;
          max-width: 0;
          margin-left: 0;
          pointer-events: none;
        }

        .premium-sidebar .premium-menu-list {
          list-style: none;
          padding: 16px 12px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow: visible;
          transition: padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scoped Custom Scrollbars */
        .premium-sidebar .premium-menu-list::-webkit-scrollbar {
          width: 4px;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .premium-sidebar .premium-menu-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          border: none;
          background: transparent;
          border-radius: 10px;
          color: #8E8EA8;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          text-decoration: none;
          outline: none;
          padding: 0 16px;
        }

        .premium-sidebar.collapsed .premium-menu-btn {
          padding: 0;
          justify-content: center;
        }

        /* Hover states */
        .premium-sidebar .premium-menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
        }

        /* Active states */
        .premium-sidebar .premium-menu-btn.active {
          background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
        }

        .premium-sidebar .premium-menu-btn.active .menu-icon {
          color: #FFFFFF !important;
        }

        .premium-sidebar .menu-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: inherit;
          transition: color 200ms ease;
        }

        /* Menu Text labels animation transitions */
        .premium-sidebar .menu-label {
          font-size: 13.5px;
          font-weight: 550;
          white-space: nowrap;
          opacity: 1;
          max-width: 165px;
          margin-left: 12px;
          transition: opacity 180ms ease, max-width 280ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: inline-block;
        }

        .premium-sidebar.collapsed .menu-label {
          opacity: 0;
          max-width: 0;
          margin-left: 0;
          pointer-events: none;
        }

        /* Edith AI Card Widget smooth transitions */
        .premium-sidebar .edith-card {
          margin: 12px;
          padding: 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0D0C25 0%, #15103B 100%);
          border: 1px solid rgba(124, 58, 237, 0.15);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          opacity: 1;
          max-height: 220px;
          transition: opacity 180ms ease, max-height 280ms cubic-bezier(0.4, 0, 0.2, 1), margin 280ms cubic-bezier(0.4, 0, 0.2, 1), padding 280ms cubic-bezier(0.4, 0, 0.2, 1), border-width 280ms ease;
        }

        .premium-sidebar.collapsed .edith-card {
          opacity: 0;
          max-height: 0;
          margin: 0;
          padding: 0;
          border-width: 0;
          pointer-events: none;
        }

        .premium-sidebar .edith-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .premium-sidebar .edith-spark-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C4B5FD;
          flex-shrink: 0;
        }

        .premium-sidebar .edith-title {
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          margin-left: 8px;
        }

        .premium-sidebar .edith-badge {
          background: rgba(124, 58, 237, 0.25);
          color: #C4B5FD;
          padding: 1px 5px;
          font-size: 9px;
          font-weight: 700;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }

        .premium-sidebar .edith-text {
          color: #8E8EA8;
          font-size: 11px;
          line-height: 1.4;
          margin: 0 0 12px 0;
        }

        .premium-sidebar .edith-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          height: 50px;
        }

        /* Micro animations */
        @keyframes eyeGlow {
          0%, 100% { filter: drop-shadow(0 0 1px #7C3AED); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 5px #A78BFA); opacity: 1; }
        }
        .premium-sidebar .edith-eye {
          animation: eyeGlow 2.5s infinite ease-in-out;
        }

        @keyframes waveMotion {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-1.5px); opacity: 1; }
        }
        .premium-sidebar .edith-wave {
          animation: waveMotion 3s infinite ease-in-out;
        }

        .premium-sidebar .edith-ask-btn {
          width: 100%;
          height: 34px;
          border: none;
          background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
          color: #FFFFFF;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          outline: none;
        }

        .premium-sidebar .edith-ask-btn:hover {
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.4);
          transform: translateY(-1px);
        }

        .premium-sidebar .edith-ask-btn:active {
          transform: translateY(0);
        }

        /* Sign Out Section */
        .premium-sidebar .sidebar-footer {
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          box-sizing: border-box;
          width: 100%;
          transition: padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-sidebar .signout-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          border: none;
          background: transparent;
          border-radius: 10px;
          color: #8E8EA8;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          outline: none;
        }

        .premium-sidebar.collapsed .signout-btn {
          padding: 0;
          justify-content: center;
        }

        .premium-sidebar .signout-btn:hover {
          background-color: rgba(239, 68, 68, 0.06) !important;
          color: #EF4444 !important;
        }

        .premium-sidebar .submenu-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: #FFFFFF;
        }

        .premium-sidebar .floating-submenu {
          position: absolute;
          left: 100%;
          top: 0;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 8px;
          width: 170px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 1000;
          margin-left: 8px;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-10px);
          transition: opacity 220ms ease, transform 220ms ease;
          box-sizing: border-box;
        }

        .premium-sidebar .floating-submenu::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: -12px;
          width: 12px;
          background: transparent;
        }

        .menu-item-wrapper:hover .floating-submenu {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0);
        }
      `}} />
    </>
  );
};

export default Sidebar;
