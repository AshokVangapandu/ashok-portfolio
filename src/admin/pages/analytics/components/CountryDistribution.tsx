/* src/admin/pages/analytics/components/CountryDistribution.tsx */
import React, { useState } from 'react';
import worldMapBg from '../../../../../assets/images/analytics-world-map.png';
import { AnalyticsLocation } from '../../../types/analytics';

interface CountryDistributionProps {
  locations: AnalyticsLocation[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

// Map common country names to 2-letter ISO codes for flagcdn
const COUNTRY_CODE_MAP: Record<string, string> = {
  'india': 'in',
  'united states': 'us',
  'united states of america': 'us',
  'usa': 'us',
  'united arab emirates': 'ae',
  'uae': 'ae',
  'united kingdom': 'gb',
  'uk': 'gb',
  'great britain': 'gb',
  'germany': 'de',
  'canada': 'ca',
  'australia': 'au',
  'france': 'fr',
  'singapore': 'sg',
  'japan': 'jp',
  'china': 'cn',
  'brazil': 'br',
  'netherlands': 'nl',
  'spain': 'es',
  'italy': 'it',
  'switzerland': 'ch',
  'sweden': 'se',
  'south korea': 'kr',
  'korea': 'kr',
  'russia': 'ru',
  'mexico': 'mx',
  'indonesia': 'id',
  'saudi arabia': 'sa',
  'turkey': 'tr',
  'poland': 'pl',
  'south africa': 'za',
  'egypt': 'eg',
  'ireland': 'ie',
  'denmark': 'dk',
  'norway': 'no',
  'finland': 'fi',
  'belgium': 'be',
  'austria': 'at',
  'new zealand': 'nz',
  'portugal': 'pt',
  'israel': 'il',
  'vietnam': 'vn',
  'thailand': 'th',
  'malaysia': 'my',
  'philippines': 'ph',
  'taiwan': 'tw',
  'hong kong': 'hk',
  'nigeria': 'ng',
  'kenya': 'ke',
  'argentina': 'ar',
  'colombia': 'co',
  'chile': 'cl',
  'pakistan': 'pk',
  'bangladesh': 'bd',
  'sri lanka': 'lk',
  'qatar': 'qa',
  'kuwait': 'kw',
  'oman': 'om',
  'bahrain': 'bh',
};

const resolveIsoCode = (countryName: string, rawCode?: string): string => {
  if (rawCode && rawCode.length === 2 && rawCode.toUpperCase() !== 'GL') {
    return rawCode.toLowerCase();
  }
  const cleanName = countryName.toLowerCase().trim();
  if (COUNTRY_CODE_MAP[cleanName]) {
    return COUNTRY_CODE_MAP[cleanName];
  }
  return '';
};

const getEmojiFlag = (iso: string): string => {
  if (!iso || iso.length !== 2) return '🌐';
  try {
    const codePoints = iso
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
};

// Flag Icon Component with image + emoji fallback
const CountryFlag: React.FC<{ country: string; isoCode: string }> = ({ country, isoCode }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (!isoCode || imgFailed) {
    return (
      <span
        style={{
          fontSize: '24px',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '26px',
          flexShrink: 0,
        }}
        title={country}
      >
        {getEmojiFlag(isoCode)}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w80/${isoCode.toLowerCase()}.png`}
      alt={country}
      onError={() => setImgFailed(true)}
      style={{
        width: '36px',
        height: '26px',
        borderRadius: '6px',
        objectFit: 'cover',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        flexShrink: 0,
      }}
    />
  );
};

interface ProcessedLocationItem {
  rank?: number;
  country: string;
  visits: number;
  percentage: number;
  isoCode: string;
  isOthers?: boolean;
}

export const CountryDistribution: React.FC<CountryDistributionProps> = ({
  locations = [],
  loading = false,
  error = false,
  onRetry,
}) => {
  // Sort locations descending
  const sorted = [...(locations || [])].sort(
    (a, b) => (b.count || 0) - (a.count || 0) || (b.percentage || 0) - (a.percentage || 0)
  );

  const totalVisits = sorted.reduce((sum, l) => sum + (l.count || 0), 0);

  // Top 3 countries
  const top3 = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  const displayItems: ProcessedLocationItem[] = top3.map((loc, idx) => {
    const rawPct = typeof loc.percentage === 'number' && loc.percentage > 0
      ? loc.percentage
      : totalVisits > 0
      ? Math.round(((loc.count || 0) / totalVisits) * 100)
      : 0;

    return {
      rank: idx + 1,
      country: loc.country === 'Unknown' ? 'Unknown' : loc.country,
      visits: loc.count || 0,
      percentage: rawPct,
      isoCode: resolveIsoCode(loc.country, loc.countryCode || loc.code),
      isOthers: false,
    };
  });

  // Calculate 4th "Others" item
  if (remaining.length > 0 || (sorted.length > 0 && displayItems.length < 4)) {
    const othersVisits = remaining.reduce((sum, l) => sum + (l.count || 0), 0);
    const top3PctSum = displayItems.reduce((sum, item) => sum + item.percentage, 0);
    const othersPercentage = remaining.length > 0
      ? Math.max(0, 100 - top3PctSum)
      : 0;

    displayItems.push({
      country: 'Others',
      visits: othersVisits,
      percentage: othersPercentage,
      isoCode: '',
      isOthers: true,
    });
  }

  // Ensure exactly 4 items for 2x2 grid if there are some locations
  while (displayItems.length > 0 && displayItems.length < 4) {
    displayItems.push({
      country: 'Others',
      visits: 0,
      percentage: 0,
      isoCode: '',
      isOthers: true,
    });
  }

  return (
    <div
      className="top-visitor-locations-card"
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
        overflow: 'hidden',
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      {/* Decorative World Map Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${worldMapBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Card Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          {/* Purple Globe Icon Box */}
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
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
              Top Visitor Locations
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
              Visitors from different countries around the world
            </p>
          </div>
        </div>

        {/* Content Body: Error, Loading Skeleton, Empty, or 2x2 Grid */}
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
              Failed to load visitor locations.
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
          <div className="location-grid-container">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="location-skeleton-card"
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
                    <div className="loc-shimmer" style={{ width: '22px', height: '18px', borderRadius: '4px' }} />
                    <div className="loc-shimmer" style={{ width: '36px', height: '26px', borderRadius: '6px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="loc-shimmer" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
                      <div className="loc-shimmer" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div className="loc-shimmer" style={{ width: '42px', height: '22px', borderRadius: '6px' }} />
                </div>
                <div className="loc-shimmer" style={{ width: '100%', height: '6px', borderRadius: '999px' }} />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
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
              No visitor locations recorded yet.
            </span>
          </div>
        ) : (
          <div className="location-grid-container">
            {displayItems.map((item, idx) => (
              <div
                key={item.country + idx}
                className="location-panel"
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
                  {/* Left: Rank + Flag/Icon + (Name & Visits) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {/* Rank Badge for Top 3 */}
                    {item.rank && (
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
                        #{item.rank}
                      </span>
                    )}

                    {/* Flag or Others Icon */}
                    {item.isOthers ? (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#F3E8FF',
                          color: '#7C3AED',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {/* Users/People SVG Icon */}
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                          stroke="none"
                        >
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                      </div>
                    ) : (
                      <CountryFlag country={item.country} isoCode={item.isoCode} />
                    )}

                    {/* Country Name & Visits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
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
                        title={item.country}
                      >
                        {item.country}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#64748B',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.visits} {item.visits === 1 ? 'Visit' : 'Visits'}
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
                      {item.percentage}%
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
                      width: `${Math.min(100, Math.max(item.percentage > 0 ? 3 : 0, item.percentage))}%`,
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .location-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        .location-panel:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.35) !important;
          box-shadow: 0 6px 18px -2px rgba(124, 58, 237, 0.08) !important;
        }

        @keyframes locShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .loc-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: locShimmer 1.5s infinite linear;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .location-grid-container {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  );
};

export default CountryDistribution;
