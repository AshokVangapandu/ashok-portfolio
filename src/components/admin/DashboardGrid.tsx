/* src/components/admin/DashboardGrid.tsx */
import React, { useEffect } from 'react';
import { DashboardBanner } from './DashboardBanner';
import { KpiCard } from './KpiCard';
import { ContentPublishingCard } from './ContentPublishingCard';
import { ActivityCard } from './ActivityCard';
import { EdithInsights } from './EdithInsights';
import { SystemMonitor } from './SystemMonitor';
import { useContactMessages } from '../../hooks/useContactMessages';

export const DashboardGrid: React.FC = () => {
  const { totalCount, loading, fetchTotalCount } = useContactMessages();

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  return (
    <div className="dashboard-grid-container">
      {/* Statistics Cards List */}
      <div className="stats-grid">
        <KpiCard
          label="Total Visitors"
          value="24,819"
          badge="+12%"
          badgeType="positive"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        
        <KpiCard
          label="Contact Messages"
          value={totalCount}
          badge="+8%"
          badgeType="positive"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
        
        <KpiCard
          label="Testimonials"
          value="92"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        
        <KpiCard
          label="Resume Downloads"
          value="1,204"
          badge="+18%"
          badgeType="positive"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          }
        />
        
        <KpiCard
          label="Projects"
          value="18"
          badge="Active"
          badgeType="neutral"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        
        <KpiCard
          label="Live Visitors"
          value="7"
          badge="+40%"
          badgeType="positive"
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
      </div>

      {/* 3. Content & Publishing Card & Recent Activity row */}
      <div className="dashboard-grid-row two-cols">
        <ContentPublishingCard />
        <ActivityCard />
      </div>

      {/* 4. Edith Insights & System Monitor Card row */}
      <div className="dashboard-grid-row two-cols equal">
        <EdithInsights />
        <SystemMonitor />
      </div>
    </div>
  );
};

export default DashboardGrid;
