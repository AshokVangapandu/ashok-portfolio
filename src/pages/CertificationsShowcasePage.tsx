import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase/client';
import { BackButton } from '../components/BackButton';

interface CertificationCard {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  logo: React.ReactNode;
  credentialId?: string;
  skills?: string[];
  verificationUrl?: string;
  pdfUrl?: string;
  isFeatured?: boolean;
}

const getProviderLogo = (issuer: string, certificateImageUrl?: string | null) => {
  if (certificateImageUrl && certificateImageUrl.trim() !== '') {
    return <img src={certificateImageUrl} alt={issuer} style={{ maxHeight: '28px', maxWidth: '28px', objectFit: 'contain', display: 'block' }} />;
  }
  const name = (issuer || '').toLowerCase().trim();
  if (name.includes('mendix')) {
    return <img src="../assets/images/Mendix-Brandmark.webp" alt="Mendix" style={{ maxHeight: '28px', maxWidth: '28px', objectFit: 'contain', display: 'block' }} />;
  }
  if (name.includes('google')) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: '#60A5FA' }}>
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.14 1 3 5.14 3 10.25s4.14 9.25 9.24 9.25c5.32 0 8.86-3.72 8.86-9.01 0-.61-.06-1.08-.14-1.54H12.24z" />
      </svg>
    );
  }
  if (name.includes('aws') || name.includes('amazon')) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: '#F59E0B' }}>
        <path d="M11.625 15.783c-1.189 0-2.18-.152-2.973-.456-.793-.304-1.229-.685-1.31-1.144-.066-.379.083-.75.446-1.112.363-.362.908-.667 1.636-.916.727-.248 1.656-.424 2.787-.528l2.673-.243v1.39c0 .736-.188 1.282-.564 1.637-.376.356-.99.534-1.84.534m3.048-6.147v1.73l-2.423.23c-1.393.13-2.483.364-3.272.705-.789.34-1.34.786-1.655 1.336-.314.55-.471 1.157-.471 1.823 0 .973.307 1.737.92 2.293.614.555 1.492.833 2.634.833 1.082 0 1.986-.226 2.711-.678a4.877 4.877 0 0 0 1.684-1.874h.084c.121.666.333 1.168.636 1.505.303.337.755.505 1.356.505.47 0 .973-.105 1.511-.314a13.38 13.38 0 0 0 1.51-.714V14.86c0-.987-.042-1.921-.125-2.802-.083-.88-.242-1.66-.477-2.339a5.147 5.147 0 0 0-1.042-1.874c-.496-.549-1.194-.973-2.096-1.272-.9-.3-2.023-.45-3.37-.45-1.42 0-2.585.185-3.493.555a6.666 6.666 0 0 0-2.33 1.585l1.323 1.306c.49-.496.99-.861 1.5-1.096.51-.235 1.176-.353 2.0-.353.94 0 1.636.19 2.09.569.453.38.68.959.68 1.738" />
        <path d="M12.046 22.094c3.488 0 6.634-1.22 8.784-3.213.303-.28.1-.733-.303-.64-2.883.666-6.425.992-9.743.992-3.473 0-7.253-.36-10.158-1.092-.394-.1-.594.364-.285.64 2.224 1.993 5.485 3.313 9.705 3.313m8.948-4.053c-.328-.426-1.503-.186-2.073-.092-.188.03-.236-.18-.073-.314.509-.42 1.485-.363 1.867.042.382.404-.036 1.442-.442 1.916-.134.155-.31.066-.273-.146.115-.658.322-.98.994-1.406" />
      </svg>
    );
  }
  if (name.includes('microsoft')) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M2 2h9.5v9.5H2V2zm10.5 0H22v9.5h-9.5V2zM2 12.5h9.5V22H2v-9.5zm10.5 0H22V22h-9.5v-9.5z" fill="#F25022" />
      </svg>
    );
  }
  if (name.includes('meta')) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: '#0668E1' }}>
        <path d="M22.5 12c0-3.32-2.7-6-6-6-2.22 0-4.14 1.2-5.16 3-1.02-1.8-2.94-3-5.16-3-3.3 0-6 2.68-6 6 0 3.31 2.7 6 6 6 2.22 0 4.14-1.2 5.16-3 1.02 1.8 2.94 3 5.16 3 3.3 0 6-2.69 6-6zm-17.34 4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm11.68 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
      </svg>
    );
  }
  if (name.includes('linux')) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: '#64748B' }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#7C5CFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
};

