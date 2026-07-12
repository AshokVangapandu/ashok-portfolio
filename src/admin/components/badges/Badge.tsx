/* src/admin/components/badges/Badge.tsx */
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: 'var(--admin-success)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--admin-warning)' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)' };
      case 'info':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--admin-info)' };
      default:
        return { bg: 'var(--admin-surface)', color: 'var(--admin-text-secondary)' };
    }
  };

  const { bg, color } = getColors();

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        textTransform: 'capitalize',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.25,
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
