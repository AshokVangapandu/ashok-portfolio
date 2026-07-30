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
    if (className.includes('popover-avatar')) {
      return {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
        color: '#fff',
        fontWeight: 700,
        fontSize: '14px',
        ...sizeStyle,
        ...style
      };
    }
    return {
      ...sizeStyle,
      ...style
    };
  };

  // Determine fallback CSS classes matching the vanilla implementation
  let fallbackClass = 'author-avatar author-avatar-initials';
  if (className.includes('popover-avatar')) {
    fallbackClass = `${className} avatar-fallback`;
  } else if (className.includes('navbar-user-avatar') || className.includes('dropdown-user')) {
    fallbackClass = className.includes('dropdown')
      ? 'dropdown-user-header-avatar-fallback'
      : 'navbar-user-avatar-fallback';
  }

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
