import React from 'react';

export const AnalyticsCard: React.FC = () => {
  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div className="analytics-card-title-group">
          <h3 className="analytics-card-title">Visitor Analytics</h3>
          <p className="analytics-card-subtitle">Unique visitors over time</p>
        </div>
        <div className="analytics-card-filters">
          <button type="button" className="filter-chip active">7 Days</button>
          <button type="button" className="filter-chip">30 Days</button>
          <button type="button" className="filter-chip">90 Days</button>
        </div>
      </div>
      <div className="analytics-card-body">
        {/* Vector SVG mock chart */}
        <div className="analytics-chart-container">
          <svg className="analytics-mock-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(143, 133, 255, 0.25)" />
                <stop offset="100%" stopColor="rgba(143, 133, 255, 0.0)" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(220, 231, 255, 0.04)" strokeWidth="1" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(220, 231, 255, 0.04)" strokeWidth="1" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(220, 231, 255, 0.04)" strokeWidth="1" />
            
            {/* Main Area Path */}
            <path
              d="M0,160 Q60,110 120,130 T240,80 T360,95 T480,50 L500,50 L500,200 L0,200 Z"
              fill="url(#chart-grad)"
            />
            {/* Main Line Path */}
            <path
              d="M0,160 Q60,110 120,130 T240,80 T360,95 T480,50 L500,50"
              fill="none"
              stroke="#8f85ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            
            {/* Interactive node indicator dots */}
            <circle cx="120" cy="130" r="5" fill="#8f85ff" stroke="#090d18" strokeWidth="2" />
            <circle cx="240" cy="80" r="5" fill="#8f85ff" stroke="#090d18" strokeWidth="2" />
            <circle cx="480" cy="50" r="5" fill="#8f85ff" stroke="#090d18" strokeWidth="2" />
          </svg>
          
          {/* Mock X-Axis labels */}
          <div className="analytics-chart-axis">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
