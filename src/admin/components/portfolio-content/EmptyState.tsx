/* src/admin/components/portfolio-content/EmptyState.tsx */
import React from 'react';
import { Card } from '../cards/Card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton
}) => {
  return (
    <Card style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--admin-surface)',
            color: 'var(--admin-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}
        >
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--admin-text-secondary)', maxWidth: '320px' }}>
            {description}
          </p>
        </div>
        {actionButton}
      </div>
    </Card>
  );
};

export default EmptyState;
