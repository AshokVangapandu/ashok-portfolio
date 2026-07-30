import{r as se,j as D,c as Y,R as X}from"./client-BW4HFQ8H.js";const G=({imageUrl:e,displayName:a,size:t,className:n="",style:o={}})=>{const[i,r]=se.useState(e?"loading":"error");se.useEffect(()=>{r(e?"loading":"error")},[e]);const s=(()=>{const p=(a||"").trim();if(!p)return"??";const u=p.split(/\s+/);return u.length>=2?(u[0][0]+u[1][0]).toUpperCase():p.substring(0,2).toUpperCase()})(),l=t?{width:typeof t=="number"?`${t}px`:t,height:typeof t=="number"?`${t}px`:t}:{},d=()=>n.includes("popover-avatar")?{width:"48px",height:"48px",borderRadius:"50%",display:"grid",placeItems:"center",background:"linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",color:"#fff",fontWeight:700,fontSize:"14px",...l,...o}:{...l,...o};let c="author-avatar author-avatar-initials";return n.includes("popover-avatar")?c=`${n} avatar-fallback`:(n.includes("navbar-user-avatar")||n.includes("dropdown-user"))&&(c=n.includes("dropdown")?"dropdown-user-header-avatar-fallback":"navbar-user-avatar-fallback"),D.jsxs(D.Fragment,{children:[e&&i!=="error"&&D.jsx("img",{src:e,alt:a,className:n,style:{...l,...o,display:i==="loaded"?void 0:"none"},loading:"lazy",onLoad:()=>r("loaded"),onError:()=>r("error")}),i!=="loaded"&&D.jsx("div",{className:c,style:d(),children:s})]})};(function(){const e=window.location.pathname,a=e.startsWith("/ashok-portfolio")?"/ashok-portfolio":"",t=e.substring(a.length);t.startsWith("/admin")&&!t.includes(".")&&window.location.replace(window.location.origin+a+"/admin/index.html?redirect="+encodeURIComponent(t))})();const ke=()=>window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",$e=()=>{const e=ke(),a=document.querySelector(".brand");a&&a.setAttribute("href",e),document.querySelectorAll("a").forEach(t=>{const n=t.getAttribute("href");if(n)if(n.startsWith("#")){const o=window.location.pathname;o===e||o===e+"index.html"||t.setAttribute("href",e+n)}else if(n.includes("index.html#")){const o=n.substring(n.indexOf("#"));t.setAttribute("href",e+o)}else n.includes("index.html")&&!n.includes("widgets")&&!n.includes("projects")&&!n.includes("certifications")?t.setAttribute("href",e):n.includes("widgets/index.html")?t.setAttribute("href",e+"widgets/index.html"):n.includes("pages/projects/index.html")?t.setAttribute("href",e+"pages/projects/index.html"):n.includes("certifications/index.html")&&t.setAttribute("href",e+"certifications/index.html")})};$e();const j=document.querySelector("[data-header]"),I=document.querySelector("[data-nav-toggle]"),K=document.querySelector("[data-nav-menu]"),U=document.querySelector(".cursor-light"),qe=document.querySelectorAll(".magnetic"),ie=document.querySelector("[data-expertise-grid]"),le=document.querySelector("[data-build-flow]"),Pe=document.querySelectorAll('a[href^="#"]'),Te=document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-container a[href^="#"]'),Ie=document.querySelectorAll("[data-whatsapp-link]"),x=document.querySelector("[data-contact-form]"),N=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Re=window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;Ie.forEach(e=>{e.href=Re?e.dataset.mobileHref:e.dataset.desktopHref});const V=(e,a,t)=>{window.showToast&&window.showToast(e,a,t,5600)},ce=window.APP_CONFIG&&window.APP_CONFIG.SUPABASE_URL||"",de=window.APP_CONFIG&&window.APP_CONFIG.SUPABASE_ANON_KEY||"",_e=(e,a)=>{if(!e||!a||e.startsWith("%VITE_")||e.includes("%")||a.startsWith("%VITE_")||a.includes("%"))return!1;try{const t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"}catch{return!1}},ue=window.supabase&&_e(ce,de)?function(){try{return window.supabase.createClient(ce,de)}catch(e){return console.warn("[main] Failed to create Supabase client:",e),null}}():(console.warn(`[Portfolio]

Supabase disabled.

Reason:
Invalid configuration.

