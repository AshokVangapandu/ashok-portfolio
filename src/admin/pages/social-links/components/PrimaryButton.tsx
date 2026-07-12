/* src/admin/pages/social-links/components/PrimaryButton.tsx */
import React from 'react';
import { Button } from '../../../components/buttons/Button';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, style, ...props }) => {
  return (
    <Button
      variant="primary"
      size="md"
      style={{
        borderRadius: '12px', // Follow attached design specs
        padding: '10px 24px',
        fontSize: '13.5px',
        fontWeight: 600,
        ...style
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
