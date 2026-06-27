const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const cursorLight = document.querySelector(".cursor-light");
const magneticItems = document.querySelectorAll(".magnetic");
const expertiseGrid = document.querySelector("[data-expertise-grid]");
const buildFlow = document.querySelector("[data-build-flow]");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-container a[href^="#"]');
const projectNavLinks = document.querySelectorAll('.project-nav a[href^="#"]');
const floatingProjectNav = document.querySelector(".medi-subnav, .ds-subnav");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const contactForm = document.querySelector("[data-contact-form]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersMobileWhatsApp = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;

whatsappLinks.forEach((link) => {
  link.href = prefersMobileWhatsApp ? link.dataset.mobileHref : link.dataset.desktopHref;
});

const contactToast = document.createElement("div");
contactToast.className = "contact-toast";
contactToast.setAttribute("role", "status");
contactToast.setAttribute("aria-live", "polite");

const showContactToast = (type, title, message) => {
  contactToast.dataset.status = type;
  const iconPath = type === "success"
    ? '<path d="M20 6 9 17l-5-5"/>'
    : '<path d="M12 8v5"/><path d="M12 17h.01"/><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>';

  contactToast.innerHTML = `
    <span class="contact-toast-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">${iconPath}</svg>
    </span>
    <span class="contact-toast-copy">
      <strong></strong>
      <span></span>
    </span>
  `;

  contactToast.querySelector("strong").textContent = title;
  contactToast.querySelector(".contact-toast-copy span").textContent = message;

  if (!contactToast.isConnected) {
    document.body.appendChild(contactToast);
  }

  window.clearTimeout(showContactToast.timeoutId);
  contactToast.classList.add("is-visible");

  showContactToast.timeoutId = window.setTimeout(() => {
    contactToast.classList.remove("is-visible");
  }, 5600);
};

const setContactSubmitState = (form, isSubmitting) => {
  const submitButton = form.querySelector(".contact-submit");
  const submitLabel = submitButton?.querySelector("span");

  if (!submitButton || !submitLabel) return;

  submitButton.disabled = isSubmitting;
  submitButton.setAttribute("aria-busy", String(isSubmitting));
  submitLabel.textContent = isSubmitting ? "Sending..." : "Send Message";
};

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const accessKey = contactForm.querySelector('[name="access_key"]')?.value.trim();
  if (!accessKey || accessKey === "PASTE_WEB3FORMS_ACCESS_KEY_HERE") {
    showContactToast(
      "error",
      "Email key missing.",
      "Add your Web3Forms access key in the contact form, then messages will come directly to your inbox."
    );
    return;
  }

  setContactSubmitState(contactForm, true);

  try {
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData);

    const response = await fetch(contactForm.action, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Message request failed");
    }

    contactForm.reset();
    showContactToast(
      "success",
      "Message sent successfully.",
      "Thanks for reaching out. I'll review your message and get back to you as soon as possible."
    );
  } catch (error) {
    showContactToast(
      "error",
      "Message did not send.",
      error.message || "Please try again in a moment, or email Ashok directly at ashokvangapandu45@gmail.com."
    );
  } finally {
    setContactSubmitState(contactForm, false);
  }
});

const expertise = [
  {
    title: "Mendix",
    icon: "mendix-brand",
    signal: "Low-code delivery",
    desc1: "Scalable enterprise apps with Atlas UI, microflows, and end-to-end cloud deployment.",
    chips: ["Atlas UI", "Microflows"],
    score: 92,
    tone: "#a78bfa"
  },
  {
    title: "Figma",
    icon: "figma-brand",
    signal: "Product design",
    desc1: "Pixel-perfect wireframing, prototyping, and component systems dev-ready from day one.",
    chips: ["Prototypes", "Components"],
    score: 95,
    tone: "#a78bfa"
  },
  {
    title: "Design System",
    icon: "design-system-brand",
    signal: "Reusable patterns",
    desc1: "Token architecture to variant logic, building consistency at every scale.",
    chips: ["Tokens", "Variants"],
    score: 90,
    tone: "#a78bfa"
  },
  {
    title: "Widgets",
    icon: "component",
    signal: "Pluggable widgets",
    desc1: "Custom Mendix widgets built with React and TypeScript, extending platform capabilities.",
    chips: ["React", "TypeScript"],
    score: 87,
    tone: "#a78bfa"
  },
  {
    title: "Frontend Dev",
    icon: "layout-dashboard",
    signal: "Modern interfaces",
    desc1: "Responsive, accessible, high-performing interfaces with strong usability and visual engagement.",
    chips: ["Responsive", "Accessibility"],
    score: 88,
    tone: "#a78bfa"
  },
  {
    title: "JavaScript",
    icon: "javascript-brand",
    signal: "Interactive UI",
    desc1: "Dynamic, modular JS architecture for clean interactive components.",
    chips: ["DOM", "Modules"],
    score: 85,
    tone: "#a78bfa"
  },
  {
    title: "SCSS",
    icon: "scss-brand",
    signal: "Style architecture",
    desc1: "Modular, maintainable SCSS with mixins, functions, and scalable responsive systems.",
    chips: ["Mixins", "Responsive"],
    score: 80,
    tone: "#a78bfa"
  },
  {
    title: "Java",
    icon: "java-brand",
    signal: "Backend logic",
    desc1: "Reliable OOP services and APIs powering scalable application logic.",
    chips: ["OOP", "Services"],
    score: 72,
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
    icon: "hash",
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

const renderIcon = (icon) => `
  ${brandIcons[icon] || `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[icon]}</svg>`}
`;

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

  projectNavLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (document.body.classList.contains("project-detail-page")) {
    document.querySelectorAll('.nav-links a[href$="#work"]').forEach((link) => {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    });
  }

  if (document.body.classList.contains("resume-page")) {
    document.querySelectorAll('.nav-links a[href$="#resume"]').forEach((link) => {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    });
  }
};

const setProjectNavVisibility = () => {
  if (!floatingProjectNav) return;

  const overviewSection = document.querySelector("#overview");
  const outcomeSection = document.querySelector("#outcomes, #outcome");
  if (!overviewSection || !outcomeSection) return;

  const overviewRect = overviewSection.getBoundingClientRect();
  const outcomeRect = outcomeSection.getBoundingClientRect();
  const hasPassedHero = overviewRect.bottom <= header.offsetHeight + 42;
  const isNearEnding = outcomeRect.bottom <= window.innerHeight * 0.82;

  floatingProjectNav.classList.toggle("is-floating-visible", hasPassedHero && !isNearEnding);
};

let scrollTicking = false;

const updateScrollState = () => {
  scrollTicking = false;
  setHeaderState();
  setActiveNavLink();
  setProjectNavVisibility();
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
setProjectNavVisibility();
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

  const prevButton = document.querySelector("[data-wall-prev]");
  const nextButton = document.querySelector("[data-wall-next]");
  const toggleButton = document.querySelector("[data-wall-toggle]");
  const toggleLabel = toggleButton?.querySelector("span");
  const originalCards = Array.from(track.children);
  if (!originalCards.length) return;

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

    if (!isHoverPaused && !isUserPaused && !isDragging && !isAnimating) {
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

initWallOfLoveCarousel();

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
