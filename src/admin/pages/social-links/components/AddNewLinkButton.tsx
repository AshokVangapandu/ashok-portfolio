/* src/admin/pages/social-links/components/AddNewLinkButton.tsx */
import React from 'react';

interface AddNewLinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AddNewLinkButton: React.FC<AddNewLinkButtonProps> = ({ style, ...props }) => {
  return (
    <button
      className="hover-scale active-press animate-glow"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'var(--admin-primary)',
        color: '#FFFFFF',
        fontSize: '13.5px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(124, 92, 255, 0.2)',
        transition: 'all 0.15s ease',
        outline: 'none',
        ...style
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Add New Link</span>
    </button>
  );
};

export default AddNewLinkButton;
