/* src/components/admin/EdithInsights.tsx */
import React from 'react';
import { useEdithInsights } from '../../admin/hooks/useEdithInsights';
import { EdithInsight } from '../../admin/types/edithInsight';

interface InsightRowProps {
  insight: EdithInsight;
  onNavigate: (destination?: string) => void;
}

const getCategoryVisuals = (insight: EdithInsight) => {
  switch (insight.source) {
    case 'contact':
      return {
        cardBg: '#FFF9F8',
        cardBorder: '#FFE4E6',
        iconBg: '#FEE2E2',
        iconColor: '#EF4444',
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )
      };
    case 'analytics':
      return {
        cardBg: '#F6FDF8',
        cardBorder: '#DCFCE7',
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        )
      };
    case 'resume':
      return {
        cardBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      };
    case 'certification':
      return {
        cardBg: '#FAF8FF',
        cardBorder: '#EDE9FE',
        iconBg: '#EDE9FE',
        iconColor: '#7C3AED',
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        )
      };
    case 'project':
    default:
      return {
        cardBg: '#F8FAFC',
        cardBorder: '#E2E8F0',
        iconBg: '#EDE9FE',
        iconColor: '#6366F1',
        icon: (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        )
      };
  }
};

const getBadgeStyles = (badgeType?: 'needs_attention' | 'positive' | 'neutral') => {
  switch (badgeType) {
    case 'needs_attention':
      return {
        bg: '#FFEDD5',
        color: '#C2410C',
        dot: '#EA580C'
      };
    case 'positive':
      return {
        bg: '#DCFCE7',
        color: '#15803D',
        dot: '#16A34A'
      };
    case 'neutral':
    default:
      return {
        bg: '#F1F5F9',
        color: '#475569',
        dot: '#64748B'
      };
  }
};

