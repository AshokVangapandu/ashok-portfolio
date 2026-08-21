/* src/components/projects/IndustryGrid.tsx */
import React from 'react';

export const IndustryGrid: React.FC = () => {
  const industries = [
    'Healthcare',
    'Legal',
    'Enterprise',
    'HR / Staffing',
    'Construction',
    'Manufacturing',
    'Education',
    'Government'
  ];

  // Duplicate items to ensure a seamless looping visual scroll effect
  const marqueeItems = [...industries, ...industries];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '40px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: '11px',
            fontWeight: 800,
            margin: 0,
            color: '#64748B',
            letterSpacing: '0.25em',
            textTransform: 'uppercase'
          }}
        >
          INDUSTRIES & DOMAINS I BUILD FOR
        </h3>
      </div>

      {/* Marquee Track viewport wrapper with transparent edge fade mask */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          padding: '12px 0',
          display: 'flex',
          alignItems: 'center',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)'
        }}
      >

        {/* Rolling track container (scrolls in reverse direction) */}
        <div
          className="industry-marquee-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            width: 'max-content',
            animation: 'marquee-ind 40s linear infinite'
          }}
        >
          {marqueeItems.map((ind, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px'
              }}
            >
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap'
                }}
              >
                {ind}
              </span>
              <span
                style={{
                  color: '#8B5CF6',
                  fontSize: '18px',
                  fontWeight: 900
                }}
              >
                •
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-ind {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .industry-marquee-track:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default IndustryGrid;
