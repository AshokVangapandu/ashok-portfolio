/* src/admin/pages/social-links/SocialLinksPage.tsx */
import React from 'react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { SocialLinksList } from './components/SocialLinksList';
import { AddNewLinkButton } from './components/AddNewLinkButton';
import { StickyFooter } from './components/StickyFooter';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export const SocialLinksPage: React.FC = () => {
  const {
    loading,
    links,
    updateLinkUrl,
    isDirty,
    handleSave,
    handleDiscard
  } = useSocialLinks();

  const handleAddNew = () => {
    // Stub click handler for future functionality (Add Link dialog placeholder)
    console.log('[SocialLinksPage] Add New Link clicked');
  };

  const handleEdit = (id: string) => {
    // Stub click handler for future functionality (Edit link dialog placeholder)
    console.log('[SocialLinksPage] Edit Link clicked for:', id);
  };

  const handleDelete = (id: string) => {
    // Stub click handler for future functionality (Delete link confirmation placeholder)
    console.log('[SocialLinksPage] Delete Link clicked for:', id);
  };

  return (
    <div className="social-links-container">
      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxSizing: 'border-box'
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
            Social Links
          </h1>
          <p
            style={{
              margin: 0,
              color: 'var(--admin-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            Manage and update your links displayed on the portfolio.
          </p>
        </div>

        <AddNewLinkButton onClick={handleAddNew} />
      </div>

      {/* 2. Platform List Body */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <SocialLinksList
          links={links}
          onUrlChange={updateLinkUrl}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={handleAddNew}
        />
      )}

      {/* 3. Sticky Bottom Footer */}
      <StickyFooter
        isDirty={isDirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};

export default SocialLinksPage;
