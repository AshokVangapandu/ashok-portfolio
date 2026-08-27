/* src/admin/components/TopBarGreeting.tsx */
import React, { useState, useEffect, useMemo } from 'react';
import { getGreetingInfo } from '../services/greetingService';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { resolveIllustration } from '../utils/illustrationResolver';

interface TopBarGreetingProps {
  userName?: string | null;
}

// Future Scalability: Extension section configuration
interface TopbarExtension {
  id: string;
  icon: string;
  label: string;
  value?: string;
  color?: string;
}

// Future extensions (AI-tips, calendar alerts, visitor stats) can be registered here
const SCALABLE_EXTENSIONS: TopbarExtension[] = [
  // Examples of future integrations:
  // { id: 'github', icon: '🐙', label: '14 commits today', color: '#24292e' },
  // { id: 'tasks', icon: '✅', label: '4 pending tasks', color: '#10b981' }
];

export const TopBarGreeting: React.FC<TopBarGreetingProps> = ({ userName }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // 1. Resolve greeting & motivational quote once per mount
  const greetingInfo = useMemo(() => getGreetingInfo(userName), [userName]);

  // 2. Fetch weather on mount & set up 15-minute refresh
  useEffect(() => {
    let isMounted = true;
    let isInitial = true;

    async function fetchWeather(force = false) {
      try {
        if (isInitial) {
          setLoading(true);
        }
        setError(false);
        const data = await getWeatherData(force);
        if (isMounted) {
          setWeather(data);
        }
      } catch (err) {
        console.error('[TopBarGreeting] Failed to load weather data:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isInitial = false;
        }
      }
    }

    fetchWeather(false);

    const intervalId = setInterval(() => {
      fetchWeather(true);
    }, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // 3. Resolve Illustration Name
  const illustrationName = useMemo(() => {
    if (loading || error || !weather) {
      // Fallback illustration name when weather isn't loaded or failed
      return resolveIllustration(greetingInfo.greeting, 'Clear');
    }
    return resolveIllustration(greetingInfo.greeting, weather.condition);
  }, [loading, error, weather, greetingInfo.greeting]);

  // Resolve direct URL path using Vite asset system
  const illustrationUrl = useMemo(() => {
    return new URL(`../../assets/weather/${illustrationName}`, import.meta.url).href;
  }, [illustrationName]);

  // Weather Condition Emoji
  const conditionEmoji = useMemo(() => {
    if (!weather) return '☀️';
    const condition = weather.condition.toLowerCase();
    if (condition.includes('cloud')) return '🌤️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('fog')) return '🌫️';
    if (condition.includes('thunder')) return '⛈️';
    return '☀️';
  }, [weather]);

  return (
    <div className="topbar-greeting-wrapper">
      {/* Responsive stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .topbar-greeting-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 24px;
          font-family: 'Manrope', sans-serif;
          box-sizing: border-box;
          animation: topbarFadeIn 0.4s ease-out;
        }
        .topbar-greeting-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-grow: 1;
        }
        .topbar-greeting-title {
          margin: 0;
          font-size: 16px;
          fontWeight: 700;
          color: var(--admin-text);
          letter-spacing: -0.015em;
          line-height: 1.25;
        }
        .topbar-greeting-motivation {
          font-size: 12.5px;
          color: var(--admin-text-secondary);
          font-weight: 500;
          line-height: 1.35;
        }
        .topbar-greeting-weather {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--admin-text-secondary);
          margin-top: 2px;
        }
        .topbar-greeting-illustration {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
        }
        .topbar-greeting-illustration img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: topbarIllustrationFade 0.45s ease-out;
        }
        .topbar-extension-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .topbar-extension-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 550;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(143, 133, 255, 0.06);
          border: 1px solid rgba(143, 133, 255, 0.12);
        }

        @keyframes topbarFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes topbarIllustrationFade {
          from { opacity: 0; transform: scale(0.9) rotate(-3deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes topbarSkeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Mobile Responsive adjustments */
        @media (max-width: 580px) {
          .topbar-greeting-wrapper {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 4px 0;
          }
          .topbar-greeting-illustration {
            align-self: flex-start;
            margin-top: 4px;
          }
        }
      `}} />

      {/* Left side info block */}
      <div className="topbar-greeting-content">
        {loading ? (
          <>
            <h1 className="topbar-greeting-title" style={{ animation: 'topbarSkeletonPulse 1.5s infinite' }}>
              Loading greeting...
            </h1>
            <span className="topbar-greeting-motivation" style={{ animation: 'topbarSkeletonPulse 1.5s infinite' }}>
              Loading weather details...
            </span>
          </>
        ) : (
          <>
            <h1 className="topbar-greeting-title">
              {greetingInfo.greeting}, {greetingInfo.userName} 👋
            </h1>
            
            <span className="topbar-greeting-motivation">
              {greetingInfo.message}
            </span>
          </>
        )}

        {/* Weather Tag Row */}
        <div className="topbar-greeting-weather">
          {loading && (
            <span style={{ fontSize: '11px', color: 'rgba(15, 23, 42, 0.4)' }}>
              Loading weather...
            </span>
          )}

          {error && !loading && (
            <span style={{ color: 'var(--admin-danger)', fontWeight: 550 }}>
              Weather unavailable
            </span>
          )}

          {!loading && !error && weather && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span>{conditionEmoji}</span>
              <span>{weather.temperature}°C</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span>{weather.city}</span>
            </span>
          )}
        </div>

        {/* Future Scalability Extension Container */}
        {SCALABLE_EXTENSIONS.length > 0 && (
          <div className="topbar-extension-container">
            {SCALABLE_EXTENSIONS.map((ext) => (
              <div 
                key={ext.id} 
                className="topbar-extension-pill" 
                style={{ color: ext.color || 'var(--admin-text-secondary)' }}
              >
                <span>{ext.icon}</span>
                <span>{ext.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side weather illustration */}
      <div className="topbar-greeting-illustration">
        {loading ? (
          // Placeholder loading illustration - avoids layout shifting
          <svg width="48" height="48" viewBox="0 0 100 100" style={{ opacity: 0.15, animation: 'topbarSkeletonPulse 1.5s infinite' }}>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="10, 6" />
            <circle cx="50" cy="50" r="15" fill="currentColor" />
          </svg>
        ) : (
          <img 
            key={illustrationName} // Key triggers CSS refade on source swap
            src={illustrationUrl} 
            alt={weather ? weather.condition : 'Fallback Weather'} 
          />
        )}
      </div>
    </div>
  );
};

export default TopBarGreeting;
