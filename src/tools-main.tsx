/* src/tools-main.tsx */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToolsProductsPage } from './pages/toolsproductspage';
import './admin.css';

const MainLayout: React.FC = () => {
  const [navActive, setNavActive] = useState(false);

  const getBaseUrl = () => {
    const path = window.location.pathname;
    if (path.startsWith('/ashok-portfolio')) {
      return '/ashok-portfolio/';
    }
    return '/';
  };

  const baseUrl = getBaseUrl();

  return (
    <>
      {/* Background Ribbons */}
      <div className="site-bg" aria-hidden="true">
        <div className="light-ribbon ribbon-one"></div>
        <div className="light-ribbon ribbon-two"></div>
        <div className="light-ribbon ribbon-three"></div>
        <div className="aurora"></div>
        <div className="particle-field">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="noise"></div>
      </div>

      {/* Main Content Showcase */}
      <main>
        <ToolsProductsPage />
      </main>
    </>
  );
};

import { AuthProvider } from './auth/AuthProvider';
import { PortfolioSettingsProvider } from './context/PortfolioSettingsContext';
import { GlobalRouteGuard } from './components/routing/GlobalRouteGuard';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <PortfolioSettingsProvider>
          <GlobalRouteGuard>
            <MainLayout />
          </GlobalRouteGuard>
        </PortfolioSettingsProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
export default MainLayout;

