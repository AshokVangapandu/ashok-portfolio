/* src/admin/pages/contacts/components/ActionButtons.tsx */
import React from 'react';

interface ActionButtonsProps {
  onView?: () => void;
  onArchive?: () => void;
  onMore?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onArchive,
  onMore,
}) => {
  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid var(--admin-border)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: 'var(--admin-radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--admin-text-secondary)',
    transition: 'all 0.15s ease',
    outline: 'none',
  };

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {/* View Button */}
      <button
        onClick={onView}
        className="hover-scale active-press"
        style={buttonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--admin-primary)';
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          e.currentTarget.style.background = 'var(--admin-surface)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--admin-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.background = 'none';
        }}
        title="View details"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Archive Button */}
      <button
        onClick={onArchive}
        className="hover-scale active-press"
        style={buttonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--admin-primary)';
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          e.currentTarget.style.background = 'var(--admin-surface)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--admin-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.background = 'none';
        }}
        title="Archive"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      </button>

      {/* More Options Button */}
      <button
        onClick={onMore}
        className="hover-scale active-press"
        style={buttonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--admin-primary)';
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
          e.currentTarget.style.background = 'var(--admin-surface)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--admin-text-secondary)';
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.background = 'none';
        }}
        title="More options"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>
  );
};

export default ActionButtons;
