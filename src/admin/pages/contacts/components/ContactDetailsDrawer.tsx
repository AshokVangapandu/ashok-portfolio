/* src/admin/pages/contacts/components/ContactDetailsDrawer.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { ContactSubmission } from '../../../types/contact';
import { contactService } from '../../../services/contactService';
import { ContactInfoSection } from './ContactInfoSection';
import { ContactMessageSection } from './ContactMessageSection';
import { getEmailComposeUrl } from '../../../utils/emailHelper';

interface ContactDetailsDrawerProps {
  isOpen: boolean;
  contactId: string | null;
  onClose: () => void;
  onReplySuccess: () => void;
}

export const ContactDetailsDrawer: React.FC<ContactDetailsDrawerProps> = ({
  isOpen,
  contactId,
  onClose,
  onReplySuccess,
}) => {
  const [contact, setContact] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);

  // Fetch contact details when drawer opens or contactId changes
  const loadContactDetails = async () => {
    if (!contactId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactService.getContactById(contactId);
      if (data) {
        setContact(data);
      } else {
        setError('Contact submission not found.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch contact details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyClick = async () => {
    if (!contact) return;
    setIsReplying(true);
    try {
      const subject = `Re: ${contact.subject}`;
      const body = `Hi ${contact.name},\n\nThank you for reaching out.\n\n[Write your reply here...]\n\nRegards,\nAshok Vangapandu`;
      const gmailUrl = getEmailComposeUrl({ to: contact.email, subject, body });

      // Open Gmail in a new tab
      const newTab = window.open(gmailUrl, '_blank');
      if (!newTab) {
        throw new Error('Gmail compose window was blocked by your browser. Please allow popups.');
      }

      // Update in database
      await contactService.replyToContact(contact.id);

      // Trigger success toast
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'success',
          'Reply Opened',
          'Reply opened successfully. Contact marked as replied.',
          5600
        );
      }

      // Notify parent to refresh list
      onReplySuccess();

      // Refresh drawer details
      await loadContactDetails();
    } catch (err: any) {
      console.error('[ContactDetailsDrawer] Reply workflow error:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'Action Failed',
          err.message || 'Failed to complete reply action.',
          5600
        );
      }
    } finally {
      setIsReplying(false);
    }
  };

  useEffect(() => {
    if (isOpen && contactId) {
      loadContactDetails();
    } else {
      setContact(null);
      setError(null);
    }
  }, [isOpen, contactId]);

  // Focus trap / management
  useEffect(() => {
    if (isOpen) {
      activeElementRef.current = document.activeElement as HTMLElement;
      // Delay focus slightly to allow entry transition to complete
      const timer = setTimeout(() => {
        drawerRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      if (activeElementRef.current) {
        activeElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Drawer Backdrop Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(9, 9, 11, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'fade-in 0.2s ease-out forwards',
        }}
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        aria-modal="true"
        aria-label="Contact Submission Details"
        role="dialog"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '460px',
          maxWidth: '100%',
          background: 'var(--admin-card-bg, #ffffff)',
          borderLeft: '1px solid var(--admin-border)',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.08)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          animation: 'slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `
        }} />

        {/* Drawer Header */}
        <div
          style={{
            padding: 'var(--admin-space-4) var(--admin-space-5)',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--admin-text)',
              margin: 0,
            }}
          >
            Submission Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close details"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              fontSize: '20px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--admin-surface)';
              e.currentTarget.style.color = 'var(--admin-text)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--admin-text-secondary)';
            }}
          >
            &times;
          </button>
        </div>

        {/* Drawer Body Scroll Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--admin-space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--admin-space-5)',
          }}
        >
          {isLoading ? (
            /* Skeleton Loading State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
              {/* Header Skeleton */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--admin-border)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ width: '60%', height: '14px', background: 'var(--admin-border)', borderRadius: '4px' }} />
                  <div style={{ width: '40%', height: '10px', background: 'var(--admin-border)', borderRadius: '4px' }} />
                </div>
              </div>
              {/* Grid Skeleton */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--admin-space-4)' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ width: '40%', height: '8px', background: 'var(--admin-border)', borderRadius: '4px' }} />
                    <div style={{ width: '80%', height: '12px', background: 'var(--admin-border)', borderRadius: '4px' }} />
                  </div>
                ))}
              </div>
              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />
              {/* Message Skeleton */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '20%', height: '8px', background: 'var(--admin-border)', borderRadius: '4px' }} />
                <div style={{ width: '100%', height: '90px', background: 'var(--admin-border)', borderRadius: '6px' }} />
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--admin-space-8) 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--admin-space-4)',
              }}
            >
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <p style={{ color: 'var(--admin-text)', margin: 0, fontWeight: 500 }}>
                {error}
              </p>
              <button
                onClick={loadContactDetails}
                style={{
                  padding: '8px 16px',
                  background: 'var(--admin-secondary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--admin-radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Retry Fetch
              </button>
            </div>
          ) : contact ? (
            /* Main Content loaded */
            <>
              {/* Profile details section */}
              <ContactInfoSection contact={contact} />

              {/* Subject & message section */}
              <ContactMessageSection contact={contact} />

              {/* Placeholder slots for future components (Notes, Timeline, Attachments) */}
              {/*
              <div style={{ marginTop: 'var(--admin-space-2)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-text-secondary)' }}>Activity Log</h4>
                ... timeline component ...
              </div>
              */}
            </>
          ) : null}
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: 'var(--admin-space-4) var(--admin-space-5)',
            borderTop: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            display: 'flex',
            gap: 'var(--admin-space-3)',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              background: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--admin-text-secondary)',
            }}
          >
            Close
          </button>
          
          <button
            onClick={handleReplyClick}
            disabled={isLoading || isReplying || !contact}
            style={{
              padding: '8px 20px',
              background: 'var(--admin-secondary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--admin-radius-md)',
              cursor: isLoading || isReplying || !contact ? 'not-allowed' : 'pointer',
              opacity: isLoading || isReplying || !contact ? 0.6 : 1,
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--admin-space-2)',
            }}
          >
            <span>✉️</span> {isReplying ? 'Opening Gmail...' : 'Reply'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactDetailsDrawer;
