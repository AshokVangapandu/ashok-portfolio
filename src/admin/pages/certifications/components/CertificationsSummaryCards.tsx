/* src/admin/pages/certifications/components/CertificationsSummaryCards.tsx */
import React from 'react';
import { Card } from '../../../components/cards/Card';
import { MOCK_SUMMARY } from '../mockCertifications';

export const CertificationsSummaryCards: React.FC = () => {
  const cards = [
    {
      title: 'Total Certifications',
      value: MOCK_SUMMARY.total,
      helperText: 'All registered credentials',
      iconColor: '#7C5CFF', // Soft Indigo
      iconBg: 'rgba(124, 92, 255, 0.1)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
    {
      title: 'Published',
      value: MOCK_SUMMARY.published,
      helperText: 'Live on your portfolio',
      iconColor: '#22C55E', // Green
      iconBg: 'rgba(34, 197, 94, 0.1)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    {
      title: 'Draft',
      value: MOCK_SUMMARY.draft,
      helperText: 'Work in progress',
      iconColor: '#F59E0B', // Amber
      iconBg: 'rgba(245, 158, 11, 0.1)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      )
    },
    {
      title: 'Featured',
      value: MOCK_SUMMARY.featured,
      helperText: 'Highlighted at the top',
      iconColor: '#A78BFA', // Purple
      iconBg: 'rgba(167, 139, 250, 0.1)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--admin-space-4)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {cards.map((card, idx) => (
        <Card hoverEffect key={idx} style={{ padding: '20px' }}>
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
                {card.title}
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
                {card.value}
              </h2>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: card.iconBg,
                color: card.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {card.icon}
            </div>
          </div>
          <div
            style={{
              marginTop: '12px',
              fontSize: '12px',
              color: 'var(--admin-text-secondary)',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {card.helperText}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CertificationsSummaryCards;
