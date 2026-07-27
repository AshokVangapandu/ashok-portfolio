/* src/admin/pages/social-links/components/SocialLinkRow.tsx */
import React from 'react';
import { SocialLink } from '../../../types/socialLinks';
import { SocialPlatformIcon } from './SocialPlatformIcon';

interface SocialLinkRowProps {
  link: SocialLink;
  onUrlChange: (url: string) => void;
}

export const SocialLinkRow: React.FC<SocialLinkRowProps> = ({
  link,
  onUrlChange
}) => {
  const isConnected = !!(link.url && link.url.trim());

  const platformDisplayNames: Record<string, string> = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    behance: 'Behance',
    email: 'Email',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram'
  };

  const displayName = platformDisplayNames[link.platform.toLowerCase()] || link.platform;
  const helperText = `${displayName} link configured for your public portfolio.`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--admin-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxSizing: 'border-box',
        transition: 'all 200ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--admin-border)';
      }}
    >
      {/* 1. Header: Icon, Title & Helper Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
            color: 'var(--admin-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <SocialPlatformIcon platform={link.platform} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
            {displayName}
          </span>
          <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            {helperText}
          </span>
        </div>
      </div>

      {/* 2. URL Input with leading icon */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          URL / Destination
        </label>
        <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {link.platform === 'email' ? (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            )}
          </span>
          <input
            type="text"
            value={link.url}
            placeholder={link.platform === 'email' ? 'e.g. mailto:name@example.com or name@example.com' : `Enter your ${displayName} URL`}
            onChange={(e) => onUrlChange(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px 0 34px',
              border: '1.5px solid rgba(226, 232, 240, 1)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--admin-text)',
              backgroundColor: '#F8FAFC',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-primary)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* 3. Footer: Connection Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px dashed var(--admin-border)',
          paddingTop: '16px',
          marginTop: '4px',
          boxSizing: 'border-box'
        }}
      >
        {/* Status Badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            backgroundColor: isConnected ? '#ECFDF5' : '#F1F5F9',
            color: isConnected ? '#10B981' : '#64748B',
            fontSize: '11px',
            fontWeight: 700
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10B981' : '#64748B'
            }}
          />
          {isConnected ? 'Configured' : 'Not Configured'}
        </span>
      </div>
    </div>
  );
};

export default SocialLinkRow;
