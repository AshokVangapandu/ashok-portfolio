/* src/pages/ToolsProductsPage.tsx */
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';
import { ProductMetrics } from '../components/tools/productmetrics';
import { AchievementsPanel } from '../components/tools/achievementspanel';
import { TechnologyGrid } from '../components/tools/technologygrid';
import { CTASection } from '../components/tools/ctasection';
import { ProductDetailsModal } from '../components/tools/productdetailsmodal';
import { BackButton } from '../components/BackButton';

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

export const ToolsProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
    ? '/ashok-portfolio/'
    : '/';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const list = await productService.getProducts();
        setProducts(list);
        if (list.length > 0) {
          setActiveProduct(list[0]);
        }

        const featured = await productService.getFeaturedProduct();
        setFeaturedProduct(featured);
      } catch (err) {
        console.error('[ToolsProductsPage] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesQuery = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesQuery;
  });

  // Automatically update the selected active tool if search query or products list changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setActiveProduct(filteredProducts[0]);
    } else {
      setActiveProduct(null);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    if (products.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const prodId = hash.replace('#', '');
        const found = products.find(p => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
        } else {
          setSelectedProduct(null);
        }
      } else {
        setSelectedProduct(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [products]);

  const handleOpenDetails = (prod: Product) => {
    window.location.hash = prod.id;
  };

  const handleCloseDetails = () => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setSelectedProduct(null);
  };

  const getCategoryColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('developer')) return '#A78BFA';
    if (t.includes('3d') || t.includes('visualization')) return '#F59E0B';
    if (t.includes('mendix') || t.includes('widget')) return '#F59E0B';
    if (t.includes('figma') || t.includes('plugin')) return '#10B981';
    return '#94A3B8';
  };

  return (
    <div
      className="tools-page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '36px 24px 80px 24px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Mobile Page Header (Shown on Mobile ONLY <= 768px) */}
      <div className="tools-mobile-header-bar">
        <button
          type="button"
          className="projects-mobile-back-btn"
          onClick={() => {
            const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
              ? '/ashok-portfolio/'
              : '/';
            window.location.href = `${baseUrl}#widget-lab`;
          }}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Portfolio</span>
        </button>
        <button
          type="button"
          className="projects-mobile-share-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Tools & Products Showcase',
                url: window.location.href
              }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          aria-label="Share"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* Desktop Top minimal back control */}
      <div className="tools-desktop-back-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <BackButton label="Back to Portfolio" fallbackUrl={`${baseUrl}#widget-lab`} />
      </div>
      <style>{`
        @keyframes pulse-glow-orange {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.8)); }
          100% { transform: scale(1); opacity: 0.6; }
        }
        .pulse-glow-orange {
          animation: pulse-glow-orange 2s infinite ease-in-out;
        }
        .tool-mini-card-inactive:hover {
          transform: translateY(-2px) !important;
          background-color: rgba(255, 255, 255, 0.035) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
        }
        .tool-mini-card-inactive-featured:hover {
          transform: translateY(-2px) !important;
          background-color: rgba(212, 163, 89, 0.045) !important;
          border-color: rgba(212, 163, 89, 0.35) !important;
          box-shadow: 0 4px 20px rgba(212, 163, 89, 0.06) !important;
        }
      `}</style>

      {/* 2. Hero Section - Desktop Version */}
      <section
        className="tools-desktop-hero"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          padding: '24px 24px 20px 24px',
          background: 'transparent',
          border: 'none',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'visible'
        }}
      >
        {/* Glow backdrop decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.09) 0%, transparent 75%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#A78BFA',
            backgroundColor: 'rgba(124, 58, 237, 0.12)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: '999px',
            padding: '6px 16px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2
          }}
        >
          ★ PRODUCT ECOSYSTEM
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px', zIndex: 2 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(36px, 6vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              width: '100%',
              color: '#FFFFFF'
            }}
          >
            Tools <span style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>&</span> Products
          </h1>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 'clamp(15px, 2.5vw, 17px)',
              lineHeight: 1.6,
              color: '#CBD5E1',
              fontWeight: 400,
              maxWidth: '680px'
            }}
          >
            Pluggable widgets, developer plugins, and productivity tools crafted to streamline workflows and accelerate modern product development.
          </p>
        </div>
      </section>

      {/* Hero Section - Mobile Version (<= 768px) */}
      <section className="tools-mobile-hero">
        <span className="tools-mobile-badge">
          <span className="purple-dot" /> PRODUCT SHOWCASE
        </span>
        <h1 className="tools-mobile-hero-title">
          Tools <span className="tools-mobile-amp">&</span> Products
        </h1>
        <p className="tools-mobile-hero-desc">
          Plug-and-play tools, developer plugins, and productivity solutions crafted to streamline workflows.
        </p>
      </section>

      {/* 3. Complete Collection Section */}
      <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Desktop Header */}
        <div className="tools-desktop-collection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '16px', backgroundColor: 'var(--admin-primary)', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Complete Collection
            </h2>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginLeft: '4px' }}>
              ({filteredProducts.length} Items Available)
            </span>
          </div>
        </div>

        {/* Mobile Header & Horizontal Card Rail (<= 768px) */}
        <div className="tools-mobile-collection-wrapper">
          <div className="tools-mobile-collection-header">
            <div className="tools-mobile-collection-title-group">
              <h2 className="tools-mobile-collection-title">Complete Collection</h2>
              <span className="tools-mobile-collection-count">
                {filteredProducts.length} tools available
              </span>
            </div>
            {/* Mobile Search Field */}
            <div className="tools-mobile-search-box">
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: '#64748B', flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search tools & plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tools-mobile-search-input"
              />
            </div>
          </div>

          <div className="tools-mobile-rail custom-scrollbar">
            {filteredProducts.map((prod) => {
              const isActive = activeProduct?.id === prod.id;
              const categoryColor = getCategoryColor(prod.type);
              return (
                <div
                  key={prod.id}
                  className={`tools-mobile-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveProduct(prod)}
                >
                  <div className="tools-mobile-card-thumb">
                    {prod.coverImage && prod.coverImage.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#EF4444" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    ) : (
                      <img
                        src={prod.coverImage || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
                        alt={prod.title}
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
                        }}
                      />
                    )}
                  </div>
                  <div className="tools-mobile-card-body">
                    <div className="tools-mobile-card-title-row">
                      <h4 className="tools-mobile-card-title">{prod.title}</h4>
                      <span className="tools-mobile-card-version">v{prod.version}</span>
                    </div>
                    <span className="tools-mobile-card-type" style={{ color: categoryColor }}>
                      {prod.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Featured Product Card (Phase 2 - <= 768px) */}
          {activeProduct && (
            <div className="tools-mobile-featured-card">
              {/* Header badges */}
              <div className="tools-mobile-featured-header-badges">
                <span className="tools-mobile-featured-badge">
                  ⭐ FEATURED PRODUCT
                </span>
                <span className="tools-mobile-featured-version">
                  v{activeProduct.version}
                </span>
              </div>

              {/* Product image */}
              <div className="tools-mobile-featured-img-box">
                {activeProduct.coverImage && activeProduct.coverImage.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                  <div className="tools-mobile-pdf-placeholder">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#EF4444" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={activeProduct.coverImage || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
                    alt={activeProduct.title}
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
                    }}
                  />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="tools-mobile-featured-info">
                <h3 className="tools-mobile-featured-title">{activeProduct.title}</h3>
                <div className="tools-mobile-featured-submeta">
                  <span className="tools-mobile-featured-type">{activeProduct.type}</span>
                  <span className="tools-mobile-dot-sep">•</span>
                  <span className="tools-mobile-featured-rating">
                    ★ {activeProduct.rating || 4.9} <span className="tools-mobile-reviews-count">(18 reviews)</span>
                  </span>
                </div>
                <p className="tools-mobile-featured-desc">
                  {activeProduct.description}
                </p>
                {activeProduct.description && activeProduct.description.length > 100 && (
                  <span
                    className="tools-mobile-read-more"
                    onClick={() => handleOpenDetails(activeProduct)}
                  >
                    Read more...
                  </span>
                )}
              </div>

              <hr className="tools-mobile-featured-divider" />

              {/* Key Capabilities */}
              <div className="tools-mobile-capabilities-section">
                <h4 className="tools-mobile-section-label">KEY CAPABILITIES</h4>
                <ul className="tools-mobile-capabilities-list">
                  {(activeProduct.features && activeProduct.features.length > 0 ? activeProduct.features.slice(0, 4) : [
                    'Intuitive star/emoji rating interface',
                    'Real-time analytics & distribution',
                    'Optimized for all devices',
                    'Seamless Mendix integration'
                  ]).map((cap, idx) => (
                    <li key={idx} className="tools-mobile-capability-item">
                      <span className="tools-mobile-check-icon">✓</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies Used */}
              <div className="tools-mobile-tech-section">
                <h4 className="tools-mobile-section-label">TECHNOLOGIES USED</h4>
                <div className="tools-mobile-tech-pills">
                  {activeProduct.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="tools-mobile-tech-pill">
                      {tech}
                    </span>
                  ))}
                  {activeProduct.technologies.length > 3 && (
                    <span className="tools-mobile-tech-pill extra">
                      +{activeProduct.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="tools-mobile-featured-actions">
                <button
                  type="button"
                  className="tools-mobile-btn-primary"
                  onClick={() => handleOpenDetails(activeProduct)}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Details
                </button>

                {activeProduct.marketplaceUrl && (
                  <a
                    href={activeProduct.marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tools-mobile-btn-secondary"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Marketplace
                  </a>
                )}

                {activeProduct.githubUrl && (
                  <a
                    href={activeProduct.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tools-mobile-btn-secondary"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '40px' }}>Loading marketplace catalogue...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '32px',
              width: '100%',
              minHeight: '520px',
              boxSizing: 'border-box'
            }}
            className="master-detail-grid"
          >
            {/* Left Column (List & Search) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxSizing: 'border-box'
              }}
              className="master-list-column"
            >
              {/* Search input */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Search tools & plugins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(15, 20, 33, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  className="search-input-field"
                />
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B'
                  }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* Scrollable List of Mini Cards */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '560px',
                  overflowY: 'auto',
                  padding: '6px'
                }}
                className="custom-scrollbar"
              >
                {filteredProducts.map((prod) => {
                  const isActive = activeProduct?.id === prod.id;
                  const isFeatured = prod.featured;
                  const isComingSoon = prod.comingSoon;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setActiveProduct(prod)}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: isActive
                          ? (isFeatured ? 'rgba(212, 163, 89, 0.05)' : 'rgba(124, 58, 237, 0.06)')
                          : (isFeatured ? 'rgba(212, 163, 89, 0.02)' : (isComingSoon ? 'rgba(255, 255, 255, 0.005)' : 'rgba(255, 255, 255, 0.015)')),
                        border: isActive
                          ? (isFeatured ? '1px solid rgba(212, 163, 89, 0.45)' : '1px solid rgba(139, 92, 246, 0.4)')
                          : (isFeatured ? '1px solid rgba(212, 163, 89, 0.15)' : (isComingSoon ? '1px solid rgba(255, 255, 255, 0.02)' : '1px solid rgba(255, 255, 255, 0.05)')),
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '12px',
                        alignItems: 'center',
                        textAlign: 'left',
                        transform: isActive ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
                        boxShadow: isActive
                          ? (isFeatured ? '0 8px 32px rgba(212, 163, 89, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)' : '0 8px 32px rgba(139, 92, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)')
                          : (isFeatured ? '0 4px 12px rgba(212, 163, 89, 0.03)' : 'none'),
                        opacity: isComingSoon && !isActive ? 0.75 : 1
                      }}
                      className={isActive ? "tool-mini-card" : (isFeatured ? "tool-mini-card tool-mini-card-inactive-featured" : "tool-mini-card tool-mini-card-inactive")}
                    >
                      {/* Image Icon Thumbnail */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#090D1A',
                          border: isActive
                            ? (isFeatured ? '1.5px solid #D4A359' : '1.5px solid #A78BFA')
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          padding: '6px',
                          boxSizing: 'border-box',
                          transition: 'all 0.25s ease',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        {prod.coverImage && prod.coverImage.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#EF4444" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        ) : (
                          <img
                            src={prod.coverImage || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45" stroke="%237C5CFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              transform: isActive ? 'scale(1.05)' : 'scale(1)',
                              transition: 'transform 0.25s ease'
                            }}
                          />
                        )}
                      </div>

                      {/* Content block */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexGrow: 1, overflow: 'hidden' }}>
                        {/* Type/Badge row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflow: 'hidden' }}>
                            <span style={{ fontSize: '9px', fontWeight: 650, color: isActive ? '#C4B5FD' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                              {prod.type}
                            </span>
                            {isFeatured && (
                              <span style={{ fontSize: '11px', color: '#D4A359', display: 'inline-flex', alignItems: 'center' }} title="Signature Product">
                                ⭐
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, flexShrink: 0 }}>v{prod.version}</span>
                        </div>

                        {/* Title block */}
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: isActive ? '#FFFFFF' : '#CBD5E1', transition: 'color 0.2s ease', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="tool-card-title">
                          {prod.title}
                        </h4>

                        {/* Footer row with metrics */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: '#64748B', fontWeight: 500 }}>
                          {!isComingSoon ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#10B981' }}>
                                ★ {prod.rating}
                              </span>
                              <span>{prod.downloads} downloads</span>
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#F59E0B', fontWeight: 600 }}>
                              <span
                                className="pulse-glow-orange"
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#F59E0B',
                                  display: 'inline-block'
                                }}
                              />
                              In Development
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#64748B', padding: '32px 0', fontSize: '13px', fontWeight: 500 }}>
                    No matching items found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Showcase Details) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                backgroundColor: 'rgba(15, 20, 33, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '32px',
                boxSizing: 'border-box',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
              }}
              className="master-details-panel"
            >
              {activeProduct ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Image and Header Row */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr',
                      gap: '24px',
                      alignItems: 'start'
                    }}
                    className="details-header-row"
                  >
                    <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#090D1A', position: 'relative' }}>
                      {activeProduct.coverImage && activeProduct.coverImage.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#EF4444',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(15, 23, 42, 0.5)'
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(activeProduct.coverImage, '_blank');
                            }}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '4px',
                              color: '#FCA5A5',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}
                          >
                            Open PDF
                          </button>
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          {activeProduct.coverImage && (
                            <img
                              src={activeProduct.coverImage}
                              alt=""
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'blur(16px) opacity(0.35)',
                                zIndex: 1,
                                pointerEvents: 'none'
                              }}
                            />
                          )}
                          <img
                            src={activeProduct.coverImage || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%230F172A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
                            alt={activeProduct.title}
                            onError={(e) => {
                              console.error(`[ToolsProductsPage] Failed to load image: "${activeProduct.coverImage || 'Empty URL'}"`);
                              e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%230F172A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
                              const parent = e.currentTarget.parentElement;
                              const bgImg = parent?.querySelector('img[alt=""]');
                              if (bgImg) (bgImg as HTMLElement).style.display = 'none';
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {activeProduct.featured && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: 'rgba(212, 163, 89, 0.08)',
                              border: '1px solid rgba(212, 163, 89, 0.18)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              color: '#D4A359',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            ⭐ Signature Product
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 500,
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            border: '1px solid rgba(124, 58, 237, 0.2)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            color: '#C4B5FD',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {activeProduct.type}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                          Version {activeProduct.version}
                        </span>
                      </div>

                      <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        {activeProduct.title}
                      </h3>

                      {!activeProduct.comingSoon && (
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                          <span>Downloads: <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>{activeProduct.downloads}</strong></span>
                          <span>Rating: <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>★ {activeProduct.rating}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)', margin: 0 }} />

                  {/* Description */}
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      About
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#94A3B8', fontWeight: 450, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeProduct.description}
                    </p>
                    {activeProduct.description && activeProduct.description.length > 150 && (
                      <span
                        onClick={() => handleOpenDetails(activeProduct)}
                        style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 650, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#C4B5FD'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#A78BFA'}
                      >
                        Read full description →
                      </span>
                    )}
                  </div>

                  {/* Key Features */}
                  {activeProduct.features && activeProduct.features.length > 0 && (
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {activeProduct.comingSoon ? '🚀 Planned Features' : 'Key Capabilities'}
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.4, fontWeight: 450 }}>
                        {activeProduct.features.slice(0, 3).map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                      {activeProduct.features.length > 3 && (
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, paddingLeft: '18px', marginTop: '2px' }}>
                          +{activeProduct.features.length - 3} more features (open details to view)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Technologies Used */}
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {activeProduct.comingSoon ? '⚙ Currently Building With' : 'Technologies Used'}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {activeProduct.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            color: '#E2E8F0',
                            transition: 'all 0.2s ease'
                          }}
                          className="tech-item-badge"
                        >
                          {tech}
                        </span>
                      ))}
                      {activeProduct.technologies.length > 3 && (
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(124, 58, 237, 0.08)',
                            border: '1px solid rgba(124, 58, 237, 0.15)',
                            color: '#C4B5FD',
                            transition: 'all 0.2s ease'
                          }}
                          className="tech-item-badge"
                        >
                          +{activeProduct.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Link Buttons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(activeProduct)}
                      className="hover-scale active-press"
                      style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--admin-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      View Details
                    </button>

                    {activeProduct.comingSoon ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).showToast) {
                            (window as any).showToast('success', 'Notification Registered', `We will notify you when ${activeProduct.title} is released!`, 4000);
                          }
                        }}
                        className="hover-scale active-press"
                        style={{
                          padding: '12px 24px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#FFFFFF',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        🔔 Notify Me
                      </button>
                    ) : (
                      <>
                        {activeProduct.marketplaceUrl && (
                          <a
                            href={activeProduct.marketplaceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-scale"
                            style={{
                              padding: '12px 20px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              color: '#E2E8F0',
                              fontSize: '13px',
                              fontWeight: 650,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            Marketplace
                          </a>
                        )}
                        {activeProduct.githubUrl && (
                          <a
                            href={activeProduct.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-scale"
                            style={{
                              padding: '12px 20px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              color: '#E2E8F0',
                              fontSize: '13px',
                              fontWeight: 650,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            GitHub
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: '#64748B', fontWeight: 550 }}>
                  Select a tool from the collection to view its detail specs.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 5. Metrics & Achievements stacked vertically */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%'
        }}
        className="metrics-grid-layout"
      >
        <ProductMetrics />
        <AchievementsPanel />
      </section>

      {/* 6. Technology Stack grid */}
      <section style={{ width: '100%' }}>
        <TechnologyGrid />
      </section>

      {/* 7. Bottom CTA banner action */}
      <section style={{ width: '100%' }}>
        <CTASection />
      </section>

      {/* 8. Full-screen Detail Modal Panel overlay */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={handleCloseDetails}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.4);
        }
        @media (max-width: 900px) {
          .master-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .metrics-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .details-header-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .master-details-panel {
            padding: 20px !important;
          }
          .metrics-grid-layout > div {
            padding: 20px 16px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ToolsProductsPage;
