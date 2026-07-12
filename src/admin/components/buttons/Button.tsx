/* src/admin/components/buttons/Button.tsx */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  style,
  ...props
}) => {
  const getStyles = () => {
    let bg = 'var(--admin-primary)';
    let color = '#FFFFFF';
    let hoverBg = 'var(--admin-primary-hover)';
    let border = 'none';

    if (variant === 'secondary') {
      bg = 'var(--admin-surface)';
      color = 'var(--admin-primary)';
      hoverBg = 'var(--admin-surface-hover)';
      border = '1px solid var(--admin-primary)';
    } else if (variant === 'danger') {
      bg = 'var(--admin-danger)';
      color = '#FFFFFF';
      hoverBg = '#DC2626'; // Darker danger
    } else if (variant === 'ghost') {
      bg = 'transparent';
      color = 'var(--admin-text-secondary)';
      hoverBg = 'var(--admin-surface)';
    }

    const padding = size === 'sm' 
      ? 'var(--admin-space-1) var(--admin-space-3)' 
      : size === 'lg' 
        ? 'var(--admin-space-3) var(--admin-space-6)' 
        : 'var(--admin-space-2) var(--admin-space-4)';

    const fontSize = size === 'sm' ? '12.5px' : '14px';

    return {
      background: bg,
      color,
      border,
      padding,
      fontSize,
      borderRadius: 'var(--admin-radius-sm)',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--admin-space-2)',
      width: fullWidth ? '100%' : 'auto',
      transition: 'all 0.15s ease',
      fontFamily: "'Inter', sans-serif",
      boxShadow: variant === 'ghost' ? 'none' : 'var(--admin-shadow-sm)',
      ...style,
    } as React.CSSProperties;
  };

  return (
    <button
      className={`hover-scale active-press ${className}`}
      style={getStyles()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
