import React from 'react';

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back to Portfolio',
  fallbackUrl = '/',
  className = '',
  style = {},
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    // Semantic parent navigation:
    // Navigates directly to fallbackUrl (parent route) without hijacking browser history.
  };

  return (
    <a
      href={fallbackUrl}
      onClick={handleClick}
      className={`minimal-back-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: '#A78BFA',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'none',
        padding: '6px 0',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        outline: 'none',
        width: 'fit-content',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#FFFFFF';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#A78BFA';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>{label}</span>
    </a>
  );
};

export default BackButton;
