/* src/admin/pages/admin-access/components/SummaryCards.tsx */
import React from 'react';
import { AdminAccessSummary } from '../../../types/adminAccess';

interface SummaryCardsProps {
  summary: AdminAccessSummary | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      label: 'Super Admins',
      value: summary.superAdmins,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          <path d="M3 20h18" />
        </svg>
      )
    },
    {
      label: 'Portfolio Viewers',
      value: summary.portfolioViewers,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    {
      label: 'Pending Invitations',
      value: summary.pendingInvitations,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      label: 'Active Members',
      value: summary.activeMembers,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--admin-space-4)',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxSizing: 'border-box',
            boxShadow: 'var(--admin-shadow-sm)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--admin-shadow-sm)';
          }}
        >
          {/* Circular Icon Container */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(124, 58, 237, 0.05)',
              color: 'var(--admin-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {card.icon}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {card.value}
            </span>
            <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              {card.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
