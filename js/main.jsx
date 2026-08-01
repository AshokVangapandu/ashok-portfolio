(function() {
  const path = window.location.pathname;
  const base = path.startsWith('/ashok-portfolio') ? '/ashok-portfolio' : '';
  const cleanPath = path.substring(base.length);
  if (cleanPath.startsWith('/admin') && !cleanPath.includes('.')) {
    window.location.replace(window.location.origin + base + '/admin/index.html?redirect=' + encodeURIComponent(cleanPath));
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import Avatar from '../src/components/Avatar';
import { createClient } from '@supabase/supabase-js';

window.supabase = { createClient };

const getBaseUrl = () => {
  const path = window.location.pathname;
  if (path.startsWith('/ashok-portfolio')) {
    return '/ashok-portfolio/';
  }
  return '/';
};

const rewriteNavLinks = () => {
  const base = getBaseUrl();

  const brandLogo = document.querySelector(".brand");
  if (brandLogo) {
    brandLogo.setAttribute("href", base);
  }

  document.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("#")) {
      const currentPath = window.location.pathname;
      const isAtRoot = currentPath === base || currentPath === base + 'index.html';
      if (!isAtRoot) {
        link.setAttribute("href", base + href);
      }
    } else if (href.includes("index.html#")) {
      const hash = href.substring(href.indexOf("#"));
      link.setAttribute("href", base + hash);
    } else if (href.includes("index.html") && !href.includes("widgets") && !href.includes("projects") && !href.includes("certifications")) {
      link.setAttribute("href", base);
    } else if (href.includes("widgets/index.html")) {
      link.setAttribute("href", base + "widgets/index.html");
    } else if (href.includes("pages/projects/index.html")) {
      link.setAttribute("href", base + "pages/projects/index.html");
    } else if (href.includes("certifications/index.html")) {
      link.setAttribute("href", base + "certifications/index.html");
    }
  });
};

rewriteNavLinks();

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const cursorLight = document.querySelector(".cursor-light");
const magneticItems = document.querySelectorAll(".magnetic");
const expertiseGrid = document.querySelector("[data-expertise-grid]");
const buildFlow = document.querySelector("[data-build-flow]");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-container a[href^="#"]');
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const contactForm = document.querySelector("[data-contact-form]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersMobileWhatsApp = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;

whatsappLinks.forEach((link) => {
  link.href = prefersMobileWhatsApp ? link.dataset.mobileHref : link.dataset.desktopHref;
});

const showContactToast = (type, title, message) => {
  if (window.showToast) {
    window.showToast(type, title, message, 5600);
  }
};

// Initialize Supabase Client
const supabaseUrl = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || "";
const supabaseKey = (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || "";

const isValidSupabaseConfig = (url, key) => {
  if (!url || !key) return false;
  if (url.startsWith('%VITE_') || url.includes('%') || key.startsWith('%VITE_') || key.includes('%')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const supabaseClient = window.supabase && isValidSupabaseConfig(supabaseUrl, supabaseKey)
  ? (function() {
      try {
        return window.supabase.createClient(supabaseUrl, supabaseKey);
      } catch (err) {
        console.warn('[main] Failed to create Supabase client:', err);
        return null;
      }
    })()
  : (console.warn(
      '[Portfolio]\n\nSupabase disabled.\n\nReason:\nInvalid configuration.\n\nThe website will continue running with fallback behaviour.'
    ), null);

// Validation UI Helpers
const showFieldError = (inputElement, errorMessage) => {
  const group = inputElement.closest(".contact-form-group");
  if (!group) return;

  group.classList.add("has-error");
  let errorSpan = group.querySelector(".validation-error");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "validation-error";
    group.appendChild(errorSpan);
  }
  errorSpan.textContent = errorMessage;
};

const clearFieldError = (inputElement) => {
  const group = inputElement.closest(".contact-form-group");
  if (!group) return;

  group.classList.remove("has-error");
  const errorSpan = group.querySelector(".validation-error");
  if (errorSpan) {
    errorSpan.remove();
  }
};

const validateContactForm = (form) => {
  let isValid = true;
  const nameInput = form.querySelector("#contact-name");
  const emailInput = form.querySelector("#contact-email");
  const subjectInput = form.querySelector("#contact-subject");
  const messageInput = form.querySelector("#contact-message");

  // Validate Name
  const nameVal = nameInput.value.trim();
  nameInput.value = nameVal;
  if (!nameVal) {
    showFieldError(nameInput, "Name is required.");
    isValid = false;
  } else {
    clearFieldError(nameInput);
  }

  // Validate Email
  const emailVal = emailInput.value.trim();
  emailInput.value = emailVal;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    showFieldError(emailInput, "Email is required.");
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    showFieldError(emailInput, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearFieldError(emailInput);
  }

  // Validate Subject
  const subjectVal = subjectInput.value.trim();
  subjectInput.value = subjectVal;
  if (!subjectVal) {
    showFieldError(subjectInput, "Subject is required.");
    isValid = false;
  } else {
    clearFieldError(subjectInput);
  }

  // Validate Message
  const messageVal = messageInput.value.trim();
  messageInput.value = messageVal;
  if (!messageVal) {
    showFieldError(messageInput, "Message is required.");
    isValid = false;
  } else {
    clearFieldError(messageInput);
  }

  return isValid;
};

// Setup real-time validation clear handlers
if (contactForm) {
  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        if (input.id === "contact-email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(input.value.trim())) {
            clearFieldError(input);
          }
        } else {
          clearFieldError(input);
        }
      }
    });
  });
}

const setContactSubmitState = (form, isSubmitting) => {
  const submitButton = form.querySelector(".contact-submit");
  const submitLabel = submitButton.querySelector("span:not(.spinner)");
  submitButton.disabled = isSubmitting;
  submitButton.setAttribute("aria-busy", String(isSubmitting));
  
  if (isSubmitting) {
    submitLabel.textContent = "Sending...";
    submitButton.classList.add("loading");
  } else {
    submitLabel.textContent = "Send Message";
    submitButton.classList.remove("loading");
  }
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Perform client-side validation
  if (!validateContactForm(contactForm)) {
    return;
  }

  if (!supabaseClient) {
    console.error("Supabase client is not loaded.");
    showContactToast(
      "error",
      "Something went wrong while sending your message.",
      "Please try again in a few moments."
    );
    return;
  }

  setContactSubmitState(contactForm, true);

  try {
    const nameVal = contactForm.querySelector("#contact-name").value.trim();
    const emailVal = contactForm.querySelector("#contact-email").value.trim();
    const subjectVal = contactForm.querySelector("#contact-subject").value.trim();
    const messageVal = contactForm.querySelector("#contact-message").value.trim();

    const { error } = await supabaseClient
      .from("contact_messages")
      .insert([
        {
          full_name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          submitted_from: "Portfolio Website",
          status: "New"
        }
      ]);

    if (error) {
      throw error;
    }

    // Success flow
    contactForm.reset();
    
    // Clear validation messages and borders
    contactForm.querySelectorAll("input, textarea").forEach(input => {
      clearFieldError(input);
    });

    showContactToast(
      "success",
      "✅ Message Sent Successfully!",
      "Thank you for reaching out. I've received your message and will get back to you as soon as possible."
    );
  } catch (error) {
    console.error("Supabase Database error during form submission:", error);
    showContactToast(
      "error",
      "Something went wrong while sending your message.",
      "Please try again in a few moments."
    );
  } finally {
    setContactSubmitState(contactForm, false);
  }
});

const expertise = [
  {
    title: "Mendix",
    icon: "assets/images/Mendix-Brandmark.webp",
    signal: "Low-code delivery",
    desc1: "Scalable enterprise apps with Atlas UI, microflows, and end-to-end cloud deployment.",
    chips: ["Atlas UI", "Microflows"],
    score: 92,
    tone: "#a78bfa"
  },
  {
    title: "Figma",
    icon: "assets/images/FigmaImage.png",
    signal: "Product design",
    desc1: "Pixel-perfect wireframing, prototyping, and component systems dev-ready from day one.",
    chips: ["Prototypes", "Components"],
    score: 95,
    tone: "#a78bfa"
  },
  {
    title: "Design System",
    icon: "assets/images/design-system.webp",
    signal: "Reusable patterns",
    desc1: "Token architecture to variant logic, building consistency at every scale.",
    chips: ["Tokens", "Variants"],
    score: 90,
    tone: "#a78bfa"
  },
  {
    title: "Widgets",
    icon: "assets/images/Widget.png",
    signal: "Pluggable widgets",
    desc1: "Custom Mendix widgets built with React and TypeScript, extending platform capabilities.",
    chips: ["React", "TypeScript"],
    score: 87,
    tone: "#a78bfa"
  },
  {
    title: "Frontend Dev",
    icon: "assets/images/front-end.svg",
    signal: "Modern interfaces",
    desc1: "Responsive, accessible, high-performing interfaces with strong usability and visual engagement.",
    chips: ["Responsive", "Accessibility"],
    score: 88,
    tone: "#a78bfa"
  },
  {
    title: "JavaScript",
    icon: "assets/images/javascript-logo.webp",
    signal: "Interactive UI",
    desc1: "Dynamic, modular JS architecture for clean interactive components.",
    chips: ["DOM", "Modules"],
    score: 85,
    tone: "#a78bfa"
  },
  {
    title: "SCSS",
    icon: "assets/images/SCSS.png",
    signal: "Style architecture",
    desc1: "Modular, maintainable SCSS with mixins, functions, and scalable responsive systems.",
    chips: ["Mixins", "Responsive"],
    score: 80,
    tone: "#a78bfa"
  },
  {
    title: "AI Product Building",
    icon: "sparkles",
    signal: "AI-POWERED DEVELOPMENT",
    desc1: "Leveraging AI to design, prototype, and build production-ready applications through modern AI-assisted development workflows.",
    chips: ["Codex", "AI Agents"],
    score: 78,
    tone: "#a78bfa"
  }
];

