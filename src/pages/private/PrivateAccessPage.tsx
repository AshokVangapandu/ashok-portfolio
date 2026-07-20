import React, { useState } from 'react';
import { privateAccessService } from '../../services/privateAccessService';
import { accessRequestService } from '../../services/accessRequestService';

export const PrivateAccessPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);

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

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setVerifying(true);
    try {
      const res = await privateAccessService.verifyAccess(cleanEmail);
      if (res.success) {
        window.location.reload();
      } else {
        setErrorMsg(res.message || 'Verification failed.');
      }
    } catch (err: any) {
      console.error('[PrivateAccessPage] Verification submit error:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOpenReqModal = () => {
    setReqFullName('');
    setReqEmail(email.trim());
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
    if (!reqEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reqEmail.trim())) {
      setReqError('Please enter a valid email address.');
      return;
    }
    if (!reqReason.trim()) {
      setReqError('Please provide a reason for your request.');
      return;
    }

    setReqSubmitting(true);
    try {
      const res = await accessRequestService.submitAccessRequest({
        fullName: reqFullName,
        email: reqEmail,
        company: reqCompany,
        jobTitle: reqJobTitle,
        reason: reqReason,
        linkedinUrl: reqLinkedinUrl
      });

      if (res.success) {
        setReqSuccessMsg(res.message);
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
        {/* Lock Icon Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
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
            If you've been granted access, please continue below.
          </span>
        </div>

        {/* Form Feedback Message */}
        {infoMsg && (
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              color: '#C4B5FD',
              fontSize: '13.5px',
              fontWeight: 600,
              boxSizing: 'border-box'
            }}
          >
            ℹ {infoMsg}
          </div>
        )}

        {/* Email Verification Form Entry */}
        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              disabled={verifying}
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
                opacity: verifying ? 0.7 : 1
              }}
            />
            <button
              type="submit"
              disabled={verifying}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: verifying ? '#64748B' : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: verifying ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: verifying ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.3)',
                transition: 'transform 0.15s ease, background 0.2s',
                opacity: verifying ? 0.8 : 1
              }}
            >
              {verifying ? 'Verifying...' : 'Continue'}
            </button>
          </div>
          {errorMsg && (
            <span style={{ fontSize: '12px', color: '#EF4444', textAlign: 'left', marginLeft: '4px' }}>
              {errorMsg}
            </span>
          )}
        </form>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

        {/* Request Access Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>
            Need access to view this portfolio?
          </span>
          <button
            type="button"
            onClick={handleOpenReqModal}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s'
            }}
          >
            Request Access
          </button>
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

      {/* Request Access Modal */}
      {isReqModalOpen && (
        <div
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
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Request Access</h3>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>Submit your details for review</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReqModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            {reqSuccessMsg ? (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', color: '#10B981', fontSize: '13.5px', fontWeight: 600, lineHeight: 1.5, textAlign: 'center' }}>
                ✓ {reqSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reqError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px', color: '#EF4444', fontSize: '13px' }}>
                    {reqError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={reqFullName}
                      onChange={(e) => setReqFullName(e.target.value)}
                      placeholder="Jane Doe"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      placeholder="jane@company.com"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Company (Optional)</label>
                    <input
                      type="text"
                      value={reqCompany}
                      onChange={(e) => setReqCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Job Title (Optional)</label>
                    <input
                      type="text"
                      value={reqJobTitle}
                      onChange={(e) => setReqJobTitle(e.target.value)}
                      placeholder="e.g. Senior Recruiter"
                      style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>Reason for Request *</label>
                  <textarea
                    required
                    rows={2}
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    placeholder="Briefly state why you'd like access (e.g. Hiring review, client evaluation)..."
                    style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1' }}>LinkedIn Profile URL (Optional)</label>
                  <input
                    type="url"
                    value={reqLinkedinUrl}
                    onChange={(e) => setReqLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsReqModalOpen(false)}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'transparent', color: '#CBD5E1', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
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
    </div>
  );
};

export default PrivateAccessPage;
