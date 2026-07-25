/* src/components/tools/ProductMetrics.tsx */
import React, { useState, useEffect } from 'react';
import { portfolioStatsService, PortfolioStats } from '../../services/portfolioStatsService';

export const ProductMetrics: React.FC = () => {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    portfolioStatsService.getPortfolioStatistics()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[ProductMetrics] Failed to load statistics:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalDownloadsStr = stats ? portfolioStatsService.formatNumber(stats.totalDownloads) : '0';
  const averageRatingStr = stats ? stats.averageRating.toFixed(2) : '0.00';
  const totalReviews = stats ? stats.totalReviews : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '4px' }}>
        <span style={{ width: '4px', height: '16px', backgroundColor: '#A78BFA', borderRadius: '2px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Performance Highlights
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box'
        }}
        className="premium-highlights-grid"
      >
        {/* Active Downloads Card */}
        <div
          className="highlight-detail-card highlight-downloads-card"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'rgba(10, 15, 30, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(167, 139, 250, 0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'default'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '40px',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.05), transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'space-between' }} className="highlight-card-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} className="highlight-card-left">
              {/* Icon Badge */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.06)',
                  transition: 'all 0.25s ease',
                  flexShrink: 0
                }}
                className="highlight-icon-container"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>
                  Active Downloads
                </span>
                {loading ? (
                  <div className="skeleton-pulse" style={{ width: '80px', height: '28px', marginTop: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
                ) : (
                  <span
                    style={{
                      fontSize: '26px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      background: 'linear-gradient(180deg, #FFFFFF 30%, #C4B5FD 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {totalDownloadsStr}
                  </span>
                )}
              </div>
            </div>

            {!loading && stats && stats.totalDownloads > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#10B981',
                  fontWeight: 500,
                  backgroundColor: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.12)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                <span style={{ width: '4px', height: '4px', backgroundColor: '#10B981', borderRadius: '50%' }} />
                Live
              </span>
            )}
          </div>
        </div>

        {/* User Satisfaction Card */}
        <div
          className="highlight-detail-card highlight-satisfaction-card"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: 'rgba(10, 15, 30, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(251, 113, 133, 0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'default'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '40px',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 113, 133, 0.04), transparent 70%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'space-between' }} className="highlight-card-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} className="highlight-card-left">
              {/* Icon Badge */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(251, 113, 133, 0.08)',
                  border: '1px solid rgba(251, 113, 133, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(251, 113, 133, 0.08)',
                  transition: 'all 0.25s ease',
                  flexShrink: 0
                }}
                className="highlight-icon-container"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FB7185" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>
                  User Satisfaction
                </span>
                {loading ? (
                  <div className="skeleton-pulse" style={{ width: '110px', height: '28px', marginTop: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }} />
                ) : (
                  <span
                    style={{
                      fontSize: '26px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      background: 'linear-gradient(180deg, #FFFFFF 30%, #FDA4AF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: '3px'
                    }}
                  >
                    {averageRatingStr} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 400 }}>/ 5.0</span>
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="skeleton-pulse" style={{ width: '70px', height: '22px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '999px' }} />
            ) : (
              <span
                style={{
                  fontSize: '11px',
                  color: '#E2E8F0',
                  fontWeight: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                {totalReviews} review{totalReviews === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .skeleton-pulse {
          animation: pulse-glow 1.5s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .highlight-detail-card:hover {
          border-color: rgba(255, 255, 255, 0.12) !important;
          background-color: rgba(14, 21, 38, 0.5) !important;
          transform: translateY(-2px);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .highlight-downloads-card:hover {
          border-color: rgba(167, 139, 250, 0.22) !important;
          box-shadow: 
            0 8px 24px rgba(124, 58, 237, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }
        .highlight-satisfaction-card:hover {
          border-color: rgba(251, 113, 133, 0.2) !important;
          box-shadow: 
            0 8px 24px rgba(251, 113, 133, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }
        .highlight-detail-card:hover .highlight-icon-container {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
        }
        @media (max-width: 768px) {
          .premium-highlights-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .highlight-card-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .highlight-card-left {
            width: 100% !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProductMetrics;