const buildSteps = [
  {
    title: "Analyze",
    icon: "target-scan",
    description: "Understanding business problems, user needs, behavior, workflows, and strategic product goals.",
    meta: "01",
    tags: ["Research", "Strategy", "Goals"],
    tone: "#00d6c6"
  },
  {
    title: "Design",
    icon: "pen-tool",
    description: "Wireframes, UI systems, interaction design, user experience flows, accessibility, and visual hierarchy.",
    meta: "02",
    tags: ["Wireframes", "UI Systems", "UX"],
    tone: "#8f72ff"
  },
  {
    title: "Build",
    icon: "code",
    description: "Transforming designs into scalable digital products through clean systems and reusable components.",
    meta: "03",
    tags: ["Frontend", "Components", "Code"],
    tone: "#409cff"
  },
  {
    title: "Refine",
    icon: "sliders",
    description: "Polishing interactions, optimizing performance, collecting feedback, and iterating based on behavior.",
    meta: "04",
    tags: ["QA", "Performance", "Feedback"],
    tone: "#ffd84d"
  },
  {
    title: "Deliver",
    icon: "badge-check",
    description: "Deployment, production readiness, developer handoff, final QA, and launching impactful experiences.",
    meta: "05",
    tags: ["Launch", "Handoff", "Deploy"],
    tone: "#dc66f0"
  }
];

const iconPaths = {
  layers: `
    <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/>
    <path d="m4 12 8 4.5 8-4.5"/>
    <path d="m4 16.5 8 4.5 8-4.5"/>
  `,
  figma: `
    <path d="M12 12a4 4 0 1 0 0-8H8a4 4 0 0 0 0 8h4Z"/>
    <path d="M12 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/>
    <path d="M8 12a4 4 0 1 0 0 8h4v-8H8Z"/>
    <path d="M12 4h4a4 4 0 0 1 0 8h-4V4Z"/>
  `,
  coffee: `
    <path d="M10 2v2"/>
    <path d="M14 2v2"/>
    <path d="M7 8h10v5a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z"/>
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/>
    <path d="M5 22h14"/>
  `,
  "layout-dashboard": `
    <rect x="3" y="3" width="7" height="9" rx="2"/>
    <rect x="14" y="3" width="7" height="5" rx="2"/>
    <rect x="14" y="12" width="7" height="9" rx="2"/>
    <rect x="3" y="16" width="7" height="5" rx="2"/>
  `,
  "file-code": `
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"/>
    <path d="M14 2v5h5"/>
    <path d="m10 13-2 2 2 2"/>
    <path d="m14 17 2-2-2-2"/>
  `,
  component: `
    <path d="M5.5 8.5 3 6l2.5-2.5L8 6l-2.5 2.5Z"/>
    <path d="M18.5 8.5 16 6l2.5-2.5L21 6l-2.5 2.5Z"/>
    <path d="M5.5 20.5 3 18l2.5-2.5L8 18l-2.5 2.5Z"/>
    <path d="M18.5 20.5 16 18l2.5-2.5L21 18l-2.5 2.5Z"/>
    <path d="M8 6h8"/>
    <path d="M6 8v8"/>
    <path d="M18 8v8"/>
    <path d="M8 18h8"/>
  `,
  palette: `
    <path d="M12 22a10 10 0 1 1 10-10c0 1.66-1.34 3-3 3h-1.7a2 2 0 0 0-1.4 3.43A2.1 2.1 0 0 1 14.4 22H12Z"/>
    <path d="M7.5 10.5h.01"/>
    <path d="M10.5 7.5h.01"/>
    <path d="M14.5 7.5h.01"/>
    <path d="M16.5 11h.01"/>
  `,
  "pen-tool": `
    <path d="M12 19 5 12l7-9 7 9-7 7Z"/>
    <path d="M12 19v3"/>
    <path d="M9 22h6"/>
    <path d="M12 3v7"/>
    <path d="M9 12h6"/>
  `,
  "scan-search": `
    <path d="M7 3H5a2 2 0 0 0-2 2v2"/>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <path d="M15 15.5 19.5 20"/>
    <path d="M11 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>
  `,
  "target-scan": `
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="2.4"/>
    <path d="M12 2.8V5"/>
    <path d="M12 19v2.2"/>
    <path d="M2.8 12H5"/>
    <path d="M19 12h2.2"/>
  `,
  hash: `
    <path d="M8 3 6 21"/>
    <path d="M18 3l-2 18"/>
    <path d="M4 9h16"/>
    <path d="M3 15h16"/>
  `,
  code: `
    <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"/>
  `,
  wand: `
    <path d="M15 4V2"/>
    <path d="M15 10V8"/>
    <path d="M12 5h2"/>
    <path d="M16 5h2"/>
    <path d="m4 20 12-12"/>
    <path d="m14 6 4 4"/>
    <path d="M8 3 7 5 5 6l2 1 1 2 1-2 2-1-2-1-1-2Z"/>
  `,
  terminal: `
    <path d="m4 17 6-6-6-6"/>
    <path d="M12 19h8"/>
  `,
  "refresh-cw": `
    <path d="M21 12a9 9 0 0 1-15.5 6.2"/>
    <path d="M3 12A9 9 0 0 1 18.5 5.8"/>
    <path d="M18 2v4h4"/>
    <path d="M6 22v-4H2"/>
  `,
  sliders: `
    <path d="M4 7h10"/>
    <path d="M18 7h2"/>
    <circle cx="16" cy="7" r="2"/>
    <path d="M4 17h2"/>
    <path d="M10 17h10"/>
    <circle cx="8" cy="17" r="2"/>
  `,
  "badge-check": `
    <path d="M12 2.5 14.8 5l3.8-.2.9 3.7 3 2.3-1.5 3.5.9 3.7-3.6 1.5-2 3.2-3.3-.8-3.3.8-2-3.2L4 18l.9-3.7-1.5-3.5 3-2.3.9-3.7 3.8.2L12 2.5Z"/>
    <path d="m8.8 12.5 2.1 2.1 4.5-5"/>
  `,
  sparkles: `
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z"/>
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"/>
  `
};

const brandIcons = {
  "mendix-brand": `
    <svg class="brand-icon brand-icon-mendix" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#0f172a" d="M9 10h30a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z"/>
      <path fill="#13b5ea" d="M11 33V15h6.1l6.9 8.2 6.9-8.2H37v18h-6.1V24l-6.9 8.2L17.1 24v9H11Z"/>
      <path fill="#7dd3fc" opacity=".72" d="M17.1 15 24 23.2 30.9 15H37L24 30.6 11 15h6.1Z"/>
    </svg>
  `,
  "figma-brand": `
    <svg class="brand-icon brand-icon-figma" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="12" r="7" fill="#f24e1e"/>
      <circle cx="30" cy="12" r="7" fill="#ff7262"/>
      <circle cx="30" cy="24" r="7" fill="#1abcfe"/>
      <circle cx="18" cy="24" r="7" fill="#a259ff"/>
      <circle cx="18" cy="36" r="7" fill="#0acf83"/>
      <path fill="#ffffff" opacity=".18" d="M18 5h12a7 7 0 0 1 0 14H18A7 7 0 0 1 18 5Z"/>
    </svg>
  `,
  "java-brand": `
    <svg class="brand-icon brand-icon-java" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#f89820" d="M23.2 6c4.2 3.1-7.8 7.3-1.2 12.2 2 1.5 1.8 3.2.2 5.2 5.2-4.2 2.7-7.1.4-8.8-3.2-2.4 7.6-5.8.6-8.6Z"/>
      <path fill="#5382a1" d="M33.8 30.4c3.9-2 6.4.8 2.2 3-5.8 3-19 2.7-24.4.1-3.9-1.9 2.2-4.5 6.5-3.3l-1.5 1.1c-2.8-.6-4.1.7-2.1 1.5 4.1 1.7 14.4 1.8 18.4-.1 1.7-.8 1.2-1.6.9-2.3Z"/>
      <path fill="#5382a1" d="M18.8 26.5s-2.2 1.3 1.5 1.8c4.5.6 6.8.5 11.8-.5 0 0 1.3.8 3.2 1.5-11.3 4.9-25.6-.3-16.5-2.8Z"/>
      <path fill="#f89820" d="M27.6 20.8c1.8 2.1-.5 4-3.9 5.6 0 0 6.6-.7 7.1-3.4.4-2.5-3.2-3.7-3.2-3.7v1.5Z"/>
      <ellipse cx="24" cy="39" rx="13" ry="2.7" fill="#5382a1" opacity=".72"/>
    </svg>
  `,
  "ui-brand": `
    <svg class="brand-icon brand-icon-ui" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="9" width="34" height="28" rx="6" fill="#111827"/>
      <path fill="#6ee7f9" d="M11 16a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v3H11v-3Z"/>
      <rect x="12" y="23" width="10" height="9" rx="3" fill="#a78bfa"/>
      <rect x="25" y="23" width="11" height="3" rx="1.5" fill="#e0e7ff"/>
      <rect x="25" y="29" width="8" height="3" rx="1.5" fill="#8dd8ff"/>
      <path fill="#ffffff" opacity=".18" d="M7 17h34v2H7z"/>
    </svg>
  `,
  "javascript-brand": `
    <svg class="brand-icon brand-icon-js" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="5" fill="#f7df1e"/>
      <path fill="#111827" d="M17 33.3c.6 1 1.3 1.8 2.8 1.8 1.3 0 2.1-.6 2.1-3V18.3h4v13.8c0 4.2-2.5 6.1-6 6.1-3.2 0-5.1-1.7-6-3.7l3.1-1.2Z"/>
      <path fill="#111827" d="M28.1 32.9c1.1 1.8 2.6 2.4 4.5 2.4 1.5 0 2.5-.7 2.5-1.7 0-1.2-1-1.6-2.7-2.4l-1-.4c-2.7-1.1-4.5-2.6-4.5-5.6 0-2.8 2.1-4.9 5.5-4.9 2.4 0 4.1.8 5.3 3l-2.9 1.8c-.6-1.1-1.3-1.6-2.4-1.6s-1.8.7-1.8 1.6c0 1.1.7 1.5 2.3 2.2l1 .4c3.2 1.4 5 2.7 5 5.8 0 3.3-2.6 5.1-6.1 5.1s-6-1.6-7.1-3.8l2.4-1.9Z"/>
    </svg>
  `,
  "design-system-brand": `
    <svg class="brand-icon brand-icon-system" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="4" fill="#8b5cf6"/>
      <rect x="27" y="9" width="12" height="12" rx="4" fill="#60a5fa"/>
      <rect x="9" y="27" width="12" height="12" rx="4" fill="#5eead4"/>
      <rect x="27" y="27" width="12" height="12" rx="4" fill="#e0e7ff"/>
      <path stroke="#93c5fd" stroke-width="2" stroke-linecap="round" d="M21 15h6M15 21v6M33 21v6M21 33h6"/>
      <path fill="#ffffff" opacity=".18" d="M9 9h30v4H9z"/>
    </svg>
  `,
  "scss-brand": `
    <svg class="brand-icon brand-icon-scss" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#cf649a" d="M39.7 17.2c-1.3-5.1-8.6-6.8-16.1-4.2-4.5 1.6-9.3 4.8-11.8 8.2-3 4.2-1.8 7.8 3.2 8.4 1.8.2 3.7-.2 5.7-.8-.8 1.6-1.3 3.2-1.3 4.6 0 4.7 4.4 5.9 8.2 3.7 3.4-2 5.4-6.6 3.7-10.2 4.9-2.4 9.6-5.7 8.4-9.7Z"/>
      <path fill="#ffffff" opacity=".24" d="M23.7 13c-4.5 1.6-9.3 4.8-11.8 8.2-1.3 1.9-1.8 3.6-1.3 5 5.2-7.2 14.8-11.8 22.6-11.4-2.5-2.5-6.3-2.9-9.5-1.8Z"/>
      <path fill="#8f3f6f" d="M25 25.8c1.9.7 3.2 1.8 3.4 3.4.3 2.1-1.1 4.3-3.2 5.4-1.6.9-3.4.4-3.3-1.6.1-1.9 1.2-4.4 3.1-7.2Z"/>
    </svg>
  `,
  "canva-brand": `
    <svg class="brand-icon brand-icon-canva" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="#20c4cb"/>
      <path fill="#7c3aed" opacity=".76" d="M39.5 15.1A18 18 0 0 1 14.8 39.5 18 18 0 0 0 39.5 15.1Z"/>
      <path fill="#ffffff" d="M30.7 28.6c-1.8 2.4-4.1 3.7-6.9 3.7-4.4 0-7.3-3-7.3-7.4 0-5.5 4.2-9.2 9.2-9.2 3.2 0 5.5 1.4 6.4 3.8l-3.4 1.8c-.5-1.3-1.5-2-3.1-2-2.8 0-5 2.3-5 5.4 0 2.3 1.4 3.8 3.6 3.8 1.6 0 2.8-.7 3.8-2l2.7 2.1Z"/>
      <path fill="#ffffff" opacity=".24" d="M13 12c7.7-6.2 19.3-4.6 25 3.4-8.2-4.2-18.1-3.1-25 3.2V12Z"/>
    </svg>
  `
};

