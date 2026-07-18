/* src/admin/pages/resume/components/DownloadDetailsModal.tsx */
import React, { useEffect } from 'react';
import { ResumeDownload } from '../../../types/resumeDownload';
import { DownloadStatusBadge } from './DownloadStatusBadge';

interface DownloadDetailsModalProps {
  download: ResumeDownload | null;
  onClose: () => void;
}

export const DownloadDetailsModal: React.FC<DownloadDetailsModalProps> = ({
  download,
  onClose
}) => {
  // Escape key close handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!download) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'drawerFadeIn 200ms ease-out'
        }}
      />

      {/* Drawer slide-in panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '460px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.08)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif",
          animation: 'drawerSlideIn 250ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Download Details
            </h2>
            <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 500 }}>
              Full session and visitor information for this download event.
            </span>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#94A3B8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Section: Visitor Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Visitor Details
            </span>

            {[
              { label: 'Visitor Name', value: download.visitorName },
              { label: 'IP Address', value: download.ipAddress || 'Not Available' },
              { label: 'Country', value: download.country },
              { label: 'City', value: download.city }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Section: Download Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Download Info
            </span>

            {[
              { label: 'Resume Version', value: download.resumeVersion || 'Unknown' },
              { label: 'Downloaded At', value: download.dateTime },
              { label: 'Downloaded From', value: download.downloadedFrom },
              { label: 'Traffic Source', value: download.source }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Status</span>
              <DownloadStatusBadge status={download.status || 'completed'} />
            </div>
          </div>

          {/* Section: Device & Environment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Device & Browser
            </span>

            {[
              { label: 'Device', value: download.device },
              { label: 'Browser', value: download.browser },
              { label: 'Operating System', value: download.os }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Section: Session Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Session Metadata
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Session ID</span>
              <code style={{ fontSize: '12px', color: '#0F172A', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {download.sessionId || 'Not Available'}
              </code>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Referrer URL</span>
              <span style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 500, wordBreak: 'break-all' }}>
                {download.referrer || 'Direct Entry'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Landing Page</span>
              <span style={{ fontSize: '12.5px', color: '#0F172A', fontWeight: 500, wordBreak: 'break-all' }}>
                {download.pageSource || 'Homepage'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>User Agent</span>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5, backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', wordBreak: 'break-all' }}>
                {download.userAgent || 'Not Available'}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
            backgroundColor: '#F8FAFC'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(226, 232, 240, 1)',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            Close Details
          </button>
        </div>

        {/* Transition Keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes drawerFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes drawerSlideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />
      </aside>
    </>
  );
};

export default DownloadDetailsModal;
