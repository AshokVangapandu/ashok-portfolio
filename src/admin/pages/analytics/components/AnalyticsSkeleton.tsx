/* src/admin/pages/analytics/components/AnalyticsSkeleton.tsx */
import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box' }}>
      {/* KPI Cards Skeletons row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="skeleton-cell" style={{ height: '110px', borderRadius: '12px' }} />
        ))}
      </div>

      {/* Main Charts Skeletons Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <div className="skeleton-cell" style={{ height: '240px', borderRadius: '12px' }} />
        <div className="skeleton-cell" style={{ height: '240px', borderRadius: '12px' }} />
      </div>

      {/* Ranks Skeletons Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="skeleton-cell" style={{ height: '280px', borderRadius: '12px' }} />
        <div className="skeleton-cell" style={{ height: '280px', borderRadius: '12px' }} />
      </div>

      {/* Distribution rings Skeletons Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="skeleton-cell" style={{ height: '180px', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
