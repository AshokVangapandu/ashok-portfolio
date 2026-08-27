/* src/components/projects/FeaturedProject.tsx */
import React from 'react';
import { Project } from '../../types/Project';

interface FeaturedProjectProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  project,
  onViewDetails,
}) => {
  const {
    title,
    description,
    category,
    technologies,
    problemSolved,
    features,
    impactMetrics,
    coverImage,
    demoUrl,
    githubUrl,
  } = project;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '48px',
        backgroundColor: 'rgba(15, 20, 33, 0.45)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '24px',
        padding: '48px',
        boxSizing: 'border-box',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Manrope', sans-serif"
      }}
      className="featured-showcase-container"
    >
      {/* Background radial soft light purple glow */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Left Column: Project Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#A78BFA',
              backgroundColor: 'rgba(124, 58, 237, 0.12)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '6px',
              padding: '4px 10px',
              width: 'fit-content',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            ★ SPOTLIGHT PRODUCT: {category}
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 850,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
          >
            {title}
          </h2>
        </div>

        <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#94A3B8' }}>
          {description}
        </p>

        {/* Problem solved */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Problem Solved
          </span>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, color: '#E2E8F0', fontStyle: 'italic' }}>
            "{problemSolved}"
          </p>
        </div>

        {/* Features Bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Key Architecture Features
          </span>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: '#94A3B8' }}>
            {features.slice(0, 3).map((feat, idx) => (
              <li key={idx} style={{ color: '#E2E8F0' }}>{feat}</li>
            ))}
          </ul>
        </div>

        {/* Tech stack pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {technologies.map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#C4B5FD'
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Impact KPIs */}
        <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px' }}>
          {impactMetrics.map((met, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '24px', fontWeight: 850, color: '#10B981', letterSpacing: '-0.01em' }}>{met.kpi}</span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{met.label}</span>
            </div>
          ))}
        </div>

        {/* Links CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => onViewDetails(project)}
            className="hover-scale active-press"
            style={{
              padding: '12px 28px',
              borderRadius: '999px',
              backgroundColor: 'var(--admin-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            View Case Study
          </button>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-scale"
              style={{
                padding: '12px 24px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#E2E8F0',
                fontSize: '13.5px',
                fontWeight: 650,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
            >
              Live Preview
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-scale"
              style={{
                padding: '12px 24px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#E2E8F0',
                fontSize: '13.5px',
                fontWeight: 650,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Layered Screen Showcase with visual Depth */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          minHeight: '440px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
        className="featured-screens-wrapper"
      >
        {/* Layer 1: Backdrop Glow */}
        <div
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            backgroundColor: 'rgba(124, 58, 237, 0.25)',
            filter: 'blur(50px)',
            zIndex: 1
          }}
        />

        {/* Layer 2: Large Browser/Desktop Screen Panel Mockup */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: '380px',
            height: '240px',
            backgroundColor: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            transform: 'perspective(800px) rotateY(-18deg) rotateX(8deg)',
            zIndex: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Mock Browser Header */}
          <div style={{ height: '14px', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '8px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <img
              src={coverImage}
              alt="Desktop Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Layer 3: Overlapping Tablet/Small Mockup window showing charts */}
        <div
          style={{
            position: 'absolute',
            width: '180px',
            height: '130px',
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(8px)',
            transform: 'perspective(800px) translate3d(120px, 80px, 40px) rotateY(-12deg)',
            zIndex: 4,
            padding: '12px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>TELEMETRY TRACKER</span>
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
            {[30, 50, 40, 80, 60, 95, 75].map((val, i) => (
              <div
                key={i}
                style={{
                  flexGrow: 1,
                  height: `${val}%`,
                  backgroundColor: '#7C3AED',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(124,58,237,0.3)'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#10B981', fontWeight: 700 }}>
            <span>98.6% UPTIME</span>
            <span>+14.2%</span>
          </div>
        </div>

        {/* Layer 4: Mobile phone mockup */}
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '160px',
            backgroundColor: '#020617',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
            transform: 'perspective(800px) translate3d(-150px, 60px, 60px) rotateY(15deg)',
            zIndex: 5,
            overflow: 'hidden'
          }}
        >
          {/* Phone speaker notch */}
          <div style={{ height: '8px', display: 'flex', justifyContent: 'center', paddingTop: '2px' }}>
            <div style={{ width: '25px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '1px' }} />
          </div>
          <div style={{ height: 'calc(100% - 8px)', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80"
              alt="Mobile Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Layer 5: Floating translucent notification pill */}
        <div
          style={{
            position: 'absolute',
            transform: 'perspective(800px) translate3d(-100px, -110px, 80px)',
            backgroundColor: 'rgba(16, 185, 129, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
            padding: '6px 14px',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 6
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          HIPAA COMPLIANT SECURE
        </div>
      </div>
    </div>
  );
};

export default FeaturedProject;
