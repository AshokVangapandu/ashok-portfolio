/* src/admin/components/filters/FilterDropdown.tsx */
import React from 'react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  label,
  className = '',
  style,
}) => {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--admin-space-1)',
        fontFamily: "'Manrope', sans-serif",
        ...style
      }}
    >
      {label && (
        <span 
          style={{
            fontSize: '12px',
            color: 'var(--admin-text-secondary)',
            fontWeight: 500
          }}
        >
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: 'var(--admin-space-2) var(--admin-space-4) var(--admin-space-2) var(--admin-space-3)',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '13px',
          color: 'var(--admin-text)',
          background: '#FFFFFF',
          outline: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--admin-shadow-sm)',
          minWidth: '140px',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '12px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-primary)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
