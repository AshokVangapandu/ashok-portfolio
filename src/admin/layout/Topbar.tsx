/* src/admin/layout/Topbar.tsx */
import React, { useState } from 'react';
import { Avatar } from '../components/avatars/Avatar';
import { useAuth } from '../../hooks/useAuth';

interface TopbarProps {
  onToggleSidebar?: () => void;
  pageTitle: string; // Preserved in signature to prevent compile errors, but not rendered.
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  pageTitle,
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const userDisplayName = user?.user_metadata?.full_name || user?.email || 'Administrator';
  const userAvatar = user?.user_metadata?.avatar_url || null;

  return (
    <header
      style={{
        height: '64px',
        background: '#FAFBFF',
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
      {/* Left section: App Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
        {/* App Representative Title (No page titles) */}
        <h1
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--admin-text)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Good Evening, Ashok 👋
        </h1>
      </div>

      {/* Right section: Profile & Dropdown menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="active-press"
          style={{
            background: 'none',
            border: '1px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            boxSizing: 'border-box'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-surface)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Avatar src={userAvatar} name={userDisplayName} size={32} />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 650,
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
                fontWeight: 500,
                lineHeight: 1,
                marginTop: '1px'
              }}
            >
              Administrator
            </span>
          </div>
          
          <svg
            viewBox="0 0 24 24"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--admin-text-secondary)',
              transition: 'transform 200ms ease',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {dropdownOpen && (
          <>
            {/* Click-outside dismiss overlay */}
            <div
              onClick={() => setDropdownOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                backgroundColor: 'transparent'
              }}
            />
            
            {/* Floating Dropdown Panel */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                width: '180px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                boxShadow: 'var(--admin-shadow-md)',
                padding: '4px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                boxSizing: 'border-box',
                animation: 'topbarDropdownIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <button
                onClick={() => setDropdownOpen(false)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--admin-text)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-surface)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Profile
              </button>
              
              <button
                onClick={() => setDropdownOpen(false)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--admin-text)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-surface)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Settings
              </button>
              
              <div style={{ height: '1px', background: 'var(--admin-border)', margin: '4px 0' }} />
              
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--admin-danger)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes topbarDropdownIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </header>
  );
};

export default Topbar;
