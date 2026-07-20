/* src/admin/pages/settings/components/StickyFooter.tsx */
import React from 'react';

interface StickyFooterProps {
  isDirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
  isDirty,
  saving = false,
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
      <button
        type="button"
        disabled={!isDirty || saving}
        onClick={onDiscard}
        className={isDirty && !saving ? 'hover-scale active-press' : ''}
        style={{
          padding: '10px 24px',
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          color: isDirty && !saving ? '#0F172A' : '#94A3B8',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
          opacity: isDirty && !saving ? 1 : 0.6,
          transition: 'all 0.15s ease'
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={!isDirty || saving}
        onClick={onSave}
        className={isDirty && !saving ? 'hover-scale active-press animate-glow' : ''}
        style={{
          padding: '10px 24px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: isDirty && !saving ? 'var(--admin-primary)' : 'rgba(124, 58, 237, 0.4)',
          color: '#FFFFFF',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease'
        }}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default StickyFooter;
