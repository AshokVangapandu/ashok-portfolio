/* src/admin/pages/tools-products/components/ToolsProductsSummaryCards.tsx */
import React from 'react';
import { PortfolioContentStats } from '../../../layout/PortfolioContentLayout';
import { StatisticsCard } from '../../../components/portfolio-content/StatisticsCard';

interface ToolsProductsSummaryCardsProps {
  total?: number;
  published?: number;
  draft?: number;
  featured?: number;
}

export const ToolsProductsSummaryCards: React.FC<ToolsProductsSummaryCardsProps> = ({
  total = 0,
  published = 0,
  draft = 0,
  featured = 0
}) => {
  const cards = [
    {
      title: 'Total Products',
      value: total,
      helperText: 'All tools & plugins',
      iconColor: '#7C5CFF', // Soft Indigo
      iconBg: 'rgba(124, 92, 255, 0.1)',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      title: 'Published',
      value: published,
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
      value: draft,
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
      value: featured,
      helperText: 'Highlighted items',
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
    <PortfolioContentStats>
      {cards.map((card, idx) => (
        <StatisticsCard
          key={idx}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          helperText={card.helperText}
        />
      ))}
    </PortfolioContentStats>
  );
};

export default ToolsProductsSummaryCards;
