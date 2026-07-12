/* src/admin/components/cards/StatisticCard.tsx */
import React from 'react';
import { Card } from './Card';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  style,
}) => {
  return (
    <Card hoverEffect className={className} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span 
            className="text-label"
            style={{ 
              fontSize: '13px', 
              color: 'var(--admin-text-secondary)',
              fontWeight: 500
            }}
          >
            {title}
          </span>
          <h2 
            className="text-heading-md" 
            style={{ 
              margin: 'var(--admin-space-1) 0 0 0', 
              fontWeight: 700, 
              color: 'var(--admin-text)',
              fontSize: '24px'
            }}
          >
            {value}
          </h2>
        </div>
        {icon && (
          <div 
            style={{ 
              background: 'var(--admin-surface)', 
              color: 'var(--admin-primary)',
              borderRadius: 'var(--admin-radius-sm)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--admin-space-1)', 
            marginTop: 'var(--admin-space-2)',
            fontSize: '12.5px',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <span 
            style={{ 
              color: trend.isPositive ? 'var(--admin-success)' : 'var(--admin-danger)',
              fontWeight: 600
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span style={{ color: 'var(--admin-text-secondary)' }}>
            {trend.label || 'vs last month'}
          </span>
        </div>
      )}
    </Card>
  );
};

export default StatisticCard;
