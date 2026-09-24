/* src/admin/pages/analytics/components/TrafficSourceList.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { AnalyticsSource, AnalyticsSourcesResponse, AnalyticsSourceItem } from '../../../types/analytics';

interface TrafficSourceListProps {
  sources: AnalyticsSourcesResponse | AnalyticsSource[] | any;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface SourceVisualConfig {
  icon: React.ReactNode;
  bg: string;
  color: string;
}

export const getSourceVisualConfig = (sourceName: string, type?: string): SourceVisualConfig => {
  const lowerName = (sourceName || '').toLowerCase().trim();
  const lowerType = (type || '').toLowerCase().trim();

  // 1. Direct Traffic
  if (lowerName === 'direct' || lowerType === 'direct') {
    return {
      bg: '#F3E8FF',
      color: '#7C3AED',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    };
  }

  // 2. LinkedIn
  if (lowerName.includes('linkedin') || lowerType === 'linkedin') {
    return {
      bg: '#CCFBF1',
      color: '#0D9488',
      icon: (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.98 0 1.77-.79 1.77-1.77 0-.98-.79-1.77-1.77-1.77-.98 0-1.77.79-1.77 1.77 0 .98.79 1.77 1.77 1.77m1.4 9.74v-8.37H5.06v8.37h2.8z" />
        </svg>
      ),
    };
  }

  // 3. GitHub
  if (lowerName.includes('github') || lowerType === 'github') {
    return {
      bg: '#F1F5F9',
      color: '#334155',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    };
  }

  // 4. Resume
  if (lowerName.includes('resume') || lowerType === 'resume') {
    return {
      bg: '#EDE9FE',
      color: '#6D28D9',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    };
  }

  // 5. Email
  if (lowerName.includes('email') || lowerName.includes('mail') || lowerType === 'email') {
    return {
      bg: '#FFE4E6',
      color: '#E11D48',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    };
  }

  // 6. QR Code
  if (lowerName.includes('qr') || lowerType === 'qr') {
    return {
      bg: '#DCFCE7',
      color: '#15803D',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    };
  }

  // 7. Search Engines (Google, Bing, DuckDuckGo)
  if (
    lowerName.includes('search') ||
    lowerName.includes('google') ||
    lowerName.includes('bing') ||
    lowerName.includes('duckduckgo') ||
    lowerType === 'google' ||
    lowerType === 'search'
  ) {
    return {
      bg: '#E0F2FE',
      color: '#0284C7',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16" y2="16" />
        </svg>
      ),
    };
  }

  // 8. Referral / External Web
  if (lowerName.includes('referral') || lowerName.includes('web') || lowerType === 'referral') {
    return {
      bg: '#FEF3C7',
      color: '#D97706',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    };
  }

  // 9. Social Networks
  if (
    lowerName.includes('twitter') ||
    lowerName.includes('x (') ||
    lowerName.includes('reddit') ||
    lowerName.includes('youtube') ||
    lowerName.includes('facebook') ||
    lowerName.includes('instagram') ||
    lowerType === 'social'
  ) {
    return {
      bg: '#FEE2E2',
      color: '#DC2626',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
    };
  }

  // 10. Default / Others / Unknown
  return {
    bg: '#F3E8FF',
    color: '#7C3AED',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  };
};

export const TrafficSourceList: React.FC<TrafficSourceListProps> = ({
  sources,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [showOthersModal, setShowOthersModal] = useState<boolean>(false);
  const othersCardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close popup on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOthersModal(false);
      }
    };
    if (showOthersModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showOthersModal]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showOthersModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        othersCardRef.current &&
        !othersCardRef.current.contains(e.target as Node)
      ) {
        setShowOthersModal(false);
      }
    };
    if (showOthersModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOthersModal]);

  // 1. Normalize response from backend
  let topSourcesList: AnalyticsSourceItem[] = [];
  let othersData: { count: number; percentage: number; sources: AnalyticsSourceItem[] } = {
    count: 0,
    percentage: 0,
    sources: [],
  };
  let totalVisits = 0;

  if (sources && typeof sources === 'object') {
    if (Array.isArray(sources.topSources)) {
      // Structured backend RPC object
      topSourcesList = sources.topSources;
      if (sources.others) {
        othersData = sources.others;
      }
      totalVisits = sources.totalCount ?? (
        topSourcesList.reduce((sum, s) => sum + (s.count || 0), 0) + (othersData.count || 0)
      );
    } else if (Array.isArray(sources)) {
      // Legacy array fallback
      const nonOthers = sources.filter((s: any) => !s.isOthers && s.source !== 'Others');
      const backendOthers = sources.find((s: any) => s.isOthers || s.source === 'Others');
      topSourcesList = nonOthers.slice(0, 3).map((s: any, idx: number) => ({
        rank: idx + 1,
        source: s.source,
        display: s.display || s.source,
        count: s.count ?? s.visits ?? 0,
        percentage: s.percentage || 0,
        type: s.type || 'other',
      }));

      const remainingSources = nonOthers.slice(3).map((s: any, idx: number) => ({
        rank: idx + 4,
        source: s.source,
        display: s.display || s.source,
        count: s.count ?? s.visits ?? 0,
        percentage: s.percentage || 0,
        type: s.type || 'other',
      }));

      const othersCount = backendOthers
        ? (backendOthers.count ?? backendOthers.visits ?? 0)
        : remainingSources.reduce((sum, s) => sum + s.count, 0);

      othersData = {
        count: othersCount,
        percentage: backendOthers ? backendOthers.percentage : 0,
        sources: remainingSources,
      };

      totalVisits = sources.reduce((sum: number, s: any) => sum + (s.count ?? s.visits ?? 0), 0);
    }
  }

  // 2. Build 4 items for 2x2 grid
  const itemsToDisplay: {
    rank?: number;
    source: string;
    visits: number;
    type: string;
    isOthers: boolean;
    rawPct: number;
  }[] = [
    ...topSourcesList.slice(0, 3).map((s, idx) => ({
      rank: idx + 1,
      source: s.display || s.source,
      visits: s.count || 0,
      type: s.type || 'other',
      isOthers: false,
      rawPct:
        typeof s.percentage === 'number' && s.percentage > 0
          ? s.percentage
          : totalVisits > 0
          ? ((s.count || 0) / totalVisits) * 100
          : 0,
    })),
    {
      source: 'Others',
      visits: othersData.count || 0,
      type: 'other',
      isOthers: true,
      rawPct:
        typeof othersData.percentage === 'number' && othersData.percentage > 0
          ? othersData.percentage
          : totalVisits > 0
          ? (othersData.count / totalVisits) * 100
          : 0,
    },
  ];

  // Adjust percentages so the displayed sum is exactly 100%
  const roundedPercentages = itemsToDisplay.map((item) => Math.round(item.rawPct));
  const currentSum = roundedPercentages.reduce((a, b) => a + b, 0);
  const diff = 100 - currentSum;

  if (diff !== 0 && totalVisits > 0) {
    let maxIdx = 0;
    let maxVal = -1;
    itemsToDisplay.forEach((item, idx) => {
      if (item.visits > 0 && item.rawPct > maxVal) {
        maxVal = item.rawPct;
        maxIdx = idx;
      }
    });
    roundedPercentages[maxIdx] += diff;
  }

  const displayCards = itemsToDisplay.map((item, idx) => ({
    rank: item.rank,
    source: item.source,
    visits: item.visits,
    percentage: roundedPercentages[idx],
    type: item.type,
    isOthers: item.isOthers,
  }));

  return (
    <div
      className="traffic-sources-container-card"
      style={{
        flex: 1,
        minWidth: '320px',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '22px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        {/* Softly Rounded Square Purple Icon Box */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#F3E8FF',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.06)',
          }}
        >
          {/* Bar Chart Icon */}
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 20v-5" />
            <path d="M10 20v-11" />
            <path d="M14 20v-8" />
            <path d="M18 20v-14" />
            <path d="M4 20h16" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Traffic Sources
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 500,
              color: '#64748B',
              lineHeight: 1.2,
            }}
          >
            Where your visitors are coming from
          </p>
        </div>
      </div>

      {/* Content Section: Error, Loading Skeleton, Empty State, or 2x2 Grid */}
      {error ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '220px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>
            Failed to load traffic sources.
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #EF4444',
                backgroundColor: 'transparent',
                color: '#EF4444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Retry
            </button>
          )}
        </div>
      ) : loading ? (
        <div className="source-grid-container">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="source-skeleton-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(241, 245, 249, 0.9)',
                borderRadius: '16px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="ts-shimmer" style={{ width: '22px', height: '18px', borderRadius: '4px' }} />
                  <div className="ts-shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="ts-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
                    <div className="ts-shimmer" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
                  </div>
                </div>
                <div className="ts-shimmer" style={{ width: '42px', height: '22px', borderRadius: '6px' }} />
              </div>
              <div className="ts-shimmer" style={{ width: '100%', height: '6px', borderRadius: '999px' }} />
            </div>
          ))}
        </div>
      ) : totalVisits === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '220px',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
            No traffic sources recorded yet.
          </span>
        </div>
      ) : (
        <div className="source-grid-container">
          {displayCards.map((card, idx) => {
            const config = getSourceVisualConfig(card.source, card.type);

            return (
              <div
                key={card.source + idx}
                ref={card.isOthers ? othersCardRef : undefined}
                className="source-panel"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.85)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
              >
                {/* Top Details Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: '14px',
                  }}
                >
                  {/* Left: Rank + Icon + (Source Name & Visits) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {/* Rank Badge for Top 3 */}
                    {card.rank && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#7C3AED',
                          backgroundColor: '#F3E8FF',
                          padding: '3px 7px',
                          borderRadius: '6px',
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        #{card.rank}
                      </span>
                    )}

                    {/* Source Icon */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: config.bg,
                        color: config.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </div>

                    {/* Source Name & Visits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '14.5px',
                            fontWeight: 700,
                            color: '#0F172A',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={card.isOthers ? '+ Others' : card.source}
                        >
                          {card.isOthers ? '+ Others' : card.source}
                        </span>

                        {/* View/Eye button on Others card */}
                        {card.isOthers && (
                          <button
                            type="button"
                            onClick={() => setShowOthersModal((prev) => !prev)}
                            aria-label="View other traffic sources details"
                            title="View breakdown of other traffic sources"
                            style={{
                              border: 'none',
                              backgroundColor: showOthersModal ? '#EDE9FE' : '#F3E8FF',
                              color: '#7C3AED',
                              borderRadius: '6px',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '3px',
                              transition: 'all 0.15s ease',
                              outline: 'none',
                            }}
                          >
                            {/* Eye Icon */}
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span style={{ fontSize: '10.5px', fontWeight: 700 }}>View</span>
                          </button>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#64748B',
                          lineHeight: 1.2,
                        }}
                      >
                        {card.visits} {card.visits === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Percentage */}
                  <div style={{ flexShrink: 0, paddingLeft: '8px' }}>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#7C3AED',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {card.percentage}%
                    </span>
                  </div>
                </div>

                {/* Bottom: Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(card.percentage > 0 ? 3 : 0, card.percentage))}%`,
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini Popover for Others breakdown */}
      {showOthersModal && (
        <div
          ref={modalRef}
          role="dialog"
          aria-label="Other Traffic Sources Breakdown"
          style={{
            position: 'absolute',
            right: '24px',
            bottom: '24px',
            width: '320px',
            maxWidth: 'calc(100% - 48px)',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 12px 32px -4px rgba(124, 58, 237, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06)',
            padding: '16px',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeInPop 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: '#F3E8FF',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                Other Traffic Sources
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOthersModal(false)}
              aria-label="Close"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Sources List */}
          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingRight: '4px',
            }}
          >
            {othersData.sources.length === 0 ? (
              <span style={{ fontSize: '12.5px', color: '#64748B', padding: '12px 0', textAlign: 'center' }}>
                No additional traffic sources recorded.
              </span>
            ) : (
              othersData.sources.map((src, idx) => {
                const cfg = getSourceVisualConfig(src.display || src.source, src.type);
                const pct = typeof src.percentage === 'number'
                  ? Math.round(src.percentage)
                  : totalVisits > 0
                  ? Math.round((src.count / totalVisits) * 100)
                  : 0;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid rgba(226, 232, 240, 0.6)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {cfg.icon}
                      </div>
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#1E293B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={src.display || src.source}
                      >
                        {src.display || src.source}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                        {src.count} {src.count === 1 ? 'visit' : 'visits'}
                      </span>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: '#7C3AED',
                          backgroundColor: '#F3E8FF',
                          padding: '2px 6px',
                          borderRadius: '6px',
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Total */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '10px',
              fontSize: '12px',
              color: '#475569',
              fontWeight: 600,
            }}
          >
            <span>Total Other Visits:</span>
            <span style={{ fontWeight: 700, color: '#7C3AED' }}>
              {othersData.count} {othersData.count === 1 ? 'Visit' : 'Visits'} ({Math.round(othersData.percentage || 0)}%)
            </span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .source-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        .source-panel:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
        }

        @keyframes fadeInPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes tsShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .ts-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: tsShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .source-grid-container {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  );
};

export default TrafficSourceList;
