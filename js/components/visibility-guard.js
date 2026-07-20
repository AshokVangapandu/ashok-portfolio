/* js/components/visibility-guard.js */
(function() {
  // Do not run route protection on admin dashboard routes
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/admin') || path.includes('admin/index.html')) {
    return;
  }

  // Inject loader CSS rules
  const loaderStyle = document.createElement('style');
  loaderStyle.id = 'visibility-guard-style';
  loaderStyle.innerHTML = `
    .vis-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #0A0D14;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      padding: 24px;
      opacity: 1;
      transition: opacity 0.15s ease-out;
    }
    .vis-card {
      max-width: 480px;
      width: 100%;
      background-color: #121824;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      box-sizing: border-box;
    }
    .vis-card.maint { border: 1px solid rgba(245, 158, 11, 0.3); }
    .vis-card.priv { border: 1px solid rgba(100, 116, 139, 0.3); }
    .vis-card.err { border: 1px solid rgba(239, 68, 68, 0.3); }
    .vis-badge { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .vis-title { margin: 0; font-size: 24px; font-weight: 700; color: #F8FAFC; }
    .vis-desc { margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.6; }
    .vis-sub { font-size: 12px; color: #64748B; background: rgba(255,255,255,0.04); padding: 6px 12px; border-radius: 6px; }
    .vis-btn { padding: 10px 24px; border-radius: 8px; background: #7C3AED; color: #FFF; border: none; font-weight: 600; cursor: pointer; }
    @keyframes visPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.95); opacity: 0.7; }
    }
  `;
  document.head.appendChild(loaderStyle);

  const overlayNode = document.createElement('div');
  overlayNode.className = 'vis-overlay';
  overlayNode.id = 'visibility-overlay';
  overlayNode.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
      <div style="width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg, #7C3AED, #3B82F6); display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:800; font-size:18px; box-shadow:0 0 30px rgba(124, 58, 237, 0.4); animation: visPulse 1.5s infinite ease-in-out;">
        AV
      </div>
      <span style="font-size:14px; color:#94A3B8; font-weight:500;">Loading portfolio...</span>
    </div>
  `;

  const removeOverlay = () => {
    const overlay = document.getElementById('visibility-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 150);
    }
  };

  const injectOverlay = () => {
    if (!document.getElementById('visibility-overlay')) {
      document.body.appendChild(overlayNode);
    }
  };

  if (document.body) {
    injectOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', injectOverlay);
  }

  async function checkVisibility() {
    try {
      if (!window.PortfolioSettingsService) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const service = window.PortfolioSettingsService;
      let mode = 'public';
      if (service && typeof service.getSiteMode === 'function') {
        mode = await Promise.race([
          service.getSiteMode(),
          new Promise((res) => setTimeout(() => res('public'), 2500))
        ]);
      }

      if (mode === 'maintenance') {
        overlayNode.innerHTML = `
          <div class="vis-card maint" style="max-width:520px; padding:44px 36px; gap:24px; border:1px solid rgba(255,255,255,0.08); background:rgba(18,24,36,0.85); backdrop-filter:blur(16px); box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
              <div style="width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.08)); border:1px solid rgba(245, 158, 11, 0.3); color:#F59E0B; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(245, 158, 11, 0.15);">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div style="display:flex; align-items:center; gap:8px; background:rgba(245, 158, 11, 0.1); padding:6px 14px; border-radius:20px; border:1px solid rgba(245, 158, 11, 0.2);">
                <span style="width:8px; height:8px; border-radius:50%; background-color:#F59E0B; box-shadow:0 0 8px #F59E0B;"></span>
                <span style="font-size:12px; font-weight:700; color:#F59E0B; letter-spacing:0.04em; text-transform:uppercase;">Maintenance Mode</span>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <h1 style="margin:0; font-size:26px; font-weight:800; color:#F8FAFC; letter-spacing:-0.02em;">Portfolio Under Maintenance</h1>
              <p style="margin:0; font-size:14.5px; color:#94A3B8; line-height:1.6;">I'm currently working on exciting improvements, new projects, and a better experience. Thank you for your patience.</p>
            </div>
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:8px 16px; border-radius:12px; font-size:13px; color:#CBD5E1;">
              <span>Expected to be back soon</span>
            </div>
            <div id="maint-notify-wrapper" style="width:100%; display:flex; flex-direction:column; gap:12px; margin-top:4px;">
              <form id="maint-notify-form" style="display:flex; gap:8px; width:100%; flex-wrap:wrap;" onsubmit="window.handleMaintenanceNotifySubmit(event)">
                <input id="maint-email-input" type="email" required placeholder="Enter your email address" style="flex:1; min-width:220px; padding:12px 16px; border-radius:10px; background:rgba(15, 23, 42, 0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13.5px; outline:none;" />
                <button id="maint-btn-submit" type="submit" style="padding:12px 20px; border-radius:10px; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; border:none; font-weight:600; font-size:13.5px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 14px rgba(124, 58, 237, 0.3);">Notify Me</button>
              </form>
              <div id="maint-error-feedback" style="display:none; font-size:12px; color:#EF4444; text-align:left; margin-left:4px;"></div>
            </div>
            <div style="width:100%; height:1px; background:rgba(255, 255, 255, 0.08); margin:4px 0;"></div>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px;">
              <a href="https://linkedin.com/in/ashokvangapandu" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
              </a>
              <a href="https://github.com/ashokvangapandu" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> GitHub
              </a>
              <a href="mailto:ashokvangapandu45@gmail.com" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Email
              </a>
            </div>
          </div>
        `;
      } else if (mode === 'private') {
        const hasSession = window.PrivateAccessService && typeof window.PrivateAccessService.hasValidSession === 'function' && window.PrivateAccessService.hasValidSession();
        if (hasSession) {
          removeOverlay();
          return;
        }
        overlayNode.innerHTML = `
          <div class="vis-card priv" style="max-width:520px; padding:44px 36px; gap:24px; border:1px solid rgba(255,255,255,0.08); background:rgba(18,24,36,0.85); backdrop-filter:blur(16px); box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
            <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
              <div style="width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, rgba(124, 58, 237, 0.18), rgba(99, 102, 241, 0.1)); border:1px solid rgba(124, 58, 237, 0.3); color:#A78BFA; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(124, 58, 237, 0.2);">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div style="display:flex; align-items:center; gap:8px; background:rgba(124, 58, 237, 0.1); padding:6px 14px; border-radius:20px; border:1px solid rgba(124, 58, 237, 0.2);">
                <span style="width:8px; height:8px; border-radius:50%; background:#A78BFA; box-shadow:0 0 8px #A78BFA;"></span>
                <span style="font-size:12px; font-weight:700; color:#A78BFA; letter-spacing:0.04em; text-transform:uppercase;">Private Access</span>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <h1 style="margin:0; font-size:26px; font-weight:800; color:#F8FAFC; letter-spacing:-0.02em;">Private Portfolio</h1>
              <p style="margin:0; font-size:14px; color:#94A3B8; line-height:1.6;">This portfolio is currently shared privately for interviews, client reviews, and selected collaborations.</p>
              <span style="font-size:13px; color:#CBD5E1; font-weight:500; margin-top:4px;">If you've been granted access, please continue below.</span>
            </div>
            <div id="priv-feedback-wrapper" style="display:none; width:100%; background:rgba(124, 58, 237, 0.1); border:1px solid rgba(124, 58, 237, 0.3); border-radius:12px; padding:14px 16px; color:#C4B5FD; font-size:13.5px; font-weight:600;"></div>
            <form id="priv-access-form" style="display:flex; flex-direction:column; gap:8px; width:100%;" onsubmit="window.handlePrivateContinueSubmit(event)">
              <div style="display:flex; gap:8px; width:100%; flex-wrap:wrap;">
                <input id="priv-email-input" type="email" required placeholder="Enter your email address" style="flex:1; min-width:220px; padding:12px 16px; border-radius:10px; background:rgba(15, 23, 42, 0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13.5px; outline:none;" />
                <button type="submit" style="padding:12px 24px; border-radius:10px; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; border:none; font-weight:600; font-size:13.5px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 14px rgba(124, 58, 237, 0.3);">Continue</button>
              </div>
              <div id="priv-error-feedback" style="display:none; font-size:12px; color:#EF4444; text-align:left; margin-left:4px;"></div>
            </form>
            <div style="width:100%; height:1px; background:rgba(255, 255, 255, 0.08); margin:4px 0;"></div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:10px; width:100%;">
              <span style="font-size:13px; color:#94A3B8; font-weight:500;">Need access to view this portfolio?</span>
              <button type="button" onclick="window.handlePrivateRequestAccess()" style="padding:10px 20px; border-radius:10px; background:rgba(255, 255, 255, 0.04); border:1px solid rgba(255, 255, 255, 0.12); color:#F8FAFC; font-weight:600; font-size:13px; cursor:pointer;">Request Access</button>
            </div>
            <div style="width:100%; height:1px; background:rgba(255, 255, 255, 0.08); margin:4px 0;"></div>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px;">
              <a href="https://linkedin.com/in/ashokvangapandu" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
              </a>
              <a href="https://github.com/ashokvangapandu" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> GitHub
              </a>
              <a href="mailto:ashokvangapandu45@gmail.com" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Email
              </a>
            </div>
          </div>
        `;
      } else {
        // Default to public mode
        removeOverlay();
      }
    } catch (err) {
      console.warn('[visibility-guard] Fetch error, defaulting to public mode:', err);
      removeOverlay();
    }
  }

  window.handleMaintenanceNotifySubmit = async function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('maint-email-input');
    const btn = document.getElementById('maint-btn-submit');
    const wrapper = document.getElementById('maint-notify-wrapper');
    const errBox = document.getElementById('maint-error-feedback');

    if (!input || !btn || !wrapper) return;
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }

    const email = (input.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errBox) {
        errBox.textContent = 'Please enter a valid email address.';
        errBox.style.display = 'block';
      }
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    btn.style.opacity = '0.8';

    try {
      const service = window.MaintenanceService;
      let res = { success: false, isDuplicate: false, message: 'Service unavailable' };
      if (service && typeof service.subscribeToNotify === 'function') {
        res = await service.subscribeToNotify(email);
      } else {
        res = { success: true, isDuplicate: false, message: "Thank you! We'll notify you as soon as the portfolio is live." };
      }

      if (res.success) {
        const bg = res.isDuplicate ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)';
        const border = res.isDuplicate ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        const color = res.isDuplicate ? '#F59E0B' : '#10B981';
        const icon = res.isDuplicate ? 'ℹ ' : '✓ ';
        wrapper.innerHTML = `<div style="background:${bg}; border:1px solid ${border}; border-radius:12px; padding:16px; color:${color}; font-size:13.5px; font-weight:600; line-height:1.5;">${icon}${res.message}</div>`;
      } else {
        if (errBox) {
          errBox.textContent = res.message;
          errBox.style.display = 'block';
        }
        btn.disabled = false;
        btn.textContent = 'Notify Me';
        btn.style.opacity = '1';
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (errBox) {
        errBox.textContent = 'Failed to submit. Please try again.';
        errBox.style.display = 'block';
      }
      btn.disabled = false;
      btn.textContent = 'Notify Me';
      btn.style.opacity = '1';
    }
  };

  window.handlePrivateContinueSubmit = async function(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('priv-email-input');
    const errBox = document.getElementById('priv-error-feedback');
    const infoBox = document.getElementById('priv-feedback-wrapper');
    const form = document.getElementById('priv-access-form');
    const btn = form ? form.querySelector('button[type="submit"]') : null;

    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }
    if (infoBox) {
      infoBox.style.display = 'none';
      infoBox.textContent = '';
    }

    const email = input ? (input.value || '').trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errBox) {
        errBox.textContent = 'Please enter a valid email address.';
        errBox.style.display = 'block';
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Verifying...';
      btn.style.opacity = '0.8';
    }

    try {
      const service = window.PrivateAccessService;
      let res = { success: false, message: 'Verification service unavailable.' };
      if (service && typeof service.verifyAccess === 'function') {
        res = await service.verifyAccess(email);
      }

      if (res.success) {
        removeOverlay();
      } else {
        if (errBox) {
          errBox.textContent = res.message || 'Verification failed.';
          errBox.style.display = 'block';
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Continue';
          btn.style.opacity = '1';
        }
      }
    } catch (err) {
      console.error('[visibility-guard] Verification error:', err);
      if (errBox) {
        errBox.textContent = 'An error occurred during verification. Please try again.';
        errBox.style.display = 'block';
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Continue';
        btn.style.opacity = '1';
      }
    }
  };

  window.handlePrivateRequestAccess = function() {
    const existing = document.getElementById('priv-req-modal');
    if (existing) existing.remove();

    const inputEmail = document.getElementById('priv-email-input');
    const defaultEmail = inputEmail ? (inputEmail.value || '').trim() : '';

    const modal = document.createElement('div');
    modal.id = 'priv-req-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:999999; padding:20px; box-sizing:border-box; font-family:"Inter", sans-serif;';
    modal.innerHTML = `
      <div style="background:#121824; border:1px solid rgba(255,255,255,0.1); border-radius:20px; max-width:480px; width:100%; padding:32px 28px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.6); display:flex; flex-direction:column; gap:20px; color:#F8FAFC;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <h3 style="margin:0; font-size:20px; font-weight:800;">Request Access</h3>
            <span style="font-size:13px; color:#94A3B8;">Submit your details for review</span>
          </div>
          <button type="button" onclick="document.getElementById('priv-req-modal').remove()" style="background:none; border:none; cursor:pointer; color:#94A3B8; font-size:18px;">✕</button>
        </div>
        <div id="modal-req-feedback" style="display:none; padding:14px 16px; border-radius:12px; font-size:13.5px; font-weight:600; line-height:1.5;"></div>
        <form id="modal-req-form" style="display:flex; flex-direction:column; gap:12px;" onsubmit="window.handleAccessRequestSubmit(event)">
          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Full Name *</label>
              <input id="req-modal-name" type="text" required placeholder="Jane Doe" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Email Address *</label>
              <input id="req-modal-email" type="email" required value="${defaultEmail}" placeholder="jane@company.com" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Company (Optional)</label>
              <input id="req-modal-company" type="text" placeholder="e.g. Acme Corp" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Job Title (Optional)</label>
              <input id="req-modal-title" type="text" placeholder="e.g. Senior Recruiter" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Reason for Request *</label>
            <textarea id="req-modal-reason" required rows="2" placeholder="Briefly state why you'd like access..." style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none; resize:vertical;"></textarea>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:12px; font-weight:600; color:#CBD5E1;">LinkedIn Profile URL (Optional)</label>
            <input id="req-modal-linkedin" type="url" placeholder="https://linkedin.com/in/username" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
            <button type="button" onclick="document.getElementById('priv-req-modal').remove()" style="padding:10px 16px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); background:transparent; color:#CBD5E1; font-size:13px; font-weight:600; cursor:pointer;">Cancel</button>
            <button id="req-modal-submit-btn" type="submit" style="padding:10px 20px; border-radius:8px; border:none; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; font-size:13px; font-weight:600; cursor:pointer;">Submit Request</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  };

  window.handleAccessRequestSubmit = async function(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('req-modal-name');
    const emailInput = document.getElementById('req-modal-email');
    const companyInput = document.getElementById('req-modal-company');
    const titleInput = document.getElementById('req-modal-title');
    const reasonInput = document.getElementById('req-modal-reason');
    const linkedinInput = document.getElementById('req-modal-linkedin');
    const feedback = document.getElementById('modal-req-feedback');
    const form = document.getElementById('modal-req-form');
    const btn = document.getElementById('req-modal-submit-btn');

    if (!nameInput || !emailInput || !reasonInput || !feedback || !btn) return;

    const fullName = (nameInput.value || '').trim();
    const email = (emailInput.value || '').trim();
    const reason = (reasonInput.value || '').trim();

    if (!fullName || !email || !reason) {
      feedback.style.background = 'rgba(239, 68, 68, 0.1)';
      feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      feedback.style.color = '#EF4444';
      feedback.textContent = 'Please fill out all required fields.';
      feedback.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    btn.style.opacity = '0.8';

    try {
      const service = window.AccessRequestService;
      let res = { success: false, message: 'Service unavailable' };
      if (service && typeof service.submitAccessRequest === 'function') {
        res = await service.submitAccessRequest({
          fullName,
          email,
          company: companyInput ? companyInput.value : '',
          jobTitle: titleInput ? titleInput.value : '',
          reason,
          linkedinUrl: linkedinInput ? linkedinInput.value : ''
        });
      }

      if (res.success) {
        if (form) form.style.display = 'none';
        feedback.style.background = 'rgba(16, 185, 129, 0.1)';
        feedback.style.border = '1px solid rgba(16, 185, 129, 0.3)';
        feedback.style.color = '#10B981';
        feedback.textContent = `✓ ${res.message}`;
        feedback.style.display = 'block';
      } else {
        feedback.style.background = 'rgba(239, 68, 68, 0.1)';
        feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        feedback.style.color = '#EF4444';
        feedback.textContent = res.message;
        feedback.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Submit Request';
        btn.style.opacity = '1';
      }
    } catch (err) {
      console.error('[visibility-guard] Access request submit error:', err);
      feedback.style.background = 'rgba(239, 68, 68, 0.1)';
      feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
      feedback.style.color = '#EF4444';
      feedback.textContent = 'Failed to submit request. Please try again.';
      feedback.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Submit Request';
      btn.style.opacity = '1';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkVisibility);
  } else {
    checkVisibility();
  }
})();