const renderIcon = (icon) => {
  if (icon.startsWith("assets/")) {
    return `<img src="${icon}" alt="" class="expertise-img-icon" />`;
  }
  return brandIcons[icon] || `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[icon]}</svg>`;
};

const renderExpertise = () => {
  if (!expertiseGrid) return;

  expertiseGrid.innerHTML = expertise.map((item, index) => {
    const stagger = index * 70;

    return `
    <article class="expertise-card tilt-card reveal-on-scroll" data-stagger="${stagger}" style="--skill-color: ${item.tone}; --skill-score: ${item.score}%; transition-delay: ${stagger}ms" aria-label="${item.title} expertise">
      <div class="expertise-card-top">
        <div class="expertise-card-meta">
          <span class="expertise-icon">${renderIcon(item.icon)}</span>
          <span class="expertise-signal">${item.signal}</span>
        </div>
        <span class="expertise-score">${item.score}%</span>
      </div>
      <div class="expertise-card-copy">
        <h3>${item.title}</h3>
        <p>${item.desc1}</p>
      </div>
      <div class="expertise-card-bottom" aria-label="${item.title} focus areas">
        <div class="expertise-meter" aria-hidden="true"><span></span></div>
        <div class="expertise-tags">
          ${item.chips.map((chip) => `<span>${chip}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
  }).join("");
};

renderExpertise();

const renderBuildFlow = () => {
  if (!buildFlow) return;

  buildFlow.innerHTML = buildSteps.map((step, index) => {
    const stagger = 120 + index * 90;

    return `
    <article class="build-node build-node-${index + 1} reveal-on-scroll" data-stagger="${stagger}" style="--build-color: ${step.tone}; transition-delay: ${stagger}ms" aria-label="${step.title} workflow step">
      <div class="build-step-index">${step.meta}</div>
      <span class="build-icon">${renderIcon(step.icon)}</span>
      <div class="build-card-copy">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
        <ul class="build-tags" aria-label="${step.title} focus points">
          ${step.tags.map((tag) => `<li>${tag}</li>`).join("")}
        </ul>
      </div>
    </article>
  `;
  }).join("");
};

renderBuildFlow();

const tiltCards = document.querySelectorAll(".tilt-card");
const buildNodes = document.querySelectorAll(".build-node");
const interactiveSurfaces = document.querySelectorAll(".portfolio-display-card, .portfolio-cta, .preview-panel, .profile-action, .contact-panel, .contact-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .widget-gallery-link, .widget-mockup-frame");
const scrollRevealItems = document.querySelectorAll(".reveal-on-scroll");
const trackedSections = Array.from(document.querySelectorAll("main section[id]"));

const showRevealItems = () => {
  scrollRevealItems.forEach((item) => {
    item.classList.add("is-visible");
    item.style.transitionDelay = "0ms";
    item.style.willChange = "auto";
  });
};

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const setActiveNavLink = () => {
  const activationLine = header.offsetHeight + window.innerHeight * 0.18;
  let activeId = "";

  trackedSections.forEach((section) => {
    if (!section.id) return;

    const rect = section.getBoundingClientRect();
    if (rect.top <= activationLine && rect.bottom > activationLine) {
      activeId = section.id;
    }
  });

  navSectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (document.body.classList.contains("resume-page")) {
    document.querySelectorAll('.nav-links a[href$="#resume"]').forEach((link) => {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    });
  }
};

let scrollTicking = false;

const updateScrollState = () => {
  scrollTicking = false;
  setHeaderState();
  setActiveNavLink();
};

const requestScrollUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(updateScrollState);
};

const closeMenu = () => {
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
};

setHeaderState();
setActiveNavLink();
showRevealItems();

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();

    const headerOffset = header ? header.offsetHeight + 18 : 100;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    if (window.lenis) {
      window.lenis.scrollTo(target, {
        offset: -headerOffset,
        duration: 1.2,
      });
    } else {
      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "auto"
      });
    }

    if (window.history.pushState) {
      window.history.pushState(null, "", targetId);
    }
  });
});

if (!prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const normalizedX = (x / window.innerWidth - 0.5).toFixed(3);
    const normalizedY = (y / window.innerHeight - 0.5).toFixed(3);

    document.body.classList.add("has-pointer");
    document.documentElement.style.setProperty("--mx", normalizedX);
    document.documentElement.style.setProperty("--my", normalizedY);
    if (cursorLight) {
      cursorLight.style.setProperty("--x", `${x}px`);
      cursorLight.style.setProperty("--y", `${y}px`);
    }
  }, { passive: true });

  magneticItems.forEach((item) => {
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
  });

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width - 0.5) * 7).toFixed(2);
      const rotateX = ((0.5 - y / rect.height) * 7).toFixed(2);

      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
      card.style.setProperty("--local-x", `${x}px`);
      card.style.setProperty("--local-y", `${y}px`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.removeProperty("--local-x");
      card.style.removeProperty("--local-y");
    });
  });

  buildNodes.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      node.style.setProperty("--local-x", `${x}px`);
      node.style.setProperty("--local-y", `${y}px`);
    }, { passive: true });

    node.addEventListener("pointerleave", () => {
      node.style.removeProperty("--local-x");
      node.style.removeProperty("--local-y");
    });
  });

  interactiveSurfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      surface.style.setProperty("--local-x", `${x}px`);
      surface.style.setProperty("--local-y", `${y}px`);
    }, { passive: true });

    surface.addEventListener("pointerleave", () => {
      surface.style.removeProperty("--local-x");
      surface.style.removeProperty("--local-y");
    });
  });
}

