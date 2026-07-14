/* src/components/tools/AchievementsPanel.tsx */
import React from 'react';

export const AchievementsPanel: React.FC = () => {
  const capabilities = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: 'Enterprise Ready',
      desc: 'Built to satisfy complex security requirements, compliance regulations, and massive user scale.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Highly Reusable',
      desc: 'Designed using modular, plug-and-play architecture for seamless cross-project integration.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: 'Performance Optimized',
      desc: 'Fine-tuned rendering pipelines ensure smooth 60fps animations and minimal footprint.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8V12L15 15" />
        </svg>
      ),
      title: 'Accessibility First',
      desc: 'Fully compliant with WCAG guidelines, screen-reader markup, and keyboard interactions.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#60A5FA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: 'Cross Platform',
      desc: 'Runs seamlessly across modern browsers, Mendix runtimes, and mobile shells.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" />
        </svg>
      ),
      title: 'Design System Friendly',
      desc: 'Fully aligns with brand tokens, flexible style sheets, and CSS variables.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: 'API Friendly',
      desc: 'Exposes clean lifecycle hooks and properties for custom developer extensions.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#FB7185" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        </svg>
      ),
      title: 'AI Ready',
      desc: 'Built with context-aware inputs to integrate easily with LLM agents and tools.'
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '4px' }}>
        <span style={{ width: '4px', height: '16px', backgroundColor: '#60A5FA', borderRadius: '2px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Engineering Excellence
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          width: '100%'
        }}
        className="capabilities-grid"
      >
        {capabilities.map((c, idx) => (
          <div
            key={idx}
            className="capability-card-v2"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              textAlign: 'left',
              padding: '16px 18px',
              backgroundColor: 'rgba(15, 20, 33, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ display: 'flex', alignItems: 'center', opacity: 0.9 }}>{c.icon}</span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em'
                }}
              >
                {c.title}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: 1.5,
                color: '#94A3B8',
                fontWeight: 400
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .capability-card-v2:hover {
          border-color: rgba(96, 165, 250, 0.22) !important;
          background-color: rgba(20, 26, 43, 0.5) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(96, 165, 250, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.02);
        }
        @media (max-width: 900px) {
          .capabilities-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .capabilities-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
};

export default AchievementsPanel;
