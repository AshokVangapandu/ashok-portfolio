/* src/components/projects/ImpactMetrics.tsx */
import React from 'react';

export const ImpactMetrics: React.FC = () => {
  const metrics = [
    { value: '50K+', label: 'Daily Active Users' },
    { value: '98%', label: 'Client Satisfaction Rate' },
    { value: '60%', label: 'Reduced Manual Workflows' },
    { value: '40%', label: 'Faster Processing Speed' },
    { value: '100+', label: 'Orchestrated Workflows' }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '24px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#A78BFA' }}>★</span>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Proven Business Impact
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '32px',
          width: '100%'
        }}
        className="impact-metrics-row"
      >
        {metrics.map((met, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minWidth: '160px',
              textAlign: 'left'
            }}
          >
            <span
              style={{
                fontSize: '40px',
                fontWeight: 850,
                background: 'linear-gradient(135deg, #10B981, #34D399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
                lineHeight: 1
              }}
            >
              {met.value}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.3 }}>
              {met.label.split(' ')[0]} <br /> {met.label.split(' ').slice(1).join(' ')}
            </span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .impact-metrics-row {
            justify-content: flex-start !important;
          }
        }
      `}} />
    </div>
  );
};

export default ImpactMetrics;
