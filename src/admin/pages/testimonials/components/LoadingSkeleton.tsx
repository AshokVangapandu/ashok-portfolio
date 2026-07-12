/* src/admin/pages/testimonials/components/LoadingSkeleton.tsx */
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '24px',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        boxSizing: 'border-box'
      }}
    >
      {/* Table headers simulation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="skeleton-cell" style={{ width: '80px', height: '16px', borderRadius: '4px' }} />
        ))}
      </div>

      {/* Table rows simulation */}
      {rows.map((_, rIdx) => (
        <div key={rIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F8FAFC' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="skeleton-cell" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            <div className="skeleton-cell" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton-cell" style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton-cell" style={{ width: '60px', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton-cell" style={{ width: '180px', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton-cell" style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
          <div className="skeleton-cell" style={{ width: '100px', height: '32px', borderRadius: '16px' }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
