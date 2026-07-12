/* src/admin/pages/social-links/components/SecondaryButton.tsx */
import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, style, ...props }) => {
  return (
    <button
      className="hover-scale active-press"
      style={{
        padding: '10px 24px',
        border: '1px solid var(--admin-border)',
        borderRadius: '12px', // 12px radius as requested
        backgroundColor: '#FFFFFF',
        color: 'var(--admin-text)',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: "'Inter', sans-serif",
        boxShadow: 'var(--admin-shadow-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: props.disabled ? 0.6 : 1,
        ...style
      }}
      onMouseOver={(e) => {
        if (!props.disabled) e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
      }}
      onMouseOut={(e) => {
        if (!props.disabled) e.currentTarget.style.backgroundColor = '#FFFFFF';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
