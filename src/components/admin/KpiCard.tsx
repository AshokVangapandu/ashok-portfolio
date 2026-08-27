/* src/components/admin/KpiCard.tsx */
import React from 'react';

interface KpiCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  badgeType?: 'positive' | 'neutral' | 'negative';
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  value,
  label,
  badge,
  badgeType = 'positive',
  loading = false,
}) => {
  return (
    <div className="premium-kpi-card">
      <div className="kpi-card-header">
        <div className="kpi-icon-container">
          {icon}
        </div>
        {badge && !loading && (
          <span className={`kpi-trend-badge ${badgeType}`}>
            {badge}
          </span>
        )}
      </div>
      
      <div className="kpi-card-body">
        {loading ? (
          <div className="kpi-skeleton-value" />
        ) : (
          <h3 className="kpi-value">{value}</h3>
        )}
        <p className="kpi-label">{label}</p>
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          box-sizing: border-box;
          position: relative;
          font-family: 'Manrope', sans-serif;
          text-align: left;
        }

        .premium-kpi-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-kpi-card .kpi-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .premium-kpi-card .kpi-icon-container {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background-color: rgba(99, 102, 241, 0.07);
          color: #4F46E5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .premium-kpi-card:hover .kpi-icon-container {
          background-color: rgba(99, 102, 241, 0.12);
          transform: scale(1.03);
        }

        .premium-kpi-card .kpi-trend-badge {
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
          padding: 3px 9px;
          line-height: 1;
          box-sizing: border-box;
          border: 1px solid transparent;
          letter-spacing: -0.015em;
        }

        .premium-kpi-card .kpi-trend-badge.positive {
          color: #16A34A;
          background-color: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.15);
        }

        .premium-kpi-card .kpi-trend-badge.neutral {
          color: #4F46E5;
          background-color: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.15);
        }

        .premium-kpi-card .kpi-trend-badge.negative {
          color: #DC2626;
          background-color: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .premium-kpi-card .kpi-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .premium-kpi-card .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .premium-kpi-card .kpi-label {
          font-size: 13.5px;
          font-weight: 550;
          color: #64748B;
          margin: 0;
          line-height: 1.3;
        }

        .premium-kpi-card .kpi-skeleton-value {
          width: 80px;
          height: 28px;
          border-radius: 6px;
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
