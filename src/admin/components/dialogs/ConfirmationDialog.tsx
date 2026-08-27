/* src/admin/components/dialogs/ConfirmationDialog.tsx */
import React, { useState, useEffect } from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  icon?: React.ReactNode;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  icon,
  variant = 'warning',
  onConfirm,
  onCancel
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateClose, setAnimateClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimateClose(false);
    } else if (shouldRender) {
      setAnimateClose(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Wait 200ms for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Bind Escape key resolver
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!shouldRender) return null;

  // Variant default icon triggers
  const getIcon = () => {
    if (icon) return icon;
    if (variant === 'danger') {
      return (
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px'
        }}>
          🛇
        </div>
      );
    }
    if (variant === 'info') {
      return (
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#E0F2FE',
          color: '#0EA5E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px'
        }}>
          ℹ
        </div>
      );
    }
    // Default warning icon
    return (
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#FEF3C7',
        color: '#F59E0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px'
      }}>
        ⚠
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 11000, // Above normal drawers & overlays
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Manrope', sans-serif",
        animation: `${animateClose ? 'confirmFadeOut' : 'confirmFadeIn'} 0.2s forwards ease-out`
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          padding: '32px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          animation: `${animateClose ? 'confirmScaleOut' : 'confirmScaleIn'} 0.2s forwards cubic-bezier(0.16, 1, 0.3, 1)`
        }}
      >
        {/* Header Icon */}
        {getIcon()}

        {/* Modal Text fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#475569' }}>
            {description}
          </p>
        </div>

        {/* Buttons Action row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '10px',
              backgroundColor: '#8B5CF6',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139,92,246,0.15)',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7C3AED';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8B5CF6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: variant === 'danger' ? '#EF4444' : '#64748B',
              border: '1.5px solid var(--admin-border)',
              fontSize: '14px',
              fontWeight: 650,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = variant === 'danger' ? '#FCA5A5' : '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = 'var(--admin-border)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Local keyframes style embedding */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confirmFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes confirmFadeOut {
          from { opacity: 1; backdrop-filter: blur(8px); }
          to { opacity: 0; backdrop-filter: blur(0px); }
        }
        @keyframes confirmScaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes confirmScaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default ConfirmationDialog;
