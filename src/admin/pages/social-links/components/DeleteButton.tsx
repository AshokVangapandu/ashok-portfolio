/* src/admin/pages/social-links/components/DeleteButton.tsx */
import React from 'react';

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ style, ...props }) => {
  return (
    <button
      type="button"
      className="hover-scale active-press"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        border: '1px solid var(--admin-border)',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        color: 'var(--admin-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: 'var(--admin-shadow-sm)',
        ...style
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#FEF2F2';
        e.currentTarget.style.borderColor = '#FCA5A5';
        e.currentTarget.style.color = 'var(--admin-danger)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#FFFFFF';
        e.currentTarget.style.borderColor = 'var(--admin-border)';
        e.currentTarget.style.color = 'var(--admin-text-secondary)';
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </button>
  );
};

export default DeleteButton;
