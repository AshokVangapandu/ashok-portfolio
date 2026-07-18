/* src/admin/pages/resume/components/DownloadStatusBadge.tsx */
import React from 'react';

interface DownloadStatusBadgeProps {
  status?: string;
  isKnown?: boolean;
}

export const DownloadStatusBadge: React.FC<DownloadStatusBadgeProps> = ({ status, isKnown }) => {
  const isFailed = status ? status.toLowerCase() === 'failed' : false;
  const isGreen = status ? !isFailed : isKnown;
  const label = status ? (isFailed ? 'Failed' : 'Completed') : (isKnown ? 'Known Visitor' : 'Anonymous');
  
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
        backgroundColor: isGreen ? '#ECFDF5' : (isFailed ? '#FEF2F2' : '#F1F5F9'),
        color: isGreen ? '#10B981' : (isFailed ? '#EF4444' : '#64748B'),
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: isGreen ? '#10B981' : (isFailed ? '#EF4444' : '#64748B'),
          display: 'inline-block'
        }}
      />
      <span>{label}</span>
    </span>
  );
};

export default DownloadStatusBadge;
