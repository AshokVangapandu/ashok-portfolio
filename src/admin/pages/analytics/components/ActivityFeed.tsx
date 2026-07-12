/* src/admin/pages/analytics/components/ActivityFeed.tsx */
import React from 'react';
import { AnalyticsActivity } from '../../../types/analytics';

interface ActivityFeedProps {
  activities: AnalyticsActivity[];
  loading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
}) => {
  const getIcon = (type: AnalyticsActivity['type']) => {
    switch (type) {
      case 'visit':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'submission':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case 'testimonial':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case 'project':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'download':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBgColor = (type: AnalyticsActivity['type']) => {
    switch (type) {
      case 'visit': return 'rgba(124, 58, 237, 0.08)'; // Purple
      case 'submission': return 'rgba(59, 130, 246, 0.08)'; // Blue
      case 'testimonial': return 'rgba(245, 158, 11, 0.08)'; // Yellow/Gold
      case 'project': return 'rgba(16, 185, 129, 0.08)'; // Green
      case 'download': return 'rgba(107, 114, 128, 0.08)'; // Grey
      default: return 'var(--admin-surface)';
    }
  };

  const getTextColor = (type: AnalyticsActivity['type']) => {
    switch (type) {
      case 'visit': return 'var(--admin-primary)';
      case 'submission': return '#3B82F6';
      case 'testimonial': return '#F59E0B';
      case 'project': return '#10B981';
      case 'download': return '#6B7280';
      default: return 'var(--admin-text)';
    }
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: 'var(--admin-radius-md)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minWidth: '300px',
        boxShadow: 'var(--admin-shadow-sm)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        Recent Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-cell" style={{ height: '48px', borderRadius: '8px' }} />
          ))
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              {/* Left side: Icon + description details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: getBgColor(act.type),
                    color: getTextColor(act.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {getIcon(act.type)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {act.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                    {act.subtitle}
                  </span>
                </div>
              </div>

              {/* Right side: Relative timestamp */}
              <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {act.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
