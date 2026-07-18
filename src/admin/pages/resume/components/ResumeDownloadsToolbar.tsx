/* src/admin/pages/resume/components/ResumeDownloadsToolbar.tsx */
import React from 'react';

interface ResumeDownloadsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  onRefresh?: () => void;
  onExportCSV?: () => void;
}

export const ResumeDownloadsToolbar: React.FC<ResumeDownloadsToolbarProps> = ({
  search,
  setSearch,
  dateRange,
  setDateRange,
  onRefresh,
  onExportCSV,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--admin-space-4)',
        padding: 'var(--admin-space-4)',
        background: '#FFFFFF',
        borderRadius: 'var(--admin-radius-md) var(--admin-radius-md) 0 0',
        border: '1px solid var(--admin-border)',
        borderBottom: 'none',
        boxSizing: 'border-box'
      }}
    >
      {/* Left side filters: Search + Date Range */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--admin-space-3)',
          flex: 1
        }}
      >
        {/* 1. Search downloads */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '240px',
            boxSizing: 'border-box'
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
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13.5px',
              color: 'var(--admin-text)',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
          />
        </div>

        {/* 2. Date Range Filter */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '130px'
          }}
        >
          <option value="all">Date Range</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Right side controls: Export CSV + Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onExportCSV}
          className="hover-scale active-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--admin-text)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
            e.currentTarget.style.color = 'var(--admin-primary)';
            e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = 'var(--admin-text)';
            e.currentTarget.style.borderColor = 'var(--admin-border)';
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>Export CSV</span>
        </button>

        <button
          onClick={onRefresh}
          className="hover-scale active-press"
          aria-label="Refresh list"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            color: 'var(--admin-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
            e.currentTarget.style.color = 'var(--admin-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = 'var(--admin-text-secondary)';
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResumeDownloadsToolbar;
