/* src/tools-main.tsx */
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ToolsProductsPage } from './pages/toolsproductspage';
import './admin.css';
import { PortfolioBackground } from './components/PortfolioBackground';

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
      <PortfolioBackground />

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

