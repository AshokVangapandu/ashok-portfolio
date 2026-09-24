/* src/components/admin/KpiCard.tsx */
import React from 'react';

export type KpiColorScheme = 'indigo' | 'violet' | 'amber' | 'cyan' | 'pink' | 'emerald';

interface KpiCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  badgeType?: 'positive' | 'neutral' | 'negative';
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendPeriod?: string;
  showTrend?: boolean;
  colorScheme?: KpiColorScheme;
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  value,
  label,
  badge,
  badgeType = 'positive',
  trend,
  trendDirection,
  trendPeriod = 'vs last week',
  showTrend = false,
  colorScheme = 'indigo',
  loading = false,
}) => {
  // Determine trend direction
  let effectiveDirection: 'up' | 'down' | 'neutral' = trendDirection || 'neutral';
  let cleanTrend = trend || '';

  if (!trendDirection && trend) {
    if (trend.startsWith('+') || (trend.includes('%') && !trend.startsWith('-') && trend !== '0%' && trend !== '+0.0%')) {
      effectiveDirection = 'up';
    } else if (trend.startsWith('-') && trend !== '- 0%') {
      effectiveDirection = 'down';
    } else {
      effectiveDirection = 'neutral';
    }
  }

  if (cleanTrend) {
    cleanTrend = cleanTrend.replace(/^[+\-↘↗\s]+/, '');
  }

  return (
    <div className={`kpi-gradient-card scheme-${colorScheme}`}>
      {/* Card Content Row: Icon + Info + Optional Right-Side Trend */}
      <div className="kpi-card-main">
        <div className="kpi-icon-pill">
          {icon}
        </div>
        <div className="kpi-content-block">
          <div className="kpi-header-row">
            <span className="kpi-card-label">{label}</span>
            {badge && !loading && (
              <span className={`kpi-card-badge ${badgeType}`}>
                {badge}
              </span>
            )}
          </div>
          {loading ? (
            <div className="kpi-skeleton-value" />
          ) : (
            <h3 className="kpi-card-value">{value}</h3>
          )}
        </div>

        {/* Optional Right-Side Trend (e.g. Visitors) */}
        {showTrend && !loading && (
          <div className="kpi-trend-side">
            <div className={`kpi-trend-pill ${effectiveDirection}`}>
              {effectiveDirection === 'up' && <span className="trend-icon">↗</span>}
              {effectiveDirection === 'down' && <span className="trend-icon">↘</span>}
              {effectiveDirection === 'neutral' && <span className="trend-icon">—</span>}
              <span className="trend-percent">{cleanTrend}</span>
            </div>
            <span className="kpi-period-text">{trendPeriod}</span>
          </div>
        )}
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .kpi-gradient-card {
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: left;
          transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 220ms cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 86px;
        }

        .kpi-gradient-card:hover {
          transform: translateY(-2.5px);
        }

        /* Subtle Ambient Glow on top right */
        .kpi-gradient-card::before {
          content: '';
          position: absolute;
          top: -24px;
          right: -24px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          opacity: 0.45;
          pointer-events: none;
          transition: opacity 220ms ease;
        }

        .kpi-gradient-card:hover::before {
          opacity: 0.75;
        }

        /* 1. Visitors (Blue / Indigo Gradient) */
        .kpi-gradient-card.scheme-indigo {
          background: linear-gradient(135deg, #FFFFFF 20%, #F0F6FF 100%);
          border: 1px solid #DCE9FE;
          box-shadow: 0 3px 10px -2px rgba(37, 99, 235, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);
        }
        .kpi-gradient-card.scheme-indigo::before {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
        }
        .kpi-gradient-card.scheme-indigo:hover {
          border-color: #BFDBFE;
          box-shadow: 0 10px 24px -4px rgba(37, 99, 235, 0.12);
        }
        .kpi-gradient-card.scheme-indigo .kpi-icon-pill {
          background: #DBEAFE;
          color: #1D4ED8;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12);
        }

        /* 2. Messages (Purple / Violet Gradient) */
        .kpi-gradient-card.scheme-violet {
          background: linear-gradient(135deg, #FFFFFF 20%, #F6F0FE 100%);
          border: 1px solid #EDE4FF;
          box-shadow: 0 3px 10px -2px rgba(147, 51, 234, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);
        }
        .kpi-gradient-card.scheme-violet::before {
          background: radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, transparent 70%);
        }
        .kpi-gradient-card.scheme-violet:hover {
          border-color: #DDD6FE;
          box-shadow: 0 10px 24px -4px rgba(147, 51, 234, 0.12);
        }
        .kpi-gradient-card.scheme-violet .kpi-icon-pill {
          background: #EDE9FE;
          color: #6D28D9;
          box-shadow: 0 2px 6px rgba(109, 40, 217, 0.12);
        }

        /* 3. Testimonials (Amber / Golden Gradient) */
        .kpi-gradient-card.scheme-amber {
          background: linear-gradient(135deg, #FFFFFF 20%, #FFF8EB 100%);
          border: 1px solid #FEEBC8;
          box-shadow: 0 3px 10px -2px rgba(217, 119, 6, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);
        }
        .kpi-gradient-card.scheme-amber::before {
          background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%);
        }
        .kpi-gradient-card.scheme-amber:hover {
          border-color: #FDE68A;
          box-shadow: 0 10px 24px -4px rgba(217, 119, 6, 0.12);
        }
        .kpi-gradient-card.scheme-amber .kpi-icon-pill {
          background: #FEF3C7;
          color: #B45309;
          box-shadow: 0 2px 6px rgba(217, 119, 6, 0.12);
        }

        /* 4. Downloads (Cyan / Teal Gradient) */
        .kpi-gradient-card.scheme-cyan {
          background: linear-gradient(135deg, #FFFFFF 20%, #EEFBFF 100%);
          border: 1px solid #CCF2FE;
          box-shadow: 0 3px 10px -2px rgba(8, 145, 178, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);
        }
        .kpi-gradient-card.scheme-cyan::before {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%);
        }
        .kpi-gradient-card.scheme-cyan:hover {
          border-color: #BAE6FD;
          box-shadow: 0 10px 24px -4px rgba(8, 145, 178, 0.12);
        }
        .kpi-gradient-card.scheme-cyan .kpi-icon-pill {
          background: #E0F2FE;
          color: #0369A1;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
        }

        /* 5. Projects & Tools (Pink / Magenta Gradient) */
        .kpi-gradient-card.scheme-pink {
          background: linear-gradient(135deg, #FFFFFF 20%, #FFF0F6 100%);
          border: 1px solid #FCE2ED;
          box-shadow: 0 3px 10px -2px rgba(219, 39, 119, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02);
        }
        .kpi-gradient-card.scheme-pink::before {
          background: radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, transparent 70%);
        }
        .kpi-gradient-card.scheme-pink:hover {
          border-color: #FBCFE8;
          box-shadow: 0 10px 24px -4px rgba(219, 39, 119, 0.12);
        }
        .kpi-gradient-card.scheme-pink .kpi-icon-pill {
          background: #FCE7F3;
          color: #BE185D;
          box-shadow: 0 2px 6px rgba(219, 39, 119, 0.12);
        }

        /* Card Main Content */
        .kpi-gradient-card .kpi-card-main {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .kpi-gradient-card .kpi-icon-pill {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 200ms ease;
        }

        .kpi-gradient-card:hover .kpi-icon-pill {
          transform: scale(1.06);
        }

        .kpi-gradient-card .kpi-icon-pill svg {
          width: 20px;
          height: 20px;
        }

        .kpi-gradient-card .kpi-content-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
          min-width: 0;
        }

        .kpi-gradient-card .kpi-header-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .kpi-gradient-card .kpi-card-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          line-height: 1.25;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kpi-gradient-card .kpi-card-value {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }

        /* Badge Styling */
        .kpi-gradient-card .kpi-card-badge {
          font-size: 10.5px;
          font-weight: 700;
          border-radius: 999px;
          padding: 2px 7px;
          line-height: 1;
        }

        .kpi-gradient-card .kpi-card-badge.neutral {
          color: #BE185D;
          background-color: rgba(236, 72, 153, 0.12);
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        /* Right-Side Trend Styling */
        .kpi-gradient-card .kpi-trend-side {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .kpi-gradient-card .kpi-trend-pill {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          padding: 3px 6px;
          border-radius: 6px;
        }

        .kpi-gradient-card .kpi-trend-pill.up {
          color: #15803D;
          background-color: rgba(34, 197, 94, 0.12);
        }

        .kpi-gradient-card .kpi-trend-pill.down {
          color: #DC2626;
          background-color: rgba(239, 68, 68, 0.12);
        }

        .kpi-gradient-card .kpi-trend-pill.neutral {
          color: #64748B;
          background-color: rgba(100, 116, 139, 0.1);
        }

        .kpi-gradient-card .kpi-period-text {
          font-size: 10px;
          font-weight: 500;
          color: #94A3B8;
          line-height: 1;
          white-space: nowrap;
        }

        /* Skeleton Loading */
        .kpi-gradient-card .kpi-skeleton-value {
          width: 50px;
          height: 24px;
          border-radius: 4px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: kpiSkeletonPulse 1.5s infinite;
        }

        @keyframes kpiSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
};

export default KpiCard;
