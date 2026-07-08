import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

/**
 * User Profile dropdown component.
 * If unauthenticated, displays the 'Continue with Google' button.
 * If authenticated, displays the user's avatar, name, and email details,
 * and includes the logout trigger. Administrative routes remain hidden.
 */
export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderTopColor: '#8f85ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  // If NOT authenticated, Show Google Sign In button
  if (!isAuthenticated || !user) {
    return <LoginButton />;
  }

  const nameVal = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Collaborator';
  const emailVal = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Interactive Avatar trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '50px',
          padding: '4px 14px 4px 4px',
          color: '#ffffff',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(143, 133, 255, 0.3)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nameVal}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8f85ff 0%, #6c5ce7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            {nameVal.charAt(0).toUpperCase()}
          </div>
        )}
        <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {nameVal}
        </span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Glassmorphic Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '240px',
            background: 'rgba(13, 17, 28, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* User Details (Avatar, Name, Email) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', textAlign: 'center' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={nameVal}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(143, 133, 255, 0.3)' }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8f85ff 0%, #6c5ce7 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px',
                }}
              >
                {nameVal.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ marginTop: '4px' }}>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
                {nameVal}
              </h4>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.44)', wordBreak: 'break-all' }}>
                {emailVal}
              </p>
            </div>
          </div>

          {/* Admin Dashboard Navigation Option */}
          {isAdmin && (
            <>
              <a
                href="/admin"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(143, 133, 255, 0.08)',
                  border: '1px solid rgba(143, 133, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#8f85ff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '10px',
                  textDecoration: 'none',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(143, 133, 255, 0.16)';
                  e.currentTarget.style.borderColor = 'rgba(143, 133, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(143, 133, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(143, 133, 255, 0.15)';
                }}
              >
                <span>👑 Admin Dashboard</span>
              </a>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '4px 0' }} />
            </>
          )}

          {/* Action Row containing the Logout Button */}
          <div style={{ display: 'flex' }}>
            <LogoutButton 
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }} 
              onSuccess={() => setIsOpen(false)} 
            />
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
export default UserMenu;
