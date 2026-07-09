import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ContentArea } from './ContentArea';
import { DashboardGrid } from './DashboardGrid';
import { MessagesPage } from './MessagesPage';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/admin/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleCloseSidebar = () => {
    setCollapsed(true);
  };

  // Check route path context
  const isMessagesPage = currentPath.endsWith('/messages') || currentPath.includes('/messages/');

  return (
    <div className="admin-layout-root">
      {/* Sidebar Navigation */}
      <Sidebar 
        collapsed={collapsed} 
        onToggleCollapse={handleToggleSidebar} 
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Screen overlay for tablets and mobile when sidebar is active */}
      <div 
        className={`admin-sidebar-overlay ${!collapsed ? 'active' : ''}`} 
        onClick={handleCloseSidebar}
      />

      {/* Main App Frame Wrapper */}
      <div className="admin-app-wrapper">
        {/* Top Fixed Header Navbar */}
        <TopNavbar onToggleSidebar={handleToggleSidebar} />

        {/* Content Container Area */}
        <ContentArea>
          {isMessagesPage ? <MessagesPage /> : <DashboardGrid />}
        </ContentArea>
      </div>
    </div>
  );
};

export default AdminLayout;
