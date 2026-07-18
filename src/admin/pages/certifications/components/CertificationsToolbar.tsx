/* src/admin/pages/certifications/components/CertificationsToolbar.tsx */
import React, { useState } from 'react';

interface CertificationsToolbarProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  filterVal: string;
  setFilterVal: (val: string) => void;
  sortVal: string;
  setSortVal: (val: string) => void;
}

export const CertificationsToolbar: React.FC<CertificationsToolbarProps> = ({
  searchVal,
  setSearchVal,
  filterVal,
  setFilterVal,
  sortVal,
  setSortVal
}) => {
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
          placeholder="Search certifications by title, organization, or skills..."
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
        {/* Filter Dropdown */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={filterVal}
            onChange={(e) => setFilterVal(e.target.value)}
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
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="featured">Featured</option>
          </select>
          <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: 'var(--admin-text-secondary)' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={sortVal}
            onChange={(e) => setSortVal(e.target.value)}
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
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
          </select>
          <span style={{ position: 'absolute', right: '12px', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: 'var(--admin-text-secondary)' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CertificationsToolbar;
