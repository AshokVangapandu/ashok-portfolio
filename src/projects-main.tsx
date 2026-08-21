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

      const isTelemetryDebugEnabled = () => {
        try {
          return window.location.search.includes('telemetryDebug=true') || window.localStorage?.getItem('telemetry_debug') === 'true';
        } catch (_) {
          return false;
        }
      };

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

      const sessionLogged = await (window as any).AnalyticsService.logSession({
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

      if (!sessionLogged && isTelemetryDebugEnabled()) {
        console.warn('[Telemetry] Visitor session was not recorded; continuing without blocking the portfolio.');
      }

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

      {/* Main Content Showcase */}
      <main>
        <ProjectsShowcasePage />
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
