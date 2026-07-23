/* src/admin/components/portfolio-content/StatisticsCard.tsx */
import React from 'react';
import { Card } from '../cards/Card';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  helperText?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  helperText,
  icon,
  iconBg,
  iconColor
}) => {
  return (
    <Card hoverEffect style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--admin-text-secondary)',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {title}
          </span>
          <h2
            style={{
              margin: '6px 0 0 0',
              fontWeight: 750,
              color: 'var(--admin-text)',
              fontSize: '28px',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.02em'
            }}
          >
            {value}
          </h2>
        </div>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
      </div>
      {helperText && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--admin-text-secondary)',
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {helperText}
        </div>
      )}
    </Card>
  );
};

export default StatisticsCard;
