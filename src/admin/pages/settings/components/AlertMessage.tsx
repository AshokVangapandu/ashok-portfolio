/* src/admin/pages/settings/components/AlertMessage.tsx */
import React from 'react';

interface AlertMessageProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'success',
  title,
  message,
  onClose,
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: '#ECFDF5',
          borderColor: '#10B981',
          textColor: '#065F46',
          titleColor: '#065F46',
          icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgColor: '#FFFBEB',
          borderColor: '#F59E0B',
          textColor: '#92400E',
          titleColor: '#92400E',
          icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )
        };
      case 'error':
        return {
          bgColor: '#FEF2F2',
          borderColor: '#EF4444',
          textColor: '#991B1B',
          titleColor: '#991B1B',
          icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )
        };
      case 'info':
      default:
        return {
          bgColor: '#EFF6FF',
          borderColor: '#3B82F6',
          textColor: '#1E40AF',
          titleColor: '#1E40AF',
          icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: styles.bgColor,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: '8px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ marginTop: '2px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {styles.icon}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
        <span style={{ fontSize: '13.5px', fontWeight: 700, color: styles.titleColor }}>
          {title}
        </span>
        <p style={{ margin: 0, fontSize: '12.5px', color: styles.textColor, fontWeight: 500, lineHeight: 1.4 }}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: styles.textColor,
            cursor: 'pointer',
            padding: '2px',
            marginLeft: '8px',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'center'
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
