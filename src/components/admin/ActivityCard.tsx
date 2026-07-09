import React from 'react';

interface ActivityItem {
  id: number;
  text: string;
  time: string;
  icon: React.ReactNode;
}

export const ActivityCard: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: 1,
      text: 'Resume downloaded by recruiter',
      time: '5 mins ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      ),
    },
    {
      id: 2,
      text: 'New contact message received',
      time: '1 hour ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      id: 3,
      text: 'Testimonial submitted',
      time: '4 hours ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      text: 'Portfolio updated',
      time: '1 day ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      id: 5,
      text: 'Visitor milestone reached',
      time: '2 days ago',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <h3 className="activity-card-title">Recent Activity</h3>
      </div>
      <div className="activity-card-body">
        <div className="activity-timeline">
          {activities.map((act) => (
            <div key={act.id} className="activity-timeline-item">
              <div className="activity-timeline-badge">{act.icon}</div>
              <div className="activity-timeline-content">
                <p className="activity-timeline-text">{act.text}</p>
                <span className="activity-timeline-time">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
