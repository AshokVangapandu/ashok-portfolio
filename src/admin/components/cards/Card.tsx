/* src/admin/components/cards/Card.tsx */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  hoverEffect = false,
  className = '',
  style,
}) => {
  const cardStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid var(--admin-border)',
    borderRadius: 'var(--admin-radius-md)',
    boxShadow: 'var(--admin-shadow-sm)',
    padding: 'var(--admin-space-4)',
    fontFamily: "'Manrope', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--admin-space-4)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  return (
    <div
      className={`${hoverEffect ? 'hover-scale' : ''} ${className}`}
      style={cardStyle}
    >
      {(title || headerAction) && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            borderBottom: subtitle ? 'none' : '1px solid rgba(229, 231, 235, 0.5)',
            paddingBottom: subtitle ? '0' : 'var(--admin-space-2)',
            marginBottom: subtitle ? '0' : 'var(--admin-space-1)',
          }}
        >
          <div>
            {title && (
              <h3 
                className="text-card-title"
                style={{ 
                  margin: 0, 
                  color: 'var(--admin-text)', 
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p 
                className="text-caption"
                style={{ 
                  margin: 'var(--admin-space-1) 0 0 0', 
                  color: 'var(--admin-text-secondary)',
                  fontSize: '12px'
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
