/* src/admin/pages/social-links/SocialLinksPage.tsx */
import React from 'react';
import { useSocialLinks } from '../../hooks/useSocialLinks';
import { SocialLinksList } from './components/SocialLinksList';
import { StickyFooter } from './components/StickyFooter';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AlertMessage } from '../settings/components/AlertMessage';

export const SocialLinksPage: React.FC = () => {
  const {
    loading,
    links,
    updateLinkUrl,
    isDirty,
    handleSave,
    handleDiscard,
    error,
    setError,
    success,
    setSuccess
  } = useSocialLinks();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--admin-space-6)',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Manrope', sans-serif"
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
            Configure URLs for the social profile links displayed on your portfolio.
          </p>
        </div>
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
