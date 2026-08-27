import React, { useState, useEffect } from 'react';
import { AnalyticsBrowser } from '../../../types/analytics';

interface BrowserChartProps {
  browsers: AnalyticsBrowser[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const BrowserChart: React.FC<BrowserChartProps> = ({
  browsers,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBrowserIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    
    // Safari Compass Icon
    if (lowercaseName.includes('safari')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    }
    
    // Chrome Icon
    if (lowercaseName.includes('chrome')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="8" x2="20.66" y2="8" />
          <line x1="8.54" y1="14" x2="4.21" y2="6.5" />
          <line x1="15.46" y1="14" x2="11.13" y2="21.5" />
        </svg>
      );
    }

    // Firefox Icon
    if (lowercaseName.includes('firefox')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M18 12a6 6 0 0 1-6 6 6 6 0 0 1-6-6c0-3.3 2.7-6 6-6s6 2.7 6 6z" />
          <path d="M12 6a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
          <path d="M16 16c2-2.5 1-6.5-1-8" />
        </svg>
      );
    }

    // Edge Icon
    if (lowercaseName.includes('edge') || lowercaseName.includes('microsoft')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10a10 10 0 0 1 18-6c0 4-4.5 7.5-8 7.5S4 8 4 12c0 3.5 3 6 8 6 4.5 0 8-3.5 8-8" />
          <path d="M12 18a10 10 0 0 1-10-8" />
        </svg>
      );
    }

    // Opera Icon
    if (lowercaseName.includes('opera')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="6" ry="10" />
          <ellipse cx="12" cy="12" rx="2" ry="7" />
        </svg>
      );
    }

    // Brave Icon
    if (lowercaseName.includes('brave')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 10h6M12 8v4" />
        </svg>
      );
    }

    // Arc Icon
    if (lowercaseName.includes('arc')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 22h20L12 2z" />
          <line x1="6" y1="18" x2="18" y2="18" />
        </svg>
      );
    }

    // Samsung Internet Icon
    if (lowercaseName.includes('samsung')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="6" />
          <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-30 12 12)" />
        </svg>
      );
    }

    // Internet Explorer
    if (lowercaseName.includes('explorer') || lowercaseName.includes('ie')) {
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <ellipse cx="12" cy="12" rx="10" ry="2" transform="rotate(20 12 12)" />
          <path d="M8 12h8a4 4 0 0 0-8 0" />
        </svg>
      );
    }

    // Fallback: Globe Icon
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  };

  const sortedBrowsers = [...(browsers || [])]
    .sort((a, b) => b.percentage - a.percentage)
    .map((br, index) => ({
      ...br,
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
        .browser-row {
          transition: all 0.2s ease-in-out;
        }
        .browser-row:hover {
          transform: translateY(-1px);
          border-color: var(--admin-primary) !important;
          background-color: rgba(124, 58, 237, 0.03) !important;
        }
        .browser-row:hover .progress-fill {
          opacity: 0.95;
          filter: brightness(1.05);
        }
      `}</style>

      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        🌐 Browser Usage
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load browser analytics.
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
        ) : sortedBrowsers.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No browser analytics available yet.
            </span>
          </div>
        ) : (
          sortedBrowsers.map((br) => (
            <div
              key={br.name}
              className="browser-row"
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
                    #{br.rank}
                  </span>

                  {/* Browser Icon */}
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
                    {getBrowserIcon(br.name)}
                  </div>

                  {/* Browser Name */}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {br.name}
                  </span>

                </div>

                {/* Percentage */}
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--admin-text)', textAlign: 'right' }}>
                  {br.percentage}%
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
                    width: mounted ? `${br.percentage}%` : '0%',
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

export default BrowserChart;
