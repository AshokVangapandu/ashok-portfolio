/* src/admin/pages/testimonials/components/EmptyState.tsx */
import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClear?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Testimonials Found',
  description = 'There are no testimonials matching your filter criteria.',
  onClear,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-12) var(--admin-space-6)',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--admin-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--admin-primary)',
          marginBottom: 'var(--admin-space-4)'
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      <h3
        style={{
          margin: '0 0 var(--admin-space-1.5) 0',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--admin-text)'
        }}
      >
        {title}
      </h3>
      
      <p
        style={{
          margin: 0,
          fontSize: '13.5px',
          color: 'var(--admin-text-secondary)',
          maxWidth: '320px',
          lineHeight: '1.5'
        }}
      >
        {description}
      </p>

      {onClear && (
        <button
          onClick={onClear}
          className="hover-scale active-press"
          style={{
            marginTop: 'var(--admin-space-4)',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'var(--admin-primary)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
