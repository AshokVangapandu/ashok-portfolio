/* src/admin/pages/social-links/components/EmptyState.tsx */
import React from 'react';
import { EmptyState as GlobalEmptyState } from '../../../components/empty-state/EmptyState';

interface EmptyStateProps {
  onAddClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <GlobalEmptyState
      title="No Social Links Found"
      description="You haven't added any social media links yet. Add your links to display them on your portfolio website."
      icon={
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      }
      actionText="Add Social Link"
      onAction={onAddClick}
      style={{
        padding: '48px 32px'
      }}
    />
  );
};

export default EmptyState;
