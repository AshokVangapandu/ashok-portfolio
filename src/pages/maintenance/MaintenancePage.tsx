/* src/pages/maintenance/MaintenancePage.tsx */
import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { useAuth } from '../../hooks/useAuth';
import { socialLinksService } from '../../admin/services/socialLinksService';
import { getUserAvatarUrl } from '../../utils/avatarUtils';

export const MaintenancePage: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [showEmailForm, setShowEmailForm] = useState(false);

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
      console.error("[MaintenancePage] Failed to fetch social links:", err);
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

  useEffect(() => {
    let active = true;
    if (user?.email) {
      maintenanceService.checkSubscriptionStatus(user.email).then((check) => {
        if (active && check.isSubscribed) {
          setSubmitted(true);
          setIsDuplicate(true);
          setFeedbackMessage(check.message || "You're already subscribed! We'll notify you as soon as the portfolio is live again.");
        }
      });
    } else {
      setSubmitted(false);
      setIsDuplicate(false);
      setFeedbackMessage('');
    }
    return () => { active = false; };
  }, [user?.email]);

  const handleSubscribe = async () => {
    if (!user || !user.email) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await maintenanceService.subscribeToNotify(user.email);
      if (res.success) {
        setSubmitted(true);
        setIsDuplicate(res.isDuplicate);
        setFeedbackMessage(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      console.error('[MaintenancePage] Subscription submit error:', err);
      setErrorMsg('Unexpected error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const [directEmail, setDirectEmail] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState('');

  const handleDirectEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directEmail || !directEmail.trim()) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await maintenanceService.subscribeToNotify(directEmail);
      if (res.success) {
        setSubmitted(true);
        setIsDuplicate(res.isDuplicate);
        setFeedbackMessage(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      console.error('[MaintenancePage] Direct email subscribe error:', err);
      setErrorMsg('Unexpected error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthErrorMsg('');
    setSigningIn(true);
    try {
      const res = await signIn();
      if (res && res.error) {
        setAuthErrorMsg(res.error.message || 'Google Sign-In failed. Please check your Supabase OAuth setup.');
        setSigningIn(false);
      }
    } catch (err: any) {
      console.error('[MaintenancePage] Google Sign-In error:', err);
      setAuthErrorMsg('Unable to connect to Google OAuth. Please try again.');
      setSigningIn(false);
    }
  };

  return (
    <div
      className="maint-wrapper-page"
      style={{
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#06080F',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box'
      }}
    >
      {/* Scoped CSS for Hover Effects & Full-Screen 60/40 Layout */}
      <style dangerouslySetInnerHTML={{
        __html: `
        body.is-maintenance-mode .site-header,
        body.is-maintenance-mode .mobile-bottom-nav,
        body.is-maintenance-mode [data-header] {
          display: none !important;
        }
        .maint-btn-google-primary {
          transition: all 0.2s ease;
        }
        .maint-btn-google-primary:hover:not(:disabled) {
          background-color: #F8FAFC !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25) !important;
        }
        .maint-social-btn {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          transition: all 0.2s ease;
        }
        .maint-social-btn:hover {
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(139, 92, 246, 0.35);
          color: #FFFFFF;
          transform: translateY(-1px);
        }
        .maint-email-toggle {
          background: none;
          border: none;
          color: #64748B;
          font-size: 12px;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }
        .maint-email-toggle:hover {
          color: #94A3B8;
          text-decoration: underline;
        }

        /* 100% Full-Screen 60/40 Split Desktop Layout (>= 992px) */
        .maint-split-container {
          display: grid;
          grid-template-columns: 60% 40%;
          width: 100vw;
          min-height: 100vh;
          box-sizing: border-box;
        }

        /* Responsive Tablet / Mobile Stacking (< 992px) - Isolated from Desktop */
        @media (max-width: 991px) {
          .maint-wrapper-page {
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            overflow-y: auto !important;
            padding: 0 0 36px 0 !important;
          }
          .maint-split-container {
            display: flex !important;
            flex-direction: column !important;
            grid-template-columns: 1fr !important;
            width: 100% !important;
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            padding: 0 0 36px 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          .maint-left-col {
            position: relative !important;
            height: auto !important;
            min-height: auto !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            text-align: center !important;
            padding: 0 0 12px 0 !important;
            overflow: visible !important;
          }
          .maint-hero-cover-img {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            width: 100% !important;
            height: clamp(240px, 35vh, 320px) !important;
            object-fit: cover !important;
            object-position: center top !important;
            display: block !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
          }
          .maint-hero-gradient {
            display: block !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 90px !important;
            background: linear-gradient(to top, #06080F 25%, rgba(6, 8, 15, 0.7) 65%, transparent 100%) !important;
            pointer-events: none !important;
            z-index: 2 !important;
          }
          .maint-left-content {
            position: relative !important;
            z-index: 3 !important;
            width: 100% !important;
            padding: 0 20px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 14px !important;
            box-sizing: border-box !important;
            margin-top: -20px !important;
          }
          .maint-title-br {
            display: none !important;
          }
          .maint-title {
            font-size: 18px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            text-align: center !important;
            width: 100% !important;
            margin: 0 !important;
            white-space: nowrap !important;
          }
          .maint-badge {
            display: inline-flex !important;
            margin: 0 auto !important;
            font-size: 9.5px !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
            padding: 4px 10px !important;
            gap: 5px !important;
          }
          /* Hide Desktop-Only Content on Mobile */
          .maint-desc,
          .maint-status-pill,
          .maint-benefits-grid {
            display: none !important;
          }
          .maint-right-col-wrapper {
            width: 100% !important;
            height: auto !important;
            padding: 0 0 12px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-sizing: border-box !important;
          }
          .maint-right-col {
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0px !important;
            padding: 20px 16px 16px 16px !important;
            gap: 12px !important;
            box-sizing: border-box !important;
          }
          .maint-card-icon-outer {
            width: 58px !important;
            height: 58px !important;
          }
          .maint-card-icon-inner {
            width: 44px !important;
            height: 44px !important;
          }
          .maint-card-heading {
            font-size: 16.5px !important;
            line-height: 1.25 !important;
          }
          .maint-card-subtext {
            font-size: 11.5px !important;
            line-height: 1.35 !important;
            max-width: 270px !important;
          }
          .maint-btn-google-primary,
          #maint-btn-google {
            height: 40px !important;
            padding: 0 16px !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            border-radius: 10px !important;
          }
          .maint-social-container {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
            width: 100% !important;
          }
          .maint-social-btn {
            width: 100% !important;
            height: 36px !important;
            justify-content: center !important;
            padding: 0 2px !important;
            font-size: 11.5px !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
          }
        }
      ` }} />

      {/* Ambient Purple Glow Background */}
      <div
        className="maint-bg-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.18) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
          zIndex: 1
        }}
      />

      {/* 100% Full-Screen 60/40 Split Layout */}
      <div
        className="maint-split-container"
        style={{
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* LEFT 60% VIEWPORT COLUMN */}
        <div
          className="maint-left-col"
          style={{
            position: 'relative',
            width: '100%',
            height: '100vh',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            textAlign: 'left',
            padding: 0,
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* Cover Image (Positioned absolutely in top 72% of left column on desktop) */}
          <img
            className="maint-hero-cover-img"
            src="assets/images/Maintanance_Cover.png"
            alt="Portfolio Maintenance Illustration"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '72%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />

          {/* Gradient Overlay (Smoothly fades lower illustration into page background) */}
          <div
            className="maint-hero-gradient"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '55%',
              background: 'linear-gradient(to top, #06080F 25%, rgba(6, 8, 15, 0.85) 60%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* Foreground Text Content (Positioned at bottom of left 60% column) */}
          <div
            className="maint-left-content"
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              padding: '0 48px 44px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start',
              boxSizing: 'border-box'
            }}
          >
            {/* Maintenance Mode Badge */}
            <div
              className="maint-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#F59E0B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#F59E0B',
                  boxShadow: '0 0 6px #F59E0B'
                }}
              />
              Maintenance Mode
            </div>

            {/* Title & Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <h1
                className="maint-title"
                style={{
                  margin: 0,
                  fontSize: 'clamp(30px, 3.5vw, 42px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}
              >
                Portfolio Under
                <span style={{ color: '#C084FC' }}>Maintenance</span>
              </h1>
              <p
                className="maint-desc"
                style={{
                  margin: 0,
                  fontSize: '14.5px',
                  lineHeight: 1.55,
                  color: '#94A3B8',
                  maxWidth: '500px'
                }}
              >
                I'm currently working on exciting improvements, new projects, and a better experience. Thank you for your patience.
              </p>
            </div>

            {/* Return Status Pill */}
            <div
              className="maint-status-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                color: '#94A3B8',
                fontWeight: 500
              }}
            >
              <span style={{ fontSize: '13px' }}>⏳</span>
              <span>Expected to be back soon</span>
            </div>
          </div>
        </div>

        {/* RIGHT 40% VIEWPORT COLUMN */}
        <div
          className="maint-right-col-wrapper"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 32px',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="maint-right-col"
            style={{
              backgroundColor: 'rgba(12, 15, 26, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(139, 92, 246, 0.28)',
              borderRadius: '24px',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75), 0 0 50px rgba(124, 58, 237, 0.14), inset 0 0 20px rgba(124, 58, 237, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '440px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Notification Bell Icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="maint-card-icon-outer"
                style={{
                  position: 'absolute',
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  pointerEvents: 'none'
                }}
              />
              <div
                className="maint-card-icon-inner"
                style={{
                  position: 'relative',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(35, 22, 60, 0.75)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(124, 58, 237, 0.3)'
                }}
              >
                <div style={{ position: 'absolute', top: '1px', right: '1px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
                <div style={{ position: 'absolute', bottom: '1px', left: '1px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#C084FC', boxShadow: '0 0 6px #C084FC' }} />
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <h2
                className="maint-card-heading"
                style={{
                  margin: 0,
                  fontSize: 'clamp(22px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25
                }}
              >
                Get notified<br />
                <span style={{ color: '#C084FC' }}>when I'm back online</span>
              </h2>
              <p
                className="maint-card-subtext"
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: '#94A3B8',
                  maxWidth: '330px'
                }}
              >
                Sign in with your account and I'll let you know as soon as the portfolio is live again.
              </p>
            </div>

            {/* Authentication Section */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              {!user ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
                  {/* Google Sign-In Primary CTA (Solid White Button matching reference) */}
                  <button
                    type="button"
                    className="maint-btn-google-primary"
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '13px 20px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '14.5px',
                      cursor: signingIn ? 'wait' : 'pointer',
                      width: '100%',
                      opacity: signingIn ? 0.7 : 1,
                      boxSizing: 'border-box',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    {signingIn ? 'Connecting to Google...' : 'Continue with Google'}
                  </button>

                  {/* Direct Email Fallback Option */}
                  {!submitted && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2px' }}>
                      {!showEmailForm ? (
                        <button
                          type="button"
                          className="maint-email-toggle"
                          onClick={() => setShowEmailForm(true)}
                        >
                          Or subscribe with email address
                        </button>
                      ) : (
                        <form onSubmit={handleDirectEmailSubmit} style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                          <input
                            type="email"
                            required
                            value={directEmail}
                            onChange={(e) => setDirectEmail(e.target.value)}
                            placeholder="Enter your email address"
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(15, 23, 42, 0.8)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#FFFFFF',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                              color: '#FFFFFF',
                              border: 'none',
                              fontWeight: 600,
                              fontSize: '13px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {submitting ? '...' : 'Notify'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {submitted && feedbackMessage && (
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: isDuplicate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        border: isDuplicate ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: isDuplicate ? '#F59E0B' : '#10B981',
                        fontSize: '13px',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      {isDuplicate ? 'ℹ ' : '✓ '}{feedbackMessage}
                    </div>
                  )}

                  {(authErrorMsg || errorMsg) && (
                    <span style={{ fontSize: '12.5px', color: '#EF4444', textAlign: 'center', width: '100%', marginTop: '2px' }}>
                      ⚠️ {authErrorMsg || errorMsg}
                    </span>
                  )}
                </div>
              ) : (
                /* Signed In User State */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* User Info Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                    {getUserAvatarUrl(user, user.email) ? (
                      <img
                        src={getUserAvatarUrl(user, user.email)!}
                        alt={user.user_metadata?.full_name || 'User Avatar'}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #7C3AED', flexShrink: 0, objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: '#7C3AED',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '15px',
                          flexShrink: 0
                        }}
                      >
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', overflow: 'hidden' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.user_metadata?.full_name || user.user_metadata?.name || 'Google User'}
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </span>
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
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      ✓ Signed in
                    </span>
                  </div>

                  {submitted && feedbackMessage ? (
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: isDuplicate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        border: isDuplicate ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: isDuplicate ? '#F59E0B' : '#10B981',
                        fontSize: '13px',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      {isDuplicate ? 'ℹ ' : '✓ '}{feedbackMessage}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '10px',
                        background: submitting ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '13.5px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                        transition: 'all 0.2s ease',
                        opacity: submitting ? 0.8 : 1
                      }}
                    >
                      {submitting ? 'Subscribing...' : 'Notify Me When Back Online'}
                    </button>
                  )}

                  {errorMsg && (
                    <span style={{ fontSize: '12px', color: '#EF4444', textAlign: 'center', width: '100%' }}>
                      {errorMsg}
                    </span>
                  )}

                  {/* Sign Out Action */}
                  <div>
                    <button
                      type="button"
                      onClick={() => signOut()}
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


            {/* Benefit Cards Grid (Hidden on mobile per reference) */}
            <div
              className="maint-benefits-grid"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                backgroundColor: 'rgba(10, 13, 22, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '14px 16px',
                boxSizing: 'border-box'
              }}
            >
              {/* Card 1: No Spam */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>No Spam</span>
                  <span style={{ color: '#64748B', fontSize: '11px', lineHeight: 1.3 }}>Only important updates</span>
                </div>
              </div>

              {/* Card 2: Instant Update */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Instant Update</span>
                  <span style={{ color: '#64748B', fontSize: '11px', lineHeight: 1.3 }}>You'll be the first to know</span>
                </div>
              </div>
            </div>

            {/* Sub-divider */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', color: '#64748B', fontSize: '11.5px', fontWeight: 500, margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              <span>Or connect with me</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            </div>

            {/* Social / Contact Links Footer */}
            <div className="maint-social-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
              <a
                href={socialLinks.linkedin || '#'}
                onClick={(e) => handleSocialClick(e, 'linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className="maint-social-btn"
                style={{
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a
                href={socialLinks.github || '#'}
                onClick={(e) => handleSocialClick(e, 'github')}
                target="_blank"
                rel="noopener noreferrer"
                className="maint-social-btn"
                style={{
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
              <a
                href={socialLinks.email ? (socialLinks.email.startsWith('mailto:') ? socialLinks.email : `mailto:${socialLinks.email}`) : '#'}
                onClick={(e) => handleSocialClick(e, 'email')}
                className="maint-social-btn"
                style={{
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
