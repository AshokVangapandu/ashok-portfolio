/* src/admin/components/dialogs/Modal.tsx */
import React, { useEffect } from 'react';
import { Button } from '../buttons/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  // Lock body scroll on modal mount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getWidth = () => {
    if (size === 'sm') return '400px';
    if (size === 'lg') return '800px';
    return '550px';
  };

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // ZIndex.modal
        padding: 'var(--admin-space-4)',
        fontFamily: "'Inter', sans-serif"
      }}
      onClick={onClose}
    >
      <div 
        className="animate-slide-up"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--admin-radius-lg)',
          boxShadow: 'var(--admin-shadow-lg)',
          width: '100%',
          maxWidth: getWidth(),
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: 'var(--admin-space-4)',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 
            style={{ 
              margin: 0, 
              color: 'var(--admin-text)', 
              fontWeight: 600,
              fontSize: '16.5px'
            }}
          >
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              fontSize: '20px',
              padding: 'var(--admin-space-1)',
              lineHeight: 1,
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--admin-text-secondary)'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div 
          style={{
            padding: 'var(--admin-space-4)',
            overflowY: 'auto',
            flex: 1,
            fontSize: '14px',
            color: 'var(--admin-text)',
            lineHeight: 1.5
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: 'var(--admin-space-3) var(--admin-space-4)',
            borderTop: '1px solid var(--admin-border)',
            background: 'var(--admin-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--admin-space-2)'
          }}
        >
          {footer || (
            <Button variant="ghost" onClick={onClose} size="sm">
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
