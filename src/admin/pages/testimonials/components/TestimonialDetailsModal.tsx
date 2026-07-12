/* src/admin/pages/testimonials/components/TestimonialDetailsModal.tsx */
import React, { useEffect } from 'react';
import { Testimonial } from '../../../types/testimonial';
import { RatingStars } from './RatingStars';

interface TestimonialDetailsModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
}

export const TestimonialDetailsModal: React.FC<TestimonialDetailsModalProps> = ({
  testimonial,
  onClose,
}) => {
  // ESC key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!testimonial) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)', // Muted dark overlay
        backdropFilter: 'blur(4px)',
        zIndex: 1100, // Above Topbar sticky headers
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--admin-space-4)',
        boxSizing: 'border-box',
        animation: 'modalFadeIn 200ms ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', // Premium soft shadows
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          overflow: 'hidden',
          animation: 'modalScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--admin-text)',
                letterSpacing: '-0.02em'
              }}
            >
              Testimonial Details
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--admin-text-secondary)',
                fontWeight: 500
              }}
            >
              Review the complete submission before moderating.
            </p>
          </div>

          <button
            onClick={onClose}
            className="hover-scale active-press"
            aria-label="Close modal"
            style={{
              background: 'none',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--admin-text-secondary)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
              e.currentTarget.style.color = 'var(--admin-text)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--admin-text-secondary)';
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div
          style={{
            padding: '32px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            boxSizing: 'border-box'
          }}
        >
          {/* SECTION 1: VISITOR INFORMATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--admin-text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Visitor Information
            </h4>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Visitor Avatar */}
              <img
                src={testimonial.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={testimonial.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--admin-border)',
                  flexShrink: 0
                }}
              />

              {/* Info Details Grid */}
              <div
                style={{
                  marginLeft: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px 32px',
                  flex: 1
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Full Name</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.name}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Email</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.email}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Company</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.company}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Role</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.role}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Country</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.country}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>City</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                    {testimonial.city}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EEF2FF', margin: 0 }} />

          {/* SECTION 2: TESTIMONIAL PREVIEW CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--admin-text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Testimonial
            </h4>
            
            <div
              style={{
                backgroundColor: 'rgba(248, 250, 252, 0.8)', // Slate-50 tint bg
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxSizing: 'border-box'
              }}
            >
              <RatingStars rating={testimonial.rating} />
              
              <blockquote
                style={{
                  margin: 0,
                  fontSize: '14.5px',
                  lineHeight: '1.6',
                  color: 'var(--admin-text)',
                  fontWeight: 500,
                  fontStyle: 'italic'
                }}
              >
                "{testimonial.preview}"
              </blockquote>

              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--admin-text-secondary)',
                  fontWeight: 500,
                  marginTop: '4px'
                }}
              >
                Submitted on {testimonial.date}
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #EEF2FF', margin: 0 }} />

          {/* SECTION 3: SUBMISSION DETAILS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--admin-text-secondary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Submission Details
            </h4>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px 32px'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Submitted From</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.submittedFrom}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Device</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.device}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Browser</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.browser}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Operating System</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.os}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Traffic Source</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.trafficSource}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>Submission Time</span>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--admin-text)', marginTop: '2px' }}>
                  {testimonial.submissionTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div
          style={{
            padding: '20px 32px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #EEF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Side: Delete */}
          <button
            className="hover-scale active-press"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-danger)',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Delete
          </button>

          {/* Right Side Buttons: Remind Later, Reject, Approve */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="hover-scale active-press"
              style={{
                padding: '10px 18px',
                border: '1px solid #FFE4E6', // Light orange border tint
                borderRadius: '8px',
                backgroundColor: '#FFF9F2', // Light orange surface bg
                color: '#D97706', // Orange text
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFEDD5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFF9F2'}
            >
              Remind Later
            </button>

            <button
              className="hover-scale active-press"
              style={{
                padding: '10px 18px',
                border: '1px solid #FCA5A5', // Light red border tint
                borderRadius: '8px',
                backgroundColor: '#FFF5F5', // Light red surface bg
                color: 'var(--admin-danger)', // Red text
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFF5F5'}
            >
              Reject
            </button>

            <button
              className="hover-scale active-press"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'var(--admin-primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      {/* Inline styles for modal animation effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default TestimonialDetailsModal;
