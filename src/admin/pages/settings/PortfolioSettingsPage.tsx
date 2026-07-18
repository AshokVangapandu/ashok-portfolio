/* src/admin/pages/settings/PortfolioSettingsPage.tsx */
import React from 'react';
import { usePortfolioSettings } from '../../hooks/usePortfolioSettings';
import { PortfolioStatusSelector } from './components/PortfolioStatusSelector';
import { OpenForWorkToggle } from './components/OpenForWorkToggle';
import { ResumeCard } from './components/ResumeCard';
import { AlertMessage } from './components/AlertMessage';
import { StickyFooter } from './components/StickyFooter';
import { Card } from '../../components/cards/Card';

import { Tabs } from '../../components/tabs/Tabs';

export const PortfolioSettingsPage: React.FC = () => {
  const {
    loading,
    visibility,
    setVisibility,
    isOpenForWork,
    setIsOpenForWork,
    resumeFileName,
    resumeLastUpdated,
    resumeStatus,
    showAlert,
    setShowAlert,
    isDirty,
    handleSave,
    handleDiscard
  } = usePortfolioSettings();

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
          Portfolio Settings
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
          Manage your portfolio visibility and public availability.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <Tabs
        options={[
          { id: 'portfolio', label: 'Portfolio Settings' },
          { id: 'social-links', label: 'Social Links' },
          { id: 'admin-access', label: 'Admin Access' }
        ]}
        activeId="portfolio"
        onChange={(id) => {
          const path = id === 'portfolio' ? '/admin/settings/portfolio' : `/admin/settings/${id}`;
          const hasBase = window.location.pathname.startsWith('/ashok-portfolio');
          const targetPath = hasBase ? `/ashok-portfolio${path}` : path;
          window.history.pushState(null, '', targetPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        style={{ marginBottom: 'var(--admin-space-2)' }}
      />

      {/* 2. Section Cards list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
        {/* Card 1: Portfolio Status selector */}
        <Card>
          <PortfolioStatusSelector
            selected={visibility}
            onChange={setVisibility}
          />
        </Card>

        {/* Card 2: Open for Work toggle */}
        <Card>
          <OpenForWorkToggle
            checked={isOpenForWork}
            onChange={setIsOpenForWork}
          />
        </Card>

        {/* Card 3: Resume management details */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ResumeCard
              fileName={resumeFileName}
              lastUpdated={resumeLastUpdated}
              status={resumeStatus}
            />

            {/* Success notification banner */}
            {showAlert && (
              <AlertMessage
                type="success"
                title="Resume updated successfully."
                message="The latest resume is now available on your portfolio."
                onClose={() => setShowAlert(false)}
              />
            )}
          </div>
        </Card>
      </div>

      {/* 3. Sticky footer save options */}
      <StickyFooter
        isDirty={isDirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};

export default PortfolioSettingsPage;
