/* src/admin/pages/social-links/components/SocialLinksList.tsx */
import React from 'react';
import { SocialLink } from '../../../types/socialLinks';
import { SocialLinkRow } from './SocialLinkRow';
import { EmptyState } from './EmptyState';

interface SocialLinksListProps {
  links: SocialLink[];
  onUrlChange: (id: string, url: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddClick?: () => void;
}

export const SocialLinksList: React.FC<SocialLinksListProps> = ({
  links,
  onUrlChange,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  if (links.length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '16px',
        boxShadow: 'var(--admin-shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {links.map((link, idx) => (
        <SocialLinkRow
          key={link.id}
          link={link}
          isLast={idx === links.length - 1}
          onUrlChange={(newUrl) => onUrlChange(link.id, newUrl)}
          onEdit={() => onEdit?.(link.id)}
          onDelete={() => onDelete?.(link.id)}
        />
      ))}
    </div>
  );
};

export default SocialLinksList;
