/* src/admin/pages/resume/components/ResumeDetailsModal.tsx */
import React from 'react';
import { ResumeSetting } from '../../../types/resume';

interface ResumeDetailsModalProps {
  resume: ResumeSetting | null;
  onClose: () => void;
}

export const ResumeDetailsModal: React.FC<ResumeDetailsModalProps> = ({
  resume,
  onClose
}) => {
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
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
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
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 700, color: '#0F172A' }}>
            Resume Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 0,
              display: 'flex'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Details List */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Resume Name', value: resume.resumeName },
            { label: 'File Name', value: resume.fileName },
            { label: 'Version', value: resume.version },
            { label: 'File Size', value: formatFileSize(resume.fileSize) },
            { label: 'Uploaded At', value: formatDate(resume.uploadedAt) },
            { label: 'Last Updated', value: formatDate(resume.updatedAt) },
            {
              label: 'Status',
              value: (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: resume.isActive ? '#ECFDF5' : '#F1F5F9',
                    color: resume.isActive ? '#10B981' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {resume.isActive ? 'Active' : 'Inactive'}
                </span>
              )
            },
            { label: 'Storage Path', value: resume.storagePath, isCode: true },
            {
              label: 'Public URL',
              value: (
                <a
                  href={resume.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-all' }}
                >
                  View File ↗
                </a>
              )
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderBottom: idx < 8 ? '1px solid #F1F5F9' : 'none',
                paddingBottom: idx < 8 ? '12px' : 0
              }}
            >
              <span style={{ fontSize: '11.5px', fontWeight: 650, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
              {item.isCode ? (
                <code style={{ fontSize: '12.5px', color: '#0F172A', backgroundColor: '#F8FAFC', padding: '4px 8px', borderRadius: '4px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {item.value}
                </code>
              ) : (
                <span style={{ fontSize: '13.5px', color: '#0F172A', fontWeight: 500 }}>
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer Close Button */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box'
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
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
