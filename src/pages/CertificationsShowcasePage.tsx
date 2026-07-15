/* src/pages/CertificationsShowcasePage.tsx */
import React, { useState } from 'react';

interface CertificationCard {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  logo: React.ReactNode;
}

export const CertificationsShowcasePage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const stats = [
    {
      value: '12+',
      label: 'Certifications',
      desc: 'Industry Recognized',
      glowColor: 'rgba(167, 139, 250, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
          <polygon points="12 5 13 8 16 8 13.5 10 14.5 13 12 11 9.5 13 10.5 10 8 8 11 8 12 5" fill="#a855f7" />
        </svg>
      )
    },
    {
      value: '5',
      label: 'Platforms',
      desc: 'Global Brands',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    {
      value: '100%',
      label: 'Verified',
      desc: 'Authentic Credentials',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      )
    }
  ];

  const cards: CertificationCard[] = [
    {
      id: 'cert-mendix',
      title: 'Mendix Advanced Developer',
      issuer: 'Mendix Academy',
      issueDate: 'Issued: Jun 2026',
      logo: (
        <svg viewBox="0 0 24 24" width="22" height="22">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#00A2E8" />
          <text x="5" y="15" fill="#ffffff" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="11px">mx</text>
        </svg>
      )
    },
    {
      id: 'cert-aws',
      title: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: 'Issued: Apr 2026',
      logo: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#FF9900">
          <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-1.8 11.2c-.8-.2-1.2-.6-1.5-1.1l.9-.5c.2.4.5.6 1 .7.6.1 1-.2 1-.6v-.1c-.3-.2-.8-.4-1.4-.6-.8-.3-1.5-.6-1.8-1.2-.3-.5-.2-1.2.3-1.7.5-.5 1.2-.7 2.1-.7.8 0 1.5.2 2 .6l-.8.7c-.3-.3-.7-.4-1.2-.4s-.9.2-.9.5c0 .3.3.4.9.6 1 .3 1.6.7 1.9 1.1.3.5.2 1.2-.3 1.7-.6.6-1.4.8-2.3.8-.7 0-1.3-.2-1.8-.5zm4.8.4l-1.3-4.8h1.1l.8 3.3.8-3.3h1.1l-1.3 4.8h-1.2z" />
        </svg>
      )
    },
    {
      id: 'cert-google',
      title: 'Google UX Design Professional',
      issuer: 'Google',
      issueDate: 'Issued: Feb 2026',
      logo: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    },
    {
      id: 'cert-microsoft',
      title: 'Microsoft Power Platform Developer',
      issuer: 'Microsoft',
      issueDate: 'Issued: Dec 2025',
      logo: (
        <svg viewBox="0 0 24 24" width="20" height="20">
          <rect x="2" y="2" width="9" height="9" fill="#F25022" />
          <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
          <rect x="2" y="13" width="9" height="9" fill="#00A1F1" />
          <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
        </svg>
      )
    },
    {
      id: 'cert-meta',
      title: 'Meta Front-End Developer',
      issuer: 'Meta',
      issueDate: 'Issued: Oct 2025',
      logo: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0081FB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 15a4 4 0 1 1 0-8c2.25 0 3.5 2.5 5 5 1.5 2.5 2.75 5 5 5a4 4 0 1 0 0-8c-2.25 0-3.5 2.5-5 5-1.5-2.5-2.75-5-5-5z" />
        </svg>
      )
    },
    {
      id: 'cert-openai',
      title: 'AI Engineering Professional',
      issuer: 'OpenAI',
      issueDate: 'Issued: Aug 2025',
      logo: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c5.523 0 10 4.477 10 10S17.523 22 12 22 2 17.523 2 12 6.477 2 12 2z" />
          <path d="M12 6c1.5 0 2.5.5 3 1.5s.5 2.5-.5 3.5L12 13l-2.5-2c-1-.8-1.5-1.8-1.5-3.5s1-3 2.5-3.5" />
          <path d="M8.5 10.5c.5-.8 1.5-1.2 2.5-1.2s2 .4 2.5 1.2c.5.8.5 1.8 0 2.6l-2.5 3.4-2.5-3.4c-.5-.8-.5-1.8 0-2.6z" />
        </svg>
      )
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'calc(var(--header-height) + 44px) 24px 60px 24px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Top Section (Hero Split Layout) */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '40px',
          width: '100%'
        }}
      >
        {/* Left Side: Headings */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {/* Medal Icon on the left */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4px', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.25))' }}>
              <circle cx="12" cy="8" r="7" />
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              <polygon points="12 5 13 8 16 8 13.5 10 14.5 13 12 11 9.5 13 10.5 10 8 8 11 8 12 5" fill="#a855f7" />
            </svg>
          </div>
          {/* Text Stack on the right of the icon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                color: '#a855f7',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2'
              }}
            >
              CERTIFICATIONS
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Professional Certifications
            </h1>
            <p style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#94A3B8', margin: '4px 0 0 0', maxWidth: '520px' }}>
              Trusted credentials from globally recognized organizations that validate my skills and expertise.
            </p>
          </div>
        </div>

        {/* Right Side: 3 Stats Cards (Centered Vertically) */}
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0, alignItems: 'center' }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                width: '170px',
                padding: '16px 20px',
                background: 'rgba(13, 17, 30, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                height: '110px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  {stat.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', lineHeight: '1.1' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 550, color: '#94A3B8', marginTop: '1px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '8px', textAlign: 'left', fontWeight: 500 }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Main Content (Two-Column Layout) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 410px',
          gap: '56px',
          alignItems: 'start',
          width: '100%'
        }}
      >
        {/* Left Column: Search Bar & Grid Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
          {/* Search bar Component */}
          <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
            <span
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search certifications, platforms or skills..."
              style={{
                width: '100%',
                padding: '16px 50px 16px 48px',
                background: 'rgba(13, 17, 30, 0.45)',
                border: searchFocused ? '1px solid rgba(124, 92, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '999px',
                color: '#ffffff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: searchFocused ? '0 0 20px rgba(124, 92, 255, 0.15)' : 'none',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <span
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </span>
          </div>

          {/* Grid Cards Component (Strictly 3 Columns Desktop) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {cards.map((card) => {
              const isHovered = hoveredCard === card.id;
              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: 'rgba(23, 29, 49, 0.54)',
                    border: isHovered ? '1px solid rgba(124, 92, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isHovered 
                      ? '0 24px 48px rgba(0, 0, 0, 0.35), 0 0 30px rgba(124, 92, 255, 0.16)' 
                      : '0 14px 40px rgba(0, 0, 0, 0.28)',
                    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    height: '240px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  {/* Top: Logo and Verified badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}
                    >
                      {card.logo}
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#10B981',
                        background: 'rgba(16, 185, 129, 0.06)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        textTransform: 'capitalize',
                        lineHeight: 1
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Verified
                    </span>
                  </div>

                  {/* Middle: Title & Issuer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px', flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 750,
                        color: '#FFFFFF',
                        lineHeight: 1.35,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                      {card.issuer}
                    </p>
                  </div>

                  {/* Date with calendar icon */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748B',
                      fontSize: '12px',
                      fontWeight: 500,
                      marginTop: '8px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{card.issueDate}</span>
                  </div>

                  {/* Bottom: View Credential link */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: isHovered ? '#A78BFA' : '#94A3B8',
                        transition: 'color 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Credential →
                    </span>
                    <span
                      style={{
                        color: isHovered ? '#A78BFA' : '#64748B',
                        transition: 'color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom: Show More button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'rgba(13, 17, 30, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                color: '#94A3B8',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(13, 17, 30, 0.45)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              <span>Show More Certifications</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Preview Sidebar */}
        <aside
          style={{
            position: 'sticky',
            top: '120px',
            padding: '24px',
            background: 'rgba(35, 43, 71, 0.64)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '20px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.45), inset 0 2px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
            width: '410px'
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ display: 'flex', marginTop: '3px' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 750, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                Certificate Preview
              </h3>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Click on any certificate to view full details.
              </span>
            </div>
          </div>

          {/* Large Certificate Vector Mockup */}
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            <svg viewBox="0 0 400 280" style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
              {/* Background */}
              <rect width="400" height="280" rx="12" fill="#FFFFFF" />
              
              {/* Top Left: Mendix Logo */}
              <rect x="24" y="24" width="32" height="32" rx="6" fill="#00A2E8" />
              <text x="31" y="44" fill="#FFFFFF" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="14px">mx</text>

              {/* Top Right: Verified Credential Seal */}
              <circle cx="340" cy="40" r="22" fill="#2E1B4E" />
              <circle cx="340" cy="40" r="19" fill="#1C0E35" stroke="#7C3AED" strokeWidth="1.5" />
              <text x="340" y="38" textAnchor="middle" fill="#A78BFA" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="5px" letterSpacing="0.05em">VERIFIED</text>
              <text x="340" y="46" textAnchor="middle" fill="#FFFFFF" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="4px" letterSpacing="0.05em">CREDENTIAL</text>

              {/* Certificate Title */}
              <text x="24" y="90" fill="#0F172A" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="18px">Mendix</text>
              <text x="24" y="112" fill="#0F172A" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="18px">Advanced Developer</text>

              {/* Certified description */}
              <text x="24" y="140" fill="#64748B" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="8px">This is to certify that</text>
              <text x="24" y="162" fill="#4F46E5" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="16px">Ashok Vangapandu</text>
              <text x="24" y="180" fill="#64748B" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="7px">has successfully completed the requirements to be recognized as a</text>
              <text x="24" y="192" fill="#0F172A" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="8px">Mendix Advanced Developer</text>

              {/* Signatures & Seals */}
              {/* CEO Sig */}
              <line x1="24" y1="240" x2="100" y2="240" stroke="#CBD5E1" strokeWidth="1" />
              <text x="24" y="248" fill="#64748B" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="6px">CEO, Mendix</text>
              {/* Seal */}
              <circle cx="160" cy="230" r="16" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <circle cx="160" cy="230" r="13" fill="#00A2E8" />
              <text x="160" y="234" text-anchor="middle" fill="#FFFFFF" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="8px">mx</text>
              {/* Issued Details */}
              <text x="376" y="238" text-anchor="end" fill="#64748B" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="7px">Issued: June 2026</text>
              <text x="376" y="248" text-anchor="end" fill="#64748B" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="6px">Credential ID: MX-ADV-2026-4587</text>
              
              {/* Corner Geometric Pattern */}
              <path d="M400 120 L400 280 L280 280 Z" fill="#EEF2F6" opacity="0.4" />
              <path d="M400 150 L400 280 L310 280 Z" fill="#E2E8F0" opacity="0.6" />
              <path d="M400 180 L400 280 L340 280 Z" fill="#A78BFA" opacity="0.25" />
            </svg>
          </div>

          {/* Details Card Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header / Verified Badge row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
                Mendix Advanced Developer
              </h4>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  textTransform: 'capitalize',
                  lineHeight: 1,
                  flexShrink: 0
                }}
              >
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified Credential
              </span>
            </div>

            {/* Grid of metadata and skills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%' }}>
              {/* Left Column: Metadata details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  {
                    label: 'Issued By',
                    value: 'Mendix Academy',
                    icon: (
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#A78BFA" strokeWidth="2.2">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    )
                  },
                  {
                    label: 'Issue Date',
                    value: 'June 2026',
                    icon: (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    )
                  },
                  {
                    label: 'Credential ID',
                    value: 'MX-ADV-2026-4587',
                    icon: (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '13.5px', color: '#E2E8F0', fontWeight: 600 }}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Validated Skills */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Skills Validated
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Advanced Mendix Development',
                    'Microflows & Nanoflows',
                    'Domain Modeling',
                    'Security & Performance',
                    'Integration & APIs'
                  ].map((skill, index) => (
                    <div key={index} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 500, lineHeight: 1.2 }}>
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
            <button
              type="button"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 0',
                background: '#4F46E5',
                border: 'none',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4338CA';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(79, 70, 229, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#4F46E5';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.3)';
              }}
            >
              <span>View Full Certificate</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>

            <button
              type="button"
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 0',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <span>Download PDF</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>

          {/* Footer Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '4px' }}>
            <span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 550, letterSpacing: '0.01em' }}>
              All credentials are verified and sourced from official providers.
            </span>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CertificationsShowcasePage;
