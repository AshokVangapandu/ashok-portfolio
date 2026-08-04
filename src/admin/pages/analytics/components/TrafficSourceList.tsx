import React from 'react';
import { AnalyticsSource } from '../../../types/analytics';

interface TrafficSourceListProps {
  sources: AnalyticsSource[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const TrafficSourceList: React.FC<TrafficSourceListProps> = ({
  sources,
  loading = false,
  error = false,
  onRetry,
}) => {
  const getIcon = (type: AnalyticsSource['type']) => {
    switch (type) {
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case 'google':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
      case 'github':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        );
      case 'direct':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      default:
        // Generic external link/referral icon for other sources
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        );
    }
  };

  // Filter out development environment traffic
  const filteredSources = (sources || [])
    .filter((src) => {
      const sourceKey = src.source ? src.source.toLowerCase() : '';
      return sourceKey !== 'localhost' && sourceKey !== '127.0.0.1';
    })
    .slice(0, 5)
    .map((src, idx) => ({
      ...src,
      rank: idx + 1
    }));

  return (
    <div
      style={{
        flex: 1,
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
        📈 Traffic Sources
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load traffic sources.
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
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-cell" style={{ height: '36px', borderRadius: '6px' }} />
          ))
        ) : filteredSources.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No traffic sources recorded yet.
            </span>
          </div>
        ) : (
          filteredSources.map((src) => (
            <div
              key={src.source}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'rgba(248, 250, 252, 0.7)',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)'
              }}
            >
              {/* Top row text segments */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--admin-text-secondary)',
                      width: '24px'
                    }}
                  >
                    #{src.rank}
                  </span>

                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(124, 58, 237, 0.08)',
                      color: 'var(--admin-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getIcon(src.type)}
                  </div>

                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {src.source}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--admin-primary)',
                    backgroundColor: 'rgba(124, 58, 237, 0.06)',
                    padding: '4px 10px',
                    borderRadius: '12px'
                  }}
                >
                  {src.percentage}%
                </span>
              </div>

              {/* Progress bar line */}
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${src.percentage}%`,
                    backgroundColor: 'var(--admin-primary)',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrafficSourceList;
