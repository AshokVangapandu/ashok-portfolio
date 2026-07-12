/* src/admin/pages/settings/components/OpenForWorkToggle.tsx */
import React from 'react';

interface OpenForWorkToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export const OpenForWorkToggle: React.FC<OpenForWorkToggleProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* LEFT CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '70%' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)' }}>
          Open for Work
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
          Control whether the "Open for Work" badge is displayed on your public portfolio.
        </p>
      </div>

      {/* RIGHT ACTION SWITCH & BADGE */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {/* Status Pill Badge - visible when switch is active */}
        {checked && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: '#ECFDF5', // Light green
              color: '#10B981', // Green
              fontSize: '11.5px',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            Open for Work
          </span>
        )}

        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
          {checked ? 'On' : 'Off'}
        </span>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onChange(!checked)}
          style={{
            width: '46px',
            height: '24px',
            borderRadius: '12px',
            backgroundColor: checked ? 'var(--admin-primary)' : '#CBD5E1',
            border: 'none',
            position: 'relative',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s ease',
            outline: 'none'
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              left: checked ? '26px' : '2px',
              transition: 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default OpenForWorkToggle;
