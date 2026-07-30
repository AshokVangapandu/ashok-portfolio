/**
 * js/components/share-experience.js
 * Modular Custom Elements for the "Share Your Experience" functionality.
 * 
 * Reusable Components registered:
 * - <share-experience-card>
 * - <modal-overlay>
 * - <share-experience-modal>
 * - <rating-selector>
 * - <textarea-field>
 */

/* Uses global showToast from toast.js */

// Helper utility to apply the portfolio's magnetic button effect to dynamically added elements
const initMagnetic = (item) => {
  if (!item) return;
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = x - rect.width / 2;
    const centerY = y - rect.height / 2;

    item.style.setProperty("--tx", `${centerX * 0.1}px`);
    item.style.setProperty("--ty", `${centerY * 0.14}px`);
    item.style.setProperty("--local-x", `${x}px`);
    item.style.setProperty("--local-y", `${y}px`);
  }, { passive: true });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--tx", "0px");
    item.style.setProperty("--ty", "0px");
    item.style.removeProperty("--local-x");
    item.style.removeProperty("--local-y");
  });
};

// Word counter utility counting sequence of non-whitespace characters
const getWordCount = (text) => {
  const trimmed = text ? text.trim() : "";
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

/**
 * Component: ShareExperienceCard
 * Compact card placed in the Wall of Love section.
 */
class ShareExperienceCard extends HTMLElement {
  connectedCallback() {
    this.className = "share-experience-card-container";
    this.innerHTML = `
      <div class="heard-cta-panel">
        <div class="cta-left-decor">
          <div class="cta-orbit-ring ring-outer"></div>
          <div class="cta-orbit-ring ring-middle"></div>
          <div class="cta-orbit-ring ring-inner"></div>
          <div class="cta-icon-center">
            <svg viewBox="0 0 24 24" class="cta-msg-icon" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </div>
        </div>
        
        <div class="cta-middle-copy">
          <h4>Worked with me?</h4>
          <p>Share your experience and add your story to the Wall of Love.</p>
        </div>
        
        <div class="cta-right-action">
          <button type="button" class="profile-action profile-action-primary heard-cta-btn magnetic" id="open-share-modal-btn">
            <span>Share Your Experience</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" class="cta-arrow-icon">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <span class="cta-meta-text">Testimonials are reviewed before publishing.</span>
        </div>
      </div>
    `;

    const btn = this.querySelector("#open-share-modal-btn");
    initMagnetic(btn);

    btn?.addEventListener("click", () => {
      // Open the modal by instantiating the ModalOverlay
      let overlay = document.querySelector("modal-overlay");
      if (!overlay) {
        overlay = document.createElement("modal-overlay");
        document.body.appendChild(overlay);
      }
      overlay.open();
    });
  }
}
customElements.define("share-experience-card", ShareExperienceCard);


/* Rating Selector Component Removed */


/**
 * Component: TextAreaField
 * Testimonial text input with live word counter and helper text.
 */
class TextAreaField extends HTMLElement {
  connectedCallback() {
    this.className = "textarea-field-container";
    const maxWords = 300;
    const isDisabled = this.getAttribute("disabled-textarea") === "true";

    this.innerHTML = `
      <div class="textarea-wrapper">
        <textarea id="testimonial-text" name="testimonial" placeholder="Ashok was incredible to work with because..." required ${isDisabled ? 'disabled' : ''}></textarea>
        <div class="textarea-footer">
          <span class="textarea-helper">Recommended: 50–150 words &bull; Maximum: 300 words</span>
        </div>
      </div>
    `;

    const textarea = this.querySelector("textarea");
    
    // Find the counter in the testimonial header row
    const getCounterElements = () => {
      const counterEl = this.closest("share-experience-modal")?.querySelector("#current-word-count") || 
                        document.querySelector("#current-word-count");
      return {
        counter: counterEl,
        wrapper: counterEl?.closest(".char-counter")
      };
    };

    const updateWordCount = () => {
      if (!textarea) return;
      const { counter, wrapper } = getCounterElements();
      const words = getWordCount(textarea.value);
      if (counter) counter.textContent = words;
      if (words > maxWords) {
        wrapper?.classList.add("limit-reached");
      } else {
        wrapper?.classList.remove("limit-reached");
      }
    };

    if (!isDisabled && textarea) {
      textarea.addEventListener("input", updateWordCount);
    }
  }

  get value() {
    return this.querySelector("textarea")?.value || "";
  }

  set value(val) {
    const textarea = this.querySelector("textarea");
    if (textarea) {
      textarea.value = val;
      const counterEl = this.closest("share-experience-modal")?.querySelector("#current-word-count") || 
                        document.querySelector("#current-word-count");
      const wrapper = counterEl?.closest(".char-counter");
      const words = getWordCount(val);
      if (counterEl) counterEl.textContent = words;
      if (words > 300) {
        wrapper?.classList.add("limit-reached");
      } else {
        wrapper?.classList.remove("limit-reached");
      }
    }
  }
}
customElements.define("textarea-field", TextAreaField);


/**
 * Component: ModalOverlay
 * Background backdrop with transitions and overlay controls.
 */
class ModalOverlay extends HTMLElement {
  connectedCallback() {
    this.className = "modal-overlay-container";
    this.setAttribute("data-lenis-prevent", "true");
    this.innerHTML = `<share-experience-modal></share-experience-modal>`;

    // Close when clicking directly on overlay (not child modal)
    this.addEventListener("pointerdown", (event) => {
      if (event.target === this) {
        this.close();
      }
    });

    // ESC key listener handler bind
    this.escHandler = (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    };
  }

  open() {
    document.body.classList.add("modal-open");
    this.classList.add("is-visible");
    
    // Stop Lenis smooth scrolling to lock page scroll
    if (window.lenis) {
      window.lenis.stop();
    }

    // Attach global ESC key listener
    window.addEventListener("keydown", this.escHandler);
    
    // Trigger animations inside the modal container
    const modal = this.querySelector("share-experience-modal");
    modal?.animateIn();
  }

  close() {
    const modal = this.querySelector("share-experience-modal");
    modal?.animateOut(() => {
      this.classList.remove("is-visible");
      document.body.classList.remove("modal-open");
      
      // Resume Lenis smooth scrolling
      if (window.lenis) {
        window.lenis.start();
      }

      window.removeEventListener("keydown", this.escHandler);
    });
  }
}
customElements.define("modal-overlay", ModalOverlay);


/**
 /**
 * Component: ShareExperienceModal
 * Form container, Auth state flow, Validation, and State structure.
 */
class ShareExperienceModal extends HTMLElement {
  constructor() {
    super();
    // User profile state model
    this.userState = {
      isAuthenticated: false,
      provider: "",
      name: "",
      email: "",
      avatar: ""
    };
    this.isLoading = false;
    this.popoverOpen = false;
  }

  async connectedCallback() {
    this.className = "share-modal";

    if (window.AuthService) {
      console.log("[Auth] Checking initial session...");
      const user = await window.AuthService.getCurrentUser();
      if (user) {
        console.log("[Auth] Session restored:", user.email);
      } else {
        console.log("[Auth] No active session found on load");
      }
      this.handleUserChange(user);

      // Listen for auth changes
      this.authSubscription = window.AuthService.onAuthStateChange((event, session) => {
        console.log("[Auth] Auth state changed event:", event, "User:", session?.user?.email);
        this.handleUserChange(session?.user || null);
      });
    }

    // Listen for messages from popup window callback
    this.messageHandler = async (event) => {
      if (event.origin !== window.location.origin && event.origin !== "null") {
        console.warn("[Auth] Mismatch on message origin:", event.origin);
        return;
      }

      if (event.data?.type === 'supabase-oauth-callback') {
        console.log("[Auth] Returned from Google. Status:", event.data.status);
        if (event.data.status === 'success') {
          console.log("[Auth] User loaded. Configuring session...");
          try {
            const { data, error } = await window.AuthService.setSession(event.data.hash);
            if (error) throw error;
            console.log("[Auth] Session restored successfully.");
            this.isLoading = false;
            
            // Retrieve current user and render immediately
            const user = await window.AuthService.getCurrentUser();
            this.handleUserChange(user);
          } catch (e) {
            console.error("[Auth] Session configuration error:", e);
            this.isLoading = false;
            showToast("error", "Authentication Failed", e.message || "Failed to configure user session.");
            this.render();
          }
        } else {
          console.error("[Auth] Google OAuth flow failed or returned an error.");
          this.isLoading = false;
          showToast("error", "Authentication Failed", "Google sign-in was not successful.");
          this.render();
        }
      }
    };
    window.addEventListener('message', this.messageHandler);

    // Global outside click listener to close popover
    this.globalClickListener = (event) => {
      const popover = this.querySelector("#account-popover");
      const menuBtn = this.querySelector("#avatar-menu-btn");
      if (this.popoverOpen && popover && menuBtn && !popover.contains(event.target) && !menuBtn.contains(event.target)) {
        this.closePopover();
      }
    };
    window.addEventListener("pointerdown", this.globalClickListener);

    // Global Escape key listener to close popover
    this.globalKeydownListener = (event) => {
      if (event.key === "Escape" && this.popoverOpen) {
        this.closePopover();
        event.stopPropagation();
      }
    };
    window.addEventListener("keydown", this.globalKeydownListener, { capture: true });

    this.render();
  }

  disconnectedCallback() {
    if (this.authSubscription) {
      if (typeof this.authSubscription.unsubscribe === 'function') {
        this.authSubscription.unsubscribe();
      } else if (this.authSubscription.data?.subscription) {
        this.authSubscription.data.subscription.unsubscribe();
      }
    }
    window.removeEventListener('message', this.messageHandler);
    if (this.popupInterval) clearInterval(this.popupInterval);

    // Clean up popover global window listeners
    window.removeEventListener("pointerdown", this.globalClickListener);
    window.removeEventListener("keydown", this.globalKeydownListener, { capture: true });
  }

  async checkAuthSession() {
    if (!window.AuthService) return;
    try {
      const user = await window.AuthService.getCurrentUser();
      this.isLoading = false;
      this.handleUserChange(user);
    } catch (e) {
      this.isLoading = false;
      showToast("error", "Session Error", "Could not retrieve user session.");
      this.render();
    }
  }

  handleUserChange(user) {
    if (user) {
      console.log("[Auth] User loaded:", user.email);
      this.userState = {
        isAuthenticated: true,
        userId: user.id,
        provider: "google",
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        email: user.email,
        avatar: user.user_metadata?.avatar_url || ""
      };
    } else {
      console.log("[Auth] Clear auth states (User signed out or no session)");
      this.userState = {
        isAuthenticated: false,
        userId: "",
        provider: "",
        name: "",
        email: "",
        avatar: ""
      };
    }
    this.render();
  }

  togglePopover() {
    this.popoverOpen = !this.popoverOpen;
    const popover = this.querySelector("#account-popover");
    const menuBtn = this.querySelector("#avatar-menu-btn");
    
    if (popover) {
      if (this.popoverOpen) {
        popover.classList.add("is-open");
        popover.setAttribute("aria-hidden", "false");
        menuBtn?.setAttribute("aria-expanded", "true");
        this.querySelector("#popover-logout-btn")?.focus();
      } else {
        popover.classList.remove("is-open");
        popover.setAttribute("aria-hidden", "true");
        menuBtn?.setAttribute("aria-expanded", "false");
      }
    }
  }

  closePopover() {
    if (this.popoverOpen) {
      this.popoverOpen = false;
      const popover = this.querySelector("#account-popover");
      const menuBtn = this.querySelector("#avatar-menu-btn");
      if (popover) {
        popover.classList.remove("is-open");
        popover.setAttribute("aria-hidden", "true");
      }
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    }
  }

  async handleGoogleSignIn() {
    console.log("[Auth] Google button clicked");
    if (!window.AuthService) {
      console.error("[Auth] AuthService is not initialized.");
      showToast("error", "Configuration Error", "AuthService is not initialized.");
      return;
    }

    console.log("[Auth] OAuth request started");
    this.isLoading = true;
    this.render();

    try {
      const { data, error } = await window.AuthService.signInWithGoogle();
      if (error) throw error;

      if (data?.url) {
        const width = 520;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        console.log("[Auth] Redirecting to Google. Opening Popup:", data.url);
        const authPopup = window.open(
          data.url,
          'Google Auth',
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
        );

        if (this.popupInterval) clearInterval(this.popupInterval);
        this.popupInterval = setInterval(() => {
          if (!authPopup || authPopup.closed) {
            clearInterval(this.popupInterval);
            setTimeout(() => {
              if (this.isLoading && !this.userState.isAuthenticated) {
                console.log("[Auth] Google sign-in cancelled or popup closed manually");
                this.isLoading = false;
                showToast("error", "Login Cancelled", "Google sign-in popup was closed.");
                this.render();
              }
            }, 500);
          }
        }, 800);
      } else {
        throw new Error("No URL returned from Supabase OAuth request.");
      }
    } catch (err) {
      console.error("[Auth] Google Auth Error:", err);
      this.isLoading = false;
      showToast("error", "Authentication Failed", err.message || "An error occurred during Google sign-in.");
      this.render();
    }
  }

  async handleSignOut() {
    console.log("[Auth] User clicked Sign Out");
    if (!window.AuthService) return;
    this.isLoading = true;
    this.render();
    try {
      const { error } = await window.AuthService.signOut();
      if (error) throw error;
      console.log("[Auth] Sign out complete");
      showToast("success", "Signed Out", "You have successfully signed out.");
    } catch (err) {
      console.error("[Auth] Sign Out Error:", err);
      showToast("error", "Sign Out Failed", err.message || "An error occurred during sign out.");
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  render() {
    if (this.submitted) {
      this.renderSuccess();
      return;
    }

    // 1. Render static template elements if they do not exist
    if (!this.querySelector("#share-experience-form")) {
      this.renderInitialLayout();
    }

    // 2. Update dynamic class transitions and profile details
    this.updateUIState();
  }

  renderInitialLayout() {
    this.innerHTML = `
      <style>
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .form-group label {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .testimonial-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 8px;
        }
        .testimonial-header-row label {
          margin: 0 !important;
        }
        .testimonial-header-row .char-counter {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .testimonial-header-row .char-counter.limit-reached {
          color: #ff6565 !important;
        }

        /* Progressive Authentication Flow Styles */
        .modal-header-container {
          display: flex;
          align-items: center;
          gap: 0;
          transition: gap 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .modal-header-container.has-avatar {
          gap: 18px;
        }
        .google-avatar-header {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(143, 133, 255, 0.34);
          object-fit: cover;
          opacity: 0;
          transform: scale(0.5) rotate(-20deg);
          transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          flex-shrink: 0;
        }
        .modal-header-container.has-avatar .google-avatar-header {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        .modal-header-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-prompt-wrapper {
          max-height: 300px;
          opacity: 1;
          transition: max-height 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, margin 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          overflow: hidden;
        }
        .state-authenticated .auth-prompt-wrapper {
          max-height: 0;
          opacity: 0;
          margin: 0;
          padding: 0;
          pointer-events: none;
        }

        .form-wrapper-authenticated {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          transform: translateY(20px);
          transition: max-height 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .state-authenticated .form-wrapper-authenticated {
          max-height: 1200px;
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        /* Avatar Menu Button and Popover Dropdown */
        .avatar-menu-btn {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .avatar-menu-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(143, 133, 255, 0.4);
        }
        .avatar-menu-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(143, 133, 255, 0.6);
        }

        .avatar-slot {
          position: relative;
        }

        .account-popover {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          z-index: 1000;
          width: 260px;
          background: #0f1322;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
          transform-origin: top left;
          transition: opacity 200ms cubic-bezier(0.25, 1, 0.5, 1), transform 200ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .account-popover.is-open {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        .popover-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .popover-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(143, 133, 255, 0.3);
          object-fit: cover;
        }

        .popover-avatar.avatar-fallback {
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
        }

        .popover-user-details {
          display: flex;
          flex-direction: column;
          text-align: left;
          overflow: hidden;
        }

        .popover-name {
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .popover-email {
          color: rgba(255, 255, 255, 0.45);
          font-size: 11.5px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .popover-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 4px 0;
        }

        .popover-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 8px;
          text-align: left;
          transition: background-color 200ms, color 200ms;
          outline: none;
        }

        .popover-logout-btn:hover,
        .popover-logout-btn:focus-visible {
          background-color: rgba(255, 255, 255, 0.04);
          color: #ff6565;
        }
      </style>

      <button type="button" class="close-modal-btn" aria-label="Close modal">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="modal-header-container" id="modal-header-container">
        <div class="avatar-slot" id="avatar-slot"></div>
        <div class="modal-header-text">
          <h2 class="modal-title">Share Your Experience</h2>
          <p class="modal-subtitle">Leave a testimonial about our collaboration</p>
        </div>
      </div>

      <div class="modal-body-container state-unauthenticated" id="modal-body-container">
        <div class="auth-prompt-wrapper">
          <div class="auth-prompt">
            <p class="auth-prompt-text">To prevent spam, please authenticate with your Google account first.</p>
            <button type="button" class="google-auth-btn" id="google-auth-btn">
              <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.5 3.77v3.13h4.05c2.37-2.18 3.73-5.39 3.73-8.75z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.05-3.13c-1.12.75-2.56 1.2-3.91 1.2-3.02 0-5.58-2.04-6.5-4.79H1.31v3.23A12 12 0 0 0 12 24z"/>
                <path fill="#FBBC05" d="M5.5 14.37a7.24 7.24 0 0 1 0-4.74V6.4H1.31a12 12 0 0 0 0 11.2l4.19-3.23z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.31 0 3.28 2.69 1.31 6.41l4.19 3.23c.92-2.75 3.48-4.79 6.5-4.79z"/>
              </svg>
              <span id="google-btn-text">Continue with Google</span>
            </button>
          </div>
        </div>

        <div class="form-wrapper-authenticated">
          <form class="share-form" id="share-experience-form" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="role-designation">Role / Designation <span class="label-required">*</span></label>
                <div class="input-wrapper">
                  <input type="text" id="role-designation" name="designation" placeholder="Senior Software Engineer" required>
                  <span class="field-error-msg" id="designation-error"></span>
                </div>
              </div>

              <div class="form-group">
                <label for="company-org">Company / Organization <span class="label-optional">(Optional)</span></label>
                <div class="input-wrapper">
                  <input type="text" id="company-org" name="company" placeholder="Company name">
                  <span class="field-error-msg" id="company-error"></span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="linkedin-url">LinkedIn Profile URL <span class="label-optional">(Optional)</span></label>
              <div class="input-wrapper">
                <input type="url" id="linkedin-url" name="linkedin" placeholder="https://linkedin.com/in/username">
                <span class="field-error-msg" id="linkedin-error"></span>
              </div>
            </div>

            <div class="form-group">
              <label>Rating <span class="label-required">*</span></label>
              <div class="rating-input-container">
                <input type="hidden" id="testimonial-rating" name="rating" value="">
                <div class="rating-stars" role="radiogroup" aria-label="Rating select">
                  <button type="button" class="rating-star-btn" data-value="1" aria-label="1 star">★</button>
                  <button type="button" class="rating-star-btn" data-value="2" aria-label="2 stars">★</button>
                  <button type="button" class="rating-star-btn" data-value="3" aria-label="3 stars">★</button>
                  <button type="button" class="rating-star-btn" data-value="4" aria-label="4 stars">★</button>
                  <button type="button" class="rating-star-btn" data-value="5" aria-label="5 stars">★</button>
                </div>
                <span class="field-error-msg" id="rating-error"></span>
              </div>
            </div>

            <div class="form-group">
              <div class="testimonial-header-row">
                <label for="testimonial-text">Your Testimonial</label>
                <span class="char-counter" id="testimonial-word-counter"><span id="current-word-count">0</span> / 300 words</span>
              </div>
              <textarea-field id="form-testimonial"></textarea-field>
              <span class="field-error-msg" id="testimonial-error"></span>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="consent-check" name="consent" required>
                <span class="custom-checkbox"></span>
                <span class="checkbox-text">I agree that my testimonial may be displayed publicly.</span>
              </label>
              <span class="field-error-msg" id="consent-error"></span>
            </div>

            <button type="submit" class="profile-action profile-action-primary submit-form-btn magnetic">
              <span>Submit Testimonial</span>
            </button>
          </form>
        </div>
      </div>
    `;

    const closeBtn = this.querySelector(".close-modal-btn");
    const googleBtn = this.querySelector("#google-auth-btn");
    
    initMagnetic(closeBtn);
    
    closeBtn?.addEventListener("click", () => {
      this.closest("modal-overlay")?.close();
    });

    googleBtn?.addEventListener("click", () => {
      this.handleGoogleSignIn();
    });

    this.setupFormHandlers();
  }

  updateUIState() {
    const isAuthed = this.userState.isAuthenticated;
    const bodyContainer = this.querySelector("#modal-body-container");
    const headerContainer = this.querySelector("#modal-header-container");
    const avatarSlot = this.querySelector("#avatar-slot");
    const googleBtn = this.querySelector("#google-auth-btn");
    const googleBtnText = this.querySelector("#google-btn-text");

    // 1. Toggle authentication body state classes
    if (bodyContainer) {
      if (isAuthed) {
        bodyContainer.classList.remove("state-unauthenticated");
        bodyContainer.classList.add("state-authenticated");
      } else {
        bodyContainer.classList.remove("state-authenticated");
        bodyContainer.classList.add("state-unauthenticated");
      }
    }

    // 2. Toggle header layout and fill avatar details
    if (headerContainer) {
      if (isAuthed) {
        headerContainer.classList.add("has-avatar");
      } else {
        headerContainer.classList.remove("has-avatar");
      }
    }

    if (avatarSlot) {
      if (isAuthed) {
        // Construct the interactive avatar menu button and dropdown popover
        const avatarImageHtml = this.userState.avatar
          ? `<img src="${this.userState.avatar}" alt="${this.userState.name}" class="google-avatar-header" />`
          : `<div class="google-avatar-header avatar-fallback">${this.userState.name.substring(0, 2).toUpperCase()}</div>`;

        avatarSlot.innerHTML = `
          <button type="button" class="avatar-menu-btn" id="avatar-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="Account menu">
            ${avatarImageHtml}
          </button>
          
          <div class="account-popover" id="account-popover" aria-hidden="true">
            <div class="popover-user-info">
              ${this.userState.avatar 
                ? `<img src="${this.userState.avatar}" alt="${this.userState.name}" class="popover-avatar" />`
                : `<div class="popover-avatar avatar-fallback">${this.userState.name.substring(0, 2).toUpperCase()}</div>`}
              <div class="popover-user-details">
                <span class="popover-name">${this.userState.name}</span>
                <span class="popover-email">${this.userState.email}</span>
              </div>
            </div>
            <div class="popover-divider"></div>
            <button type="button" class="popover-logout-btn" id="popover-logout-btn">
              <span class="logout-icon">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        `;

        // Wire event listeners on the newly rendered nodes
        const menuBtn = avatarSlot.querySelector("#avatar-menu-btn");
        menuBtn?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.togglePopover();
        });

        const logoutBtn = avatarSlot.querySelector("#popover-logout-btn");
        logoutBtn?.addEventListener("click", () => {
          this.closePopover();
          this.handleSignOut();
        });
      } else {
        avatarSlot.innerHTML = '';
        this.popoverOpen = false;
      }
    }

    // 3. Update loading spinner on oauth trigger
    if (googleBtnText) {
      googleBtnText.textContent = this.isLoading ? "Connecting to Google..." : "Continue with Google";
    }

    if (googleBtn) {
      googleBtn.disabled = this.isLoading;
      const spinner = googleBtn.querySelector(".auth-spinner");
      if (this.isLoading && !spinner) {
        const spinnerEl = document.createElement("span");
        spinnerEl.className = "auth-spinner";
        googleBtn.insertBefore(spinnerEl, googleBtn.firstChild);
      } else if (!this.isLoading && spinner) {
        spinner.remove();
      }
    }

    // 4. Toggle disabled state on form inputs
    this.setFormDisabled(!isAuthed || this.isLoading);
  }

  renderAuthState() {
    // Stubbed method since progressive layouts handle this directly
  }

  setFormDisabled(disabled) {
    const form = this.querySelector("#share-experience-form");
    if (!form) return;

    const submitBtn = form.querySelector(".submit-form-btn");
    const linkedinInput = form.querySelector("#linkedin-url");
    const designationInput = form.querySelector("#role-designation");
    const companyInput = form.querySelector("#company-org");
    const starBtns = form.querySelectorAll(".rating-star-btn");
    const testimonialComp = form.querySelector("#form-testimonial");
    const testimonialTextarea = testimonialComp ? testimonialComp.querySelector("textarea") : null;
    const consentCheck = form.querySelector("#consent-check");

    if (disabled) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="auth-spinner"></span>
          <span>Submitting...</span>
        `;
      }
      if (linkedinInput) linkedinInput.disabled = true;
      if (designationInput) designationInput.disabled = true;
      if (companyInput) companyInput.disabled = true;
      starBtns.forEach(btn => btn.disabled = true);
      if (testimonialTextarea) testimonialTextarea.disabled = true;
      if (consentCheck) consentCheck.disabled = true;
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Testimonial</span>`;
      }
      if (linkedinInput) linkedinInput.disabled = false;
      if (designationInput) designationInput.disabled = false;
      if (companyInput) companyInput.disabled = false;
      starBtns.forEach(btn => btn.disabled = false);
      if (testimonialTextarea) testimonialTextarea.disabled = false;
      if (consentCheck) consentCheck.disabled = false;
    }
  }

  setupFormHandlers() {
    const form = this.querySelector("#share-experience-form");
    if (!form) return;

    const ratingInput = this.querySelector("#testimonial-rating");
    const starBtns = this.querySelectorAll(".rating-star-btn");
    
    starBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-value");
        if (ratingInput) ratingInput.value = val;
        
        starBtns.forEach(b => {
          const starVal = b.getAttribute("data-value");
          if (parseInt(starVal) <= parseInt(val)) {
            b.classList.add("is-selected");
          } else {
            b.classList.remove("is-selected");
          }
        });
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      
      if (!this.userState.isAuthenticated || !this.userState.userId) {
        showToast("error", "Authentication Required", "Please sign in with Google to submit a testimonial.", 4000);
        return;
      }

      this.clearErrors();

      const designationInput = this.querySelector("#role-designation");
      const designationVal = designationInput ? designationInput.value.trim() : "";
      
      const companyInput = this.querySelector("#company-org");
      const companyVal = companyInput ? companyInput.value.trim() : "";

      const ratingVal = ratingInput ? ratingInput.value : "";

      const linkedinInput = this.querySelector("#linkedin-url");
      const linkedinVal = linkedinInput.value.trim();
      
      const testimonialComp = this.querySelector("#form-testimonial");
      const testimonialVal = testimonialComp ? testimonialComp.value.trim() : "";
      
      const consentCheck = this.querySelector("#consent-check");
      const consentVal = consentCheck ? consentCheck.checked : false;

      let hasError = false;

      if (!designationVal) {
        this.showError("designation", "Please enter your Role / Designation.");
        hasError = true;
      }

      if (linkedinVal) {
        const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
        if (!linkedinRegex.test(linkedinVal)) {
          this.showError("linkedin", "Please enter a valid LinkedIn profile URL.");
          hasError = true;
        }
      }

      if (!ratingVal) {
        this.showError("rating", "Please select a rating.");
        hasError = true;
      } else {
        const r = parseInt(ratingVal);
        if (isNaN(r) || r < 1 || r > 5) {
          this.showError("rating", "Please select a rating between 1 and 5.");
          hasError = true;
        }
      }

      const wordCount = getWordCount(testimonialVal);
      if (!testimonialVal) {
        this.showError("testimonial", "Please share a short testimonial of your experience.");
        hasError = true;
      } else if (testimonialVal.length < 10) {
        this.showError("testimonial", "Your testimonial is a bit short. Please write at least 10 characters.");
        hasError = true;
      } else if (wordCount > 300) {
        this.showError("testimonial", "Your testimonial cannot exceed 300 words.");
        hasError = true;
      }

      if (!consentVal) {
        this.showError("consent", "Consent is required to publish testimonials.");
        hasError = true;
      }

      if (hasError) return;

      const finalTestimonial = {
        user_id: this.userState.userId,
        google_name: this.userState.name,
        google_email: this.userState.email,
        google_avatar: this.userState.avatar,
        linkedin_url: linkedinVal || null,
        designation: designationVal,
        company: companyVal || null,
        rating: parseInt(ratingVal),
        testimonial: testimonialVal,
        consent_public: consentVal,
        source: "portfolio",
        user_agent: navigator.userAgent
      };

      if (window.TestimonialService) {
        this.setFormDisabled(true);

        window.TestimonialService.hasSubmittedTestimonial(finalTestimonial.user_id)
          .then(hasSubmitted => {
            if (hasSubmitted) {
              this.setFormDisabled(false);
              showToast("error", "Already Submitted", "You've already submitted a testimonial. Thank you!", 5000);
              return;
            }

            window.TestimonialService.createTestimonial(finalTestimonial)
              .then(({ error }) => {
                if (error) {
                  this.setFormDisabled(false);
                  showToast("error", "Something went wrong", "Unable to submit your testimonial. Please try again.", 4000);
                } else {
                  showToast("success", "✅ Submitted", "Your testimonial has been submitted for review.", 4000);
                  
                  form.reset();
                  if (testimonialComp) testimonialComp.value = "";
                  
                  this.submitted = true;
                  this.render();
                  
                  setTimeout(() => {
                    this.closest("modal-overlay")?.close();
                    this.submitted = false;
                  }, 2800);
                }
              })
              .catch(err => {
                this.setFormDisabled(false);
                showToast("error", "Something went wrong", "Unable to submit your testimonial. Please try again.", 4000);
              });
          })
          .catch(err => {
            this.setFormDisabled(false);
            showToast("error", "Something went wrong", "Unable to submit your testimonial. Please try again.", 4000);
          });
      }
    });
  }

  showError(field, message) {
    const errorEl = this.querySelector(`#${field}-error`);
    const groupEl = errorEl?.closest(".form-group");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
    if (groupEl) {
      groupEl.classList.add("has-error");
    }
  }

  clearErrors() {
    this.querySelectorAll(".field-error-msg").forEach(el => {
      el.textContent = "";
      el.style.display = "none";
    });
    this.querySelectorAll(".form-group").forEach(el => {
      el.classList.remove("has-error");
    });
  }

  renderSuccess() {
    this.innerHTML = `
      <div class="success-screen">
        <div class="success-icon-wrapper">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#8f85ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 class="success-title">Thank You!</h2>
        <p class="success-desc">Thank you! Your testimonial has been submitted and will appear after review and approval.</p>
        <button type="button" class="profile-action profile-action-primary close-success-btn magnetic" id="success-close-btn">
          <span>Done</span>
        </button>
      </div>
    `;

    const closeBtn = this.querySelector("#success-close-btn");
    initMagnetic(closeBtn);
    closeBtn?.addEventListener("click", () => {
      this.closest("modal-overlay")?.close();
    });
  }

  animateIn() {
    this.style.opacity = "0";
    this.style.transform = "scale(0.95) translateY(15px)";
    this.style.transition = "opacity 300ms cubic-bezier(0.25, 1, 0.5, 1), transform 300ms cubic-bezier(0.25, 1, 0.5, 1)";
    
    this.offsetHeight;

    this.style.opacity = "1";
    this.style.transform = "scale(1) translateY(0)";
  }

  animateOut(callback) {
    this.style.opacity = "0";
    this.style.transform = "scale(0.95) translateY(15px)";
    setTimeout(callback, 300);
  }
}
customElements.define("share-experience-modal", ShareExperienceModal);
