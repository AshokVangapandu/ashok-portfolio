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

      {/* Header Navigation */}
      <header className="site-header" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <nav className="navbar" aria-label="Widget gallery navigation">
          <a className="brand" href={baseUrl} aria-label="Ashok Vangapandu home">
            <span className="brand-mark">AV</span>
            <span className="brand-copy">
              <span className="brand-name">Ashok Vangapandu</span>
            </span>
          </a>

          <button 
            className={`nav-toggle ${navActive ? 'active' : ''}`} 
            type="button" 
            aria-label="Open navigation" 
            aria-expanded={navActive}
            onClick={() => setNavActive(!navActive)}
          >
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${navActive ? 'active' : ''}`} data-nav-menu>
            <a href={`${baseUrl}#expertise`} onClick={() => setNavActive(false)}>Expertise</a>
            <a href={`${baseUrl}pages/projects/index.html`} onClick={() => setNavActive(false)}>Projects</a>
            <a href={`${baseUrl}#behind-build`} onClick={() => setNavActive(false)}>Process</a>
            <a href={`${baseUrl}#work`} onClick={() => setNavActive(false)}>Work</a>
            <a href={`${baseUrl}widgets/index.html`} className="active" style={{ color: 'var(--admin-secondary)', fontWeight: 700 }} onClick={() => setNavActive(false)}>Tools & Products</a>
            <a href={`${baseUrl}certifications/index.html`} onClick={() => setNavActive(false)}>Certifications</a>
            <a href={`${baseUrl}#contact`} onClick={() => setNavActive(false)}>Contact</a>
          </div>
        </nav>
      </header>

      {/* Main Content Showcase */}
      <main>
        <ToolsProductsPage />
      </main>

      {/* Re-inject mobile header toggle styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: rgba(15, 20, 33, 0.95);
            backdrop-filter: blur(12px);
            padding: 24px;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            gap: 16px;
          }
          .nav-links.active {
            display: flex;
          }
          .nav-toggle.active span:first-child {
            transform: rotate(45deg) translate(5px, 5px);
          }
          .nav-toggle.active span:last-child {
            transform: rotate(-45deg) translate(5px, -5px);
          }
        }
      `}} />
    </>
  );
};

import { PortfolioSettingsProvider } from './context/PortfolioSettingsContext';
import { GlobalRouteGuard } from './components/routing/GlobalRouteGuard';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <PortfolioSettingsProvider>
        <GlobalRouteGuard>
          <MainLayout />
        </GlobalRouteGuard>
      </PortfolioSettingsProvider>
    </React.StrictMode>
  );
}
export default MainLayout;
