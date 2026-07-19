/* src/admin/pages/social-links/SocialLinksPage.tsx */
import React, { useState } from 'react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { SocialLinksList } from './components/SocialLinksList';
import { AddNewLinkButton } from './components/AddNewLinkButton';
import { StickyFooter } from './components/StickyFooter';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AddSocialLinkModal } from './components/AddSocialLinkModal';
import { EditSocialLinkModal } from './components/EditSocialLinkModal';
import { AlertMessage } from '../settings/components/AlertMessage';
import { SocialLink } from '../../types/socialLinks';

export const SocialLinksPage: React.FC = () => {
  const {
    loading,
    links,
    updateLinkUrl,
    addLink,
    editLink,
    deleteLink,
    isDirty,
    handleSave,
    handleDiscard,
    error,
    setError,
    success,
    setSuccess
  } = useSocialLinks();

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const handleAddNew = () => {
    setAddModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (link) {
      setEditingLink(link);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLink(id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--admin-space-6)',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
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

      {/* Success Alert Banner */}
      {success && (
        <AlertMessage
          type="success"
          title="Links Updated"
          message="Your portfolio social links have been updated successfully."
          onClose={() => setSuccess(false)}
        />
      )}

      {/* Error Alert Banner */}
      {error && (
        <AlertMessage
          type="error"
          title="Operation Failed"
          message={error}
          onClose={() => setError(null)}
        />
      )}

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

      {/* MODALS OVERLAYS */}
      <AddSocialLinkModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={addLink}
      />

      <EditSocialLinkModal
        isOpen={!!editingLink}
        onClose={() => setEditingLink(null)}
        link={editingLink}
        onEdit={editLink}
      />
    </div>
  );
};

export default SocialLinksPage;