const initWallOfLoveCarousel = () => {
  const carousel = document.querySelector("[data-wall-carousel]");
  const track = document.querySelector("[data-wall-marquee]");
  if (!carousel || !track) return;

  // Clean up any existing dots containers
  const existingDots = carousel.parentNode.querySelector(".wall-carousel-dots");
  if (existingDots) {
    existingDots.remove();
  }

  // Clean up any cloned cards before cloning new ones
  const clonedCards = track.querySelectorAll("[data-clone='true']");
  clonedCards.forEach(c => c.remove());

  const prevButton = document.querySelector("[data-wall-prev]");
  const nextButton = document.querySelector("[data-wall-next]");
  const toggleButton = document.querySelector("[data-wall-toggle]");
  const toggleLabel = toggleButton?.querySelector("span");
  const originalCards = Array.from(track.children);
  if (!originalCards.length) return;

  // If there are less than 3 testimonials, we do not animate or clone them
  if (originalCards.length < 3) {
    const existingDotsContainer = carousel.parentNode.querySelector(".wall-carousel-dots");
    if (existingDotsContainer) {
      existingDotsContainer.remove();
    }
    
    // Hide controls
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    if (toggleButton) toggleButton.style.display = "none";
    
    // Center the track layout
    track.style.justifyContent = "center";
    track.style.transform = "none";
    
    // Add is-active class to all of them so they display in full color
    originalCards.forEach(card => card.classList.add("is-active"));
    return;
  }

  // Reset track styles for standard infinite scrolling carousel
  track.style.justifyContent = "flex-start";
  if (prevButton) prevButton.style.display = "flex";
  if (nextButton) nextButton.style.display = "flex";
  if (toggleButton) toggleButton.style.display = "flex";

  // Dynamically create navigation dots (6 dots) for mobile carousel indicators
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "wall-carousel-dots";
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement("span");
    dot.className = "wall-dot";
    if (i === 0) dot.classList.add("is-active");
    dotsContainer.appendChild(dot);
  }
  carousel.parentNode.appendChild(dotsContainer);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.clone = "true";
    track.appendChild(clone);
  });

  let cards = Array.from(track.children);
  let loopWidth = 0;
  let offset = 0;
  let lastTime = performance.now();
  let isHoverPaused = false;
  let isUserPaused = false;
  let isDragging = false;
  let isAnimating = false;
  let slideTween = null;
  let dragStartX = 0;
  let dragStartOffset = 0;
  const speed = 34;

  const setTrackX = () => {
    if (window.gsap) {
      window.gsap.set(track, { x: offset });
    } else {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  };

  const wrapOffset = () => {
    if (!loopWidth) return;
    while (offset <= -loopWidth) offset += loopWidth;
    while (offset > 0) offset -= loopWidth;
  };

  const measure = () => {
    cards = Array.from(track.children);
    loopWidth = track.scrollWidth / 2;
    wrapOffset();
    setTrackX();
  };

  const setActiveCard = () => {
    const carouselRect = carousel.getBoundingClientRect();
    const center = carouselRect.left + carouselRect.width / 2;
    let activeCard = null;
    let activeDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < activeDistance) {
        activeDistance = distance;
        activeCard = card;
      }
    });

    cards.forEach((card) => {
      card.classList.toggle("is-active", card === activeCard);
    });

    // Update active mobile dot indicator
    if (activeCard && dotsContainer) {
      const activeIndex = cards.indexOf(activeCard);
      const dotIndex = (activeIndex % originalCards.length) % 6;
      const dots = dotsContainer.querySelectorAll(".wall-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === dotIndex);
      });
    }
  };

  const updateToggle = () => {
    if (!toggleButton || !toggleLabel) return;
    toggleButton.setAttribute("aria-pressed", String(isUserPaused));
    toggleButton.setAttribute("aria-label", isUserPaused ? "Play testimonial autoplay" : "Pause testimonial autoplay");
    toggleLabel.textContent = isUserPaused ? "Play" : "Pause";
  };

  const getStepSize = () => {
    const firstCard = originalCards[0];
    const secondCard = originalCards[1];
    if (!firstCard) return 320;
    if (!secondCard) return firstCard.getBoundingClientRect().width;
    return secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;
  };

  const moveByCard = (direction) => {
    if (window.gsap) {
      if (slideTween) {
        slideTween.kill();
      }
      
      wrapOffset();
      const target = offset + getStepSize() * direction;
      isAnimating = true;
      
      slideTween = window.gsap.to(track, {
        x: target,
        duration: 0.75,
        ease: "power3.out",
        onUpdate: () => {
          setActiveCard();
        },
        onComplete: () => {
          offset = target;
          wrapOffset();
          setTrackX();
          isAnimating = false;
          slideTween = null;
        }
      });
    } else {
      offset += getStepSize() * direction;
      wrapOffset();
      setTrackX();
      setActiveCard();
    }
  };

  const tick = (time) => {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (!isHoverPaused && !isUserPaused && !isDragging && !isAnimating && !isReadingModeActive) {
      offset -= speed * delta;
      wrapOffset();
      setTrackX();
    }

    setActiveCard();
  };

  carousel.addEventListener("mouseenter", () => {
    isHoverPaused = true;
  });
  carousel.addEventListener("mouseleave", () => {
    isHoverPaused = false;
  });
  carousel.addEventListener("focusin", () => {
    isHoverPaused = true;
  });
  carousel.addEventListener("focusout", () => {
    isHoverPaused = false;
  });

  const getPointerX = (event) => event.clientX ?? event.touches?.[0]?.clientX ?? 0;

  const startDrag = (event) => {
    if (slideTween) {
      slideTween.kill();
      slideTween = null;
      isAnimating = false;
    }
    isDragging = true;
    dragStartX = getPointerX(event);
    dragStartOffset = offset;
    carousel.classList.add("is-dragging");
    carousel.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!isDragging) return;
    offset = dragStartOffset + getPointerX(event) - dragStartX;
    wrapOffset();
    setTrackX();
    setActiveCard();
  };

  const endDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove("is-dragging");
    carousel.releasePointerCapture?.(event.pointerId);
  };

  carousel.addEventListener("pointerdown", startDrag);
  carousel.addEventListener("pointermove", moveDrag);
  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointercancel", endDrag);
  carousel.addEventListener("lostpointercapture", endDrag);

  prevButton?.addEventListener("click", () => moveByCard(1));
  nextButton?.addEventListener("click", () => moveByCard(-1));
  toggleButton?.addEventListener("click", () => {
    isUserPaused = !isUserPaused;
    updateToggle();
  });

  window.addEventListener("resize", measure);
  measure();
  updateToggle();
  setActiveCard();

  if (window.gsap) {
    window.gsap.ticker.add(() => tick(performance.now()));
  } else {
    const rafTick = (time) => {
      tick(time);
      window.requestAnimationFrame(rafTick);
    };
    window.requestAnimationFrame(rafTick);
  }
};

// Render testimonials helper
// State variables for testimonial Reading Mode
let dynamicTestimonials = [];
let isReadingModeActive = false;
let currentReadingIndex = 0;
let previousScrollY = 0;

// Truncate helper
const truncateTestimonial = (text, wordLimit = 40) => {
  if (!text) return { text: "", truncated: false };
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) {
    return { text, truncated: false };
  }
  return { text: words.slice(0, wordLimit).join(" ") + "...", truncated: true };
};

