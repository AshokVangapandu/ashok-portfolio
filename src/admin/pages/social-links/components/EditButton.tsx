/* src/admin/pages/social-links/components/EditButton.tsx */
import React from 'react';

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const EditButton: React.FC<EditButtonProps> = ({ style, ...props }) => {
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
        e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
        e.currentTarget.style.color = 'var(--admin-primary)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#FFFFFF';
        e.currentTarget.style.color = 'var(--admin-text-secondary)';
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
};

export default EditButton;
