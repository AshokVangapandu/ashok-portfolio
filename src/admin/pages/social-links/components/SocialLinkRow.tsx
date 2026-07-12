/* src/admin/pages/social-links/components/SocialLinkRow.tsx */
import React from 'react';
import { SocialLink } from '../../../types/socialLinks';
import { SocialPlatformIcon } from './SocialPlatformIcon';
import { UrlInput } from './UrlInput';
import { EditButton } from './EditButton';
import { DeleteButton } from './DeleteButton';

interface SocialLinkRowProps {
  link: SocialLink;
  isLast?: boolean;
  onUrlChange: (url: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SocialLinkRow: React.FC<SocialLinkRowProps> = ({
  link,
  isLast = false,
  onUrlChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`social-link-row-card ${isLast ? 'is-last' : ''}`}>
      {/* 1. Left Platform Info */}
      <div className="social-platform-info">
        {/* Circle Icon Container */}
        <div className="social-platform-icon-box">
          <SocialPlatformIcon platform={link.platform} />
        </div>

        <span className="social-platform-label">
          {link.platform}
        </span>
      </div>

      {/* 2. Editable URL Input */}
      <div className="social-input-container">
        <UrlInput
          value={link.url}
          placeholder={`Enter your ${link.platform} URL`}
          onChange={onUrlChange}
          aria-label={`${link.platform} URL`}
        />
      </div>

      {/* 3. Action Buttons */}
      <div className="social-actions-container">
        {/* Edit Button */}
        <EditButton
          onClick={onEdit}
          title="Edit link metadata"
          aria-label={`Edit ${link.platform} Link`}
        />

        {/* Delete Button */}
        <DeleteButton
          onClick={onDelete}
          title="Delete link"
          aria-label={`Delete ${link.platform} Link`}
        />
      </div>
    </div>
  );
};

export default SocialLinkRow;
