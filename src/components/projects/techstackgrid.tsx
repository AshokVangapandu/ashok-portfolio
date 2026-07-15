/* src/components/projects/TechStackGrid.tsx */
import React, { useState, useEffect, useRef } from 'react';
import scssLogo from '../../../assets/images/SCSS.png';
import mendixLogo from '../../../assets/images/Mendix-Brandmark.webp';

export const TechStackGrid: React.FC = () => {
  const techs = [
    {
      name: 'Mendix',
      label: 'Low-Code Engine',
      icon: (
        <img 
          src={mendixLogo} 
          style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
          alt="Mendix" 
        />
      )
    },
    {
      name: 'React',
      label: 'UI Framework',
      icon: (
        <svg viewBox="-11.5 -10.23 23 20.46" width="32" height="32">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
      )
    },
    {
      name: 'TypeScript',
      label: 'Typed Scripting',
      icon: (
        <svg viewBox="0 0 100 100" width="32" height="32">
          <rect width="100" height="100" fill="#3178C6" rx="12" />
          <path d="M63 40h-8.5v35h-9V40h-8.5v-7.5H63V40zm12.5 19.3c-1.5-1-3.6-1.7-6.2-1.7-3 0-4.8 1.4-4.8 3.5 0 2 1.6 3 4.8 4.2 4.6 1.7 8.3 3.5 8.3 8.7 0 5.4-4.5 9-11.3 9-3.7 0-7.2-1.1-9.2-2.7l3-6.5c1.8 1.3 4.5 2.2 7 2.2 3.1 0 4.8-1.4 4.8-3.6 0-2.3-1.8-3.2-5.1-4.5-4.5-1.7-8-3.8-8-8.5 0-5 4-8.7 10.5-8.7 3.3 0 6 1 7.7 2.1l-3.2 6.1z" fill="#FFFFFF"/>
        </svg>
      )
    },
    {
      name: 'SCSS',
      label: 'Sassy CSS Styles',
      icon: (
        <img 
          src={scssLogo} 
          style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
          alt="SCSS" 
        />
      )
    },
    {
      name: 'Figma',
      label: 'UI/UX Design',
      icon: (
        <svg viewBox="0 0 38 57" width="22" height="32" fill="none">
          <path d="M19 19C19 8.5 10.5 0 0 0V19H19Z" fill="#F24E1E" />
          <path d="M19 0H38V19H19V0Z" fill="#FF7262" />
          <path d="M19 19H38V38H19V19Z" fill="#10B981" />
          <path d="M19 38C19 27.5 10.5 19 0 19V38H19Z" fill="#A259FF" />
          <path d="M19 57C19 46.5 10.5 38 0 38H19V57Z" fill="#1ABC9C" />
        </svg>
      )
    },
    {
      name: 'Node.js',
      label: 'Runtime Engine',
      icon: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#339933">
          <path d="M12 1.3L3.1 6.4v10.2l8.9 5.1 8.9-5.1V6.4L12 1.3zm6.6 14.3l-6.6 3.8-6.6-3.8V8.6l6.6-3.8 6.6 3.8v7z"/>
        </svg>
      )
    },
    {
      name: 'Vite',
      label: 'Fast Bundling',
      icon: (
        <svg viewBox="0 0 256 256" width="32" height="32">
          <defs>
            <linearGradient id="viteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#41D1FF" />
              <stop offset="100%" stopColor="#BD34FE" />
            </linearGradient>
          </defs>
          <path d="M128 0L24 180h56l48-84 48 84h56L128 0z" fill="url(#viteGrad)"/>
          <polygon points="128 50 80 150 115 150 100 230 176 120 135 120 128 50" fill="#FFC517"/>
        </svg>
      )
    }
  ];

  const tripledTechs = [...techs, ...techs, ...techs];
  const [scrollProgress, setScrollProgress] = useState(0.5);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const glideFrameRef = useRef<number>();
  const isPausedRef = useRef(false);
  const speedRef = useRef(0.88); // Matching increased speed
  
  const targetSpeed = 0.88;
  const acceleration = 0.016;

  // Real-time style interpolation based on card centering
  const updateCardStyles = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
    // Update bottom scroll progress indicator bar
    const oneThird = container.scrollWidth / 3;
    if (oneThird > 0) {
      const progress = (container.scrollLeft % oneThird) / oneThird;
      setScrollProgress(progress);
    }
    
    const children = Array.from(container.children);
    children.forEach((child) => {
      const card = child as HTMLElement;
      if (card.dataset.type !== 'card') return;
      
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      // Interpolation boundary range
      const maxDist = 200;
      const pct = Math.max(0, 1 - distance / maxDist); // 0 -> 1
      
      // Scale: 0.92 -> 1.03 (gentle 1.03x scale on active card)
      const scale = 0.92 + pct * 0.11;
      
      // Opacity: 0.35 -> 1.00
      const opacity = 0.35 + pct * 0.65;
      
      // Reduced Blur by 20%: max blur is 1.2px
      const blurVal = (1 - pct) * 1.2;
      
      // Saturation: 50% -> 100%
      const saturateVal = 50 + pct * 50;
      
      // Floating vertical movement (2px - 4px upward translation)
      const translateY = pct * -3.5;
      
      // Apply style attributes directly
      card.style.transform = `scale(${scale}) translateY(${translateY}px) translateZ(0)`;
      card.style.opacity = `${opacity}`;
      card.style.filter = `blur(${blurVal}px) saturate(${saturateVal}%)`;
      
      // Refined Active Card Border & Glass styling:
      const glowOpacity = pct * 0.6;
      const borderOpacity = 0.04 + pct * 0.38;
      card.style.borderColor = `rgba(167, 139, 250, ${borderOpacity})`;
      card.style.backgroundColor = `rgba(10, 15, 30, ${0.4 + pct * 0.25})`;
      card.style.boxShadow = `
        0 8px 24px rgba(0, 0, 0, ${0.12 + pct * 0.08}), 
        0 0 24px rgba(167, 139, 250, ${glowOpacity * 0.16}),
        inset 0 1px 0 rgba(255, 255, 255, 0.02)
      `;
      
      // Increase icon wrapper scale and brightness
      const iconWrapper = card.querySelector('.tech-icon-wrapper') as HTMLElement;
      if (iconWrapper) {
        iconWrapper.style.transform = `scale(${1 + pct * 0.12})`;
        iconWrapper.style.filter = `brightness(${1 + pct * 0.25})`;
      }
      
      // Slide open the label subtext smoothly
      const label = card.querySelector('.tech-label') as HTMLElement;
      if (label) {
        label.style.opacity = `${pct}`;
        label.style.height = `${pct * 14}px`;
      }
    });
  };

  // Continuous linear animation loop
  useEffect(() => {
    const loop = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        
        // PAUSE & RESUME physics
        if (isPausedRef.current) {
          if (speedRef.current > 0) {
            speedRef.current = Math.max(0, speedRef.current - 0.04);
          }
        } else {
          if (speedRef.current < targetSpeed) {
            speedRef.current = Math.min(targetSpeed, speedRef.current + acceleration);
          }
        }
        
        if (speedRef.current > 0) {
          let newScrollLeft = container.scrollLeft + speedRef.current;
          const oneThird = container.scrollWidth / 3;
          
          if (oneThird > 0) {
            if (newScrollLeft >= oneThird * 2) {
              newScrollLeft -= oneThird;
            } else if (newScrollLeft <= oneThird) {
              newScrollLeft += oneThird;
            }
            container.scrollLeft = newScrollLeft;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    
    animationFrameRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (glideFrameRef.current) cancelAnimationFrame(glideFrameRef.current);
    };
  }, []);

  // Center alignment on mount
  useEffect(() => {
    const initScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const oneThird = container.scrollWidth / 3;
      if (oneThird > 0) {
        container.scrollLeft = oneThird;
        updateCardStyles();
      } else {
        requestAnimationFrame(initScroll);
      }
    };
    initScroll();
  }, []);

  // Center child card on click
  const smoothScrollToChild = (childIndex: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const targetChild = container.children[childIndex] as HTMLElement;
    if (!targetChild) return;
    
    isPausedRef.current = true;
    
    const containerWidth = container.clientWidth;
    const targetScroll = targetChild.offsetLeft - containerWidth / 2 + targetChild.clientWidth / 2;
    const startScroll = container.scrollLeft;
    
    const startTime = performance.now();
    const duration = 650;
    
    if (glideFrameRef.current) cancelAnimationFrame(glideFrameRef.current);
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = startScroll + (targetScroll - startScroll) * ease;
      
      if (progress < 1) {
        glideFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          isPausedRef.current = false;
        }, 1500);
      }
    };
    
    glideFrameRef.current = requestAnimationFrame(animate);
  };

  // Get index of the child card closest to center
  const getCenteredCardIndex = () => {
    if (!containerRef.current) return 0;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const children = Array.from(container.children);
    
    let minDistance = Infinity;
    let centeredIdx = 0;
    
    children.forEach((child, idx) => {
      const card = child as HTMLElement;
      if (card.dataset.type !== 'card') return;
      
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        centeredIdx = idx;
      }
    });
    
    return centeredIdx;
  };

  const handleNext = () => {
    const centeredIdx = getCenteredCardIndex();
    const container = containerRef.current;
    if (!container) return;
    
    let nextIdx = centeredIdx + 1;
    while (nextIdx < container.children.length) {
      const child = container.children[nextIdx] as HTMLElement;
      if (child && child.dataset.type === 'card') {
        smoothScrollToChild(nextIdx);
        break;
      }
      nextIdx++;
    }
  };

  const handlePrev = () => {
    const centeredIdx = getCenteredCardIndex();
    const container = containerRef.current;
    if (!container) return;
    
    let prevIdx = centeredIdx - 1;
    while (prevIdx >= 0) {
      const child = container.children[prevIdx] as HTMLElement;
      if (child && child.dataset.type === 'card') {
        smoothScrollToChild(prevIdx);
        break;
      }
      prevIdx--;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '60px 0 20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative'
      }}
    >
      {/* 1. Header Text */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 850,
            color: '#A78BFA',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          TECH & TOOLS I WORK WITH
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          Modern technologies powering <br />
          <span style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            enterprise
          </span> solutions
        </h2>
      </div>

      {/* 2. Slider Viewport Container Wrapper */}
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
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          type="button"
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
            transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          className="slider-arrow"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Viewport container with mask and position relative for precise child offset calculations */}
        <div
          ref={containerRef}
          onScroll={updateCardStyles}
          style={{
            width: 'calc(100% - 100px)',
            overflowX: 'auto',
            display: 'flex',
            alignItems: 'center',
            padding: '28px 0',
            scrollBehavior: 'auto',
            position: 'relative',
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
          }}
          className="horizontal-scroll-carousel"
        >
          {tripledTechs.map((tech, idx) => {
            return (
              <React.Fragment key={idx}>
                {/* Custom Tech Card */}
                <div
                  data-type="card"
                  onClick={() => smoothScrollToChild(idx * 2)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    width: '120px',
                    height: '120px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '16px 8px',
                    boxSizing: 'border-box',
                    transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out, filter 0.15s ease-out',
                    willChange: 'transform, opacity, filter',
                    position: 'relative'
                  }}
                >
                  <div
                    className="tech-icon-wrapper"
                    style={{
                      transition: 'transform 0.2s ease, filter 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {tech.icon}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tech.name}
                    </span>
                    <span
                      className="tech-label"
                      style={{
                        fontSize: '9px',
                        color: '#A78BFA',
                        fontWeight: 500,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        height: 0,
                        overflow: 'hidden',
                        transition: 'opacity 0.2s ease, height 0.2s ease'
                      }}
                    >
                      {tech.label}
                    </span>
                  </div>
                </div>

                {/* Diamond Separator */}
                <span
                  style={{
                    color: 'rgba(139, 92, 246, 0.25)',
                    fontSize: '12px',
                    margin: '0 24px',
                    flexShrink: 0,
                    userSelect: 'none'
                  }}
                >
                  ♦
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          type="button"
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
            transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
          className="slider-arrow"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Fluid animated scroll progress bar indicator */}
      <div
        style={{
          width: '100px',
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '-12px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${scrollProgress * 70}%`, // thumb is 30% wide
            width: '30%',
            height: '100%',
            backgroundColor: '#8B5CF6',
            borderRadius: '999px',
            boxShadow: '0 0 6px rgba(139, 92, 246, 0.6)',
            transition: 'left 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        />
      </div>

      {/* 3. Bottom Auto-scroll subtext */}
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
        .horizontal-scroll-carousel::-webkit-scrollbar {
          display: none !important;
        }
        .horizontal-scroll-carousel {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .slider-arrow:hover {
          background-color: rgba(124, 58, 237, 0.15) !important;
          border-color: rgba(124, 58, 237, 0.3) !important;
          color: #FFFFFF !important;
          transform: scale(1.05);
        }
        .slider-arrow:active {
          transform: scale(0.95);
        }
      `}} />
    </div>
  );
};

export default TechStackGrid;
