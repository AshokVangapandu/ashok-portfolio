/* src/components/admin/SystemMonitor.tsx */
import React, { useEffect, useState, useCallback } from 'react';
import { systemMonitorService } from '../../admin/services/systemMonitorService';
import { SystemHealthSummary, ComponentHealth, WorkflowHealth, SystemIncident, HealthStatus } from '../../admin/types/systemMonitor';

// Icon mapping helper for the 7 technical components
const getComponentIcon = (name: string): React.ReactNode => {
  if (name.includes('Database')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    );
  }
  if (name.includes('Auth')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }
  if (name.includes('Analytics')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );
  }
  if (name.includes('Telemetry')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }
  if (name.includes('Edge') || name.includes('Gateway')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  if (name.includes('Email')) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }
  // Default State Machine / Sliders icon
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
};

// Status badge styling helper
const getStatusBadgeClass = (status: HealthStatus): string => {
  switch (status) {
    case 'healthy':
      return 'badge-operational';
    case 'degraded':
      return 'badge-degraded';
    case 'down':
      return 'badge-down';
    case 'unknown':
    default:
      return 'badge-unknown';
  }
};

const getStatusLabel = (status: HealthStatus): string => {
  switch (status) {
    case 'healthy':
      return 'Operational';
    case 'degraded':
      return 'Degraded';
    case 'down':
      return 'Down';
    case 'unknown':
    default:
      return 'Unknown';
  }
};

