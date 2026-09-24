/* src/admin/pages/testimonials/components/TestimonialsSummaryCards.tsx */
import React, { useState, useEffect, useRef } from 'react';

interface SummaryData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  trends?: {
    total: string;
    pending: string;
    approved: string;
    rejected: string;
  };
}

interface TestimonialsSummaryCardsProps {
  summary: SummaryData;
  loading?: boolean;
}

// Easing helper for smooth animated counting
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// Animated value counting hook
const useAnimatedValue = (targetValue: number | string, loading = false, duration = 800) => {
  const [displayValue, setDisplayValue] = useState<number | string>(targetValue);
  const prevValueRef = useRef<number | string>(targetValue);

  useEffect(() => {
    if (loading) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      return;
    }

    const startVal = Number(prevValueRef.current) || 0;
    const endVal = Number(targetValue) || 0;

    if (startVal === endVal) {
      setDisplayValue(targetValue);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = Math.round(startVal + (endVal - startVal) * easedProgress);

      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, loading, duration]);

  return displayValue;
};

// Distinct theme configurations with subtle ambient gradient & terrain graph styling
const THEMES = {
  blue: {
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(224, 242, 254, 0.35) 100%)',
    borderColor: 'rgba(186, 230, 254, 0.75)',
    hoverBorder: 'rgba(56, 189, 248, 0.5)',
    hoverShadow: '0 10px 24px -4px rgba(2, 132, 199, 0.12)',
    gradStart: '#38BDF8',
    gradMid: '#7DD3FC',
    gradEnd: '#BAE6FD',
  },
  amber: {
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(254, 243, 199, 0.35) 100%)',
    borderColor: 'rgba(253, 230, 138, 0.75)',
    hoverBorder: 'rgba(251, 191, 36, 0.5)',
    hoverShadow: '0 10px 24px -4px rgba(217, 119, 6, 0.12)',
    gradStart: '#FBBF24',
    gradMid: '#FCD34D',
    gradEnd: '#FEF3C7',
  },
  green: {
    iconBg: '#DCFCE7',
    iconColor: '#10B981',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(220, 252, 231, 0.35) 100%)',
    borderColor: 'rgba(167, 243, 208, 0.75)',
    hoverBorder: 'rgba(52, 211, 153, 0.5)',
    hoverShadow: '0 10px 24px -4px rgba(16, 185, 129, 0.12)',
    gradStart: '#34D399',
    gradMid: '#6EE7B7',
    gradEnd: '#A7F3D0',
  },
  red: {
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
    cardBg: 'linear-gradient(135deg, #FFFFFF 50%, rgba(255, 228, 230, 0.35) 100%)',
    borderColor: 'rgba(254, 205, 211, 0.75)',
    hoverBorder: 'rgba(251, 113, 133, 0.5)',
    hoverShadow: '0 10px 24px -4px rgba(225, 29, 72, 0.12)',
    gradStart: '#FB7185',
    gradMid: '#FDA4AF',
    gradEnd: '#FECDD3',
  },
};

interface TestimonialKpiCardProps {
  index: number;
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: 'blue' | 'amber' | 'green' | 'red';
  loading?: boolean;
}

const TestimonialKpiCard: React.FC<TestimonialKpiCardProps> = ({
  index,
  label,
  value,
  icon,
  accent,
  loading = false,
}) => {
  const displayValue = useAnimatedValue(value, loading);
  const theme = THEMES[accent];
  const animationDelay = `${index * 60}ms`;

  return (
    <div
      className={`testimonial-kpi-card accent-${accent}`}
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.borderColor}`,
        borderRadius: '18px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        minWidth: '160px',
        transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.22s ease',
        animationDelay,
      }}
      onMouseOver={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = theme.hoverShadow;
          e.currentTarget.style.borderColor = theme.hoverBorder;
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(0, 0, 0, 0.03)';
        e.currentTarget.style.borderColor = theme.borderColor;
      }}
    >
      {/* Soft, lighter multi-layered terrain graph curves in bottom right corner */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '54%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`kpi-layer1-${accent}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.gradStart} stopOpacity="0.18" />
            <stop offset="60%" stopColor={theme.gradMid} stopOpacity="0.06" />
            <stop offset="100%" stopColor={theme.gradEnd} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={`kpi-layer2-${accent}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.gradStart} stopOpacity="0.28" />
            <stop offset="65%" stopColor={theme.gradMid} stopOpacity="0.09" />
            <stop offset="100%" stopColor={theme.gradEnd} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Layer 1 (Back / Soft gentle crest) */}
        <path
          d="M 0 100 C 40 100 70 45 110 40 C 145 35 170 55 200 32 L 200 100 L 0 100 Z"
          fill={`url(#kpi-layer1-${accent})`}
        />

        {/* Layer 2 (Front / Subtle rolling curve) */}
        <path
          d="M 45 100 C 80 100 115 58 150 52 C 172 48 188 58 200 48 L 200 100 L 45 100 Z"
          fill={`url(#kpi-layer2-${accent})`}
        />
      </svg>

      {/* Main Content: Row layout with Icon on left and Value + Label on right */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
        }}
      >
        {/* Left: Themed Icon container */}
        <div className="card-icon-container" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div className="card-skeleton card-skeleton-icon" />
          ) : (
            <div
              className="card-icon-content"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: theme.iconBg,
                color: theme.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 200ms ease',
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Right: Value (top) & Label (bottom) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          {loading ? (
            <>
              <div className="card-skeleton card-skeleton-value" />
              <div className="card-skeleton card-skeleton-label" />
            </>
          ) : (
            <>
              <span
                className="card-value-text"
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.2',
                }}
              >
                {displayValue}
              </span>
              <span
                className="card-label-text"
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: 500,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes testimonialKpiReveal {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .testimonial-kpi-card {
          opacity: 0;
          animation: testimonialKpiReveal 350ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .testimonial-kpi-card:hover .card-icon-content {
          transform: scale(1.06);
        }

        .card-skeleton {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: cardSkeletonPulse 1.5s infinite linear;
          box-sizing: border-box;
        }

        .card-skeleton-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
        }

        .card-skeleton-value {
          width: 48px;
          height: 22px;
          border-radius: 6px;
        }

        .card-skeleton-label {
          width: 80px;
          height: 12px;
          border-radius: 4px;
          margin-top: 3px;
        }

        @keyframes cardSkeletonPulse {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-kpi-card {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .card-skeleton {
            animation: none !important;
            background: #E2E8F0 !important;
          }
        }
      `}} />
    </div>
  );
};

export const TestimonialsSummaryCards: React.FC<TestimonialsSummaryCardsProps> = ({
  summary,
  loading = false,
}) => {
  return (
    <>
      <div className="testimonials-stats-grid">
        <TestimonialKpiCard
          index={0}
          label="Total Testimonials"
          value={summary.total}
          accent="blue"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        />
        
        <TestimonialKpiCard
          index={1}
          label="Pending Review"
          value={summary.pending}
          accent="amber"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <TestimonialKpiCard
          index={2}
          label="Approved"
          value={summary.approved}
          accent="green"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />

        <TestimonialKpiCard
          index={3}
          label="Rejected"
          value={summary.rejected}
          accent="red"
          loading={loading}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .testimonials-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 1100px) {
          .testimonials-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .testimonials-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </>
  );
};

export default TestimonialsSummaryCards;



