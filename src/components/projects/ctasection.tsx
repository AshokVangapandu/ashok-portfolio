/* src/components/projects/CTASection.tsx */
import React, { useState, useEffect } from 'react';
import { socialLinksService } from '../../admin/services/socialLinksService';

export const CTASection: React.FC = () => {
  const [emailUrl, setEmailUrl] = useState<string>('');

  useEffect(() => {
    let active = true;
    socialLinksService.getLinks().then((data) => {
      if (!active) return;
      const emailObj = data.find(item => item.platform.toLowerCase() === 'email');
      if (emailObj && emailObj.url) {
        const url = emailObj.url.trim();
        const mailtoUrl = url.startsWith('mailto:') ? url : `mailto:${url}`;
        setEmailUrl(mailtoUrl);
      }
    }).catch(err => {
      console.error("[CTASection] Failed to load email link:", err);
    });
    return () => { active = false; };
  }, []);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!emailUrl) {
      e.preventDefault();
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('info', 'Link Not Configured', 'Email address has not been configured yet.', 5000);
      } else {
        alert('Email address has not been configured yet.');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 40px',
        background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '24px',
        width: '100%',
        boxSizing: 'border-box',
        gap: '24px',
        fontFamily: "'Inter', sans-serif",
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
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '560px' }}>
        <h3 style={{ margin: 0, fontSize: '26px', fontWeight: 850, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Interested in building your next digital product?
        </h3>
        <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.5, color: '#94A3B8' }}>
          Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets.
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
          Let's Collaborate
        </a>
        <a
          href={emailUrl || '#'}
          onClick={handleEmailClick}
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
          Contact Me
        </a>
      </div>
    </div>
  );
};

export default CTASection;
