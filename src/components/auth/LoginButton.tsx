import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notifyAuthError } from '../../auth/errors';

interface LoginButtonProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Premium Login button mapped to useAuth login actions.
 * Displays "Sign in" with a Google icon and disables click interaction during loader sequence.
 */
export const LoginButton: React.FC<LoginButtonProps> = ({ onSuccess, className = '' }) => {
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const { error } = await login();
      if (error) {
        notifyAuthError(error, 'Sign In Failed');
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('[LoginButton] Runtime connection error:', err);
      notifyAuthError(err, 'Sign In Error');
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`profile-action profile-action-primary ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minHeight: '38px',
        padding: '0 18px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '12.5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        border: '1px solid rgba(143, 133, 255, 0.25)',
        background: 'rgba(143, 133, 255, 0.1)',
        color: '#ffffff',
        backdropFilter: 'blur(8px)',
        transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.7l2.4-2.4C17.3 1.5 14.9 0 12.24 0c-6.08 0-11 4.92-11 11s4.92 11 11 11c5.73 0 10.2-4.1 10.2-11 0-.74-.08-1.46-.2-2.115H12.24z" />
        </svg>
      )}
      <span>{loading ? 'Connecting...' : 'Sign in'}</span>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </button>
  );
};
export default LoginButton;
