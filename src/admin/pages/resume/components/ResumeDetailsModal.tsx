/* src/admin/pages/resume/components/ResumeDetailsModal.tsx */
import React, { useState, useEffect } from 'react';
import { ResumeSetting } from '../../../types/resume';

interface ResumeDetailsModalProps {
  resume: ResumeSetting | null;
  onClose: () => void;
}

export const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  resume,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!resume) return null;

  // Helper to format file size cleanly
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to format date cleanly
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleCopyStoragePath = async () => {
    try {
      await navigator.clipboard.writeText(resume.storagePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      {/* Styles block injecting custom premium variables, animations, and hover states */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalBackdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -46%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-backdrop {
          animation: modalBackdropFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-modal {
          animation: modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 24px;
        }

        .open-resume-link {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .open-resume-link:hover {
          opacity: 0.8;
          text-decoration: underline !important;
        }

        @media (max-width: 600px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .modal-card {
            width: 92% !important;
            max-width: 480px !important;
          }
        }
      `}} />

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="animate-backdrop"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000
        }}
      />

      {/* Modal Card */}
      <div
        className="animate-modal modal-card"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📄</span> Resume Details
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              View metadata and storage information for this uploaded resume.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 0,
              display: 'flex',
              marginTop: '2px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#64748B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Details Two-Column Grid */}
        <div 
          className="details-grid"
          style={{ 
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Column Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Resume Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Resume Name
              </span>
              <span style={{ fontSize: '13.5px', color: '#0F172A', fontWeight: 600 }}>
                {resume.resumeName}
              </span>
            </div>

            {/* File Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                File Name
              </span>
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500, wordBreak: 'break-all' }}>
                {resume.fileName}
              </span>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: resume.isActive ? '#ECFDF5' : '#F1F5F9',
                  color: resume.isActive ? '#10B981' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '2px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: resume.isActive ? '#10B981' : '#94A3B8'
                  }}
                />
                {resume.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Last Updated */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Last Updated
              </span>
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500 }}>
                {formatDate(resume.updatedAt)}
              </span>
            </div>
          </div>

          {/* Right Column Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Version */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Version
              </span>
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500 }}>
                {resume.version}
              </span>
            </div>

            {/* File Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                File Size
              </span>
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500 }}>
                {formatFileSize(resume.fileSize)}
              </span>
            </div>

            {/* Upload Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Upload Date
              </span>
              <span style={{ fontSize: '13.5px', color: '#475569', fontWeight: 500 }}>
                {formatDate(resume.uploadedAt)}
              </span>
            </div>

            {/* Public URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                Public URL
              </span>
              <a
                href={resume.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="open-resume-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--admin-primary)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open Resume
              </a>
            </div>
          </div>
        </div>

        {/* Storage Path (Full Width Section) */}
        <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '6px', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '11px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Storage Path
          </span>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: '#F8FAFC', 
              border: '1px solid rgba(226, 232, 240, 0.8)', 
              borderRadius: '8px', 
              padding: '8px 12px',
              boxSizing: 'border-box',
              gap: '12px'
            }}
          >
            <code 
              title={resume.storagePath}
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '12px', 
                color: '#334155',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}
            >
              {resume.storagePath}
            </code>
            
            <button
              type="button"
              onClick={handleCopyStoragePath}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: copied ? '#10B981' : '#64748B',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s ease',
                outline: 'none'
              }}
              title="Copy storage path"
            >
              {copied ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Footer Close Button */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
            backgroundColor: '#F8FAFC',
            borderRadius: '0 0 12px 12px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = 'var(--admin-border)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