const formatTimestamp = (dateStr?: string) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(date.getTime())) return 'Just now';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const InsightRow: React.FC<InsightRowProps> = ({ insight, onNavigate }) => {
  const visuals = getCategoryVisuals(insight);
  const badgeStyle = getBadgeStyles(insight.badgeType);

  return (
    <div
      className="edith-insight-row"
      style={{
        backgroundColor: visuals.cardBg,
        borderColor: visuals.cardBorder
      }}
      onClick={() => onNavigate(insight.actionDestination)}
    >
      <div
        className="edith-row-icon-container"
        style={{
          backgroundColor: visuals.iconBg,
          color: visuals.iconColor
        }}
      >
        {visuals.icon}
      </div>

      <div className="edith-row-content">
        <div className="edith-row-meta">
          <span className="edith-category-label">{insight.category}</span>
          {insight.badgeText && (
            <span
              className="edith-status-pill"
              style={{
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.color
              }}
            >
              <span className="edith-pill-dot" style={{ backgroundColor: badgeStyle.dot }} />
              {insight.badgeText}
            </span>
          )}
        </div>

        <h4 className="edith-row-title">{insight.title || insight.description}</h4>
        {insight.contextText && (
          <p className="edith-row-context">{insight.contextText}</p>
        )}
      </div>

      {insight.actionText && (
        <button
          type="button"
          className="edith-row-action"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(insight.actionDestination);
          }}
        >
          <span>{insight.actionText}</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const EdithInsights: React.FC = () => {
  const { insights, loading, error, refetch } = useEdithInsights();

  const handleNavigate = (destination?: string) => {
    if (destination) {
      window.history.pushState({}, '', destination);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const lastUpdatedText = insights.length > 0 && insights[0].generatedAt
    ? formatTimestamp(insights[0].generatedAt)
    : formatTimestamp();

  return (
    <div className="edith-insights-card">
      {/* 1. Header with Sparkles & Live Data status badge */}
      <div className="edith-header">
        <div className="edith-header-left">
          <div className="edith-header-icon-box">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
          </div>
          <div className="edith-header-titles">
            <h3 className="edith-title">Edith Insights</h3>
            <p className="edith-subtitle">Highlights and things that need your attention.</p>
          </div>
        </div>

        <div className="edith-live-badge">
          <span className="edith-live-dot" />
          <span>Insights from live data</span>
        </div>
      </div>

      {/* 2. Content Body: Loading / Error / Empty / Insights List */}
      <div className="edith-body">
        {loading ? (
          <div className="edith-skeleton-list">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="edith-skeleton-row">
                <div className="edith-skeleton-icon" />
                <div className="edith-skeleton-lines">
                  <div className="edith-skeleton-line short" />
                  <div className="edith-skeleton-line medium" />
                  <div className="edith-skeleton-line long" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="edith-error-state">
            <div className="edith-error-icon">⚠️</div>
            <p className="edith-error-msg">Insights are temporarily unavailable.</p>
            <button
              type="button"
              className="edith-retry-btn"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="edith-insights-list">
            {/* Display up to 3 prioritized insights */}
            {insights.map((insight) => (
              <InsightRow
                key={insight.id}
                insight={insight}
                onNavigate={handleNavigate}
              />
            ))}

            {/* Subtle "All good!" Card at the bottom */}
            <div className="edith-all-good-row">
              <div className="edith-all-good-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                </svg>
              </div>
              <div className="edith-all-good-text">
                <h5 className="edith-all-good-title">All good!</h5>
                <p className="edith-all-good-subtitle">Your portfolio is performing well. Keep up the great work!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Card Footer */}
      <div className="edith-footer">
        <button
          type="button"
          className="edith-footer-updated"
          onClick={() => refetch()}
          title="Refresh insights"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          <span>Last updated: {lastUpdatedText}</span>
        </button>

        <button
          type="button"
          className="edith-footer-link"
          onClick={() => handleNavigate('/admin/analytics')}
        >
          <span>View All Insights</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .edith-insights-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-align: left;
          width: 100%;
          gap: 18px;
        }

        /* 1. Header Section */
        .edith-insights-card .edith-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .edith-insights-card .edith-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .edith-insights-card .edith-header-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #F3E8FF;
          color: #9333EA;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .edith-insights-card .edith-header-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .edith-insights-card .edith-title {
          font-size: 19px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }

        .edith-insights-card .edith-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.3;
        }

        .edith-insights-card .edith-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #15803D;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .edith-insights-card .edith-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16A34A;
        }

        /* 2. Content Body */
        .edith-insights-card .edith-body {
          width: 100%;
        }

        .edith-insights-card .edith-insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        /* Insight Row */
        .edith-insights-card .edith-insight-row {
          border-width: 1px;
          border-style: solid;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
        }

        .edith-insights-card .edith-insight-row:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
        }

        .edith-insights-card .edith-row-icon-container {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .edith-insights-card .edith-row-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-grow: 1;
          min-width: 0;
        }

        .edith-insights-card .edith-row-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edith-insights-card .edith-category-label {
          font-size: 11px;
          font-weight: 750;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .edith-insights-card .edith-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 650;
          padding: 2px 8px;
          border-radius: 999px;
          line-height: 1.3;
        }

        .edith-insights-card .edith-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .edith-insights-card .edith-row-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .edith-insights-card .edith-row-context {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.35;
        }

        .edith-insights-card .edith-row-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          padding: 6px 0 6px 8px;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 150ms ease, transform 150ms ease;
        }

        .edith-insights-card .edith-row-action:hover {
          color: #3730A3;
          transform: translateX(2px);
        }

        /* "All good!" Card at bottom */
        .edith-insights-card .edith-all-good-row {
          background: #F5F3FF;
          border: 1px solid #EDE9FE;
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
          width: 100%;
        }

        .edith-insights-card .edith-all-good-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #EDE9FE;
          color: #7C3AED;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .edith-insights-card .edith-all-good-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .edith-insights-card .edith-all-good-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #3730A3;
          margin: 0;
          line-height: 1.2;
        }

        .edith-insights-card .edith-all-good-subtitle {
          font-size: 12px;
          color: #6B7280;
          margin: 0;
          font-weight: 500;
          line-height: 1.3;
        }

        /* 3. Footer */
        .edith-insights-card .edith-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
          gap: 12px;
          width: 100%;
        }

        .edith-insights-card .edith-footer-updated {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease;
        }

        .edith-insights-card .edith-footer-updated:hover {
          color: #0F172A;
        }

        .edith-insights-card .edith-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease, transform 150ms ease;
        }

        .edith-insights-card .edith-footer-link:hover {
          color: #3730A3;
          transform: translateX(2px);
        }

        /* Error state */
        .edith-insights-card .edith-error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
          text-align: center;
          background: #FFF8F6;
          border: 1px dashed #FECDD3;
          border-radius: 12px;
        }

        .edith-insights-card .edith-error-icon {
          font-size: 24px;
          margin-bottom: 6px;
        }

        .edith-insights-card .edith-error-msg {
          font-size: 13px;
          font-weight: 600;
          color: #991B1B;
          margin: 0 0 10px 0;
        }

        .edith-insights-card .edith-retry-btn {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          color: #0F172A;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          transition: all 150ms ease;
        }

        .edith-insights-card .edith-retry-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        /* Skeleton Loading */
        .edith-insights-card .edith-skeleton-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .edith-insights-card .edith-skeleton-row {
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .edith-insights-card .edith-skeleton-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: edithSkeletonPulse 1.5s infinite;
          flex-shrink: 0;
        }

        .edith-insights-card .edith-skeleton-lines {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .edith-insights-card .edith-skeleton-line {
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: edithSkeletonPulse 1.5s infinite;
        }

        .edith-insights-card .edith-skeleton-line.short { width: 70px; }
        .edith-insights-card .edith-skeleton-line.medium { width: 160px; }
        .edith-insights-card .edith-skeleton-line.long { width: 220px; }

        @keyframes edithSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .edith-insights-card {
            padding: 16px;
          }
          .edith-insights-card .edith-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .edith-insights-card .edith-live-badge {
            align-self: flex-start;
          }
          .edith-insights-card .edith-insight-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .edith-insights-card .edith-row-action {
            align-self: flex-end;
            padding: 0;
          }
          .edith-insights-card .edith-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}} />
    </div>
  );
};

export default EdithInsights;
