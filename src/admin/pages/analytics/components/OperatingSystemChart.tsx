import React, { useState, useEffect } from 'react';
import { AnalyticsOperatingSystem } from '../../../types/analytics';

interface OperatingSystemChartProps {
  operatingSystems: AnalyticsOperatingSystem[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const OperatingSystemChart: React.FC<OperatingSystemChartProps> = ({
  operatingSystems,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getOSIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();

    // Windows Icon (4 window panes)
    if (lowercaseName.includes('windows')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
        </svg>
      );
    }

    // Apple macOS / iOS Icon (Apple Logo)
    if (lowercaseName.includes('mac') || lowercaseName.includes('ios') || lowercaseName.includes('os x') || lowercaseName.includes('apple')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.8 16.32 3.32 8.78 7.37 8.3c1.4.17 2.27.97 3.03.97.74 0 1.9-.99 3.53-.83 1.68.16 2.94.88 3.56 2.23-3.4 2.1-2.83 6.64.44 7.95-.66 1.62-1.4 3.2-2.12 3.66M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.54-3.74 4.25z" />
        </svg>
      );
    }

    // Android Icon (Droid Bug)
    if (lowercaseName.includes('android')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v3M5 16V9a7 7 0 0 1 14 0v7M12 9v5M9 22V16M15 22V16" />
          <circle cx="9.5" cy="8.5" r="0.5" fill="currentColor" />
          <circle cx="14.5" cy="8.5" r="0.5" fill="currentColor" />
        </svg>
      );
    }

    // Linux Icon
    if (lowercaseName.includes('linux')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C9.5 2 7 3.5 7 6.5s2 4.5 2 6.5c-2 2-2 4.5-2 6.5s3 2.5 5 2.5 5-.5 5-2.5-1-4.5-3-6.5c0-2 2-3.5 2-6.5S14.5 2 12 2z" />
        </svg>
      );
    }

    // Ubuntu Icon
    if (lowercaseName.includes('ubuntu')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="22" />
        </svg>
      );
    }

    // ChromeOS Icon
    if (lowercaseName.includes('chrome')) {
      return (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 9h8M7.5 12l4 7M16.5 12l-4-7" />
        </svg>
      );
    }

    // Fallback: Desktop Icon
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  };

  const sortedOS = [...(operatingSystems || [])]
    .sort((a, b) => b.percentage - a.percentage)
    .map((os, index) => ({
      ...os,
      rank: index + 1
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
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      <style>{`
        .os-row {
          transition: all 0.2s ease-in-out;
        }
        .os-row:hover {
          transform: translateY(-1px);
          border-color: var(--admin-primary) !important;
          background-color: rgba(124, 58, 237, 0.03) !important;
        }
        .os-row:hover .progress-fill {
          opacity: 0.95;
          filter: brightness(1.05);
        }
      `}</style>

      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        💻 Operating Systems
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load operating system analytics.
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
            <div key={idx} className="skeleton-cell" style={{ height: '48px', borderRadius: '8px' }} />
          ))
        ) : sortedOS.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No operating system analytics available yet.
            </span>
          </div>
        ) : (
          sortedOS.map((os) => (
            <div
              key={os.name}
              className="os-row"
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
              {/* Top Row: Rank + Icon + Name & Percentage */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  
                  {/* Rank Badge */}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--admin-text-secondary)',
                      width: '20px'
                    }}
                  >
                    #{os.rank}
                  </span>

                  {/* OS Icon */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(124, 58, 237, 0.08)',
                      color: 'var(--admin-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {getOSIcon(os.name)}
                  </div>

                  {/* OS Name */}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {os.name}
                  </span>

                </div>

                {/* Percentage */}
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--admin-text)', textAlign: 'right' }}>
                  {os.percentage}%
                </span>
              </div>

              {/* Bottom Row: Progress Bar */}
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
                  className="progress-fill"
                  style={{
                    height: '100%',
                    width: mounted ? `${os.percentage}%` : '0%',
                    backgroundColor: 'var(--admin-primary)',
                    borderRadius: '3px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
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

export default OperatingSystemChart;
