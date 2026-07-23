/* src/admin/components/portfolio-content/PrimaryActionButton.tsx */
import React from 'react';
import { Button } from '../buttons/Button';

interface PrimaryActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const PrimaryActionButton: React.FC<PrimaryActionButtonProps> = ({
  label,
  onClick,
  icon,
  disabled
}) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: '#7C5CFF', // Soft Indigo (Primary Accent)
        borderRadius: 'var(--admin-radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {icon || (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
      <span>{label}</span>
    </Button>
  );
};

export default PrimaryActionButton;
