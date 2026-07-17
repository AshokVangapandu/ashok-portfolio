/* src/admin/pages/testimonials/components/TestimonialDetailsDrawer.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '../../../types/testimonial';
import { testimonialService } from '../../../services/testimonialService';
import { supabase } from '../../../../services/supabase/client';
import { StatusBadge } from './StatusBadge';

interface TestimonialDetailsDrawerProps {
  isOpen: boolean;
  testimonialId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const TestimonialDetailsDrawer: React.FC<TestimonialDetailsDrawerProps> = ({
  isOpen,
  testimonialId,
  onClose,
  onSuccess
}) => {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Editable settings local state
  const [featured, setFeatured] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const loadTestimonialDetails = async () => {
    if (!testimonialId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await testimonialService.getTestimonialById(testimonialId);
      if (data) {
        setTestimonial(data);
        setFeatured(data.featured || false);
        setIsVisible(data.isVisible !== false);
        setDisplayOrder(data.displayOrder || 0);
        setAdminNotes(data.adminNotes || '');
      } else {
        setError('Testimonial not found.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch testimonial details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && testimonialId) {
      loadTestimonialDetails();
    } else {
      setTestimonial(null);
      setError(null);
    }
  }, [isOpen, testimonialId]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      activeElementRef.current = document.activeElement as HTMLElement;
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

  const handleApprove = async () => {
    if (!testimonial) return;
    setIsSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminEmail = userData?.user?.email || 'Admin';

      await testimonialService.updateTestimonial(testimonial.id, {
        status: 'approved',
        featured,
        is_visible: true,
        display_order: displayOrder,
        admin_notes: adminNotes,
        approved_at: new Date().toISOString(),
        approved_by: adminEmail
      });

      setIsVisible(true);

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'success',
          'Testimonial Approved',
          'The testimonial has been approved and settings updated.',
          4000
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[TestimonialDetailsDrawer] Approval error:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'Action Failed',
          err.message || 'Failed to approve testimonial.',
          6000
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!testimonial) return;
    setIsSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminEmail = userData?.user?.email || 'Admin';

      await testimonialService.updateTestimonial(testimonial.id, {
        status: 'rejected',
        featured,
        is_visible: false,
        display_order: displayOrder,
        admin_notes: adminNotes,
        rejected_at: new Date().toISOString(),
        rejected_by: adminEmail
      });

      setIsVisible(false);

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'success',
          'Testimonial Rejected',
          'The testimonial has been rejected and settings updated.',
          4000
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[TestimonialDetailsDrawer] Rejection error:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'Action Failed',
          err.message || 'Failed to reject testimonial.',
          6000
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!testimonial) return;
    setIsSaving(true);
    try {
      await testimonialService.updateTestimonial(testimonial.id, {
        featured,
        is_visible: isVisible,
        display_order: displayOrder,
        admin_notes: adminNotes
      });

      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'success',
          'Changes Saved',
          'Portfolio settings and notes updated successfully.',
          4000
        );
      }

      onSuccess();
      await loadTestimonialDetails();
    } catch (err: any) {
      console.error('[TestimonialDetailsDrawer] Save error:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'Save Failed',
          err.message || 'Failed to save changes.',
          6000
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!testimonial) return;
    if (window.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      setIsSaving(true);
      try {
        await testimonialService.deleteTestimonial(testimonial.id);
        
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast(
            'success',
            'Testimonial Deleted',
            'The testimonial was deleted successfully.',
            4000
          );
        }

        onSuccess();
        onClose();
      } catch (err: any) {
        console.error('[TestimonialDetailsDrawer] Delete error:', err);
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast(
            'error',
            'Delete Failed',
            err.message || 'Failed to delete testimonial.',
            6000
          );
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
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
          animation: 'fade-in 0.2s ease-out forwards'
        }}
      />

      {/* Side Drawer Container */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        aria-modal="true"
        aria-label="Testimonial Details Drawer"
        role="dialog"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '520px',
          maxWidth: '100%',
          background: 'var(--admin-card-bg, #ffffff)',
          borderLeft: '1px solid var(--admin-border)',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.08)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          fontFamily: "'Inter', sans-serif",
          animation: 'slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Local styles for transition/animations */}
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
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
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
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
            Testimonial Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
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
              transition: 'background 0.15s, color 0.15s'
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

        {/* Drawer Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--admin-space-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--admin-space-5)'
          }}
        >
          {isLoading ? (
            /* Skeleton Loading State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--admin-border)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ width: '60%', height: '14px', background: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '40%', height: '10px', background: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--admin-space-4)' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ width: '45%', height: '8px', background: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: '85%', height: '12px', background: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  </div>
                ))}
              </div>
              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '25%', height: '8px', background: 'var(--admin-border)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '100%', height: '90px', background: 'var(--admin-border)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
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
                gap: 'var(--admin-space-4)'
              }}
            >
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <p style={{ color: 'var(--admin-text)', margin: 0, fontWeight: 500 }}>
                {error}
              </p>
              <button
                onClick={loadTestimonialDetails}
                style={{
                  padding: '8px 16px',
                  background: 'var(--admin-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--admin-radius-md)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                Retry
              </button>
            </div>
          ) : testimonial ? (
            /* Real Data Loaded */
            <>
              {/* SECTION 1: Visitor Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Visitor Information
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-4)' }}>
                  {testimonial.avatarUrl ? (
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--admin-surface, #F3E8FF)',
                        color: 'var(--admin-primary, #7C3AED)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '18px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                      }}
                    >
                      {getInitials(testimonial.name)}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                      {testimonial.name}
                    </h4>
                    <a
                      href={`mailto:${testimonial.email}`}
                      style={{ fontSize: '13px', color: 'var(--admin-primary)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {testimonial.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--admin-space-3) var(--admin-space-4)', marginTop: '8px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Company
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                      {testimonial.company}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Designation
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                      {testimonial.role}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Country
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                      {testimonial.country}
                    </span>
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Submitted Date
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                      {testimonial.date} {testimonial.submissionTime}
                    </span>
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />

              {/* SECTION 2: Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Rating
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: s <= testimonial.rating ? '#F59E0B' : '#E2E8F0', fontSize: '22px' }}>★</span>
                  ))}
                  <span style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginLeft: '8px', fontWeight: 700 }}>
                    ({testimonial.rating}/5)
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />

              {/* SECTION 3: Testimonial Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Testimonial
                </h3>
                <div
                  style={{
                    backgroundColor: 'var(--admin-surface, #F8FAFC)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '13.5px',
                    color: 'var(--admin-text)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    boxSizing: 'border-box'
                  }}
                >
                  {testimonial.preview}
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />

              {/* SECTION 4: Current Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Current Status
                </h3>
                <StatusBadge status={testimonial.status} />
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />

              {/* SECTION 5: Portfolio Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Portfolio Settings
                </h3>

                {/* Featured Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>Featured</span>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)' }}>Show in the featured carousel on portfolio</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
                      {featured ? 'On' : 'Off'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFeatured(!featured)}
                      disabled={isSaving}
                      style={{
                        width: '46px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: featured ? 'var(--admin-primary)' : '#CBD5E1',
                        border: 'none',
                        position: 'relative',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background-color 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          left: featured ? '26px' : '2px',
                          transition: 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>Visible on Portfolio</span>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)' }}>Toggle visibility on public sections</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
                      {isVisible ? 'On' : 'Off'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      disabled={isSaving}
                      style={{
                        width: '46px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: isVisible ? 'var(--admin-primary)' : '#CBD5E1',
                        border: 'none',
                        position: 'relative',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background-color 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          left: isVisible ? '26px' : '2px',
                          transition: 'left 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Display Order Number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>Display Order</span>
                    <span style={{ fontSize: '11px', color: 'var(--admin-text-secondary)' }}>Sequence order index for custom sorting</span>
                  </div>
                  <input
                    type="number"
                    value={displayOrder}
                    disabled={isSaving}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '80px',
                      padding: '6px 10px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'var(--admin-text)',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--admin-border)', margin: 0 }} />

              {/* SECTION 6: Admin Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-text-secondary)', margin: 0, letterSpacing: '0.05em' }}>
                  Admin Notes
                </h3>
                <textarea
                  value={adminNotes}
                  disabled={isSaving}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter internal comments... (Private inside admin dashboard)"
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '10px 12px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--admin-text)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Sticky Action Footer */}
        {testimonial && !isLoading && (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '16px 20px',
              borderTop: '1px solid var(--admin-border)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 10,
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* Top row actions: Approve, Reject, Save Changes */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleReject}
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  backgroundColor: '#FFF5F5',
                  color: 'var(--admin-danger)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                Reject
              </button>
              
              <button
                onClick={handleApprove}
                disabled={isSaving}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                Approve
              </button>
              
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                style={{
                  flex: 1.5,
                  padding: '10px 14px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'var(--admin-primary)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                Save Changes
              </button>
            </div>

            {/* Bottom row actions: Delete (left), Cancel (right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-danger)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Delete
              </button>
              
              <button
                onClick={onClose}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestimonialDetailsDrawer;
