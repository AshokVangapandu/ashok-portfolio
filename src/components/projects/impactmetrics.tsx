/* src/components/projects/impactmetrics.tsx */
import React from 'react';

export const ImpactMetrics: React.FC = () => {
  const metrics = [
    { value: '50K+', line1: 'DAILY', line2: 'ACTIVE USERS' },
    { value: '98%', line1: 'CLIENT', line2: 'SATISFACTION RATE' },
    { value: '60%', line1: 'REDUCED', line2: 'MANUAL WORKFLOWS' },
    { value: '40%', line1: 'FASTER', line2: 'PROCESSING SPEED' },
    { value: '100+', line1: 'ORCHESTRATED', line2: 'WORKFLOWS' }
  ];

  return (
    <div className="impact-showcase-section">
      {/* 1. Header with bullet icon */}
      <div className="impact-header-row">
        <span className="impact-sparkle-bullet">✦</span>
        <h3 className="impact-header-title">
          Proven Business Impact
        </h3>
      </div>

      {/* 2. 5-Metric Row */}
      <div className="impact-metrics-grid">
        {metrics.map((met, idx) => (
          <div key={idx} className="impact-metric-card">
            <span className="impact-metric-val">
              {met.value}
            </span>
            <span className="impact-metric-lbl">
              <span>{met.line1}</span>
              <span>{met.line2}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactMetrics;
