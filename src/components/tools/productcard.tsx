/* src/components/tools/ProductCard.tsx */
import React from 'react';
import { Product } from '../../types/Product';
import { ProductPreview } from './ProductPreview';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  style?: React.CSSProperties;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  style,
}) => {
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
    comingSoon = false,
  } = product;

  return (
    <div
      style={{
        width: '380px',
        backgroundColor: 'rgba(15, 20, 33, 0.45)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        cursor: comingSoon ? 'not-allowed' : 'pointer',
        ...style
      }}
      onClick={() => {
        if (!comingSoon) onViewDetails(product);
      }}
    >
      {/* 1. Card Top Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(167, 139, 250, 0.1)',
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              border: '1px solid rgba(167, 139, 250, 0.15)'
            }}
          >
            {type}
          </span>
          {technologies.includes('Mendix') && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60A5FA',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                border: '1px solid rgba(59, 130, 246, 0.15)'
              }}
            >
              Mendix
            </span>
          )}
        </div>
        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{version}</span>
      </div>

      {/* 2. Large Preview Area */}
      <div style={{ height: '170px', width: '100%', flexShrink: 0 }}>
        <ProductPreview imageUrl={coverImage} title={title} comingSoon={comingSoon} />
      </div>

      {/* 3. Info Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: comingSoon ? '#64748B' : '#FFFFFF',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: 1.5,
            color: comingSoon ? '#475569' : '#94A3B8',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '38px',
          }}
        >
          {description}
        </p>
      </div>

      {/* 4. Tech stack chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', height: '26px', overflow: 'hidden' }}>
        {technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#64748B'
            }}
          >
            {tech}
          </span>
        ))}
        {technologies.length > 3 && (
          <span style={{ fontSize: '10.5px', color: '#475569', alignSelf: 'center' }}>
            +{technologies.length - 3} more
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />

      {/* 5. Bottom Metadata row */}
      {!comingSoon ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Rating */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="#F59E0B" stroke="#F59E0B">
                <path d="M12 3.8 14.5 9l5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4L9.5 9 12 3.8Z" />
              </svg>
              <strong style={{ color: '#E2E8F0' }}>{rating}</strong>
            </span>
            {/* Downloads */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{downloads}</span>
            </span>
            {/* Views */}
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{views}</span>
            </span>
          </div>
          <span>Updated {updatedAt}</span>
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600, textAlign: 'center' }}>
          COMING SOON • PRE-RELEASE STAGE
        </div>
      )}

      {/* 6. Primary Action button overlay shown on card hover */}
      {!comingSoon && (
        <div
          className="product-card-cta-btn"
          style={{
            marginTop: '8px',
            width: '100%',
            backgroundColor: 'var(--admin-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 0',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: 'var(--admin-shadow-sm)',
            transition: 'all 0.2s ease',
          }}
        >
          View Details
        </div>
      )}
    </div>
  );
};

export default ProductCard;
