/* src/components/admin/EdithInsights.tsx */
import React from 'react';

// 1. Reusable InsightCard Component
interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  iconBg: string;
  iconColor: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  title,
  description,
  actionText,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="premium-insight-item">
      <div
        className="insight-icon-container"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="insight-details">
        <h4 className="insight-title-text">{title}</h4>
        <p className="insight-desc-text">{description}</p>
      </div>
      <span className="insight-action-link">{actionText}</span>
    </div>
  );
};

// 2. Main EdithInsights Component
interface RecommendationData {
  id: number;
  title: string;
  description: string;
  actionText: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export const EdithInsights: React.FC = () => {
  // Static recommendations dataset (5 items)
  const recommendations: RecommendationData[] = [
    {
      id: 1,
      title: 'Resume',
      description: "Your resume hasn't been updated for 32 days.",
      actionText: 'Update →',
      iconBg: 'rgba(245, 158, 11, 0.08)',
      iconColor: '#D97706',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Contacts',
      description: '2 new contact messages need your attention.',
      actionText: 'Review →',
      iconBg: 'rgba(59, 130, 246, 0.08)',
      iconColor: '#2563EB',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Certifications',
      description: 'A new certification is ready to publish.',
      actionText: 'Publish →',
      iconBg: 'rgba(124, 58, 237, 0.08)',
      iconColor: '#7C3AED',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Analytics',
      description: 'Portfolio traffic increased by 18% this week.',
      actionText: 'View Report →',
      iconBg: 'rgba(34, 197, 94, 0.08)',
      iconColor: '#16A34A',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Projects',
      description: 'Your latest AI project is receiving the most visits.',
      actionText: 'View Project →',
      iconBg: 'rgba(239, 68, 68, 0.08)',
      iconColor: '#DC2626',
      icon: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
  ];

  return (
    <div className="premium-insights-card">
      {/* Header section with Title & AI Pill badge */}
      <div className="insights-card-header">
        <div className="insights-header-left">
          <h3 className="insights-card-title">
            <span>✨</span> Edith Insights
          </h3>
          <p className="insights-card-subtitle">Your AI Portfolio Assistant</p>
        </div>
        <span className="ai-badge">AI Powered</span>
      </div>

      {/* Recommendations Feed List */}
      <div className="insights-card-body">
        <div className="insights-list">
          {recommendations.map((rec) => (
            <InsightCard
              key={rec.id}
              icon={rec.icon}
              title={rec.title}
              description={rec.description}
              actionText={rec.actionText}
              iconBg={rec.iconBg}
              iconColor={rec.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Scoped CSS Stylesheet (Avoids conflict with light theme variables) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-insights-card {
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

        .premium-insights-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-insights-card .insights-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
          gap: 12px;
        }

        .premium-insights-card .insights-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .premium-insights-card .insights-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-insights-card .insights-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 550;
        }

        .premium-insights-card .ai-badge {
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.15);
          color: #7C3AED;
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }

        .premium-insights-card .insights-card-body {
          width: 100%;
        }

        .premium-insights-card .insights-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        /* Scoped Insight Card row/box */
        .premium-insights-card .premium-insight-item {
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
        }

        .premium-insights-card .premium-insight-item:hover {
          background: #FFFFFF;
          border-color: #E2E8F0;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
        }

        .premium-insights-card .insight-icon-container {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .premium-insights-card .insight-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 2px;
          overflow: hidden;
        }

        .premium-insights-card .insight-title-text {
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0;
        }

        .premium-insights-card .insight-desc-text {
          font-size: 13.2px;
          color: #1E293B;
          margin: 0;
          font-weight: 550;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-insights-card .insight-action-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 150ms ease;
        }

        .premium-insights-card .premium-insight-item:hover .insight-action-link {
          color: #3730A3;
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-insights-card .insights-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .premium-insights-card .ai-badge {
            align-self: flex-start;
          }
          .premium-insights-card .premium-insight-item {
            padding: 10px 12px;
            gap: 10px;
          }
          .premium-insights-card .insight-desc-text {
            font-size: 12px;
          }
        }
      `}} />
    </div>
  );
};

export default EdithInsights;
