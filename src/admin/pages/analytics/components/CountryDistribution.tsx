/* src/admin/pages/analytics/components/CountryDistribution.tsx */
import React from 'react';
import { AnalyticsLocation } from '../../../types/analytics';

interface CountryDistributionProps {
  locations: AnalyticsLocation[];
  loading?: boolean;
}

export const CountryDistribution: React.FC<CountryDistributionProps> = ({
  locations,
  loading = false,
}) => {
  const getFlagEmoji = (code: string) => {
    switch (code) {
      case 'IN': return '🇮🇳';
      case 'US': return '🇺🇸';
      case 'DE': return '🇩🇪';
      case 'GB': return '🇬🇧';
      case 'CA': return '🇨🇦';
      default: return '🌐';
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
        🌍 Visitor Locations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="skeleton-cell" style={{ height: '32px', borderRadius: '6px' }} />
          ))
        ) : (
          locations.map((loc) => (
            <div key={loc.country} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Top row text segments */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getFlagEmoji(loc.code)}</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--admin-text)' }}>
                    {loc.country}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
                  {loc.count.toLocaleString()} - {loc.percentage}%
                </span>
              </div>

              {/* Progress bar line */}
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#F1F5F9',
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CountryDistribution;
