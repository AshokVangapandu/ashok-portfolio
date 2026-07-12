/* src/admin/pages/analytics/components/VisitorComparisonCard.tsx */
import React from 'react';
import { VisitorComparison } from '../../../types/analytics';

interface VisitorComparisonCardProps {
  comparison: VisitorComparison | null;
  loading?: boolean;
}

export const VisitorComparisonCard: React.FC<VisitorComparisonCardProps> = ({
  comparison,
  loading = false,
}) => {
  if (!comparison) return null;

  return (
    <div
      style={{
        flex: 1.5,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '300px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        👥 New vs Returning Visitors
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
        {loading ? (
          <div className="skeleton-cell" style={{ height: '80px', borderRadius: '8px' }} />
        ) : (
          <>
            {/* Visual ratio values display */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
              {/* New visitors side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--admin-primary)' }}>
                  {comparison.newPercentage}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                  New Visitors
                </span>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                  {comparison.newTrend}
                </span>
              </div>

              {/* Returning visitors side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end', textAlign: 'right' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#9061F9' }}>
                  {comparison.returningPercentage}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                  Returning Visitors
                </span>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                  {comparison.returningTrend}
                </span>
              </div>
            </div>

            {/* Combined Segmented Progress Bar */}
            <div
              style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '4px',
                display: 'flex',
                overflow: 'hidden',
                marginTop: '10px'
              }}
            >
              {/* New Segment */}
              <div
                style={{
                  width: `${comparison.newPercentage}%`,
                  height: '100%',
                  backgroundColor: 'var(--admin-primary)',
                  transition: 'width 0.3s ease'
                }}
              />
              {/* Returning Segment */}
              <div
                style={{
                  width: `${comparison.returningPercentage}%`,
                  height: '100%',
                  backgroundColor: '#CABFFD',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitorComparisonCard;
