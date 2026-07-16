/* src/components/admin/SystemMonitor.tsx */
import React from 'react';

// 1. Reusable SystemServiceRow Component
interface SystemServiceRowProps {
  icon: React.ReactNode;
  service: string;
  status: string;
  type: 'operational' | 'warning' | 'offline';
}

export const SystemServiceRow: React.FC<SystemServiceRowProps> = ({
  icon,
  service,
  status,
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
      <div className={`status-badge-capsule badge-${type}`}>
        <span className="status-indicator-dot" />
        <span className="status-label-text">{status}</span>
      </div>
    </div>
  );
};

// 2. Main SystemMonitor Component
interface ServiceData {
  id: number;
  service: string;
  status: string;
  type: 'operational' | 'warning' | 'offline';
  icon: React.ReactNode;
}

export const SystemMonitor: React.FC = () => {
  // Static placeholder data for services
  const services: ServiceData[] = [
    {
      id: 1,
      service: 'Contact Form',
      status: 'Operational',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 2,
      service: 'Email Notifications',
      status: 'Operational',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 3,
      service: 'Testimonials',
      status: 'Connection Failed',
      type: 'offline',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: 4,
      service: 'Resume Downloads',
      status: 'Operational',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      )
    },
    {
      id: 5,
      service: 'Weather Service',
      status: 'API Slow',
      type: 'warning',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M22 12h-2M19.07 4.93l-1.41 1.41" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    },
    {
      id: 6,
      service: 'Database',
      status: 'Operational',
      type: 'operational',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      )
    }
  ];

  // Calculate issue counts dynamically based on static dataset
  const issueCount = services.filter((s) => s.type !== 'operational').length;

  return (
    <div className="premium-monitor-card">
      {/* Header section with Ticker */}
      <div className="monitor-card-header">
        <div className="monitor-header-left">
          <h3 className="monitor-card-title">
            <span>🛡️</span> System Monitor
          </h3>
          <p className="monitor-card-subtitle">Real-time Portfolio Services</p>
        </div>
        
        <div className="monitor-ticker-box">
          <span className="ticker-label">Last Checked</span>
          <div className="ticker-value-row">
            <span className="ticker-dot-pulse" />
            <span className="ticker-time">Just now</span>
          </div>
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {issueCount === 0 ? (
        <div className="status-alert-banner alert-success">
          <div className="alert-icon-wrapper">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="alert-details">
            <h5 className="alert-title-text">All Systems Operational</h5>
            <p className="alert-desc-text">Everything is running smoothly</p>
          </div>
        </div>
      ) : (
        <div className="status-alert-banner alert-warning">
          <div className="alert-icon-wrapper">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="alert-details">
            <h5 className="alert-title-text">{issueCount} Issues Detected</h5>
            <p className="alert-desc-text">Some services are experiencing degradation</p>
          </div>
        </div>
      )}

      {/* Service Status Row List */}
      <div className="monitor-card-body">
        <div className="service-list">
          {services.map((srv) => (
            <SystemServiceRow
              key={srv.id}
              icon={srv.icon}
              service={srv.service}
              status={srv.status}
              type={srv.type}
            />
          ))}
        </div>
      </div>

      {/* Scoped CSS Stylesheet (Avoids conflict with light theme variables) */}
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
          align-items: center;
          margin-bottom: 16px;
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
          font-weight: 550;
        }

        /* Last Checked Ticker styles */
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

        /* Alert Status Banners */
        .premium-monitor-card .status-alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .premium-monitor-card .alert-success {
          background: rgba(34, 197, 94, 0.06);
          border: 1px solid rgba(34, 197, 94, 0.12);
        }

        .premium-monitor-card .alert-warning {
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.12);
        }

        .premium-monitor-card .alert-icon-wrapper {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .premium-monitor-card .alert-success .alert-icon-wrapper {
          background-color: #22C55E;
          color: #FFFFFF;
        }

        .premium-monitor-card .alert-warning .alert-icon-wrapper {
          background-color: #F59E0B;
          color: #FFFFFF;
        }

        .premium-monitor-card .alert-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .premium-monitor-card .alert-title-text {
          font-size: 13.5px;
          font-weight: 700;
          margin: 0;
        }

        .premium-monitor-card .alert-success .alert-title-text {
          color: #15803D;
        }

        .premium-monitor-card .alert-warning .alert-title-text {
          color: #B45309;
        }

        .premium-monitor-card .alert-desc-text {
          font-size: 11.5px;
          margin: 0;
          font-weight: 500;
        }

        .premium-monitor-card .alert-success .alert-desc-text {
          color: #166534;
        }

        .premium-monitor-card .alert-warning .alert-desc-text {
          color: #92400E;
        }

        /* Service row list styles */
        .premium-monitor-card .monitor-card-body {
          width: 100%;
        }

        .premium-monitor-card .service-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .premium-monitor-card .premium-service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 10px;
          transition: background-color 180ms ease;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          gap: 16px;
        }

        .premium-monitor-card .premium-service-row:hover {
          background-color: rgba(124, 58, 237, 0.03);
        }

        .premium-monitor-card .service-left {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .premium-monitor-card .service-icon-box {
          width: 30px;
          height: 30px;
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
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Status Badges Capsule styling */
        .premium-monitor-card .status-badge-capsule {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          flex-shrink: 0;
        }

        .premium-monitor-card .status-indicator-dot {
          width: 6px;
          height: 6px;
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

        /* Warning (Amber) state */
        .premium-monitor-card .badge-warning {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.15);
          color: #D97706;
        }
        .premium-monitor-card .badge-warning .status-indicator-dot {
          background-color: #F59E0B;
        }

        /* Offline (Red) state */
        .premium-monitor-card .badge-offline {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #DC2626;
        }
        .premium-monitor-card .badge-offline .status-indicator-dot {
          background-color: #EF4444;
          animation: monitor-offline-blink 1.5s infinite ease-in-out;
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

        @keyframes monitor-offline-blink {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-monitor-card .monitor-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .premium-monitor-card .monitor-ticker-box {
            align-items: flex-start;
          }
        }
      `}} />
    </div>
  );
};

export default SystemMonitor;
