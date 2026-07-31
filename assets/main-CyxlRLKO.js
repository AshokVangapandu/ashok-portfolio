import{r as ie,j as H,a as ke,c as X,R as Y}from"./index-Bjy4EI0s.js";const G=({imageUrl:e,displayName:a,size:t,className:n="",style:o={}})=>{const[s,r]=ie.useState(e?"loading":"error");ie.useEffect(()=>{r(e?"loading":"error")},[e]);const i=(()=>{const f=(a||"").trim();if(!f)return"??";const u=f.split(/\s+/);return u.length>=2?(u[0][0]+u[1][0]).toUpperCase():f.substring(0,2).toUpperCase()})(),c=t?{width:typeof t=="number"?`${t}px`:t,height:typeof t=="number"?`${t}px`:t}:{},d=()=>n.includes("popover-avatar")?{width:"48px",height:"48px",borderRadius:"50%",display:"grid",placeItems:"center",background:"linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",color:"#fff",fontWeight:700,fontSize:"14px",...c,...o}:{...c,...o};let l="author-avatar author-avatar-initials";return n.includes("popover-avatar")?l=`${n} avatar-fallback`:(n.includes("navbar-user-avatar")||n.includes("dropdown-user"))&&(l=n.includes("dropdown")?"dropdown-user-header-avatar-fallback":"navbar-user-avatar-fallback"),H.jsxs(H.Fragment,{children:[e&&s!=="error"&&H.jsx("img",{src:e,alt:a,className:n,style:{...c,...o,display:s==="loaded"?void 0:"none"},loading:"lazy",onLoad:()=>r("loaded"),onError:()=>r("error")}),s!=="loaded"&&H.jsx("div",{className:l,style:d(),children:i})]})};(function(){const e=window.location.pathname,a=e.startsWith("/ashok-portfolio")?"/ashok-portfolio":"",t=e.substring(a.length);t.startsWith("/admin")&&!t.includes(".")&&window.location.replace(window.location.origin+a+"/admin/index.html?redirect="+encodeURIComponent(t))})();window.supabase={createClient:ke};const $e=()=>window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",qe=()=>{const e=$e(),a=document.querySelector(".brand");a&&a.setAttribute("href",e),document.querySelectorAll("a").forEach(t=>{const n=t.getAttribute("href");if(n)if(n.startsWith("#")){const o=window.location.pathname;o===e||o===e+"index.html"||t.setAttribute("href",e+n)}else if(n.includes("index.html#")){const o=n.substring(n.indexOf("#"));t.setAttribute("href",e+o)}else n.includes("index.html")&&!n.includes("widgets")&&!n.includes("projects")&&!n.includes("certifications")?t.setAttribute("href",e):n.includes("widgets/index.html")?t.setAttribute("href",e+"widgets/index.html"):n.includes("pages/projects/index.html")?t.setAttribute("href",e+"pages/projects/index.html"):n.includes("certifications/index.html")&&t.setAttribute("href",e+"certifications/index.html")})};qe();const B=document.querySelector("[data-header]"),I=document.querySelector("[data-nav-toggle]"),K=document.querySelector("[data-nav-menu]"),U=document.querySelector(".cursor-light"),Pe=document.querySelectorAll(".magnetic"),se=document.querySelector("[data-expertise-grid]"),le=document.querySelector("[data-build-flow]"),Te=document.querySelectorAll('a[href^="#"]'),Ie=document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-container a[href^="#"]'),_e=document.querySelectorAll("[data-whatsapp-link]"),x=document.querySelector("[data-contact-form]"),V=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Re=window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;_e.forEach(e=>{e.href=Re?e.dataset.mobileHref:e.dataset.desktopHref});const N=(e,a,t)=>{window.showToast&&window.showToast(e,a,t,5600)},ce=window.APP_CONFIG&&window.APP_CONFIG.SUPABASE_URL||"",de=window.APP_CONFIG&&window.APP_CONFIG.SUPABASE_ANON_KEY||"",He=(e,a)=>{if(!e||!a||e.startsWith("%VITE_")||e.includes("%")||a.startsWith("%VITE_")||a.includes("%"))return!1;try{const t=new URL(e);return t.protocol==="http:"||t.protocol==="https:"}catch{return!1}},ue=window.supabase&&He(ce,de)?function(){try{return window.supabase.createClient(ce,de)}catch(e){return console.warn("[main] Failed to create Supabase client:",e),null}}():(console.warn(`[Portfolio]

Supabase disabled.

Reason:
Invalid configuration.

