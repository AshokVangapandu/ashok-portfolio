/* src/admin/pages/testimonials/components/TestimonialsToolbar.tsx */
import React from 'react';

interface TestimonialsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  rating: string;
  setRating: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  disabled?: boolean;
}

export const TestimonialsToolbar: React.FC<TestimonialsToolbarProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  rating,
  setRating,
  sortBy,
  setSortBy,
  disabled = false
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
      {/* Left items: Search and Filter select boxes */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--admin-space-3)',
          flex: 1
        }}
      >
        {/* 1. Search Box */}
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
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13.5px',
              color: 'var(--admin-text)',
              backgroundColor: disabled ? 'var(--admin-surface, #F8FAFC)' : '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              cursor: disabled ? 'not-allowed' : 'text'
            }}
            onFocus={(e) => {
              if (!disabled) e.currentTarget.style.borderColor = 'var(--admin-primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-border)';
            }}
          />
        </div>

        {/* 2. Status Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={disabled}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: disabled ? 'var(--admin-surface, #F8FAFC)' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            minWidth: '100px'
          }}
        >
          <option value="all">Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="remind_later">Remind Later</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* 3. Rating Dropdown */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          disabled={disabled}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: disabled ? 'var(--admin-surface, #F8FAFC)' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            minWidth: '100px'
          }}
        >
          <option value="all">Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        {/* 4. Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          disabled={disabled}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: disabled ? 'var(--admin-surface, #F8FAFC)' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            minWidth: '120px'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest_rating">Highest Rating</option>
          <option value="lowest_rating">Lowest Rating</option>
        </select>
      </div>

      {/* Right items: Export Button */}
      <div>
        <button
          className="hover-scale active-press"
          disabled={disabled}
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
            backgroundColor: disabled ? 'var(--admin-surface, #F8FAFC)' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            if (!disabled) {
              e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
              e.currentTarget.style.color = 'var(--admin-primary)';
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
            }
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
      </div>
    </div>
  );
};

export default TestimonialsToolbar;
