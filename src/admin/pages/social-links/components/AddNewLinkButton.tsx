/* src/admin/pages/social-links/components/AddNewLinkButton.tsx */
import React from 'react';
import { PrimaryButton } from './PrimaryButton';

interface AddNewLinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AddNewLinkButton: React.FC<AddNewLinkButtonProps> = ({ style, ...props }) => {
  return (
    <PrimaryButton
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Add New Link</span>
    </PrimaryButton>
  );
};

export default AddNewLinkButton;
