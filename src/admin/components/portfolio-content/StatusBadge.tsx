/* src/admin/components/portfolio-content/StatusBadge.tsx */
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'published':
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.15)'
        };
      case 'draft':
        return {
          bg: 'rgba(245, 158, 11, 0.08)',
          color: '#F59E0B',
          border: '1px solid rgba(245, 158, 11, 0.15)'
        };
      case 'expired':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.15)'
        };
      case 'archived':
      default:
        return {
          bg: 'rgba(100, 116, 139, 0.08)',
          color: '#64748B',
          border: '1px solid rgba(100, 116, 139, 0.15)'
        };
    }
  };

  const { bg, color, border } = getStyle();

  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 700,
        height: '24px',
        padding: '0 12px',
        borderRadius: '999px',
        backgroundColor: bg,
        color: color,
        border: border,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
