/* src/components/tools/ProductPreview.tsx */
import React from 'react';

interface ProductPreviewProps {
  imageUrl: string;
  title: string;
  badge?: string;
  comingSoon?: boolean;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  imageUrl,
  title,
  badge,
  comingSoon = false,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#090D1A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: comingSoon ? 'blur(4px) grayscale(50%)' : 'none',
        opacity: comingSoon ? 0.4 : 1,
        transition: 'all 0.4s ease',
      }}
    >
      {/* Background Soft Purple Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          right: '-20%',
          bottom: '-20%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 65%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Actual Product Image */}
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 2,
          transition: 'transform 0.5s ease',
        }}
        onMouseOver={(e) => {
          if (!comingSoon) e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          if (!comingSoon) e.currentTarget.style.transform = 'scale(1)';
        }}
      />

      {/* Visual Glare Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Badge Overlay */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'rgba(124, 58, 237, 0.85)',
            border: '1px solid rgba(196, 181, 253, 0.3)',
            borderRadius: '999px',
            padding: '4px 12px',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            zIndex: 4,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {badge}
        </div>
      )}

      {comingSoon && (
        <div
          style={{
            position: 'absolute',
            zIndex: 5,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#A78BFA',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: 'var(--admin-shadow-md)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Coming Soon
        </div>
      )}
    </div>
  );
};

export default ProductPreview;
