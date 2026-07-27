/* src/admin/pages/admin-access/components/MemberDetailsModal.tsx */
import React, { useEffect, useState } from 'react';
import { AdminUser } from '../../../types/adminAccess';

interface MemberDetailsModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onDeactivate: (id: string) => Promise<void>;
  onReactivate: (id: string) => Promise<void>;
  onRemoveAccess: (id: string) => Promise<void>;
  currentUserRole: string | undefined;
}

export const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  user,
  onClose,
  onDeactivate,
  onReactivate,
  onRemoveAccess,
  currentUserRole
}) => {
  const [isPending, setIsPending] = useState(false);
  const isSuperAdmin = currentUserRole === 'Super Admin';

  const handleDeactivateClick = async () => {
    if (!user || isPending) return;
    const confirmed = window.confirm(`Are you sure you want to deactivate ${user.name || user.email}? The user will immediately lose access to the Admin Dashboard.`);
    if (!confirmed) return;

    setIsPending(true);
    try {
      await onDeactivate(user.id);
      onClose();
    } catch (err) {
      // Handled by service/hook
    } finally {
      setIsPending(false);
    }
  };

  const handleReactivateClick = async () => {
    if (!user || isPending) return;
    const confirmed = window.confirm(`Are you sure you want to reactivate ${user.name || user.email}?`);
    if (!confirmed) return;

    setIsPending(true);
    try {
      await onReactivate(user.id);
      onClose();
    } catch (err) {
      // Handled by service/hook
    } finally {
      setIsPending(false);
    }
  };

  const handleRemoveClick = async () => {
    if (!user || isPending) return;
    const confirmed = window.confirm(`Are you sure you want to permanently remove access for ${user.name || user.email}? This action cannot be undone.`);
    if (!confirmed) return;

    setIsPending(true);
    try {
      await onRemoveAccess(user.id);
      onClose();
    } catch (err) {
      // Handled by service/hook
    } finally {
      setIsPending(false);
    }
  };

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const defaultAvatar = (
    <div
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        border: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  // Status Badge Helper
  const renderStatusBadge = () => {
    let dotColor = '#10B981';
    let bgColor = 'rgba(16, 185, 129, 0.06)';
    let textColor = '#10B981';

    if (user.status === 'Pending') {
      dotColor = '#F59E0B';
      bgColor = 'rgba(245, 158, 11, 0.06)';
      textColor = '#F59E0B';
    } else if (user.status === 'Inactive') {
      dotColor = '#EF4444';
      bgColor = 'rgba(239, 68, 68, 0.06)';
      textColor = '#EF4444';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '10px',
          backgroundColor: bgColor,
          color: textColor,
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: dotColor }} />
        {user.status}
      </span>
    );
  };

  // Role Badge Helper
  const renderRoleBadge = () => {
    let bgColor = 'rgba(124, 58, 237, 0.08)';
    let textColor = 'var(--admin-primary)';

    if (user.role !== 'Super Admin') {
      bgColor = 'rgba(59, 130, 246, 0.08)';
      textColor = '#2563EB';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 8px',
          borderRadius: '10px',
          backgroundColor: bgColor,
          color: textColor,
          fontSize: '11px',
          fontWeight: 600
        }}
      >
        {user.role}
      </span>
    );
  };

  // All prospective permissions
  const allPermissionsList = [
    'Dashboard',
    'Inquiries',
    'Testimonials',
    'Resume Downloads',
    'Analytics',
    'Projects',
    'Portfolio Configuration',
    'Access Management'
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)', // Blur backdrop overlay
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-4)',
        boxSizing: 'border-box',
        animation: 'detailsFadeIn 200ms ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'detailsScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
              Member Details
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              View permissions and activity for this team member.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* BODY */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box'
          }}
        >
          {/* PROFILE SUMMARY BAR */}
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(248, 250, 252, 0.6)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--admin-border)',
                    flexShrink: 0
                  }}
                />
              ) : (
                defaultAvatar
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 700, color: 'var(--admin-text)' }}>
                    {user.name}
                  </h3>
                  {renderRoleBadge()}
                  {renderStatusBadge()}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--admin-primary)', fontWeight: 500 }}>
                  {user.email}
                </span>
              </div>
            </div>

            {/* Meta horizontal divider & metrics row */}
            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', boxSizing: 'border-box' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Joined Date</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {user.joinedDate}
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Login</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {user.lastLogin}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {user.status}
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN GRID DETAIL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', boxSizing: 'border-box' }}>
            
            {/* COLUMN 1: PERMISSION OVERVIEW */}
            <div
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxSizing: 'border-box'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Permission Overview
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allPermissionsList.map((permName) => {
                  const hasAccess = user.role === 'Super Admin' || user.permissions.includes(permName);
                  return (
                    <div key={permName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--admin-text)', fontWeight: 500 }}>
                        {permName}
                      </span>
                      {hasAccess ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>View</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#94A3B8', fontWeight: 500 }}>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          <span>No Access</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: ACTIVITY FEED */}
            <div
              style={{
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxSizing: 'border-box'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Activity
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Recent Login</span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {user.recentLogin || '—'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Last Active</span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {user.lastActivity || '—'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Invitation Accepted</span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {user.invitationAcceptedDate || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          {/* Deactivate/Remove actions - conditional on super_admin and loading state */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!isSuperAdmin ? (
              <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', fontStyle: 'italic' }}>
                Only Super Admins can manage access settings.
              </span>
            ) : (
              <>
                {user.status === 'Inactive' ? (
                  <button
                    disabled={user.isYou || isPending}
                    onClick={handleReactivateClick}
                    className={(user.isYou || isPending) ? '' : 'hover-scale active-press'}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid #10B981',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#10B981',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: (user.isYou || isPending) ? 'not-allowed' : 'pointer',
                      opacity: (user.isYou || isPending) ? 0.4 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {isPending ? 'Processing...' : 'Reactivate'}
                  </button>
                ) : (
                  <button
                    disabled={user.isYou || isPending}
                    onClick={handleDeactivateClick}
                    className={(user.isYou || isPending) ? '' : 'hover-scale active-press'}
                    style={{
                      padding: '10px 18px',
                      border: '1px solid #EF4444',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: (user.isYou || isPending) ? 'not-allowed' : 'pointer',
                      opacity: (user.isYou || isPending) ? 0.4 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {isPending ? 'Processing...' : 'Deactivate'}
                  </button>
                )}
                <button
                  disabled={user.isYou || isPending}
                  onClick={handleRemoveClick}
                  className={(user.isYou || isPending) ? '' : 'hover-scale active-press'}
                  style={{
                    padding: '10px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: (user.isYou || isPending) ? 'not-allowed' : 'pointer',
                    opacity: (user.isYou || isPending) ? 0.4 : 1,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = '#DC2626';
                  }}
                  onMouseOut={(e) => {
                    if (!user.isYou && !isPending) e.currentTarget.style.backgroundColor = '#EF4444';
                  }}
                >
                  {isPending ? 'Removing...' : 'Remove Access'}
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            Close
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes detailsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes detailsScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default MemberDetailsModal;
