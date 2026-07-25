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

      {/* Actual Product Image or PDF placeholder */}
      {imageUrl && imageUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
        <div
          style={{
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#EF4444',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            position: 'absolute',
            inset: 0
          }}
        >
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#F3F4F6' }}>PDF Document</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(imageUrl, '_blank');
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              color: '#FCA5A5',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
          >
            Open / Download
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          {imageUrl && (
            <img
              src={imageUrl}
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
            src={imageUrl || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}
            alt={title}
            onError={(e) => {
              console.error(`[ProductPreview] Failed to load image: "${imageUrl || 'Empty URL'}"`);
              e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="%23090D1A"/><circle cx="50" cy="50" r="15" fill="%231E293B" opacity="0.6"/><path d="M42 45 L50 37 L58 45 M50 37 L50 63" stroke="%237C5CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
              const parent = e.currentTarget.parentElement;
              const bgImg = parent?.querySelector('img[alt=""]');
              if (bgImg) (bgImg as HTMLElement).style.display = 'none';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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
        </div>
      )}

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