export const SystemMonitor: React.FC = () => {
  const [summary, setSummary] = useState<SystemHealthSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'components' | 'workflows' | 'incidents'>('components');

  // Single authoritative fetch function
  const fetchHealthSummary = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await systemMonitorService.getSystemHealthSummary();
      setSummary(data);
    } catch (err: any) {
      console.error('[SystemMonitor] Health check summary execution failed:', err);
      setError(err?.message || 'Failed to execute system monitor health checks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch once on mount (zero polling / zero setInterval)
  useEffect(() => {
    fetchHealthSummary(false);
  }, [fetchHealthSummary]);

  const toggleComponentExpand = (name: string) => {
    setExpandedComponents(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Metric counts derived strictly from returned components
  const components = summary?.components || [];
  const workflows = summary?.workflows || [];
  const incidents = summary?.incidents || [];
  const totalCount = components.length;
  const healthyCount = components.filter(c => c.status === 'healthy').length;
  const degradedCount = components.filter(c => c.status === 'degraded').length;
  const downCount = components.filter(c => c.status === 'down').length;
  const unknownCount = components.filter(c => c.status === 'unknown').length;

  return (
    <div className="premium-monitor-card">
      {/* 1. Header Section */}
      <div className="monitor-card-header">
        <div className="monitor-header-left">
          <h3 className="monitor-card-title">
            <span>🛡️</span> System Monitor
          </h3>
          <p className="monitor-card-subtitle">Real-time status of portfolio infrastructure, workflows & session incidents</p>
        </div>

        <div className="monitor-header-actions">
          <button
            className="refresh-probes-btn"
            type="button"
            onClick={() => fetchHealthSummary(true)}
            disabled={loading || refreshing}
            title="Re-run health check probes"
          >
            <svg
              className={`refresh-icon ${refreshing ? 'spinning' : ''}`}
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6" />
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.3L2.5 16" />
            </svg>
            <span>{refreshing ? 'Evaluating...' : 'Refresh Probes'}</span>
          </button>

          <div className="monitor-ticker-box">
            <span className="ticker-label">Last Evaluated</span>
            <div className="ticker-value-row">
              <span className={`ticker-dot-pulse dot-${summary?.overallStatus || 'unknown'}`} />
              <span className="ticker-time">
                {summary?.lastEvaluatedAt
                  ? new Date(summary.lastEvaluatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Loading Skeleton State */}
      {loading && !summary && (
        <div className="monitor-loading-state">
          <div className="loading-spinner" />
          <span className="loading-text">Executing System Monitor probes across components & workflows...</span>
        </div>
      )}

      {/* 3. Service Error State */}
      {error && (
        <div className="status-alert-banner alert-error">
          <div className="alert-icon-wrapper red">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div className="alert-details">
            <h5 className="alert-title-text red">Monitor Probe Exception</h5>
            <p className="alert-desc-text">{error}</p>
          </div>
          <button className="retry-btn" type="button" onClick={() => fetchHealthSummary(false)}>
            Retry Probes
          </button>
        </div>
      )}

      {/* 4. Live Health Metrics & Content */}
      {summary && !loading && (
        <>
          {/* Top Summary Metrics Grid */}
          <div className="monitor-summary-grid">
            <div className="summary-pill total">
              <span className="pill-label">Total Components</span>
              <span className="pill-value">{totalCount}</span>
            </div>

            <div className="summary-pill operational">
              <div className="pill-header">
                <span className="pill-dot green"></span>
                <span className="pill-label">Healthy</span>
              </div>
              <span className="pill-value">{healthyCount}</span>
            </div>

            <div className="summary-pill degraded">
              <div className="pill-header">
                <span className="pill-dot amber"></span>
                <span className="pill-label">Degraded</span>
              </div>
              <span className="pill-value">{degradedCount}</span>
            </div>

            <div className="summary-pill down">
              <div className="pill-header">
                <span className="pill-dot red"></span>
                <span className="pill-label">Down</span>
              </div>
              <span className="pill-value">{downCount}</span>
            </div>

            <div className="summary-pill unknown">
              <div className="pill-header">
                <span className="pill-dot gray"></span>
                <span className="pill-label">Unknown</span>
              </div>
              <span className="pill-value">{unknownCount}</span>
            </div>
          </div>

          {/* Overall System Status Alert Banner */}
          {summary.overallStatus !== 'healthy' && (
            <div className={`status-alert-banner alert-${summary.overallStatus === 'down' ? 'error' : summary.overallStatus === 'degraded' ? 'warning' : 'unknown'}`}>
              <div className="alert-icon-wrapper">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="alert-details">
                <h5 className="alert-title-text">
                  System Status: {summary.overallStatus.toUpperCase()}
                </h5>
                <p className="alert-desc-text">
                  {summary.overallStatus === 'degraded'
                    ? 'One or more non-critical components/workflows require attention.'
                    : summary.overallStatus === 'down'
                    ? 'Critical P0 infrastructure failure detected.'
                    : 'Insufficient evidence to determine full system state.'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Tab Bar */}
          <div className="monitor-tab-bar">
            <button
              className={`tab-btn ${activeTab === 'components' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('components')}
            >
              Technical Components ({components.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'workflows' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('workflows')}
            >
              Production Workflows ({workflows.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('incidents')}
            >
              <span>Incidents & Diagnostics — Current Session ({incidents.length})</span>
              {incidents.some(i => i.status === 'active') && (
                <span className="active-incident-dot" title="Active incidents present" aria-label="Active incidents present" />
              )}
            </button>
          </div>

          {/* Tab 1: Technical Components */}
          {activeTab === 'components' && (
            <div className="monitor-card-body">
              <div className="service-list">
                {components.map((comp: ComponentHealth) => {
                  const isExpanded = !!expandedComponents[comp.componentName];
                  const maxLatency = Math.max(...comp.checks.map(c => c.latencyMs || 0), 0);

                  return (
                    <div key={comp.componentName} className="component-accordion-wrapper">
                      <div
                        className="premium-service-row"
                        onClick={() => toggleComponentExpand(comp.componentName)}
                      >
                        <div className="service-left">
                          <div className="service-icon-box">
                            {getComponentIcon(comp.componentName)}
                          </div>
                          <div className="service-title-col">
                            <span className="service-name-text">{comp.componentName}</span>
                            <span className="evidence-level-tag">Evidence: {comp.evidenceType.toUpperCase()} | {comp.criticality.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="service-right">
                          <span className="service-latency">{maxLatency}ms</span>
                          <div className={`status-badge-capsule ${getStatusBadgeClass(comp.status)}`}>
                            <span className="status-indicator-dot" />
                            <span className="status-label-text">{getStatusLabel(comp.status)}</span>
                          </div>
                          <span className={`accordion-chevron ${isExpanded ? 'open' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {/* Expandable Child Health Checks Drawer */}
                      {isExpanded && (
                        <div className="child-checks-drawer">
                          <div className="drawer-header">
                            <span>Health Check Probe Evidence ({comp.checks.length} check{comp.checks.length > 1 ? 's' : ''})</span>
                          </div>
                          <div className="child-checks-list">
                            {comp.checks.map((chk) => (
                              <div key={chk.checkId} className="child-check-item">
                                <div className="check-item-header">
                                  <div className="check-id-badge">{chk.checkId}</div>
                                  <div className={`status-badge-capsule ${getStatusBadgeClass(chk.status)}`}>
                                    <span className="status-indicator-dot" />
                                    <span className="status-label-text">{getStatusLabel(chk.status)}</span>
                                  </div>
                                  <span className="check-latency">{chk.latencyMs}ms</span>
                                </div>
                                <p className="check-summary-text">{chk.sanitizedSummary}</p>
                                {chk.affectedWorkflows && chk.affectedWorkflows.length > 0 && (
                                  <div className="workflows-tag-list">
                                    <span>Workflows: {chk.affectedWorkflows.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Production Workflows */}
          {activeTab === 'workflows' && (
            <div className="monitor-card-body">
              <div className="workflow-list">
                {workflows.map((wf: WorkflowHealth) => (
                  <div key={wf.workflowName} className="workflow-card-item">
                    <div className="workflow-card-top">
                      <div className="workflow-name-col">
                        <h4 className="workflow-title">{wf.workflowName}</h4>
                        <span className="evidence-level-tag">Evidence: {wf.evidenceType.toUpperCase()}</span>
                      </div>
                      <div className={`status-badge-capsule ${getStatusBadgeClass(wf.status)}`}>
                        <span className="status-indicator-dot" />
                        <span className="status-label-text">{getStatusLabel(wf.status)}</span>
                      </div>
                    </div>

                    {/* 4-Stage Pipeline UI */}
                    <div className="workflow-pipeline-row">
                      <div className="pipeline-stage">
                        <span className="stage-name">Trigger</span>
                        <div className={`status-badge-capsule ${getStatusBadgeClass(wf.triggerStatus)}`}>
                          <span className="status-indicator-dot" />
                          <span>{getStatusLabel(wf.triggerStatus)}</span>
                        </div>
                      </div>

                      <span className="pipeline-arrow">→</span>

                      <div className="pipeline-stage">
                        <span className="stage-name">Function</span>
                        <div className={`status-badge-capsule ${getStatusBadgeClass(wf.functionStatus)}`}>
                          <span className="status-indicator-dot" />
                          <span>{getStatusLabel(wf.functionStatus)}</span>
                        </div>
                      </div>

                      <span className="pipeline-arrow">→</span>

                      <div className="pipeline-stage">
                        <span className="stage-name">Provider</span>
                        <div className={`status-badge-capsule ${getStatusBadgeClass(wf.providerStatus)}`}>
                          <span className="status-indicator-dot" />
                          <span>{getStatusLabel(wf.providerStatus)}</span>
                        </div>
                      </div>

                      <span className="pipeline-arrow">→</span>

                      <div className="pipeline-stage">
                        <span className="stage-name">Delivery</span>
                        <div className={`status-badge-capsule ${getStatusBadgeClass(wf.deliveryStatus)}`}>
                          <span className="status-indicator-dot" />
                          <span>{getStatusLabel(wf.deliveryStatus)}</span>
                        </div>
                      </div>
                    </div>

                    {wf.notes && (
                      <p className="workflow-notes-text">{wf.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Incidents & Diagnostics — Current Session */}
          {activeTab === 'incidents' && (
            <div className="monitor-card-body">
              <div className="incident-list">
                {incidents.length === 0 ? (
                  <div className="empty-incidents-box">
                    <span className="empty-icon">🟢</span>
                    <p className="empty-title">No Operational Incidents Recorded</p>
                    <p className="empty-subtitle">Zero active or historical incidents recorded in the current session.</p>
                  </div>
                ) : (
                  incidents.map((inc: SystemIncident) => (
                    <div key={inc.id} className={`incident-card-item status-${inc.status}`}>
                      <div className="incident-card-top">
                        <div className="incident-title-col">
                          <div className="incident-header-row">
                            <h4 className="incident-title">{inc.targetComponent}</h4>
                            <span className={`severity-badge ${inc.severity}`}>{inc.severity.toUpperCase()}</span>
                          </div>
                          <span className="incident-id-tag">ID: {inc.id}</span>
                        </div>
                        <div className={`status-badge-capsule ${inc.status === 'active' ? 'badge-down' : 'badge-operational'}`}>
                          <span className="status-indicator-dot" />
                          <span className="status-label-text">{inc.status === 'active' ? 'Active' : 'Resolved'}</span>
                        </div>
                      </div>

                      <p className="incident-summary-text">{inc.sanitizedSummary}</p>

                      <div className="incident-timestamps-row">
                        <span>Started: {new Date(inc.startedAt).toLocaleTimeString()}</span>
                        {inc.resolvedAt && <span> | Resolved: {new Date(inc.resolvedAt).toLocaleTimeString()}</span>}
                      </div>

                      {inc.affectedWorkflows && inc.affectedWorkflows.length > 0 && (
                        <div className="workflows-tag-list">
                          <span>Affected Workflows: {inc.affectedWorkflows.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-monitor-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          text-align: left;
          width: 100%;
          gap: 16px;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-monitor-card .monitor-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          gap: 12px;
        }

        .premium-monitor-card .monitor-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .premium-monitor-card .monitor-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-monitor-card .monitor-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
        }

        .premium-monitor-card .monitor-header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .premium-monitor-card .refresh-probes-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          color: #475569;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .premium-monitor-card .refresh-probes-btn:hover:not(:disabled) {
          background: #E2E8F0;
          color: #1E293B;
        }

        .premium-monitor-card .refresh-probes-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-icon.spinning {
          animation: monitor-spin 1s linear infinite;
        }

        @keyframes monitor-spin {
          100% { transform: rotate(360deg); }
        }

        /* Ticker box */
        .premium-monitor-card .monitor-ticker-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          flex-shrink: 0;
        }

        .premium-monitor-card .ticker-label {
          font-size: 10.5px;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .premium-monitor-card .ticker-value-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .premium-monitor-card .ticker-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: monitor-pulse-glow 2s infinite ease-in-out;
        }

        .ticker-dot-pulse.dot-healthy { background-color: #22C55E; }
        .ticker-dot-pulse.dot-degraded { background-color: #F59E0B; }
        .ticker-dot-pulse.dot-down { background-color: #EF4444; }
        .ticker-dot-pulse.dot-unknown { background-color: #94A3B8; }

        .premium-monitor-card .ticker-time {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        /* Loading & Error States */
        .monitor-loading-state {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          color: #64748B;
          font-size: 13px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #E2E8F0;
          border-top-color: #4F46E5;
          border-radius: 50%;
          animation: monitor-spin 0.8s linear infinite;
        }

        .retry-btn {
          padding: 6px 12px;
          background: #DC2626;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          margin-left: auto;
        }

        /* Tab Bar Styling */
        .monitor-tab-bar {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
        }

        .tab-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #64748B;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .tab-btn.active {
          color: #4F46E5;
          background: #EEF2FF;
        }

        .active-incident-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #EF4444;
          display: inline-block;
          margin-left: 5px;
          vertical-align: middle;
        }

        /* Summary Metrics Grid */
        .premium-monitor-card .monitor-summary-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          width: 100%;
        }

        .premium-monitor-card .summary-pill {
          padding: 10px 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: 1px solid #F1F5F9;
          background: #F8FAFC;
        }

        .premium-monitor-card .summary-pill.operational {
          background: rgba(34, 197, 94, 0.04);
          border-color: rgba(34, 197, 94, 0.15);
        }

        .premium-monitor-card .summary-pill.degraded {
          background: rgba(245, 158, 11, 0.04);
          border-color: rgba(245, 158, 11, 0.15);
        }

        .premium-monitor-card .summary-pill.down {
          background: rgba(239, 68, 68, 0.04);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .premium-monitor-card .summary-pill.unknown {
          background: rgba(148, 163, 184, 0.05);
          border-color: rgba(148, 163, 184, 0.2);
        }

        .premium-monitor-card .pill-header {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .premium-monitor-card .pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .premium-monitor-card .pill-dot.green { background: #22C55E; }
        .premium-monitor-card .pill-dot.amber { background: #F59E0B; }
        .premium-monitor-card .pill-dot.red { background: #EF4444; }
        .premium-monitor-card .pill-dot.gray { background: #94A3B8; }

        .premium-monitor-card .pill-label {
          font-size: 10.5px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .premium-monitor-card .pill-value {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
        }

        /* Alert Banner */
        .premium-monitor-card .status-alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .premium-monitor-card .alert-warning {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .premium-monitor-card .alert-error {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .premium-monitor-card .alert-unknown {
          background: rgba(148, 163, 184, 0.05);
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .premium-monitor-card .alert-icon-wrapper {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background-color: #F59E0B;
          color: #FFFFFF;
        }

        .premium-monitor-card .alert-icon-wrapper.red {
          background-color: #EF4444;
        }

        .premium-monitor-card .alert-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .premium-monitor-card .alert-title-text {
          font-size: 12.5px;
          font-weight: 700;
          margin: 0;
          color: #B45309;
        }

        .alert-title-text.red { color: #B91C1C; }

        .premium-monitor-card .alert-desc-text {
          font-size: 11.5px;
          margin: 0;
          font-weight: 500;
          color: #92400E;
        }

        /* Workflow Card List Styles */
        .workflow-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .workflow-card-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .workflow-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .workflow-name-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .workflow-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .workflow-pipeline-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          background: #FFFFFF;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #F1F5F9;
        }

        .pipeline-stage {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stage-name {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .pipeline-arrow {
          font-size: 12px;
          color: #CBD5E1;
          font-weight: bold;
        }

        .workflow-notes-text {
          font-size: 11.5px;
          color: #64748B;
          margin: 0;
          font-style: italic;
        }

        /* Service row list styles */
        .premium-monitor-card .monitor-card-body {
          width: 100%;
        }

        .premium-monitor-card .service-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .component-accordion-wrapper {
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          overflow: hidden;
          background: #FFFFFF;
          transition: border-color 150ms ease;
        }

        .component-accordion-wrapper:hover {
          border-color: #E2E8F0;
        }

        .premium-monitor-card .premium-service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          gap: 12px;
          user-select: none;
        }

        .premium-monitor-card .service-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .service-title-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .evidence-level-tag {
          font-size: 10px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .accordion-chevron {
          font-size: 9px;
          color: #94A3B8;
          transition: transform 180ms ease;
          margin-left: 4px;
        }

        .accordion-chevron.open {
          transform: rotate(180deg);
        }

        /* Child Checks Drawer */
        .child-checks-drawer {
          background: #F8FAFC;
          border-top: 1px solid #F1F5F9;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-header {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .child-checks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .child-check-item {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .check-item-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .check-id-badge {
          font-size: 11px;
          font-weight: 800;
          background: #EEF2FF;
          color: #4F46E5;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .check-latency {
          font-size: 11px;
          font-family: monospace;
          color: #64748B;
          margin-left: auto;
        }

        .check-summary-text {
          font-size: 12px;
          color: #334155;
          margin: 0;
          line-height: 1.4;
        }

        .workflows-tag-list {
          font-size: 10.5px;
          color: #94A3B8;
          font-style: italic;
        }

        .premium-monitor-card .service-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 180ms ease;
        }

        .premium-monitor-card .service-name-text {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .premium-monitor-card .service-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .premium-monitor-card .service-latency {
          font-size: 11.5px;
          font-weight: 500;
          color: #64748B;
          font-family: monospace, monospace;
        }

        /* Status Badges Capsule styling */
        .premium-monitor-card .status-badge-capsule {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          flex-shrink: 0;
        }

        .premium-monitor-card .status-indicator-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Operational (Green) state */
        .premium-monitor-card .badge-operational {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          color: #16A34A;
        }
        .premium-monitor-card .badge-operational .status-indicator-dot {
          background-color: #22C55E;
        }

        /* Degraded (Amber) state */
        .premium-monitor-card .badge-degraded {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.15);
          color: #D97706;
        }
        .premium-monitor-card .badge-degraded .status-indicator-dot {
          background-color: #F59E0B;
        }

        /* Down (Red) state */
        .premium-monitor-card .badge-down {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #DC2626;
        }
        .premium-monitor-card .badge-down .status-indicator-dot {
          background-color: #EF4444;
        }

        /* Unknown (Gray) state */
        .premium-monitor-card .badge-unknown {
          background: rgba(148, 163, 184, 0.1);
          border: 1px solid rgba(148, 163, 184, 0.25);
          color: #64748B;
        }
        .premium-monitor-card .badge-unknown .status-indicator-dot {
          background-color: #94A3B8;
        }

        /* Animations */
        @keyframes monitor-pulse-glow {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          70% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(0.9);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        /* Incident List Styles */
        .incident-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .empty-incidents-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background: #F8FAFC;
          border: 1px dashed #CBD5E1;
          border-radius: 12px;
          text-align: center;
        }

        .empty-incidents-box .empty-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .empty-incidents-box .empty-title {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
          margin: 0 0 4px 0;
        }

        .empty-incidents-box .empty-subtitle {
          font-size: 12px;
          color: #64748B;
          margin: 0;
        }

        .incident-card-item {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .incident-card-item.status-active {
          border-left: 4px solid #EF4444;
          background: rgba(239, 68, 68, 0.02);
        }

        .incident-card-item.status-resolved {
          border-left: 4px solid #22C55E;
          background: rgba(34, 197, 94, 0.02);
        }

        .incident-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .incident-title-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .incident-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .incident-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .severity-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .severity-badge.p0_critical {
          background: #FEE2E2;
          color: #991B1B;
        }

        .severity-badge.p1_high {
          background: #FEF3C7;
          color: #92400E;
        }

        .severity-badge.p2_medium {
          background: #E0E7FF;
          color: #3730A3;
        }

        .incident-id-tag {
          font-size: 10.5px;
          font-family: monospace;
          color: #94A3B8;
        }

        .incident-summary-text {
          font-size: 12px;
          color: #334155;
          margin: 0;
          line-height: 1.4;
        }

        .incident-timestamps-row {
          font-size: 11px;
          color: #64748B;
          font-family: monospace;
        }

        /* Media Responsiveness */
        @media (max-width: 640px) {
          .premium-monitor-card .monitor-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .premium-monitor-card .monitor-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .premium-monitor-card .service-right {
            gap: 6px;
          }
        }
      `}} />
    </div>
  );
};

export default SystemMonitor;
