/* src/admin/components/portfolio-content/SortControl.tsx */
import React from 'react';

interface SortControlProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}

export const SortControl: React.FC<SortControlProps> = ({
  value,
  onChange,
  options
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40px',
          padding: '0 36px 0 16px',
          border: '1px solid var(--admin-border)',
          borderRadius: '10px',
          fontSize: '13.5px',
          color: 'var(--admin-text)',
          backgroundColor: '#FFFFFF',
          fontWeight: 550,
          cursor: 'pointer',
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 92, 255, 0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: 'var(--admin-text-secondary)' }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>
  );
};

export default SortControl;
