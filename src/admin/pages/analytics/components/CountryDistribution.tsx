import React, { useState, useEffect } from 'react';
import { AnalyticsLocation } from '../../../types/analytics';

interface CountryDistributionProps {
  locations: AnalyticsLocation[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const CountryDistribution: React.FC<CountryDistributionProps> = ({
  locations,
  loading = false,
  error = false,
  onRetry,
}) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.cities-popover') && !target.closest('.cities-popover-trigger')) {
        setActivePopover(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopover(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getGlobeIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      width="16" 
      height="16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      style={{ flexShrink: 0, color: 'var(--admin-primary)' }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  const sortedLocations = [...(locations || [])].sort((a, b) => b.percentage - a.percentage);

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
      <style>{`
        .location-card {
          transition: all 0.2s ease-in-out;
        }
        .location-card:hover {
          transform: translateY(-2px);
          border-color: var(--admin-primary) !important;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08) !important;
        }
        .cities-popover-trigger {
          transition: all 0.15s ease;
        }
        .cities-popover-trigger:hover {
          background-color: rgba(124, 58, 237, 0.15) !important;
          color: var(--admin-primary) !important;
        }
      `}</style>

      <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
        🌍 Top Visitor Locations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {error ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
            <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 550 }}>
              Failed to load visitor locations.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
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
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '16px',
              width: '100%'
            }}
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-cell" style={{ height: '110px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : sortedLocations.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', fontWeight: 550 }}>
              No visitor locations yet.
            </span>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
              gap: '16px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {sortedLocations.map((loc) => {
              const isPopoverOpen = activePopover === loc.country;
              const cities = loc.cities || [];
              const resolvedCode = loc.countryCode || loc.code || 'GLOBE';

              return (
                <div
                  key={loc.country}
                  className="location-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: 'rgba(248, 250, 252, 0.7)',
                    borderRadius: '12px',
                    border: '1px solid var(--admin-border)',
                    boxSizing: 'border-box',
                    position: 'relative',
                    boxShadow: 'var(--admin-shadow-sm)'
                  }}
                >
                  {/* Top row: Icon + name/badge (left) & percentage/visits (right) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    
                    {/* Left: Globe Icon + Name & ISO Badge */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', maxWidth: '65%' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(124, 58, 237, 0.08)',
                          color: 'var(--admin-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {getGlobeIcon()}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                        <span 
                          style={{ 
                            fontSize: '13.5px', 
                            fontWeight: 700, 
                            color: 'var(--admin-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={loc.country === 'Unknown' ? 'Unknown' : loc.country}
                        >
                          {loc.country === 'Unknown' ? 'Unknown' : loc.country}
                        </span>
                        {resolvedCode !== 'GLOBE' && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'var(--admin-primary)',
                              backgroundColor: 'rgba(124, 58, 237, 0.06)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              width: 'fit-content',
                              textTransform: 'uppercase'
                            }}
                          >
                            {resolvedCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Percentage & Visits */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1.1 }}>
                        {loc.percentage}%
                      </span>
                      <span style={{ fontSize: '10.5px', fontWeight: 650, color: 'var(--admin-text-secondary)' }}>
                        {loc.count} {loc.count === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>

                  </div>

                  {/* Middle row: Progress bar */}
                  <div
                    style={{
                      height: '6px',
                      width: '100%',
                      backgroundColor: '#E2E8F0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${loc.percentage}%`,
                        backgroundColor: 'var(--admin-primary)',
                        borderRadius: '3px'
                      }}
                    />
                  </div>

                  {/* Bottom row: Cities */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative' }}>
                    {cities.length === 0 ? (
                      <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontStyle: 'italic' }}>
                        Unknown Location
                      </span>
                    ) : (
                      <>
                        <div 
                          style={{ 
                            fontSize: '11.5px', 
                            color: 'var(--admin-text-secondary)',
                            fontWeight: 550,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '75%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>📍</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cities.slice(0, 2).join(' • ')}
                          </span>
                        </div>

                        {cities.length > 2 && (
                          <div style={{ position: 'relative' }}>
                            <button
                              className="cities-popover-trigger"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePopover(isPopoverOpen ? null : loc.country);
                              }}
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: 'var(--admin-text-secondary)',
                                backgroundColor: 'rgba(226, 232, 240, 0.6)',
                                border: 'none',
                                padding: '3px 8px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              +{cities.length - 2}
                            </button>

                            {/* Hidden Cities Popover */}
                            {isPopoverOpen && (
                              <div
                                className="cities-popover"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'absolute',
                                  bottom: '100%',
                                  right: 0,
                                  marginBottom: '8px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid var(--admin-border)',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                  padding: '12px 14px',
                                  zIndex: 1000,
                                  minWidth: '150px',
                                  maxHeight: '160px',
                                  overflowY: 'auto',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', gap: '8px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                    Remaining Cities
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePopover(null);
                                    }}
                                    style={{
                                      border: 'none',
                                      backgroundColor: 'transparent',
                                      color: 'var(--admin-text-secondary)',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: 'bold',
                                      padding: '0 2px',
                                      lineHeight: 1
                                    }}
                                  >
                                    &times;
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--admin-text)' }}>
                                  {cities.slice(2).map((city) => (
                                    <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: 'var(--admin-primary)', fontSize: '10px' }}>&bull;</span>
                                      <span style={{ whiteSpace: 'nowrap' }}>{city}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDistribution;
