/* src/components/admin/SystemMonitor.tsx */
import React from 'react';

// 1. Reusable SystemServiceRow Component
interface SystemServiceRowProps {
  icon: React.ReactNode;
  service: string;
  status: string;
  responseTime: string;
  type: 'operational' | 'degraded' | 'down';
}

export const SystemServiceRow: React.FC<SystemServiceRowProps> = ({
  icon,
  service,
  status,
  responseTime,
  type,
}) => {
  return (
    <div className="premium-service-row">
      <div className="service-left">
        <div className="service-icon-box">
          {icon}
        </div>
        <span className="service-name-text">{service}</span>
      </div>

      <div className="service-right">
        <span className="service-latency">{responseTime}</span>
        <div className={`status-badge-capsule badge-${type}`}>
          <span className="status-indicator-dot" />
          <span className="status-label-text">{status}</span>
        </div>
      </div>
    </div>
  );
};

// 2. Main SystemMonitor Component
interface ServiceData {
  id: number;
  service: string;
  status: string;
  responseTime: string;
  type: 'operational' | 'degraded' | 'down';
  icon: React.ReactNode;
}

export const SystemMonitor: React.FC = () => {
  // Static demonstration dataset for 7 portfolio services
  const services: ServiceData[] = [
    {
      id: 1,
      service: 'Portfolio Website',
      status: 'Operational',
      responseTime: '182ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      id: 2,
      service: 'Database (Supabase)',
      status: 'Operational',
      responseTime: '94ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      )
    },
    {
      id: 3,
      service: 'Authentication',
      status: 'Operational',
      responseTime: '121ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    },
    {
      id: 4,
      service: 'Contact Form',
      status: 'Operational',
      responseTime: '203ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 5,
      service: 'Email Notifications',
      status: 'Operational',
      responseTime: '384ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 6,
      service: 'Testimonials',
      status: 'Operational',
      responseTime: '156ms',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: 7,
      service: 'Weather API',
      status: 'Degraded',
      responseTime: '2,800ms',
      type: 'degraded',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M22 12h-2M19.07 4.93l-1.41 1.41" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    }
  ];

  // Static summary calculations based on static dataset
  const totalCount = services.length;
  const operationalCount = services.filter((s) => s.type === 'operational').length;
  const degradedCount = services.filter((s) => s.type === 'degraded').length;
  const downCount = services.filter((s) => s.type === 'down').length;

  return (
    <div className="premium-monitor-card">
      {/* 1. Header Section */}
      <div className="monitor-card-header">
        <div className="monitor-header-left">
          <h3 className="monitor-card-title">
            <span>🛡️</span> System Monitor
          </h3>
          <p className="monitor-card-subtitle">Real-time status of your portfolio and services</p>
        </div>
        
        <div className="monitor-ticker-box">
          <span className="ticker-label">Last Checked</span>
          <div className="ticker-value-row">
            <span className="ticker-dot-pulse" />
            <span className="ticker-time">Just now</span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metrics Grid */}
      <div className="monitor-summary-grid">
        <div className="summary-pill total">
          <span className="pill-label">Total Services</span>
          <span className="pill-value">{totalCount}</span>
        </div>

        <div className="summary-pill operational">
          <div className="pill-header">
            <span className="pill-dot green"></span>
            <span className="pill-label">Operational</span>
          </div>
          <span className="pill-value">{operationalCount}</span>
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
      </div>

      {/* 3. System Alert Banner */}
      {degradedCount > 0 && (
        <div className="status-alert-banner alert-warning">
          <div className="alert-icon-wrapper">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="alert-details">
            <h5 className="alert-title-text">{degradedCount} service requires attention</h5>
            <p className="alert-desc-text">Weather API is responding slower than expected.</p>
          </div>
        </div>
      )}

      {/* 4. Service Status Row List */}
      <div className="monitor-card-body">
        <div className="service-list">
          {services.map((srv) => (
            <SystemServiceRow
              key={srv.id}
              icon={srv.icon}
              service={srv.service}
              status={srv.status}
              responseTime={srv.responseTime}
              type={srv.type}
            />
          ))}
        </div>
      </div>

      {/* 5. Card Footer Action CTA */}
      <div className="card-footer-cta">
        <button className="cta-button" type="button">
          <span>View System Status</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

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

        .premium-monitor-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
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
          background-color: #22C55E;
          animation: monitor-pulse-glow 2s infinite ease-in-out;
        }

        .premium-monitor-card .ticker-time {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        /* Summary Metrics Grid */
        .premium-monitor-card .monitor-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
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

        .premium-monitor-card .alert-desc-text {
          font-size: 11.5px;
          margin: 0;
          font-weight: 500;
          color: #92400E;
        }

        /* Service row list styles */
        .premium-monitor-card .monitor-card-body {
          width: 100%;
        }

        .premium-monitor-card .service-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 100%;
        }

        .premium-monitor-card .premium-service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 10px;
          transition: background-color 180ms ease;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          gap: 12px;
        }

        .premium-monitor-card .premium-service-row:hover {
          background-color: rgba(124, 58, 237, 0.03);
        }

        .premium-monitor-card .service-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
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

        .premium-monitor-card .premium-service-row:hover .service-icon-box {
          background-color: #FFFFFF;
          border-color: #E2E8F0;
          color: #4F46E5;
        }

        .premium-monitor-card .service-name-text {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        /* Footer Action Button */
        .premium-monitor-card .card-footer-cta {
          display: flex;
          justify-content: flex-end;
          padding-top: 4px;
        }

        .premium-monitor-card .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: #4F46E5;
          color: #FFFFFF;
          font-size: 12.5px;
          font-weight: 650;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 150ms ease;
          box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }

        .premium-monitor-card .cta-button:hover {
          background: #4338CA;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
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

        /* Media Responsiveness */
        @media (max-width: 640px) {
          .premium-monitor-card .monitor-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .premium-monitor-card .monitor-ticker-box {
            align-items: flex-start;
          }
          .premium-monitor-card .monitor-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .premium-monitor-card .service-right {
            gap: 6px;
          }
          .premium-monitor-card .service-latency {
            font-size: 10.5px;
          }
        }
      `}} />
    </div>
  );
};

export default SystemMonitor;
