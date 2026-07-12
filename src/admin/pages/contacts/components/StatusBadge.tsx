/* src/admin/pages/contacts/components/StatusBadge.tsx */
import React from 'react';
import { Badge } from '../../../components/badges/Badge';

interface StatusBadgeProps {
  status: 'open' | 'reply_pending' | 'replied';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'open':
        return { 
          label: 'Open', 
          variant: 'warning' as const,
          customStyle: {
            color: '#D97706', // Orange
            background: '#FEF3C7'
          }
        };
      case 'reply_pending':
        return { 
          label: 'Reply Pending', 
          variant: 'info' as const,
          customStyle: {
            color: '#2563EB', // Blue
            background: '#EFF6FF'
          }
        };
      case 'replied':
        return { 
          label: 'Replied', 
          variant: 'success' as const,
          customStyle: {
            color: '#16A34A', // Green
            background: '#DCFCE7'
          }
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Badge 
      variant={config.variant}
      style={{
        ...config.customStyle,
        padding: '4px 10px',
        fontWeight: 600,
        fontSize: '11px',
        border: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
