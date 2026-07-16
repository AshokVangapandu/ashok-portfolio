import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface PageLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  pageTitle: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
  pageTitle,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin-sidebar-collapsed');
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return false; // Expanded by default
  });
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const width = window.innerWidth;
        const isTabletOrMobile = width < 980;
        setIsMobileOrTablet(isTabletOrMobile);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed((prev) => {
      const newVal = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-sidebar-collapsed', String(newVal));
      }
      return newVal;
    });
  };

  const contentMarginLeft = isMobileOrTablet ? '0px' : (collapsed ? '72px' : '240px');

  return (
    <div 
      className="admin-dashboard-env"
      style={{
        minHeight: '100vh',
        background: 'var(--admin-gradient-light)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        currentPath={currentPath}
        onNavigate={onNavigate}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Screen overlay for tablets and mobile when sidebar is active */}
      <div 
        className={`admin-sidebar-overlay ${(isMobileOrTablet && !collapsed) ? 'active' : ''}`} 
        onClick={() => setCollapsed(true)}
      />

      {/* Main Content Area Wrapper */}
      <div
        className="transition-layout"
        style={{
          marginLeft: contentMarginLeft,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          boxSizing: 'border-box',
          transition: 'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Header Topbar */}
        <Topbar
          onToggleSidebar={handleToggleSidebar}
          pageTitle={pageTitle}
        />

        {/* Dynamic Inner Panel View Container */}
        <main
          className="animate-fade-in"
          style={{
            padding: 'var(--admin-space-6)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--admin-space-4)',
            boxSizing: 'border-box'
          }}
        >
          {/* Active module content viewport */}
          <div style={{ flex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
