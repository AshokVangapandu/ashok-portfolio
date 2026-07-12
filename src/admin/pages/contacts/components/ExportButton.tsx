/* src/admin/pages/contacts/components/ExportButton.tsx */
import React from 'react';
import { Button } from '../../../components/buttons/Button';

interface ExportButtonProps {
  onExport?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  className = '',
  style,
}) => {
  return (
    <Button
      variant="secondary"
      size="md"
      onClick={onExport}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--admin-space-2)',
        borderColor: 'var(--admin-border)',
        color: 'var(--admin-text-secondary)',
        background: '#FFFFFF',
        ...style
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.color = 'var(--admin-primary)';
        e.currentTarget.style.borderColor = 'var(--admin-primary)';
        e.currentTarget.style.background = 'var(--admin-surface)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.color = 'var(--admin-text-secondary)';
        e.currentTarget.style.borderColor = 'var(--admin-border)';
        e.currentTarget.style.background = '#FFFFFF';
      }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Export</span>
    </Button>
  );
};

export default ExportButton;
