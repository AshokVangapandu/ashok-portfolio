/* src/components/projects/techstackgrid.tsx */
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
          style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
          alt="Mendix" 
        />
      )
    },
    {
      name: 'React',
      label: 'UI Framework',
      icon: (
        <svg viewBox="-11.5 -10.23 23 20.46" width="30" height="30">
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
        <svg viewBox="0 0 100 100" width="30" height="30">
          <rect width="100" height="100" fill="#3178C6" rx="12" />
          <path d="M63 40h-8.5v35h-9V40h-8.5v-7.5H63V40zm12.5 19.3c-1.5-1-3.6-1.7-6.2-1.7-3 0-4.8 1.4-4.8 3.5 0 2 1.6 3 4.8 4.2 4.6 1.7 8.3 3.5 8.3 8.7 0 5.4-4.5 9-11.3 9-3.7 0-7.2-1.1-9.2-2.7l3-6.5c1.8 1.3 4.5 2.2 7 2.2 3.1 0 4.8-1.4 4.8-3.6 0-2.3-1.8-3.2-5.1-4.5-4.5-1.7-8-3.8-8-8.5 0-5 4-8.7 10.5-8.7 3.3 0 6 1 7.7 2.1l-3.2 6.1z" fill="#FFFFFF"/>
        </svg>
      )
    },
    {
      name: 'SCSS',
      label: 'Sassy Styles',
      icon: (
        <img 
          src={scssLogo} 
          style={{ width: '30px', height: '30px', objectFit: 'contain' }} 
          alt="SCSS" 
        />
      )
    },
    {
      name: 'Figma',
      label: 'UI/UX Design',
      icon: (
        <svg viewBox="0 0 38 57" width="20" height="30" fill="none">
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
        <svg viewBox="0 0 24 24" width="30" height="30" fill="#339933">
          <path d="M12 1.3L3.1 6.4v10.2l8.9 5.1 8.9-5.1V6.4L12 1.3zm6.6 14.3l-6.6 3.8-6.6-3.8V8.6l6.6-3.8 6.6 3.8v7z"/>
        </svg>
      )
    },
    {
      name: 'Vite',
      label: 'Fast Bundling',
      icon: (
        <svg viewBox="0 0 256 256" width="30" height="30">
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
  const speedRef = useRef(0.8);
  
  const targetSpeed = 0.8;
  const acceleration = 0.016;

  const updateCardStyles = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    
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
      
      const maxDist = 180;
      const pct = Math.max(0, 1 - distance / maxDist);
      
      const scale = 0.94 + pct * 0.09;
      const opacity = 0.4 + pct * 0.6;
      const blurVal = (1 - pct) * 1.0;
      const saturateVal = 60 + pct * 40;
      const translateY = pct * -3;
      
      card.style.transform = `scale(${scale}) translateY(${translateY}px) translateZ(0)`;
      card.style.opacity = `${opacity}`;
      card.style.filter = `blur(${blurVal}px) saturate(${saturateVal}%)`;
      
      const glowOpacity = pct * 0.6;
      const borderOpacity = 0.05 + pct * 0.35;
      card.style.borderColor = `rgba(167, 139, 250, ${borderOpacity})`;
      card.style.backgroundColor = `rgba(10, 15, 30, ${0.45 + pct * 0.25})`;
      card.style.boxShadow = `
        0 8px 24px rgba(0, 0, 0, ${0.15 + pct * 0.1}), 
        0 0 20px rgba(167, 139, 250, ${glowOpacity * 0.18}),
        inset 0 1px 0 rgba(255, 255, 255, 0.04)
      `;
      
      const iconWrapper = card.querySelector('.tech-icon-wrapper') as HTMLElement;
      if (iconWrapper) {
        iconWrapper.style.transform = `scale(${1 + pct * 0.1})`;
        iconWrapper.style.filter = `brightness(${1 + pct * 0.2})`;
      }
      
      const label = card.querySelector('.tech-label') as HTMLElement;
      if (label) {
        label.style.opacity = `${pct}`;
        label.style.height = `${pct * 14}px`;
      }
    });
  };

  useEffect(() => {
    const loop = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        
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
    const duration = 600;
    
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
    <div className="tech-showcase-container">
      {/* 1. Header Area with centered badge pill and title */}
      <div className="tech-showcase-header">
        <div className="tech-badge-pill">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span>TECH & TOOLS I WORK WITH</span>
        </div>

        <h2 className="tech-showcase-title">
          Modern technologies powering <span className="purple-gradient-text">enterprise</span> solutions
        </h2>
      </div>

      {/* 2. Interactive Slider Track Wrapper with Navigation Arrows */}
      <div
        className="tech-slider-wrapper"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous Technology"
          className="slider-arrow slider-arrow-left"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Viewport container */}
        <div
          ref={containerRef}
          onScroll={updateCardStyles}
          className="tech-scroll-track"
        >
          {tripledTechs.map((tech, idx) => {
            return (
              <React.Fragment key={idx}>
                <div
                  data-type="card"
                  onClick={() => smoothScrollToChild(idx * 2)}
                  className="tech-card"
                >
                  <div className="tech-icon-wrapper">
                    {tech.icon}
                  </div>
                  
                  <div className="tech-card-text">
                    <span className="tech-name">
                      {tech.name}
                    </span>
                    <span className="tech-label">
                      {tech.label}
                    </span>
                  </div>
                </div>

                <span className="tech-separator-diamond">
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
          aria-label="Next Technology"
          className="slider-arrow slider-arrow-right"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 3. Fluid scroll progress bar indicator */}
      <div className="tech-progress-bar-bg">
        <div
          className="tech-progress-bar-fill"
          style={{
            left: `${scrollProgress * 70}%`
          }}
        />
      </div>

      {/* 4. Footer Subtext */}
      <span className="tech-footer-subtext">
        TECHNOLOGIES BEHIND THE PRODUCTS I BUILD
      </span>
    </div>
  );
};

export default TechStackGrid;