export const CertificationsShowcasePage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CertificationCard | null>(null);
  const [displayCard, setDisplayCard] = useState<CertificationCard | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
    ? '/ashok-portfolio/'
    : '/';

  const [certifications, setCertifications] = useState<CertificationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const handleCardSelect = (card: CertificationCard) => {
    if (card.id === selectedCard?.id) return;
    setIsTransitioning(true);
    setSelectedCard(card);
    setTimeout(() => {
      setDisplayCard(card);
      setIsTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    const fetchCerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('certifications')
          .select('*')
          .eq('status', 'published')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        const mapped = (data || []).map((c: any) => ({
          id: c.id,
          title: c.title,
          issuer: c.issuer,
          issueDate: c.issue_date,
          logo: getProviderLogo(c.issuer, c.certificate_image_url),
          credentialId: c.credential_id || undefined,
          skills: c.skills || [],
          verificationUrl: c.credential_url || undefined,
          pdfUrl: c.certificate_file_url || undefined,
          isFeatured: c.is_featured
        }));

        setCertifications(mapped);
        if (mapped.length > 0) {
          setSelectedCard(mapped[0]);
          setDisplayCard(mapped[0]);
        }
      } catch (err: any) {
        console.error('[CertificationsShowcasePage] Fetch failed:', err);
        setError(err.message || 'Failed to fetch certifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  const uniquePlatformsCount = useMemo(() => {
    const seen = new Set<string>();
    certifications.forEach(c => {
      if (c.issuer) {
        seen.add(c.issuer.toLowerCase().trim());
      }
    });
    return seen.size;
  }, [certifications]);

  const verifiedPercent = useMemo(() => {
    const total = certifications.length;
    if (total === 0) return 0;
    const verified = certifications.filter(c => (c.verificationUrl && c.verificationUrl.trim() !== '') || c.pdfUrl).length;
    return Math.round((verified / total) * 100);
  }, [certifications]);

  const stats = [
    {
      value: certifications.length > 0 ? `${certifications.length}+` : '0',
      label: 'Certifications',
      desc: 'Industry Recognized',
      glowColor: 'rgba(167, 139, 250, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
          <polygon points="12 5 13 8 16 8 13.5 10 14.5 13 12 11 9.5 13 10.5 10 8 8 11 8 12 5" fill="#a855f7" />
        </svg>
      )
    },
    {
      value: uniquePlatformsCount.toString(),
      label: 'Platforms',
      desc: 'Global Brands',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    {
      value: `${verifiedPercent}%`,
      label: 'Verified',
      desc: 'Authentic Credentials',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 11 2 2 4-4" />
        </svg>
      )
    }
  ];

  const filteredCertifications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return certifications;

    return certifications.filter(c => {
      const titleMatch = c.title?.toLowerCase().includes(query);
      const issuerMatch = c.issuer?.toLowerCase().includes(query);
      const skillsMatch = c.skills?.some(s => s.toLowerCase().includes(query));
      const credentialIdMatch = c.credentialId?.toLowerCase().includes(query);
      return titleMatch || issuerMatch || skillsMatch || credentialIdMatch;
    });
  }, [certifications, searchQuery]);

  // Reset pagination on search change
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery]);

  // Keep selected card in sync with filtered list
  useEffect(() => {
    if (filteredCertifications.length > 0) {
      const stillVisible = filteredCertifications.some(c => c.id === selectedCard?.id);
      if (!stillVisible) {
        setSelectedCard(filteredCertifications[0]);
        setDisplayCard(filteredCertifications[0]);
      }
    } else {
      setSelectedCard(null);
      setDisplayCard(null);
    }
  }, [filteredCertifications, selectedCard?.id]);

  const visibleCards = useMemo(() => {
    return filteredCertifications.slice(0, visibleCount);
  }, [filteredCertifications, visibleCount]);

  return (
    <div className="cert-showcase-container">
      {/* Top minimal back control */}
      <div className="cert-back-wrapper">
        <BackButton label="Back to Portfolio" fallbackUrl={`${baseUrl}#certifications`} />
      </div>

      {/* 1. Top Hero Section (Split Layout: Title on Left, 3 Stat Cards on Right) */}
      <section className="cert-hero-section">
        {/* Left Side: Headings */}
        <div className="cert-hero-left">
          {/* Medal Icon on the left */}
          <div className="cert-hero-medal-icon">
            <svg viewBox="0 0 24 24" width="38" height="42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <polygon points="12 8 13.5 11 16.5 11 14 13 15 16 12 14 9 16 10 13 7.5 11 10.5 11" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Text Stack on the right of the icon */}
          <div className="cert-hero-text-stack">
            <div className="cert-hero-tag">
              CERTIFICATIONS
            </div>
            <h1 className="cert-hero-title">
              Professional Certifications
            </h1>
            <p className="cert-hero-desc">
              Trusted credentials from globally recognized organizations that validate my skills and expertise.
            </p>
          </div>
        </div>

        {/* Right Side: 3 Stats Cards */}
        <div className="cert-hero-stats">
          {stats.map((stat, idx) => (
            <div key={idx} className="cert-stat-card">
              <div className="cert-stat-top-row">
                <div className="cert-stat-icon-wrap">
                  {stat.icon}
                </div>
                <div className="cert-stat-numbers">
                  <div className="cert-stat-val">
                    {stat.value}
                  </div>
                  <div className="cert-stat-label">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className="cert-stat-desc">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Main Content (Two-Column Layout: Left Search + Grid, Right Sticky Preview) */}
      <section className="cert-main-grid">
        {/* Left Column: Search Bar & Grid Cards */}
        <div className="cert-left-col">
          {/* Search bar Component */}
          <div className={`cert-search-box ${searchFocused ? 'focused' : ''}`}>
            <span className="cert-search-icon-left">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search certifications, platforms or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cert-search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <span className="cert-search-icon-right">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : (
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
              )}
            </span>
          </div>

          {loading ? (
            <div className="cert-state-msg">
              Loading certifications showcase...
            </div>
          ) : error ? (
            <div className="cert-state-msg error">
              Error loading certifications: {error}
            </div>
          ) : (
            <>
              {/* Grid Cards Component */}
              <div className="cert-cards-grid">
                {filteredCertifications.length === 0 ? (
                  <div className="cert-empty-state">
                    No certifications found matching your search.
                  </div>
                ) : (
                  visibleCards.map((card) => {
                    const isHovered = hoveredCard === card.id;
                    const isActive = selectedCard?.id === card.id;
                    return (
                      <div
                        key={card.id}
                        onMouseEnter={() => setHoveredCard(card.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleCardSelect(card)}
                        className={`cert-card ${isActive ? 'active' : ''} ${card.isFeatured ? 'featured' : ''} ${isHovered ? 'hovered' : ''}`}
                      >
                        {/* Top: Logo and badges */}
                        <div className="cert-card-top-row">
                          <div className="cert-card-logo-box">
                            {card.logo}
                          </div>

                          {card.isFeatured && (
                            <span className="cert-card-featured-badge">
                              <span style={{ fontSize: '9px' }}>⭐</span>
                              <span>Featured</span>
                            </span>
                          )}
                        </div>

                        {/* Middle: Title, Issuer, and Verified badge */}
                        <div className="cert-card-info-stack">
                          <h3 className="cert-card-title">
                            {card.title}
                          </h3>
                          <p className="cert-card-issuer">
                            {card.issuer}
                          </p>
                          <div style={{ display: 'flex' }}>
                            <span className="cert-card-verified-badge">
                              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Verified
                            </span>
                          </div>
                        </div>

                        {/* Date with calendar icon */}
                        <div className="cert-card-date-row">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{card.issueDate}</span>
                        </div>

                        {/* Bottom: View Credential link */}
                        <div className="cert-card-bottom-link-row">
                          <span className="cert-card-link-text">
                            View Credential →
                          </span>
                          <span className="cert-card-link-icon">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom: Show More button */}
              {visibleCount < filteredCertifications.length && (
                <div className="cert-show-more-wrap">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="cert-show-more-btn"
                  >
                    <span>Show More Certifications</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Sticky Preview Sidebar */}
        <aside className="cert-preview-sidebar">
          {/* Header Row */}
          <div className="cert-preview-header">
            <span style={{ display: 'flex', marginTop: '2px', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <div className="cert-preview-header-text">
              <h3 className="cert-preview-title">
                Certificate Preview
              </h3>
              <span className="cert-preview-subtitle">
                Click on any certificate to view full details.
              </span>
            </div>
          </div>

          {!displayCard ? (
            <div className="cert-preview-empty">
              <span>No certificate selected</span>
            </div>
          ) : (
            <div
              className={`cert-preview-body ${isTransitioning ? 'transitioning' : ''}`}
            >
              {/* Large Certificate Preview/Mockup */}
              <div className="cert-preview-img-box">
                {displayCard.pdfUrl ? (
                  displayCard.pdfUrl.toLowerCase().includes('.pdf') ? (
                    <iframe
                      src={`${displayCard.pdfUrl}#toolbar=0&navpanes=0`}
                      title={displayCard.title}
                      className="cert-preview-frame"
                    />
                  ) : (
                    <img
                      src={displayCard.pdfUrl}
                      alt={displayCard.title}
                      className="cert-preview-img"
                    />
                  )
                ) : (
                  <div className="cert-preview-no-img">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No Certificate Image Available</span>
                  </div>
                )}
              </div>

              {/* Details Card Content */}
              <div className="cert-preview-info-wrap">
                {/* Header / Verified Badge row */}
                <div className="cert-preview-title-row">
                  <h4 className="cert-preview-cert-title">
                    {displayCard.title}
                  </h4>
                  <span className="cert-preview-badge-pill">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified Credential
                  </span>
                </div>

                {/* Grid of metadata and skills */}
                <div className="cert-preview-meta-grid">
                  {/* Left Column: Metadata details */}
                  <div className="cert-preview-meta-col">
                    {[
                      {
                        label: 'Issued By',
                        value: displayCard.issuer || '—',
                        icon: (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#A78BFA" strokeWidth="2.2">
                            <circle cx="12" cy="8" r="6" />
                            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                          </svg>
                        )
                      },
                      {
                        label: 'Issue Date',
                        value: displayCard.issueDate || '—',
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
                        value: displayCard.credentialId || '—',
                        icon: (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="cert-preview-meta-item">
                        <div className="cert-preview-meta-icon-box">
                          {item.icon}
                        </div>
                        <div className="cert-preview-meta-text-box">
                          <span className="cert-preview-meta-label">
                            {item.label}
                          </span>
                          <span className="cert-preview-meta-val">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Validated Skills */}
                  <div className="cert-preview-skills-col">
                    <span className="cert-preview-skills-heading">
                      Skills Validated
                    </span>
                    <div className="cert-preview-skills-list">
                      {displayCard.skills && displayCard.skills.length > 0 ? (
                        displayCard.skills.map((skill, index) => (
                          <div key={index} className="cert-preview-skill-item">
                            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="cert-preview-skill-text">
                              {skill}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                <button
                  type="button"
                  disabled={!displayCard.pdfUrl}
                  onClick={() => displayCard.pdfUrl && window.open(displayCard.pdfUrl, '_blank')}
                  className="cert-preview-download-btn"
                >
                  <span>Download PDF</span>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="cert-preview-footer-note">
            <span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span>
              All credentials are verified and sourced from official providers.
            </span>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default CertificationsShowcasePage;
