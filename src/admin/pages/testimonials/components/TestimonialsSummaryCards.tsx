/* src/admin/pages/testimonials/components/TestimonialsSummaryCards.tsx */
import React from 'react';
import { KpiCard } from '../../../../components/admin/KpiCard';

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

export const TestimonialsSummaryCards: React.FC<TestimonialsSummaryCardsProps> = ({
  summary,
  loading = false,
}) => {
  return (
    <div className="stats-grid">
      <KpiCard
        label="Total Testimonials"
        value={summary.total}
        badge={summary.trends.total}
        badgeType="positive"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
      />
      
      <KpiCard
        label="Pending Review"
        value={summary.pending}
        badge={summary.trends.pending}
        badgeType="neutral"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />

      <KpiCard
        label="Approved"
        value={summary.approved}
        badge={summary.trends.approved}
        badgeType="positive"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      />

      <KpiCard
        label="Rejected"
        value={summary.rejected}
        badge={summary.trends.rejected}
        badgeType="negative"
        loading={loading}
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
