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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {links.map((link) => (
        <SocialLinkRow
          key={link.id}
          link={link}
          onUrlChange={(newUrl) => onUrlChange(link.id, newUrl)}
          onEdit={() => onEdit?.(link.id)}
          onDelete={() => onDelete?.(link.id)}
        />
      ))}
    </div>
  );
};

export default SocialLinksList;
