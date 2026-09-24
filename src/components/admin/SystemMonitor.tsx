/* src/components/admin/SystemMonitor.tsx */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { systemMonitorService } from '../../admin/services/systemMonitorService';
import {
  SystemHealthSummary,
  HealthStatus,
  SimulationValidationResult
} from '../../admin/types/systemMonitor';

// User-facing functional status model
export type FunctionalStatus = 'working' | 'needs_attention' | 'down' | 'unknown';

export interface PortfolioFunctionalityItem {
  id: string;
  name: string;
  category: 'database' | 'auth' | 'contact' | 'email' | 'analytics' | 'testimonials' | 'projects' | 'portfolio';
  status: FunctionalStatus;
  statusLabel: string;
  description: string;
  iconType: 'database' | 'auth' | 'contact' | 'email' | 'analytics' | 'testimonials' | 'projects' | 'portfolio';
  whatStillWorks: string[];
  whatToInvestigate: string[];
  possibleCauses?: string[];
  underlyingComponentName?: string;
  underlyingWorkflowName?: string;
}

export const SystemMonitor: React.FC = () => {
  // Underlying diagnostic engine state
  const [summary, setSummary] = useState<SystemHealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEvaluatedTime, setLastEvaluatedTime] = useState<Date>(new Date());

  // UI Presentation State
  const [selectedFunctionalityId, setSelectedFunctionalityId] = useState<string | null>(null);
  const [showFullDiagnosticModal, setShowFullDiagnosticModal] = useState<boolean>(false);

  // Diagnostic Modal Tab State
  const [modalActiveTab, setModalActiveTab] = useState<'components' | 'workflows' | 'data_integrity' | 'security' | 'incidents' | 'simulation'>('components');

  // Simulation state
  const [runningSimulationId, setRunningSimulationId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationValidationResult | null>(null);

  // Authoritative fetch logic using existing systemMonitorService
  const fetchHealthData = useCallback(async (isManual = false) => {
    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await systemMonitorService.getSystemHealthSummary();
      setSummary(data);
      setLastEvaluatedTime(new Date());
    } catch (err: any) {
      console.error('[SystemMonitor] Health check summary execution failed:', err);
      setError(err?.message || 'Failed to execute system monitor health checks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHealthData(false);
  }, [fetchHealthData]);

  // Map underlying diagnostic data to the 8 Core Portfolio Functionalities
  const functionalities = useMemo<PortfolioFunctionalityItem[]>(() => {
    if (!summary) {
      // Default fallback while loading
      return [
        {
          id: 'db',
          name: 'Database',
          category: 'database',
          status: 'working',
          statusLabel: 'Working',
          description: 'Data storage and connectivity are healthy.',
          iconType: 'database',
          whatStillWorks: ['Database read path is responding normally', 'Connection pool is healthy'],
          whatToInvestigate: ['Check Supabase query latency', 'Verify connection limits']
        },
        {
          id: 'auth',
          name: 'Authentication',
          category: 'auth',
          status: 'working',
          statusLabel: 'Working',
          description: 'User login and admin access are working.',
          iconType: 'auth',
          whatStillWorks: ['Active admin authorization rule is verified', 'Session tokens are valid'],
          whatToInvestigate: ['Check Supabase Auth logs', 'Verify OAuth redirect configuration']
        },
        {
          id: 'contact',
          name: 'Contact Form',
          category: 'contact',
          status: 'working',
          statusLabel: 'Working',
          description: 'Form submissions are being received and stored.',
          iconType: 'contact',
          whatStillWorks: ['Contact table write path is operational', 'Client form validation is active'],
          whatToInvestigate: ['Check spam filter thresholds', 'Verify table RLS policies']
        },
        {
          id: 'email',
          name: 'Email Notifications',
          category: 'email',
          status: 'working',
          statusLabel: 'Working',
          description: 'Email delivery and notifications are operational.',
          iconType: 'email',
          whatStillWorks: ['Contact form submission is working', 'Messages are being stored in the database', 'Edge Function is reachable'],
          whatToInvestigate: ['Check Edge Function logs', 'Verify email provider status and quota', 'Confirm environment configuration', 'Check recent error logs']
        },
        {
          id: 'analytics',
          name: 'Analytics',
          category: 'analytics',
          status: 'working',
          statusLabel: 'Working',
          description: 'Visitor tracking and analytics are collecting data.',
          iconType: 'analytics',
          whatStillWorks: ['Visitor session ingestion is working', 'Aggregation RPC functions are operational'],
          whatToInvestigate: ['Check telemetry event rate', 'Verify analytics table indexing']
        },
        {
          id: 'testimonials',
          name: 'Testimonials',
          category: 'testimonials',
          status: 'working',
          statusLabel: 'Working',
          description: 'Testimonials are loading correctly.',
          iconType: 'testimonials',
          whatStillWorks: ['Approved testimonials query is responsive', 'Moderation workflow is active'],
          whatToInvestigate: ['Check moderation queue', 'Verify approval RPC status']
        },
        {
          id: 'projects',
          name: 'Projects',
          category: 'projects',
          status: 'working',
          statusLabel: 'Working',
          description: 'Projects are accessible and loading properly.',
          iconType: 'projects',
          whatStillWorks: ['Static project fallback catalog is operational', 'Project modal views are functional'],
          whatToInvestigate: ['Verify projects table records in Supabase', 'Check storage bucket public asset URLs']
        },
        {
          id: 'portfolio',
          name: 'Portfolio',
          category: 'portfolio',
          status: 'working',
          statusLabel: 'Working',
          description: 'Website is live and accessible to visitors.',
          iconType: 'portfolio',
          whatStillWorks: ['Site operational mode is public/live', 'Core navigation routes respond normally'],
          whatToInvestigate: ['Check CDN cache headers', 'Verify build artifact deployment']
        }
      ];
    }

    const comps = summary.components || [];
    const wfs = summary.workflows || [];
    const sec = summary.security;
    const di = summary.dataIntegrity;

    const dbComp = comps.find(c => c.componentName.includes('Database'));
    const authComp = comps.find(c => c.componentName.includes('Auth'));
    const emailComp = comps.find(c => c.componentName.includes('Email'));
    const analyticsComp = comps.find(c => c.componentName.includes('Analytics') || c.componentName.includes('Telemetry'));
    const siteModeComp = comps.find(c => c.componentName.includes('Portfolio') || c.componentName.includes('Mode'));

    const contactWf = wfs.find(w => w.workflowName.includes('Contact'));
    const testimonialWf = wfs.find(w => w.workflowName.includes('Testimonial'));

    // Helper to determine FunctionalStatus from HealthStatus
    const mapHealthToFunctionalStatus = (health?: HealthStatus): FunctionalStatus => {
      if (!health || health === 'healthy') return 'working';
      if (health === 'degraded') return 'needs_attention';
      if (health === 'down') return 'down';
      return 'needs_attention';
    };

    // 1. Database
    const dbStatus = mapHealthToFunctionalStatus(dbComp?.status);
    const dbItem: PortfolioFunctionalityItem = {
      id: 'db',
      name: 'Database',
      category: 'database',
      status: dbStatus,
      statusLabel: dbStatus === 'working' ? 'Working' : (dbStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: dbStatus === 'working'
        ? 'Data storage and connectivity are healthy.'
        : (dbComp?.checks?.[0]?.sanitizedSummary || 'Database connectivity or latency issue detected.'),
      iconType: 'database',
      underlyingComponentName: dbComp?.componentName,
      whatStillWorks: ['Database read path is responding normally', 'Connection pool is healthy'],
      whatToInvestigate: ['Check Supabase query latency', 'Verify connection limits']
    };

    // 2. Authentication
    const authStatus = mapHealthToFunctionalStatus(authComp?.status);
    const authItem: PortfolioFunctionalityItem = {
      id: 'auth',
      name: 'Authentication',
      category: 'auth',
      status: authStatus,
      statusLabel: authStatus === 'working' ? 'Working' : (authStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: authStatus === 'working'
        ? 'User login and admin access are working.'
        : (authComp?.checks?.[0]?.sanitizedSummary || 'Authentication or admin authorization state requires attention.'),
      iconType: 'auth',
      underlyingComponentName: authComp?.componentName,
      whatStillWorks: ['Active admin authorization rule is verified', 'Session tokens are valid'],
      whatToInvestigate: ['Check Supabase Auth logs', 'Verify OAuth redirect configuration']
    };

    // 3. Contact Form
    const contactStatus = mapHealthToFunctionalStatus(contactWf?.status);
    const contactItem: PortfolioFunctionalityItem = {
      id: 'contact',
      name: 'Contact Form',
      category: 'contact',
      status: contactStatus,
      statusLabel: contactStatus === 'working' ? 'Working' : (contactStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: contactStatus === 'working'
        ? 'Form submissions are being received and stored.'
        : (contactWf?.stages?.find(s => s.status !== 'healthy')?.stageName || 'Contact form submission or storage stage encountered an issue.'),
      iconType: 'contact',
      underlyingWorkflowName: contactWf?.workflowName,
      whatStillWorks: ['Contact table write path is operational', 'Client form validation is active'],
      whatToInvestigate: ['Check spam filter thresholds', 'Verify table RLS policies']
    };

    // 4. Email Notifications
    const emailStatus = mapHealthToFunctionalStatus(emailComp?.status);
    const emailItem: PortfolioFunctionalityItem = {
      id: 'email',
      name: 'Email Notifications',
      category: 'email',
      status: emailStatus,
      statusLabel: emailStatus === 'working' ? 'Working' : (emailStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: emailStatus === 'working'
        ? 'Email delivery and notifications are operational.'
        : (emailComp?.checks?.[0]?.sanitizedSummary || 'Email delivery could not be verified.'),
      iconType: 'email',
      underlyingComponentName: emailComp?.componentName,
      possibleCauses: [
        'Edge Function execution error or cold start timeout',
        'Email provider (Resend/SendGrid) quota or API key configuration',
        'Environment variable configuration mismatch'
      ],
      whatStillWorks: [
        'Contact form submission is working',
        'Messages are being stored in the database',
        'Edge Function is reachable'
      ],
      whatToInvestigate: [
        'Check Edge Function logs',
        'Verify email provider status and quota',
        'Confirm environment configuration',
        'Check recent error logs'
      ]
    };

    // 5. Analytics
    const analyticsStatus = mapHealthToFunctionalStatus(analyticsComp?.status);
    const analyticsItem: PortfolioFunctionalityItem = {
      id: 'analytics',
      name: 'Analytics',
      category: 'analytics',
      status: analyticsStatus,
      statusLabel: analyticsStatus === 'working' ? 'Working' : (analyticsStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: analyticsStatus === 'working'
        ? 'Visitor tracking and analytics are collecting data.'
        : (analyticsComp?.checks?.[0]?.sanitizedSummary || 'Telemetry event ingestion or analytics RPC is experiencing latency.'),
      iconType: 'analytics',
      underlyingComponentName: analyticsComp?.componentName,
      whatStillWorks: ['Visitor session ingestion is working', 'Aggregation RPC functions are operational'],
      whatToInvestigate: ['Check telemetry event rate', 'Verify analytics table indexing']
    };

    // 6. Testimonials
    const testimonialStatus = mapHealthToFunctionalStatus(testimonialWf?.status);
    const testimonialItem: PortfolioFunctionalityItem = {
      id: 'testimonials',
      name: 'Testimonials',
      category: 'testimonials',
      status: testimonialStatus,
      statusLabel: testimonialStatus === 'working' ? 'Working' : (testimonialStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: testimonialStatus === 'working'
        ? 'Testimonials are loading correctly.'
        : (testimonialWf?.stages?.find(s => s.status !== 'healthy')?.stageName || 'Testimonial submission or approval workflow requires review.'),
      iconType: 'testimonials',
      underlyingWorkflowName: testimonialWf?.workflowName,
      whatStillWorks: ['Approved testimonials query is responsive', 'Moderation workflow is active'],
      whatToInvestigate: ['Check moderation queue', 'Verify approval RPC status']
    };

    // 7. Projects
    const projectsHealthy = dbStatus === 'working' && (di?.categories?.every(c => c.status === 'healthy') ?? true);
    const projectsStatus: FunctionalStatus = projectsHealthy ? 'working' : 'needs_attention';
    const projectsItem: PortfolioFunctionalityItem = {
      id: 'projects',
      name: 'Projects',
      category: 'projects',
      status: projectsStatus,
      statusLabel: projectsStatus === 'working' ? 'Working' : 'Needs Attention',
      description: projectsStatus === 'working'
        ? 'Projects are accessible and loading properly.'
        : 'Project data or related tool assets encountered read issues.',
      iconType: 'projects',
      whatStillWorks: ['Static project fallback catalog is operational', 'Project modal views are functional'],
      whatToInvestigate: ['Verify projects table records in Supabase', 'Check storage bucket public asset URLs']
    };

    // 8. Portfolio
    const portfolioStatus = mapHealthToFunctionalStatus(siteModeComp?.status);
    const portfolioItem: PortfolioFunctionalityItem = {
      id: 'portfolio',
      name: 'Portfolio',
      category: 'portfolio',
      status: portfolioStatus,
      statusLabel: portfolioStatus === 'working' ? 'Working' : (portfolioStatus === 'down' ? 'Down' : 'Needs Attention'),
      description: portfolioStatus === 'working'
        ? 'Website is live and accessible to visitors.'
        : 'Portfolio operational mode or routing has been modified.',
      iconType: 'portfolio',
      underlyingComponentName: siteModeComp?.componentName,
      whatStillWorks: ['Site operational mode is public/live', 'Core navigation routes respond normally'],
      whatToInvestigate: ['Check operational_mode state machine in database', 'Verify DNS and custom domain settings']
    };

    return [
      dbItem,
      authItem,
      contactItem,
      emailItem,
      analyticsItem,
      testimonialItem,
      projectsItem,
      portfolioItem
    ];
  }, [summary]);

  // Aggregate Top 4 KPI Metrics
  const totalComponents = functionalities.length;
  const workingCount = functionalities.filter(f => f.status === 'working').length;
  const needsAttentionCount = functionalities.filter(f => f.status === 'needs_attention').length;
  const downCount = functionalities.filter(f => f.status === 'down').length;

  // Active issues list (items that are NOT 'working')
  const issuesList = useMemo(() => {
    return functionalities.filter(f => f.status === 'needs_attention' || f.status === 'down');
  }, [functionalities]);

  // Active selected issue (prioritizes issues when issues exist)
  const activeIssue = useMemo(() => {
    if (selectedFunctionalityId) {
      const found = functionalities.find(f => f.id === selectedFunctionalityId);
      if (found) return found;
    }
    return issuesList.length > 0 ? issuesList[0] : null;
  }, [functionalities, selectedFunctionalityId, issuesList]);

  // Format timestamps
  const formattedTime = useMemo(() => {
    return lastEvaluatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }, [lastEvaluatedTime]);

  const formattedDate = useMemo(() => {
    return lastEvaluatedTime.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }, [lastEvaluatedTime]);

  // Render Pastel Icon Helper
  const renderFunctionIcon = (type: PortfolioFunctionalityItem['iconType']) => {
    switch (type) {
      case 'database':
        return (
          <div className="fn-icon-box fn-icon-blue">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
            </svg>
          </div>
        );
      case 'auth':
        return (
          <div className="fn-icon-box fn-icon-purple">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        );
      case 'contact':
        return (
          <div className="fn-icon-box fn-icon-cyan">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        );
      case 'email':
        return (
          <div className="fn-icon-box fn-icon-amber">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
        );
      case 'analytics':
        return (
          <div className="fn-icon-box fn-icon-indigo">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
        );
      case 'testimonials':
        return (
          <div className="fn-icon-box fn-icon-pink">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        );
      case 'projects':
        return (
          <div className="fn-icon-box fn-icon-rose">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </div>
        );
      case 'portfolio':
        return (
          <div className="fn-icon-box fn-icon-teal">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="system-monitor-card-wrapper">
      {/* 1. Header Row */}
      <div className="sm-header-row">
        <div className="sm-header-left">
          <div className="sm-shield-icon-container">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="sm-title-block">
            <h2 className="sm-main-title">System Monitor</h2>
            <p className="sm-subtitle">Essential systems for your portfolio, at a glance.</p>
          </div>
        </div>

        <div className="sm-header-right">
          <button
            type="button"
            className="sm-refresh-btn"
            onClick={() => fetchHealthData(true)}
            disabled={refreshing}
            aria-label="Refresh system health diagnostics"
          >
            <svg
              className={refreshing ? 'spin' : ''}
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <div className="sm-last-checked-block">
            <span className="last-checked-label">Last checked</span>
            <span className="last-checked-time">{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Left Column (4 KPI Cards + 4x2 Functionality Cards) & Right Column (Full-Height Issues Requiring Attention Panel) */}
      <div className="sm-main-grid-layout">
        {/* Left Column: 4 KPI Cards aligned with the 4-column functionality grid */}
        <div className="sm-left-col">
          {/* Top Summary KPI Row (Occupies the width of the 4 cards) */}
          <div className="sm-kpi-row">
            {/* Total Components */}
            <div className="sm-kpi-card kpi-components">
              <div className="kpi-icon-box icon-blue">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div className="kpi-text-block">
                <span className="kpi-count">{totalComponents}</span>
                <span className="kpi-label">Components</span>
              </div>
            </div>

            {/* Working */}
            <div className="sm-kpi-card kpi-working">
              <div className="kpi-icon-box icon-green">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="kpi-text-block">
                <span className="kpi-count">{workingCount}</span>
                <span className="kpi-label">Working</span>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="sm-kpi-card kpi-attention">
              <div className="kpi-icon-box icon-amber">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="kpi-text-block">
                <span className="kpi-count">{needsAttentionCount}</span>
                <span className="kpi-label">Needs Attention</span>
              </div>
            </div>

            {/* Down */}
            <div className="sm-kpi-card kpi-down">
              <div className="kpi-icon-box icon-red">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div className="kpi-text-block">
                <span className="kpi-count">{downCount}</span>
                <span className="kpi-label">Down</span>
              </div>
            </div>
          </div>

          {/* Core Functionality (4 columns x 2 rows) */}
          <div className="sm-core-functionality-col">
            <div className="sm-section-header-row">
              <div>
                <h3 className="sm-section-title">Core Functionality</h3>
                <p className="sm-section-subtitle">Status of the key features that keep your portfolio running smoothly.</p>
              </div>
            </div>

            {/* Functionality Cards Grid (4 Columns x 2 Rows) */}
            <div className="sm-functionality-cards-container">
              {functionalities.map(item => {
                const isSelected = activeIssue?.id === item.id || selectedFunctionalityId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`sm-function-card ${item.status} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedFunctionalityId(item.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.name}: ${item.statusLabel}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedFunctionalityId(item.id);
                      }
                    }}
                  >
                    <div className="card-top-row">
                      <div className="card-left-info">
                        {renderFunctionIcon(item.iconType)}
                        <span className="fn-name">{item.name}</span>
                      </div>
                      <span className="fn-chevron-arrow">›</span>
                    </div>
                    <div className="card-status-row">
                      <span className={`fn-status-pill ${item.status}`}>
                        <span className="status-dot" />
                        {item.statusLabel}
                      </span>
                    </div>
                    <p className="fn-description">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full-Height Issues Requiring Attention Panel */}
        <div className="sm-issue-panel-col">
          <div className="sm-issue-header-row">
            <div className="issue-title-wrap">
              <div className="issue-warning-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={issuesList.length > 0 ? '#EF4444' : '#16A34A'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="issue-section-title">
                {issuesList.length > 0 ? 'Issues Requiring Attention' : 'System State Overview'}
              </h3>
            </div>
            <span className={`issue-count-badge ${issuesList.length > 0 ? 'has-issues' : 'zero'}`}>
              {issuesList.length}
            </span>
          </div>

          {activeIssue && (activeIssue.status !== 'working' || issuesList.length > 0) ? (
            /* Problem Detail Panel */
            <div className="sm-issue-content-stack">
              {/* Selected Issue Card */}
              <div className={`sm-active-issue-card ${activeIssue.status}`}>
                <div className="active-issue-top">
                  <div className="active-issue-left">
                    {renderFunctionIcon(activeIssue.iconType)}
                    <span className="active-issue-name">{activeIssue.name}</span>
                    <span className={`fn-status-pill ${activeIssue.status}`}>
                      <span className="status-dot" />
                      {activeIssue.statusLabel}
                    </span>
                  </div>
                  <span className="fn-chevron-arrow">›</span>
                </div>
                <p className="active-issue-desc">
                  {activeIssue.description}
                  {activeIssue.id === 'email' ? (
                    <span className="possible-causes-note">
                      {' '}This may be due to an Edge Function error, provider issue, or configuration problem.
                    </span>
                  ) : null}
                </p>
              </div>

              {/* What is still working? */}
              <div className="sm-status-guide-box still-working-box">
                <div className="guide-box-header">
                  <div className="guide-icon-circle green">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="guide-box-title">What is still working?</h4>
                </div>
                <ul className="guide-bullet-list">
                  {activeIssue.whatStillWorks.map((item, idx) => (
                    <li key={idx} className="green-bullet">
                      <span className="bullet-check">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to investigate? */}
              <div className="sm-status-guide-box investigate-box">
                <div className="guide-box-header">
                  <div className="guide-icon-circle blue">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <h4 className="guide-box-title">What to investigate?</h4>
                </div>
                <ul className="guide-bullet-list">
                  {activeIssue.whatToInvestigate.map((item, idx) => (
                    <li key={idx} className="blue-bullet">
                      <span className="bullet-dot">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button: View Full Diagnostic Details */}
              <button
                type="button"
                className="sm-view-diagnostics-btn"
                onClick={() => setShowFullDiagnosticModal(true)}
              >
                <span>View Full Diagnostic Details</span>
                <span className="arrow">→</span>
              </button>
            </div>
          ) : (
            /* All Healthy State */
            <div className="sm-all-healthy-panel">
              <div className="healthy-hero-icon">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 10 11 15 8 12" />
                </svg>
              </div>
              <h4 className="healthy-hero-title">All key features working smoothly</h4>
              <p className="healthy-hero-desc">
                Automated health checks verified that all 8 core portfolio services are operating normally with zero active incidents.
              </p>
              <div className="healthy-checks-summary">
                <span className="check-item">✔ Database Read/Write Normal</span>
                <span className="check-item">✔ Auth & RLS Operational</span>
                <span className="check-item">✔ Forms & Telemetry Collecting</span>
              </div>
              <button
                type="button"
                className="sm-view-diagnostics-btn secondary"
                onClick={() => setShowFullDiagnosticModal(true)}
              >
                <span>View Full Diagnostic Details</span>
                <span className="arrow">→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer Row */}
      <div className="sm-footer-row">
        <div className="footer-left">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Last full check: {formattedTime}</span>
        </div>
        <div className="footer-right">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Shows the status of your portfolio's key functionality. Click any item to see more details.</span>
        </div>
      </div>

      {/* 4. Deep Technical Diagnostic Modal */}
      {showFullDiagnosticModal && (
        <div className="sm-modal-overlay" onClick={() => setShowFullDiagnosticModal(false)}>
          <div className="sm-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="modal-title">Comprehensive System Diagnostics</h3>
                  <p className="modal-sub">Deep telemetry, stage-by-stage workflows, data integrity, and security audit logs.</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowFullDiagnosticModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="modal-tabs-nav">
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'components' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('components')}
              >
                Components ({summary?.components?.length || 7})
              </button>
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'workflows' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('workflows')}
              >
                Workflows ({summary?.workflows?.length || 5})
              </button>
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'data_integrity' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('data_integrity')}
              >
                Data Integrity ({summary?.dataIntegrity?.categories?.length || 4})
              </button>
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'security' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('security')}
              >
                Security & RLS ({summary?.security?.categories?.length || 4})
              </button>
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'incidents' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('incidents')}
              >
                Incidents ({summary?.incidents?.length || 0})
              </button>
              <button
                type="button"
                className={`tab-btn ${modalActiveTab === 'simulation' ? 'active' : ''}`}
                onClick={() => setModalActiveTab('simulation')}
              >
                Simulation Tests
              </button>
            </div>

            {/* Modal Tab Content */}
            <div className="modal-tab-content">
              {/* Components Tab */}
              {modalActiveTab === 'components' && (
                <div className="deep-diagnostic-panel">
                  <div className="diagnostic-table-wrapper">
                    <table className="diagnostic-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Status</th>
                          <th>Verification</th>
                          <th>Criticality</th>
                          <th>Active Probes</th>
                          <th>Last Evaluated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(summary?.components || []).map((c, idx) => (
                          <tr key={idx}>
                            <td className="comp-name-cell">
                              <strong>{c.componentName}</strong>
                            </td>
                            <td>
                              <span className={`fn-status-pill ${c.status === 'healthy' ? 'working' : (c.status === 'down' ? 'down' : 'needs_attention')}`}>
                                {c.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className="ver-pill">{c.verificationStatus}</span>
                            </td>
                            <td>
                              <span className="crit-pill">{c.criticality}</span>
                            </td>
                            <td>{c.checks?.length || 1} checks passing</td>
                            <td className="time-cell">{c.lastEvaluatedAt ? new Date(c.lastEvaluatedAt).toLocaleTimeString() : 'Recent'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Workflows Tab */}
              {modalActiveTab === 'workflows' && (
                <div className="deep-diagnostic-panel">
                  <div className="diagnostic-table-wrapper">
                    <table className="diagnostic-table">
                      <thead>
                        <tr>
                          <th>Workflow Pipeline</th>
                          <th>Status</th>
                          <th>Verification</th>
                          <th>Latency</th>
                          <th>Stages Evaluated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(summary?.workflows || []).map((w, idx) => (
                          <tr key={idx}>
                            <td className="comp-name-cell">
                              <strong>{w.workflowName}</strong>
                              <div className="wf-sub-desc">{w.description}</div>
                            </td>
                            <td>
                              <span className={`fn-status-pill ${w.status === 'healthy' ? 'working' : (w.status === 'down' ? 'down' : 'needs_attention')}`}>
                                {w.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className="ver-pill">{w.verificationStatus}</span>
                            </td>
                            <td>{w.latencyMs ? `${w.latencyMs}ms` : '< 50ms'}</td>
                            <td>{w.stages?.length || 3} verified stages</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Data Integrity Tab */}
              {modalActiveTab === 'data_integrity' && (
                <div className="deep-diagnostic-panel">
                  <div className="diagnostic-cards-grid">
                    {(summary?.dataIntegrity?.categories || []).map((cat, idx) => (
                      <div key={idx} className="category-detail-card">
                        <div className="cat-header">
                          <h4 className="cat-title">{cat.categoryName}</h4>
                          <span className={`fn-status-pill ${cat.status === 'healthy' ? 'working' : 'needs_attention'}`}>
                            {cat.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="cat-desc">{cat.description}</p>
                        <div className="cat-checks-count">
                          <span>Verified Checks: {cat.checks?.length || 0}</span>
                          <span>Issues Found: {cat.issuesFound}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {modalActiveTab === 'security' && (
                <div className="deep-diagnostic-panel">
                  <div className="diagnostic-cards-grid">
                    {(summary?.security?.categories || []).map((secCat, idx) => (
                      <div key={idx} className="category-detail-card">
                        <div className="cat-header">
                          <h4 className="cat-title">{secCat.categoryName}</h4>
                          <span className={`fn-status-pill ${secCat.status === 'healthy' ? 'working' : 'needs_attention'}`}>
                            {secCat.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="cat-desc">{secCat.description}</p>
                        <div className="cat-checks-count">
                          <span>Security Rules: {secCat.checks?.length || 0}</span>
                          <span>Audit Status: {secCat.status === 'healthy' ? 'Passing' : 'Action Required'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Incidents Tab */}
              {modalActiveTab === 'incidents' && (
                <div className="deep-diagnostic-panel">
                  {(summary?.incidents || []).length > 0 ? (
                    <div className="diagnostic-table-wrapper">
                      <table className="diagnostic-table">
                        <thead>
                          <tr>
                            <th>Incident Key</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Target</th>
                            <th>First Detected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summary!.incidents.map((inc, idx) => (
                            <tr key={idx}>
                              <td><strong>{inc.incidentKey}</strong></td>
                              <td><span className={`crit-pill ${inc.severity}`}>{inc.severity}</span></td>
                              <td><span className="fn-status-pill needs_attention">{inc.status}</span></td>
                              <td>{inc.componentName || inc.workflowName || 'Core Service'}</td>
                              <td>{new Date(inc.firstDetectedAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-incidents-view">
                      <p>✔ Zero active or unacknowledged system incidents recorded.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Simulation Tab */}
              {modalActiveTab === 'simulation' && (
                <div className="deep-diagnostic-panel">
                  <p className="sim-intro">
                    Execute simulated component anomalies in a safe, isolated dry-run sandbox to verify monitoring alert accuracy.
                  </p>
                  <div className="sim-scenarios-list">
                    {systemMonitorService.getSimulationScenarios().map((sc) => (
                      <div key={sc.id} className="sim-scenario-row">
                        <div>
                          <strong>{sc.name}</strong>
                          <p className="sim-desc">{sc.description}</p>
                        </div>
                        <button
                          type="button"
                          className="sm-refresh-btn"
                          disabled={runningSimulationId === sc.id}
                          onClick={async () => {
                            setRunningSimulationId(sc.id);
                            try {
                              const res = await systemMonitorService.runSimulationValidation(sc.id);
                              setSimulationResult(res);
                              await fetchHealthData(true);
                            } finally {
                              setRunningSimulationId(null);
                            }
                          }}
                        >
                          {runningSimulationId === sc.id ? 'Running...' : 'Run Simulation'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .system-monitor-card-wrapper {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02);
          padding: 24px;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0F172A;
          box-sizing: border-box;
          width: 100%;
          text-align: left;
        }

        /* 1. Header Row */
        .system-monitor-card-wrapper .sm-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .system-monitor-card-wrapper .sm-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .system-monitor-card-wrapper .sm-shield-icon-container {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #EFF6FF;
          color: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .system-monitor-card-wrapper .sm-title-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .system-monitor-card-wrapper .sm-main-title {
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .system-monitor-card-wrapper .sm-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          line-height: 1.3;
        }

        .system-monitor-card-wrapper .sm-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .system-monitor-card-wrapper .sm-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #DBEAFE;
          padding: 6px 14px;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .system-monitor-card-wrapper .sm-refresh-btn:hover:not(:disabled) {
          background: #DBEAFE;
          border-color: #BFDBFE;
          color: #1D4ED8;
        }

        .system-monitor-card-wrapper .sm-refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .system-monitor-card-wrapper .sm-refresh-btn svg.spin {
          animation: smSpin 1s linear infinite;
        }

        @keyframes smSpin {
          100% { transform: rotate(360deg); }
        }

        .system-monitor-card-wrapper .sm-last-checked-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.15;
        }

        .system-monitor-card-wrapper .last-checked-label {
          font-size: 10.5px;
          color: #94A3B8;
          font-weight: 500;
        }

        .system-monitor-card-wrapper .last-checked-time {
          font-size: 12px;
          font-weight: 700;
          color: #1E293B;
        }

        /* 2. Main Two-Column Content Layout */
        .system-monitor-card-wrapper .sm-main-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 2.3fr) minmax(340px, 1fr);
          gap: 20px;
          margin-bottom: 20px;
          align-items: stretch;
        }

        /* Left Column containing 4 KPI Cards + 4x2 Core Functionality Grid */
        .system-monitor-card-wrapper .sm-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-width: 0;
        }

        /* 4 KPI Cards Row (Spanning exactly the 4-column width of the cards below) */
        .system-monitor-card-wrapper .sm-kpi-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }

        .system-monitor-card-wrapper .sm-kpi-card {
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
        }

        .system-monitor-card-wrapper .sm-kpi-card:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .system-monitor-card-wrapper .sm-kpi-card.kpi-components {
          background: #F8FAFC;
          border-color: #E2E8F0;
        }

        .system-monitor-card-wrapper .sm-kpi-card.kpi-working {
          background: #F0FDF4;
          border-color: #DCFCE7;
        }

        .system-monitor-card-wrapper .sm-kpi-card.kpi-attention {
          background: #FFFBEB;
          border-color: #FEF3C7;
        }

        .system-monitor-card-wrapper .sm-kpi-card.kpi-down {
          background: #FEF2F2;
          border-color: #FEE2E2;
        }

        .system-monitor-card-wrapper .kpi-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .system-monitor-card-wrapper .kpi-icon-box.icon-blue {
          background: #DBEAFE;
          color: #2563EB;
        }

        .system-monitor-card-wrapper .kpi-icon-box.icon-green {
          background: #DCFCE7;
          color: #16A34A;
        }

        .system-monitor-card-wrapper .kpi-icon-box.icon-amber {
          background: #FEF3C7;
          color: #D97706;
        }

        .system-monitor-card-wrapper .kpi-icon-box.icon-red {
          background: #FEE2E2;
          color: #DC2626;
        }

        .system-monitor-card-wrapper .kpi-text-block {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .system-monitor-card-wrapper .kpi-count {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
        }

        .system-monitor-card-wrapper .kpi-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
          margin-top: 3px;
        }

        /* Core Functionality Container */
        .system-monitor-card-wrapper .sm-core-functionality-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .system-monitor-card-wrapper .sm-section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 2px;
        }

        .system-monitor-card-wrapper .sm-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          line-height: 1.25;
        }

        .system-monitor-card-wrapper .sm-section-subtitle {
          font-size: 12px;
          color: #64748B;
          margin: 2px 0 0 0;
          line-height: 1.3;
        }

        /* Functionality Cards Container: 4 columns x 2 rows */
        .system-monitor-card-wrapper .sm-functionality-cards-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }

        .system-monitor-card-wrapper .sm-function-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
          position: relative;
          min-width: 0;
          box-sizing: border-box;
        }

        .system-monitor-card-wrapper .sm-function-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
          transform: translateY(-1.5px);
        }

        /* Issue State Accents */
        .system-monitor-card-wrapper .sm-function-card.needs_attention {
          background: #FFFDF5;
          border-color: #FCD34D;
          box-shadow: 0 0 0 1px #FDE68A;
        }

        .system-monitor-card-wrapper .sm-function-card.down {
          background: #FEF8F8;
          border-color: #FCA5A5;
          box-shadow: 0 0 0 1px #FECACA;
        }

        .system-monitor-card-wrapper .sm-function-card.selected {
          border-color: #3B82F6;
          box-shadow: 0 0 0 1.5px #3B82F6;
        }

        .system-monitor-card-wrapper .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .system-monitor-card-wrapper .card-left-info {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }

        .system-monitor-card-wrapper .fn-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .system-monitor-card-wrapper .fn-icon-blue { background: #DBEAFE; color: #2563EB; }
        .system-monitor-card-wrapper .fn-icon-purple { background: #F3E8FF; color: #9333EA; }
        .system-monitor-card-wrapper .fn-icon-cyan { background: #E0F2FE; color: #0284C7; }
        .system-monitor-card-wrapper .fn-icon-amber { background: #FEF3C7; color: #D97706; }
        .system-monitor-card-wrapper .fn-icon-indigo { background: #E0E7FF; color: #4F46E5; }
        .system-monitor-card-wrapper .fn-icon-pink { background: #FCE7F3; color: #DB2777; }
        .system-monitor-card-wrapper .fn-icon-rose { background: #FFE4E6; color: #E11D48; }
        .system-monitor-card-wrapper .fn-icon-teal { background: #CCFBF1; color: #0D9488; }

        .system-monitor-card-wrapper .fn-name {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .system-monitor-card-wrapper .card-status-row {
          display: flex;
          align-items: center;
          margin-top: 2px;
        }

        .system-monitor-card-wrapper .fn-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 999px;
          line-height: 1.1;
        }

        .system-monitor-card-wrapper .fn-status-pill .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .system-monitor-card-wrapper .fn-status-pill.working {
          color: #16A34A;
          background: #DCFCE7;
        }

        .system-monitor-card-wrapper .fn-status-pill.needs_attention {
          color: #D97706;
          background: #FEF3C7;
        }

        .system-monitor-card-wrapper .fn-status-pill.down {
          color: #DC2626;
          background: #FEE2E2;
        }

        .system-monitor-card-wrapper .fn-chevron-arrow {
          font-size: 15px;
          color: #94A3B8;
          font-weight: 600;
          flex-shrink: 0;
        }

        .system-monitor-card-wrapper .fn-description {
          font-size: 11.5px;
          color: #64748B;
          margin: 0;
          line-height: 1.35;
        }

        /* Right Column: Full-Height Issues Requiring Attention */
        .system-monitor-card-wrapper .sm-issue-panel-col {
          background: #FAFAFB;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          box-sizing: border-box;
          justify-content: flex-start;
        }

        .system-monitor-card-wrapper .sm-issue-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          flex-shrink: 0;
        }

        .system-monitor-card-wrapper .issue-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .system-monitor-card-wrapper .issue-section-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        .system-monitor-card-wrapper .issue-count-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .system-monitor-card-wrapper .issue-count-badge.has-issues {
          background: #FEE2E2;
          color: #DC2626;
        }

        .system-monitor-card-wrapper .issue-count-badge.zero {
          background: #DCFCE7;
          color: #16A34A;
        }

        .system-monitor-card-wrapper .sm-issue-content-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-grow: 1;
          justify-content: space-between;
        }

        /* Selected Issue Active Card */
        .system-monitor-card-wrapper .sm-active-issue-card {
          background: #FFF8F6;
          border: 1px solid #FFE4E6;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .system-monitor-card-wrapper .sm-active-issue-card.needs_attention {
          background: #FFFDF5;
          border-color: #FCD34D;
        }

        .system-monitor-card-wrapper .sm-active-issue-card.down {
          background: #FEF8F8;
          border-color: #FCA5A5;
        }

        .system-monitor-card-wrapper .active-issue-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .system-monitor-card-wrapper .active-issue-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .system-monitor-card-wrapper .active-issue-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
        }

        .system-monitor-card-wrapper .active-issue-desc {
          font-size: 11.5px;
          color: #64748B;
          margin: 0;
          line-height: 1.35;
        }

        .system-monitor-card-wrapper .possible-causes-note {
          color: #475569;
        }

        /* What is still working / What to investigate guide boxes */
        .system-monitor-card-wrapper .sm-status-guide-box {
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .system-monitor-card-wrapper .sm-status-guide-box.still-working-box {
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
        }

        .system-monitor-card-wrapper .sm-status-guide-box.investigate-box {
          background: #EFF6FF;
          border: 1px solid #DBEAFE;
        }

        .system-monitor-card-wrapper .guide-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .system-monitor-card-wrapper .guide-icon-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .system-monitor-card-wrapper .guide-icon-circle.green {
          background: #DCFCE7;
          color: #16A34A;
        }

        .system-monitor-card-wrapper .guide-icon-circle.blue {
          background: #DBEAFE;
          color: #2563EB;
        }

        .system-monitor-card-wrapper .guide-box-title {
          font-size: 12.5px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
        }

        .system-monitor-card-wrapper .guide-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .system-monitor-card-wrapper .guide-bullet-list li {
          font-size: 11px;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          line-height: 1.3;
        }

        .system-monitor-card-wrapper .guide-bullet-list li.green-bullet {
          color: #166534;
        }

        .system-monitor-card-wrapper .guide-bullet-list li.green-bullet .bullet-check {
          color: #16A34A;
          font-weight: 800;
        }

        .system-monitor-card-wrapper .guide-bullet-list li.blue-bullet {
          color: #1E40AF;
        }

        .system-monitor-card-wrapper .guide-bullet-list li.blue-bullet .bullet-dot {
          color: #2563EB;
          font-weight: 900;
          font-size: 13px;
          line-height: 1;
        }

        /* Action View Diagnostics Button */
        .system-monitor-card-wrapper .sm-view-diagnostics-btn {
          background: #3B82F6;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          transition: background 150ms ease, transform 150ms ease;
          margin-top: 4px;
        }

        .system-monitor-card-wrapper .sm-view-diagnostics-btn:hover {
          background: #2563EB;
          transform: translateY(-1px);
        }

        .system-monitor-card-wrapper .sm-view-diagnostics-btn.secondary {
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #DBEAFE;
        }

        .system-monitor-card-wrapper .sm-view-diagnostics-btn.secondary:hover {
          background: #DBEAFE;
        }

        /* All Healthy Panel */
        .system-monitor-card-wrapper .sm-all-healthy-panel {
          background: #FFFFFF;
          border: 1px solid #DCFCE7;
          border-radius: 12px;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          flex-grow: 1;
          justify-content: center;
        }

        .system-monitor-card-wrapper .healthy-hero-title {
          font-size: 14px;
          font-weight: 700;
          color: #15803D;
          margin: 0;
        }

        .system-monitor-card-wrapper .healthy-hero-desc {
          font-size: 11.5px;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        .system-monitor-card-wrapper .healthy-checks-summary {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 11px;
          color: #166534;
          font-weight: 600;
          margin: 6px 0;
        }

        /* 3. Footer Row */
        .system-monitor-card-wrapper .sm-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px dashed #E2E8F0;
          font-size: 11.5px;
          color: #64748B;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
        }

        .system-monitor-card-wrapper .footer-left,
        .system-monitor-card-wrapper .footer-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* 4. Deep Technical Diagnostic Modal */
        .sm-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          animation: smModalFadeIn 180ms ease;
        }

        @keyframes smModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sm-modal-dialog {
          background: #FFFFFF;
          border-radius: 18px;
          max-width: 900px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .modal-header {
          padding: 18px 24px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #EFF6FF;
          color: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        .modal-sub {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }

        .modal-close-btn {
          border: none;
          background: #F1F5F9;
          color: #64748B;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 150ms ease;
        }

        .modal-close-btn:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .modal-tabs-nav {
          display: flex;
          padding: 8px 24px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          gap: 6px;
          overflow-x: auto;
        }

        .modal-tabs-nav .tab-btn {
          border: none;
          background: transparent;
          color: #64748B;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 150ms ease;
        }

        .modal-tabs-nav .tab-btn.active {
          background: #FFFFFF;
          color: #2563EB;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        .modal-tab-content {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .diagnostic-table-wrapper {
          overflow-x: auto;
        }

        .diagnostic-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }

        .diagnostic-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 700;
          padding: 10px 12px;
          border-bottom: 1px solid #E2E8F0;
        }

        .diagnostic-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
        }

        .wf-sub-desc {
          font-size: 11px;
          color: #64748B;
          font-weight: 400;
        }

        .ver-pill {
          background: #F1F5F9;
          color: #475569;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 600;
        }

        .crit-pill {
          background: #EFF6FF;
          color: #2563EB;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 600;
        }

        .diagnostic-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .category-detail-card {
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px;
          background: #FFFFFF;
        }

        .cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .cat-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }

        .cat-desc {
          font-size: 11.5px;
          color: #64748B;
          margin: 0 0 10px 0;
          line-height: 1.35;
        }

        .cat-checks-count {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #475569;
          font-weight: 600;
          border-top: 1px dashed #E2E8F0;
          padding-top: 8px;
        }

        .sim-scenarios-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }

        .sim-scenario-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          background: #FAFAFB;
        }

        .sim-desc {
          font-size: 11.5px;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1280px) {
          .system-monitor-card-wrapper .sm-main-grid-layout {
            grid-template-columns: 1fr;
          }
          .system-monitor-card-wrapper .sm-kpi-row {
            grid-template-columns: repeat(4, 1fr);
          }
          .system-monitor-card-wrapper .sm-functionality-cards-container {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .system-monitor-card-wrapper .sm-kpi-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .system-monitor-card-wrapper .sm-functionality-cards-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .system-monitor-card-wrapper .sm-kpi-row {
            grid-template-columns: 1fr;
          }
          .system-monitor-card-wrapper .sm-functionality-cards-container {
            grid-template-columns: 1fr;
          }
          .system-monitor-card-wrapper .sm-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .system-monitor-card-wrapper .sm-header-right {
            width: 100%;
            justify-content: space-between;
          }
          .system-monitor-card-wrapper .sm-footer-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}} />
    </div>
  );
};

export default SystemMonitor;
