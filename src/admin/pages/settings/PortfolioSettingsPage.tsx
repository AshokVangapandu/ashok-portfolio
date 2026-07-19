/* src/admin/pages/settings/PortfolioSettingsPage.tsx */
import React from 'react';
import { usePortfolioSettings } from '../../hooks/usePortfolioSettings';
import { AlertMessage } from './components/AlertMessage';
import { StickyFooter } from './components/StickyFooter';
import { Card } from '../../components/cards/Card';

export const PortfolioSettingsPage: React.FC = () => {
  const {
    loading,
    visibility,
    setVisibility,
    isOpenForWork,
    setIsOpenForWork,
    showAlert,
    setShowAlert,
    isDirty,
    handleSave,
    handleDiscard
  } = usePortfolioSettings();

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

  const futurePlaceholders = [
    { title: 'SEO Settings', desc: 'Configure title tags, meta tags, and social media card previews.' },
    { title: 'Custom Domains', desc: 'Point your public portfolio page to your own custom domain URL.' },
    { title: 'Visitor Preferences', desc: 'Let visitors choose between Dark, Light, or System theme styles.' },
    { title: 'Portfolio Analytics', desc: 'Track traffic source locations, page views, and daily visitors.' }
  ];

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
          Manage visibility controls, availability toggles, and global dashboard preferences.
        </p>
      </div>

      {/* Success Notification Alert */}
      {showAlert && (
        <AlertMessage
          type="success"
          title="Settings Saved"
          message="Your global portfolio visibility settings have been updated successfully."
          onClose={() => setShowAlert(false)}
        />
      )}

      {/* 2. Main content grids */}
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
          Loading settings...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box' }}>
          
          {/* Section 1: Portfolio Visibility Options */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
                  Portfolio Visibility
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  Select the visibility status of your live portfolio project website.
                </span>
              </div>

              {/* Grid of selectable option cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  boxSizing: 'border-box',
                  marginTop: '4px'
                }}
              >
                {visibilityOptions.map((opt) => {
                  const isSelected = visibility === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setVisibility(opt.value)}
                      className="hover-scale active-press"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: isSelected ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        position: 'relative',
                        boxSizing: 'border-box',
                        boxShadow: isSelected ? '0 4px 20px rgba(124, 92, 255, 0.06)' : 'var(--admin-shadow-sm)',
                        transition: 'all 200ms ease'
                      }}
                    >
                      {/* Icon header & Active Indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: isSelected ? 'rgba(124, 92, 255, 0.08)' : '#F8FAFC',
                            color: isSelected ? 'var(--admin-primary)' : 'var(--admin-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 200ms ease'
                          }}
                        >
                          {opt.icon}
                        </div>

                        {isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--admin-primary)',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content texts */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--admin-text)' }}>
                          {opt.title}
                        </span>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Section 2: Open for Work Availability Toggle */}
          <Card>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
                  Availability
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  Show or hide the availability status badge on your public portfolio.
                </span>
              </div>

              {/* Sub-card Row containing Info + Badge & Switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--admin-border)',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Text & Status Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px', flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    Open for Work
                  </span>
                  
                  {/* Inline Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
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
                      Status: {isOpenForWork ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Switch Button */}
                <button
                  type="button"
                  onClick={() => setIsOpenForWork(!isOpenForWork)}
                  className="hover-scale active-press"
                  style={{
                    width: '50px',
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
                      left: isOpenForWork ? '28px' : '2px',
                      transition: 'left 200ms cubic-bezier(0.25, 1, 0.5, 1)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Section 3: Future Ready Preferences Placeholder Panel */}
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
                  Preferences & Integrations
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                  Advanced preferences planned for upcoming dashboard releases.
                </span>
              </div>

              {/* Grid of disabled placeholders */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  boxSizing: 'border-box',
                  marginTop: '4px'
                }}
              >
                {futurePlaceholders.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px dashed var(--admin-border)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxSizing: 'border-box',
                      opacity: 0.75,
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 750, color: 'var(--admin-text)' }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          color: 'var(--admin-primary)',
                          backgroundColor: 'rgba(124, 92, 255, 0.08)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Soon
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 3. Sticky Save Footer */}
      <StickyFooter
        isDirty={isDirty}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
};

export default PortfolioSettingsPage;