// Render testimonials helper
const renderTestimonials = (testimonials = []) => {
  const track = document.querySelector("[data-wall-marquee]");
  const emptyState = document.querySelector(".wall-empty-state");
  const navContainer = document.querySelector(".heard-carousel-nav");
  const prevButton = document.querySelector("[data-wall-prev]");
  const nextButton = document.querySelector("[data-wall-next]");

  if (!track) return;

  // Store testimonials locally for Reading Mode navigation
  dynamicTestimonials = testimonials || [];

  // Clear existing content
  track.innerHTML = "";

  if (!testimonials || testimonials.length === 0) {
    if (emptyState) emptyState.style.display = "flex";
    track.style.display = "none";
    if (navContainer) navContainer.style.display = "none";
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    
    // Hide dots container if any exists
    const dotsContainer = document.querySelector(".wall-carousel-dots");
    if (dotsContainer) dotsContainer.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  track.style.display = "flex";
  if (navContainer) navContainer.style.display = "flex";
  if (prevButton) prevButton.style.display = "flex";
  if (nextButton) nextButton.style.display = "flex";

  track.innerHTML = testimonials.map((t, index) => {
    const displayName = t.full_name || t.google_name || "Collaborator";
    const avatarSrc = t.avatar_url || t.google_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
    const roleStr = t.designation ? (t.company ? `${t.designation} at ${t.company}` : t.designation) : (t.company || "Collaborator");
    
    let normalizedLinkedinUrl = t.linkedin_url ? t.linkedin_url.trim() : '';
    if (normalizedLinkedinUrl && !/^https?:\/\//i.test(normalizedLinkedinUrl)) {
      normalizedLinkedinUrl = 'https://' + normalizedLinkedinUrl;
    }

    const linkedinIcon = normalizedLinkedinUrl ? `
      <a href="${normalizedLinkedinUrl}" class="wall-card-linkedin" target="_blank" rel="noopener noreferrer" aria-label="${displayName}'s LinkedIn profile">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
    ` : '';

    const starsHtml = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
    const avatarHtml = `<div class="avatar-mount-point" data-image-url="${avatarSrc || ''}" data-display-name="${displayName}" data-class-name="author-avatar"></div>`;

    const truncated = truncateTestimonial(t.testimonial, 40);

    return `
      <article class="wall-card">
        <div class="wall-card-top-row">
          <div class="card-quote-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <div class="card-rating-stars">
            <span>${starsHtml}</span>
          </div>
        </div>
        
        <div class="card-text-container">
          <blockquote class="card-testimonial-text">${truncated.text}</blockquote>
          
          <button type="button" class="read-more-btn" data-testimonial-id="${t.id}" data-original-index="${index}" aria-label="Read full review from ${displayName}">
            <span>Read Full Review</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="card-divider"></div>
        <div class="card-author-row">
          ${avatarHtml}
          <div class="author-meta">
            <div class="author-name-row">
              <h4>${displayName}</h4>
              ${linkedinIcon}
            </div>
            <p class="author-title">${roleStr}</p>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Setup click listeners for Read Full Review buttons
  const setupReadMoreListeners = () => {
    const btns = track.querySelectorAll(".read-more-btn");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-testimonial-id");
        const idx = dynamicTestimonials.findIndex(item => item.id === id);
        if (idx !== -1) {
          enterReadingMode(idx);
        }
      });
    });
  };

  initWallOfLoveCarousel();
  setupReadMoreListeners();

  // Mount React Avatar components on all card placeholders
  track.querySelectorAll(".avatar-mount-point").forEach(el => {
    const imageUrl = el.getAttribute("data-image-url");
    const nameVal = el.getAttribute("data-display-name");
    const className = el.getAttribute("data-class-name");
    const root = ReactDOM.createRoot(el);
    root.render(<Avatar imageUrl={imageUrl} displayName={nameVal} className={className} />);
  });
};

// Dynamic testimonial load helper
const loadDynamicTestimonials = async () => {
  try {
    if (window.TestimonialService) {
      const { data: testimonials, error } = await window.TestimonialService.getApprovedTestimonials();
      if (error) throw error;

      // 1. Calculate & Render Metrics
      const totalCount = testimonials ? testimonials.length : 0;
      let averageRating = 0;
      let verifiedPercent = 0;

      if (totalCount > 0) {
        const sumRatings = testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0);
        averageRating = (sumRatings / totalCount).toFixed(1);
        
        // Calculate verified percentage based on authenticated user (those with user_id)
        const verifiedCount = testimonials.filter(t => t.user_id).length;
        verifiedPercent = Math.round((verifiedCount / totalCount) * 100);
      }

      // Update DOM metrics elements
      const totalCountEl = document.getElementById("stats-total-count");
      const averageRatingEl = document.getElementById("stats-average-rating");
      const verifiedPercentEl = document.getElementById("stats-verified-percent");

      if (totalCountEl) totalCountEl.textContent = totalCount;
      if (averageRatingEl) averageRatingEl.textContent = totalCount > 0 ? `${averageRating}/5` : "0.0/5";
      if (verifiedPercentEl) verifiedPercentEl.textContent = `${verifiedPercent}%`;

      // 2. Calculate & Render Unique Collaborators
      const uniqueCollabs = [];
      const collabNames = new Set();
      if (testimonials) {
        testimonials.forEach(t => {
          const name = (t.full_name || t.google_name || "Collaborator").trim();
          if (name && !collabNames.has(name.toLowerCase())) {
            collabNames.add(name.toLowerCase());
            uniqueCollabs.push(t);
          }
        });
      }

      // Update Collaborators stack count badge
      const collabsCountEl = document.getElementById("collaborators-badge-count");
      if (collabsCountEl) {
        const countText = uniqueCollabs.length === 1 ? "1 happy collaborator" : `${uniqueCollabs.length} happy collaborators`;
        collabsCountEl.innerHTML = `<span>${countText}</span>`;
      }

      // Update Collaborators avatars list
      const collabsListEl = document.getElementById("collaborator-avatars-list");
      if (collabsListEl) {
        collabsListEl.innerHTML = uniqueCollabs.slice(0, 4).map(c => {
          const displayName = c.full_name || c.google_name || "Collaborator";
          const avatarSrc = c.avatar_url || c.google_avatar || "";
          if (avatarSrc && (avatarSrc.includes('unsplash') || avatarSrc.includes('google') || avatarSrc.includes('http') || avatarSrc.includes('photo-'))) {
            return `<img src="${avatarSrc}" alt="${displayName}" title="${displayName}" />`;
          } else {
            const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
            return `<div class="collaborator-avatar-fallback-initials" title="${displayName}">${initials}</div>`;
          }
        }).join("");
      }

      // 3. Render Carousel cards
      renderTestimonials(testimonials);
    }
  } catch (err) {
    console.warn("Failed to load dynamic testimonials from database, using cached fallback testimonials:", err);
    
    // Fallback static testimonials list (ensures 100% uptime and ad-block resilience)
    const fallbackTestimonials = [
      {
        id: "add625af-010c-4981-829e-9a60fba2b537",
        full_name: "Jarvis",
        designation: "AI Assistant",
        company: "Stark Industries",
        rating: 5,
        testimonial: "Ashok is an exceptional engineer. His attention to detail and ability to craft elegant user experiences is truly outstanding. Working with him has been a masterclass in frontend performance and design precision.",
        user_id: "c776fc06-9da2-4952-8e80-e2f6bf86103a"
      },
      {
        id: "a1cf6a3b-f517-4e01-8f1d-e721fdf9502a",
        full_name: "Ashok V",
        designation: "Sr. Software Engineer",
        company: "PLM Indishtech",
        rating: 5,
        testimonial: "Building high-performance design systems is my passion. This portfolio serves as a playground for advanced UI animations, responsive layouts, and state-of-the-art web architectures.",
        user_id: "c776fc06-9da2-4952-8e80-e2f6bf86103b"
      },
      {
        id: "d3ef58df-d7e5-48c5-9d86-102eb8ba5468",
        full_name: "rohini basava",
        designation: "Mendix Developer",
        company: "Crescenza Consulting group",
        rating: 5,
        testimonial: "Ashok was an exceptional UI/UX developer who had an eye for detail and a deep understanding of user-centered design. His ability to transform complex requirements into intuitive, visually appealing, and user-friendly interfaces made him an invaluable part of every project. Working with him was always a great experience.",
        user_id: "c776fc06-9da2-4952-8e80-e2f6bf86103b"
      }
    ];

    const totalCount = fallbackTestimonials.length;
    const sumRatings = fallbackTestimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const averageRating = (sumRatings / totalCount).toFixed(1);
    const verifiedCount = fallbackTestimonials.filter(t => t.user_id).length;
    const verifiedPercent = Math.round((verifiedCount / totalCount) * 100);

    const totalCountEl = document.getElementById("stats-total-count");
    const averageRatingEl = document.getElementById("stats-average-rating");
    const verifiedPercentEl = document.getElementById("stats-verified-percent");

    if (totalCountEl) totalCountEl.textContent = totalCount;
    if (averageRatingEl) averageRatingEl.textContent = `${averageRating}/5`;
    if (verifiedPercentEl) verifiedPercentEl.textContent = `${verifiedPercent}%`;

    const uniqueCollabs = [];
    const collabNames = new Set();
    fallbackTestimonials.forEach(t => {
      const name = (t.full_name || t.google_name || "Collaborator").trim();
      if (name && !collabNames.has(name.toLowerCase())) {
        collabNames.add(name.toLowerCase());
        uniqueCollabs.push(t);
      }
    });

    const collabsCountEl = document.getElementById("collaborators-badge-count");
    if (collabsCountEl) {
      const countText = uniqueCollabs.length === 1 ? "1 happy collaborator" : `${uniqueCollabs.length} happy collaborators`;
      collabsCountEl.innerHTML = `<span>${countText}</span>`;
    }

    const collabsListEl = document.getElementById("collaborator-avatars-list");
    if (collabsListEl) {
      collabsListEl.innerHTML = uniqueCollabs.slice(0, 4).map(c => {
        const displayName = c.full_name || c.google_name || "Collaborator";
        const avatarSrc = c.avatar_url || c.google_avatar || "";
        if (avatarSrc && (avatarSrc.includes('unsplash') || avatarSrc.includes('google') || avatarSrc.includes('http') || avatarSrc.includes('photo-'))) {
          return `<img src="${avatarSrc}" alt="${displayName}" title="${displayName}" />`;
        } else {
          const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
          return `<div class="collaborator-avatar-fallback-initials" title="${displayName}">${initials}</div>`;
        }
      }).join("");
    }

    renderTestimonials(fallbackTestimonials);
  }
};

// Dynamic certifications load helper
const loadDynamicCertifications = async () => {
  try {
    if (window.CertificationService) {
      const { data: certifications, error } = await window.CertificationService.getPublishedCertifications();
      if (error) throw error;

      const totalCount = certifications ? certifications.length : 0;
      const verifiedCount = certifications ? certifications.filter(c => (c.credential_url && c.credential_url.trim() !== "") || c.certificate_file_url).length : 0;
      const verifiedPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

      // Update trust panel title texts using classes
      const trustTitles = document.querySelectorAll('.certifications-trust-panel-v2 .trust-stat-title');
      if (trustTitles && trustTitles.length >= 2) {
        trustTitles[0].textContent = totalCount > 0 ? `${totalCount}+` : "0";
        trustTitles[1].textContent = `${verifiedPercent}%`;
      }

      // 2. Derive Unique Providers
      const uniqueProviders = [];
      const seenProviders = new Set();
      if (certifications) {
        certifications.forEach(c => {
          if (c.issuer) {
            const norm = c.issuer.toLowerCase().trim();
            if (!seenProviders.has(norm)) {
              seenProviders.add(norm);
              uniqueProviders.push({
                name: c.issuer,
                iconUrl: c.certificate_image_url || null
              });
            }
          }
        });
      }

      // Respect the 6 provider cards limit
      const maxProviders = uniqueProviders.slice(0, 6);

      // Render grid
      const gridEl = document.querySelector('.certifications-grid-v2');
      if (gridEl) {
        if (maxProviders.length === 0) {
          gridEl.innerHTML = `<div style="grid-column: span 6; text-align: center; color: #94A3B8; padding: 40px 0; font-size: 14px;">No certifications published yet.</div>`;
        } else {
          // Inner helper function to get SVG / Webp logo brandmark
          const getProviderLogo = (name, iconUrl) => {
            if (iconUrl && iconUrl.trim() !== '') {
              return `<img src="${iconUrl}" alt="${name}" style="height: 32px; width: auto; object-fit: contain;" />`;
            }
            const key = name.toLowerCase().trim();
            if (key.includes('mendix')) {
              return `<img src="assets/images/Mendix-Brandmark.webp" alt="Mendix" style="height: 32px; width: auto; object-fit: contain;" />`;
            }
            if (key.includes('google')) {
              return `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #60A5FA;">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.14 1 3 5.14 3 10.25s4.14 9.25 9.24 9.25c5.32 0 8.86-3.72 8.86-9.01 0-.61-.06-1.08-.14-1.54H12.24z"/>
              </svg>`;
            }
            if (key.includes('aws') || key.includes('amazon')) {
              return `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #F59E0B;">
                <path d="M11.625 15.783c-1.189 0-2.18-.152-2.973-.456-.793-.304-1.229-.685-1.31-1.144-.066-.379.083-.75.446-1.112.363-.362.908-.667 1.636-.916.727-.248 1.656-.424 2.787-.528l2.673-.243v1.39c0 .736-.188 1.282-.564 1.637-.376.356-.99.534-1.84.534m3.048-6.147v1.73l-2.423.23c-1.393.13-2.483.364-3.272.705-.789.34-1.34.786-1.655 1.336-.314.55-.471 1.157-.471 1.823 0 .973.307 1.737.92 2.293.614.555 1.492.833 2.634.833 1.082 0 1.986-.226 2.711-.678a4.877 4.877 0 0 0 1.684-1.874h.084c.121.666.333 1.168.636 1.505.303.337.755.505 1.356.505.47 0 .973-.105 1.511-.314a13.38 13.38 0 0 0 1.51-.714V14.86c0-.987-.042-1.921-.125-2.802-.083-.88-.242-1.66-.477-2.339a5.147 5.147 0 0 0-1.042-1.874c-.496-.549-1.194-.973-2.096-1.272-.9-.3-2.023-.45-3.37-.45-1.42 0-2.585.185-3.493.555a6.666 6.666 0 0 0-2.33 1.585l1.323 1.306c.49-.496.99-.861 1.5-1.096.51-.235 1.176-.353 2.0-.353.94 0 1.636.19 2.09.569.453.38.68.959.68 1.738"/>
                <path d="M12.046 22.094c3.488 0 6.634-1.22 8.784-3.213.303-.28.1-.733-.303-.64-2.883.666-6.425.992-9.743.992-3.473 0-7.253-.36-10.158-1.092-.394-.1-.594.364-.285.64 2.224 1.993 5.485 3.313 9.705 3.313m8.948-4.053c-.328-.426-1.503-.186-2.073-.092-.188.03-.236-.18-.073-.314.509-.42 1.485-.363 1.867.042.382.404-.036 1.442-.442 1.916-.134.155-.31.066-.273-.146.115-.658.322-.98.994-1.406"/>
              </svg>`;
            }
            if (key.includes('microsoft')) {
              return `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M2 2h9.5v9.5H2V2zm10.5 0H22v9.5h-9.5V2zM2 12.5h9.5V22H2v-9.5zm10.5 0H22V22h-9.5v-9.5z" fill="#F25022"/>
              </svg>`;
            }
            if (key.includes('meta')) {
              return `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #0668E1;">
                <path d="M22.5 12c0-3.32-2.7-6-6-6-2.22 0-4.14 1.2-5.16 3-1.02-1.8-2.94-3-5.16-3-3.3 0-6 2.68-6 6 0 3.31 2.7 6 6 6 2.22 0 4.14-1.2 5.16-3 1.02 1.8 2.94 3 5.16 3 3.3 0 6-2.69 6-6zm-17.34 4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm11.68 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>`;
            }
            if (key.includes('linux')) {
              return `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #64748B;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>`;
            }
            return `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#7C5CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>`;
          };

          gridEl.innerHTML = maxProviders.map(provider => `
            <div class="provider-logo-card">
              <div class="provider-logo-container">
                ${getProviderLogo(provider.name, provider.iconUrl)}
              </div>
              <span class="provider-name">${provider.name}</span>
              <div class="provider-glow-dot"></div>
            </div>
          `).join('');
        }
      }
    }
  } catch (err) {
    console.error("Failed to load dynamic certifications:", err);
  }
};

