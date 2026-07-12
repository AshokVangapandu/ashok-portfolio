/* src/admin/pages/testimonials/components/StatusBadge.tsx */
import React from 'react';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'remind_later';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let label = 'Pending';
  let bgColor = '#F3E8FF'; // Purple bg
  let textColor = '#7C3AED'; // Purple text
  let dotColor = '#7C3AED';

  switch (status) {
    case 'approved':
      label = 'Approved';
      bgColor = '#DCFCE7'; // Green bg
      textColor = '#16A34A'; // Green text
      dotColor = '#16A34A';
      break;
    case 'rejected':
      label = 'Rejected';
      bgColor = '#FEE2E2'; // Red bg
      textColor = '#EF4444'; // Red text
      dotColor = '#EF4444';
      break;
    case 'remind_later':
      label = 'Remind Later';
      bgColor = '#FEF3C7'; // Yellow bg
      textColor = '#D97706'; // Orange-600 text
      dotColor = '#D97706';
      break;
    case 'pending':
    default:
      label = 'Pending';
      bgColor = '#F3E8FF';
      textColor = '#7C3AED';
      dotColor = '#7C3AED';
      break;
  }

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
        backgroundColor: bgColor,
        color: textColor,
        whiteSpace: 'nowrap'
      }}
    >
      {/* Small bullet indicator dot */}
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
