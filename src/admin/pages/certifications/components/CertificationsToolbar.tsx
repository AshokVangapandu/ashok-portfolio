/* src/admin/pages/certifications/components/CertificationsToolbar.tsx */
import React, { useState } from 'react';

export const CertificationsToolbar: React.FC = () => {
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px',
        background: '#FFFFFF',
        borderRadius: 'var(--admin-radius-md) var(--admin-radius-md) 0 0',
        border: '1px solid var(--admin-border)',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Search Input (Takes up all available space on the left) */}
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
          placeholder="Search certifications by title or organization..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
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

      {/* Action Buttons (Positioned on the right) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Filter Button */}
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 16px',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
            fontSize: '13.5px',
            color: 'var(--admin-text)',
            backgroundColor: '#FFFFFF',
            fontWeight: 500,
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-surface)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 92, 255, 0.15)';
            e.currentTarget.style.outline = 'none';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filter</span>
        </button>

        {/* Sort Button */}
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 16px',
            border: '1px solid var(--admin-border)',
            borderRadius: '10px',
            fontSize: '13.5px',
            color: 'var(--admin-text)',
            backgroundColor: '#FFFFFF',
            fontWeight: 500,
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-surface)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 92, 255, 0.15)';
            e.currentTarget.style.outline = 'none';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--admin-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 15 12 24 3 15" />
            <polyline points="21 9 12 0 3 9" />
          </svg>
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
};

export default CertificationsToolbar;
