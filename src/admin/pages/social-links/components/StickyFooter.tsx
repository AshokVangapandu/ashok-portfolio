/* src/admin/pages/social-links/components/StickyFooter.tsx */
import React from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface StickyFooterProps {
  isDirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  isDirty,
  onSave,
  onDiscard,
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        margin: '32px -32px -32px -32px',
        padding: '16px 32px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
        zIndex: 100,
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <SecondaryButton
        disabled={!isDirty}
        onClick={onDiscard}
        style={{
          color: isDirty ? 'var(--admin-text)' : 'var(--admin-text-secondary)',
          opacity: isDirty ? 1 : 0.6,
          cursor: isDirty ? 'pointer' : 'not-allowed'
        }}
      >
        Cancel
      </SecondaryButton>

      <PrimaryButton
        disabled={!isDirty}
        onClick={onSave}
        style={{
          backgroundColor: isDirty ? 'var(--admin-primary)' : 'rgba(124, 58, 237, 0.4)',
          cursor: isDirty ? 'pointer' : 'not-allowed'
        }}
      >
        Save Changes
      </PrimaryButton>
    </div>
  );
};

export default StickyFooter;
