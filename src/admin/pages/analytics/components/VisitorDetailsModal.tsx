/* src/admin/pages/analytics/components/VisitorDetailsModal.tsx */
import React, { useEffect } from 'react';
import { VisitorSession } from '../../../types/analytics';

interface VisitorDetailsModalProps {
  visitor: VisitorSession | null;
  onClose: () => void;
}

const formatDuration = (sec: number) => {
  const durationMin = Math.floor(sec / 60);
  const durationRemSec = sec % 60;
  return durationMin > 0 ? `${durationMin}m ${durationRemSec}s` : `${durationRemSec}s`;
};

const formatTimeAgo = (dateInput: string | Date | null): string => {
  if (!dateInput) return 'Unknown';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const VisitorDetailsModal: React.FC<VisitorDetailsModalProps> = ({
  visitor,
  onClose,
}) => {
  // ESC key listener to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!visitor) return null;

  // Formatting date and time
  const rawDateTime = visitor.visitedAt.replace('\n', ' at ');

  const defaultAvatar = (
    <div
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        border: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)', // Dark blur overlay
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-4)',
        boxSizing: 'border-box',
        animation: 'modalFadeIn 200ms ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '750px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'modalScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--admin-text)' }}>
              Download Details
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              Full session and visitor information for this download.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
              e.currentTarget.style.color = 'var(--admin-text)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--admin-text-secondary)';
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div
          style={{
            padding: '32px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            boxSizing: 'border-box'
          }}
        >
          {/* VISITOR CARD */}
          <div
            style={{
              padding: '24px',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}
          >
            {visitor.isKnownVisitor && visitor.avatarUrl ? (
              <img
                src={visitor.avatarUrl}
                alt={visitor.visitorName || 'Visitor'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--admin-border)',
                  flexShrink: 0
                }}
              />
            ) : (
              defaultAvatar
            )}

            <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
                {visitor.visitorName || 'Anonymous Visitor'}
              </h3>
              {visitor.isKnownVisitor && visitor.visitorEmail && (
                <a
                  href={`mailto:${visitor.visitorEmail}`}
                  style={{
                    fontSize: '14px',
                    color: 'var(--admin-primary)',
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  {visitor.visitorEmail}
                </a>
              )}
              <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                {visitor.country || 'Unknown'} <span style={{ opacity: 0.5, margin: '0 4px' }}>•</span> {visitor.city || 'Unknown'}
              </span>
            </div>
          </div>

          {/* TWO-COLUMN DETAILS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', boxSizing: 'border-box' }}>
            {/* COLUMN 1: DOWNLOAD DETAILS */}
            <div
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Download Details
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Date & Time</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {rawDateTime}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Downloaded From</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {visitor.landingPage}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Traffic Source</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {visitor.source}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Session Duration</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {formatDuration(visitor.sessionDuration)}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Last Activity</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-primary)', marginTop: '2px' }}>
                    {formatTimeAgo(visitor.lastActivity)}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: DEVICE & BROWSER */}
            <div
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Device & Browser
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Device</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {visitor.device}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Browser</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {visitor.browser}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Operating System</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {visitor.os || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '20px 32px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            boxSizing: 'border-box'
          }}
        >
          <button
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            Close
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default VisitorDetailsModal;
