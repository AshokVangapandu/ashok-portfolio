/* src/components/tools/ProductCarousel.tsx */
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../types/Product';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onViewDetails,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Resize listener for responsive layout adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prevSlide = useCallback(() => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoscroll timer with pause-on-hover
  useEffect(() => {
    if (isHovered || products.length === 0) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [isHovered, products.length, nextSlide]);

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    // 50px threshold for swipes
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Helper to compute CoverFlow distance wrap around
  const getWrappedDistance = (index: number) => {
    const diff = index - activeIndex;
    const count = products.length;
    return ((diff + count / 2) % count + count) % count - count / 2;
  };

  const isMobile = windowWidth <= 640;
  const isTablet = windowWidth > 640 && windowWidth <= 1024;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* section navigation controllers header info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
          padding: '0 24px',
          boxSizing: 'border-box',
          marginBottom: '-10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--admin-primary)', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Complete Collection
          </h2>
          <span style={{ fontSize: '13px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
            {products.length} Items Available
          </span>
        </div>

        {/* Arrow buttons controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={prevSlide}
            className="hover-scale active-press"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
            aria-label="Previous product"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="hover-scale active-press"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
            aria-label="Next product"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* CoverFlow viewport panel container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '380px',
            height: '370px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s ease'
          }}
        >
          {products.map((product, idx) => {
            const distance = getWrappedDistance(idx);
            const absDist = Math.abs(distance);

            // Responsive scale parameters
            let scaleVal = 1;
            let translateXVal = 0;
            let rotateYVal = 0;
            let opacityVal = 1;
            let zIndexVal = 10;
            let filterVal = 'none';
            let pointerEventsVal: 'auto' | 'none' = 'auto';

            if (isMobile) {
              // Mobile layout: only show active card centered, hide others
              if (distance === 0) {
                scaleVal = 0.95;
                translateXVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else {
                scaleVal = 0.8;
                translateXVal = distance * 280;
                opacityVal = 0;
                zIndexVal = 1;
                pointerEventsVal = 'none';
              }
            } else if (isTablet) {
              // Tablet layout: show active card plus adjacent offset
              if (distance === 0) {
                scaleVal = 0.95;
                translateXVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else if (distance === 1) {
                scaleVal = 0.8;
                translateXVal = 140;
                opacityVal = 0.5;
                zIndexVal = 5;
                pointerEventsVal = 'none';
              } else if (distance === -1) {
                scaleVal = 0.8;
                translateXVal = -140;
                opacityVal = 0.5;
                zIndexVal = 5;
                pointerEventsVal = 'none';
              } else {
                opacityVal = 0;
                pointerEventsVal = 'none';
              }
            } else {
              // Desktop layout: Full 3D CoverFlow perspective transformations
              if (distance === 0) {
                scaleVal = 1;
                translateXVal = 0;
                rotateYVal = 0;
                opacityVal = 1;
                zIndexVal = 10;
              } else if (distance === 1) {
                scaleVal = 0.85;
                translateXVal = 210;
                rotateYVal = -28;
                opacityVal = 0.65;
                zIndexVal = 5;
                filterVal = 'blur(1px)';
                pointerEventsVal = 'none';
              } else if (distance === -1) {
                scaleVal = 0.85;
                translateXVal = -210;
                rotateYVal = 28;
                opacityVal = 0.65;
                zIndexVal = 5;
                filterVal = 'blur(1px)';
                pointerEventsVal = 'none';
              } else {
                // Out of focus side elements
                const dir = distance > 0 ? 1 : -1;
                scaleVal = 0.7;
                translateXVal = dir * (210 + (absDist - 1) * 110);
                rotateYVal = dir * -35;
                opacityVal = 0.2;
                zIndexVal = 5 - absDist;
                filterVal = 'blur(3px)';
                pointerEventsVal = 'none';
              }
            }

            return (
              <div
                key={product.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${translateXVal}px) scale(${scaleVal}) rotateY(${rotateYVal}deg)`,
                  opacity: opacityVal,
                  zIndex: zIndexVal,
                  filter: filterVal,
                  pointerEvents: pointerEventsVal,
                  transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Visual Glow Effect for active card */}
                {distance === 0 && !product.comingSoon && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      right: '10px',
                      bottom: '10px',
                      backgroundColor: 'rgba(124, 58, 237, 0.25)',
                      filter: 'blur(30px)',
                      zIndex: -1,
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      animation: 'pulseGlow 3s infinite alternate'
                    }}
                  />
                )}
                <ProductCard product={product} onViewDetails={onViewDetails} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination dots indicators */}
      <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
        {products.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: idx === activeIndex ? 'var(--admin-primary)' : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.25s ease',
              transform: idx === activeIndex ? 'scale(1.25)' : 'scale(1)',
              boxShadow: idx === activeIndex ? '0 0 10px rgba(124, 58, 237, 0.5)' : 'none'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseGlow {
          0% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(1.06); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ProductCarousel;
