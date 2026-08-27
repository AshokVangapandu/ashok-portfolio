/* src/admin/components/search/SearchBar.tsx */
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  style,
}) => {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '320px',
        fontFamily: "'Manrope', sans-serif",
        ...style
      }}
    >
      <span 
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--admin-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 'var(--admin-space-2) var(--admin-space-3) var(--admin-space-2) 36px',
          border: '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '13px',
          outline: 'none',
          color: 'var(--admin-text)',
          background: '#FFFFFF',
          boxShadow: 'var(--admin-shadow-sm)',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(124, 58, 237, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--admin-border)';
          e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
        }}
      />
    </div>
  );
};

export default SearchBar;
