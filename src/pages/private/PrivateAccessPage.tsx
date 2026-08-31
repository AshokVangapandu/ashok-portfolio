/* src/pages/private/PrivateAccessPage.tsx */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/client';
import { privateAccessService } from '../../services/privateAccessService';
import { accessRequestService } from '../../services/accessRequestService';
import { socialLinksService } from '../../admin/services/socialLinksService';

export const PrivateAccessPage: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Status message states for the card
  const [submitted, setSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Request Access Modal State
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [reqFullName, setReqFullName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqCompany, setReqCompany] = useState('');
  const [reqJobTitle, setReqJobTitle] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqLinkedinUrl, setReqLinkedinUrl] = useState('');
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqError, setReqError] = useState('');
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.classList.add('is-maintenance-mode');
    return () => {
      document.body.classList.remove('is-maintenance-mode');
    };
  }, []);

  useEffect(() => {
    let active = true;
    socialLinksService.getLinks().then((data) => {
      if (!active) return;
      const map: Record<string, string> = {};
      data.forEach((item) => {
        if (item.platform && item.url) {
          map[item.platform.toLowerCase()] = item.url.trim();
        }
      });
      setSocialLinks(map);
    }).catch(err => {
      console.error("[PrivateAccessPage] Failed to fetch social links:", err);
    });
    return () => { active = false; };
  }, []);

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>, platform: string) => {
    const url = socialLinks[platform.toLowerCase()];
    if (!url || !url.trim()) {
      e.preventDefault();
      const platformNames: Record<string, string> = {
        linkedin: 'LinkedIn profile',
        github: 'GitHub profile',
        email: 'Email address'
      };
      const name = platformNames[platform.toLowerCase()] || platform;
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('info', 'Link Not Configured', `${name} has not been configured yet.`, 5000);
      } else {
        alert(`${name} has not been configured yet.`);
      }
    }
  };

  // SEO Optimization & page title Setup
  useEffect(() => {
    document.title = 'Private Access | Ashok Vangapandu';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Request access to Ashok Vangapandu's private professional portfolio.");
  }, []);

  // Monitor auth state changes to perform auto-verification or status checks
  useEffect(() => {
    let active = true;
    if (user?.email) {
      setVerifying(true);
      setCheckingStatus(true);
      setErrorMsg('');

      // Step 1: Auto-verify if the user is already authorized
      privateAccessService.verifyAccess(user.email!).then((res) => {
        if (!active) return;
        if (res.success) {
          setVerifying(false);
          // Reload to let GlobalRouteGuard grant access
          window.location.reload();
        } else {
          setVerifying(false);
          // Step 2: Check if there's a pending or approved access request
          checkRequestStatus(user.email!);
        }
      });
    } else {
      setSubmitted(false);
      setIsDuplicate(false);
      setFeedbackMessage('');
      setVerifying(false);
      setCheckingStatus(false);
    }
    return () => { active = false; };
  }, [user?.email]);

  const checkRequestStatus = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('request_status')
        .ilike('email', email)
        .in('request_status', ['pending', 'approved'])
        .order('requested_at', { ascending: false });

      if (error) {
        console.warn('[PrivateAccessPage] Error checking request status:', error);
        return;
      }

      if (data && data.length > 0) {
        const latestStatus = data[0].request_status;
        if (latestStatus === 'approved') {
          setSubmitted(false);
          setIsDuplicate(false);
          setFeedbackMessage("Your access is no longer active. You can request access again.");
        } else {
          setSubmitted(true);
          setIsDuplicate(true);
          setFeedbackMessage("We've already received your request. You'll be notified once it has been reviewed.");
        }
      } else {
        setSubmitted(false);
        setIsDuplicate(false);
        setFeedbackMessage('');
      }
    } catch (err) {
      console.warn('[PrivateAccessPage] Unexpected error checking status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSignOut = async () => {
    setErrorMsg('');
    try {
      // Clear local Private Access session
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('portfolio_private_session');
      }
      await signOut();
    } catch (err) {
      console.error('[PrivateAccessPage] Sign out error:', err);
      setErrorMsg('Failed to sign out. Please try again.');
    }
  };

  const handleOpenReqModal = () => {
    setReqFullName(user?.user_metadata?.full_name || user?.user_metadata?.name || '');
    setReqEmail(user?.email || '');
    setReqCompany('');
    setReqJobTitle('');
    setReqReason('');
    setReqLinkedinUrl('');
    setReqError('');
    setReqSuccessMsg('');
    setIsReqModalOpen(true);
  };

  const handleReqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqError('');
    setReqSuccessMsg('');

    if (!reqFullName.trim()) {
      setReqError('Please enter your full name.');
      return;
    }
    if (!reqEmail.trim()) {
      setReqError('Authenticated email is required.');
      return;
    }
    if (!reqReason.trim()) {
      setReqError('Please provide a reason for your request.');
      return;
    }

    setReqSubmitting(true);
    try {
      const res = await accessRequestService.submitAccessRequest({
        fullName: reqFullName.trim(),
        email: reqEmail.trim(),
        company: reqCompany.trim(),
        jobTitle: reqJobTitle.trim(),
        reason: reqReason.trim(),
        linkedinUrl: reqLinkedinUrl.trim()
      });

      if (res.success) {
        setReqSuccessMsg(res.message);
        setSubmitted(true);
        setIsDuplicate(false);
        setFeedbackMessage("Your access request has been submitted successfully. We'll review it and notify you once it's approved.");
        
        // Auto-close modal after 2.5 seconds
        setTimeout(() => {
          setIsReqModalOpen(false);
        }, 2500);
      } else {
        setReqError(res.message);
      }
    } catch (err: any) {
      console.error('[PrivateAccessPage] Request submit error:', err);
      setReqError('Failed to submit access request. Please try again.');
    } finally {
      setReqSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0A0D14',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Manrope', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Ambient Radial Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 1
        }}
      />

      {/* Main Glass Card */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '520px',
          width: '100%',
          backgroundColor: 'rgba(18, 24, 36, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '44px 36px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          boxSizing: 'border-box'
        }}
      >
        {/* Lock Icon Header */}
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.18), rgba(99, 102, 241, 0.1))',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#A78BFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)'
            }}
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A78BFA', boxShadow: '0 0 8px #A78BFA' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Private Access
            </span>
          </div>
        </header>

        {/* Title & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '26px',
              fontWeight: 800,
              color: '#F8FAFC',
              letterSpacing: '-0.02em',
              lineHeight: 1.25
            }}
          >
            Private Portfolio
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#94A3B8',
              lineHeight: 1.6,
              fontWeight: 450
            }}
          >
            This portfolio is currently shared privately for interviews, client reviews, and selected collaborations.
          </p>
          <span style={{ fontSize: '13px', color: '#CBD5E1', fontWeight: 500, marginTop: '4px' }}>
            {!user ? "If you've been granted access, please continue below." : "Authenticate and request portfolio access below."}
          </span>
        </div>

        {/* Action / Google Auth Area */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
              <button
                type="button"
                id="google-signin-btn"
                onClick={() => signIn()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                boxSizing: 'border-box'
              }}
            >
              {/* User Avatar + Display Name + Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt={user.user_metadata?.full_name || 'User Avatar'}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #7C3AED' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#7C3AED',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '16px'
                    }}
                  >
                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#F8FAFC' }}>
                    👤 {user.user_metadata?.full_name || user.user_metadata?.name || 'Google User'}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>{user.email}</span>
                </div>

                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ✓ Signed in
                </span>
              </div>

              {/* Feedback Message or Request Access Button */}
              {verifying || checkingStatus ? (
                <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 550 }}>
                  Verifying access status...
                </div>
              ) : submitted ? (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: isDuplicate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: isDuplicate ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    padding: '12px',
                    color: isDuplicate ? '#F59E0B' : '#10B981',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    textAlign: 'left'
                  }}
                >
                  {isDuplicate ? 'ℹ ' : '✓ '}{feedbackMessage}
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  {feedbackMessage && (
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        padding: '12px',
                        color: '#EF4444',
                        fontSize: '13px',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        boxSizing: 'border-box',
                        textAlign: 'left'
                      }}
                    >
                      ℹ {feedbackMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    id="request-access-btn"
                    onClick={handleOpenReqModal}
                    disabled={reqSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: reqSubmitting ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: reqSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                      transition: 'all 0.2s ease',
                      opacity: reqSubmitting ? 0.8 : 1
                    }}
                  >
                    {reqSubmitting ? 'Submitting...' : 'Request Access'}
                  </button>
                </div>
              )}

              {errorMsg && (
                <span style={{ fontSize: '12px', color: '#EF4444', textAlign: 'left', width: '100%' }}>
                  {errorMsg}
                </span>
              )}

              {/* Sign Out Action */}
              <div style={{ marginTop: '2px' }}>
                <button
                  type="button"
                  id="sign-out-btn"
                  onClick={handleSignOut}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Not your account? Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

        {/* Social Links */}
        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <a
            href={socialLinks.linkedin || '#'}
            onClick={(e) => handleSocialClick(e, 'linkedin')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
          </a>
          <a
            href={socialLinks.github || '#'}
            onClick={(e) => handleSocialClick(e, 'github')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> GitHub
          </a>
          <a
            href={socialLinks.email ? (socialLinks.email.startsWith('mailto:') ? socialLinks.email : `mailto:${socialLinks.email}`) : '#'}
            onClick={(e) => handleSocialClick(e, 'email')}
            style={{
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Email
          </a>
        </footer>
      </section>

      {/* Request Access Modal */}
      {isReqModalOpen && (
        <div
          role="dialog"
          aria-labelledby="modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              backgroundColor: '#121824',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '32px 28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              color: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 id="modal-title" style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Request Access</h3>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Submit your details for review</span>
              </div>
              <button
                type="button"
                id="modal-close-x"
                onClick={() => setIsReqModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '18px' }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {reqSuccessMsg ? (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '16px',
                  borderRadius: '12px',
                  color: '#10B981',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  textAlign: 'center'
                }}
              >
                ✓ {reqSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reqError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#EF4444', fontSize: '13px' }}>
                    {reqError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="req-name-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Full Name *</label>
                    <input
                      type="text"
                      id="req-name-input"
                      required
                      value={reqFullName}
                      onChange={(e) => setReqFullName(e.target.value)}
                      placeholder="Jane Doe"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="req-email-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Email Address *</label>
                    <input
                      type="email"
                      id="req-email-input"
                      required
                      readOnly
                      value={reqEmail}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.4)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#94A3B8',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'not-allowed'
                      }}
                      title="Email is automatically populated from your authenticated Google account and cannot be modified."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="req-company-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Company (Optional)</label>
                    <input
                      type="text"
                      id="req-company-input"
                      value={reqCompany}
                      onChange={(e) => setReqCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="req-job-title-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Job Title (Optional)</label>
                    <input
                      type="text"
                      id="req-job-title-input"
                      value={reqJobTitle}
                      onChange={(e) => setReqJobTitle(e.target.value)}
                      placeholder="e.g. Senior Recruiter"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="req-reason-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Reason for Request *</label>
                  <textarea
                    id="req-reason-input"
                    required
                    rows={2}
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    placeholder="Briefly state why you'd like access (e.g. Hiring review, client evaluation)..."
                    style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="req-linkedin-input" style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>LinkedIn Profile URL (Optional)</label>
                  <input
                    type="url"
                    id="req-linkedin-input"
                    value={reqLinkedinUrl}
                    onChange={(e) => setReqLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    id="modal-cancel-btn"
                    onClick={() => setIsReqModalOpen(false)}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: '#CBD5E1', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="modal-submit-btn"
                    disabled={reqSubmitting}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: reqSubmitting ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: reqSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {reqSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PrivateAccessPage;
