/* src/components/tools/ProductDetailsModal.tsx */
import React, { useEffect } from 'react';
import { Product } from '../../types/Product';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

interface ComingSoonData {
  progress: number;
  status: { label: string; state: 'done' | 'wip' | 'todo' }[];
  estimatedRelease: string;
}

const getComingSoonDetails = (title: string): ComingSoonData => {
  const seed = title.length;
  const progress = 60 + (seed % 5) * 8; // returns 60%, 68%, 76%, 84%, 92%
  
  const statusList: ComingSoonData['status'] = [
    { label: 'Architecture & Design', state: 'done' },
    { label: 'UI Layout Complete', state: progress >= 68 ? 'done' : 'wip' },
    { label: 'Core Engineering', state: progress >= 84 ? 'done' : 'wip' },
    { label: 'Quality Assurance Testing', state: progress >= 92 ? 'done' : (progress >= 76 ? 'wip' : 'todo') },
    { label: 'Marketplace Deployment', state: 'todo' }
  ];

  const estimatedRelease = `Q${3 + (seed % 2)} 2026`; // Q3 2026 or Q4 2026

  return {
    progress,
    status: statusList,
    estimatedRelease
  };
};

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Handle Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!product) return null;

  const {
    title,
    description,
    type,
    version,
    coverImage,
    technologies,
    rating,
    downloads,
    views,
    updatedAt,
    marketplaceUrl,
    githubUrl,
    docsUrl,
    demoUrl,
    features = [],
    problemSolved = '',
    comingSoon = false,
    featured = false
  } = product;

  const formatLastUpdated = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = date.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div
      className="product-details-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '40px 24px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
      onClick={onClose}
    >
      {/* Container Card */}
      <div
        className="product-details-modal-card"
        style={{
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: '#0A0E1A',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          alignSelf: 'flex-start',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Banner / Preview */}
        <div className="product-details-modal-banner" style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden', backgroundColor: '#090D1A' }}>
          {coverImage && coverImage.toLowerCase().split('?')[0].endsWith('.pdf') ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: '#EF4444',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.5)'
              }}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#F3F4F6' }}>PDF Document Source</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(coverImage, '_blank');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#FCA5A5',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
              >
                Open / Download Document
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {coverImage && (
                <img
                  src={coverImage}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'blur(20px) opacity(0.35)',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                />
              )}
              <img
                src={coverImage || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%230A0E1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
                alt={title}
                onError={(e) => {
                  console.error(`[ProductDetailsModal] Failed to load image: "${coverImage || 'Empty URL'}"`);
                  e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%230A0E1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
                  const parent = e.currentTarget.parentElement;
                  const bgImg = parent?.querySelector('img[alt=""]');
                  if (bgImg) (bgImg as HTMLElement).style.display = 'none';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }}
              />
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 30%, #0A0E1A 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="product-details-modal-close-btn hover-scale active-press"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.15s ease',
              zIndex: 20
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'}
            aria-label="Close panel"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Back Navigation label */}
          <button
            type="button"
            onClick={onClose}
            className="product-details-modal-back-btn hover-scale"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#A78BFA',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)',
              zIndex: 20
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>

        {/* Content Section */}
        <div
          className="product-details-modal-content-grid"
          style={{
            padding: '0 40px 40px 40px',
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr',
            gap: '40px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Column: Core Info & Features */}
          <div className="product-details-modal-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Badge row */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {featured && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(212, 163, 89, 0.08)',
                      color: '#D4A359',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(212, 163, 89, 0.18)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    ⭐ Signature
                  </span>
                )}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    color: '#C4B5FD',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {type}
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{version}</span>
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Description</span>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#94A3B8' }}>{description}</p>
            </div>

            {/* Problem Solved */}
            {problemSolved && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Problem Solved</span>
                <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#94A3B8', fontStyle: 'italic' }}>{problemSolved}</p>
              </div>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {comingSoon ? '🚀 Planned Features' : 'Key Features'}
                </span>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {features.map((f, idx) => (
                    <li key={idx} style={{ fontSize: '14.5px', color: '#E2E8F0', lineHeight: 1.5 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {comingSoon ? '⚙ Currently Building With' : 'Technologies Used'}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#C4B5FD'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Statistics & Action Links */}
          <div
            className="product-details-modal-right-col"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              height: comingSoon ? 'auto' : '100%', 
              justifyContent: comingSoon ? 'flex-start' : 'space-between' 
            }}
          >
            {comingSoon ? (
              (() => {
                const details = getComingSoonDetails(title);
                return (
                  <>
                    <div
                      style={{
                        position: 'relative',
                        padding: '24px',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(124, 58, 237, 0.18)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      {/* Main Heading & Friendly stay-tuned message */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1, alignItems: 'center' }}>
                        <span style={{ fontSize: '32px', marginBottom: '4px' }}>✨</span>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                          Coming Soon
                        </div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '14.5px', lineHeight: 1.5, color: '#CBD5E1', fontWeight: 450, maxWidth: '280px' }}>
                          Stay tuned — something exciting is on the way!
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).showToast) {
                          (window as any).showToast('success', 'Notification Registered', `We will notify you when ${title} is released!`, 4000);
                        }
                      }}
                      className="hover-scale active-press"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        borderRadius: '10px',
                        backgroundColor: 'var(--admin-primary)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                        transition: 'all 0.15s ease',
                        width: '100%'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary-hover)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary)'}
                    >
                      🔔 Notify Me
                    </button>
                  </>
                );
              })()
            ) : (
              <>
                <div
                  className="product-details-modal-stats-box"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}
                >
                  {/* downloads */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Downloads</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{downloads}</span>
                  </div>
                  {/* views */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Views</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{views}</span>
                  </div>
                  {/* rating */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Rating</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#F59E0B" stroke="#F59E0B">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      {rating}
                    </span>
                  </div>
                  {/* updated */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Last Updated</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', alignSelf: 'flex-start', marginTop: '4px' }}>{formatLastUpdated(updatedAt)}</span>
                  </div>
                </div>

                {/* Action buttons list */}
                <div className="product-details-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {marketplaceUrl && (
                    <a
                      href={marketplaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-scale active-press"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        borderRadius: '10px',
                        backgroundColor: 'var(--admin-primary)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary-hover)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-primary)'}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Get from Marketplace
                    </a>
                  )}

                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-scale"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Launch Live Demo
                    </a>
                  )}

                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-scale"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      Explore GitHub Repo
                    </a>
                  )}

                  {docsUrl && (
                    <a
                      href={docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-scale"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Read Documentation
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default ProductDetailsModal;
