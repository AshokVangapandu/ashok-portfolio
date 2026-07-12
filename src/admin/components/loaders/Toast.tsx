/* src/admin/components/loaders/Toast.tsx */
import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  className = '',
  style,
}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return { border: 'var(--admin-success)', icon: '✓', bg: '#F0FDF4' };
      case 'warning':
        return { border: 'var(--admin-warning)', icon: '⚠️', bg: '#FFFBEB' };
      case 'danger':
        return { border: 'var(--admin-danger)', icon: '✕', bg: '#FEF2F2' };
      default:
        return { border: 'var(--admin-info)', icon: 'ℹ', bg: '#EFF6FF' };
    }
  };

  const { border, icon, bg } = getColors();

  return (
    <div
      className={`animate-slide-down ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--admin-space-3) var(--admin-space-4)',
        background: bg,
        borderLeft: `4px solid ${border}`,
        borderRadius: 'var(--admin-radius-sm)',
        boxShadow: 'var(--admin-shadow-md)',
        minWidth: '280px',
        maxWidth: '450px',
        gap: 'var(--admin-space-4)',
        fontFamily: "'Inter', sans-serif",
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-3)' }}>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: border }}>
          {icon}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--admin-text)', fontWeight: 500 }}>
          {message}
        </span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--admin-text-secondary)',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: 0
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
