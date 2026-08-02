/* src/admin/components/portfolio-content/FormContainer.tsx */
import React from 'react';

interface FormContainerProps {
  title: string;
  description?: string;
  onClose: () => void;
  isSubmitting?: boolean;
  actions: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  bodyStyle?: React.CSSProperties;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  description,
  onClose,
  isSubmitting = false,
  actions,
  children,
  width,
  bodyStyle
}) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }}
      />

      {/* Drawer panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: width || '560px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.08)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {title}
            </h2>
            {description && (
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                {description}
              </span>
            )}
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'rgba(241, 245, 29, 0.01)',
              cursor: 'pointer',
              color: '#94A3B8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
            ...bodyStyle
          }}
        >
          {children}
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            boxSizing: 'border-box',
            backgroundColor: '#F8FAFC'
          }}
        >
          {actions}
        </div>
      </aside>
    </>
  );
};

export default FormContainer;
