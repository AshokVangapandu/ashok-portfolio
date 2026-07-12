/* src/admin/pages/resume/components/DownloadStatusBadge.tsx */
import React from 'react';

interface DownloadStatusBadgeProps {
  isKnown: boolean;
}

export const DownloadStatusBadge: React.FC<DownloadStatusBadgeProps> = ({ isKnown }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: isKnown ? 'rgba(124, 58, 237, 0.06)' : '#F1F5F9', // Purple vs Gray bg
        color: isKnown ? 'var(--admin-primary)' : '#64748B', // Purple vs Gray text
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isKnown ? 'var(--admin-primary)' : '#64748B',
          display: 'inline-block'
        }}
      />
      <span>{isKnown ? 'Known Visitor' : 'Anonymous'}</span>
    </span>
  );
};

export default DownloadStatusBadge;
