/* src/admin/components/portfolio-content/SectionHeader.tsx */
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--admin-space-4)',
        flexWrap: 'wrap',
        gap: 'var(--admin-space-4)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--admin-text)',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              margin: 0,
              color: 'var(--admin-text-secondary)',
              fontSize: '13.5px',
              fontWeight: 500
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};

export default SectionHeader;
