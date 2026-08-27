/* src/components/admin/AnalyticsCard.tsx */
import React, { useState } from 'react';

type TimeRange = '7d' | '30d' | '90d';

interface ChartPoint {
  x: number;
  y: number;
  label: string;
  value: string;
}

export const AnalyticsCard: React.FC = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>('7d');

  // Hardcoded premium curve details for each range to render organic transitions
  const chartConfigs: Record<TimeRange, {
    subtitle: string;
    pathLine: string;
    pathArea: string;
    points: ChartPoint[];
    xAxis: string[];
    kpiValue: string;
    kpiGrowth: string;
    kpiSub: string;
    tooltipX: number;
    tooltipY: number;
    tooltipLabel: string;
    tooltipValue: string;
  }> = {
    '7d': {
      subtitle: '7-day traffic trend',
      kpiValue: '24,819',
      kpiGrowth: '↑ 12.4%',
      kpiSub: 'vs last 7 days',
      pathLine: 'M 40,150 C 75,130 95,115 110,115 C 135,115 155,130 180,130 C 215,130 235,145 250,145 C 285,145 305,100 320,100 C 355,100 375,70 390,70 C 425,70 445,90 460,90',
      pathArea: 'M 40,150 C 75,130 95,115 110,115 C 135,115 155,130 180,130 C 215,130 235,145 250,145 C 285,145 305,100 320,100 C 355,100 375,70 390,70 C 425,70 445,90 460,90 L 460,180 L 40,180 Z',
      points: [
        { x: 40, y: 150, label: 'May 9', value: '2,642' },
        { x: 110, y: 115, label: 'May 10', value: '4,890' },
        { x: 180, y: 130, label: 'May 11', value: '4,102' },
        { x: 250, y: 145, label: 'May 12', value: '3,450' },
        { x: 320, y: 100, label: 'May 13', value: '5,800' },
        { x: 390, y: 70, label: 'May 14', value: '8,942' },
        { x: 460, y: 90, label: 'May 15', value: '8,432' }
      ],
      xAxis: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'],
      tooltipX: 460,
      tooltipY: 90,
      tooltipLabel: 'Sunday',
      tooltipValue: '8,432 Visitors'
    },
    '30d': {
      subtitle: '30-day traffic trend',
      kpiValue: '98,421',
      kpiGrowth: '↑ 18.2%',
      kpiSub: 'vs last month',
      pathLine: 'M 40,130 C 75,110 95,90 110,90 C 135,90 155,110 180,110 C 215,110 235,140 250,140 C 285,140 305,80 320,80 C 355,80 375,60 390,60 C 425,60 445,50 460,50',
      pathArea: 'M 40,130 C 75,110 95,90 110,90 C 135,90 155,110 180,110 C 215,110 235,140 250,140 C 285,140 305,80 320,80 C 355,80 375,60 390,60 C 425,60 445,50 460,50 L 460,180 L 40,180 Z',
      points: [
        { x: 40, y: 130, label: 'May 1', value: '14,210' },
        { x: 110, y: 90, label: 'May 7', value: '18,450' },
        { x: 180, y: 110, label: 'May 14', value: '16,210' },
        { x: 250, y: 140, label: 'May 21', value: '12,942' },
        { x: 320, y: 80, label: 'May 28', value: '20,105' },
        { x: 390, y: 60, label: 'May 29', value: '23,450' },
        { x: 460, y: 50, label: 'May 30', value: '24,104' }
      ],
      xAxis: ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'],
      tooltipX: 460,
      tooltipY: 50,
      tooltipLabel: 'May 30',
      tooltipValue: '24,104 Visitors'
    },
    '90d': {
      subtitle: '90-day traffic trend',
      kpiValue: '284,912',
      kpiGrowth: '↑ 24.6%',
      kpiSub: 'vs last quarter',
      pathLine: 'M 40,160 C 75,145 95,130 110,130 C 135,130 155,90 180,90 C 215,90 235,105 250,105 C 285,105 305,120 320,120 C 355,120 375,70 390,70 C 425,70 445,65 460,65',
      pathArea: 'M 40,160 C 75,145 95,130 110,130 C 135,130 155,90 180,90 C 215,90 235,105 250,105 C 285,105 305,120 320,120 C 355,120 375,70 390,70 C 425,70 445,65 460,65 L 460,180 L 40,180 Z',
      points: [
        { x: 40, y: 160, label: 'March W1', value: '52,430' },
        { x: 110, y: 130, label: 'March W3', value: '64,980' },
        { x: 180, y: 90, label: 'April W1', value: '81,204' },
        { x: 250, y: 105, label: 'April W3', value: '74,800' },
        { x: 320, y: 120, label: 'May W1', value: '71,940' },
        { x: 390, y: 70, label: 'May W3', value: '92,105' },
        { x: 460, y: 65, label: 'May W4', value: '94,819' }
      ],
      xAxis: ['March', 'April', 'May'],
      tooltipX: 460,
      tooltipY: 65,
      tooltipLabel: 'May W4',
      tooltipValue: '94,819 Visitors'
    }
  };

  const currentConfig = chartConfigs[activeRange];

  return (
    <div className="premium-analytics-card">
      {/* Header section with Title and Time Selector */}
      <div className="analytics-card-header">
        <div className="analytics-card-title-group">
          <h3 className="analytics-card-title">Visitor Analytics</h3>
          <p className="analytics-card-subtitle">{currentConfig.subtitle}</p>
        </div>
        
        <div className="analytics-card-filters">
          <button
            type="button"
            className={`filter-chip ${activeRange === '7d' ? 'active' : ''}`}
            onClick={() => setActiveRange('7d')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`filter-chip ${activeRange === '30d' ? 'active' : ''}`}
            onClick={() => setActiveRange('30d')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`filter-chip ${activeRange === '90d' ? 'active' : ''}`}
            onClick={() => setActiveRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* KPI Overview Summary Row */}
      <div className="analytics-kpi-summary-row">
        <div className="analytics-kpi-left">
          <h2 className="analytics-kpi-val">{currentConfig.kpiValue}</h2>
          <div className="analytics-kpi-badge-group">
            <span className="analytics-growth-badge">{currentConfig.kpiGrowth}</span>
            <span className="analytics-growth-sub">{currentConfig.kpiSub}</span>
          </div>
        </div>
        
        <button className="analytics-select-dropdown" type="button">
          <span>Unique Visitors</span>
          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Main Chart Vector Viewport Wrapper */}
      <div className="analytics-card-body">
        <div className="chart-relative-wrapper">
          
          {/* 1. Interactive Tooltip Card floating above highlighted last point */}
          <div
            className="chart-tooltip-panel"
            style={{
              left: `${(currentConfig.tooltipX / 500) * 100}%`,
              top: `${(currentConfig.tooltipY / 200) * 100 - 32}%`
            }}
          >
            <span className="tooltip-date">{currentConfig.tooltipLabel}</span>
            <span className="tooltip-value">{currentConfig.tooltipValue}</span>
            <div className="tooltip-arrow" />
          </div>

          {/* 2. SVG Vector Chart */}
          <svg className="analytics-mock-chart" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-grad-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.18)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
              </linearGradient>
            </defs>
            
            {/* Fine Grid Lines */}
            <line x1="40" y1="60" x2="460" y2="60" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" />
            <line x1="40" y1="100" x2="460" y2="100" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" />
            <line x1="40" y1="140" x2="460" y2="140" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1" />
            <line x1="40" y1="180" x2="460" y2="180" stroke="rgba(15, 23, 42, 0.04)" strokeWidth="1.2" />
            
            {/* Area path with soft gradient */}
            <path
              className="chart-area-transition"
              d={currentConfig.pathArea}
              fill="url(#chart-grad-glow)"
            />
            
            {/* Line path with curved strokes */}
            <path
              className="chart-line-transition"
              d={currentConfig.pathLine}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            
            {/* Data nodes (points) along the curve */}
            {currentConfig.points.map((pt, idx) => {
              const isLast = idx === currentConfig.points.length - 1;
              return (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={isLast ? 4.5 : 3.5}
                  fill="#4F46E5"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  style={{
                    filter: isLast ? 'drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <title>{pt.label}: {pt.value}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* Axis Labels Container */}
        <div className="analytics-chart-axis-wrapper">
          {/* Y Axis Metrics */}
          <div className="chart-y-axis">
            <span>12K</span>
            <span>8K</span>
            <span>4K</span>
            <span>0</span>
          </div>

          {/* X Axis Labels */}
          <div className="chart-x-axis">
            {currentConfig.xAxis.map((label, idx) => (
              <span key={idx}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scoped CSS Stylesheet (Avoids conflict with light theme variables) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-analytics-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Manrope', sans-serif;
          text-align: left;
          width: 100%;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-analytics-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-analytics-card .analytics-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
          gap: 16px;
        }

        .premium-analytics-card .analytics-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
        }

        .premium-analytics-card .analytics-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .premium-analytics-card .analytics-card-filters {
          display: flex;
          gap: 6px;
          background: #F1F5F9;
          padding: 3px;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
        }

        .premium-analytics-card .filter-chip {
          background: transparent;
          border: none;
          color: #64748B;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
          outline: none;
        }

        .premium-analytics-card .filter-chip:hover {
          color: #0F172A;
        }

        .premium-analytics-card .filter-chip.active {
          background: #FFFFFF;
          color: #4F46E5;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        }

        /* KPI Overview values below header */
        .premium-analytics-card .analytics-kpi-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          width: 100%;
        }

        .premium-analytics-card .analytics-kpi-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .premium-analytics-card .analytics-kpi-val {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1;
        }

        .premium-analytics-card .analytics-kpi-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-analytics-card .analytics-growth-badge {
          color: #16A34A;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          line-height: 1;
        }

        .premium-analytics-card .analytics-growth-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        .premium-analytics-card .analytics-select-dropdown {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
          outline: none;
        }

        .premium-analytics-card .analytics-select-dropdown:hover {
          border-color: #CBD5E1;
          color: #0F172A;
        }

        /* SVG chart relative positioning for absolute tooltip */
        .premium-analytics-card .analytics-card-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .premium-analytics-card .chart-relative-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .premium-analytics-card .analytics-mock-chart {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Interactive Floating Tooltip panel */
        .premium-analytics-card .chart-tooltip-panel {
          position: absolute;
          transform: translate(-50%, -100%);
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 6px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          pointer-events: none;
          z-index: 10;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-analytics-card .tooltip-date {
          font-size: 9px;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .premium-analytics-card .tooltip-value {
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .premium-analytics-card .tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #0F172A;
        }

        /* Chart paths animation transitions */
        .premium-analytics-card .chart-line-transition,
        .premium-analytics-card .chart-area-transition {
          transition: d 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Y and X Axis container wrapper */
        .premium-analytics-card .analytics-chart-axis-wrapper {
          position: relative;
          width: 100%;
          height: 20px;
          box-sizing: border-box;
        }

        .premium-analytics-card .chart-y-axis {
          display: none; /* Kept minimal - details hidden on X axis focus */
        }

        .premium-analytics-card .chart-x-axis {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          color: #64748B;
          font-size: 11.5px;
          font-weight: 550;
        }

        /* Media responsiveness */
        @media (max-width: 580px) {
          .premium-analytics-card .analytics-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .premium-analytics-card .analytics-card-filters {
            width: 100%;
            justify-content: space-between;
          }
          .premium-analytics-card .filter-chip {
            flex: 1;
            text-align: center;
          }
          .premium-analytics-card .analytics-kpi-summary-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .premium-analytics-card .analytics-select-dropdown {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}} />
    </div>
  );
};

export default AnalyticsCard;
