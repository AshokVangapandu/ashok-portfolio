import React, { useState, useEffect } from 'react';

interface AvatarProps {
  imageUrl?: string | null;
  displayName: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  displayName,
  size,
  className = '',
  style = {}
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    imageUrl ? 'loading' : 'error'
  );

  useEffect(() => {
    setImageState(imageUrl ? 'loading' : 'error');
  }, [imageUrl]);

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

  let fallbackClass = 'avatar-fallback-initials';

  return (
    <>
      {imageUrl && imageState !== 'error' && (
        <img
          src={imageUrl}
          alt={displayName}
          className={className}
          style={{
            ...sizeStyle,
            ...style,
            display: imageState === 'loaded' ? undefined : 'none'
          }}
          loading="lazy"
          onLoad={() => setImageState('loaded')}
          onError={() => setImageState('error')}
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
