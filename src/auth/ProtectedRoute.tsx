import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { notifyAuthError } from './errors';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Route guard component that protects access to sub-pages.
 * Strictly enforces authentication and admin role privileges.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  fallbackPath = '/',
  loadingComponent,
}) => {
  const { user, isAdmin, isLoading, signIn, signOut } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const res = await signIn();
      if (res?.error) {
        setAuthError(res.error.message || 'Failed to sign in with Google');
        notifyAuthError(res.error, 'Sign In Failed');
      }
    } catch (err: any) {
      console.error('[ProtectedRoute] Sign in exception:', err);
      const msg = err?.message || 'An unexpected authentication error occurred.';
      setAuthError(msg);
      notifyAuthError(err, 'Sign In Error');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('[ProtectedRoute] Sign out exception:', err);
    } finally {
      setSigningOut(false);
    }
  };

  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = fallbackPath;
    }
  };

  // 1. Loading state
  if (isLoading) {
    return (
      loadingComponent || (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#f8fafc',
            background: '#0a0d14',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient background glow */}
          <div
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(10, 13, 20, 0) 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(124, 58, 237, 0.2)',
              borderTopColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'spin 0.9s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite',
              marginBottom: '20px',
            }}
          />
          <p
            style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            Verifying security privileges...
          </p>
          <style
            dangerouslySetInnerHTML={{
              __html: `@keyframes spin { to { transform: rotate(360deg); } }`,
            }}
          />
        </div>
      )
    );
  }

  // 2. Unauthenticated user -> Show Admin Login Gate
  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: '#07090e',
          backgroundImage:
            'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%)',
          padding: '24px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(124, 58, 237, 0.1)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            color: '#f8fafc',
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            Admin Authentication
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: 1.55,
              margin: '0 0 28px 0',
            }}
          >
            This area is restricted to authorized portfolio administrators. Please sign in to verify your identity.
          </p>

          {authError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '20px',
                textAlign: 'left',
              }}
            >
              ⚠️ {authError}
            </div>
          )}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: '12px',
              fontSize: '14.5px',
              fontWeight: 600,
              color: '#0f172a',
              background: '#ffffff',
              border: 'none',
              cursor: signingIn ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
              opacity: signingIn ? 0.8 : 1,
              marginBottom: '14px',
            }}
          >
            {signingIn ? (
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(15, 23, 42, 0.2)',
                  borderTopColor: '#0f172a',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{signingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
          </button>

          {/* Return Home Button */}
          <button
            onClick={handleReturnHome}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 18px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#94a3b8',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ← Return to Portfolio
          </button>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '11.5px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🔒 Secured by Supabase Role-Based Access Control</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated, but not an admin (403 Forbidden)
  if (adminOnly && !isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: '#07090e',
          backgroundImage:
            'radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%)',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
            color: '#f8fafc',
          }}
        >
          {/* Forbidden shield badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.3) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '22px',
              color: '#ef4444',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            403 Forbidden
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              margin: '0 0 10px 0',
              color: '#ffffff',
            }}
          >
            Access Denied
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: 1.55,
              margin: '0 0 16px 0',
            }}
          >
            Your account does not have administrator privileges to access this dashboard.
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#cbd5e1',
              wordBreak: 'break-all',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>Signed in as:</span>
            <strong style={{ color: '#ffffff' }}>{user.email}</strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: signingOut ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{signingOut ? 'Signing out...' : 'Switch Account / Sign Out'}</span>
            </button>

            <button
              onClick={handleReturnHome}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px 18px',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 500,
                color: '#94a3b8',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ← Return to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin -> Render Protected Content
  return <>{children}</>;
};

export default ProtectedRoute;
