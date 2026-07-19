/* src/admin/pages/social-links/components/AddSocialLinkModal.tsx */
import React, { useState, useEffect } from 'react';

interface AddSocialLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (platform: string, url: string) => boolean;
}

export const AddSocialLinkModal: React.FC<AddSocialLinkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [platform, setPlatform] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform.trim() && url.trim()) {
      const ok = onAdd(platform.trim(), url.trim());
      if (ok) {
        setPlatform('');
        setUrl('');
        onClose();
      }
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        animation: 'modalFadeIn 200ms ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'modalScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
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
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--admin-text)' }}>
              Add Social Link
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
              Add a new platform profile link to display on your public portfolio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            gap: '18px',
            boxSizing: 'border-box'
          }}
        >
          {/* Platform name input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 750, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. LinkedIn, GitHub, Dribbble..."
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid rgba(226, 232, 240, 1)',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--admin-text)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)'}
            />
          </div>

          {/* URL input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: 750, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Profile URL
            </label>
            <input
              type="text"
              required
              placeholder="e.g. https://github.com/username"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid rgba(226, 232, 240, 1)',
                borderRadius: '8px',
                fontSize: '13.5px',
                color: 'var(--admin-text)',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)'}
            />
          </div>

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
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover-scale active-press animate-glow"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'var(--admin-primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Link</span>
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default AddSocialLinkModal;
