/* src/admin/components/empty-state/EmptyState.tsx */
import React from 'react';
import { Button } from '../buttons/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
  style,
}) => {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-12) var(--admin-space-4)',
        textAlign: 'center',
        background: '#FFFFFF',
        border: '1px dashed var(--admin-border)',
        borderRadius: 'var(--admin-radius-lg)',
        fontFamily: "'Manrope', sans-serif",
        gap: 'var(--admin-space-3)',
        ...style
      }}
    >
      {icon && (
        <div 
          style={{ 
            color: 'var(--admin-text-secondary)',
            opacity: 0.5,
            marginBottom: 'var(--admin-space-2)'
          }}
        >
          {icon}
        </div>
      )}
      <h3 
        style={{ 
          margin: 0, 
          color: 'var(--admin-text)', 
          fontWeight: 600,
          fontSize: '15px'
        }}
      >
        {title}
      </h3>
      <p 
        style={{ 
          margin: 0, 
          color: 'var(--admin-text-secondary)', 
          fontSize: '13px',
          maxWidth: '320px',
          lineHeight: 1.5
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onAction}
          style={{ marginTop: 'var(--admin-space-2)' }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
