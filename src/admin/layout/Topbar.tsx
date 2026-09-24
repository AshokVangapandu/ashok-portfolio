import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/client';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { useAdminNotifications, AdminNotification } from '../hooks/useAdminNotifications';

interface TopbarProps {
  onToggleSidebar?: () => void;
  pageTitle: string;
  onNavigate?: (path: string) => void;
}

// 1. Reusable NotificationItem Component
interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  iconBg: string;
  iconColor: string;
  isRead?: boolean;
  onClick?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  icon,
  title,
  description,
  timestamp,
  iconBg,
  iconColor,
  isRead = true,
  onClick,
}) => {
  return (
    <div
      className={`premium-notification-item ${!isRead ? 'unread' : ''}`}
      onClick={onClick}
    >
      <div
        className="notification-icon-box"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="notification-item-details">
        <div className="notification-item-header">
          <h4 className="notification-item-title">{title}</h4>
          {!isRead && <span className="notification-unread-dot" />}
        </div>
        <p className="notification-item-desc" title={description}>{description}</p>
        <span className="notification-item-time">{timestamp}</span>
      </div>
    </div>
  );
};

// 2. Main Topbar Component
export const Topbar: React.FC<TopbarProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [greeting, setGreeting] = useState('Good Afternoon');
  const [adminName, setAdminName] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Dynamic admin notifications
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead
  } = useAdminNotifications();

  // Dynamic weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async (force = false) => {
      try {
        const data = await getWeatherData(force);
        if (isMounted) {
          setWeather(data);
          setWeatherLoading(false);
        }
      } catch (err) {
        console.warn('[Topbar] Error loading weather:', err);
        if (isMounted) {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather(false);
    const interval = setInterval(() => fetchWeather(true), 15 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const conditionEmoji = useMemo(() => {
    if (!weather) return '☀️';
    const c = (weather.condition || '').toLowerCase();
    if (c.includes('thunder')) return '⛈️';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
    if (c.includes('snow') || c.includes('ice') || c.includes('blizzard')) return '❄️';
    if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '🌫️';
    if (c.includes('cloud') || c.includes('overcast')) return '⛅';
    return '☀️';
  }, [weather]);
 
  // Fetch admin name from database if authenticated
  useEffect(() => {
    const fetchAdminName = async () => {
      if (user?.email) {
        try {
          const { data, error } = await supabase
            .from('admins')
            .select('full_name')
            .eq('email', user.email.trim().toLowerCase())
            .maybeSingle();
          if (!error && data?.full_name) {
            setAdminName(data.full_name);
          }
        } catch (err) {
          console.error('Error fetching admin full_name:', err);
        }
      }
    };
    fetchAdminName();
  }, [user]);

  // Calculate greeting based on local time
  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const userDisplayName = adminName || user?.user_metadata?.full_name || 'Administrator';
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD';
  };

  const userInitials = getInitials(userDisplayName);

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'testimonial':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case 'contact':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case 'download':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
        );
    }
  };

  return (
    <header className="premium-topbar">
      {/* 1. Left Greeting Section */}
      <div className="topbar-left-greeting">
        <h1 className="greeting-title">
          {greeting}, {userDisplayName} 👋
        </h1>
        <p className="greeting-subtitle">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Right Controls Container */}
      <div className="topbar-right-controls">
        {/* 2. Weather Information Widget */}
        <div
          className="weather-widget-card"
          title={weather ? `${weather.condition} in ${weather.city}` : 'Local Weather Conditions'}
        >
          <span className="weather-widget-icon">{conditionEmoji}</span>
          <div className="weather-widget-text">
            <span className="weather-temp">
              {weather ? `${weather.temperature}°C` : (weatherLoading ? '--°C' : '30°C')}
            </span>
            <span className="weather-city">
              {weather ? weather.city : (weatherLoading ? 'Locating...' : 'Local')}
            </span>
          </div>
        </div>

        {/* 3. Notification Center (Bell + Dropdown) */}
        <div className="notification-container">
          <button
            className={`notification-bell-btn ${notificationsOpen ? 'active' : ''}`}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            aria-label="Toggle notifications menu"
          >
            {/* Standard bell SVG */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            
            {/* Unread badge count */}
            {unreadCount > 0 && <div className="notification-badge">{unreadCount}</div>}
          </button>

          {notificationsOpen && (
            <>
              {/* Click-outside dismiss overlay */}
              <div
                className="dropdown-dismiss-overlay"
                onClick={() => setNotificationsOpen(false)}
              />

              {/* Floating Notification Panel */}
              <div className="notification-panel animate-fade-in">
                {/* Panel Header */}
                <div className="notification-panel-header">
                  <div className="panel-header-left">
                    <h4 className="panel-title-text">Notifications</h4>
                    <span className="panel-unread-sub">
                      You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="mark-read-btn"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification Feed List */}
                <div className="notification-items-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty-state">
                      <div className="empty-bell-icon">🔔</div>
                      <p className="empty-title">No new notifications</p>
                      <p className="empty-subtitle">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <NotificationItem
                        key={item.id}
                        icon={getNotificationIcon(item.type)}
                        title={item.title}
                        description={item.description}
                        timestamp={item.timestamp}
                        iconBg={item.iconBg}
                        iconColor={item.iconColor}
                        isRead={item.isRead}
                        onClick={() => {
                          markAsRead(item.id);
                          setNotificationsOpen(false);
                          if (item.type === 'testimonial') handleNavigate('/admin/testimonials');
                          else if (item.type === 'contact') handleNavigate('/admin/contacts');
                          else if (item.type === 'download') handleNavigate('/admin/resume');
                        }}
                      />
                    ))
                  )}
                </div>

                {/* Panel Footer */}
                <div className="notification-panel-footer">
                  <a
                    href="#/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      setNotificationsOpen(false);
                      handleNavigate('/admin/testimonials');
                    }}
                    className="view-all-notifications-link"
                  >
                    <span>View All Testimonials & Activity</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. Administrator Profile Block & Dropdown */}
        <div className="profile-container">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`profile-card-btn ${dropdownOpen ? 'active' : ''}`}
            aria-label="User profile menu"
          >
            <div className="profile-avatar">
              {userInitials}
            </div>
            
            <div className="profile-info">
              <span className="profile-name">
                {userDisplayName}
              </span>
              <span className="profile-role">
                Portfolio Admin
              </span>
            </div>
            
            <svg
              className={`profile-chevron ${dropdownOpen ? 'rotate' : ''}`}
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              {/* Click-outside dismiss overlay */}
              <div
                className="dropdown-dismiss-overlay"
                onClick={() => setDropdownOpen(false)}
              />
              
              {/* Floating Dropdown Panel */}
              <div className="profile-dropdown-panel animate-fade-in">
                <div className="dropdown-user-header">
                  <span className="user-header-name">{userDisplayName}</span>
                  <span className="user-header-email">{user?.email || 'admin@portfolio.com'}</span>
                </div>
                <div className="dropdown-divider" />
                
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item-btn"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item-btn"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Settings
                </button>
                <a
                  href={window.location.pathname.startsWith('/ashok-portfolio') ? '/ashok-portfolio/' : '/'}
                  onClick={() => setDropdownOpen(false)}
                  className="dropdown-item-btn"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Go to Portfolio
                </a>
                
                <div className="dropdown-divider" />
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="dropdown-item-btn logout"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .premium-topbar {
          height: 72px;
          background: #FFFFFF;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Manrope', sans-serif;
          box-sizing: border-box;
        }

        /* 1. Left Greeting */
        .premium-topbar .topbar-left-greeting {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .premium-topbar .greeting-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .premium-topbar .greeting-subtitle {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: #64748B;
          line-height: 1.35;
        }

        /* Right side layout wrapper */
        .premium-topbar .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* 2. Weather Information Widget */
        .premium-topbar .weather-widget-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          height: 40px;
          box-sizing: border-box;
          transition: all 200ms ease;
        }

        .premium-topbar .weather-widget-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .weather-widget-icon {
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-topbar .weather-widget-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          line-height: 1.15;
          text-align: left;
        }

        .premium-topbar .weather-temp {
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
        }

        .premium-topbar .weather-city {
          font-size: 9.5px;
          font-weight: 550;
          color: #64748B;
          margin-top: 1px;
        }

        /* 3. Notification Center Container */
        .premium-topbar .notification-container {
          position: relative;
        }

        .premium-topbar .notification-bell-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          position: relative;
          transition: all 200ms ease;
          outline: none;
          padding: 0;
        }

        .premium-topbar .notification-bell-btn:hover {
          color: #4F46E5;
          border-color: #CBD5E1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .notification-bell-btn.active {
          background-color: rgba(124, 58, 237, 0.04);
          color: #4F46E5;
          border-color: rgba(124, 58, 237, 0.2);
        }

        /* Unread badge */
        .premium-topbar .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #EF4444;
          color: #FFFFFF;
          font-size: 9.5px;
          font-weight: 700;
          min-width: 15px;
          height: 15px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-sizing: border-box;
          border: 1.5px solid #FFFFFF;
          line-height: 1;
        }

        /* Floating Notification Panel */
        .premium-topbar .notification-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 360px;
          background-color: #FFFFFF;
          border-radius: 18px;
          border: 1px solid var(--admin-border);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transform-origin: top right;
          overflow: hidden;
        }

        /* Panel Header */
        .premium-topbar .notification-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #F1F5F9;
        }

        .premium-topbar .panel-header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .premium-topbar .panel-title-text {
          font-size: 15px;
          font-weight: 750;
          color: #0F172A;
          margin: 0;
        }

        .premium-topbar .panel-unread-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 550;
        }

        .premium-topbar .mark-read-btn {
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease;
          outline: none;
        }

        .premium-topbar .mark-read-btn:hover {
          color: #3730A3;
        }

        /* Panel Body / Items list */
        .premium-topbar .notification-items-list {
          display: flex;
          flex-direction: column;
          max-height: 380px;
          overflow-y: auto;
        }

        /* Item Row styling */
        .premium-topbar .premium-notification-item {
          display: flex;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #F8FAFC;
          cursor: pointer;
          transition: all 180ms ease;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          position: relative;
        }

        .premium-topbar .premium-notification-item:hover {
          background-color: rgba(124, 58, 237, 0.02);
        }

        .premium-topbar .premium-notification-item.unread {
          background-color: rgba(124, 58, 237, 0.03);
        }

        .premium-topbar .premium-notification-item.unread:hover {
          background-color: rgba(124, 58, 237, 0.06);
        }

        .premium-topbar .notification-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .premium-topbar .notification-item-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
          overflow: hidden;
        }

        .premium-topbar .notification-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .premium-topbar .notification-item-title {
          font-size: 13px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .premium-topbar .notification-unread-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #7C3AED;
          flex-shrink: 0;
        }

        .premium-topbar .notification-item-desc {
          font-size: 12px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .premium-topbar .notification-item-time {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 550;
          margin-top: 2px;
        }

        /* Empty state */
        .premium-topbar .notification-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 20px;
          text-align: center;
        }

        .premium-topbar .empty-bell-icon {
          font-size: 28px;
          margin-bottom: 8px;
          filter: grayscale(0.2);
        }

        .premium-topbar .empty-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          margin: 0 0 4px 0;
        }

        .premium-topbar .empty-subtitle {
          font-size: 11.5px;
          color: #94A3B8;
          font-weight: 500;
          margin: 0;
        }

        /* Panel Footer */
        .premium-topbar .notification-panel-footer {
          padding: 12px;
          border-top: 1px solid #F1F5F9;
          text-align: center;
          background-color: #F8FAFC;
        }

        .premium-topbar .view-all-notifications-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          text-decoration: none;
          transition: color 150ms ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .premium-topbar .view-all-notifications-link:hover {
          color: #3730A3;
        }

        /* 4. Administrator Profile widget */
        .premium-topbar .profile-container {
          position: relative;
        }

        .premium-topbar .profile-card-btn {
          background: transparent;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px 4px 4px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 200ms ease;
          box-sizing: border-box;
          outline: none;
        }

        .premium-topbar .profile-card-btn:hover {
          background-color: rgba(124, 58, 237, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .profile-card-btn.active {
          background-color: rgba(124, 58, 237, 0.06);
        }

        .premium-topbar .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.2);
          transition: all 200ms ease;
          flex-shrink: 0;
        }

        .premium-topbar .profile-card-btn:hover .profile-avatar {
          transform: scale(1.03);
          box-shadow: 0 3px 8px rgba(124, 58, 237, 0.25);
        }

        .premium-topbar .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          margin-right: 4px;
        }

        .premium-topbar .profile-name {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.25;
        }

        .premium-topbar .profile-role {
          font-size: 9.5px;
          color: #64748B;
          font-weight: 550;
          line-height: 1.2;
          margin-top: 1px;
        }

        .premium-topbar .profile-chevron {
          color: #64748B;
          transition: transform 200ms ease;
        }

        .premium-topbar .profile-chevron.rotate {
          transform: rotate(180deg);
        }

        /* Dropdown Dismiss Overlay */
        .premium-topbar .dropdown-dismiss-overlay {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: transparent;
        }

        /* Floating Profile Dropdown Panel */
        .premium-topbar .profile-dropdown-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 200px;
          background-color: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--admin-border);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
          padding: 6px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-sizing: border-box;
          transform-origin: top right;
        }

        .premium-topbar .dropdown-user-header {
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .premium-topbar .user-header-name {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }

        .premium-topbar .user-header-email {
          font-size: 11px;
          color: #64748B;
          margin-top: 1px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .premium-topbar .dropdown-divider {
          height: 1px;
          background: var(--admin-border);
          margin: 4px 0;
        }

        .premium-topbar .dropdown-item-btn {
          width: 100%;
          height: 38px;
          text-align: left;
          padding: 0 12px;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 550;
          color: #334155;
          cursor: pointer;
          transition: background-color 150ms ease, color 150ms ease;
          display: flex;
          align-items: center;
          gap: 8px;
          outline: none;
        }

        .premium-topbar .dropdown-item-btn:hover {
          background-color: var(--admin-surface);
          color: #0F172A;
        }

        .premium-topbar .dropdown-item-icon {
          color: #64748B;
        }

        .premium-topbar .dropdown-item-btn:hover .dropdown-item-icon {
          color: #0F172A;
        }

        .premium-topbar .dropdown-item-btn.logout {
          color: var(--admin-danger);
          font-weight: 600;
        }

        .premium-topbar .dropdown-item-btn.logout .dropdown-item-icon {
          color: var(--admin-danger);
        }

        .premium-topbar .dropdown-item-btn.logout:hover {
          background-color: rgba(239, 68, 68, 0.06);
          color: var(--admin-danger);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .premium-topbar {
            height: auto;
            padding: 12px var(--admin-space-4);
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .premium-topbar .topbar-right-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}} />
    </header>
  );
};

export default Topbar;
