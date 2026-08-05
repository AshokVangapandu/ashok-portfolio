/* src/admin/pages/analytics/components/AnalyticsFilters.tsx */
import React from 'react';

interface AnalyticsFiltersProps {
  timeRange: 'today' | '7days' | '30days' | '90days';
  setTimeRange: (val: 'today' | '7days' | '30days' | '90days') => void;
  viewMode: 'list' | 'grid';
  setViewMode: (val: 'list' | 'grid') => void;
  onRefresh?: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeRange,
  setTimeRange,
  viewMode,
  setViewMode,
  onRefresh,
}) => {
  const ranges: { id: 'today' | '7days' | '30days' | '90days'; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
    { id: '90days', label: 'Last 90 Days' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '16px',
        flexWrap: 'wrap',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Time Range Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {ranges.map((r) => {
          const isActive = timeRange === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className="hover-scale active-press"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: isActive ? 'none' : '1px solid var(--admin-border)',
                backgroundColor: isActive ? 'var(--admin-primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--admin-text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {r.label}
            </button>
          );
        })}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="hover-scale active-press"
          aria-label="Refresh stats"
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

      {/* Separator line */}
      <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--admin-border)' }} />

      {/* 2. View Toggle */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          padding: '2px',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={() => setViewMode('grid')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: viewMode === 'grid' ? 'var(--admin-primary)' : 'transparent',
            color: viewMode === 'grid' ? '#FFFFFF' : 'var(--admin-text-secondary)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Grid View</span>
        </button>

        <button
          onClick={() => setViewMode('list')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: viewMode === 'list' ? 'var(--admin-primary)' : 'transparent',
            color: viewMode === 'list' ? '#FFFFFF' : 'var(--admin-text-secondary)',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>List View</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsFilters;
