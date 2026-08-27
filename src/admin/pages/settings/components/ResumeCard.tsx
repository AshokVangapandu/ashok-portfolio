/* src/admin/pages/settings/components/ResumeCard.tsx */
import React from 'react';

interface ResumeCardProps {
  fileName: string;
  lastUpdated: string;
  status: string;
  onReplace?: () => void;
  onPreview?: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  fileName,
  lastUpdated,
  status,
  onReplace,
  onPreview,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      {/* 1. Header context */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)' }}>
          Resume Management
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
          Manage the resume file that visitors download from your portfolio.
        </p>
      </div>

      {/* 2. File Card Frame */}
      <div
        style={{
          padding: '16px 20px',
          border: '1px solid var(--admin-border)',
          borderRadius: '10px',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* File Icon box */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#EEF2FF',
              color: 'var(--admin-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)' }}>
              {fileName}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              Last updated · {lastUpdated}
            </span>
          </div>
        </div>

        {/* Status Active Badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: '#ECFDF5',
            color: '#10B981',
            fontSize: '11.5px',
            fontWeight: 700
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{status}</span>
        </span>
      </div>

      {/* 3. Action Buttons Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={onReplace}
          className="hover-scale active-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'var(--admin-primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Replace Resume</span>
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="hover-scale active-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Preview Resume</span>
        </button>
      </div>

      <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
        Uploading a new resume automatically replaces the existing file available for download on the public portfolio.
      </p>
    </div>
  );
};

export default ResumeCard;
