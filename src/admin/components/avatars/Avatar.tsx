/* src/admin/components/avatars/Avatar.tsx */
import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  email?: string | null;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 32,
  className = '',
  style,
  email
}) => {
  const getInitials = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (fullName || '??').substring(0, Math.min(2, fullName.length)).toUpperCase();
  };

  const initialSrc = src || (email && email.includes('@') ? `https://unavatar.io/${encodeURIComponent(email.trim().toLowerCase())}?fallback=false` : null);
  const [currentSrc, setCurrentSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(!initialSrc);

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'var(--admin-secondary, #7C3AED)',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: `${size * 0.4}px`,
    fontFamily: "'Manrope', sans-serif",
    border: '2px solid #FFFFFF',
    boxShadow: 'var(--admin-shadow-sm)',
    boxSizing: 'border-box',
    ...style
  };

  const handleImgError = () => {
    const unavatarFallback = email && email.includes('@')
      ? `https://unavatar.io/${encodeURIComponent(email.trim().toLowerCase())}?fallback=false`
      : null;

    if (unavatarFallback && currentSrc !== unavatarFallback) {
      setCurrentSrc(unavatarFallback);
    } else {
      setHasError(true);
    }
  };

  if (currentSrc && !hasError) {
    return (
      <img
        src={currentSrc}
        alt={name}
        className={className}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        style={{
          ...containerStyle,
          objectFit: 'cover'
        }}
        onError={handleImgError}
      />
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
