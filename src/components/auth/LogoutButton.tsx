import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notifyAuthError } from '../../auth/errors';

interface LogoutButtonProps {
  onSuccess?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable Exit trigger button connected to useAuth logout handler.
 * Disables itself and handles animation loops during exit requests.
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ onSuccess, className = '', style = {} }) => {
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await logout();
      if (error) {
        notifyAuthError(error, 'Sign Out Failed');
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('[LogoutButton] Runtime exit error:', err);
      notifyAuthError(err, 'Sign Out Error');
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`profile-action profile-action-secondary ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '36px',
        padding: '0 16px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '12.5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        border: '1px solid rgba(255, 71, 87, 0.2)',
        background: 'rgba(255, 71, 87, 0.05)',
        color: '#ff4757',
        transition: 'all 200ms ease',
        opacity: loading ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 71, 87, 0.2)',
            borderTopColor: '#ff4757',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )}
      <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </button>
  );
};
export default LogoutButton;
