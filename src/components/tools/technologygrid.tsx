/* src/components/tools/TechnologyGrid.tsx */
import React, { useState, useEffect, useRef } from 'react';

export const TechnologyGrid: React.FC = () => {
  const techs = [
    {
      name: 'Mendix',
      label: 'Low-Code Engine',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <rect width="24" height="24" rx="6" fill="#005BDE" />
          <path d="M6 7h3l3 4.5L15 7h3v10h-3v-5l-3 4.5L9 12v5H6V7z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'React',
      label: 'UI Framework',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#8B5CF6" strokeWidth="2.2" style={{ transition: 'color 0.2s ease' }}>
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="#8B5CF6" />
        </svg>
      )
    },
    {
      name: 'TypeScript',
      label: 'Typed Scripting',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <text x="13" y="18" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">TS</text>
        </svg>
      )
    },
    {
      name: 'SCSS',
      label: 'Sassy CSS Styles',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#F43F5E" strokeWidth="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.88 12.68c-.96.76-2.18.96-3 .52-1.04-.56-1.2-1.84-.44-2.88s2.08-1.48 3.12-.92c.96.52.88 1.48.08 2.08l.24.44s.92-.8 1.04-1.84c.16-1.32-.88-2.6-2.32-2.84s-2.76.68-3.4 1.84-2 4 .24 4.88 4-.68 4.48-1.32" />
        </svg>
      )
    },
    {
      name: 'Figma API',
      label: 'Design Automation',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 5a3 3 0 1 1 6 0v3H8V5z" fill="#FF7262" opacity="0.8" />
          <path d="M8 11a3 3 0 0 1 6 0v3H8v-3z" fill="#A259FF" opacity="0.8" />
          <path d="M8 17a3 3 0 0 1 3-3h3v3a3 3 0 0 1-6 0z" fill="#1ABC9C" opacity="0.8" />
          <path d="M14 11a3 3 0 1 1 3 3h-3v-3z" fill="#10B981" opacity="0.8" />
          <path d="M14 5a3 3 0 1 1 3 3h-3V5z" fill="#F24E1E" opacity="0.8" />
        </svg>
      )
    },
    {
      name: 'Node.js',
      label: 'Runtime Engine',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      name: 'Vite',
      label: 'Fast Bundling',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      name: 'Supabase',
      label: 'Backend Database',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#10B981" strokeWidth="2">
          <path d="M12 2L3 9v7l9 6 9-6V9l-9-7z" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" />
          <polygon points="12 6 7 13 11 13 9 18 16 11 12 11 12 6" fill="#10B981" />
        </svg>
      )
    }
  ];

  const [activeIndex, setActiveIndex] = useState(1); // Start with 'React' active
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % techs.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, techs.length]);

  // Center active element inside the sliding viewport container
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const activeChild = container.children[activeIndex * 2] as HTMLElement; // *2 accounts for diamond separators
    if (!activeChild) return;

    const containerWidth = container.clientWidth;
    const childOffset = activeChild.offsetLeft;
    const childWidth = activeChild.clientWidth;

    container.scrollTo({
      left: childOffset - containerWidth / 2 + childWidth / 2,
      behavior: 'smooth'
    });
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + techs.length) % techs.length);
    setIsPaused(true);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % techs.length);
    setIsPaused(true);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '40px 0 20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}
    >
      {/* Header and Pill Line */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '4px', height: '16px', backgroundColor: 'var(--admin-primary)', borderRadius: '2px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Technology Stack
        </h3>
      </div>

      {/* Slider Viewport Container Wrapper */}
      <div
        style={{
          width: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#C4B5FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            position: 'absolute',
            left: '24px',
            transition: 'all 0.2s ease'
          }}
          className="slider-arrow"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Soft edge blur masks to fade in/out on sides */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(90deg, #080c25 10%, transparent 100%)',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(270deg, #080c25 10%, transparent 100%)',
            zIndex: 3,
            pointerEvents: 'none'
          }}
        />

        {/* Scrolling viewport */}
        <div
          style={{
            width: 'calc(100% - 100px)',
            overflowX: 'auto',
            display: 'flex',
            alignItems: 'center',
            padding: '24px 0',
            scrollBehavior: 'smooth'
          }}
          ref={containerRef}
          className="horizontal-scroll-carousel"
        >
          {techs.map((tech, idx) => {
            const isActive = idx === activeIndex;
            return (
              <React.Fragment key={idx}>
                {/* Custom Tech Card */}
                <div
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    width: isActive ? '140px' : '100px',
                    height: isActive ? '140px' : '100px',
                    borderRadius: '16px',
                    backgroundColor: isActive ? 'rgba(15, 20, 33, 0.8)' : 'transparent',
                    border: isActive ? '2px solid rgba(124, 58, 237, 0.8)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 32px rgba(124, 58, 237, 0.4)' : 'none',
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? 'scale(1.08)' : 'scale(0.95)',
                    padding: '12px 8px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    color: isActive ? '#8B5CF6' : '#64748B'
                  }}
                >
                  <div
                    style={{
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {tech.icon}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: isActive ? '13px' : '11.5px',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#FFFFFF' : '#CBD5E1',
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tech.name}
                    </span>
                    {isActive && (
                      <span style={{ fontSize: '10px', color: '#8B5CF6', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {tech.label}
                      </span>
                    )}
                  </div>

                  {/* Active bottom highlight line indicator dot */}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-12px',
                        width: '16px',
                        height: '3px',
                        backgroundColor: '#8B5CF6',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px #8B5CF6'
                      }}
                    />
                  )}
                </div>

                {/* Diamond Separator (except after the last item) */}
                {idx < techs.length - 1 && (
                  <span
                    style={{
                      color: 'rgba(139, 92, 246, 0.4)',
                      fontSize: '12px',
                      margin: '0 24px',
                      flexShrink: 0,
                      userSelect: 'none'
                    }}
                  >
                    ♦
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#C4B5FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            position: 'absolute',
            right: '24px',
            transition: 'all 0.2s ease'
          }}
          className="slider-arrow"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Bottom Auto-scroll subtext */}
      <span
        style={{
          fontSize: '11px',
          color: '#475569',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}
      >
        Auto-scrolling • Center item is highlighted
      </span>

      <style dangerouslySetInnerHTML={{__html: `
        .slider-arrow:hover {
          background-color: rgba(124, 58, 237, 0.15) !important;
          border-color: rgba(124, 58, 237, 0.3) !important;
          color: #FFFFFF !important;
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
};

export default TechnologyGrid;
