/* src/components/routing/VisibilityPlaceholders.tsx */
import React from 'react';

export const GlobalLoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0A0D14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED, #3B82F6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        >
          AV
        </div>
        <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500, letterSpacing: '0.02em' }}>
          Loading application...
        </span>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.7; }
        }
      ` }} />
    </div>
  );
};

export const GlobalErrorScreen: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0A0D14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        zIndex: 99999,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#121824',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#F8FAFC' }}>
          Unable to Load Site
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: 1.5 }}>
          We encountered an issue checking site availability. Please check your network connection and try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

import { MaintenancePage } from '../../pages/maintenance/MaintenancePage';
import { PrivateAccessPage } from '../../pages/private/PrivateAccessPage';

export const MaintenanceModePlaceholder: React.FC = () => {
  return <MaintenancePage />;
};

export const PrivateModePlaceholder: React.FC = () => {
  return <PrivateAccessPage />;
};