// Dynamic projects highlights load helper
const loadDynamicProjects = async () => {
  try {
    if (window.ProjectService) {
      const { data: projects, error } = await window.ProjectService.getPublishedProjects();
      if (error) throw error;

      // 1. Projects Delivered: count of published projects
      const totalPublished = projects ? projects.length : 0;
      const projectsDeliveredEl = document.getElementById('stat-projects-delivered');
      if (projectsDeliveredEl) {
        projectsDeliveredEl.textContent = `${totalPublished}+`;
      }

      // 2. Industries Served: unique industries (categories)
      const uniqueIndustries = new Set();
      const seenLower = new Set();
      if (projects) {
        projects.forEach(p => {
          if (p.category) {
            const industry = p.category.trim();
            const lower = industry.toLowerCase();
            if (industry && !seenLower.has(lower)) {
              seenLower.add(lower);
              uniqueIndustries.add(industry);
            }
          }
        });
      }
      const totalIndustries = uniqueIndustries.size;
      const industriesServedEl = document.getElementById('stat-industries-served');
      if (industriesServedEl) {
        industriesServedEl.textContent = `${totalIndustries}+`;
      }
    }
  } catch (err) {
    console.warn('Failed to load dynamic projects stats:', err);
    // Fallback UI
    const projectsDeliveredEl = document.getElementById('stat-projects-delivered');
    if (projectsDeliveredEl) {
      projectsDeliveredEl.textContent = '0+';
    }
    const industriesServedEl = document.getElementById('stat-industries-served');
    if (industriesServedEl) {
      industriesServedEl.textContent = '0+';
    }
  }
};

// Geolocation caching for resume downloads
let cachedGeoData = { ip_address: 'Unknown', country: 'Unknown', city: 'Unknown' };
const prefetchGeoData = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      cachedGeoData = {
        ip_address: data.ip || 'Unknown',
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown'
      };
    }
  } catch (err) {
    console.warn('Geolocation prefetch failed:', err);
  }
};
prefetchGeoData();

// Helper for UUID / random ID generation
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Retrieve or generate visitor_id and session_id
const getVisitorId = () => {
  let vId = localStorage.getItem('visitor_id');
  if (!vId) {
    vId = generateId();
    localStorage.setItem('visitor_id', vId);
  }
  return vId;
};

const getSessionId = () => {
  let sId = sessionStorage.getItem('session_id');
  if (!sId) {
    sId = generateId();
    sessionStorage.setItem('session_id', sId);
  }
  return sId;
};

const getDeviceDetails = () => {
  const ua = navigator.userAgent;
  let browser = 'Other';
  let os = 'Other';
  let deviceType = 'Desktop';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Trident')) browser = 'Internet Explorer';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    deviceType = /Tablet|iPad/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  return { browser, os, deviceType, userAgent: ua };
};

// Dynamic resume settings load helper
const loadDynamicResume = async () => {
  const downloadResumeBtn = document.querySelector('.profile-actions .profile-action-primary');
  const viewOnlineBtn = document.querySelector('.profile-actions .profile-action-secondary');
  
  if (!downloadResumeBtn || !viewOnlineBtn) return;

  const primarySpan = downloadResumeBtn.querySelector('span');
  const secondarySpan = viewOnlineBtn.querySelector('span');

  if (primarySpan) primarySpan.textContent = 'Loading...';

  try {
    if (window.ResumeService) {
      const { data: activeResume, error } = await window.ResumeService.getActiveResume();
      
      if (error || !activeResume || !activeResume.public_url) {
        throw new Error(error ? error.message : 'No active resume found');
      }

      // 1. Setup Download Button
      if (primarySpan) primarySpan.textContent = 'Download Resume';
      downloadResumeBtn.setAttribute('href', '#');
      downloadResumeBtn.removeAttribute('target');
      downloadResumeBtn.removeAttribute('rel');
      downloadResumeBtn.removeAttribute('aria-label');
      downloadResumeBtn.setAttribute('aria-label', `Download Ashok's active resume PDF directly`);
      
      // Clear previous click event listeners if any
      const newDownloadBtn = downloadResumeBtn.cloneNode(true);
      downloadResumeBtn.parentNode.replaceChild(newDownloadBtn, downloadResumeBtn);

      newDownloadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const btnSpan = newDownloadBtn.querySelector('span');
        const originalText = btnSpan.textContent;
        btnSpan.textContent = 'Downloading...';

        let downloadRecord = null;
        try {
          // Perform a fresh dynamic query at the moment of the click
          const { data: latestResume, error: fetchErr } = await window.ResumeService.getActiveResume();
          if (fetchErr || !latestResume || !latestResume.public_url) {
            throw new Error(fetchErr ? fetchErr.message : 'No active resume found dynamically');
          }

          // Dynamically update the View Online href and title in case they changed
          viewOnlineBtn.setAttribute('href', latestResume.preview_url || latestResume.public_url);
          viewOnlineBtn.setAttribute('aria-label', "Open Ashok's active resume preview in a new tab");

          const device = getDeviceDetails();
          // 1. Create a download record in database
          const downloadPayload = {
            resume_id: latestResume.id,
            session_id: getSessionId(),
            visitor_id: getVisitorId(),
            page_source: window.location.pathname || '/',
            referrer: document.referrer || '',
            user_agent: device.userAgent,
            browser: device.browser,
            operating_system: device.os,
            device_type: device.deviceType,
            country: cachedGeoData.country,
            city: cachedGeoData.city,
            ip_address: cachedGeoData.ip_address,
            download_status: 'completed'
          };

          const { data, error: logError } = await window.ResumeService.logResumeDownload(downloadPayload);
          if (logError) throw logError;
          downloadRecord = data;

          // 2. Trigger file download
          const response = await fetch(latestResume.public_url);
          if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = latestResume.file_name || 'Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
          console.error('Download tracking or file retrieval failed:', err);
          
          // Fallback using activeResume (loaded on page load)
          const fallbackUrl = (activeResume && activeResume.public_url) || '';
          if (fallbackUrl) {
            // Update status to failed if record was logged
            if (downloadRecord && downloadRecord.id) {
              try {
                await window.ResumeService.updateDownloadStatus(downloadRecord.id, 'failed');
              } catch (updateErr) {
                console.error('Failed to update download status:', updateErr);
              }
            }
            window.open(fallbackUrl, '_blank');
          } else {
            if (window.showToast) {
              window.showToast('error', 'Download Failed', 'Could not retrieve active resume.', 4000);
            }
          }
        } finally {
          btnSpan.textContent = originalText;
        }
      });

      // 2. Setup View Online Button
      if (secondarySpan) secondarySpan.textContent = 'View Online';
      viewOnlineBtn.setAttribute('href', activeResume.preview_url || activeResume.public_url);
      viewOnlineBtn.setAttribute('target', '_blank');
      viewOnlineBtn.setAttribute('rel', 'noopener noreferrer');
      viewOnlineBtn.removeAttribute('aria-label');
      viewOnlineBtn.setAttribute('aria-label', "Open Ashok's active resume preview in a new tab");
      viewOnlineBtn.style.opacity = '1';
      viewOnlineBtn.style.pointerEvents = 'auto';
      viewOnlineBtn.style.cursor = 'pointer';
    } else {
      throw new Error('ResumeService not initialized');
    }
  } catch (err) {
    console.error('Failed to load active resume:', err);
    if (primarySpan) primarySpan.textContent = 'Resume Unavailable';
    if (secondarySpan) secondarySpan.textContent = 'View Online';

    // Clear previous click event listeners on download button
    const newDownloadBtn = downloadResumeBtn.cloneNode(true);
    downloadResumeBtn.parentNode.replaceChild(newDownloadBtn, downloadResumeBtn);
    newDownloadBtn.setAttribute('href', '#');
    newDownloadBtn.style.opacity = '0.5';
    newDownloadBtn.style.pointerEvents = 'none';
    newDownloadBtn.style.cursor = 'not-allowed';

    // Clear previous click event listeners on view online button
    const newViewOnlineBtn = viewOnlineBtn.cloneNode(true);
    viewOnlineBtn.parentNode.replaceChild(newViewOnlineBtn, viewOnlineBtn);
    newViewOnlineBtn.setAttribute('href', '#');
    newViewOnlineBtn.style.opacity = '0.5';
    newViewOnlineBtn.style.pointerEvents = 'none';
    newViewOnlineBtn.style.cursor = 'not-allowed';
  }
};

loadDynamicResume();

