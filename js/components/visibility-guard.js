/* js/components/visibility-guard.js */
(function () {
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
      max-height: 100vh;
      background-color: #06080F;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: 'Manrope', system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      padding: 0;
      opacity: 1;
      transition: opacity 0.15s ease-out;
      overflow: hidden !important;
    }
    .vis-card {
      max-width: 480px;
      width: 100%;
      background-color: rgba(13, 16, 23, 0.85);
      border-radius: 28px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.65), 0 0 40px rgba(124, 58, 237, 0.06);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      box-sizing: border-box;
    }
    .vis-card.maint { border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
    .vis-card.priv { border: 1px solid rgba(124, 58, 237, 0.3); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
    .vis-card.err { border: 1px solid rgba(239, 68, 68, 0.3); }
    .vis-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .vis-title { margin: 0; font-size: 26px; font-weight: 700; color: #F8FAFC; }
    .vis-desc { margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.6; }
    .vis-sub { font-size: 12px; color: #64748B; background: rgba(255,255,255,0.04); padding: 6px 12px; border-radius: 6px; }
    .vis-btn { padding: 10px 24px; border-radius: 8px; background: #7C3AED; color: #FFF; border: none; font-weight: 600; cursor: pointer; }
    #maint-btn-google, .maint-btn-google-primary {
      transition: all 0.2s ease;
      background-color: #FFFFFF !important;
      color: #0F172A !important;
    }
    #maint-btn-google:hover:not(:disabled), .maint-btn-google-primary:hover:not(:disabled) {
      background-color: #F8FAFC !important;
      color: #0F172A !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4), 0 0 20px rgba(124, 58, 237, 0.3) !important;
    }
    .maint-vis-social-btn {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94A3B8;
      border-radius: 10px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .maint-vis-social-btn:hover {
      background-color: rgba(255, 255, 255, 0.07);
      border-color: rgba(255, 255, 255, 0.18);
      color: #FFFFFF;
      transform: translateY(-1px);
    }

    /* 100% Full-Screen 60/40 Split Desktop Presentation (>= 992px) */
    .maint-split-container {
      display: grid;
      grid-template-columns: 60% 40%;
      width: 100%;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Responsive Tablet / Mobile Stacking (< 992px) - Isolated from Desktop */
    @media (max-width: 991px) {
      .vis-overlay {
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
        padding: 0 0 12px 0  !important;
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
      .maint-vis-social-container {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
        width: 100% !important;
      }
      .maint-vis-social-btn {
        width: 100% !important;
        height: 36px !important;
        justify-content: center !important;
        padding: 0 2px !important;
        font-size: 11.5px !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        box-sizing: border-box !important;
      }
        justify-content: center !important;
        padding: 0 4px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        box-sizing: border-box !important;
      }
    }
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
        <img src="assets/images/AV%20White%20Icon.svg" alt="AV Logo" style="width:22px; height:22px; object-fit:contain; display:block;" />
      </div>
      <span style="font-size:14px; color:#94A3B8; font-weight:500;">Loading portfolio...</span>
    </div>
  `;

  const removeOverlay = () => {
    const overlay = document.getElementById('visibility-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }, 150);
    }
  };

  const injectOverlay = () => {
    if (!document.getElementById('visibility-overlay')) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.appendChild(overlayNode);
    }
  };

  if (document.body) {
    injectOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', injectOverlay);
  }

  async function checkAdminBypass() {
    try {
      const client = (window.AuthService && window.AuthService.supabase) ||
        (window.supabase && window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY ? window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY) : null);
      if (!client) return false;

      const { data: sessionData } = await client.auth.getSession();
      const rawEmail = sessionData?.session?.user?.email;
      if (!rawEmail) return false;
      const userEmail = rawEmail.trim().toLowerCase();

      const cached = sessionStorage.getItem(`is_admin_${userEmail}`);
      if (cached !== null) {
        return cached === 'true';
      }

      const { data: adminRecord, error } = await client
        .from('admins')
        .select('email, is_active')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.warn('[visibility-guard] Admin query error:', error);
        return false;
      }

      const isAdmin = !!(adminRecord && adminRecord.is_active === true);
      sessionStorage.setItem(`is_admin_${userEmail}`, String(isAdmin));
      return isAdmin;
    } catch (err) {
      console.warn('[visibility-guard] Admin bypass check exception:', err);
      return false;
    }
  }

  function renderAdminModeBanner(mode) {
    let existing = document.getElementById('admin-bypass-banner');
    if (existing) existing.remove();
    if (!mode || mode === 'public') return;

    const isMaint = mode === 'maintenance';
    const banner = document.createElement('div');
    banner.id = 'admin-bypass-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = `
      position: sticky;
      top: 0;
      z-index: 999999;
      width: 100%;
      background-color: ${isMaint ? '#1E1B13' : '#171426'};
      border-bottom: ${isMaint ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(124, 58, 237, 0.4)'};
      color: ${isMaint ? '#FBBF24' : '#C4B5FD'};
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      font-family: 'Manrope', system-ui, sans-serif;
      box-sizing: border-box;
    `;
    banner.innerHTML = `
      <span style="font-size: 14px;">${isMaint ? '🟠' : '🔒'}</span>
      <span style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
        ${isMaint ? 'Admin Mode' : 'Admin Preview'}
      </span>
      <span style="color: #E2E8F0; font-weight: 500;">
        — ${isMaint ? 'Portfolio is currently in Maintenance Mode. Visitors are seeing the Maintenance page.' : 'Portfolio is in Private Mode. Visitors see the Private Access page.'}
      </span>
    `;
    if (document.body) {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  function renderVisibilityUnavailable() {
    overlayNode.innerHTML = `
      <div class="vis-card err">
        <div class="vis-badge" style="color:#F87171;">Portfolio Unavailable</div>
        <h1 class="vis-title">Unable to verify portfolio access</h1>
        <p class="vis-desc">The portfolio visibility setting could not be loaded. For safety, public access is temporarily paused.</p>
        <button type="button" class="vis-btn" onclick="window.location.reload()">Retry</button>
      </div>
    `;
    injectOverlay();
  }

  const VISIBILITY_READY_TIMEOUT_MS = 4000;
  const VISIBILITY_READY_POLL_MS = 50;
  const SITE_MODE_REQUEST_TIMEOUT_MS = 2500;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function isSupabaseClientReady() {
    return Boolean(
      window.supabaseInstance ||
      (window.supabase && typeof window.supabase.createClient === 'function')
    );
  }

  function getPortfolioSettingsServiceIfReady() {
    const service = window.PortfolioSettingsService;
    if (!service || typeof service.getSiteMode !== 'function') {
      return null;
    }
    return isSupabaseClientReady() ? service : null;
  }

  async function waitForPortfolioSettingsService() {
    const deadline = Date.now() + VISIBILITY_READY_TIMEOUT_MS;
    let service = getPortfolioSettingsServiceIfReady();

    while (!service && Date.now() < deadline) {
      await wait(VISIBILITY_READY_POLL_MS);
      service = getPortfolioSettingsServiceIfReady();
    }

    if (!service) {
      if (!window.PortfolioSettingsService || typeof window.PortfolioSettingsService.getSiteMode !== 'function') {
        throw new Error('Portfolio settings service is unavailable.');
      }
      throw new Error('Supabase client was not ready before the visibility check timed out.');
    }

    return service;
  }

  async function loadSiteMode(service) {
    return Promise.race([
      service.getSiteMode(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Portfolio settings request timed out.')), SITE_MODE_REQUEST_TIMEOUT_MS))
    ]);
  }

  async function checkVisibility() {
    try {
      const service = await waitForPortfolioSettingsService();
      const isAdmin = await checkAdminBypass();
      if (isAdmin) {
        console.log('[visibility-guard] Authenticated administrator detected. Granting full portfolio bypass.');
        removeOverlay();
        const mode = await loadSiteMode(service);
        renderAdminModeBanner(mode);
        return;
      }

      const existingBanner = document.getElementById('admin-bypass-banner');
      if (existingBanner) existingBanner.remove();

      const mode = await loadSiteMode(service);

      if (mode === 'maintenance') {
        const client = (window.AuthService && window.AuthService.supabase) ||
          (window.supabase && window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY ? window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY) : null);
        let currentUser = null;
        if (client) {
          const { data: s } = await client.auth.getSession();
          currentUser = s?.session?.user || null;
        }

        let isAlreadySubscribed = false;
        let subscribedMsg = "";
        if (currentUser?.email && window.MaintenanceService && typeof window.MaintenanceService.checkSubscriptionStatus === 'function') {
          const check = await window.MaintenanceService.checkSubscriptionStatus(currentUser.email);
          isAlreadySubscribed = check.isSubscribed;
          subscribedMsg = check.message || "You're already subscribed! We'll notify you as soon as the portfolio is live again.";
        }

        const userContent = currentUser ? `
          <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; box-sizing:border-box;">
            <div style="display:flex; align-items:center; gap:12px; width:100%;">
              ${currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? `<img src="${currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}" style="width:38px; height:38px; border-radius:50%; border:2px solid #7C3AED; flex-shrink:0;" />` : `<div style="width:38px; height:38px; border-radius:50%; background:#7C3AED; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px; flex-shrink:0;">${(currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}</div>`}
              <div style="display:flex; flex-direction:column; text-align:left; overflow:hidden;">
                <span style="font-size:14px; font-weight:600; color:#F8FAFC; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Google User'}</span>
                <span style="font-size:12.5px; color:#94A3B8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentUser.email}</span>
              </div>
              <span style="margin-left:auto; font-size:11px; font-weight:700; color:#10B981; background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); padding:3px 8px; border-radius:12px; white-space:nowrap; flex-shrink:0;">✓ Signed in</span>
            </div>
            ${isAlreadySubscribed ? `
              <div style="width:100%; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:10px; padding:10px 14px; color:#F59E0B; font-size:13px; font-weight:600; line-height:1.4; text-align:center;">ℹ ${subscribedMsg}</div>
            ` : `
              <button id="maint-btn-submit" type="button" data-user-email="${currentUser.email}" onclick="window.handleMaintenanceNotifySubmit(event)" style="width:100%; padding:11px 16px; border-radius:10px; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; border:none; font-weight:600; font-size:13.5px; cursor:pointer; box-shadow:0 4px 14px rgba(124, 58, 237, 0.3);">Notify Me When Back Online</button>
              <div id="maint-error-feedback" style="display:none; font-size:12px; color:#EF4444; text-align:center; width:100%;"></div>
            `}
            <button type="button" onclick="window.AuthService && window.AuthService.signOut()" style="background:none; border:none; color:#94A3B8; font-size:12px; cursor:pointer; text-decoration:underline;">Not your account? Sign Out</button>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%;">
            <button id="maint-btn-google" type="button" class="maint-btn-google-primary" onclick="window.AuthService && window.AuthService.signInWithGoogle()" style="display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:13px 20px; border-radius:12px; background:#FFFFFF; color:#0F172A; font-weight:700; font-size:14.5px; cursor:pointer; width:100%; border:none; boxShadow:0 4px 16px rgba(255, 255, 255, 0.15); transition:all 0.2s ease; box-sizing:border-box;">
              <svg viewBox="0 0 24 24" width="18" height="18" style="flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Continue with Google
            </button>
          </div>
        `;

        overlayNode.innerHTML = `
          <div class="maint-bg-glow" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:750px; height:750px; background:radial-gradient(circle at center, rgba(124, 58, 237, 0.16) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%); pointer-events:none; filter:blur(60px); z-index:1;"></div>
          <div class="maint-split-container" style="position:relative; z-index:2; box-sizing:border-box;">
            
            <!-- LEFT SECTION (60%) -->
            <div class="maint-left-col" style="position:relative; width:100%; height:100vh; min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-start; text-align:left; padding:0; box-sizing:border-box; overflow:hidden;">
              <img class="maint-hero-cover-img" src="assets/images/Maintanance_Cover.png" alt="Portfolio Maintenance Illustration" style="position:absolute; top:0; left:0; width:100%; height:72%; object-fit:cover; object-position:center top; display:block; z-index:1; pointer-events:none;" />
              <div class="maint-hero-gradient" style="position:absolute; bottom:0; left:0; width:100%; height:55%; background:linear-gradient(to top, #06080F 25%, rgba(6, 8, 15, 0.85) 60%, transparent 100%); z-index:2; pointer-events:none;"></div>
              
              <div class="maint-left-content" style="position:relative; z-index:3; width:100%; padding:0 48px 44px 48px; display:flex; flex-direction:column; gap:16px; align-items:flex-start; box-sizing:border-box;">
                <div class="maint-badge" style="display:inline-flex; align-items:center; gap:8px; background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); border-radius:9999px; padding:6px 16px; font-size:11px; font-weight:700; color:#F59E0B; letter-spacing:0.08em; text-transform:uppercase;">
                  <span style="width:6px; height:6px; border-radius:50%; background-color:#F59E0B; box-shadow:0 0 6px #F59E0B;"></span>
                  <span>Maintenance Mode</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                  <h1 class="maint-title" style="margin:0; font-size:clamp(30px, 3.5vw, 42px); font-weight:800; color:#FFFFFF; letter-spacing:-0.02em; line-height:1.15;">Portfolio Under <span style="color:#C084FC;">Maintenance</span></h1>
                  <p class="maint-desc" style="margin:0; font-size:14.5px; color:#94A3B8; line-height:1.55; max-width:500px;">I'm currently working on exciting improvements, new projects, and a better experience. Thank you for your patience.</p>
                </div>
                <div class="maint-status-pill" style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:8px 18px; border-radius:9999px; font-size:13px; color:#94A3B8; font-weight:500;">
                  <span style="font-size:13px;">⏳</span>
                  <span>Expected to be back soon</span>
                </div>
              </div>
            </div>

            <!-- RIGHT SECTION (40%) -->
            <div class="maint-right-col-wrapper" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:40px 36px; box-sizing:border-box;">
              <div class="maint-right-col" style="background:rgba(12, 15, 26, 0.88); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(139, 92, 246, 0.28); border-radius:28px; padding:40px 32px; text-align:center; box-shadow:0 25px 60px -10px rgba(0,0,0,0.75), 0 0 50px rgba(124,58,237,0.14), inset 0 0 20px rgba(124,58,237,0.04); display:flex; flex-direction:column; align-items:center; gap:20px; max-width:460px; width:100%; box-sizing:border-box;">
                <div style="position:relative; display:flex; align-items:center; justify-content:center;">
                  <div class="maint-card-icon-outer" style="position:absolute; width:76px; height:76px; border-radius:50%; border:1px solid rgba(139, 92, 246, 0.25); pointer-events:none;"></div>
                  <div class="maint-card-icon-inner" style="position:relative; width:56px; height:56px; border-radius:50%; background:rgba(35, 22, 60, 0.75); border:1px solid rgba(139, 92, 246, 0.4); display:flex; align-items:center; justify-content:center; box-shadow:0 0 24px rgba(124, 58, 237, 0.3);">
                    <div style="position:absolute; top:1px; right:1px; width:5px; height:5px; border-radius:50%; background:#38BDF8; box-shadow:0 0 8px #38BDF8;"></div>
                    <div style="position:absolute; bottom:1px; left:1px; width:4px; height:4px; border-radius:50%; background:#C084FC; box-shadow:0 0 6px #C084FC;"></div>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#C084FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </div>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; align-items:center;">
                  <h2 class="maint-card-heading" style="margin:0; font-size:clamp(20px, 2.2vw, 24px); font-weight:700; color:#FFFFFF; letter-spacing:-0.02em; line-height:1.25;">Get notified<br /><span style="color:#C084FC;">when I'm back online</span></h2>
                  <p class="maint-card-subtext" style="margin:0; font-size:13px; color:#94A3B8; line-height:1.5; max-width:320px;">Sign in with your account and I'll let you know as soon as the portfolio is live again.</p>
                </div>
                <div id="maint-notify-wrapper" style="width:100%;">
                  ${userContent}
                </div>
                <div class="maint-benefits-grid" style="width:100%; display:grid; grid-template-columns:repeat(2, 1fr); gap:14px; background:rgba(10, 13, 22, 0.65); border:1px solid rgba(255, 255, 255, 0.06); border-radius:16px; padding:14px 16px; box-sizing:border-box;">
                  <div style="display:flex; align-items:center; gap:10px; text-align:left;">
                    <div style="width:36px; height:36px; border-radius:10px; background:rgba(124, 58, 237, 0.15); border:1px solid rgba(124, 58, 237, 0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C084FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:2px;">
                      <span style="color:#FFFFFF; font-size:13px; font-weight:600; line-height:1.2;">No Spam</span>
                      <span style="color:#64748B; font-size:11px; line-height:1.3;">Only important updates</span>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px; text-align:left;">
                    <div style="width:36px; height:36px; border-radius:10px; background:rgba(124, 58, 237, 0.15); border:1px solid rgba(124, 58, 237, 0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C084FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:2px;">
                      <span style="color:#FFFFFF; font-size:13px; font-weight:600; line-height:1.2;">Instant Update</span>
                      <span style="color:#64748B; font-size:11px; line-height:1.3;">Get notified first</span>
                    </div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; width:100%; gap:10px; color:#64748B; font-size:11.5px; font-weight:500; margin:2px 0;">
                  <div style="flex:1; height:1px; background:rgba(255,255,255,0.08);"></div>
                  <span>Or connect with me</span>
                  <div style="flex:1; height:1px; background:rgba(255,255,255,0.08);"></div>
                </div>
                <div class="maint-vis-social-container" style="display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; width:100%;">
                  <a href="#" data-social-key="linkedin" target="_blank" rel="noopener noreferrer" class="maint-vis-social-btn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
                  </a>
                  <a href="#" data-social-key="github" target="_blank" rel="noopener noreferrer" class="maint-vis-social-btn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> GitHub
                  </a>
                  <a href="#" data-social-key="email" class="maint-vis-social-btn">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Email
                  </a>
                </div>
              </div>
            </div>
        `;

      } else if (mode === 'private') {
        const client = (window.AuthService && window.AuthService.supabase) ||
          (window.supabase && window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY ? window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY) : null);
        let currentUser = null;
        if (client) {
          const { data: s } = await client.auth.getSession();
          currentUser = s?.session?.user || null;
        }

        if (currentUser?.email) {
          // Check if already authorized
          const verified = window.PrivateAccessService && typeof window.PrivateAccessService.verifyAccess === 'function' ? await window.PrivateAccessService.verifyAccess(currentUser.email) : { success: false };
          if (verified.success) {
            removeOverlay();
            return;
          } else {
            if (window.PrivateAccessService && typeof window.PrivateAccessService.clearSession === 'function') {
              window.PrivateAccessService.clearSession();
            }
          }
        } else {
          if (window.PrivateAccessService && typeof window.PrivateAccessService.clearSession === 'function') {
            window.PrivateAccessService.clearSession();
          }
        }

        let hasRequest = false;
        let latestStatus = "";
        let requestMsg = "";
        if (currentUser?.email && client) {
          const { data, error } = await client
            .from('access_requests')
            .select('request_status')
            .ilike('email', currentUser.email)
            .in('request_status', ['pending', 'approved'])
            .order('requested_at', { ascending: false });

          if (!error && data && data.length > 0) {
            latestStatus = data[0].request_status;
            if (latestStatus === 'approved') {
              hasRequest = false;
              requestMsg = "Your access is no longer active. You can request access again.";
            } else {
              hasRequest = true;
              requestMsg = "We've already received your request. You'll be notified once it has been reviewed.";
            }
          }
        }

        const userContent = currentUser ? `
          <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%; background:rgba(15, 23, 42, 0.6); border:1px solid rgba(255, 255, 255, 0.1); border-radius:16px; padding:20px; box-sizing:border-box;">
            <div style="display:flex; align-items:center; gap:12px; width:100%;">
              ${currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture ? `<img src="${currentUser.user_metadata.avatar_url || currentUser.user_metadata.picture}" style="width:42px; height:42px; border-radius:50%; border:2px solid #7C3AED;" />` : `<div style="width:42px; height:42px; border-radius:50%; background:#7C3AED; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700;">${(currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0).toUpperCase()}</div>`}
              <div style="display:flex; flex-direction:column; text-align:left;">
                <span style="font-size:14.5px; font-weight:700; color:#F8FAFC;">👤 ${currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Google User'}</span>
                <span style="font-size:13px; color:#94A3B8;">${currentUser.email}</span>
              </div>
              <span style="margin-left:auto; font-size:11px; font-weight:700; color:#10B981; background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); padding:3px 8px; border-radius:12px; white-space:nowrap;">✓ Signed in</span>
            </div>
            ${latestStatus === 'approved' ? `
              <div style="width:100%; background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.3); border-radius:10px; padding:12px; color:#EF4444; font-size:13px; font-weight:600; line-height:1.5; text-align:left;">ℹ ${requestMsg}</div>
              <button id="priv-btn-submit" type="button" onclick="window.handlePrivateRequestAccessClick(event)" style="width:100%; padding:12px; border-radius:10px; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; border:none; font-weight:600; font-size:14px; cursor:pointer; box-shadow:0 4px 14px rgba(124, 58, 237, 0.3);">Request Access</button>
            ` : hasRequest ? `
              <div style="width:100%; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:10px; padding:12px; color:#F59E0B; font-size:13px; font-weight:600; line-height:1.5; text-align:left;">ℹ ${requestMsg}</div>
            ` : `
              <button id="priv-btn-submit" type="button" onclick="window.handlePrivateRequestAccessClick(event)" style="width:100%; padding:12px; border-radius:10px; background:linear-gradient(135deg, #7C3AED, #6D28D9); color:#FFF; border:none; font-weight:600; font-size:14px; cursor:pointer; box-shadow:0 4px 14px rgba(124, 58, 237, 0.3);">Request Access</button>
            `}
            <button type="button" onclick="window.handlePrivateSignOut(event)" style="background:none; border:none; color:#94A3B8; font-size:12px; cursor:pointer; text-decoration:underline;">Not your account? Sign Out</button>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; align-items:center; gap:12px; width:100%;">
            <button id="priv-btn-google" type="button" onclick="window.AuthService && window.AuthService.signInWithGoogle()" style="display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:12px 24px; border-radius:12px; background:#FFFFFF; color:#0F172A; border:none; font-weight:600; font-size:14px; cursor:pointer; width:100%; box-shadow:0 4px 14px rgba(0,0,0,0.2);">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Continue with Google
            </button>
          </div>
        `;

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
            </div>
            <div id="priv-action-wrapper" style="width:100%; display:flex; flex-direction:column; gap:12px; margin-top:4px;">
              ${userContent}
            </div>
            <div style="width:100%; height:1px; background:rgba(255, 255, 255, 0.08); margin:4px 0;"></div>
            <div style="display:flex; align-items:center; justify-content:center; gap:20px;">
              <a href="#" data-social-key="linkedin" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> LinkedIn
              </a>
              <a href="#" data-social-key="github" target="_blank" rel="noopener noreferrer" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> GitHub
              </a>
              <a href="#" data-social-key="email" style="color:#94A3B8; font-size:13px; font-weight:500; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
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
      console.warn('[visibility-guard] Visibility check failed closed:', err);
      renderVisibilityUnavailable();
    }
  }

  window.handleMaintenanceNotifySubmit = async function (e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('maint-btn-submit');
    const wrapper = document.getElementById('maint-notify-wrapper');
    const errBox = document.getElementById('maint-error-feedback');

    if (!btn || !wrapper) return;
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }

    const email = (btn.getAttribute('data-user-email') || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errBox) {
        errBox.textContent = 'Invalid account email address.';
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

  window.handlePrivateContinueSubmit = async function (e) {
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

  window.handlePrivateRequestAccessClick = function (e) {
    if (e) e.preventDefault();
    window.handlePrivateRequestAccess();
  };

  window.handlePrivateSignOut = async function (e) {
    if (e) e.preventDefault();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem('portfolio_private_session');
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('is_admin_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      if (window.AuthService && typeof window.AuthService.signOut === 'function') {
        await window.AuthService.signOut();
      }
    } catch (err) {
      console.error('[visibility-guard] Sign out error:', err);
    }
  };

  window.handlePrivateRequestAccess = async function () {
    const existing = document.getElementById('priv-req-modal');
    if (existing) existing.remove();

    const client = (window.AuthService && window.AuthService.supabase) ||
      (window.supabase && window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY ? window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY) : null);
    let currentUser = null;
    if (client) {
      const { data: s } = await client.auth.getSession();
      currentUser = s?.session?.user || null;
    }

    const nameVal = (currentUser && (currentUser.user_metadata?.full_name || currentUser.user_metadata?.name)) || "";
    const emailVal = (currentUser && currentUser.email) || "";

    const modal = document.createElement('div');
    modal.id = 'priv-req-modal';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:999999; padding:20px; box-sizing:border-box; font-family:"Manrope", sans-serif;';
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
              <input id="req-modal-name" type="text" required value="${nameVal}" placeholder="Jane Doe" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Email Address *</label>
              <input id="req-modal-email" type="email" required readOnly value="${emailVal}" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.4); border:1px solid rgba(255,255,255,0.08); color:#94A3B8; font-size:13px; outline:none; cursor:not-allowed;" title="Email is populated from Google session and cannot be changed." />
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Company (Optional)</label>
              <input id="req-modal-company" type="text" placeholder="e.g. Acme Corp" style="padding:10px 12px; border-radius:8px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); color:#FFF; font-size:13px; outline:none;" />
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
              <label style="font-size:12px; font-weight:600; color:#CBD5E1;">Job Title (Optional)</label>
              <input id="req-modal-title" type="text" placeholder="e.g. Senior Recruiter" style="padding:10px 12px; border-radius:8px; background:rgba(15, 23, 42, 0.6); border:1px solid rgba(255, 255, 255, 0.12); color:#FFF; font-size:13px; outline:none;" />
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

  window.handleAccessRequestSubmit = async function (e) {
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

        // Update main card state
        const wrapper = document.getElementById('priv-action-wrapper');
        if (wrapper) {
          wrapper.innerHTML = `
            <div style="background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:16px; color:#10B981; font-size:13.5px; font-weight:600; line-height:1.5;">
              ✓ Your access request has been submitted successfully. We'll review it and notify you once it's approved.
            </div>
          `;
        }

        setTimeout(() => {
          const modalNode = document.getElementById('priv-req-modal');
          if (modalNode) modalNode.remove();
        }, 2500);
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

  // Subscribe to auth state changes to re-evaluate visibility immediately on SIGNED_IN / SIGNED_OUT
  try {
    const client = (window.AuthService && window.AuthService.supabase) ||
      (window.supabase && window.APP_CONFIG?.SUPABASE_URL && window.APP_CONFIG?.SUPABASE_ANON_KEY ? window.supabase.createClient(window.APP_CONFIG.SUPABASE_URL, window.APP_CONFIG.SUPABASE_ANON_KEY) : null);
    if (client && client.auth) {
      client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          console.log('[visibility-guard] Admin signed out. Immediately revoking bypass and re-checking visibility.');
          injectOverlay();
          checkVisibility();
        } else if (event === 'SIGNED_IN') {
          checkVisibility();
        }
      });
    }
  } catch (authSubErr) {
    console.warn('[visibility-guard] Auth state listener error:', authSubErr);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkVisibility);
  } else {
    checkVisibility();
  }
})();

