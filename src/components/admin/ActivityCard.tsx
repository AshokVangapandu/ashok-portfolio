/* src/components/admin/ActivityCard.tsx */
import React from 'react';

// 1. Reusable ActivityItem Component
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  description,
  timestamp,
}) => {
  return (
    <div className="premium-activity-row">
      <div className="activity-icon-box">
        {icon}
      </div>
      <div className="activity-details">
        <div className="activity-title-row">
          <h4 className="activity-title-text">{title}</h4>
          <span className="activity-time-text">{timestamp}</span>
        </div>
        <p className="activity-desc-text">{description}</p>
      </div>
    </div>
  );
};

// 2. Main ActivityCard Component
interface ActivityData {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

export const ActivityCard: React.FC = () => {
  // Static placeholder data config for 6 activity types
  const activities: ActivityData[] = [
    {
      id: 1,
      title: 'Resume updated successfully',
      description: 'Recruiter downloaded the latest resume from the portal.',
      timestamp: '5 mins ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <polyline points="9 15 12 18 15 15" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'New contact received',
      description: 'John Doe submitted a new contact request form.',
      timestamp: '1 hour ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Testimonial approved',
      description: 'Testimonial from Jane Smith was approved for showcase.',
      timestamp: '4 hours ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Project published',
      description: 'New project showcase item was successfully published.',
      timestamp: '1 day ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 3l-4.9 4.9m1-3.9l-3.9 3.9M18.5 5.5a2.121 2.121 0 0 1 3 3L7 21l-4 1 1-4L18.5 5.5z" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Certification added',
      description: 'AWS Cloud Practitioner certification badge was linked.',
      timestamp: '2 days ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Settings updated',
      description: 'SMTP email configurations were modified.',
      timestamp: 'Yesterday',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <div className="premium-activity-card">
      {/* Header section with View All link */}
      <div className="activity-card-header">
        <h3 className="activity-card-title">Recent Activity</h3>
        <button className="view-all-link" type="button">
          <span>View All</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Main Activity feed content wrapper */}
      <div className="activity-card-body">
        {activities.length === 0 ? (
          /* Elegant Empty State */
          <div className="activity-empty-state">
            <div className="empty-state-icon">📂</div>
            <p className="empty-state-text">No recent activity.</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((act) => (
              <ActivityItem
                key={act.id}
                icon={act.icon}
                title={act.title}
                description={act.description}
                timestamp={act.timestamp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scoped CSS Stylesheet (Avoids conflict with light theme variables) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-activity-card {
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

        .premium-activity-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-activity-card .activity-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
        }

        .premium-activity-card .activity-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
        }

        .premium-activity-card .view-all-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          text-decoration: none;
          cursor: pointer;
          transition: color 150ms ease;
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 0;
          outline: none;
        }

        .premium-activity-card .view-all-link:hover {
          color: #3730A3;
        }

        .premium-activity-card .activity-card-body {
          width: 100%;
        }

        .premium-activity-card .activity-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        /* Activity Item Row Styles */
        .premium-activity-card .premium-activity-row {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          transition: all 200ms ease;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid transparent;
          gap: 16px;
        }

        .premium-activity-card .premium-activity-row:hover {
          background-color: rgba(124, 58, 237, 0.03);
          border-color: rgba(124, 58, 237, 0.05);
        }

        .premium-activity-card .activity-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: rgba(99, 102, 241, 0.07);
          color: #4F46E5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .premium-activity-card .premium-activity-row:hover .activity-icon-box {
          background-color: rgba(99, 102, 241, 0.12);
        }

        .premium-activity-card .activity-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 3px;
          overflow: hidden;
        }

        .premium-activity-card .activity-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
        }

        .premium-activity-card .activity-title-text {
          font-size: 13.5px;
          font-weight: 650;
          color: #1E293B;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .premium-activity-card .activity-desc-text {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-activity-card .activity-time-text {
          font-size: 11.5px;
          color: #94A3B8;
          white-space: nowrap;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* Empty State */
        .premium-activity-card .activity-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          color: #94A3B8;
        }

        .premium-activity-card .empty-state-icon {
          font-size: 28px;
          margin-bottom: 8px;
          opacity: 0.6;
        }

        .premium-activity-card .empty-state-text {
          font-size: 13.5px;
          font-weight: 550;
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-activity-card .premium-activity-row {
            padding: 10px;
            gap: 12px;
          }
          .premium-activity-card .activity-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .premium-activity-card .activity-time-text {
            font-size: 10.5px;
          }
        }
      `}} />
    </div>
  );
};

export default ActivityCard;
