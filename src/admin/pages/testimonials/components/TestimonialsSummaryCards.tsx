/* src/admin/pages/testimonials/components/TestimonialsSummaryCards.tsx */
import React from 'react';

interface SummaryData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  trends: {
    total: string;
    pending: string;
    approved: string;
    rejected: string;
  };
}

interface TestimonialsSummaryCardsProps {
  summary: SummaryData;
  loading?: boolean;
}

interface TestimonialKpiCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  accent: 'blue' | 'amber' | 'green' | 'red';
  loading?: boolean;
}

const TestimonialKpiCard: React.FC<TestimonialKpiCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  accent,
  loading = false,
}) => {
  // Map accent to styles for icons and helper texts
  const accentStyles = {
    blue: {
      bg: 'rgba(37, 99, 235, 0.07)',
      color: '#2563EB',
      sub: '#2563EB',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.08)',
      color: '#D97706',
      sub: '#B45309',
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.08)',
      color: '#16A34A',
      sub: '#15803D',
    },
    red: {
      bg: 'rgba(239, 68, 68, 0.08)',
      color: '#DC2626',
      sub: '#B91C1C',
    },
  }[accent];

  return (
    <div className={`testimonial-kpi-card accent-${accent}`}>
      <div className="card-header">
        <span className="card-title">{label}</span>
        <div className="card-icon-container" style={{ backgroundColor: accentStyles.bg, color: accentStyles.color }}>
          {icon}
        </div>
      </div>
      
      <div className="card-body">
        {loading ? (
          <div className="card-skeleton-value" />
        ) : (
          <span className="card-value">{value}</span>
        )}
        <span className="card-subtitle" style={{ color: accentStyles.sub }}>{subtitle}</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .testimonial-kpi-card {
          background: #FFFFFF;
          border: 1px solid var(--admin-border, #E5E7EB);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 220ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
          box-sizing: border-box;
          position: relative;
          font-family: 'Inter', sans-serif;
          text-align: left;
        }

        .testimonial-kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.15);
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.06);
        }

        .testimonial-kpi-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .testimonial-kpi-card .card-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--admin-text-secondary, #64748B);
          margin: 0;
          line-height: 1.2;
        }

        .testimonial-kpi-card .card-icon-container {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .testimonial-kpi-card:hover .card-icon-container {
          transform: scale(1.04);
        }

        .testimonial-kpi-card .card-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }

        .testimonial-kpi-card .card-value {
          font-size: 30px;
          font-weight: 700;
          color: var(--admin-text, #0F172A);
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .testimonial-kpi-card .card-subtitle {
          font-size: 12px;
          font-weight: 500;
          margin: 0;
          line-height: 1.2;
        }

        .testimonial-kpi-card .card-skeleton-value {
          width: 70px;
          height: 33px;
          border-radius: 6px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: cardSkeletonPulse 1.5s infinite;
          margin-bottom: 2px;
        }

        @keyframes cardSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  );
};

export const TestimonialsSummaryCards: React.FC<TestimonialsSummaryCardsProps> = ({
  summary,
  loading = false,
}) => {
  return (
    <div className="stats-grid">
      <TestimonialKpiCard
        label="Total Testimonials"
        value={summary.total}
        subtitle={`${(summary.trends && summary.trends.total) || '+3'} This Week`}
        accent="blue"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
      />
      
      <TestimonialKpiCard
        label="Pending Review"
        value={summary.pending}
        subtitle="Needs Attention"
        accent="amber"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />

      <TestimonialKpiCard
        label="Approved"
        value={summary.approved}
        subtitle="Visible on Portfolio"
        accent="green"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      />

      <TestimonialKpiCard
        label="Rejected"
        value={summary.rejected}
        subtitle="Hidden from Portfolio"
        accent="red"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        }
      />
    </div>
  );
};

export default TestimonialsSummaryCards;

