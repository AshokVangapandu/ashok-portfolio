/* src/pages/ToolsProductsPage.tsx */
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';
import { ProductMetrics } from '../components/tools/productmetrics';
import { AchievementsPanel } from '../components/tools/achievementspanel';
import { TechnologyGrid } from '../components/tools/technologygrid';
import { CTASection } from '../components/tools/ctasection';
import { ProductDetailsModal } from '../components/tools/productdetailsmodal';

export const ToolsProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

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
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setSelectedProduct(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '64px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '110px 24px 80px 24px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Hero Section (Polished Editorial Layout) */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          padding: '60px 24px 20px 24px',
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

      {/* 4. Complete Collection - Master Detail Layout */}
      <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
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
                  paddingRight: '6px'
                }}
                className="custom-scrollbar"
              >
                {filteredProducts.map((prod) => {
                  const isActive = activeProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setActiveProduct(prod)}
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.01)',
                        border: isActive ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255, 255, 255, 0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        textAlign: 'left'
                      }}
                      className="tool-mini-card"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 500, color: isActive ? '#C4B5FD' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {prod.type}
                        </span>
                        <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          ★ {prod.rating}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: isActive ? '#FFFFFF' : '#CBD5E1', transition: 'color 0.2s ease' }} className="tool-card-title">
                        {prod.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                        <span>{prod.downloads} downloads</span>
                        <span>v{prod.version}</span>
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
                    <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <img
                        src={activeProduct.coverImage}
                        alt={activeProduct.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
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
                        {activeProduct.comingSoon && (
                          <span style={{ fontSize: '10px', fontWeight: 500, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '6px', padding: '3px 8px', color: '#F59E0B', textTransform: 'uppercase' }}>
                            Coming Soon
                          </span>
                        )}
                      </div>

                      <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        {activeProduct.title}
                      </h3>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                        <span>Downloads: <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>{activeProduct.downloads}</strong></span>
                        <span>Rating: <strong style={{ color: '#E2E8F0', fontWeight: 500 }}>★ {activeProduct.rating}</strong></span>
                      </div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.05)', margin: 0 }} />

                  {/* Description */}
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      About
                    </span>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#94A3B8', fontWeight: 450 }}>
                      {activeProduct.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  {activeProduct.features && (
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Key Capabilities
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.4, fontWeight: 450 }}>
                        {activeProduct.features.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies Used */}
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Technologies Used
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {activeProduct.technologies.map((tech) => (
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
                    {activeProduct.docsUrl && (
                      <a
                        href={activeProduct.docsUrl}
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
                        Docs
                      </a>
                    )}
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
