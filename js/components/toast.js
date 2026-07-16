/**
 * PremiumToast Component
 * Reusable glassmorphism toast notification system for Ashok's portfolio website.
 */
class PremiumToast {
  static container = null;

  static initContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "premium-toast-container";
      this.container.className = "premium-toast-container";
      document.body.appendChild(this.container);
    }
  }

  static show({ type = "info", title = "", message = "", duration = 4000 }) {
    this.initContainer();

    const toast = document.createElement("div");
    toast.className = `premium-toast toast-${type}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    // Dynamic icons selection
    let iconHtml = "";
    if (type === "success") {
      iconHtml = `
        <div class="toast-icon-circle success-circle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      `;
    } else if (type === "error") {
      iconHtml = `
        <div class="toast-icon-circle error-circle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      `;
    } else if (type === "warning") {
      iconHtml = `
        <div class="toast-icon-circle warning-circle">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
      `;
    } else { // info
      iconHtml = `
        <div class="toast-icon-circle info-circle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
      `;
    }

    toast.innerHTML = `
      <div class="premium-toast-border-gradient"></div>
      ${iconHtml}
      <div class="toast-content">
        ${title ? `<strong class="toast-title">${title}</strong>` : ""}
        <span class="toast-message">${message}</span>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Close notification">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    this.container.appendChild(toast);

    // Fade and slide-up trigger
    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    // Close logic handler
    let dismissed = false;
    const dismissToast = () => {
      if (dismissed) return;
      dismissed = true;
      toast.classList.remove("toast-show");
      toast.classList.add("toast-hide");
      toast.addEventListener("transitionend", () => {
        toast.remove();
      });
    };

    toast.querySelector(".toast-close-btn").addEventListener("click", dismissToast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(dismissToast, duration);
    }
  }
}

// Global hook registration
window.showToast = (type, title, message, duration = 4000) => {
  PremiumToast.show({ type, title, message, duration });
};
