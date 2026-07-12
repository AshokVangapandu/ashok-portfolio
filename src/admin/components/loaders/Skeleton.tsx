/* src/admin/components/loaders/Skeleton.tsx */
import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  variant = 'text',
  className = '',
  style,
}) => {
  const getRadius = () => {
    if (variant === 'circle') return '50%';
    if (variant === 'rect') return 'var(--admin-radius-sm)';
    return '4px';
  };

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: getRadius(),
        backgroundColor: 'rgba(124, 58, 237, 0.08)',
        ...style
      }}
    />
  );
};

export default Skeleton;
