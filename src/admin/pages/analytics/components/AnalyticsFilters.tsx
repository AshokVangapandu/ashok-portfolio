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
        gap: '12px',
        flexWrap: 'wrap',
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      {/* 1. Time Range Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {ranges.map((r) => {
          const isActive = timeRange === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className="hover-scale active-press"
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: isActive ? 'none' : '1px solid #E2E8F0',
                backgroundColor: isActive ? '#7C3AED' : '#FFFFFF',
                backgroundImage: isActive ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'none',
                color: isActive ? '#FFFFFF' : '#475569',
                boxShadow: isActive ? '0 2px 8px rgba(124, 58, 237, 0.25)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
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
          title="Refresh analytics data"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 10px',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            color: '#64748B',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.18s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.color = '#7C3AED';
            e.currentTarget.style.borderColor = '#C4B5FD';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* 2. View Toggle */}
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '3px',
          boxSizing: 'border-box',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <button
          onClick={() => setViewMode('grid')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: viewMode === 'grid' ? '#7C3AED' : 'transparent',
            backgroundImage: viewMode === 'grid' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'none',
            color: viewMode === 'grid' ? '#FFFFFF' : '#64748B',
            boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(124, 58, 237, 0.25)' : 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.18s ease'
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
            padding: '6px 14px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: viewMode === 'list' ? '#7C3AED' : 'transparent',
            backgroundImage: viewMode === 'list' ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : 'none',
            color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
            boxShadow: viewMode === 'list' ? '0 2px 6px rgba(124, 58, 237, 0.25)' : 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.18s ease'
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

