/* src/admin/pages/analytics/components/AnalyticsSkeleton.tsx */
import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
      {/* 1. Top 5 KPI Skeleton Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid rgba(226, 232, 240, 0.75)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div className="skeleton-cell" style={{ width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton-cell" style={{ width: '56px', height: '22px', borderRadius: '4px' }} />
              <div className="skeleton-cell" style={{ width: '78px', height: '12px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Charts & Activity Skeletons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '20px',
        }}
      >
        {/* Trend Chart Skeleton Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            minHeight: '260px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton-cell" style={{ width: '120px', height: '18px', borderRadius: '4px' }} />
              <div className="skeleton-cell" style={{ width: '160px', height: '12px', borderRadius: '4px' }} />
            </div>
            <div className="skeleton-cell" style={{ width: '130px', height: '30px', borderRadius: '8px' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px 20px', gap: '16px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="skeleton-cell" style={{ width: '12px', height: `${30 + (i % 4) * 20}%`, borderRadius: '6px' }} />
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="skeleton-cell" style={{ width: '130px', height: '18px', borderRadius: '4px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="skeleton-cell" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className="skeleton-cell" style={{ width: '90px', height: '13px', borderRadius: '4px' }} />
                    <div className="skeleton-cell" style={{ width: '60px', height: '10px', borderRadius: '3px' }} />
                  </div>
                </div>
                <div className="skeleton-cell" style={{ width: '40px', height: '10px', borderRadius: '3px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Distribution Breakdown Skeletons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="skeleton-cell" style={{ width: '130px', height: '16px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
              <div className="skeleton-cell" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton-cell" style={{ width: '100%', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton-cell" style={{ width: '80%', height: '12px', borderRadius: '3px' }} />
                <div className="skeleton-cell" style={{ width: '60%', height: '12px', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;

