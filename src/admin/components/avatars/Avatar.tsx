/* src/admin/components/avatars/Avatar.tsx */
import React from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 32,
  className = '',
  style,
}) => {
  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, Math.min(2, fullName.length)).toUpperCase();
  };

  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'var(--admin-secondary)',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: `${size * 0.4}px`,
    fontFamily: "'Manrope', sans-serif",
    border: '2px solid #FFFFFF',
    boxShadow: 'var(--admin-shadow-sm)',
    boxSizing: 'border-box',
    ...style
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={className}
        style={{
          ...containerStyle,
          objectFit: 'cover'
        }}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
          const sibling = e.currentTarget.nextElementSibling as HTMLElement;
          if (sibling) sibling.style.display = 'flex';
        }}
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