const initSmoothScrolling = () => {
  if (typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // Keep native touch scroll on mobile
  });

  window.lenis = lenis;

  // Integrate with GSAP ScrollTrigger if available
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    lenis.on("scroll", window.ScrollTrigger.update);

    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    window.gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback if GSAP/ScrollTrigger are not available
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Neon Reading Progress Bar
  if (!prefersReducedMotion) {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress-bar";
    document.body.appendChild(progressBar);

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.to(progressBar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    } else {
      const updateProgressFallback = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
      };
      lenis.on("scroll", updateProgressFallback);
    }
  }

  // Interactive Velocity-based Card Skewing
  if (!prefersReducedMotion && window.gsap && window.ScrollTrigger) {
    const skewElements = document.querySelectorAll(
      ".expertise-card, .build-node, .portfolio-display-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .wall-card"
    );

    if (skewElements.length > 0) {
      let skewProxy = { skew: 0 };
      const skewSetter = window.gsap.quickSetter(skewElements, "skewY", "deg");
      const clampSkew = window.gsap.utils.clamp(-2.5, 2.5); // max 2.5 degrees for premium feel

      window.ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skewVal = clampSkew(velocity / -350);
          
          if (Math.abs(skewVal) > Math.abs(skewProxy.skew)) {
            skewProxy.skew = skewVal;
            window.gsap.to(skewProxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3.out",
              overwrite: "auto",
              onUpdate: () => skewSetter(skewProxy.skew),
            });
          }
        },
      });

      // Align transform origin to center
      window.gsap.set(skewElements, { transformOrigin: "center center", force3D: true });
    }
  }
};

// Initialize after page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSmoothScrolling);
} else {
  initSmoothScrolling();
}

