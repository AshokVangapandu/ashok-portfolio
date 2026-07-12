/* src/admin/pages/certifications/components/CertificationsHeader.tsx */
import React from 'react';
import { Button } from '../../../components/buttons/Button';

interface CertificationsHeaderProps {
  onAddClick: () => void;
}

export const CertificationsHeader: React.FC<CertificationsHeaderProps> = ({ onAddClick }) => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--admin-space-2)',
        flexWrap: 'wrap',
        gap: 'var(--admin-space-4)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--admin-text)',
            letterSpacing: '-0.02em'
          }}
        >
          🏆 Certifications
        </h1>
        <p
          style={{
            margin: 0,
            color: 'var(--admin-text-secondary)',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Manage and publish professional certifications displayed on your portfolio.
        </p>
      </div>

      <Button
        variant="primary"
        onClick={onAddClick}
        style={{
          backgroundColor: '#7C5CFF', // Soft Indigo (Primary Accent)
          borderRadius: 'var(--admin-radius-sm)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Add Certification</span>
      </Button>
    </div>
  );
};

export default CertificationsHeader;
