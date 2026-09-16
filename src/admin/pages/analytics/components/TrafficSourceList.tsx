/* src/admin/pages/analytics/components/TrafficSourceList.tsx */
import React from 'react';
import { AnalyticsSource } from '../../../types/analytics';

interface TrafficSourceListProps {
  sources: AnalyticsSource[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

interface SourceVisualConfig {
  icon: React.ReactNode;
  bg: string;
  color: string;
}

const getSourceVisualConfig = (sourceName: string, type?: string): SourceVisualConfig => {
  const lowerName = (sourceName || '').toLowerCase().trim();
  const lowerType = (type || '').toLowerCase().trim();

  // Direct
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

  // Search / Google
  if (lowerName.includes('search') || lowerName.includes('google') || lowerType === 'google') {
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

  // LinkedIn
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

  // Referral / Global
  if (lowerName.includes('referral') || lowerName.includes('web') || lowerName.includes('network')) {
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

  // Email / Newsletter
  if (lowerName.includes('email') || lowerName.includes('mail') || lowerName.includes('newsletter')) {
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

  // GitHub
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

  // Default / Other
  return {
    bg: '#F3E8FF',
    color: '#7C3AED',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  };
};

export const TrafficSourceList: React.FC<TrafficSourceListProps> = ({
  sources = [],
  loading = false,
  error = false,
  onRetry,
}) => {
  // Aggregate, deduplicate, and normalize traffic sources
  const aggregatedMap = new Map<string, AnalyticsSource & { count?: number; visits?: number }>();

  (sources || []).forEach((src) => {
    if (!src || !src.source) return;
    const rawSource = src.source.trim();
    const lower = rawSource.toLowerCase();

    // Filter out development/local environment traffic
    if (
      lower === 'localhost' ||
      lower === '127.0.0.1' ||
      lower.includes('localhost') ||
      lower.includes('127.0.0.1')
    ) {
      return;
    }

    // Canonical display name and map key
    const displayLabel = lower === 'direct' ? 'Direct' : rawSource;
    const key = displayLabel.toLowerCase();

    const rawCount = (src as any).count ?? (src as any).visits;

    if (aggregatedMap.has(key)) {
      const existing = aggregatedMap.get(key)!;
      existing.percentage = Math.min(100, (existing.percentage || 0) + (src.percentage || 0));
      if (rawCount !== undefined && rawCount !== null) {
        existing.count = (existing.count || 0) + Number(rawCount);
      }
    } else {
      aggregatedMap.set(key, {
        ...src,
        source: displayLabel,
        percentage: src.percentage || 0,
        type: src.type || (lower === 'direct' ? 'direct' : 'other'),
        count: rawCount !== undefined && rawCount !== null ? Number(rawCount) : undefined,
      });
    }
  });

  // Dynamic ranking based on all available sources
  const processedSources = Array.from(aggregatedMap.values())
    .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
    .map((src, idx) => ({
      ...src,
      rank: idx + 1,
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

      {/* Content Section: Error, Loading Skeleton, Empty State, or Rows */}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="ts-skeleton-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(241, 245, 249, 0.9)',
                borderRadius: '16px',
              }}
            >
              <div className="ts-shimmer" style={{ width: '24px', height: '16px', borderRadius: '4px' }} />
              <div className="ts-shimmer" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ts-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
                  <div className="ts-shimmer" style={{ width: '50px', height: '12px', borderRadius: '4px' }} />
                </div>
                <div className="ts-shimmer" style={{ width: '100%', height: '5px', borderRadius: '999px' }} />
              </div>
              <div className="ts-shimmer" style={{ width: '48px', height: '26px', borderRadius: '20px' }} />
            </div>
          ))}
        </div>
      ) : processedSources.length === 0 ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {processedSources.map((src) => {
            const config = getSourceVisualConfig(src.source, src.type);
            const countVal = src.count ?? (src as any).visits;
            const visitsText =
              countVal !== undefined && countVal !== null
                ? `${countVal} ${countVal === 1 ? 'Visit' : 'Visits'}`
                : null;

            return (
              <div
                key={`${src.source}-${src.rank}`}
                className="traffic-source-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.85)',
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  boxSizing: 'border-box',
                }}
              >
                {/* 1. Rank */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#64748B',
                    width: '24px',
                    flexShrink: 0,
                    textAlign: 'left',
                  }}
                >
                  #{src.rank}
                </span>

                {/* 2. Source Icon Box */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
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

                {/* 3. Middle Section: Source Name + Visit Count on top, Progress Bar below */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
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
                      title={src.source}
                    >
                      {src.source}
                    </span>
                    {visitsText && (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#64748B',
                          lineHeight: 1.2,
                          flexShrink: 0,
                          paddingLeft: '8px',
                        }}
                      >
                        {visitsText}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: '#F1F5F9',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(src.percentage > 0 ? 3 : 0, src.percentage))}%`,
                        background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                        borderRadius: '999px',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                </div>

                {/* 4. Percentage Pill */}
                <div
                  style={{
                    backgroundColor: '#F3E8FF',
                    color: '#7C3AED',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    minWidth: '44px',
                    textAlign: 'center',
                    flexShrink: 0,
                    marginLeft: '4px',
                  }}
                >
                  {src.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .traffic-source-row:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
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
      ` }} />
    </div>
  );
};

export default TrafficSourceList;
