/* src/pages/maintenance/MaintenancePage.tsx */
import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { useAuth } from '../../hooks/useAuth';
import { socialLinksService } from '../../admin/services/socialLinksService';

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
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#080A0F',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '36px 36px',
        backgroundPosition: 'center center'
      }}
    >
      {/* Scoped CSS for Hover Effects, Animations & Creative Mobile Masterpiece */}
      <style dangerouslySetInnerHTML={{ __html: `
        .maint-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .maint-btn-google {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
        }
        .maint-btn-google:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .maint-social-btn {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94A3B8;
          transition: all 0.2s ease;
        }
        .maint-social-btn:hover {
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.18);
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

        /* Animations */
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.75; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.75; }
        }
        @keyframes liveDot {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 6px #F59E0B; }
          50% { transform: scale(1.35); opacity: 0.75; box-shadow: 0 0 12px #F59E0B; }
        }

        /* Option 3: Full-Screen Hero Layout with Fixed Bottom Dock (< 640px) */
        @media (max-width: 640px) {
          .maint-wrapper-page {
            background-color: #06080F !important;
            background-image:
              radial-gradient(circle at 50% 20%, rgba(124, 58, 237, 0.28) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 75%),
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px) !important;
            background-size: 100% 100%, 32px 32px, 32px 32px !important;
            padding: 24px 16px 20px 16px !important;
            min-height: 100vh !important;
            justify-content: space-between !important;
          }
          .maint-bg-glow {
            display: none !important;
          }
          .maint-card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            padding: 0 !important;
            max-width: 360px !important;
            width: 100% !important;
            gap: 22px !important;
            margin: auto 0 !important;
          }
          .maint-hero-ring {
            width: 76px !important;
            height: 76px !important;
            border: 1px solid rgba(139, 92, 246, 0.3) !important;
            animation: ringPulse 3s ease-in-out infinite !important;
          }
          .maint-hero-box {
            width: 58px !important;
            height: 58px !important;
            border-radius: 17px !important;
            background: rgba(35, 22, 60, 0.75) !important;
            border: 1px solid rgba(139, 92, 246, 0.4) !important;
            box-shadow: 0 0 24px rgba(124, 58, 237, 0.3) !important;
          }
          .maint-hero-img {
            width: 28px !important;
            height: 28px !important;
          }
          .maint-title {
            font-size: 25px !important;
            line-height: 1.25 !important;
            color: #FFFFFF !important;
            background: none !important;
            -webkit-text-fill-color: initial !important;
            font-weight: 800 !important;
            letter-spacing: -0.02em !important;
          }
          .maint-desc {
            font-size: 13.5px !important;
            line-height: 1.55 !important;
            color: #94A3B8 !important;
            max-width: 320px !important;
          }
          .maint-status-pill {
            padding: 8px 18px !important;
            font-size: 12.5px !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.09) !important;
            color: #CBD5E1 !important;
            border-radius: 9999px !important;
          }
          .maint-notify-box {
            padding: 20px 18px !important;
            border-radius: 20px !important;
            gap: 14px !important;
            background: rgba(15, 20, 32, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
            width: 100% !important;
          }
          .maint-btn-google {
            padding: 12px 18px !important;
            font-size: 14px !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.06) !important;
            border: 1px solid rgba(255, 255, 255, 0.14) !important;
            color: #FFFFFF !important;
            font-weight: 600 !important;
          }
          .maint-btn-google:active {
            transform: scale(0.98) !important;
            background: rgba(255, 255, 255, 0.12) !important;
          }
          .maint-social-container {
            width: 100% !important;
            max-width: 360px !important;
            gap: 8px !important;
            margin-top: 12px !important;
          }
          .maint-social-btn {
            padding: 10px 14px !important;
            font-size: 12.5px !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            color: #94A3B8 !important;
            flex: 1 1 calc(33.33% - 6px) !important;
            justify-content: center !important;
            font-weight: 500 !important;
          }
          .maint-social-btn:active {
            transform: scale(0.96) !important;
            color: #FFFFFF !important;
            background: rgba(255, 255, 255, 0.09) !important;
          }
        }
      ` }} />

      {/* Subtle Ambient Purple Glow Background */}
      <div
        className="maint-bg-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.14) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          zIndex: 1
        }}
      />

      {/* Main Center Container Card */}
      <div
        className="maint-card"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '480px',
          width: '100%',
          backgroundColor: 'rgba(13, 16, 23, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '28px',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.65), 0 0 40px rgba(124, 58, 237, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px',
          boxSizing: 'border-box'
        }}
      >
        {/* Hero Visual Icon Section */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0 2px 0' }}>
          {/* Concentric ambient ring */}
          <div
            className="maint-hero-ring"
            style={{
              position: 'absolute',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              border: '1px solid rgba(139, 92, 246, 0.18)',
              pointerEvents: 'none'
            }}
          />

          {/* Squircle Icon Container */}
          <div
            className="maint-hero-box"
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              backgroundColor: 'rgba(35, 22, 60, 0.65)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(124, 58, 237, 0.22), inset 0 0 16px rgba(139, 92, 246, 0.15)'
            }}
          >
            {/* Top-Right Cyan Accent Dot */}
            <div
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: '#38BDF8',
                boxShadow: '0 0 8px #38BDF8'
              }}
            />

            {/* Bottom-Left Purple Accent Dot */}
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '-2px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#C084FC',
                boxShadow: '0 0 6px #C084FC'
              }}
            />

            {/* AV Brand Logo Icon */}
            <img
              src="assets/images/AV%20White%20Icon.svg"
              alt="AV Brand Logo"
              className="maint-hero-img"
              style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>

        {/* Maintenance Mode Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '9999px',
            padding: '5px 14px',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <h1
            className="maint-title"
            style={{
              margin: 0,
              fontSize: 'clamp(26px, 5vw, 32px)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              maxWidth: '380px'
            }}
          >
            Portfolio Under<br />Maintenance
          </h1>
          <p
            className="maint-desc"
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '400px'
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

        {/* Notification Section Container */}
        <div
          className="maint-notify-box"
          style={{
            width: '100%',
            backgroundColor: 'rgba(10, 13, 20, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '20px 22px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            marginTop: '2px'
          }}
        >
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#E2E8F0', letterSpacing: '-0.01em', textAlign: 'center' }}>
                Want to get notified when we're back online?
              </span>
              
              {/* Google Sign-In Primary CTA */}
              <button
                type="button"
                className="maint-btn-google"
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: signingIn ? 'wait' : 'pointer',
                  width: '100%',
                  opacity: signingIn ? 0.7 : 1,
                  boxSizing: 'border-box'
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
                          outline: 'none',
                          boxSizing: 'border-box'
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
                          cursor: submitting ? 'wait' : 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {submitting ? 'Subscribing...' : 'Notify Me'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Feedback Alert Box */}
              {submitted && (
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
                {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt={user.user_metadata?.full_name || 'User Avatar'}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid #7C3AED', flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#7C3AED',
                      color: '#FFF',
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

              {/* Subscribed Feedback or Action Button */}
              {submitted ? (
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

        {/* Social / Contact Links Footer */}
        <div className="maint-social-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', marginTop: '4px' }}>
          <a
            href={socialLinks.linkedin || '#'}
            onClick={(e) => handleSocialClick(e, 'linkedin')}
            target="_blank"
            rel="noopener noreferrer"
            className="maint-social-btn"
            style={{
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '13px',
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
              padding: '8px 16px',
              fontSize: '13px',
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
              padding: '8px 16px',
              fontSize: '13px',
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
  );
};

export default MaintenancePage;

