/* src/projects-main.tsx */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ProjectsShowcasePage } from './pages/projectsshowcasepage';
import { resolveTrafficSource } from '../js/utilities/attribution';
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

  useEffect(() => {
    const generateId = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const getVisitorId = () => {
      let vId = localStorage.getItem('visitor_id');
      if (!vId) {
        vId = generateId();
        localStorage.setItem('visitor_id', vId);
      }
      return vId;
    };

    const getSessionId = () => {
      let sId = sessionStorage.getItem('session_id');
      if (!sId) {
        sId = generateId();
        sessionStorage.setItem('session_id', sId);
      }
      return sId;
    };

    const getDeviceDetails = () => {
      const ua = navigator.userAgent;
      let browser = 'Other';
      let os = 'Other';
      let deviceType = 'Desktop';

      if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
      else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
      else if (ua.includes('Trident')) browser = 'Internet Explorer';
      else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
      else if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Safari')) browser = 'Safari';

      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
      else if (ua.includes('Linux')) os = 'Linux';

      if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
        deviceType = /Tablet|iPad/i.test(ua) ? 'Tablet' : 'Mobile';
      }

      return { browser, os, deviceType, userAgent: ua };
    };

    let intervalId: any;

    const initTelemetry = async () => {
      if (!(window as any).AnalyticsService) return;

      const sessionId = getSessionId();
      const visitorId = getVisitorId();
      const device = getDeviceDetails();

      const rawReferrer = document.referrer || '';
      const attribution = resolveTrafficSource(rawReferrer, window.location.search);

      let cachedGeo = { ip_address: 'Unknown', country: 'Unknown', country_code: 'Unknown', city: 'Unknown' };
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          cachedGeo = {
            ip_address: data.ip || 'Unknown',
            country: data.country_name || 'Unknown',
            country_code: data.country_code || 'Unknown',
            city: data.city || 'Unknown'
          };
        }
      } catch (e) {}

      await (window as any).AnalyticsService.logSession({
        id: sessionId,
        visitor_id: visitorId,
        ip_address: cachedGeo.ip_address,
        country: cachedGeo.country,
        country_code: cachedGeo.country_code,
        city: cachedGeo.city,
        user_agent: device.userAgent,
        browser: device.browser,
        operating_system: device.os,
        device_type: device.deviceType,
        referrer: rawReferrer,
        traffic_source: attribution.source,
        traffic_source_display: attribution.sourceDisplay,
        traffic_medium: attribution.medium,
        traffic_campaign: attribution.campaign,
        traffic_content: attribution.content,
        traffic_term: attribution.term,
        referrer_url: attribution.referrer,
        attribution_type: attribution.attributionType
      });

      await (window as any).AnalyticsService.logPageView({
        session_id: sessionId,
        page_path: window.location.pathname || '/pages/projects/index.html',
        page_title: document.title || 'Projects Showcase'
      });

      const startSeconds = Date.now();
      intervalId = setInterval(async () => {
        const elapsed = Math.floor((Date.now() - startSeconds) / 1000);
        await (window as any).AnalyticsService.pingSession(sessionId, elapsed);
      }, 15000);
    };

    initTelemetry();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

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
        <nav className="navbar" aria-label="Projects showcase navigation">
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
            <a href={`${baseUrl}pages/projects/index.html`} className="active" style={{ color: 'var(--admin-secondary)', fontWeight: 700 }} onClick={() => setNavActive(false)}>Projects</a>
            <a href={`${baseUrl}#behind-build`} onClick={() => setNavActive(false)}>Process</a>
            <a href={`${baseUrl}#work`} onClick={() => setNavActive(false)}>Work</a>
            <a href={`${baseUrl}widgets/index.html`} onClick={() => setNavActive(false)}>Tools & Products</a>
            <a href={`${baseUrl}certifications/index.html`} onClick={() => setNavActive(false)}>Certifications</a>
            <a href={`${baseUrl}#contact`} onClick={() => setNavActive(false)}>Contact</a>
          </div>
        </nav>
      </header>

      {/* Main Content Showcase */}
      <main>
        <ProjectsShowcasePage />
      </main>

      {/* Re-inject mobile header toggle styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
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

