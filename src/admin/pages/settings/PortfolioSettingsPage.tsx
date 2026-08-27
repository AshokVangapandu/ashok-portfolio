/* src/admin/pages/settings/PortfolioSettingsPage.tsx */
import React, { useState, useEffect } from 'react';
import { usePortfolioSettings } from '../../hooks/usePortfolioSettings';
import { AlertMessage } from './components/AlertMessage';
import { StickyFooter } from './components/StickyFooter';
import { Card } from '../../components/cards/Card';
import { AuthorizedUsersPage } from '../authorized-users/AuthorizedUsersPage';
import { AccessRequestsPage } from '../access-requests/AccessRequestsPage';
import { MaintenanceSubscribersPage } from '../maintenance-subscribers/MaintenanceSubscribersPage';

type SettingsTab = 'general' | 'authorized-users' | 'access-requests' | 'subscribers';

export const PortfolioSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'authorized-users' || tab === 'access-requests' || tab === 'subscribers' || tab === 'maintenance-subscribers') {
        return tab === 'maintenance-subscribers' ? 'subscribers' : tab as SettingsTab;
      }
    }
    return 'general';
  });

  const {
    loading,
    saving,
    visibility,
    setVisibility,
    isOpenForWork,
    setIsOpenForWork,
    alert,
    setAlert,
    isDirty,
    handleSave,
    handleDiscard
  } = usePortfolioSettings();

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const visibilityOptions = [
    {
      value: 'public' as const,
      title: '🌍 Public',
      desc: 'Your portfolio is open for everyone to view.',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    },
    {
      value: 'maintenance' as const,
      title: '🛠 Maintenance',
      desc: 'Visitors see a screen saying you are updating.',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      value: 'private' as const,
      title: '🔒 Private',
      desc: 'Only signed-in admins can access your content.',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    }
  ];

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'general',
      label: 'General',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      key: 'authorized-users',
      label: 'Authorized Users',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 11l-3 3L17 12" />
        </svg>
      )
    },
    {
      key: 'access-requests',
      label: 'Access Requests',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      )
    },
    {
      key: 'subscribers',
      label: 'Subscribers',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    }
  ];

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
          Manage visibility controls, availability toggles, authorized users, and access requests.
        </p>
      </div>

      {/* 2. Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--admin-border)',
          paddingBottom: '2px',
          overflowX: 'auto',
          boxSizing: 'border-box'
        }}
      >
        {tabs.map((t) => {
          const isSelected = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => handleTabChange(t.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: isSelected ? '2px solid var(--admin-primary)' : '2px solid transparent',
                backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease'
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Success / Error Notification Alert */}
      {alert && activeTab === 'general' && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* 3. Tab Contents */}
      {activeTab === 'general' && (
        <>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
              Loading settings...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
              {/* Section 1: Portfolio Visibility Segmented Control */}
              <Card style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
                      Portfolio Visibility Mode
                    </h3>
                    <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                      Control accessibility and route guard decisions across your public site.
                    </span>
                  </div>

                  {/* Compact Segmented Control Strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '8px',
                      backgroundColor: '#F8FAFC',
                      padding: '6px',
                      borderRadius: '12px',
                      border: '1px solid var(--admin-border)',
                      boxSizing: 'border-box'
                    }}
                  >
                    {visibilityOptions.map((opt) => {
                      const isSelected = visibility === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setVisibility(opt.value)}
                          className="hover-scale active-press"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid rgba(124, 92, 255, 0.3)' : '1px solid transparent',
                            backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                            color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text)',
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '13.5px',
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 2px 8px rgba(124, 92, 255, 0.12)' : 'none',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {opt.icon}
                          </span>
                          <span>{opt.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Mode Context Helper */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: 'rgba(124, 92, 255, 0.05)',
                      border: '1px solid rgba(124, 92, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--admin-text-secondary)',
                      fontSize: '12.5px',
                      fontWeight: 500
                    }}
                  >
                    <span style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>Active Mode Description:</span>
                    <span>
                      {visibilityOptions.find((o) => o.value === visibility)?.desc}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Section 2: Open for Work Compact Status Control */}
              <Card style={{ padding: '20px 24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
                        Open for Work
                      </h3>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          backgroundColor: isOpenForWork ? '#ECFDF5' : '#F1F5F9',
                          color: isOpenForWork ? '#10B981' : '#64748B',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isOpenForWork ? '#10B981' : '#64748B'
                          }}
                        />
                        {isOpenForWork ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                      Display the availability status badge on your public portfolio header.
                    </span>
                  </div>

                  {/* Switch Button */}
                  <button
                    type="button"
                    onClick={() => setIsOpenForWork(!isOpenForWork)}
                    className="hover-scale active-press"
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: isOpenForWork ? 'var(--admin-primary)' : '#CBD5E1',
                      border: 'none',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 200ms ease',
                      outline: 'none',
                      boxShadow: isOpenForWork ? '0 4px 12px rgba(124, 92, 255, 0.2)' : 'none'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        position: 'absolute',
                        left: isOpenForWork ? '26px' : '3px',
                        transition: 'left 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
                      }}
                    />
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Sticky Save Footer */}
          <StickyFooter
            isDirty={isDirty}
            saving={saving}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        </>
      )}

      {activeTab === 'authorized-users' && <AuthorizedUsersPage />}

      {activeTab === 'access-requests' && <AccessRequestsPage />}

      {activeTab === 'subscribers' && <MaintenanceSubscribersPage />}
    </div>
  );
};

export default PortfolioSettingsPage;

