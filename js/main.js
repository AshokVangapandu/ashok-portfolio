const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const cursorLight = document.querySelector(".cursor-light");
const magneticItems = document.querySelectorAll(".magnetic");
const expertiseGrid = document.querySelector("[data-expertise-grid]");
const buildFlow = document.querySelector("[data-build-flow]");
const animatedSectionNodes = document.querySelectorAll("[data-animated-section]");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const projectNavLinks = document.querySelectorAll('.project-nav a[href^="#"]');
const floatingProjectNav = document.querySelector(".medi-subnav, .ds-subnav");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersMobileWhatsApp = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;

whatsappLinks.forEach((link) => {
  link.href = prefersMobileWhatsApp ? link.dataset.mobileHref : link.dataset.desktopHref;
});

const expertise = [
  {
    title: "Mendix",
    icon: "mendix-brand",
    signal: "Low-code delivery",
    desc1: "Experienced in building scalable apps using Mendix.",
    desc2: "Skilled in customizing Atlas UI, integrating logic, and deploying end-to-end solutions.",
    chips: ["Atlas UI", "Microflows"],
    focus: "Apps to launch"
  },
  {
    title: "Figma",
    icon: "figma-brand",
    signal: "Product design",
    desc1: "Expert in wireframing, prototyping, and component-based design.",
    desc2: "Collaborates seamlessly with teams to deliver consistent UI aligned with development needs.",
    chips: ["Prototypes", "Components"],
    focus: "Design to build"
  },
  {
    title: "Java",
    icon: "java-brand",
    signal: "Backend logic",
    desc1: "Solid foundation in Java for backend processes.",
    desc2: "Applies object-oriented principles to build reliable and scalable application logic.",
    chips: ["OOP", "Services"],
    focus: "Reliable systems"
  },
  {
    title: "User Interface",
    icon: "ui-brand",
    signal: "Experience craft",
    desc1: "Focused on creating user-friendly, visually appealing layouts.",
    desc2: "Designs interfaces prioritizing clarity, accessibility, and brand consistency.",
    chips: ["Layouts", "A11y"],
    focus: "Clear journeys"
  },
  {
    title: "JavaScript",
    icon: "javascript-brand",
    signal: "Interactive UI",
    desc1: "Proficient in scripting dynamic and interactive UI components.",
    desc2: "Implements clean modular logic to improve user experience and behavior.",
    chips: ["DOM", "Modules"],
    focus: "Fluid behavior"
  },
  {
    title: "Design System",
    icon: "design-system-brand",
    signal: "Reusable patterns",
    desc1: "Hands-on experience in creating and maintaining design systems.",
    desc2: "Drives consistency, scalability, and reusable UI patterns across products.",
    chips: ["Tokens", "Variants"],
    focus: "Consistent scale"
  },
  {
    title: "SCSS",
    icon: "scss-brand",
    signal: "Style architecture",
    desc1: "Well-versed in writing modular and maintainable SCSS architecture.",
    desc2: "Uses mixins, loops, and variables to build scalable responsive systems.",
    chips: ["Mixins", "Responsive"],
    focus: "Clean styling"
  },
  {
    title: "Canva",
    icon: "canva-brand",
    signal: "Visual assets",
    desc1: "Creates quick visuals, mockups, and branding assets using Canva.",
    desc2: "Useful for social media creatives, presentations, and rapid design iterations.",
    chips: ["Branding", "Content"],
    focus: "Rapid visuals"
  }
];

