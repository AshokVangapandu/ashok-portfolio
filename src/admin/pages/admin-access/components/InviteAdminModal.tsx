/* src/admin/pages/admin-access/components/InviteAdminModal.tsx */
import React, { useState, useEffect } from 'react';
import { AdminRole } from '../../../types/adminAccess';

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, role: AdminRole) => void;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<AdminRole>('Portfolio Viewer');

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const getRoleDescription = () => {
    switch (role) {
      case 'Super Admin':
        return {
          title: '👑 Super Admin',
          desc: 'Full access to all features and settings'
        };
      case 'Admin':
        return {
          title: '⚙ Admin',
          desc: 'Can manage dashboard and team members'
        };
      case 'Portfolio Viewer':
        return {
          title: '👁 Portfolio Viewer',
          desc: 'Portfolio Viewers have read-only access and cannot modify any data. They can view Dashboard, Inquiries, Testimonials, Resume Downloads and Analytics.'
        };
      default:
        return null;
    }
  };

  const roleDesc = getRoleDescription();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email, role);
      setEmail('');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)', // Dark overlay
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-4)',
        boxSizing: 'border-box',
        animation: 'inviteFadeIn 200ms ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'inviteScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
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
              Invite Admin
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              Add a new team member to manage your portfolio.
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
        <form
          onSubmit={handleFormSubmit}
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Email input field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--admin-text)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
            />
          </div>

          {/* Role select field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--admin-text)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Portfolio Viewer">Portfolio Viewer</option>
            </select>
          </div>

          {/* Role description panel */}
          {roleDesc && (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(124, 58, 237, 0.04)',
                border: '1px solid rgba(124, 58, 237, 0.08)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxSizing: 'border-box',
                animation: 'roleFade 200ms ease-out'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-primary)' }}>
                {roleDesc.title}
              </span>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 500, lineHeight: 1.5 }}>
                {roleDesc.desc}
              </p>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              boxSizing: 'border-box'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="hover-scale active-press"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover-scale active-press"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'var(--admin-primary)',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes inviteFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes inviteScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes roleFade {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default InviteAdminModal;
