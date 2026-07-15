import React, { useEffect } from 'react';
import { DashboardBanner } from './DashboardBanner';
import { StatisticCard } from './StatisticCard';
import { AnalyticsCard } from './AnalyticsCard';
import { ActivityCard } from './ActivityCard';
import { MessageCard } from './MessageCard';
import { TestimonialCard } from './TestimonialCard';
import { useContactMessages } from '../../hooks/useContactMessages';

export const DashboardGrid: React.FC = () => {
  const { totalCount, loading, fetchTotalCount } = useContactMessages();

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  return (
    <div className="dashboard-grid-container">
      {/* 2. Statistics Cards List */}
      <div className="stats-grid">
        <StatisticCard
          label="Total Visitors"
          value="24,819"
          growth="+12%"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatisticCard
          label="Contact Messages"
          value={totalCount}
          growth="+8%"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
        <StatisticCard
          label="Testimonials"
          value="92"
          growth="+4%"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        <StatisticCard
          label="Resume Downloads"
          value="1,204"
          growth="+18%"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          }
        />
        <StatisticCard
          label="Projects"
          value="18"
          growth="Active"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        <StatisticCard
          label="Live Visitors"
          value="7"
          growth="+40%"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />
      </div>

      {/* 3. Analytics Card & Recent Activity row */}
      <div className="dashboard-grid-row two-cols">
        <AnalyticsCard />
        <ActivityCard />
      </div>

      {/* 4. Messages Card & Testimonials Card row */}
      <div className="dashboard-grid-row two-cols equal">
        <MessageCard />
        <TestimonialCard />
      </div>
    </div>
  );
};

export default DashboardGrid;
