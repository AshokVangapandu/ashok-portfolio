/* src/admin/components/portfolio-content/SearchBar.tsx */
import React, { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...'
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={{ position: 'relative', flex: 1, boxSizing: 'border-box' }}>
      <span
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--admin-text-secondary)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        style={{
          width: '100%',
          height: '40px',
          padding: '10px 12px 10px 38px',
          border: searchFocused ? '1px solid var(--admin-primary)' : '1px solid var(--admin-border)',
          borderRadius: '10px',
          fontSize: '13.5px',
          color: 'var(--admin-text)',
          backgroundColor: '#FFFFFF',
          boxSizing: 'border-box',
          outline: 'none',
          boxShadow: searchFocused ? '0 0 0 3px rgba(124, 92, 255, 0.15)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </div>
  );
};

export default SearchBar;
