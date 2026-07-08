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

  useEffect(() => {
    // If not loading, and authorization checks fail, trigger redirect
    if (!isLoading) {
      const isAuthorized = user && (!adminOnly || isAdmin);
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
  }, [user, isAdmin, isLoading, adminOnly, fallbackPath]);

  // Display skeleton / spinner during initialization check
  if (isLoading) {
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
            color: '#ffffff',
            background: '#090d18'
          }}
        >
          {/* Dynamic glassmorphic spinner style */}
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(143, 133, 255, 0.1)',
              borderTopColor: '#8f85ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}
          />
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', letterSpacing: '0.02em', margin: 0 }}>
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

  const isAuthorized = user && (!adminOnly || isAdmin);
  
  // Render kids if authorized, otherwise render nothing while redirecting
  return isAuthorized ? <>{children}</> : null;
};
export default ProtectedRoute;
