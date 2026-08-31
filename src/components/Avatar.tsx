import React, { useState, useEffect } from 'react';

interface AvatarProps {
  imageUrl?: string | null;
  displayName: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  email?: string | null;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  displayName,
  size,
  className = '',
  style = {},
  email
}) => {
  const getInitialSrc = () => {
    if (imageUrl) return imageUrl;
    if (email && typeof email === 'string' && email.includes('@')) {
      return `https://unavatar.io/${encodeURIComponent(email.trim().toLowerCase())}?fallback=false`;
    }
    return null;
  };

  const [currentSrc, setCurrentSrc] = useState<string | null>(getInitialSrc);
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    getInitialSrc() ? 'loading' : 'error'
  );

  useEffect(() => {
    const src = getInitialSrc();
    setCurrentSrc(src);
    setImageState(src ? 'loading' : 'error');
  }, [imageUrl, email]);

  const initials = (() => {
    const trimmed = (displayName || '').trim();
    if (!trimmed) return '??';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  })();

  const sizeStyle: React.CSSProperties = size ? {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  } : {};

  const getFallbackStyle = (): React.CSSProperties => {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6C3CFF 0%, #8F72FF 100%)',
      color: '#FFFFFF',
      fontWeight: 750,
      fontSize: size && typeof size === 'number' && size <= 36 ? '12px' : '14px',
      borderRadius: 'inherit',
      overflow: 'hidden',
      flexShrink: 0,
      ...sizeStyle,
      ...style
    };
  };

  const handleImageError = () => {
    const unavatarFallback = email && typeof email === 'string' && email.includes('@')
      ? `https://unavatar.io/${encodeURIComponent(email.trim().toLowerCase())}?fallback=false`
      : null;

    if (unavatarFallback && currentSrc !== unavatarFallback) {
      setCurrentSrc(unavatarFallback);
      setImageState('loading');
    } else {
      setImageState('error');
    }
  };

  let fallbackClass = 'avatar-fallback-initials';

  return (
    <>
      {currentSrc && imageState !== 'error' && (
        <img
          src={currentSrc}
          alt={displayName}
          className={className}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          style={{
            ...sizeStyle,
            ...style,
            display: imageState === 'loaded' ? undefined : 'none'
          }}
          loading="lazy"
          onLoad={() => setImageState('loaded')}
          onError={handleImageError}
        />
      )}
      {imageState !== 'loaded' && (
        <div className={fallbackClass} style={getFallbackStyle()}>
          {initials}
        </div>
      )}
    </>
  );
};

export default Avatar;
