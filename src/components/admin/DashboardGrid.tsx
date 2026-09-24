/* src/components/admin/DashboardGrid.tsx */
import React, { useEffect, useState, useCallback } from 'react';
import { DashboardBanner } from './DashboardBanner';
import { KpiCard } from './KpiCard';
import { ContentPublishingCard } from './ContentPublishingCard';
import { EdithInsights } from './EdithInsights';
import { SystemMonitor } from './SystemMonitor';
import { useContactMessages } from '../../hooks/useContactMessages';
import { analyticsService } from '../../admin/services/analyticsService';
import { testimonialService } from '../../admin/services/testimonialService';
import { resumeDownloadService } from '../../admin/services/resumeDownloadService';
import { projectService } from '../../admin/services/projectService';
import { toolsProductsService } from '../../admin/services/toolsProductsService';

export const DashboardGrid: React.FC = () => {
  // 1. Contact Messages (existing hook)
  const { totalCount: contactsCount, loading: contactsLoading, fetchTotalCount } = useContactMessages();

  // 2. Analytics Summary (Total Visitors & Contact Trend)
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [visitorsTrend, setVisitorsTrend] = useState<string>('+0.0%');
  const [contactsTrend, setContactsTrend] = useState<string>('+0.0%');

  // 3. Testimonials (Approved count)
  const [testimonialsLoading, setTestimonialsLoading] = useState<boolean>(true);
  const [approvedTestimonialsCount, setApprovedTestimonialsCount] = useState<number>(0);

  // 4. Resume Downloads
  const [resumeLoading, setResumeLoading] = useState<boolean>(true);
  const [resumeDownloadsCount, setResumeDownloadsCount] = useState<number>(0);
  const [resumeTrend, setResumeTrend] = useState<string>('+0.0%');

  // 5. Projects & Tools (Published count of Projects + Tools/Products)
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [toolsLoading, setToolsLoading] = useState<boolean>(true);
  const [publishedProjectsCount, setPublishedProjectsCount] = useState<number>(0);
  const [toolsCount, setToolsCount] = useState<number>(0);

  // 6. Live Visitors
  const [liveLoading, setLiveLoading] = useState<boolean>(true);
  const [liveVisitorsCount, setLiveVisitorsCount] = useState<number>(0);

  const fetchKpiData = useCallback(async () => {
    // 1. Contact Messages count
    fetchTotalCount();

    // 2. Total Visitors & Trends
    setAnalyticsLoading(true);
    analyticsService.getSummary('30days')
      .then((summary) => {
        if (summary) {
          setTotalVisitors(summary.totalVisitors || 0);
          if (summary.trends) {
            setVisitorsTrend(summary.trends.totalVisitors || '+0.0%');
            setContactsTrend(summary.trends.formSubmissions || '+0.0%');
          }
        }
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching analytics summary:', err);
      })
      .finally(() => {
        setAnalyticsLoading(false);
      });

    // 3. Approved Testimonials
    setTestimonialsLoading(true);
    testimonialService.getSummary()
      .then((summary) => {
        if (summary) {
          setApprovedTestimonialsCount(summary.approved || 0);
        }
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching testimonial summary:', err);
      })
      .finally(() => {
        setTestimonialsLoading(false);
      });

    // 4. Resume Downloads
    setResumeLoading(true);
    resumeDownloadService.getSummary()
      .then((res) => {
        if (res) {
          setResumeDownloadsCount(res.totalCount || 0);
          setResumeTrend(res.trend || '+0.0%');
        }
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching resume downloads summary:', err);
      })
      .finally(() => {
        setResumeLoading(false);
      });

    // 5a. Published Projects
    setProjectsLoading(true);
    projectService.getProjects()
      .then((projects) => {
        if (projects && Array.isArray(projects)) {
          const published = projects.filter(p => p.status === 'published');
          setPublishedProjectsCount(published.length);
        }
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching projects:', err);
      })
      .finally(() => {
        setProjectsLoading(false);
      });

    // 5b. Published Tools & Custom Products
    setToolsLoading(true);
    toolsProductsService.getToolsProducts()
      .then((tools) => {
        if (tools && Array.isArray(tools)) {
          const publishedTools = tools.filter(t => t.status === 'published' || !t.status);
          setToolsCount(publishedTools.length);
        }
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching tools & products:', err);
      })
      .finally(() => {
        setToolsLoading(false);
      });

    // 6. Live Visitors
    setLiveLoading(true);
    analyticsService.getLiveVisitorsCount()
      .then((count) => {
        setLiveVisitorsCount(count || 0);
      })
      .catch((err) => {
        console.warn('[DashboardGrid] Error fetching live visitors count:', err);
      })
      .finally(() => {
        setLiveLoading(false);
      });
  }, [fetchTotalCount]);

  useEffect(() => {
    fetchKpiData();
  }, [fetchKpiData]);

  return (
    <div className="dashboard-grid-container">
      {/* Statistics Cards List (5 KPI Cards) */}
      <div className="stats-grid">
        <KpiCard
          label="Visitors"
          value={totalVisitors.toLocaleString()}
          showTrend={true}
          trend={visitorsTrend || '-2.5%'}
          trendPeriod="vs last week"
          colorScheme="indigo"
          loading={analyticsLoading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        
        <KpiCard
          label="Messages"
          value={contactsCount.toLocaleString()}
          colorScheme="violet"
          loading={contactsLoading || analyticsLoading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
        
        <KpiCard
          label="Testimonials"
          value={approvedTestimonialsCount.toLocaleString()}
          colorScheme="amber"
          loading={testimonialsLoading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        
        <KpiCard
          label="Downloads"
          value={resumeDownloadsCount.toLocaleString()}
          colorScheme="cyan"
          loading={resumeLoading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          }
        />
        
        <KpiCard
          label="Projects & Tools"
          value={(publishedProjectsCount + toolsCount).toLocaleString()}
          badge="Active"
          badgeType="neutral"
          colorScheme="pink"
          loading={projectsLoading || toolsLoading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
      </div>

      {/* 3. System Monitor full-width workspace */}
      <div className="dashboard-grid-row">
        <SystemMonitor />
      </div>

      {/* 4. Edith Insights & Content & Publishing Card row */}
      <div className="dashboard-grid-row two-cols equal">
        <EdithInsights />
        <ContentPublishingCard />
      </div>
    </div>
  );
};

export default DashboardGrid;
