/* src/admin/layout/Topbar.tsx */
import React from 'react';
import { Avatar } from '../components/avatars/Avatar';
import { useAuth } from '../../hooks/useAuth';

interface TopbarProps {
  onToggleSidebar: () => void;
  pageTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  pageTitle,
}) => {
  const { user, logout } = useAuth();
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'Administrator';
  const userAvatar = user?.user_metadata?.avatar_url || null;

  return (
    <header
      style={{
        height: '64px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--admin-space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 100, // ZIndex.dropdown
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box'
      }}
    >
      {/* Left section: Toggle & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
        <button
          onClick={onToggleSidebar}
          className="active-press"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--admin-space-2)',
            borderRadius: 'var(--admin-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--admin-text-secondary)',
            fontSize: '18px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--admin-surface)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
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
        <h1
          className="text-section-title"
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--admin-text)'
          }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right section: Profile & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2.5)' }}>
          <Avatar src={userAvatar} name={userDisplayName} size={36} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--admin-text)',
                lineHeight: 1.2
              }}
            >
              {userDisplayName}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--admin-text-secondary)',
                lineHeight: 1
              }}
            >
              Admin Role
            </span>
          </div>
        </div>

        <div
          style={{
            width: '1px',
            height: '24px',
            background: 'var(--admin-border)',
            margin: '0 var(--admin-space-1)'
          }}
        />

        <button
          onClick={logout}
          className="hover-scale active-press"
          style={{
            background: 'none',
            border: '1px solid var(--admin-border)',
            padding: 'var(--admin-space-1.5) var(--admin-space-3)',
            borderRadius: 'var(--admin-radius-sm)',
            color: 'var(--admin-text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--admin-surface)';
            e.currentTarget.style.color = 'var(--admin-danger)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'var(--admin-text-secondary)';
            e.currentTarget.style.borderColor = 'var(--admin-border)';
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Topbar;
