import React, { useState, useEffect } from 'react';
import { VisitorComparison } from '../../../types/analytics';

interface VisitorComparisonCardProps {
  comparison: VisitorComparison | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const useAnimatedValue = (target: number, duration: number = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return value;
};

export const VisitorComparisonCard: React.FC<VisitorComparisonCardProps> = ({
  comparison,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animatedNew = useAnimatedValue(comparison?.newPercentage || 0);
  const animatedReturning = useAnimatedValue(comparison?.returningPercentage || 0);

  const parseTrend = (trendStr: string | undefined | null) => {
    if (!trendStr) {
      return {
        text: '0%',
        color: '#6B7280' // Gray 500
      };
    }
    
    const cleanStr = trendStr.trim();
    const isNegative = cleanStr.startsWith('-');
    const isZero = cleanStr === '0%' || cleanStr === '+0.0%' || cleanStr === '-0.0%' || cleanStr === '0.0%' || parseFloat(cleanStr) === 0;
    
    if (isZero) {
      return {
        text: '0%',
        color: '#6B7280'
      };
    } else if (isNegative) {
      return {
        text: `▼ ${cleanStr}`,
        color: '#EF4444' // Red 500
      };
    } else {
      const displayStr = cleanStr.startsWith('+') ? cleanStr : `+${cleanStr}`;
      return {
        text: `▲ ${displayStr}`,
        color: '#10B981' // Green 500
      };
    }
  };

  const newTrendObj = parseTrend(comparison?.newTrend);
  const returningTrendObj = parseTrend(comparison?.returningTrend);

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
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        👥 New vs Returning Visitors
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '120px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load visitor comparison data.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #EF4444',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="skeleton-cell" style={{ height: '80px', borderRadius: '8px' }} />
        ) : !comparison ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No visitor comparison data available yet.
            </span>
          </div>
        ) : (
          <>
            {/* Visual ratio values display */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
              {/* New visitors side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--admin-primary)' }}>
                  {animatedNew}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                  New Visitors
                </span>
                <span style={{ fontSize: '11px', color: newTrendObj.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {newTrendObj.text}
                </span>
              </div>

              {/* Returning visitors side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end', textAlign: 'right' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#9061F9' }}>
                  {animatedReturning}%
                </span>
                <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 600 }}>
                  Returning Visitors
                </span>
                <span style={{ fontSize: '11px', color: returningTrendObj.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {returningTrendObj.text}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#E2E8F0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '10px'
              }}
            >
              <div
                style={{
                  width: mounted ? `${comparison.newPercentage}%` : '0%',
                  height: '100%',
                  backgroundColor: 'var(--admin-primary)',
                  borderRadius: '4px',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
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