The website will continue running with fallback behaviour.`),null),T=(e,a)=>{const t=e.closest(".contact-form-group");if(!t)return;t.classList.add("has-error");let n=t.querySelector(".validation-error");n||(n=document.createElement("span"),n.className="validation-error",t.appendChild(n)),n.textContent=a},$=e=>{const a=e.closest(".contact-form-group");if(!a)return;a.classList.remove("has-error");const t=a.querySelector(".validation-error");t&&t.remove()},De=e=>{let a=!0;const t=e.querySelector("#contact-name"),n=e.querySelector("#contact-email"),o=e.querySelector("#contact-subject"),s=e.querySelector("#contact-message"),r=t.value.trim();t.value=r,r?$(t):(T(t,"Name is required."),a=!1);const i=n.value.trim();n.value=i,i?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i)?$(n):(T(n,"Please enter a valid email address."),a=!1):(T(n,"Email is required."),a=!1);const d=o.value.trim();o.value=d,d?$(o):(T(o,"Subject is required."),a=!1);const l=s.value.trim();return s.value=l,l?$(s):(T(s,"Message is required."),a=!1),a};x&&x.querySelectorAll("input, textarea").forEach(a=>{a.addEventListener("input",()=>{a.value.trim()&&(a.id==="contact-email"?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value.trim())&&$(a):$(a))})});const pe=(e,a)=>{const t=e.querySelector(".contact-submit"),n=t.querySelector("span:not(.spinner)");t.disabled=a,t.setAttribute("aria-busy",String(a)),a?(n.textContent="Sending...",t.classList.add("loading")):(n.textContent="Send Message",t.classList.remove("loading"))};x==null||x.addEventListener("submit",async e=>{if(e.preventDefault(),!!De(x)){if(!ue){console.error("Supabase client is not loaded."),N("error","Something went wrong while sending your message.","Please try again in a few moments.");return}pe(x,!0);try{const a=x.querySelector("#contact-name").value.trim(),t=x.querySelector("#contact-email").value.trim(),n=x.querySelector("#contact-subject").value.trim(),o=x.querySelector("#contact-message").value.trim(),{error:s}=await ue.from("contact_messages").insert([{full_name:a,email:t,subject:n,message:o,submitted_from:"Portfolio Website",status:"New"}]);if(s)throw s;x.reset(),x.querySelectorAll("input, textarea").forEach(r=>{$(r)}),N("success","✅ Message Sent Successfully!","Thank you for reaching out. I've received your message and will get back to you as soon as possible.")}catch(a){console.error("Supabase Database error during form submission:",a),N("error","Something went wrong while sending your message.","Please try again in a few moments.")}finally{pe(x,!1)}}});const Be=[{title:"Mendix",icon:"assets/images/Mendix-Brandmark.webp",signal:"Low-code delivery",desc1:"Scalable enterprise apps with Atlas UI, microflows, and end-to-end cloud deployment.",chips:["Atlas UI","Microflows"],score:92,tone:"#a78bfa"},{title:"Figma",icon:"assets/images/FigmaImage.png",signal:"Product design",desc1:"Pixel-perfect wireframing, prototyping, and component systems dev-ready from day one.",chips:["Prototypes","Components"],score:95,tone:"#a78bfa"},{title:"Design System",icon:"assets/images/design-system.webp",signal:"Reusable patterns",desc1:"Token architecture to variant logic, building consistency at every scale.",chips:["Tokens","Variants"],score:90,tone:"#a78bfa"},{title:"Widgets",icon:"assets/images/Widget.png",signal:"Pluggable widgets",desc1:"Custom Mendix widgets built with React and TypeScript, extending platform capabilities.",chips:["React","TypeScript"],score:87,tone:"#a78bfa"},{title:"Frontend Dev",icon:"assets/images/front-end.svg",signal:"Modern interfaces",desc1:"Responsive, accessible, high-performing interfaces with strong usability and visual engagement.",chips:["Responsive","Accessibility"],score:88,tone:"#a78bfa"},{title:"JavaScript",icon:"assets/images/javascript-logo.webp",signal:"Interactive UI",desc1:"Dynamic, modular JS architecture for clean interactive components.",chips:["DOM","Modules"],score:85,tone:"#a78bfa"},{title:"SCSS",icon:"assets/images/SCSS.png",signal:"Style architecture",desc1:"Modular, maintainable SCSS with mixins, functions, and scalable responsive systems.",chips:["Mixins","Responsive"],score:80,tone:"#a78bfa"},{title:"AI Product Building",icon:"sparkles",signal:"AI-POWERED DEVELOPMENT",desc1:"Leveraging AI to design, prototype, and build production-ready applications through modern AI-assisted development workflows.",chips:["Codex","AI Agents"],score:78,tone:"#a78bfa"}],je=[{title:"Analyze",icon:"target-scan",description:"Understanding business problems, user needs, behavior, workflows, and strategic product goals.",meta:"01",tags:["Research","Strategy","Goals"],tone:"#00d6c6"},{title:"Design",icon:"pen-tool",description:"Wireframes, UI systems, interaction design, user experience flows, accessibility, and visual hierarchy.",meta:"02",tags:["Wireframes","UI Systems","UX"],tone:"#8f72ff"},{title:"Build",icon:"code",description:"Transforming designs into scalable digital products through clean systems and reusable components.",meta:"03",tags:["Frontend","Components","Code"],tone:"#409cff"},{title:"Refine",icon:"sliders",description:"Polishing interactions, optimizing performance, collecting feedback, and iterating based on behavior.",meta:"04",tags:["QA","Performance","Feedback"],tone:"#ffd84d"},{title:"Deliver",icon:"badge-check",description:"Deployment, production readiness, developer handoff, final QA, and launching impactful experiences.",meta:"05",tags:["Launch","Handoff","Deploy"],tone:"#dc66f0"}],Fe={layers:`
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
  `},Oe={"mendix-brand":`
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
  `},ve=e=>e.startsWith("assets/")?`<img src="${e}" alt="" class="expertise-img-icon" />`:Oe[e]||`<svg viewBox="0 0 24 24" aria-hidden="true">${Fe[e]}</svg>`,Ue=()=>{se&&(se.innerHTML=Be.map((e,a)=>{const t=a*70;return`
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
  `}).join(""))};Ue();const Ne=()=>{le&&(le.innerHTML=je.map((e,a)=>{const t=120+a*90;return`
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
  `}).join(""))};Ne();const Ve=document.querySelectorAll(".tilt-card"),We=document.querySelectorAll(".build-node"),Ze=document.querySelectorAll(".portfolio-display-card, .portfolio-cta, .preview-panel, .profile-action, .contact-panel, .contact-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .widget-gallery-link, .widget-mockup-frame"),ze=document.querySelectorAll(".reveal-on-scroll"),Xe=Array.from(document.querySelectorAll("main section[id]")),Ye=()=>{ze.forEach(e=>{e.classList.add("is-visible"),e.style.transitionDelay="0ms",e.style.willChange="auto"})},ye=()=>{B.classList.toggle("is-scrolled",window.scrollY>18)},be=()=>{const e=B.offsetHeight+window.innerHeight*.18;let a="";Xe.forEach(t=>{if(!t.id)return;const n=t.getBoundingClientRect();n.top<=e&&n.bottom>e&&(a=t.id)}),Ie.forEach(t=>{const n=t.getAttribute("href")===`#${a}`;t.classList.toggle("is-active",n),n?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")}),document.body.classList.contains("resume-page")&&document.querySelectorAll('.nav-links a[href$="#resume"]').forEach(t=>{t.classList.add("is-active"),t.setAttribute("aria-current","page")})};let W=!1;const Ge=()=>{W=!1,ye(),be()},xe=()=>{W||(W=!0,window.requestAnimationFrame(Ge))},Ke=()=>{I.classList.remove("is-open"),I.setAttribute("aria-expanded","false"),K.classList.remove("is-open")};ye();be();Ye();window.addEventListener("scroll",xe,{passive:!0});window.addEventListener("resize",xe);I.addEventListener("click",()=>{const e=I.classList.toggle("is-open");I.setAttribute("aria-expanded",String(e)),K.classList.toggle("is-open",e)});K.querySelectorAll("a").forEach(e=>{e.addEventListener("click",Ke)});Te.forEach(e=>{e.addEventListener("click",a=>{const t=e.getAttribute("href");if(!t||t==="#")return;const n=document.querySelector(t);if(!n)return;a.preventDefault();const o=B?B.offsetHeight+18:100,s=n.getBoundingClientRect().top+window.scrollY-o;window.lenis?window.lenis.scrollTo(n,{offset:-o,duration:1.2}):window.scrollTo({top:Math.max(s,0),behavior:"auto"}),window.history.pushState&&window.history.pushState(null,"",t)})});V||(window.addEventListener("pointermove",e=>{const a=e.clientX,t=e.clientY,n=(a/window.innerWidth-.5).toFixed(3),o=(t/window.innerHeight-.5).toFixed(3);document.body.classList.add("has-pointer"),document.documentElement.style.setProperty("--mx",n),document.documentElement.style.setProperty("--my",o),U&&(U.style.setProperty("--x",`${a}px`),U.style.setProperty("--y",`${t}px`))},{passive:!0}),Pe.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top,s=n-t.width/2,r=o-t.height/2;e.style.setProperty("--tx",`${s*.1}px`),e.style.setProperty("--ty",`${r*.14}px`),e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.setProperty("--tx","0px"),e.style.setProperty("--ty","0px"),e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),Ve.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top,s=((n/t.width-.5)*7).toFixed(2),r=((.5-o/t.height)*7).toFixed(2);e.style.setProperty("--rx",`${r}deg`),e.style.setProperty("--ry",`${s}deg`),e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.setProperty("--rx","0deg"),e.style.setProperty("--ry","0deg"),e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),We.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top;e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}),Ze.forEach(e=>{e.addEventListener("pointermove",a=>{const t=e.getBoundingClientRect(),n=a.clientX-t.left,o=a.clientY-t.top;e.style.setProperty("--local-x",`${n}px`),e.style.setProperty("--local-y",`${o}px`)},{passive:!0}),e.addEventListener("pointerleave",()=>{e.style.removeProperty("--local-x"),e.style.removeProperty("--local-y")})}));const Qe=()=>{const e=document.querySelector("[data-wall-carousel]"),a=document.querySelector("[data-wall-marquee]");if(!e||!a)return;const t=e.parentNode.querySelector(".wall-carousel-dots");t&&t.remove(),a.querySelectorAll("[data-clone='true']").forEach(m=>m.remove());const o=document.querySelector("[data-wall-prev]"),s=document.querySelector("[data-wall-next]"),r=document.querySelector("[data-wall-toggle]"),i=r==null?void 0:r.querySelector("span"),c=Array.from(a.children);if(!c.length)return;if(c.length<3){const m=e.parentNode.querySelector(".wall-carousel-dots");m&&m.remove(),o&&(o.style.display="none"),s&&(s.style.display="none"),r&&(r.style.display="none"),a.style.justifyContent="center",a.style.transform="none",c.forEach(v=>v.classList.add("is-active"));return}a.style.justifyContent="flex-start",o&&(o.style.display="flex"),s&&(s.style.display="flex"),r&&(r.style.display="flex");const d=document.createElement("div");d.className="wall-carousel-dots";for(let m=0;m<6;m++){const v=document.createElement("span");v.className="wall-dot",m===0&&v.classList.add("is-active"),d.appendChild(v)}e.parentNode.appendChild(d),c.forEach(m=>{const v=m.cloneNode(!0);v.setAttribute("aria-hidden","true"),v.dataset.clone="true",a.appendChild(v)});let l=Array.from(a.children),f=0,u=0,g=performance.now(),p=!1,h=!1,w=!1,S=!1,b=null,y=0,L=0;const F=34,E=()=>{window.gsap?window.gsap.set(a,{x:u}):a.style.transform=`translate3d(${u}px, 0, 0)`},A=()=>{if(f){for(;u<=-f;)u+=f;for(;u>0;)u-=f}},Q=()=>{l=Array.from(a.children),f=a.scrollWidth/2,A(),E()},P=()=>{const m=e.getBoundingClientRect(),v=m.left+m.width/2;let M=null,oe=1/0;if(l.forEach(q=>{const _=q.getBoundingClientRect(),re=_.left+_.width/2,R=Math.abs(v-re);R<oe&&(oe=R,M=q)}),l.forEach(q=>{q.classList.toggle("is-active",q===M)}),M&&d){const _=l.indexOf(M)%c.length%6;d.querySelectorAll(".wall-dot").forEach((R,Me)=>{R.classList.toggle("is-active",Me===_)})}},J=()=>{!r||!i||(r.setAttribute("aria-pressed",String(h)),r.setAttribute("aria-label",h?"Play testimonial autoplay":"Pause testimonial autoplay"),i.textContent=h?"Play":"Pause")},ee=()=>{const m=c[0],v=c[1];return m?v?v.getBoundingClientRect().left-m.getBoundingClientRect().left:m.getBoundingClientRect().width:320},te=m=>{if(window.gsap){b&&b.kill(),A();const v=u+ee()*m;S=!0,b=window.gsap.to(a,{x:v,duration:.75,ease:"power3.out",onUpdate:()=>{P()},onComplete:()=>{u=v,A(),E(),S=!1,b=null}})}else u+=ee()*m,A(),E(),P()},ae=m=>{const v=Math.min((m-g)/1e3,.05);g=m,!p&&!h&&!w&&!S&&!j&&(u-=F*v,A(),E()),P()};e.addEventListener("mouseenter",()=>{p=!0}),e.addEventListener("mouseleave",()=>{p=!1}),e.addEventListener("focusin",()=>{p=!0}),e.addEventListener("focusout",()=>{p=!1});const ne=m=>{var v,M;return m.clientX??((M=(v=m.touches)==null?void 0:v[0])==null?void 0:M.clientX)??0},Ee=m=>{var v;b&&(b.kill(),b=null,S=!1),w=!0,y=ne(m),L=u,e.classList.add("is-dragging"),(v=e.setPointerCapture)==null||v.call(e,m.pointerId)},Ae=m=>{w&&(u=L+ne(m)-y,A(),E(),P())},O=m=>{var v;w&&(w=!1,e.classList.remove("is-dragging"),(v=e.releasePointerCapture)==null||v.call(e,m.pointerId))};if(e.addEventListener("pointerdown",Ee),e.addEventListener("pointermove",Ae),e.addEventListener("pointerup",O),e.addEventListener("pointercancel",O),e.addEventListener("lostpointercapture",O),o==null||o.addEventListener("click",()=>te(1)),s==null||s.addEventListener("click",()=>te(-1)),r==null||r.addEventListener("click",()=>{h=!h,J()}),window.addEventListener("resize",Q),Q(),J(),P(),window.gsap)window.gsap.ticker.add(()=>ae(performance.now()));else{const m=v=>{ae(v),window.requestAnimationFrame(m)};window.requestAnimationFrame(m)}};let C=[],j=!1,k=0,Se=0;const Je=(e,a=40)=>{if(!e)return{text:"",truncated:!1};const t=e.trim().split(/\s+/);return t.length<=a?{text:e,truncated:!1}:{text:t.slice(0,a).join(" ")+"...",truncated:!0}},fe=(e=[])=>{const a=document.querySelector("[data-wall-marquee]"),t=document.querySelector(".wall-empty-state"),n=document.querySelector(".heard-carousel-nav"),o=document.querySelector("[data-wall-prev]"),s=document.querySelector("[data-wall-next]");if(!a)return;if(C=e||[],a.innerHTML="",!e||e.length===0){t&&(t.style.display="flex"),a.style.display="none",n&&(n.style.display="none"),o&&(o.style.display="none"),s&&(s.style.display="none");const i=document.querySelector(".wall-carousel-dots");i&&(i.style.display="none");return}t&&(t.style.display="none"),a.style.display="flex",n&&(n.style.display="flex"),o&&(o.style.display="flex"),s&&(s.style.display="flex"),a.innerHTML=e.map((i,c)=>{const d=i.full_name||i.google_name||"Collaborator",l=i.avatar_url||i.google_avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",f=i.designation?i.company?`${i.designation} at ${i.company}`:i.designation:i.company||"Collaborator";let u=i.linkedin_url?i.linkedin_url.trim():"";u&&!/^https?:\/\//i.test(u)&&(u="https://"+u);const g=u?`
      <a href="${u}" class="wall-card-linkedin" target="_blank" rel="noopener noreferrer" aria-label="${d}'s LinkedIn profile">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>
    `:"",p="★".repeat(i.rating||5)+"☆".repeat(5-(i.rating||5)),h=`<div class="avatar-mount-point" data-image-url="${l}" data-display-name="${d}" data-class-name="author-avatar"></div>`,w=Je(i.testimonial,40);return`
      <article class="wall-card">
        <div class="wall-card-top-row">
          <div class="card-quote-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <div class="card-rating-stars">
            <span>${p}</span>
          </div>
        </div>
        
        <div class="card-text-container">
          <blockquote class="card-testimonial-text">${w.text}</blockquote>
          
          <button type="button" class="read-more-btn" data-testimonial-id="${i.id}" data-original-index="${c}" aria-label="Read full review from ${d}">
            <span>Read Full Review</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="card-divider"></div>
        <div class="card-author-row">
          ${h}
          <div class="author-meta">
            <div class="author-name-row">
              <h4>${d}</h4>
              ${g}
            </div>
            <p class="author-title">${f}</p>
          </div>
        </div>
      </article>
    `}).join("");const r=()=>{a.querySelectorAll(".read-more-btn").forEach(c=>{c.addEventListener("click",()=>{const d=c.getAttribute("data-testimonial-id"),l=C.findIndex(f=>f.id===d);l!==-1&&lt(l)})})};Qe(),r(),a.querySelectorAll(".avatar-mount-point").forEach(i=>{const c=i.getAttribute("data-image-url"),d=i.getAttribute("data-display-name"),l=i.getAttribute("data-class-name");X.createRoot(i).render(Y.createElement(G,{imageUrl:c,displayName:d,className:l}))})},et=async()=>{try{if(window.TestimonialService){const{data:e,error:a}=await window.TestimonialService.getApprovedTestimonials();if(a)throw a;const t=e?e.length:0;let n=0,o=0;if(t>0){n=(e.reduce((p,h)=>p+(h.rating||5),0)/t).toFixed(1);const g=e.filter(p=>p.user_id).length;o=Math.round(g/t*100)}const s=document.getElementById("stats-total-count"),r=document.getElementById("stats-average-rating"),i=document.getElementById("stats-verified-percent");s&&(s.textContent=t),r&&(r.textContent=t>0?`${n}/5`:"0.0/5"),i&&(i.textContent=`${o}%`);const c=[],d=new Set;e&&e.forEach(u=>{const g=(u.full_name||u.google_name||"Collaborator").trim();g&&!d.has(g.toLowerCase())&&(d.add(g.toLowerCase()),c.push(u))});const l=document.getElementById("collaborators-badge-count");if(l){const u=c.length===1?"1 happy collaborator":`${c.length} happy collaborators`;l.innerHTML=`<span>${u}</span>`}const f=document.getElementById("collaborator-avatars-list");f&&(f.innerHTML=c.slice(0,4).map(u=>{const g=u.full_name||u.google_name||"Collaborator",p=u.avatar_url||u.google_avatar||"";if(p&&(p.includes("unsplash")||p.includes("google")||p.includes("http")||p.includes("photo-")))return`<img src="${p}" alt="${g}" title="${g}" />`;{const h=g.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();return`<div class="collaborator-avatar-fallback-initials" title="${g}">${h}</div>`}}).join("")),fe(e)}}catch(e){console.warn("Failed to load dynamic testimonials from database, using cached fallback testimonials:",e);const a=[{id:"add625af-010c-4981-829e-9a60fba2b537",full_name:"Jarvis",designation:"AI Assistant",company:"Stark Industries",rating:5,testimonial:"Ashok is an exceptional engineer. His attention to detail and ability to craft elegant user experiences is truly outstanding. Working with him has been a masterclass in frontend performance and design precision.",user_id:"c776fc06-9da2-4952-8e80-e2f6bf86103a"},{id:"a1cf6a3b-f517-4e01-8f1d-e721fdf9502a",full_name:"Ashok V",designation:"Sr. Software Engineer",company:"PLM Indishtech",rating:5,testimonial:"Building high-performance design systems is my passion. This portfolio serves as a playground for advanced UI animations, responsive layouts, and state-of-the-art web architectures.",user_id:"c776fc06-9da2-4952-8e80-e2f6bf86103b"},{id:"d3ef58df-d7e5-48c5-9d86-102eb8ba5468",full_name:"rohini basava",designation:"Mendix Developer",company:"Crescenza Consulting group",rating:5,testimonial:"Ashok was an exceptional UI/UX developer who had an eye for detail and a deep understanding of user-centered design. His ability to transform complex requirements into intuitive, visually appealing, and user-friendly interfaces made him an invaluable part of every project. Working with him was always a great experience.",user_id:"c776fc06-9da2-4952-8e80-e2f6bf86103b"}],t=a.length,o=(a.reduce((p,h)=>p+(h.rating||5),0)/t).toFixed(1),s=a.filter(p=>p.user_id).length,r=Math.round(s/t*100),i=document.getElementById("stats-total-count"),c=document.getElementById("stats-average-rating"),d=document.getElementById("stats-verified-percent");i&&(i.textContent=t),c&&(c.textContent=`${o}/5`),d&&(d.textContent=`${r}%`);const l=[],f=new Set;a.forEach(p=>{const h=(p.full_name||p.google_name||"Collaborator").trim();h&&!f.has(h.toLowerCase())&&(f.add(h.toLowerCase()),l.push(p))});const u=document.getElementById("collaborators-badge-count");if(u){const p=l.length===1?"1 happy collaborator":`${l.length} happy collaborators`;u.innerHTML=`<span>${p}</span>`}const g=document.getElementById("collaborator-avatars-list");g&&(g.innerHTML=l.slice(0,4).map(p=>{const h=p.full_name||p.google_name||"Collaborator",w=p.avatar_url||p.google_avatar||"";if(w&&(w.includes("unsplash")||w.includes("google")||w.includes("http")||w.includes("photo-")))return`<img src="${w}" alt="${h}" title="${h}" />`;{const S=h.split(" ").map(b=>b[0]).slice(0,2).join("").toUpperCase();return`<div class="collaborator-avatar-fallback-initials" title="${h}">${S}</div>`}}).join("")),fe(a)}},tt=async()=>{try{if(window.CertificationService){const{data:e,error:a}=await window.CertificationService.getPublishedCertifications();if(a)throw a;const t=e?e.length:0,n=e?e.filter(l=>l.credential_url&&l.credential_url.trim()!==""||l.certificate_file_url).length:0,o=t>0?Math.round(n/t*100):0,s=document.querySelectorAll(".certifications-trust-panel-v2 .trust-stat-title");s&&s.length>=2&&(s[0].textContent=t>0?`${t}+`:"0",s[1].textContent=`${o}%`);const r=[],i=new Set;e&&e.forEach(l=>{if(l.issuer){const f=l.issuer.toLowerCase().trim();i.has(f)||(i.add(f),r.push({name:l.issuer,iconUrl:l.certificate_image_url||null}))}});const c=r.slice(0,6),d=document.querySelector(".certifications-grid-v2");if(d)if(c.length===0)d.innerHTML='<div style="grid-column: span 6; text-align: center; color: #94A3B8; padding: 40px 0; font-size: 14px;">No certifications published yet.</div>';else{const l=(f,u)=>{if(u&&u.trim()!=="")return`<img src="${u}" alt="${f}" style="height: 32px; width: auto; object-fit: contain;" />`;const g=f.toLowerCase().trim();return g.includes("mendix")?'<img src="assets/images/Mendix-Brandmark.webp" alt="Mendix" style="height: 32px; width: auto; object-fit: contain;" />':g.includes("google")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #60A5FA;">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 7.14 1 3 5.14 3 10.25s4.14 9.25 9.24 9.25c5.32 0 8.86-3.72 8.86-9.01 0-.61-.06-1.08-.14-1.54H12.24z"/>
              </svg>`:g.includes("aws")||g.includes("amazon")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #F59E0B;">
                <path d="M11.625 15.783c-1.189 0-2.18-.152-2.973-.456-.793-.304-1.229-.685-1.31-1.144-.066-.379.083-.75.446-1.112.363-.362.908-.667 1.636-.916.727-.248 1.656-.424 2.787-.528l2.673-.243v1.39c0 .736-.188 1.282-.564 1.637-.376.356-.99.534-1.84.534m3.048-6.147v1.73l-2.423.23c-1.393.13-2.483.364-3.272.705-.789.34-1.34.786-1.655 1.336-.314.55-.471 1.157-.471 1.823 0 .973.307 1.737.92 2.293.614.555 1.492.833 2.634.833 1.082 0 1.986-.226 2.711-.678a4.877 4.877 0 0 0 1.684-1.874h.084c.121.666.333 1.168.636 1.505.303.337.755.505 1.356.505.47 0 .973-.105 1.511-.314a13.38 13.38 0 0 0 1.51-.714V14.86c0-.987-.042-1.921-.125-2.802-.083-.88-.242-1.66-.477-2.339a5.147 5.147 0 0 0-1.042-1.874c-.496-.549-1.194-.973-2.096-1.272-.9-.3-2.023-.45-3.37-.45-1.42 0-2.585.185-3.493.555a6.666 6.666 0 0 0-2.33 1.585l1.323 1.306c.49-.496.99-.861 1.5-1.096.51-.235 1.176-.353 2.0-.353.94 0 1.636.19 2.09.569.453.38.68.959.68 1.738"/>
                <path d="M12.046 22.094c3.488 0 6.634-1.22 8.784-3.213.303-.28.1-.733-.303-.64-2.883.666-6.425.992-9.743.992-3.473 0-7.253-.36-10.158-1.092-.394-.1-.594.364-.285.64 2.224 1.993 5.485 3.313 9.705 3.313m8.948-4.053c-.328-.426-1.503-.186-2.073-.092-.188.03-.236-.18-.073-.314.509-.42 1.485-.363 1.867.042.382.404-.036 1.442-.442 1.916-.134.155-.31.066-.273-.146.115-.658.322-.98.994-1.406"/>
              </svg>`:g.includes("microsoft")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                <path d="M2 2h9.5v9.5H2V2zm10.5 0H22v9.5h-9.5V2zM2 12.5h9.5V22H2v-9.5zm10.5 0H22V22h-9.5v-9.5z" fill="#F25022"/>
              </svg>`:g.includes("meta")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #0668E1;">
                <path d="M22.5 12c0-3.32-2.7-6-6-6-2.22 0-4.14 1.2-5.16 3-1.02-1.8-2.94-3-5.16-3-3.3 0-6 2.68-6 6 0 3.31 2.7 6 6 6 2.22 0 4.14-1.2 5.16-3 1.02 1.8 2.94 3 5.16 3 3.3 0 6-2.69 6-6zm-17.34 4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm11.68 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>`:g.includes("linux")?`<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" style="color: #64748B;">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>`:`<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#7C5CFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>`};d.innerHTML=c.map(f=>`
            <div class="provider-logo-card">
              <div class="provider-logo-container">
                ${l(f.name,f.iconUrl)}
              </div>
              <span class="provider-name">${f.name}</span>
              <div class="provider-glow-dot"></div>
            </div>
          `).join("")}}}catch(e){console.error("Failed to load dynamic certifications:",e)}},at=async()=>{try{if(window.ProjectService){const{data:e,error:a}=await window.ProjectService.getPublishedProjects();if(a)throw a;const t=e?e.length:0,n=document.getElementById("stat-projects-delivered");n&&(n.textContent=`${t}+`);const o=new Set,s=new Set;e&&e.forEach(c=>{if(c.category){const d=c.category.trim(),l=d.toLowerCase();d&&!s.has(l)&&(s.add(l),o.add(d))}});const r=o.size,i=document.getElementById("stat-industries-served");i&&(i.textContent=`${r}+`)}}catch(e){console.warn("Failed to load dynamic projects stats:",e);const a=document.getElementById("stat-projects-delivered");a&&(a.textContent="0+");const t=document.getElementById("stat-industries-served");t&&(t.textContent="0+")}};let D={ip_address:"Unknown",country:"Unknown",city:"Unknown"};const nt=async()=>{try{const e=await fetch("https://ipapi.co/json/");if(e.ok){const a=await e.json();D={ip_address:a.ip||"Unknown",country:a.country_name||"Unknown",city:a.city||"Unknown"}}}catch(e){console.warn("Geolocation prefetch failed:",e)}};nt();const Ce=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const a=Math.random()*16|0;return(e==="x"?a:a&3|8).toString(16)}),ot=()=>{let e=localStorage.getItem("visitor_id");return e||(e=Ce(),localStorage.setItem("visitor_id",e)),e},rt=()=>{let e=sessionStorage.getItem("session_id");return e||(e=Ce(),sessionStorage.setItem("session_id",e)),e},it=()=>{const e=navigator.userAgent;let a="Other",t="Other",n="Desktop";return e.includes("Firefox")?a="Firefox":e.includes("SamsungBrowser")?a="Samsung Browser":e.includes("Opera")||e.includes("OPR")?a="Opera":e.includes("Trident")?a="Internet Explorer":e.includes("Edge")||e.includes("Edg")?a="Edge":e.includes("Chrome")?a="Chrome":e.includes("Safari")&&(a="Safari"),e.includes("Windows")?t="Windows":e.includes("Macintosh")||e.includes("Mac OS X")?t="macOS":e.includes("Android")?t="Android":e.includes("iPhone")||e.includes("iPad")?t="iOS":e.includes("Linux")&&(t="Linux"),/Mobi|Android|iPhone|iPad|iPod/i.test(e)&&(n=/Tablet|iPad/i.test(e)?"Tablet":"Mobile"),{browser:a,os:t,deviceType:n,userAgent:e}},st=async()=>{const e=document.querySelector(".profile-actions .profile-action-primary"),a=document.querySelector(".profile-actions .profile-action-secondary");if(!e||!a)return;const t=e.querySelector("span"),n=a.querySelector("span");t&&(t.textContent="Loading...");try{if(window.ResumeService){const{data:o,error:s}=await window.ResumeService.getActiveResume();if(s||!o||!o.public_url)throw new Error(s?s.message:"No active resume found");t&&(t.textContent="Download Resume"),e.setAttribute("href","#"),e.removeAttribute("target"),e.removeAttribute("rel"),e.removeAttribute("aria-label"),e.setAttribute("aria-label","Download Ashok's active resume PDF directly");const r=e.cloneNode(!0);e.parentNode.replaceChild(r,e),r.addEventListener("click",async i=>{i.preventDefault();const c=r.querySelector("span"),d=c.textContent;c.textContent="Downloading...";let l=null;try{const f=it(),u={resume_id:o.id,session_id:rt(),visitor_id:ot(),page_source:window.location.pathname||"/",referrer:document.referrer||"",user_agent:f.userAgent,browser:f.browser,operating_system:f.os,device_type:f.deviceType,country:D.country,city:D.city,ip_address:D.ip_address,download_status:"completed"},{data:g,error:p}=await window.ResumeService.logResumeDownload(u);if(p)throw p;l=g;const h=await fetch(o.public_url);if(!h.ok)throw new Error(`HTTP status: ${h.status}`);const w=await h.blob(),S=window.URL.createObjectURL(w),b=document.createElement("a");b.href=S,b.download=o.file_name||"Resume.pdf",document.body.appendChild(b),b.click(),document.body.removeChild(b),window.URL.revokeObjectURL(S)}catch(f){if(console.error("Download tracking or file retrieval failed:",f),l&&l.id)try{await window.ResumeService.updateDownloadStatus(l.id,"failed")}catch(u){console.error("Failed to update download status:",u)}window.open(o.public_url,"_blank")}finally{c.textContent=d}}),n&&(n.textContent="View Online"),a.setAttribute("href",o.preview_url||o.public_url),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer"),a.removeAttribute("aria-label"),a.setAttribute("aria-label","Open Ashok's active resume preview in a new tab"),a.style.opacity="1",a.style.pointerEvents="auto",a.style.cursor="pointer"}else throw new Error("ResumeService not initialized")}catch(o){console.error("Failed to load active resume:",o),t&&(t.textContent="Resume Unavailable"),n&&(n.textContent="View Online");const s=e.cloneNode(!0);e.parentNode.replaceChild(s,e),s.setAttribute("href","#"),s.style.opacity="0.5",s.style.pointerEvents="none",s.style.cursor="not-allowed";const r=a.cloneNode(!0);a.parentNode.replaceChild(r,a),r.setAttribute("href","#"),r.style.opacity="0.5",r.style.pointerEvents="none",r.style.cursor="not-allowed"}};st();const he=()=>{if(typeof Lenis>"u")return;const e=new Lenis({duration:1.2,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a)),smoothWheel:!0,smoothTouch:!1});if(window.lenis=e,window.gsap&&window.ScrollTrigger)window.gsap.registerPlugin(window.ScrollTrigger),e.on("scroll",window.ScrollTrigger.update),window.gsap.ticker.add(a=>{e.raf(a*1e3)}),window.gsap.ticker.lagSmoothing(0);else{const a=t=>{e.raf(t),requestAnimationFrame(a)};requestAnimationFrame(a)}if(!V){const a=document.createElement("div");if(a.className="scroll-progress-bar",document.body.appendChild(a),window.gsap&&window.ScrollTrigger)window.gsap.to(a,{scaleX:1,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:!0}});else{const t=()=>{const n=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;a.style.transform=`scaleX(${n/100})`};e.on("scroll",t)}}if(!V&&window.gsap&&window.ScrollTrigger){const a=document.querySelectorAll(".expertise-card, .build-node, .portfolio-display-card, .resume-card, .resume-project-card, .resume-identity-card, .widget-teaser-card, .wall-card");if(a.length>0){let t={skew:0};const n=window.gsap.quickSetter(a,"skewY","deg"),o=window.gsap.utils.clamp(-2.5,2.5);window.ScrollTrigger.create({onUpdate:s=>{const r=s.getVelocity(),i=o(r/-350);Math.abs(i)>Math.abs(t.skew)&&(t.skew=i,window.gsap.to(t,{skew:0,duration:.8,ease:"power3.out",overwrite:"auto",onUpdate:()=>n(t.skew)}))}}),window.gsap.set(a,{transformOrigin:"center center",force3D:!0})}}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",he):he();const me=async()=>{const e=document.getElementById("navbar-auth-container");if(!e||!window.AuthService)return;const a=()=>{let r=window.location.pathname;r.endsWith(".html")&&(r=r.substring(0,r.lastIndexOf("/")+1)),r.endsWith("/")||(r+="/");const i=r.indexOf("/admin/");return i!==-1&&(r=r.substring(0,i+1)),r+"admin/"};let t=!1;const n=async r=>{var S,b;const i=((S=r.user_metadata)==null?void 0:S.avatar_url)||"",c=((b=r.user_metadata)==null?void 0:b.full_name)||r.email.split("@")[0],d=(r.email||"").trim().toLowerCase();let l=!1;const f=sessionStorage.getItem(`is_admin_${d}`);if(console.log("Authenticated Email:",d),f==="true")l=!0,console.log(`isAdmin from cache: ${l}`);else try{const{data:y,error:L}=await window.AuthService.supabase.from("admins").select("email, role, is_active").eq("email",d).maybeSingle();console.log("Admin Query Result:",{data:y,error:L}),!L&&y&&y.is_active===!0?(l=!0,sessionStorage.setItem(`is_admin_${d}`,"true")):sessionStorage.setItem(`is_admin_${d}`,"false"),console.log(`isAdmin: ${l}`)}catch(y){console.error("[Navbar Auth] Failed to check admin status:",y)}const u=`<div class="avatar-mount-point" data-image-url="${i||""}" data-display-name="${c}" data-class-name="navbar-user-avatar"></div>`,g=`<div class="avatar-mount-point" data-image-url="${i||""}" data-display-name="${c}" data-class-name="dropdown-user-header-avatar"></div>`;e.innerHTML=`
      <button type="button" class="navbar-user-avatar-btn" id="navbar-user-btn" aria-label="Open user menu" aria-expanded="false">
        ${u}
      </button>
      <div class="navbar-user-dropdown" id="navbar-user-dropdown">
        <div class="dropdown-user-header">
          ${g}
          <div class="dropdown-user-info">
            <span class="dropdown-user-name">${c}</span>
            <span class="dropdown-user-email">${d}</span>
          </div>
        </div>
        ${l?`
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
    `,e.querySelectorAll(".avatar-mount-point").forEach(y=>{const L=y.getAttribute("data-image-url"),F=y.getAttribute("data-display-name"),E=y.getAttribute("data-class-name");X.createRoot(y).render(Y.createElement(G,{imageUrl:L,displayName:F,className:E}))});const p=e.querySelector("#navbar-user-btn"),h=e.querySelector("#navbar-user-dropdown"),w=e.querySelector("#navbar-logout-btn");p==null||p.addEventListener("click",y=>{y.stopPropagation(),t=!t,h==null||h.classList.toggle("is-open",t),p.setAttribute("aria-expanded",String(t))}),w==null||w.addEventListener("click",async()=>{w.disabled=!0,w.innerHTML="<span>Signing out...</span>";try{const{error:y}=await window.AuthService.signOut();if(y)throw y;showToast("success","Signed Out","You have successfully signed out.")}catch(y){showToast("error","Sign Out Failed",y.message||"An error occurred."),w.disabled=!1,w.innerHTML="<span>Sign Out</span>"}}),document.addEventListener("click",y=>{t&&!e.contains(y.target)&&(t=!1,h==null||h.classList.remove("is-open"),p==null||p.setAttribute("aria-expanded","false"))})},o=(r=!1)=>{e.innerHTML=`
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
    `;const i=e.querySelector("#fallback-login-btn");i==null||i.addEventListener("click",async()=>{o(!0);try{const{data:c,error:d}=await window.AuthService.signInWithGoogle();if(d)throw d;if(c!=null&&c.url){const u=window.screen.width/2-260,g=window.screen.height/2-600/2,p=window.open(c.url,"Google Auth",`width=520,height=600,top=${g},left=${u},scrollbars=yes,status=yes`),h=setInterval(()=>{(!p||p.closed)&&(clearInterval(h),setTimeout(async()=>{await window.AuthService.getCurrentUser()||(showToast("error","Login Cancelled","Google sign-in popup was closed."),o(!1))},500))},800)}}catch(c){showToast("error","Authentication Failed",c.message||"An error occurred."),o(!1)}})},s=await window.AuthService.getCurrentUser();s?n(s):o(!1),window.AuthService.onAuthStateChange((r,i)=>{i!=null&&i.user?n(i.user):o(!1)}),window.addEventListener("message",async r=>{var i;if(!(r.origin!==window.location.origin&&r.origin!=="null")&&((i=r.data)==null?void 0:i.type)==="supabase-oauth-callback")if(r.data.status==="success")try{const{data:c,error:d}=await window.AuthService.setSession(r.data.hash);if(d)throw d;const l=await window.AuthService.getCurrentUser();l&&n(l)}catch(c){showToast("error","Session Error",c.message||"Failed to configure user session."),o(!1)}else showToast("error","Authentication Failed","Google sign-in was not successful."),o(!1)})};window.AuthService?me():document.addEventListener("DOMContentLoaded",()=>{window.AuthService&&me()});const ge=async()=>{if(window.SocialLinksService)try{const e=await window.SocialLinksService.getLinks(),a={};e.forEach(o=>{o.platform&&o.url&&(a[o.platform.toLowerCase()]=o.url.trim())}),window.configuredSocialLinks=a;const t=document.querySelectorAll("[data-social-key]"),n=window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;t.forEach(o=>{const s=o.dataset.socialKey.toLowerCase(),r=a[s];if(!r){o.href="#",s==="email"&&(o.textContent.includes("@")||o.textContent==="Not Configured")&&(o.textContent="Not Configured");return}if(s==="whatsapp"){let i=r;if(r.includes("wa.me/")){i=r.replace("wa.me/","web.whatsapp.com/send?phone=");const c=i.indexOf("?");if(c!==-1){const d=i.indexOf("?",c+1);d!==-1&&(i=i.substring(0,d)+"&"+i.substring(d+1))}}o.dataset.mobileHref=r,o.dataset.desktopHref=i,o.href=n?r:i}else if(s==="email"){const i=r.startsWith("mailto:")?r:`mailto:${r}`;o.href=i;const c=r.startsWith("mailto:")?r.substring(7):r;(o.textContent.includes("@")||o.textContent==="Not Configured")&&(o.textContent=c)}else{const i=/^https?:\/\//i.test(r)?r:`https://${r}`;o.href=i}})}catch(e){console.error("Failed to initialize dynamic social links:",e)}};document.addEventListener("click",e=>{const a=e.target.closest("a[data-social-key]");if(!a)return;const t=a.dataset.socialKey.toLowerCase(),n=window.configuredSocialLinks?window.configuredSocialLinks[t]:null;if(!n||!n.trim()){e.preventDefault();const s={linkedin:"LinkedIn profile",github:"GitHub profile",behance:"Behance profile",email:"Email address",whatsapp:"WhatsApp number",instagram:"Instagram profile"}[t]||t;window.showToast?window.showToast("info","Link Not Configured",`${s} has not been configured yet.`,5e3):alert(`${s} has not been configured yet.`)}});window.SocialLinksService?ge():document.addEventListener("DOMContentLoaded",()=>{window.SocialLinksService&&ge()});let Z=null;const z=(e,a=!0)=>{try{const t=C[e];if(!t){console.warn("Testimonial not found at index:",e);return}const n="★".repeat(t.rating||5)+"☆".repeat(5-(t.rating||5)),o=t.full_name||t.google_name||"Collaborator",s=t.avatar_url||t.google_avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",r=t.designation?t.company?`${t.designation} &bull; ${t.company}`:t.designation:t.company||"Collaborator",i=document.querySelector(".reading-card-body"),c=document.querySelector("#reading-author-name"),d=document.querySelector("#reading-author-title"),l=document.querySelector("#reading-avatar-slot"),f=document.querySelector("#reading-counter"),u=(t.testimonial||"").split(/\n\s*\n/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join(""),g=()=>{const p=document.querySelector("#reading-stars"),h=document.querySelector("#reading-text");if(p&&(p.innerHTML=n),h&&(h.innerHTML=u),c&&(c.textContent=o),d&&(d.innerHTML=r),l){const w=l._reactRoot||X.createRoot(l);l._reactRoot=w,w.render(Y.createElement(G,{imageUrl:s,displayName:o,className:"popover-avatar",size:48,style:{borderRadius:"50%",objectFit:"cover"}}))}f&&(f.textContent=`${e+1} of ${C.length}`)};a&&i?(i.style.opacity="0",i.style.transform="translateY(10px)",i.style.transition="opacity 200ms ease, transform 200ms ease",setTimeout(()=>{g(),i.style.opacity="1",i.style.transform="translateY(0)"},200)):g()}catch(t){console.error("Error inside updateExpandedCard:",t)}},lt=e=>{j=!0,k=e,Se=window.scrollY,Z=document.activeElement;const a=document.querySelector("#heard");a==null||a.classList.add("reading-mode-active"),document.body.classList.add("reading-mode-on"),window.lenis&&window.lenis.stop();const t=document.querySelector(".wall-carousel-wrapper");t&&(t.style.opacity="0",t.style.pointerEvents="none",t.style.transition="opacity 400ms ease");const n=document.querySelector("#reading-card-wrapper");n&&(n.style.display="flex",n.offsetHeight,n.style.opacity="1"),z(e,!1),setTimeout(()=>{var o;(o=document.querySelector("#reading-close-btn"))==null||o.focus()},100)},we=()=>{j=!1;const e=document.querySelector("#heard");e==null||e.classList.remove("reading-mode-active"),document.body.classList.remove("reading-mode-on"),window.lenis&&window.lenis.start();const a=document.querySelector(".wall-carousel-wrapper");a&&(a.style.opacity="1",a.style.pointerEvents="auto");const t=document.querySelector("#reading-card-wrapper");t&&(t.style.opacity="0",setTimeout(()=>{t.style.display="none"},500)),Z&&Z.focus(),window.scrollTo({top:Se,behavior:"smooth"})},ct=()=>{const e=document.querySelector("#reading-close-btn"),a=document.querySelector("#reading-prev-btn"),t=document.querySelector("#reading-next-btn");e==null||e.addEventListener("click",we),a==null||a.addEventListener("click",()=>{C.length>0&&(k=(k-1+C.length)%C.length,z(k,!0))}),t==null||t.addEventListener("click",()=>{C.length>0&&(k=(k+1)%C.length,z(k,!0))}),window.addEventListener("keydown",n=>{if(!j)return;if(n.key==="Escape"){we();return}if(n.key==="ArrowLeft"){a==null||a.click();return}if(n.key==="ArrowRight"){t==null||t.click();return}const o=document.querySelector(".reading-card-body");if(o){const r=o.clientHeight-40;if(n.key==="ArrowUp"){o.scrollTop-=50,n.preventDefault();return}if(n.key==="ArrowDown"){o.scrollTop+=50,n.preventDefault();return}if(n.key==="PageUp"){o.scrollTop-=r,n.preventDefault();return}if(n.key==="PageDown"){o.scrollTop+=r,n.preventDefault();return}if(n.key===" "&&document.activeElement!==e&&document.activeElement!==a&&document.activeElement!==t){n.shiftKey?o.scrollTop-=r:o.scrollTop+=r,n.preventDefault();return}}if(n.key==="Tab"){const s=document.querySelector("#reading-card");if(!s)return;const i=Array.from(s.querySelectorAll('button, [tabindex="0"]')).filter(l=>l.offsetWidth>0&&l.offsetHeight>0&&!l.disabled);if(i.length===0)return;const c=i[0],d=i[i.length-1];n.shiftKey?document.activeElement===c&&(d.focus(),n.preventDefault()):document.activeElement===d&&(c.focus(),n.preventDefault())}}),et(),tt(),at()},Le=()=>{window.CertificationService&&window.supabase&&window.APP_CONFIG?ct():setTimeout(Le,50)};Le();
