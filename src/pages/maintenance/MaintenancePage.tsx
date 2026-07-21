/* src/pages/maintenance/MaintenancePage.tsx */
import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { useAuth } from '../../hooks/useAuth';

export const MaintenancePage: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  return (
    <div
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
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Background Ribbons / Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 1
        }}
      />

      {/* Main Glass Card */}
      <div
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
        {/* Brand & Maintenance Icon Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.08))',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
            }}
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Maintenance Mode
            </span>
          </div>
        </div>

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
            Portfolio Under Maintenance
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14.5px',
              color: '#94A3B8',
              lineHeight: 1.6,
              fontWeight: 450
            }}
          >
            I'm currently working on exciting improvements, new projects, and a better experience. Thank you for your patience.
          </p>
        </div>

        {/* Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#CBD5E1',
            fontWeight: 500
          }}
        >
          <span>Expected to be back soon</span>
        </div>

        {/* Notify Me Area - Google Sign-In Flow */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {!user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#E2E8F0', letterSpacing: '-0.01em' }}>
                Want to get notified when we're back online?
              </span>
              <button
                type="button"
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

              {/* Feedback or Subscription Button */}
              {submitted ? (
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
                    padding: '12px',
                    borderRadius: '10px',
                    background: submitting ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                    transition: 'all 0.2s ease',
                    opacity: submitting ? 0.8 : 1
                  }}
                >
                  {submitting ? 'Subscribing...' : 'Notify Me'}
                </button>
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

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

        {/* Social Links Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <a
            href="https://linkedin.com/in/ashokvangapandu"
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
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/ashokvangapandu"
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
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:ashokvangapandu45@gmail.com"
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
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