The website will continue running with fallback behaviour.`),null),T=(e,a)=>{const t=e.closest(".contact-form-group");if(!t)return;t.classList.add("has-error");let n=t.querySelector(".validation-error");n||(n=document.createElement("span"),n.className="validation-error",t.appendChild(n)),n.textContent=a},$=e=>{const a=e.closest(".contact-form-group");if(!a)return;a.classList.remove("has-error");const t=a.querySelector(".validation-error");t&&t.remove()},De=e=>{let a=!0;const t=e.querySelector("#contact-name"),n=e.querySelector("#contact-email"),o=e.querySelector("#contact-subject"),i=e.querySelector("#contact-message"),r=t.value.trim();t.value=r,r?$(t):(T(t,"Name is required."),a=!1);const s=n.value.trim();n.value=s,s?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?$(n):(T(n,"Please enter a valid email address."),a=!1):(T(n,"Email is required."),a=!1);const d=o.value.trim();o.value=d,d?$(o):(T(o,"Subject is required."),a=!1);const c=i.value.trim();return i.value=c,c?$(i):(T(i,"Message is required."),a=!1),a};x&&x.querySelectorAll("input, textarea").forEach(a=>{a.addEventListener("input",()=>{a.value.trim()&&(a.id==="contact-email"?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value.trim())&&$(a):$(a))})});const pe=(e,a)=>{const t=e.querySelector(".contact-submit"),n=t.querySelector("span:not(.spinner)");t.disabled=a,t.setAttribute("aria-busy",String(a)),a?(n.textContent="Sending...",t.classList.add("loading")):(n.textContent="Send Message",t.classList.remove("loading"))};x==null||x.addEventListener("submit",async e=>{if(e.preventDefault(),!!De(x)){if(!ue){console.error("Supabase client is not loaded."),V("error","Something went wrong while sending your message.","Please try again in a few moments.");return}pe(x,!0);try{const a=x.querySelector("#contact-name").value.trim(),t=x.querySelector("#contact-email").value.trim(),n=x.querySelector("#contact-subject").value.trim(),o=x.querySelector("#contact-message").value.trim(),{error:i}=await ue.from("contact_messages").insert([{full_name:a,email:t,subject:n,message:o,submitted_from:"Portfolio Website",status:"New"}]);if(i)throw i;x.reset(),x.querySelectorAll("input, textarea").forEach(r=>{$(r)}),V("success","✅ Message Sent Successfully!","Thank you for reaching out. I've received your message and will get back to you as soon as possible.")}catch(a){console.error("Supabase Database error during form submission:",a),V("error","Something went wrong while sending your message.","Please try again in a few moments.")}finally{pe(x,!1)}}});const He=[{title:"Mendix",icon:"assets/images/Mendix-Brandmark.webp",signal:"Low-code delivery",desc1:"Scalable enterprise apps with Atlas UI, microflows, and end-to-end cloud deployment.",chips:["Atlas UI","Microflows"],score:92,tone:"#a78bfa"},{title:"Figma",icon:"assets/images/FigmaImage.png",signal:"Product design",desc1:"Pixel-perfect wireframing, prototyping, and component systems dev-ready from day one.",chips:["Prototypes","Components"],score:95,tone:"#a78bfa"},{title:"Design System",icon:"assets/images/design-system.webp",signal:"Reusable patterns",desc1:"Token architecture to variant logic, building consistency at every scale.",chips:["Tokens","Variants"],score:90,tone:"#a78bfa"},{title:"Widgets",icon:"assets/images/Widget.png",signal:"Pluggable widgets",desc1:"Custom Mendix widgets built with React and TypeScript, extending platform capabilities.",chips:["React","TypeScript"],score:87,tone:"#a78bfa"},{title:"Frontend Dev",icon:"assets/images/front-end.svg",signal:"Modern interfaces",desc1:"Responsive, accessible, high-performing interfaces with strong usability and visual engagement.",chips:["Responsive","Accessibility"],score:88,tone:"#a78bfa"},{title:"JavaScript",icon:"assets/images/javascript-logo.webp",signal:"Interactive UI",desc1:"Dynamic, modular JS architecture for clean interactive components.",chips:["DOM","Modules"],score:85,tone:"#a78bfa"},{title:"SCSS",icon:"assets/images/SCSS.png",signal:"Style architecture",desc1:"Modular, maintainable SCSS with mixins, functions, and scalable responsive systems.",chips:["Mixins","Responsive"],score:80,tone:"#a78bfa"},{title:"AI Product Building",icon:"sparkles",signal:"AI-POWERED DEVELOPMENT",desc1:"Leveraging AI to design, prototype, and build production-ready applications through modern AI-assisted development workflows.",chips:["Codex","AI Agents"],score:78,tone:"#a78bfa"}],je=[{title:"Analyze",icon:"target-scan",description:"Understanding business problems, user needs, behavior, workflows, and strategic product goals.",meta:"01",tags:["Research","Strategy","Goals"],tone:"#00d6c6"},{title:"Design",icon:"pen-tool",description:"Wireframes, UI systems, interaction design, user experience flows, accessibility, and visual hierarchy.",meta:"02",tags:["Wireframes","UI Systems","UX"],tone:"#8f72ff"},{title:"Build",icon:"code",description:"Transforming designs into scalable digital products through clean systems and reusable components.",meta:"03",tags:["Frontend","Components","Code"],tone:"#409cff"},{title:"Refine",icon:"sliders",description:"Polishing interactions, optimizing performance, collecting feedback, and iterating based on behavior.",meta:"04",tags:["QA","Performance","Feedback"],tone:"#ffd84d"},{title:"Deliver",icon:"badge-check",description:"Deployment, production readiness, developer handoff, final QA, and launching impactful experiences.",meta:"05",tags:["Launch","Handoff","Deploy"],tone:"#dc66f0"}],Be={layers:`
    <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/>
    <path d="m4 12 8 4.5 8-4.5"/>
    <path d="m4 16.5 8 4.5 8-4.5"/>
  `,figma:`
    <path d="M12 12a4 4 0 1 0 0-8H8a4 4 0 0 0 0 8h4Z"/>
    <path d="M12 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/>
    <path d="M8 12a4 4 0 1 0 0 8h4v-8H8Z"/>
    <path d="M12 4h4a4 4 0 0 1 0 8h-4V4Z"/>
  `,coffee:`
    <path d="M10 2v2"/>
    <path d="M14 2v2"/>
    <path d="M7 8h10v5a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z"/>
    <path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/>
    <path d="M5 22h14"/>
  `,"layout-dashboard":`
    <rect x="3" y="3" width="7" height="9" rx="2"/>
    <rect x="14" y="3" width="7" height="5" rx="2"/>
    <rect x="14" y="12" width="7" height="9" rx="2"/>
    <rect x="3" y="16" width="7" height="5" rx="2"/>
  `,"file-code":`
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"/>
    <path d="M14 2v5h5"/>
    <path d="m10 13-2 2 2 2"/>
    <path d="m14 17 2-2-2-2"/>
  `,component:`
    <path d="M5.5 8.5 3 6l2.5-2.5L8 6l-2.5 2.5Z"/>
    <path d="M18.5 8.5 16 6l2.5-2.5L21 6l-2.5 2.5Z"/>
    <path d="M5.5 20.5 3 18l2.5-2.5L8 18l-2.5 2.5Z"/>
    <path d="M18.5 20.5 16 18l2.5-2.5L21 18l-2.5 2.5Z"/>
    <path d="M8 6h8"/>
    <path d="M6 8v8"/>
    <path d="M18 8v8"/>
    <path d="M8 18h8"/>
  `,palette:`
    <path d="M12 22a10 10 0 1 1 10-10c0 1.66-1.34 3-3 3h-1.7a2 2 0 0 0-1.4 3.43A2.1 2.1 0 0 1 14.4 22H12Z"/>
    <path d="M7.5 10.5h.01"/>
    <path d="M10.5 7.5h.01"/>
    <path d="M14.5 7.5h.01"/>
    <path d="M16.5 11h.01"/>
  `,"pen-tool":`
    <path d="M12 19 5 12l7-9 7 9-7 7Z"/>
    <path d="M12 19v3"/>
    <path d="M9 22h6"/>
    <path d="M12 3v7"/>
    <path d="M9 12h6"/>
  `,"scan-search":`
    <path d="M7 3H5a2 2 0 0 0-2 2v2"/>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <path d="M15 15.5 19.5 20"/>
    <path d="M11 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>
  `,"target-scan":`
    <circle cx="12" cy="12" r="7"/>
    <circle cx="12" cy="12" r="2.4"/>
    <path d="M12 2.8V5"/>
    <path d="M12 19v2.2"/>
    <path d="M2.8 12H5"/>
    <path d="M19 12h2.2"/>
  `,hash:`
    <path d="M8 3 6 21"/>
    <path d="M18 3l-2 18"/>
    <path d="M4 9h16"/>
    <path d="M3 15h16"/>
  `,code:`
    <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20"/>
  `,wand:`
    <path d="M15 4V2"/>
    <path d="M15 10V8"/>
    <path d="M12 5h2"/>
    <path d="M16 5h2"/>
    <path d="m4 20 12-12"/>
    <path d="m14 6 4 4"/>
    <path d="M8 3 7 5 5 6l2 1 1 2 1-2 2-1-2-1-1-2Z"/>
  `,terminal:`
    <path d="m4 17 6-6-6-6"/>
    <path d="M12 19h8"/>
  `,"refresh-cw":`
    <path d="M21 12a9 9 0 0 1-15.5 6.2"/>
    <path d="M3 12A9 9 0 0 1 18.5 5.8"/>
    <path d="M18 2v4h4"/>
    <path d="M6 22v-4H2"/>
  `,sliders:`
    <path d="M4 7h10"/>
    <path d="M18 7h2"/>
    <circle cx="16" cy="7" r="2"/>
    <path d="M4 17h2"/>
    <path d="M10 17h10"/>
    <circle cx="8" cy="17" r="2"/>
  `,"badge-check":`
    <path d="M12 2.5 14.8 5l3.8-.2.9 3.7 3 2.3-1.5 3.5.9 3.7-3.6 1.5-2 3.2-3.3-.8-3.3.8-2-3.2L4 18l.9-3.7-1.5-3.5 3-2.3.9-3.7 3.8.2L12 2.5Z"/>
    <path d="m8.8 12.5 2.1 2.1 4.5-5"/>
  `,sparkles:`
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z"/>
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"/>
  `},Fe={"mendix-brand":`
    <svg class="brand-icon brand-icon-mendix" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#0f172a" d="M9 10h30a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z"/>
      <path fill="#13b5ea" d="M11 33V15h6.1l6.9 8.2 6.9-8.2H37v18h-6.1V24l-6.9 8.2L17.1 24v9H11Z"/>
      <path fill="#7dd3fc" opacity=".72" d="M17.1 15 24 23.2 30.9 15H37L24 30.6 11 15h6.1Z"/>
    </svg>
  `,"figma-brand":`
    <svg class="brand-icon brand-icon-figma" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="12" r="7" fill="#f24e1e"/>
      <circle cx="30" cy="12" r="7" fill="#ff7262"/>
      <circle cx="30" cy="24" r="7" fill="#1abcfe"/>
      <circle cx="18" cy="24" r="7" fill="#a259ff"/>
      <circle cx="18" cy="36" r="7" fill="#0acf83"/>
      <path fill="#ffffff" opacity=".18" d="M18 5h12a7 7 0 0 1 0 14H18A7 7 0 0 1 18 5Z"/>
    </svg>
  `,"java-brand":`
    <svg class="brand-icon brand-icon-java" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#f89820" d="M23.2 6c4.2 3.1-7.8 7.3-1.2 12.2 2 1.5 1.8 3.2.2 5.2 5.2-4.2 2.7-7.1.4-8.8-3.2-2.4 7.6-5.8.6-8.6Z"/>
      <path fill="#5382a1" d="M33.8 30.4c3.9-2 6.4.8 2.2 3-5.8 3-19 2.7-24.4.1-3.9-1.9 2.2-4.5 6.5-3.3l-1.5 1.1c-2.8-.6-4.1.7-2.1 1.5 4.1 1.7 14.4 1.8 18.4-.1 1.7-.8 1.2-1.6.9-2.3Z"/>
      <path fill="#5382a1" d="M18.8 26.5s-2.2 1.3 1.5 1.8c4.5.6 6.8.5 11.8-.5 0 0 1.3.8 3.2 1.5-11.3 4.9-25.6-.3-16.5-2.8Z"/>
      <path fill="#f89820" d="M27.6 20.8c1.8 2.1-.5 4-3.9 5.6 0 0 6.6-.7 7.1-3.4.4-2.5-3.2-3.7-3.2-3.7v1.5Z"/>
      <ellipse cx="24" cy="39" rx="13" ry="2.7" fill="#5382a1" opacity=".72"/>
    </svg>
  `,"ui-brand":`
    <svg class="brand-icon brand-icon-ui" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="7" y="9" width="34" height="28" rx="6" fill="#111827"/>
      <path fill="#6ee7f9" d="M11 16a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v3H11v-3Z"/>
      <rect x="12" y="23" width="10" height="9" rx="3" fill="#a78bfa"/>
      <rect x="25" y="23" width="11" height="3" rx="1.5" fill="#e0e7ff"/>
      <rect x="25" y="29" width="8" height="3" rx="1.5" fill="#8dd8ff"/>
      <path fill="#ffffff" opacity=".18" d="M7 17h34v2H7z"/>
    </svg>
  `,"javascript-brand":`
    <svg class="brand-icon brand-icon-js" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="5" fill="#f7df1e"/>
      <path fill="#111827" d="M17 33.3c.6 1 1.3 1.8 2.8 1.8 1.3 0 2.1-.6 2.1-3V18.3h4v13.8c0 4.2-2.5 6.1-6 6.1-3.2 0-5.1-1.7-6-3.7l3.1-1.2Z"/>
      <path fill="#111827" d="M28.1 32.9c1.1 1.8 2.6 2.4 4.5 2.4 1.5 0 2.5-.7 2.5-1.7 0-1.2-1-1.6-2.7-2.4l-1-.4c-2.7-1.1-4.5-2.6-4.5-5.6 0-2.8 2.1-4.9 5.5-4.9 2.4 0 4.1.8 5.3 3l-2.9 1.8c-.6-1.1-1.3-1.6-2.4-1.6s-1.8.7-1.8 1.6c0 1.1.7 1.5 2.3 2.2l1 .4c3.2 1.4 5 2.7 5 5.8 0 3.3-2.6 5.1-6.1 5.1s-6-1.6-7.1-3.8l2.4-1.9Z"/>
    </svg>
  `,"design-system-brand":`
    <svg class="brand-icon brand-icon-system" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="4" fill="#8b5cf6"/>
      <rect x="27" y="9" width="12" height="12" rx="4" fill="#60a5fa"/>
      <rect x="9" y="27" width="12" height="12" rx="4" fill="#5eead4"/>
      <rect x="27" y="27" width="12" height="12" rx="4" fill="#e0e7ff"/>
      <path stroke="#93c5fd" stroke-width="2" stroke-linecap="round" d="M21 15h6M15 21v6M33 21v6M21 33h6"/>
      <path fill="#ffffff" opacity=".18" d="M9 9h30v4H9z"/>
    </svg>
  `,"scss-brand":`
    <svg class="brand-icon brand-icon-scss" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#cf649a" d="M39.7 17.2c-1.3-5.1-8.6-6.8-16.1-4.2-4.5 1.6-9.3 4.8-11.8 8.2-3 4.2-1.8 7.8 3.2 8.4 1.8.2 3.7-.2 5.7-.8-.8 1.6-1.3 3.2-1.3 4.6 0 4.7 4.4 5.9 8.2 3.7 3.4-2 5.4-6.6 3.7-10.2 4.9-2.4 9.6-5.7 8.4-9.7Z"/>
      <path fill="#ffffff" opacity=".24" d="M23.7 13c-4.5 1.6-9.3 4.8-11.8 8.2-1.3 1.9-1.8 3.6-1.3 5 5.2-7.2 14.8-11.8 22.6-11.4-2.5-2.5-6.3-2.9-9.5-1.8Z"/>
      <path fill="#8f3f6f" d="M25 25.8c1.9.7 3.2 1.8 3.4 3.4.3 2.1-1.1 4.3-3.2 5.4-1.6.9-3.4.4-3.3-1.6.1-1.9 1.2-4.4 3.1-7.2Z"/>
    </svg>
  `,"canva-brand":`
    <svg class="brand-icon brand-icon-canva" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="#20c4cb"/>
      <path fill="#7c3aed" opacity=".76" d="M39.5 15.1A18 18 0 0 1 14.8 39.5 18 18 0 0 0 39.5 15.1Z"/>
      <path fill="#ffffff" d="M30.7 28.6c-1.8 2.4-4.1 3.7-6.9 3.7-4.4 0-7.3-3-7.3-7.4 0-5.5 4.2-9.2 9.2-9.2 3.2 0 5.5 1.4 6.4 3.8l-3.4 1.8c-.5-1.3-1.5-2-3.1-2-2.8 0-5 2.3-5 5.4 0 2.3 1.4 3.8 3.6 3.8 1.6 0 2.8-.7 3.8-2l2.7 2.1Z"/>
      <path fill="#ffffff" opacity=".24" d="M13 12c7.7-6.2 19.3-4.6 25 3.4-8.2-4.2-18.1-3.1-25 3.2V12Z"/>
    </svg>
  `},ve=e=>e.startsWith("assets/")?`<img src="${e}" alt="" class="expertise-img-icon" />`:Fe[e]||`<svg viewBox="0 0 24 24" aria-hidden="true">${Be[e]}</svg>`,Oe=()=>{ie&&(ie.innerHTML=He.map((e,a)=>{const t=a*70;return`
    <article class="expertise-card tilt-card reveal-on-scroll" data-stagger="${t}" style="--skill-color: ${e.tone}; --skill-score: ${e.score}%; transition-delay: ${t}ms" aria-label="${e.title} expertise">
      <div class="expertise-card-top">
        <div class="expertise-card-meta">
          <span class="expertise-icon">${ve(e.icon)}</span>
          <span class="expertise-signal">${e.signal}</span>
        </div>
        <span class="expertise-score">${e.score}%</span>
      </div>
      <div class="expertise-card-copy">
        <h3>${e.title}</h3>
        <p>${e.desc1}</p>
      </div>
      <div class="expertise-card-bottom" aria-label="${e.title} focus areas">
        <div class="expertise-meter" aria-hidden="true"><span></span></div>
        <div class="expertise-tags">
          ${e.chips.map(n=>`<span>${n}</span>`).join("")}
        </div>
      </div>
    </article>
  `}).join(""))};Oe();const Ue=()=>{le&&(le.innerHTML=je.map((e,a)=>{const t=120+a*90;return`
    <article class="build-node build-node-${a+1} reveal-on-scroll" data-stagger="${t}" style="--build-color: ${e.tone}; transition-delay: ${t}ms" aria-label="${e.title} workflow step">
      <div class="build-step-index">${e.meta}</div>
      <span class="build-icon">${ve(e.icon)}</span>
      <div class="build-card-copy">
        <h3>${e.title}</h3>
        <p>${e.description}</p>
        <ul class="build-tags" aria-label="${e.title} focus points">
          ${e.tags.map(n=>`<li>${n}</li>`).join("")}
        </ul>
      </div>
    </article>
  `}).join(""))};Ue();const Ve=document.querySelectorAll(".tilt-card"),Ne=document.querySelectorAll(".build-node"),Ze=document.querySelectorAll(".portfolio-display-card, .portfolio-cta, .preview-panel, .profile-action, .contact-panel, .contact-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .widget-gallery-link, .widget-mockup-frame"),We=document.querySelectorAll(".reveal-on-scroll"),ze=Array.from(document.querySelectorAll("main section[id]")),Ye=()=>{We.forEach(e=>{e.classList.add("is-visible"),e.style.transitionDelay="0ms",e.style.willChange="auto"})},be=()=>{j.classList.toggle("is-scrolled",window.scrollY>18)},xe=()=>{const e=j.offsetHeight+window.innerHeight*.18;let a="";ze.forEach(t=>{if(!t.id)return;const n=t.getBoundingClientRect();n.top<=e&&n.bottom>e&&(a=t.id)}),Te.forEach(t=>{const n=t.getAttribute("href")===`#${a}`;t.classList.toggle("is-active",n),n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")}),document.body.classList.contains("resume-page")&&document.querySelectorAll('.nav-links a[href$="#resume"]').forEach(t=>{t.classList.add("is-active"),t.setAttribute("aria-current","page")})};let Z=!1;const Xe=()=>{Z=!1,be(),xe()},Se=()=>{Z||(Z=!0,window.requestAnimationFrame(Xe))},Ge=()=>{I.classList.remove("is-open"),I.setAttribute("aria-expanded","false"),K.classList.remove("is-open")};be();xe();Ye();window.addEventListener("scroll",Se,{passive:!0});window.addEventListener("resize",Se);I.addEventListener("click",()=>{const e=I.classList.toggle("is-open");I.setAttribute("aria-expanded",String(e)),K.classList.toggle("is-open",e)});K.querySelectorAll("a").forEach(e=>{e.addEventListener("click",Ge)});Pe.forEach(e=>{e.addEventListener("click",a=>{const t=e.getAttribute("href");if(!t||t==="#")return;const n=document.querySelector(t);if(!n)return;a.preventDefault();const o=j?j.offsetHeight+18:100,i=n.getBoundingClientRect().top+window.scrollY-o;window.lenis?window.lenis.scrollTo(n,{offset:-o,duration:1.2}):window.scrollTo({top:Math.max(i,0),behavior:"auto"}),window.history.pushState&&window.history.pushState(null,"",t)})});N||(window.addEventListener("pointermove",e=>{const a=e.clientX,t=e.clientY,n=(a/window.innerWidth-.5).toFixed(3),o=(t/window.innerHeight-.5).toFixed(3);document.body.classList.add("has-pointer"),document.documentElement.style.setProperty("--mx",n),document.documentElement.style.setProperty("--my",o),U&&(U.style.setProperty("--x",`${a}px`),U.style.setProperty("--y",`${t}px`))},{passive:!0}),qe.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top,i=n-t.width/2,r=o-t.height/2;e.style.setProperty("--tx",`${i*.1}px`),e.style.setProperty("--ty",`${r*.14}px`),e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.setProperty("--tx","0px"),e.style.setProperty("--ty","0px"),e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),Ve.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top,i=((n/t.width-.5)*7).toFixed(2),r=((.5-o/t.height)*7).toFixed(2);e.style.setProperty("--rx",`${r}deg`),e.style.setProperty("--ry",`${i}deg`),e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.setProperty("--rx","0deg"),e.style.setProperty("--ry","0deg"),e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),Ne.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top;e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),Ze.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top;e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}));const Ke=()=>{const e=document.querySelector("[data-wall-carousel]"),a=document.querySelector("[data-wall-marquee]");if(!e||!a)return;const t=e.parentNode.querySelector(".wall-carousel-dots");t&&t.remove(),a.querySelectorAll("[data-clone='true']").forEach(h=>h.remove());const o=document.querySelector("[data-wall-prev]"),i=document.querySelector("[data-wall-next]"),r=document.querySelector("[data-wall-toggle]"),s=r==null?void 0:r.querySelector("span"),l=Array.from(a.children);if(!l.length)return;if(l.length<3){const h=e.parentNode.querySelector(".wall-carousel-dots");h&&h.remove(),o&&(o.style.display="none"),i&&(i.style.display="none"),r&&(r.style.display="none"),a.style.justifyContent="center",a.style.transform="none",l.forEach(g=>g.classList.add("is-active"));return}a.style.justifyContent="flex-start",o&&(o.style.display="flex"),i&&(i.style.display="flex"),r&&(r.style.display="flex");const d=document.createElement("div");d.className="wall-carousel-dots";for(let h=0;h<6;h++){const g=document.createElement("span");g.className="wall-dot",h===0&&g.classList.add("is-active"),d.appendChild(g)}e.parentNode.appendChild(d),l.forEach(h=>{const g=h.cloneNode(!0);g.setAttribute("aria-hidden","true"),g.dataset.clone="true",a.appendChild(g)});let c=Array.from(a.children),p=0,u=0,m=performance.now(),f=!1,w=!1,y=!1,S=!1,b=null,v=0,C=0;const F=34,M=()=>{window.gsap?window.gsap.set(a,{x:u}):a.style.transform=`translate3d(${u}px, 0, 0)`},E=()=>{if(p){for(;u<=-p;)u+=p;for(;u>0;)u-=p}},Q=()=>{c=Array.from(a.children),p=a.scrollWidth/2,E(),M()},P=()=>{const h=e.getBoundingClientRect(),g=h.left+h.width/2;let A=null,oe=1/0;if(c.forEach(q=>{const R=q.getBoundingClientRect(),re=R.left+R.width/2,_=Math.abs(g-re);_<oe&&(oe=_,A=q)}),c.forEach(q=>{q.classList.toggle("is-active",q===A)}),A&&d){const R=c.indexOf(A)%l.length%6;d.querySelectorAll(".wall-dot").forEach((_,Ae)=>{_.classList.toggle("is-active",Ae===R)})}},J=()=>{!r||!s||(r.setAttribute("aria-pressed",String(w)),r.setAttribute("aria-label",w?"Play testimonial autoplay":"Pause testimonial autoplay"),s.textContent=w?"Play":"Pause")},ee=()=>{const h=l[0],g=l[1];return h?g?g.getBoundingClientRect().left-h.getBoundingClientRect().left:h.getBoundingClientRect().width:320},te=h=>{if(window.gsap){b&&b.kill(),E();const g=u+ee()*h;S=!0,b=window.gsap.to(a,{x:g,duration:.75,ease:"power3.out",onUpdate:()=>{P()},onComplete:()=>{u=g,E(),M(),S=!1,b=null}})}else u+=ee()*h,E(),M(),P()},ae=h=>{const g=Math.min((h-m)/1e3,.05);m=h,!f&&!w&&!y&&!S&&!B&&(u-=F*g,E(),M()),P()};e.addEventListener("mouseenter",()=>{f=!0}),e.addEventListener("mouseleave",()=>{f=!1}),e.addEventListener("focusin",()=>{f=!0}),e.addEventListener("focusout",()=>{f=!1});const ne=h=>{var g,A;return h.clientX??((A=(g=h.touches)==null?void 0:g[0])==null?void 0:A.clientX)??0},Me=h=>{var g;b&&(b.kill(),b=null,S=!1),y=!0,v=ne(h),C=u,e.classList.add("is-dragging"),(g=e.setPointerCapture)==null||g.call(e,h.pointerId)},Ee=h=>{y&&(u=C+ne(h)-v,E(),M(),P())},O=h=>{var g;y&&(y=!1,e.classList.remove("is-dragging"),(g=e.releasePointerCapture)==null||g.call(e,h.pointerId))};if(e.addEventListener("pointerdown",Me),e.addEventListener("pointermove",Ee),e.addEventListener("pointerup",O),e.addEventListener("pointercancel",O),e.addEventListener("lostpointercapture",O),o==null||o.addEventListener("click",()=>te(1)),i==null||i.addEventListener("click",()=>te(-1)),r==null||r.addEventListener("click",()=>{w=!w,J()}),window.addEventListener("resize",Q),Q(),J(),P(),window.gsap)window.gsap.ticker.add(()=>ae(performance.now()));else{const h=g=>{ae(g),window.requestAnimationFrame(h)};window.requestAnimationFrame(h)}};let L=[],B=!1,k=0,Le=0;const Qe=(e,a=40)=>{if(!e)return{text:"",truncated:!1};const t=e.trim().split(/\s+/);return t.length<=a?{text:e,truncated:!1}:{text:t.slice(0,a).join(" ")+"...",truncated:!0}},fe=(e=[])=>{const a=document.querySelector("[data-wall-marquee]"),t=document.querySelector(".wall-empty-state"),n=document.querySelector(".heard-carousel-nav"),o=document.querySelector("[data-wall-prev]"),i=document.querySelector("[data-wall-next]");if(!a)return;if(L=e||[],a.innerHTML="",!e||e.length===0){t&&(t.style.display="flex"),a.style.display="none",n&&(n.style.display="none"),o&&(o.style.display="none"),i&&(i.style.display="none");const s=document.querySelector(".wall-carousel-dots");s&&(s.style.display="none");return}t&&(t.style.display="none"),a.style.display="flex",n&&(n.style.display="flex"),o&&(o.style.display="flex"),i&&(i.style.display="flex"),a.innerHTML=e.map((s,l)=>{const d=s.full_name||s.google_name||"Collaborator",c=s.avatar_url||s.google_avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",p=s.designation?s.company?`${s.designation} at ${s.company}`:s.designation:s.company||"Collaborator";let u=s.linkedin_url?s.linkedin_url.trim():"";u&&!/^https?:\/\//i.test(u)&&(u="https://"+u);const m=u?`
      <a href="${u}" class="wall-card-linkedin" target="_blank" rel="noopener noreferrer" aria-label="${d}'s LinkedIn profile">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
    `:"",f="★".repeat(s.rating||5)+"☆".repeat(5-(s.rating||5)),w=`<div class="avatar-mount-point" data-image-url="${c}" data-display-name="${d}" data-class-name="author-avatar"></div>`,y=Qe(s.testimonial,40);return`
      <article class="wall-card">
        <div class="wall-card-top-row">
          <div class="card-quote-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <div class="card-rating-stars">
            <span>${f}</span>
          </div>
        </div>
        
        <div class="card-text-container">
          <blockquote class="card-testimonial-text">${y.text}</blockquote>
          
          <button type="button" class="read-more-btn" data-testimonial-id="${s.id}" data-original-index="${l}" aria-label="Read full review from ${d}">
            <span>Read Full Review</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="card-divider"></div>
        <div class="card-author-row">
          ${w}
          <div class="author-meta">
            <div class="author-name-row">
              <h4>${d}</h4>
              ${m}
            </div>
            <p class="author-title">${p}</p>
          </div>
        </div>
      </article>
    `}).join("");const r=()=>{a.querySelectorAll(".read-more-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.getAttribute("data-testimonial-id"),c=L.findIndex(p=>p.id===d);c!==-1&&it(c)})})};Ke(),r(),a.querySelectorAll(".avatar-mount-point").forEach(s=>{const l=s.getAttribute("data-image-url"),d=s.getAttribute("data-display-name"),c=s.getAttribute("data-class-name");Y.createRoot(s).render(X.createElement(G,{imageUrl:l,displayName:d,className:c}))})},Je=async()=>{try{if(window.TestimonialService){const{data:e,error:a}=await window.TestimonialService.getApprovedTestimonials();if(a)throw a;const t=e?e.length:0;let n=0,o=0;if(t>0){n=(e.reduce((f,w)=>f+(w.rating||5),0)/t).toFixed(1);const m=e.filter(f=>f.user_id).length;o=Math.round(m/t*100)}const i=document.getElementById("stats-total-count"),r=document.getElementById("stats-average-rating"),s=document.getElementById("stats-verified-percent");i&&(i.textContent=t),r&&(r.textContent=t>0?`${n}/5`:"0.0/5"),s&&(s.textContent=`${o}%`);const l=[],d=new Set;e&&e.forEach(u=>{const m=(u.full_name||u.google_name||"Collaborator").trim();m&&!d.has(m.toLowerCase())&&(d.add(m.toLowerCase()),l.push(u))});const c=document.getElementById("collaborators-badge-count");if(c){const u=l.length===1?"1 happy collaborator":`${l.length} happy collaborators`;c.innerHTML=`<span>${u}</span>`}const p=document.getElementById("collaborator-avatars-list");p&&(p.innerHTML=l.slice(0,4).map(u=>{const m=u.full_name||u.google_name||"Collaborator",f=u.avatar_url||u.google_avatar||"";if(f&&(f.includes("unsplash")||f.includes("google")||f.includes("http")||f.includes("photo-")))return`<img src="${f}" alt="${m}" title="${m}" />`;{const w=m.split(" ").map(y=>y[0]).slice(0,2).join("").toUpperCase();return`<div class="collaborator-avatar-fallback-initials" title="${m}">${w}</div>`}}).join("")),fe(e)}}catch(e){console.error("Failed to load dynamic testimonials:",e),fe([])}};Je();const et=async()=>{try{if(window.CertificationService){const{data:e,error:a}=await window.CertificationService.getPublishedCertifications();if(a)throw a;const t=e?e.length:0,n=e?e.filter(c=>c.credential_url&&c.credential_url.trim()!==""||c.certificate_file_url).length:0,o=t>0?Math.round(n/t*100):0,i=document.querySelectorAll(".certifications-trust-panel-v2 .trust-stat-title");i&&i.length>=2&&(i[0].textContent=t>0?`${t}+`:"0",i[1].textContent=`${o}%`);const r=[],s=new Set;e&&e.forEach(c=>{if(c.issuer){const p=c.issuer.toLowerCase().trim();s.has(p)||(s.add(p),r.push({name:c.issuer,iconUrl:c.certificate_image_url||null}))}});const l=r.slice(0,6),d=document.querySelector(".certifications-grid-v2");if(d)if(l.length===0)d.innerHTML='<div style="grid-column: span 6; text-align: center; color: #94A3B8; padding: 40px 0; font-size: 14px;">No certifications published yet.</div>';else{const c=(p,u)=>{if(u&&u.trim()!=="")return`<img src="${u}" alt="${p}" style="height: 32px; width: auto; object-fit: contain;" />`;const m=p.toLowerCase().trim();return m.includes("mendix")?'<img src="assets/images/Mendix-Brandmark.webp" alt="Mendix" style="height: 32px; width: auto; object-fit: contain;" />':m.includes("google")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #60A5FA;">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.14 1 3 5.14 3 10.25s4.14 9.25 9.24 9.25c5.32 0 8.86-3.72 8.86-9.01 0-.61-.06-1.08-.14-1.54H12.24z"/>
              </svg>`:m.includes("aws")||m.includes("amazon")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #F59E0B;">
                <path d="M11.625 15.783c-1.189 0-2.18-.152-2.973-.456-.793-.304-1.229-.685-1.31-1.144-.066-.379.083-.75.446-1.112.363-.362.908-.667 1.636-.916.727-.248 1.656-.424 2.787-.528l2.673-.243v1.39c0 .736-.188 1.282-.564 1.637-.376.356-.99.534-1.84.534m3.048-6.147v1.73l-2.423.23c-1.393.13-2.483.364-3.272.705-.789.34-1.34.786-1.655 1.336-.314.55-.471 1.157-.471 1.823 0 .973.307 1.737.92 2.293.614.555 1.492.833 2.634.833 1.082 0 1.986-.226 2.711-.678a4.877 4.877 0 0 0 1.684-1.874h.084c.121.666.333 1.168.636 1.505.303.337.755.505 1.356.505.47 0 .973-.105 1.511-.314a13.38 13.38 0 0 0 1.51-.714V14.86c0-.987-.042-1.921-.125-2.802-.083-.88-.242-1.66-.477-2.339a5.147 5.147 0 0 0-1.042-1.874c-.496-.549-1.194-.973-2.096-1.272-.9-.3-2.023-.45-3.37-.45-1.42 0-2.585.185-3.493.555a6.666 6.666 0 0 0-2.33 1.585l1.323 1.306c.49-.496.99-.861 1.5-1.096.51-.235 1.176-.353 2.0-.353.94 0 1.636.19 2.09.569.453.38.68.959.68 1.738"/>
                <path d="M12.046 22.094c3.488 0 6.634-1.22 8.784-3.213.303-.28.1-.733-.303-.64-2.883.666-6.425.992-9.743.992-3.473 0-7.253-.36-10.158-1.092-.394-.1-.594.364-.285.64 2.224 1.993 5.485 3.313 9.705 3.313m8.948-4.053c-.328-.426-1.503-.186-2.073-.092-.188.03-.236-.18-.073-.314.509-.42 1.485-.363 1.867.042.382.404-.036 1.442-.442 1.916-.134.155-.31.066-.273-.146.115-.658.322-.98.994-1.406"/>
              </svg>`:m.includes("microsoft")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M2 2h9.5v9.5H2V2zm10.5 0H22v9.5h-9.5V2zM2 12.5h9.5V22H2v-9.5zm10.5 0H22V22h-9.5v-9.5z" fill="#F25022"/>
              </svg>`:m.includes("meta")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #0668E1;">
                <path d="M22.5 12c0-3.32-2.7-6-6-6-2.22 0-4.14 1.2-5.16 3-1.02-1.8-2.94-3-5.16-3-3.3 0-6 2.68-6 6 0 3.31 2.7 6 6 6 2.22 0 4.14-1.2 5.16-3 1.02 1.8 2.94 3 5.16 3 3.3 0 6-2.69 6-6zm-17.34 4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm11.68 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>`:m.includes("linux")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #64748B;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>`:`<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#7C5CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>`};d.innerHTML=l.map(p=>`
            <div class="provider-logo-card">
              <div class="provider-logo-container">
                ${c(p.name,p.iconUrl)}
              </div>
              <span class="provider-name">${p.name}</span>
              <div class="provider-glow-dot"></div>
            </div>
          `).join("")}}}catch(e){console.error("Failed to load dynamic certifications:",e)}};et();const tt=async()=>{try{if(window.ProjectService){const{data:e,error:a}=await window.ProjectService.getPublishedProjects();if(a)throw a;const t=e?e.length:0,n=document.getElementById("stat-projects-delivered");n&&(n.textContent=`${t}+`);const o=new Set,i=new Set;e&&e.forEach(l=>{if(l.category){const d=l.category.trim(),c=d.toLowerCase();d&&!i.has(c)&&(i.add(c),o.add(d))}});const r=o.size,s=document.getElementById("stat-industries-served");s&&(s.textContent=`${r}+`)}}catch(e){console.warn("Failed to load dynamic projects stats:",e);const a=document.getElementById("stat-projects-delivered");a&&(a.textContent="0+");const t=document.getElementById("stat-industries-served");t&&(t.textContent="0+")}};tt();let H={ip_address:"Unknown",country:"Unknown",city:"Unknown"};const at=async()=>{try{const e=await fetch("https://ipapi.co/json/");if(e.ok){const a=await e.json();H={ip_address:a.ip||"Unknown",country:a.country_name||"Unknown",city:a.city||"Unknown"}}}catch(e){console.warn("Geolocation prefetch failed:",e)}};at();const Ce=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const a=Math.random()*16|0;return(e==="x"?a:a&3|8).toString(16)}),nt=()=>{let e=localStorage.getItem("visitor_id");return e||(e=Ce(),localStorage.setItem("visitor_id",e)),e},ot=()=>{let e=sessionStorage.getItem("session_id");return e||(e=Ce(),sessionStorage.setItem("session_id",e)),e},rt=()=>{const e=navigator.userAgent;let a="Other",t="Other",n="Desktop";return e.includes("Firefox")?a="Firefox":e.includes("SamsungBrowser")?a="Samsung Browser":e.includes("Opera")||e.includes("OPR")?a="Opera":e.includes("Trident")?a="Internet Explorer":e.includes("Edge")||e.includes("Edg")?a="Edge":e.includes("Chrome")?a="Chrome":e.includes("Safari")&&(a="Safari"),e.includes("Windows")?t="Windows":e.includes("Macintosh")||e.includes("Mac OS X")?t="macOS":e.includes("Android")?t="Android":e.includes("iPhone")||e.includes("iPad")?t="iOS":e.includes("Linux")&&(t="Linux"),/Mobi|Android|iPhone|iPad|iPod/i.test(e)&&(n=/Tablet|iPad/i.test(e)?"Tablet":"Mobile"),{browser:a,os:t,deviceType:n,userAgent:e}},st=async()=>{const e=document.querySelector(".profile-actions .profile-action-primary"),a=document.querySelector(".profile-actions .profile-action-secondary");if(!e||!a)return;const t=e.querySelector("span"),n=a.querySelector("span");t&&(t.textContent="Loading...");try{if(window.ResumeService){const{data:o,error:i}=await window.ResumeService.getActiveResume();if(i||!o||!o.public_url)throw new Error(i?i.message:"No active resume found");t&&(t.textContent="Download Resume"),e.setAttribute("href","#"),e.removeAttribute("target"),e.removeAttribute("rel"),e.removeAttribute("aria-label"),e.setAttribute("aria-label","Download Ashok's active resume PDF directly");const r=e.cloneNode(!0);e.parentNode.replaceChild(r,e),r.addEventListener("click",async s=>{s.preventDefault();const l=r.querySelector("span"),d=l.textContent;l.textContent="Downloading...";let c=null;try{const p=rt(),u={resume_id:o.id,session_id:ot(),visitor_id:nt(),page_source:window.location.pathname||"/",referrer:document.referrer||"",user_agent:p.userAgent,browser:p.browser,operating_system:p.os,device_type:p.deviceType,country:H.country,city:H.city,ip_address:H.ip_address,download_status:"completed"},{data:m,error:f}=await window.ResumeService.logResumeDownload(u);if(f)throw f;c=m;const w=await fetch(o.public_url);if(!w.ok)throw new Error(`HTTP status: ${w.status}`);const y=await w.blob(),S=window.URL.createObjectURL(y),b=document.createElement("a");b.href=S,b.download=o.file_name||"Resume.pdf",document.body.appendChild(b),b.click(),document.body.removeChild(b),window.URL.revokeObjectURL(S)}catch(p){if(console.error("Download tracking or file retrieval failed:",p),c&&c.id)try{await window.ResumeService.updateDownloadStatus(c.id,"failed")}catch(u){console.error("Failed to update download status:",u)}window.open(o.public_url,"_blank")}finally{l.textContent=d}}),n&&(n.textContent="View Online"),a.setAttribute("href",o.preview_url||o.public_url),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer"),a.removeAttribute("aria-label"),a.setAttribute("aria-label","Open Ashok's active resume preview in a new tab"),a.style.opacity="1",a.style.pointerEvents="auto",a.style.cursor="pointer"}else throw new Error("ResumeService not initialized")}catch(o){console.error("Failed to load active resume:",o),t&&(t.textContent="Resume Unavailable"),n&&(n.textContent="View Online");const i=e.cloneNode(!0);e.parentNode.replaceChild(i,e),i.setAttribute("href","#"),i.style.opacity="0.5",i.style.pointerEvents="none",i.style.cursor="not-allowed";const r=a.cloneNode(!0);a.parentNode.replaceChild(r,a),r.setAttribute("href","#"),r.style.opacity="0.5",r.style.pointerEvents="none",r.style.cursor="not-allowed"}};st();const he=()=>{if(typeof Lenis>"u")return;const e=new Lenis({duration:1.2,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a)),smoothWheel:!0,smoothTouch:!1});if(window.lenis=e,window.gsap&&window.ScrollTrigger)window.gsap.registerPlugin(window.ScrollTrigger),e.on("scroll",window.ScrollTrigger.update),window.gsap.ticker.add(a=>{e.raf(a*1e3)}),window.gsap.ticker.lagSmoothing(0);else{const a=t=>{e.raf(t),requestAnimationFrame(a)};requestAnimationFrame(a)}if(!N){const a=document.createElement("div");if(a.className="scroll-progress-bar",document.body.appendChild(a),window.gsap&&window.ScrollTrigger)window.gsap.to(a,{scaleX:1,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:!0}});else{const t=()=>{const n=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;a.style.transform=`scaleX(${n/100})`};e.on("scroll",t)}}if(!N&&window.gsap&&window.ScrollTrigger){const a=document.querySelectorAll(".expertise-card, .build-node, .portfolio-display-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .wall-card");if(a.length>0){let t={skew:0};const n=window.gsap.quickSetter(a,"skewY","deg"),o=window.gsap.utils.clamp(-2.5,2.5);window.ScrollTrigger.create({onUpdate:i=>{const r=i.getVelocity(),s=o(r/-350);Math.abs(s)>Math.abs(t.skew)&&(t.skew=s,window.gsap.to(t,{skew:0,duration:.8,ease:"power3.out",overwrite:"auto",onUpdate:()=>n(t.skew)}))}}),window.gsap.set(a,{transformOrigin:"center center",force3D:!0})}}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",he):he();const me=async()=>{const e=document.getElementById("navbar-auth-container");if(!e||!window.AuthService)return;const a=()=>{let r=window.location.pathname;r.endsWith(".html")&&(r=r.substring(0,r.lastIndexOf("/")+1)),r.endsWith("/")||(r+="/");const s=r.indexOf("/admin/");return s!==-1&&(r=r.substring(0,s+1)),r+"admin/"};let t=!1;const n=async r=>{var S,b;const s=((S=r.user_metadata)==null?void 0:S.avatar_url)||"",l=((b=r.user_metadata)==null?void 0:b.full_name)||r.email.split("@")[0],d=(r.email||"").trim().toLowerCase();let c=!1;const p=sessionStorage.getItem(`is_admin_${d}`);if(console.log("Authenticated Email:",d),p==="true")c=!0,console.log(`isAdmin from cache: ${c}`);else try{const{data:v,error:C}=await window.AuthService.supabase.from("admins").select("email, role, is_active").eq("email",d).maybeSingle();console.log("Admin Query Result:",{data:v,error:C}),!C&&v&&v.is_active===!0?(c=!0,sessionStorage.setItem(`is_admin_${d}`,"true")):sessionStorage.setItem(`is_admin_${d}`,"false"),console.log(`isAdmin: ${c}`)}catch(v){console.error("[Navbar Auth] Failed to check admin status:",v)}const u=`<div class="avatar-mount-point" data-image-url="${s||""}" data-display-name="${l}" data-class-name="navbar-user-avatar"></div>`,m=`<div class="avatar-mount-point" data-image-url="${s||""}" data-display-name="${l}" data-class-name="dropdown-user-header-avatar"></div>`;e.innerHTML=`
      <button type="button" class="navbar-user-avatar-btn" id="navbar-user-btn" aria-label="Open user menu" aria-expanded="false">
        ${u}
      </button>
      <div class="navbar-user-dropdown" id="navbar-user-dropdown">
        <div class="dropdown-user-header">
          ${m}
          <div class="dropdown-user-info">
            <span class="dropdown-user-name">${l}</span>
            <span class="dropdown-user-email">${d}</span>
          </div>
        </div>
        ${c?`
          <div class="dropdown-divider"></div>
          <a href="${a()}" id="navbar-admin-btn" 
             onmouseenter="this.style.background='rgba(143, 133, 255, 0.16)'; this.style.borderColor='rgba(143, 133, 255, 0.3)';" 
             onmouseleave="this.style.background='rgba(143, 133, 255, 0.08)'; this.style.borderColor='rgba(143, 133, 255, 0.15)';"
             style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 36px; background: rgba(143, 133, 255, 0.08); border: 1px solid rgba(143, 133, 255, 0.15); border-radius: 10px; color: #8f85ff; font-size: 12.5px; font-weight: 600; text-decoration: none; margin-bottom: 4px; transition: all 250ms ease;">
            <span>👑 Admin Dashboard</span>
          </a>
        `:""}
        <div class="dropdown-divider"></div>
        <button type="button" class="dropdown-logout-btn" id="navbar-logout-btn">
          <span>Sign Out</span>
        </button>
      </div>
    `,e.querySelectorAll(".avatar-mount-point").forEach(v=>{const C=v.getAttribute("data-image-url"),F=v.getAttribute("data-display-name"),M=v.getAttribute("data-class-name");Y.createRoot(v).render(X.createElement(G,{imageUrl:C,displayName:F,className:M}))});const f=e.querySelector("#navbar-user-btn"),w=e.querySelector("#navbar-user-dropdown"),y=e.querySelector("#navbar-logout-btn");f==null||f.addEventListener("click",v=>{v.stopPropagation(),t=!t,w==null||w.classList.toggle("is-open",t),f.setAttribute("aria-expanded",String(t))}),y==null||y.addEventListener("click",async()=>{y.disabled=!0,y.innerHTML="<span>Signing out...</span>";try{const{error:v}=await window.AuthService.signOut();if(v)throw v;showToast("success","Signed Out","You have successfully signed out.")}catch(v){showToast("error","Sign Out Failed",v.message||"An error occurred."),y.disabled=!1,y.innerHTML="<span>Sign Out</span>"}}),document.addEventListener("click",v=>{t&&!e.contains(v.target)&&(t=!1,w==null||w.classList.remove("is-open"),f==null||f.setAttribute("aria-expanded","false"))})},o=(r=!1)=>{e.innerHTML=`
      <button type="button" class="profile-action profile-action-primary" id="fallback-login-btn" ${r?"disabled":""}>
        ${r?`
          <span class="auth-spinner" style="width: 14px; height: 14px; border: 2px solid rgba(255, 255, 255, 0.2); border-top-color: #ffffff; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;"></span>
          <span>Connecting...</span>
        `:`
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 6px;">
            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.7l2.4-2.4C17.3 1.5 14.9 0 12.24 0c-6.08 0-11 4.92-11 11s4.92 11 11 11c5.73 0 10.2-4.1 10.2-11 0-.74-.08-1.46-.2-2.115H12.24z" />
          </svg>
          <span>Sign in with Google</span>
        `}
      </button>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `;const s=e.querySelector("#fallback-login-btn");s==null||s.addEventListener("click",async()=>{o(!0);try{const{data:l,error:d}=await window.AuthService.signInWithGoogle();if(d)throw d;if(l!=null&&l.url){const u=window.screen.width/2-260,m=window.screen.height/2-600/2,f=window.open(l.url,"Google Auth",`width=520,height=600,top=${m},left=${u},scrollbars=yes,status=yes`),w=setInterval(()=>{(!f||f.closed)&&(clearInterval(w),setTimeout(async()=>{await window.AuthService.getCurrentUser()||(showToast("error","Login Cancelled","Google sign-in popup was closed."),o(!1))},500))},800)}}catch(l){showToast("error","Authentication Failed",l.message||"An error occurred."),o(!1)}})},i=await window.AuthService.getCurrentUser();i?n(i):o(!1),window.AuthService.onAuthStateChange((r,s)=>{s!=null&&s.user?n(s.user):o(!1)}),window.addEventListener("message",async r=>{var s;if(!(r.origin!==window.location.origin&&r.origin!=="null")&&((s=r.data)==null?void 0:s.type)==="supabase-oauth-callback")if(r.data.status==="success")try{const{data:l,error:d}=await window.AuthService.setSession(r.data.hash);if(d)throw d;const c=await window.AuthService.getCurrentUser();c&&n(c)}catch(l){showToast("error","Session Error",l.message||"Failed to configure user session."),o(!1)}else showToast("error","Authentication Failed","Google sign-in was not successful."),o(!1)})};window.AuthService?me():document.addEventListener("DOMContentLoaded",()=>{window.AuthService&&me()});const ge=async()=>{if(window.SocialLinksService)try{const e=await window.SocialLinksService.getLinks(),a={};e.forEach(o=>{o.platform&&o.url&&(a[o.platform.toLowerCase()]=o.url.trim())}),window.configuredSocialLinks=a;const t=document.querySelectorAll("[data-social-key]"),n=window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;t.forEach(o=>{const i=o.dataset.socialKey.toLowerCase(),r=a[i];if(!r){o.href="#",i==="email"&&(o.textContent.includes("@")||o.textContent==="Not Configured")&&(o.textContent="Not Configured");return}if(i==="whatsapp"){let s=r;if(r.includes("wa.me/")){s=r.replace("wa.me/","web.whatsapp.com/send?phone=");const l=s.indexOf("?");if(l!==-1){const d=s.indexOf("?",l+1);d!==-1&&(s=s.substring(0,d)+"&"+s.substring(d+1))}}o.dataset.mobileHref=r,o.dataset.desktopHref=s,o.href=n?r:s}else if(i==="email"){const s=r.startsWith("mailto:")?r:`mailto:${r}`;o.href=s;const l=r.startsWith("mailto:")?r.substring(7):r;(o.textContent.includes("@")||o.textContent==="Not Configured")&&(o.textContent=l)}else{const s=/^https?:\/\//i.test(r)?r:`https://${r}`;o.href=s}})}catch(e){console.error("Failed to initialize dynamic social links:",e)}};document.addEventListener("click",e=>{const a=e.target.closest("a[data-social-key]");if(!a)return;const t=a.dataset.socialKey.toLowerCase(),n=window.configuredSocialLinks?window.configuredSocialLinks[t]:null;if(!n||!n.trim()){e.preventDefault();const i={linkedin:"LinkedIn profile",github:"GitHub profile",behance:"Behance profile",email:"Email address",whatsapp:"WhatsApp number",instagram:"Instagram profile"}[t]||t;window.showToast?window.showToast("info","Link Not Configured",`${i} has not been configured yet.`,5e3):alert(`${i} has not been configured yet.`)}});window.SocialLinksService?ge():document.addEventListener("DOMContentLoaded",()=>{window.SocialLinksService&&ge()});let W=null;const z=(e,a=!0)=>{try{const t=L[e];if(!t){console.warn("Testimonial not found at index:",e);return}const n="★".repeat(t.rating||5)+"☆".repeat(5-(t.rating||5)),o=t.full_name||t.google_name||"Collaborator",i=t.avatar_url||t.google_avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",r=t.designation?t.company?`${t.designation} &bull; ${t.company}`:t.designation:t.company||"Collaborator",s=document.querySelector(".reading-card-body"),l=document.querySelector("#reading-author-name"),d=document.querySelector("#reading-author-title"),c=document.querySelector("#reading-avatar-slot"),p=document.querySelector("#reading-counter"),u=(t.testimonial||"").split(/\n\s*\n/).map(f=>`<p>${f.replace(/\n/g,"<br>")}</p>`).join(""),m=()=>{const f=document.querySelector("#reading-stars"),w=document.querySelector("#reading-text");if(f&&(f.innerHTML=n),w&&(w.innerHTML=u),l&&(l.textContent=o),d&&(d.innerHTML=r),c){const y=c._reactRoot||Y.createRoot(c);c._reactRoot=y,y.render(X.createElement(G,{imageUrl:i,displayName:o,className:"popover-avatar",size:48,style:{borderRadius:"50%",objectFit:"cover"}}))}p&&(p.textContent=`${e+1} of ${L.length}`)};a&&s?(s.style.opacity="0",s.style.transform="translateY(10px)",s.style.transition="opacity 200ms ease, transform 200ms ease",setTimeout(()=>{m(),s.style.opacity="1",s.style.transform="translateY(0)"},200)):m()}catch(t){console.error("Error inside updateExpandedCard:",t)}},it=e=>{B=!0,k=e,Le=window.scrollY,W=document.activeElement;const a=document.querySelector("#heard");a==null||a.classList.add("reading-mode-active"),document.body.classList.add("reading-mode-on"),window.lenis&&window.lenis.stop();const t=document.querySelector(".wall-carousel-wrapper");t&&(t.style.opacity="0",t.style.pointerEvents="none",t.style.transition="opacity 400ms ease");const n=document.querySelector("#reading-card-wrapper");n&&(n.style.display="flex",n.offsetHeight,n.style.opacity="1"),z(e,!1),setTimeout(()=>{var o;(o=document.querySelector("#reading-close-btn"))==null||o.focus()},100)},we=()=>{B=!1;const e=document.querySelector("#heard");e==null||e.classList.remove("reading-mode-active"),document.body.classList.remove("reading-mode-on"),window.lenis&&window.lenis.start();const a=document.querySelector(".wall-carousel-wrapper");a&&(a.style.opacity="1",a.style.pointerEvents="auto");const t=document.querySelector("#reading-card-wrapper");t&&(t.style.opacity="0",setTimeout(()=>{t.style.display="none"},500)),W&&W.focus(),window.scrollTo({top:Le,behavior:"smooth"})},ye=()=>{const e=document.querySelector("#reading-close-btn"),a=document.querySelector("#reading-prev-btn"),t=document.querySelector("#reading-next-btn");e==null||e.addEventListener("click",we),a==null||a.addEventListener("click",()=>{L.length>0&&(k=(k-1+L.length)%L.length,z(k,!0))}),t==null||t.addEventListener("click",()=>{L.length>0&&(k=(k+1)%L.length,z(k,!0))}),window.addEventListener("keydown",n=>{if(!B)return;if(n.key==="Escape"){we();return}if(n.key==="ArrowLeft"){a==null||a.click();return}if(n.key==="ArrowRight"){t==null||t.click();return}const o=document.querySelector(".reading-card-body");if(o){const r=o.clientHeight-40;if(n.key==="ArrowUp"){o.scrollTop-=50,n.preventDefault();return}if(n.key==="ArrowDown"){o.scrollTop+=50,n.preventDefault();return}if(n.key==="PageUp"){o.scrollTop-=r,n.preventDefault();return}if(n.key==="PageDown"){o.scrollTop+=r,n.preventDefault();return}if(n.key===" "&&document.activeElement!==e&&document.activeElement!==a&&document.activeElement!==t){n.shiftKey?o.scrollTop-=r:o.scrollTop+=r,n.preventDefault();return}}if(n.key==="Tab"){const i=document.querySelector("#reading-card");if(!i)return;const s=Array.from(i.querySelectorAll('button, [tabindex="0"]')).filter(c=>c.offsetWidth>0&&c.offsetHeight>0&&!c.disabled);if(s.length===0)return;const l=s[0],d=s[s.length-1];n.shiftKey?document.activeElement===l&&(d.focus(),n.preventDefault()):document.activeElement===d&&(l.focus(),n.preventDefault())}})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ye):ye();
