/* src/admin/pages/contacts/components/ArchiveConfirmModal.tsx */
import React, { useEffect, useRef } from 'react';

interface ArchiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactName: string;
  isArchiving?: boolean;
}

export const ArchiveConfirmModal: React.FC<ArchiveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  isArchiving = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap management
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow render completion
      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC closing key triggers
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
      {/* Overlay Backdrop */}
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
          zIndex: 10001,
          animation: 'fade-in 0.2s ease-out forwards',
        }}
      />
      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Archive Contact Confirmation"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          maxWidth: '90%',
          background: '#ffffff',
          borderRadius: 'var(--admin-radius-lg, 12px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 10002,
          padding: 'var(--admin-space-6, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--admin-space-4, 16px)',
          animation: 'scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          outline: 'none'
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scale-up {
              from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `
        }} />

        {/* Content Section */}
        <div style={{ display: 'flex', gap: 'var(--admin-space-3, 12px)', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px' }}>📦</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
              Archive this contact?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--admin-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to archive the message from <strong>{contactName}</strong>? This contact will be hidden from the default list but can be viewed later using the Archived filter.
            </p>
          </div>
        </div>

        {/* Actions Button panel */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--admin-space-3, 12px)', marginTop: '8px' }}>
          <button
            onClick={onClose}
            disabled={isArchiving}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              background: '#ffffff',
              cursor: isArchiving ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              color: 'var(--admin-text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isArchiving}
            style={{
              padding: '8px 20px',
              background: 'var(--admin-secondary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--admin-radius-md)',
              cursor: isArchiving ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              opacity: isArchiving ? 0.6 : 1,
            }}
          >
            {isArchiving ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ArchiveConfirmModal;
