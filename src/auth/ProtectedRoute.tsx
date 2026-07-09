import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Route guard component that protects access to sub-pages.
 * Supports authentication check, admin checks, loading spinners, and redirects.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
  fallbackPath = '/',
  loadingComponent,
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // If not loading, and authorization checks fail, trigger redirect
    if (!isLoading) {
      const isAuthorized = (user && (!adminOnly || isAdmin)) || isDev;
      if (!isAuthorized) {
        console.warn(`[ProtectedRoute] Unauthorized access attempt. Redirecting to ${fallbackPath}`);
        
        // Framework-agnostic redirect fallback.
        // If integrating with React Router, replace this with:
        // navigate(fallbackPath, { replace: true });
        if (typeof window !== 'undefined') {
          window.location.href = fallbackPath;
        }
      }
    }
  }, [user, isAdmin, isLoading, adminOnly, fallbackPath, isDev]);

  // Display skeleton / spinner during initialization check
  if (isLoading && !isDev) {
    return (
      loadingComponent || (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#0f172a',
            background: '#ffffff'
          }}
        >
          {/* Dynamic glassmorphic spinner style */}
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(124, 58, 237, 0.1)',
              borderTopColor: '#7c3aed',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}
          />
          <p style={{ color: 'rgba(15, 23, 42, 0.6)', fontSize: '14px', letterSpacing: '0.02em', margin: 0 }}>
            Verifying security privileges...
          </p>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}} />
        </div>
      )
    );
  }

  const isAuthorized = (user && (!adminOnly || isAdmin)) || isDev;
  
  // Render kids if authorized, otherwise render nothing while redirecting
  return isAuthorized ? (
    <>
      {isDev && !user && (
        <div 
          style={{
            background: '#f5f3ff',
            borderBottom: '1px solid #eef2ff',
            color: '#7c3aed',
            padding: '10px 16px',
            fontSize: '12.5px',
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span>⚠️</span>
          <span><strong>Development Mode Bypass:</strong> Access granted to Dashboard layout for local testing.</span>
        </div>
      )}
      {children}
    </>
  ) : null;
};
export default ProtectedRoute;
