import React from 'react';
import { useAuth } from '../../hooks/useAuth';

import { Avatar } from '../Avatar';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Administrator';

  return (
    <header className="admin-navbar">
      <div className="navbar-title-section">
        {/* Toggle Hamburger visible on smaller viewports */}
        <button
          className="hamburger-btn navbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h2 className="navbar-title">Dashboard</h2>
      </div>

      <div className="navbar-right">
        {/* Search Field (UI Only) */}
        <div className="navbar-search-wrapper">
          <span className="navbar-search-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input type="text" placeholder="Search Console..." disabled />
        </div>

        {/* Notifications Icon Button */}
        <button className="navbar-action-btn" aria-label="Notifications" type="button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User Profile Avatar */}
        <Avatar
          imageUrl={avatarUrl}
          displayName={userName}
          className="navbar-user-avatar"
          size={32}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </header>
  );
};

export default TopNavbar;
