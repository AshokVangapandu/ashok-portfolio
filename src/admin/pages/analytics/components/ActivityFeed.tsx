/* src/admin/pages/analytics/components/ActivityFeed.tsx */
import React, { useState, useEffect, useMemo } from 'react';
import { AnalyticsActivity } from '../../../types/analytics';

interface ActivityFeedProps {
  activities: AnalyticsActivity[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface AggregatedActivity extends Omit<AnalyticsActivity, 'type'> {
  type: AnalyticsActivity['type'] | 'visit_batch';
  visitorCount?: number;
  cities?: string[];
}

// Client-side relative timestamp formatter
const getRelativeTimeText = (eventTimeStr?: string, fallbackText: string = ''): string => {
  if (!eventTimeStr) return fallbackText;

  const date = new Date(eventTimeStr);
  if (isNaN(date.getTime())) return fallbackText;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDays}d ago`;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = [],
  loading = false,
  error = false,
  onRetry,
}) => {
  // Local state ticker to trigger rerenders of relative timestamps
  const [_, setTick] = useState<number>(0);
  // Holds unique IDs of batches that are expanded inline
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 15000); // Ticks every 15 seconds
    return () => clearInterval(timer);
  }, []);

  const toggleExpand = (batchId: string) => {
    setExpandedBatches((prev) => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  // Grouping/Aggregation Algorithm (rolling 2-hour window)
  const aggregatedActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];

    const result: AggregatedActivity[] = [];
    let activeBatch: {
      id: string;
      visitorCount: number;
      cities: string[];
      newestEventTime: string;
      newestTimeStr: string;
    } | null = null;

    activities.forEach((act) => {
      const isVisitor = act.type === 'visit';

      if (isVisitor) {
        const eventTime = act.event_time ? new Date(act.event_time) : null;

        if (activeBatch && eventTime) {
          const batchTime = new Date(activeBatch.newestEventTime);
          const diffMs = Math.abs(batchTime.getTime() - eventTime.getTime());

          // Merge if within 2 hours rolling span (2h = 7,200,000 ms)
          if (diffMs <= 2 * 60 * 60 * 1000) {
            activeBatch.visitorCount += 1;
            const city = act.subtitle ? act.subtitle.split(',')[0].trim() : 'Unknown';
            if (city && city !== 'Unknown' && !activeBatch.cities.includes(city)) {
              activeBatch.cities.push(city);
            }
            return;
          }
        }

        // Close active batch and start a new one
        const currentBatch = activeBatch;
        if (currentBatch) {
          result.push({
            id: currentBatch.id,
            type: 'visit_batch',
            title: currentBatch.visitorCount === 1 ? 'New Visitor' : `${currentBatch.visitorCount} New Visitors`,
            subtitle: currentBatch.cities.join(' • ') || 'Unknown Location',
            time: currentBatch.newestTimeStr,
            event_time: currentBatch.newestEventTime,
            visitorCount: currentBatch.visitorCount,
            cities: currentBatch.cities
          });
          activeBatch = null;
        }

        const city = act.subtitle ? act.subtitle.split(',')[0].trim() : 'Unknown';
        activeBatch = {
          id: act.id,
          visitorCount: 1,
          cities: city && city !== 'Unknown' ? [city] : [],
          newestEventTime: act.event_time || new Date().toISOString(),
          newestTimeStr: act.time
        };
      } else {
        // High-priority event terminates active batch
        const currentBatch = activeBatch;
        if (currentBatch) {
          result.push({
            id: currentBatch.id,
            type: 'visit_batch',
            title: currentBatch.visitorCount === 1 ? 'New Visitor' : `${currentBatch.visitorCount} New Visitors`,
            subtitle: currentBatch.cities.join(' • ') || 'Unknown Location',
            time: currentBatch.newestTimeStr,
            event_time: currentBatch.newestEventTime,
            visitorCount: currentBatch.visitorCount,
            cities: currentBatch.cities
          });
          activeBatch = null;
        }

        result.push(act);
      }
    });

    // Flush final active batch
    const finalBatch = activeBatch as any;
    if (finalBatch) {
      result.push({
        id: finalBatch.id,
        type: 'visit_batch',
        title: finalBatch.visitorCount === 1 ? 'New Visitor' : `${finalBatch.visitorCount} New Visitors`,
        subtitle: finalBatch.cities.join(' • ') || 'Unknown Location',
        time: finalBatch.newestTimeStr,
        event_time: finalBatch.newestEventTime,
        visitorCount: finalBatch.visitorCount,
        cities: finalBatch.cities
      });
    }

    return result;
  }, [activities]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'visit_batch':
        // Premium group users icon for batched visitors
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
        // Fallback Bell icon for unknown types
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'visit':
      case 'visit_batch':
        return 'rgba(124, 58, 237, 0.08)'; // Purple
      case 'submission': return 'rgba(59, 130, 246, 0.08)'; // Blue
      case 'testimonial': return 'rgba(245, 158, 11, 0.08)'; // Yellow/Gold
      case 'project': return 'rgba(16, 185, 129, 0.08)'; // Green
      case 'download': return 'rgba(107, 114, 128, 0.08)'; // Grey
      default: return 'rgba(226, 232, 240, 0.4)'; // Light slate fallback
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'visit':
      case 'visit_batch':
        return 'var(--admin-primary)';
      case 'submission': return '#3B82F6';
      case 'testimonial': return '#F59E0B';
      case 'project': return '#10B981';
      case 'download': return '#6B7280';
      default: return '#475569'; // Slate fallback
    }
  };

  // Limit final widget size to latest 8 records
  const displayedActivities = aggregatedActivities.slice(0, 8);

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
        fontFamily: "'Manrope', sans-serif",
        height: '335px'
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        Recent Activity
      </h3>

      <div
        className="activity-scroll-area"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
          overflowY: 'auto',
          paddingRight: '6px',
          paddingBlock: '8px',
        }}
      >
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load recent activity.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="activity-retry-btn"
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #EF4444',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                height: '38px',
                animation: 'activitySkeletonShimmer 1.5s infinite ease-in-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F1F5F9' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '120px', height: '11px', borderRadius: '4px', backgroundColor: '#F1F5F9' }} />
                  <div style={{ width: '80px', height: '8px', borderRadius: '3px', backgroundColor: '#F1F5F9' }} />
                </div>
              </div>
              <div style={{ width: '36px', height: '8px', borderRadius: '3px', backgroundColor: '#F1F5F9' }} />
            </div>
          ))
        ) : displayedActivities.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '180px' }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No activity logged during this period.
            </span>
          </div>
        ) : (
          displayedActivities.map((act) => {
            const isBatch = act.type === 'visit_batch';
            const cities = act.cities || [];
            const isExpanded = expandedBatches.has(act.id);

            // Construct subtitle with city aggregates and inline expander clicks
            let subtitleNode: React.ReactNode = act.subtitle;
            if (isBatch) {
              if (cities.length === 0) {
                subtitleNode = 'Unknown Location';
              } else if (cities.length <= 2) {
                subtitleNode = cities.join(' • ');
              } else {
                subtitleNode = (
                  <span>
                    {isExpanded ? cities.join(' • ') : cities.slice(0, 2).join(' • ')}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(act.id);
                      }}
                      style={{
                        color: 'var(--admin-primary)',
                        cursor: 'pointer',
                        fontWeight: 650,
                        marginLeft: '5px',
                        textDecoration: 'underline'
                      }}
                      className="activity-expander"
                    >
                      {isExpanded ? 'show less' : `+${cities.length - 2}`}
                    </span>
                  </span>
                );
              }
            }

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  animation: 'activityFadeIn 300ms ease-out forwards'
                }}
              >
                {/* Left side: Icon + description details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
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

                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: 'var(--admin-text)',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {act.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--admin-text-secondary)',
                        fontWeight: 500,
                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                    >
                      {subtitleNode}
                    </span>
                  </div>
                </div>

                {/* Right side: Relative timestamp */}
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap', alignSelf: 'flex-start', paddingTop: '4px' }}>
                  {getRelativeTimeText(act.event_time, act.time)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes activitySkeletonShimmer {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        @keyframes activityFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .activity-retry-btn:hover {
          background-color: #FEF2F2 !important;
        }
        .activity-expander:hover {
          opacity: 0.8;
        }

        /* Subtle scrollbar */
        .activity-scroll-area::-webkit-scrollbar {
          width: 5px;
        }
        .activity-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .activity-scroll-area::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .activity-scroll-area::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }

        /* Auto-hide scrollbar until hover */
        .activity-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.3s;
          /* Edge fading mask to hint at scroll content */
          mask-image: linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%);
        }
        .activity-scroll-area:hover {
          scrollbar-color: #CBD5E1 transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .activity-scroll-area {
            transition: none !important;
          }
        }
      `}} />
    </div>
  );
};

export default ActivityFeed;
