/* src/pages/maintenance/MaintenancePage.tsx */
import React, { useState } from 'react';
import { maintenanceService } from '../../services/maintenanceService';

export const MaintenancePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await maintenanceService.subscribeToNotify(cleanEmail);
      if (res.success) {
        setSubmitted(true);
        setIsDuplicate(res.isDuplicate);
        setFeedbackMessage(res.message);
        setEmail('');
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

        {/* Notify Me Area */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
          {submitted ? (
            <div
              style={{
                backgroundColor: isDuplicate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: isDuplicate ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                color: isDuplicate ? '#F59E0B' : '#10B981',
                fontSize: '13.5px',
                fontWeight: 600,
                lineHeight: 1.5
              }}
            >
              {isDuplicate ? 'ℹ ' : '✓ '}{feedbackMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px', width: '100%', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={email}
                  disabled={submitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: errorMsg ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: submitting ? 0.7 : 1
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    background: submitting ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: submitting ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.3)',
                    transition: 'transform 0.15s ease, background 0.2s',
                    opacity: submitting ? 0.8 : 1
                  }}
                >
                  {submitting ? 'Subscribing...' : 'Notify Me'}
                </button>
              </div>
              {errorMsg && (
                <span style={{ fontSize: '12px', color: '#EF4444', textAlign: 'left', marginLeft: '4px' }}>
                  {errorMsg}
                </span>
              )}
            </form>
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