// --- Static Navbar Authentication Setup ---
const setupNavbarAuth = async () => {
  const container = document.getElementById("navbar-auth-container");
  if (!container || !window.AuthService) return;

  const getAdminUrl = () => {
    let base = window.location.pathname;
    if (base.endsWith('.html')) {
      base = base.substring(0, base.lastIndexOf('/') + 1);
    }
    if (!base.endsWith('/')) {
      base += '/';
    }
    const adminIndex = base.indexOf('/admin/');
    if (adminIndex !== -1) {
      base = base.substring(0, adminIndex + 1);
    }
    return base + 'admin/';
  };

  let dropdownOpen = false;

  const renderDropdown = async (user) => {
    const avatar = user.user_metadata?.avatar_url || "";
    const name = user.user_metadata?.full_name || user.email.split("@")[0];
    const email = (user.email || "").trim().toLowerCase();

    // Retrieve and verify administrator privileges with caching
    let isAdmin = false;
    const cached = sessionStorage.getItem(`is_admin_${email}`);
    
    console.log('Authenticated Email:', email);

    if (cached === 'true') {
      isAdmin = true;
      console.log(`isAdmin from cache: ${isAdmin}`);
    } else {
      try {
        const { data, error } = await window.AuthService.supabase
          .from('admins')
          .select('email, role, is_active')
          .eq('email', email)
          .maybeSingle();

        console.log('Admin Query Result:', { data, error });

        if (!error && data && data.is_active === true) {
          isAdmin = true;
          sessionStorage.setItem(`is_admin_${email}`, 'true');
        } else {
          sessionStorage.setItem(`is_admin_${email}`, 'false');
        }
        console.log(`isAdmin: ${isAdmin}`);
      } catch (err) {
        console.error('[Navbar Auth] Failed to check admin status:', err);
      }
    }

    const avatarHtml = `<div class="avatar-mount-point" data-image-url="${avatar || ''}" data-display-name="${name}" data-class-name="navbar-user-avatar"></div>`;
    const dropdownAvatarHtml = `<div class="avatar-mount-point" data-image-url="${avatar || ''}" data-display-name="${name}" data-class-name="dropdown-user-header-avatar"></div>`;

    container.innerHTML = `
      <button type="button" class="navbar-user-avatar-btn" id="navbar-user-btn" aria-label="Open user menu" aria-expanded="false">
        ${avatarHtml}
      </button>
      <div class="navbar-user-dropdown" id="navbar-user-dropdown">
        <div class="dropdown-user-header">
          ${dropdownAvatarHtml}
          <div class="dropdown-user-info">
            <span class="dropdown-user-name">${name}</span>
            <span class="dropdown-user-email">${email}</span>
          </div>
        </div>
        ${isAdmin ? `
          <div class="dropdown-divider"></div>
          <a href="${getAdminUrl()}" id="navbar-admin-btn" 
             onmouseenter="this.style.background='rgba(143, 133, 255, 0.16)'; this.style.borderColor='rgba(143, 133, 255, 0.3)';" 
             onmouseleave="this.style.background='rgba(143, 133, 255, 0.08)'; this.style.borderColor='rgba(143, 133, 255, 0.15)';"
             style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 36px; background: rgba(143, 133, 255, 0.08); border: 1px solid rgba(143, 133, 255, 0.15); border-radius: 10px; color: #8f85ff; font-size: 12.5px; font-weight: 600; text-decoration: none; margin-bottom: 4px; transition: all 250ms ease;">
            <span>👑 Admin Dashboard</span>
          </a>
        ` : ''}
        <div class="dropdown-divider"></div>
        <button type="button" class="dropdown-logout-btn" id="navbar-logout-btn">
          <span>Sign Out</span>
        </button>
      </div>
    `;

    container.querySelectorAll(".avatar-mount-point").forEach(el => {
      const imageUrl = el.getAttribute("data-image-url");
      const nameVal = el.getAttribute("data-display-name");
      const className = el.getAttribute("data-class-name");
      const root = ReactDOM.createRoot(el);
      root.render(<Avatar imageUrl={imageUrl} displayName={nameVal} className={className} />);
    });

    const userBtn = container.querySelector("#navbar-user-btn");
    const dropdown = container.querySelector("#navbar-user-dropdown");
    const logoutBtn = container.querySelector("#navbar-logout-btn");

    userBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownOpen = !dropdownOpen;
      dropdown?.classList.toggle("is-open", dropdownOpen);
      userBtn.setAttribute("aria-expanded", String(dropdownOpen));
    });

    logoutBtn?.addEventListener("click", async () => {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = "<span>Signing out...</span>";
      try {
        const { error } = await window.AuthService.signOut();
        if (error) throw error;
        showToast("success", "Signed Out", "You have successfully signed out.");
      } catch (err) {
        showToast("error", "Sign Out Failed", err.message || "An error occurred.");
        logoutBtn.disabled = false;
        logoutBtn.innerHTML = "<span>Sign Out</span>";
      }
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      if (dropdownOpen && !container.contains(e.target)) {
        dropdownOpen = false;
        dropdown?.classList.remove("is-open");
        userBtn?.setAttribute("aria-expanded", "false");
      }
    });
  };

  const renderLoginButton = (isLoading = false) => {
    container.innerHTML = `
      <button type="button" class="profile-action profile-action-primary" id="fallback-login-btn" ${isLoading ? "disabled" : ""}>
        ${isLoading ? `
          <span class="auth-spinner" style="width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #ffffff; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;"></span>
          <span>Connecting...</span>
        ` : `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 6px;">
            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.7l2.4-2.4C17.3 1.5 14.9 0 12.24 0c-6.08 0-11 4.92-11 11s4.92 11 11 11c5.73 0 10.2-4.1 10.2-11 0-.74-.08-1.46-.2-2.115H12.24z" />
          </svg>
          <span>Sign in with Google</span>
        `}
      </button>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;

    const loginBtn = container.querySelector("#fallback-login-btn");
    loginBtn?.addEventListener("click", async () => {
      renderLoginButton(true);
      try {
        const { data, error } = await window.AuthService.signInWithGoogle();
        if (error) throw error;

        if (data?.url) {
          const width = 520;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          const authPopup = window.open(
            data.url,
            'Google Auth',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
          );

          const popupInterval = setInterval(() => {
            if (!authPopup || authPopup.closed) {
              clearInterval(popupInterval);
              setTimeout(async () => {
                const user = await window.AuthService.getCurrentUser();
                if (!user) {
                  showToast("error", "Login Cancelled", "Google sign-in popup was closed.");
                  renderLoginButton(false);
                }
              }, 500);
            }
          }, 800);
        }
      } catch (err) {
        showToast("error", "Authentication Failed", err.message || "An error occurred.");
        renderLoginButton(false);
      }
    });
  };

  // Check initial state
  const user = await window.AuthService.getCurrentUser();
  if (user) {
    renderDropdown(user);
  } else {
    renderLoginButton(false);
  }

  // Subscribe to auth state updates
  window.AuthService.onAuthStateChange((event, session) => {
    if (session?.user) {
      renderDropdown(session.user);
    } else {
      renderLoginButton(false);
    }
  });

  // Handle popup window messaging redirect callbacks
  window.addEventListener('message', async (event) => {
    if (event.origin !== window.location.origin && event.origin !== "null") return;
    if (event.data?.type === 'supabase-oauth-callback') {
      if (event.data.status === 'success') {
        try {
          const { data, error } = await window.AuthService.setSession(event.data.hash);
          if (error) throw error;
          const user = await window.AuthService.getCurrentUser();
          if (user) renderDropdown(user);
        } catch (e) {
          showToast("error", "Session Error", e.message || "Failed to configure user session.");
          renderLoginButton(false);
        }
      } else {
        showToast("error", "Authentication Failed", "Google sign-in was not successful.");
        renderLoginButton(false);
      }
    }
  });
};

// Start setup
if (window.AuthService) {
  setupNavbarAuth();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.AuthService) setupNavbarAuth();
  });
}

// Initialize Dynamic Social Links configuration
const initDynamicSocialLinks = async () => {
  if (!window.SocialLinksService) return;
  try {
    const links = await window.SocialLinksService.getLinks();
    const linkMap = {};
    links.forEach(item => {
      if (item.platform && item.url) {
        linkMap[item.platform.toLowerCase()] = item.url.trim();
      }
    });

    window.configuredSocialLinks = linkMap;

    const socialElements = document.querySelectorAll("[data-social-key]");
    const prefersMobileWhatsApp = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;

    socialElements.forEach(el => {
      const key = el.dataset.socialKey.toLowerCase();
      const url = linkMap[key];

      if (!url) {
        el.href = '#';
        if (key === 'email' && (el.textContent.includes('@') || el.textContent === 'Not Configured')) {
          el.textContent = 'Not Configured';
        }
        return;
      }

      if (key === 'whatsapp') {
        let desktopUrl = url;
        if (url.includes("wa.me/")) {
          desktopUrl = url.replace("wa.me/", "web.whatsapp.com/send?phone=");
          const firstQuestionIdx = desktopUrl.indexOf('?');
          if (firstQuestionIdx !== -1) {
            const secondQuestionIdx = desktopUrl.indexOf('?', firstQuestionIdx + 1);
            if (secondQuestionIdx !== -1) {
              desktopUrl = desktopUrl.substring(0, secondQuestionIdx) + '&' + desktopUrl.substring(secondQuestionIdx + 1);
            }
          }
        }
        el.dataset.mobileHref = url;
        el.dataset.desktopHref = desktopUrl;
        el.href = prefersMobileWhatsApp ? url : desktopUrl;
      } else if (key === 'email') {
        const mailtoUrl = url.startsWith('mailto:') ? url : `mailto:${url}`;
        el.href = mailtoUrl;
        
        // Update text content if it shows an email address
        const emailText = url.startsWith('mailto:') ? url.substring(7) : url;
        if (el.textContent.includes('@') || el.textContent === 'Not Configured') {
          el.textContent = emailText;
        }
      } else {
        const absoluteUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        el.href = absoluteUrl;
      }
    });
  } catch (err) {
    console.error("Failed to initialize dynamic social links:", err);
  }
};

// Global interceptor for unconfigured links
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[data-social-key]');
  if (!anchor) return;
  
  const key = anchor.dataset.socialKey.toLowerCase();
  const url = window.configuredSocialLinks ? window.configuredSocialLinks[key] : null;
  
  if (!url || !url.trim()) {
    e.preventDefault();
    const platformNames = {
      linkedin: 'LinkedIn profile',
      github: 'GitHub profile',
      behance: 'Behance profile',
      email: 'Email address',
      whatsapp: 'WhatsApp number',
      instagram: 'Instagram profile'
    };
    const name = platformNames[key] || key;
    if (window.showToast) {
      window.showToast('info', 'Link Not Configured', `${name} has not been configured yet.`, 5000);
    } else {
      alert(`${name} has not been configured yet.`);
    }
  }
});

if (window.SocialLinksService) {
  initDynamicSocialLinks();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    if (window.SocialLinksService) initDynamicSocialLinks();
  });
}

// Reading Mode transitions and setup
let lastClickedReadMoreBtn = null;

const updateExpandedCard = (index, animate = true) => {
  try {
    const testimonial = dynamicTestimonials[index];
    if (!testimonial) {
      console.warn("Testimonial not found at index:", index);
      return;
    }

    const starsHtml = '★'.repeat(testimonial.rating || 5) + '☆'.repeat(5 - (testimonial.rating || 5));
    const displayName = testimonial.full_name || testimonial.google_name || "Collaborator";
    const avatarSrc = testimonial.avatar_url || testimonial.google_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
    const roleStr = testimonial.designation ? (testimonial.company ? `${testimonial.designation} &bull; ${testimonial.company}` : testimonial.designation) : (testimonial.company || "Collaborator");

    const cardBody = document.querySelector(".reading-card-body");
    const authorName = document.querySelector("#reading-author-name");
    const authorTitle = document.querySelector("#reading-author-title");
    const avatarSlot = document.querySelector("#reading-avatar-slot");
    const counterEl = document.querySelector("#reading-counter");

    // Parse raw text into HTML paragraphs
    const formattedTestimonial = (testimonial.testimonial || "")
      .split(/\n\s*\n/)
      .map(para => `<p>${para.replace(/\n/g, "<br>")}</p>`)
      .join("");

    const updateDOM = () => {
      const starsEl = document.querySelector("#reading-stars");
      const textEl = document.querySelector("#reading-text");
      if (starsEl) starsEl.innerHTML = starsHtml;
      if (textEl) textEl.innerHTML = formattedTestimonial;
      if (authorName) authorName.textContent = displayName;
      if (authorTitle) authorTitle.innerHTML = roleStr;
      if (avatarSlot) {
        const root = avatarSlot._reactRoot || ReactDOM.createRoot(avatarSlot);
        avatarSlot._reactRoot = root;
        root.render(<Avatar imageUrl={avatarSrc} displayName={displayName} className="popover-avatar" size={48} style={{ borderRadius: "50%", objectFit: "cover" }} />);
      }
      if (counterEl) counterEl.textContent = `${index + 1} of ${dynamicTestimonials.length}`;
    };

    if (animate && cardBody) {
      cardBody.style.opacity = "0";
      cardBody.style.transform = "translateY(10px)";
      cardBody.style.transition = "opacity 200ms ease, transform 200ms ease";

      setTimeout(() => {
        updateDOM();
        cardBody.style.opacity = "1";
        cardBody.style.transform = "translateY(0)";
      }, 200);
    } else {
      updateDOM();
    }
  } catch (error) {
    console.error("Error inside updateExpandedCard:", error);
  }
};

const enterReadingMode = (index) => {
  isReadingModeActive = true;
  currentReadingIndex = index;
  previousScrollY = window.scrollY;

  // Save the trigger element for focus recovery
  lastClickedReadMoreBtn = document.activeElement;

  const section = document.querySelector("#heard");
  section?.classList.add("reading-mode-active");
  document.body.classList.add("reading-mode-on");

  // Lock background scroll library
  if (window.lenis) {
    window.lenis.stop();
  }

  // Fade out carousel wrapper
  const carouselWrapper = document.querySelector(".wall-carousel-wrapper");
  if (carouselWrapper) {
    carouselWrapper.style.opacity = "0";
    carouselWrapper.style.pointerEvents = "none";
    carouselWrapper.style.transition = "opacity 400ms ease";
  }

  // Fade/slide in expanded wrapper
  const readingWrapper = document.querySelector("#reading-card-wrapper");
  if (readingWrapper) {
    readingWrapper.style.display = "flex";
    readingWrapper.offsetHeight; // Force reflow
    readingWrapper.style.opacity = "1";
  }

  updateExpandedCard(index, false);
  
  // Set accessibility focus
  setTimeout(() => {
    document.querySelector("#reading-close-btn")?.focus();
  }, 100);
};

const exitReadingMode = () => {
  isReadingModeActive = false;

  const section = document.querySelector("#heard");
  section?.classList.remove("reading-mode-active");
  document.body.classList.remove("reading-mode-on");

  // Restore scroll library
  if (window.lenis) {
    window.lenis.start();
  }

  // Fade back in carousel wrapper
  const carouselWrapper = document.querySelector(".wall-carousel-wrapper");
  if (carouselWrapper) {
    carouselWrapper.style.opacity = "1";
    carouselWrapper.style.pointerEvents = "auto";
  }

  // Collapse expanded card wrapper
  const readingWrapper = document.querySelector("#reading-card-wrapper");
  if (readingWrapper) {
    readingWrapper.style.opacity = "0";
    setTimeout(() => {
      readingWrapper.style.display = "none";
    }, 500);
  }

  // Return focus to previous trigger
  if (lastClickedReadMoreBtn) {
    lastClickedReadMoreBtn.focus();
  }

  // Smooth scroll back to position
  window.scrollTo({
    top: previousScrollY,
    behavior: "smooth"
  });
};

// Wire controls
const wireControls = () => {
  const closeBtn = document.querySelector("#reading-close-btn");
  const prevBtn = document.querySelector("#reading-prev-btn");
  const nextBtn = document.querySelector("#reading-next-btn");

  closeBtn?.addEventListener("click", exitReadingMode);

  prevBtn?.addEventListener("click", () => {
    if (dynamicTestimonials.length > 0) {
      currentReadingIndex = (currentReadingIndex - 1 + dynamicTestimonials.length) % dynamicTestimonials.length;
      updateExpandedCard(currentReadingIndex, true);
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (dynamicTestimonials.length > 0) {
      currentReadingIndex = (currentReadingIndex + 1) % dynamicTestimonials.length;
      updateExpandedCard(currentReadingIndex, true);
    }
  });

  // Escape key support, Left/Right arrow navigation, and Focus trapping
  window.addEventListener("keydown", (e) => {
    if (!isReadingModeActive) return;

    if (e.key === "Escape") {
      exitReadingMode();
      return;
    }

    if (e.key === "ArrowLeft") {
      prevBtn?.click();
      return;
    }

    if (e.key === "ArrowRight") {
      nextBtn?.click();
      return;
    }

    // Intercept scroll-related keys to scroll the testimonial body directly
    const scrollContainer = document.querySelector(".reading-card-body");
    if (scrollContainer) {
      const scrollSpeed = 50; // pixels per Arrow keypress
      const pageSpeed = scrollContainer.clientHeight - 40; // pixels for PageUp/Down
      
      if (e.key === "ArrowUp") {
        scrollContainer.scrollTop -= scrollSpeed;
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowDown") {
        scrollContainer.scrollTop += scrollSpeed;
        e.preventDefault();
        return;
      }
      if (e.key === "PageUp") {
        scrollContainer.scrollTop -= pageSpeed;
        e.preventDefault();
        return;
      }
      if (e.key === "PageDown") {
        scrollContainer.scrollTop += pageSpeed;
        e.preventDefault();
        return;
      }
      if (e.key === " " && document.activeElement !== closeBtn && document.activeElement !== prevBtn && document.activeElement !== nextBtn) {
        if (e.shiftKey) {
          scrollContainer.scrollTop -= pageSpeed;
        } else {
          scrollContainer.scrollTop += pageSpeed;
        }
        e.preventDefault();
        return;
      }
    }

    if (e.key === "Tab") {
      const card = document.querySelector("#reading-card");
      if (!card) return;

      const focusableSelectors = 'button, [tabindex="0"]';
      const focusables = Array.from(card.querySelectorAll(focusableSelectors)).filter(
        el => el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled
      );

      if (focusables.length === 0) return;

      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Load dynamic data after all scripts and services are fully initialized
  loadDynamicTestimonials();
  loadDynamicCertifications();
  loadDynamicProjects();
};

const initApp = () => {
  if (window.CertificationService && window.supabase && window.APP_CONFIG) {
    wireControls();
  } else {
    setTimeout(initApp, 50);
  }
};

initApp();

