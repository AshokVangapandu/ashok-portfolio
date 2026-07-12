/* src/components/tools/ProductMetrics.tsx */
import React from 'react';

export const ProductMetrics: React.FC = () => {
  const metrics = [
    { label: 'Downloads', value: '40,231' },
    { label: 'GitHub Stars', value: '1.2K' },
    { label: 'Installs', value: '3,841' },
    { label: 'Versions', value: '18' },
    { label: 'Last Updated', value: '2 days ago' },
    { label: 'Platforms', value: 'Web, Mendix' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#A78BFA' }}>★</span>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Product Metrics
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px 24px',
          width: '100%'
        }}
        className="metrics-borderless-grid"
      >
        {metrics.map((m, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {m.label}
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 850,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 600px) {
          .metrics-borderless-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProductMetrics;
