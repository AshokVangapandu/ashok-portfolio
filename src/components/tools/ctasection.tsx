/* src/components/tools/CTASection.tsx */
import React from 'react';

export const CTASection: React.FC = () => {
  return (
    <>
      {/* Mobile Custom Tooling CTA (<= 768px) */}
      <div className="tools-mobile-cta-wrapper">
        <div className="tools-mobile-cta-icon-box">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <div className="tools-mobile-cta-content">
          <h3 className="tools-mobile-cta-title">Interested in custom tooling?</h3>
          <p className="tools-mobile-cta-desc">
            Let's build something together. From Mendix plugins to custom Figma plugins and integrations — I can help you create tools that scale.
          </p>
        </div>
        <div className="tools-mobile-cta-actions">
          <a href="/#contact" className="tools-mobile-cta-btn primary">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Get in Touch
          </a>
          <a href="/" className="tools-mobile-cta-btn secondary">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            View Portfolio
          </a>
        </div>
      </div>

      {/* Desktop CTA Container (> 768px) */}
      <div
        className="tools-desktop-cta-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '56px 40px',
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '24px',
          width: '100%',
          boxSizing: 'border-box',
          gap: '24px',
          fontFamily: "'Manrope', sans-serif",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
      {/* Icon Circle */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          color: '#C4B5FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '520px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Interested in custom tooling?
        </h3>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: '#94A3B8' }}>
          Let's build something together. From Mendix pluggable widgets to custom Figma plugins and automated design systems — I architect tools that scale.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        <a
          href="/#contact"
          className="hover-scale active-press"
          style={{
            padding: '12px 28px',
            borderRadius: '999px',
            backgroundColor: 'var(--admin-primary)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.35)',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary)'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Contact Me
        </a>
        <a
          href="/"
          className="hover-scale active-press"
          style={{
            padding: '12px 28px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            color: '#E2E8F0',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          View Portfolio
        </a>
      </div>
    </div>
    </>
  );
};

export default CTASection;
