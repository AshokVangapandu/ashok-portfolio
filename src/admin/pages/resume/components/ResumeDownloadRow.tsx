/* src/admin/pages/resume/components/ResumeDownloadRow.tsx */
import React from 'react';
import { ResumeDownload } from '../../../types/resumeDownload';
import { DownloadStatusBadge } from './DownloadStatusBadge';
import { Avatar } from '../../../components/avatars/Avatar';

interface ResumeDownloadRowProps {
  download: ResumeDownload;
  onView?: () => void;
}

export const ResumeDownloadRow: React.FC<ResumeDownloadRowProps> = ({
  download,
  onView,
}) => {
  // Visitor avatar rendering helpers
  const defaultAvatar = (
    <div
      style={{
        width: '36px',
        height: '36px',
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
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  const formattedDateTime = download.dateTime.split('\n');

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--admin-border)',
        transition: 'background-color 0.15s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* 1. Date & Time Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text)' }}>
            {formattedDateTime[0]}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            {formattedDateTime[1]}
          </span>
        </div>
      </td>

      {/* 2. Visitor Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {download.isKnown ? (
            <Avatar
              src={download.avatarUrl}
              name={download.visitorName}
              email={download.visitorEmail}
              size={36}
            />
          ) : (
            defaultAvatar
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: download.isKnown ? 700 : 600,
                fontSize: '13.5px',
                color: download.isKnown ? 'var(--admin-text)' : '#334155',
                whiteSpace: 'nowrap'
              }}
            >
              {download.visitorName}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--admin-text-secondary)',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              {download.isKnown
                ? (download.visitorEmail || 'Registered user')
                : `ID: ${download.visitorId ? download.visitorId.substring(0, 6).toUpperCase() : 'UNKNOWN'}`}
            </span>
          </div>
        </div>
      </td>

      {/* 3. Country Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text)' }}>
            {download.country}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            {download.city}
          </span>
        </div>
      </td>

      {/* 4. Device Column */}
      <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
        {download.device}
      </td>

      {/* 5. Source Column */}
      <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
        {download.source}
      </td>

      {/* 6. Duration Column */}
      <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
        {download.duration}
      </td>

      {/* 7. Status Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <DownloadStatusBadge status={download.status} />
      </td>

      {/* 9. Action Column (Pill View Button) */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <button
          onClick={onView}
          className="hover-scale active-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default ResumeDownloadRow;