const buildSteps = [
  {
    title: "Analyze",
    icon: "target-scan",
    description: "Understanding business problems, user needs, behavior, workflows, and strategic product goals.",
    meta: "01"
  },
  {
    title: "Design",
    icon: "pen-tool",
    description: "Wireframes, UI systems, interaction design, user experience flows, accessibility, and visual hierarchy.",
    meta: "02"
  },
  {
    title: "Build",
    icon: "component",
    description: "Transforming designs into scalable digital products through clean systems and reusable components.",
    meta: "03"
  },
  {
    title: "Refine",
    icon: "sliders",
    description: "Polishing interactions, optimizing performance, collecting feedback, and iterating based on behavior.",
    meta: "04"
  },
  {
    title: "Deliver",
    icon: "badge-check",
    description: "Deployment, production readiness, developer handoff, final QA, and launching impactful experiences.",
    meta: "05"
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
    <article class="expertise-card tilt-card reveal-on-scroll" data-stagger="${stagger}" style="transition-delay: ${stagger}ms" aria-label="${item.title} expertise">
      <div class="expertise-card-top">
        <span class="expertise-icon">${renderIcon(item.icon)}</span>
        <span class="expertise-signal">${item.signal}</span>
      </div>
      <div class="expertise-card-copy">
        <h3>${item.title}</h3>
        <p>${item.desc1}</p>
        <p>${item.desc2}</p>
      </div>
      <div class="expertise-card-bottom" aria-label="${item.title} focus areas">
        <div class="expertise-tags">
          ${item.chips.map((chip) => `<span>${chip}</span>`).join("")}
        </div>
        <span class="expertise-focus">${item.focus}</span>
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
    <article class="build-node build-node-${index + 1} reveal-on-scroll" data-stagger="${stagger}" style="transition-delay: ${stagger}ms" aria-label="${step.title} workflow step">
      <div class="build-step-index">${step.meta}</div>
      <span class="build-icon">${renderIcon(step.icon)}</span>
      <div class="build-card-copy">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </div>
    </article>
  `;
  }).join("");
};

renderBuildFlow();

const renderProjectActions = () => {
  const workCopies = document.querySelectorAll(".work-copy");
  const actionLabels = {
    "Medi Connect": "View Healthcare Workflow",
    "Vantage Nutrition R&D": "See R&D Platform",
    "Field Survey Personnel": "Explore Field Operations",
    "Edith Design System": "View Design Architecture",
    "Smart Dashboards": "Open Analytics System"
  };
  const actionLinks = {
    "Medi Connect": "pages/projects/medi-connect.html",
    "Vantage Nutrition R&D": "pages/projects/vantage-rnd.html",
    "Field Survey Personnel": "pages/projects/field-survey.html",
    "Edith Design System": "pages/projects/design-system.html",
    "Smart Dashboards": "pages/projects/smart-dashboard.html"
  };

  workCopies.forEach((copy) => {
    const projectTitle = copy.querySelector("h3")?.textContent.trim();
    const actionLabel = actionLabels[projectTitle] || "View Project";
    const action = document.createElement("a");
    action.href = actionLinks[projectTitle] || "#work";
    action.className = "work-action";
    action.innerHTML = `
      <span>${actionLabel}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    `;
    copy.appendChild(action);
  });
};

renderProjectActions();

const tiltCards = document.querySelectorAll(".tilt-card");
const buildNodes = document.querySelectorAll(".build-node");
const interactiveSurfaces = document.querySelectorAll(".work-project, .profile-action, .contact-panel, .contact-card, .resume-card, .resume-project-card, .resume-identity-card, .work-action");
const scrollRevealItems = document.querySelectorAll(".reveal-on-scroll");

const AnimatedSection = (section) => {
  const reveal = () => {
    section.classList.add("is-section-visible");
    window.setTimeout(() => {
      section.classList.add("is-section-settled");
    }, 720);
  };

  section.classList.add("animated-section");

  return { section, reveal };
};

const animatedSections = Array.from(animatedSectionNodes, AnimatedSection);

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const setActiveNavLink = () => {
  const activationLine = header.offsetHeight + window.innerHeight * 0.18;
  let activeId = "";

  animatedSections.forEach(({ section }) => {
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

    const headerOffset = header.offsetHeight + 18;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    if (window.history.pushState) {
      window.history.pushState(null, "", targetId);
    }
  });
});

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const animatedSection = animatedSections.find((item) => item.section === entry.target);
      if (!animatedSection) return;

      animatedSection.reveal();
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.22,
    rootMargin: "0px 0px -12% 0px"
  });

  animatedSections.forEach((item) => sectionObserver.observe(item.section));
} else {
  animatedSections.forEach((item) => item.reveal());
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      const staggerDelay = Number(entry.target.dataset.stagger || 0);
      window.setTimeout(() => {
        entry.target.style.transitionDelay = "0ms";
        entry.target.style.willChange = "auto";
      }, staggerDelay + 620);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -6% 0px"
  });

  scrollRevealItems.forEach((item) => revealObserver.observe(item));
} else {
  scrollRevealItems.forEach((item) => item.classList.add("is-visible"));
}

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
