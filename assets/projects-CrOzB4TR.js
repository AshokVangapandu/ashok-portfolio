import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                     */import{r as p,j as e,R as U,c as H}from"./index-UWMGZqPa.js";import{m as $,s as Y,p as _}from"./Mendix-Brandmark-BwQc1MWn.js";import{b as V,A as q,P as G}from"./admin-CNrfDo3D.js";import{B as K,G as Z,P as Q}from"./GlobalRouteGuard-ClswxSa0.js";import{r as X}from"./attribution-CV1yLlH_.js";import"./projects-CA_ptObU.js";import"./particle-background-Cn-hxw0b.js";const J=({projects:s,onViewDetails:j})=>{const[f,l]=p.useState(""),[d,v]=p.useState(0),[a,h]=p.useState(!1),w=p.useRef(null),r=s.filter(o=>{const c=f.toLowerCase();return o.title.toLowerCase().includes(c)||o.description.toLowerCase().includes(c)||o.role.toLowerCase().includes(c)||o.category.toLowerCase().includes(c)||o.technologies.some(k=>k.toLowerCase().includes(c))}),i=r[d]||null;return p.useEffect(()=>{if(a||r.length<=1)return;const o=setInterval(()=>{v(c=>(c+1)%r.length)},5e3);return()=>clearInterval(o)},[a,r.length]),p.useEffect(()=>{if(!w.current)return;const o=w.current,c=o.children[d];if(!c)return;const k=o.clientWidth,C=c.offsetLeft,A=c.clientWidth;o.scrollTo({left:C-k/2+A/2,behavior:"smooth"})},[d]),e.jsxs("div",{className:"projects-collection-wrapper",children:[e.jsxs("div",{className:"projects-collection-header-row",children:[e.jsxs("div",{className:"projects-collection-title-group",children:[e.jsx("span",{className:"projects-collection-star-bullet",children:"★"}),e.jsx("h2",{className:"projects-collection-title",children:"Case Studies Archive"})]}),e.jsxs("div",{className:"projects-collection-search-box",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",className:"projects-collection-search-icon",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]}),e.jsx("input",{type:"text",value:f,onChange:o=>{l(o.target.value),v(0)},placeholder:"Search case studies...",className:"projects-collection-search-input"})]})]}),r.length>0?e.jsx("div",{ref:w,onMouseEnter:()=>h(!0),onMouseLeave:()=>h(!1),className:"projects-carousel-track",children:r.map((o,c)=>{const k=c===d;return e.jsxs("div",{onClick:()=>{v(c),h(!0)},className:`projects-carousel-card ${k?"active":""}`,children:[e.jsx("img",{src:o.coverImage,alt:o.title,className:"projects-carousel-card-img"}),e.jsxs("div",{className:"projects-carousel-card-overlay",children:[e.jsx("span",{className:"projects-carousel-card-cat",children:o.category}),e.jsx("h4",{className:"projects-carousel-card-title",children:o.title})]})]},o.id)})}):e.jsx("div",{className:"projects-empty-archive",children:"No case studies match your search queries."}),i&&e.jsxs("div",{className:"active-project-showcase-card",children:[e.jsxs("div",{className:"active-project-left-col",children:[e.jsxs("div",{className:"active-project-badges-row",children:[e.jsx("span",{className:"active-project-cat-pill",children:i.category}),e.jsx("span",{className:"active-project-dot",children:"•"}),e.jsx("span",{className:"active-project-timeline",children:i.timeline})]}),e.jsx("h3",{className:"active-project-title",children:i.title}),e.jsx("p",{className:"active-project-desc",children:i.description}),i.problemSolved&&e.jsxs("div",{className:"active-project-problem-box",children:[e.jsx("strong",{className:"active-project-problem-label",children:"Problem Solved"}),e.jsxs("p",{className:"active-project-problem-text",children:['"',i.problemSolved,'"']})]}),e.jsxs("div",{className:"active-project-metrics-row",children:[i.impactMetrics.map((o,c)=>e.jsxs("div",{className:"active-project-metric-card green",children:[e.jsx("span",{className:"active-project-metric-val",children:o.kpi}),e.jsx("span",{className:"active-project-metric-lbl",children:o.label})]},c)),i.users&&e.jsxs("div",{className:"active-project-metric-card purple",children:[e.jsx("span",{className:"active-project-metric-val",children:i.users}),e.jsx("span",{className:"active-project-metric-lbl",children:"Active Users"})]})]}),e.jsxs("div",{className:"active-project-actions-row",children:[e.jsxs("button",{type:"button",onClick:()=>j(i),className:"active-project-details-btn",children:[e.jsx("span",{children:"View Full Case Study Details"}),e.jsx("span",{style:{fontSize:"15px"},children:"→"})]}),i.demoUrl&&e.jsx("a",{href:i.demoUrl,target:"_blank",rel:"noreferrer",className:"active-project-preview-btn",children:"Live Preview"})]})]}),e.jsxs("div",{className:"active-project-right-col",children:[e.jsx("div",{className:"active-project-img-box",children:e.jsx("img",{src:i.coverImage,alt:i.title,className:"active-project-img"})}),e.jsxs("div",{className:"active-project-meta-box",children:[e.jsxs("div",{children:[e.jsx("span",{className:"active-project-meta-label",children:"My Role"}),e.jsx("p",{className:"active-project-meta-val",children:i.role})]}),e.jsxs("div",{children:[e.jsx("span",{className:"active-project-meta-label",children:"Target Client"}),e.jsx("p",{className:"active-project-meta-val",children:i.client})]})]}),e.jsx("div",{className:"active-project-tech-tags",children:i.technologies.map(o=>e.jsx("span",{className:"active-project-tech-tag",children:o},o))})]})]})]})},ee=()=>{const s=[{value:"50K+",line1:"DAILY",line2:"ACTIVE USERS"},{value:"98%",line1:"CLIENT",line2:"SATISFACTION RATE"},{value:"60%",line1:"REDUCED",line2:"MANUAL WORKFLOWS"},{value:"40%",line1:"FASTER",line2:"PROCESSING SPEED"},{value:"100+",line1:"ORCHESTRATED",line2:"WORKFLOWS"}];return e.jsxs("div",{className:"impact-showcase-section",children:[e.jsxs("div",{className:"impact-header-row",children:[e.jsx("span",{className:"impact-sparkle-bullet",children:"✦"}),e.jsx("h3",{className:"impact-header-title",children:"Proven Business Impact"})]}),e.jsx("div",{className:"impact-metrics-grid",children:s.map((j,f)=>e.jsxs("div",{className:"impact-metric-card",children:[e.jsx("span",{className:"impact-metric-val",children:j.value}),e.jsxs("span",{className:"impact-metric-lbl",children:[e.jsx("span",{children:j.line1}),e.jsx("span",{children:j.line2})]})]},f))})]})},te=()=>{const s=["Healthcare","Legal","Enterprise","HR / Staffing","Construction","Manufacturing","Education","Government"],j=[...s,...s];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",width:"100%",boxSizing:"border-box",padding:"40px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)",overflow:"hidden"},children:[e.jsx("div",{style:{textAlign:"center"},children:e.jsx("h3",{style:{fontSize:"11px",fontWeight:800,margin:0,color:"#64748B",letterSpacing:"0.25em",textTransform:"uppercase"},children:"INDUSTRIES & DOMAINS I BUILD FOR"})}),e.jsx("div",{style:{width:"100%",overflow:"hidden",position:"relative",padding:"12px 0",display:"flex",alignItems:"center",WebkitMaskImage:"linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)"},children:e.jsx("div",{className:"industry-marquee-track",style:{display:"flex",alignItems:"center",gap:"40px",width:"max-content",animation:"marquee-ind 40s linear infinite"},children:j.map((f,l)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"40px"},children:[e.jsx("span",{style:{fontSize:"15px",fontWeight:800,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"},children:f}),e.jsx("span",{style:{color:"#8B5CF6",fontSize:"18px",fontWeight:900},children:"•"})]},l))})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes marquee-ind {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .industry-marquee-track:hover {
          animation-play-state: paused;
        }
      `}})]})},re=()=>{const s=[{name:"Mendix",label:"Low-Code Engine",icon:e.jsx("img",{src:$,style:{width:"28px",height:"28px",objectFit:"contain"},alt:"Mendix"})},{name:"React",label:"UI Framework",icon:e.jsxs("svg",{viewBox:"-11.5 -10.23 23 20.46",width:"30",height:"30",children:[e.jsx("circle",{cx:"0",cy:"0",r:"2.05",fill:"#61DAFB"}),e.jsxs("g",{stroke:"#61DAFB",strokeWidth:"1",fill:"none",children:[e.jsx("ellipse",{rx:"11",ry:"4.2"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(60)"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(120)"})]})]})},{name:"TypeScript",label:"Typed Scripting",icon:e.jsxs("svg",{viewBox:"0 0 100 100",width:"30",height:"30",children:[e.jsx("rect",{width:"100",height:"100",fill:"#3178C6",rx:"12"}),e.jsx("path",{d:"M63 40h-8.5v35h-9V40h-8.5v-7.5H63V40zm12.5 19.3c-1.5-1-3.6-1.7-6.2-1.7-3 0-4.8 1.4-4.8 3.5 0 2 1.6 3 4.8 4.2 4.6 1.7 8.3 3.5 8.3 8.7 0 5.4-4.5 9-11.3 9-3.7 0-7.2-1.1-9.2-2.7l3-6.5c1.8 1.3 4.5 2.2 7 2.2 3.1 0 4.8-1.4 4.8-3.6 0-2.3-1.8-3.2-5.1-4.5-4.5-1.7-8-3.8-8-8.5 0-5 4-8.7 10.5-8.7 3.3 0 6 1 7.7 2.1l-3.2 6.1z",fill:"#FFFFFF"})]})},{name:"SCSS",label:"Sassy Styles",icon:e.jsx("img",{src:Y,style:{width:"30px",height:"30px",objectFit:"contain"},alt:"SCSS"})},{name:"Figma",label:"UI/UX Design",icon:e.jsxs("svg",{viewBox:"0 0 38 57",width:"20",height:"30",fill:"none",children:[e.jsx("path",{d:"M19 19C19 8.5 10.5 0 0 0V19H19Z",fill:"#F24E1E"}),e.jsx("path",{d:"M19 0H38V19H19V0Z",fill:"#FF7262"}),e.jsx("path",{d:"M19 19H38V38H19V19Z",fill:"#10B981"}),e.jsx("path",{d:"M19 38C19 27.5 10.5 19 0 19V38H19Z",fill:"#A259FF"}),e.jsx("path",{d:"M19 57C19 46.5 10.5 38 0 38H19V57Z",fill:"#1ABC9C"})]})},{name:"Node.js",label:"Runtime Engine",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"30",height:"30",fill:"#339933",children:e.jsx("path",{d:"M12 1.3L3.1 6.4v10.2l8.9 5.1 8.9-5.1V6.4L12 1.3zm6.6 14.3l-6.6 3.8-6.6-3.8V8.6l6.6-3.8 6.6 3.8v7z"})})},{name:"Vite",label:"Fast Bundling",icon:e.jsxs("svg",{viewBox:"0 0 256 256",width:"30",height:"30",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"viteGrad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#41D1FF"}),e.jsx("stop",{offset:"100%",stopColor:"#BD34FE"})]})}),e.jsx("path",{d:"M128 0L24 180h56l48-84 48 84h56L128 0z",fill:"url(#viteGrad)"}),e.jsx("polygon",{points:"128 50 80 150 115 150 100 230 176 120 135 120 128 50",fill:"#FFC517"})]})}],j=[...s,...s,...s],[f,l]=p.useState(.5),d=p.useRef(null),v=p.useRef(),a=p.useRef(),h=p.useRef(!1),w=p.useRef(.8),r=.8,i=.016,o=()=>{if(!d.current)return;const u=d.current,m=u.scrollLeft+u.clientWidth/2,n=u.scrollWidth/3;if(n>0){const N=u.scrollLeft%n/n;l(N)}Array.from(u.children).forEach(N=>{const S=N;if(S.dataset.type!=="card")return;const D=S.offsetLeft+S.clientWidth/2,W=Math.abs(D-m),b=Math.max(0,1-W/180),I=.94+b*.09,z=.4+b*.6,L=(1-b)*1,B=60+b*40,R=b*-3;S.style.transform=`scale(${I}) translateY(${R}px) translateZ(0)`,S.style.opacity=`${z}`,S.style.filter=`blur(${L}px) saturate(${B}%)`;const t=b*.6,x=.05+b*.35;S.style.borderColor=`rgba(167, 139, 250, ${x})`,S.style.backgroundColor=`rgba(10, 15, 30, ${.45+b*.25})`,S.style.boxShadow=`
        0 8px 24px rgba(0, 0, 0, ${.15+b*.1}), 
        0 0 20px rgba(167, 139, 250, ${t*.18}),
        inset 0 1px 0 rgba(255, 255, 255, 0.04)
      `;const y=S.querySelector(".tech-icon-wrapper");y&&(y.style.transform=`scale(${1+b*.1})`,y.style.filter=`brightness(${1+b*.2})`);const F=S.querySelector(".tech-label");F&&(F.style.opacity=`${b}`,F.style.height=`${b*14}px`)})};p.useEffect(()=>{const u=()=>{if(d.current){const m=d.current;if(h.current?w.current>0&&(w.current=Math.max(0,w.current-.04)):w.current<r&&(w.current=Math.min(r,w.current+i)),w.current>0){let n=m.scrollLeft+w.current;const g=m.scrollWidth/3;g>0&&(n>=g*2?n-=g:n<=g&&(n+=g),m.scrollLeft=n)}}v.current=requestAnimationFrame(u)};return v.current=requestAnimationFrame(u),()=>{v.current&&cancelAnimationFrame(v.current),a.current&&cancelAnimationFrame(a.current)}},[]),p.useEffect(()=>{const u=()=>{if(!d.current)return;const m=d.current,n=m.scrollWidth/3;n>0?(m.scrollLeft=n,o()):requestAnimationFrame(u)};u()},[]);const c=u=>{if(!d.current)return;const m=d.current,n=m.children[u];if(!n)return;h.current=!0;const g=m.clientWidth,N=n.offsetLeft-g/2+n.clientWidth/2,S=m.scrollLeft,D=performance.now(),W=600;a.current&&cancelAnimationFrame(a.current);const T=b=>{const I=b-D,z=Math.min(1,I/W),L=1-Math.pow(1-z,3);m.scrollLeft=S+(N-S)*L,z<1?a.current=requestAnimationFrame(T):setTimeout(()=>{h.current=!1},1500)};a.current=requestAnimationFrame(T)},k=()=>{if(!d.current)return 0;const u=d.current,m=u.scrollLeft+u.clientWidth/2,n=Array.from(u.children);let g=1/0,N=0;return n.forEach((S,D)=>{const W=S;if(W.dataset.type!=="card")return;const T=W.offsetLeft+W.clientWidth/2,b=Math.abs(T-m);b<g&&(g=b,N=D)}),N},C=()=>{const u=k(),m=d.current;if(!m)return;let n=u+1;for(;n<m.children.length;){const g=m.children[n];if(g&&g.dataset.type==="card"){c(n);break}n++}},A=()=>{const u=k(),m=d.current;if(!m)return;let n=u-1;for(;n>=0;){const g=m.children[n];if(g&&g.dataset.type==="card"){c(n);break}n--}};return e.jsxs("div",{className:"tech-showcase-container",children:[e.jsxs("div",{className:"tech-showcase-header",children:[e.jsxs("div",{className:"tech-badge-pill",children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"#A78BFA",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})}),e.jsx("span",{children:"TECH & TOOLS I WORK WITH"})]}),e.jsxs("h2",{className:"tech-showcase-title",children:["Modern technologies powering ",e.jsx("span",{className:"purple-gradient-text",children:"enterprise"})," solutions"]})]}),e.jsxs("div",{className:"tech-slider-wrapper",onMouseEnter:()=>{h.current=!0},onMouseLeave:()=>{h.current=!1},children:[e.jsx("button",{onClick:A,type:"button","aria-label":"Previous Technology",className:"slider-arrow slider-arrow-left",children:e.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})})}),e.jsx("div",{ref:d,onScroll:o,className:"tech-scroll-track",children:j.map((u,m)=>e.jsxs(U.Fragment,{children:[e.jsxs("div",{"data-type":"card",onClick:()=>c(m*2),className:"tech-card",children:[e.jsx("div",{className:"tech-icon-wrapper",children:u.icon}),e.jsxs("div",{className:"tech-card-text",children:[e.jsx("span",{className:"tech-name",children:u.name}),e.jsx("span",{className:"tech-label",children:u.label})]})]}),e.jsx("span",{className:"tech-separator-diamond",children:"♦"})]},m))}),e.jsx("button",{onClick:C,type:"button","aria-label":"Next Technology",className:"slider-arrow slider-arrow-right",children:e.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]}),e.jsx("div",{className:"tech-progress-bar-bg",children:e.jsx("div",{className:"tech-progress-bar-fill",style:{left:`${f*70}%`}})}),e.jsx("span",{className:"tech-footer-subtext",children:"TECHNOLOGIES BEHIND THE PRODUCTS I BUILD"})]})},ie=()=>{const[s,j]=p.useState("");p.useEffect(()=>{let l=!0;return V.getLinks().then(d=>{if(!l)return;const v=d.find(a=>a.platform.toLowerCase()==="email");if(v&&v.url){const a=v.url.trim(),h=a.startsWith("mailto:")?a:`mailto:${a}`;j(h)}}).catch(d=>{console.error("[CTASection] Failed to load email link:",d)}),()=>{l=!1}},[]);const f=l=>{s||(l.preventDefault(),typeof window<"u"&&window.showToast?window.showToast("info","Link Not Configured","Email address has not been configured yet.",5e3):alert("Email address has not been configured yet."))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"64px 40px",background:"radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",border:"1px solid rgba(255, 255, 255, 0.04)",borderRadius:"24px",width:"100%",boxSizing:"border-box",gap:"24px",fontFamily:"'Manrope', sans-serif",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"rgba(124, 58, 237, 0.1)",border:"1px solid rgba(124, 58, 237, 0.2)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",maxWidth:"560px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"26px",fontWeight:850,color:"#FFFFFF",letterSpacing:"-0.02em"},children:"Interested in building your next digital product?"}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:1.5,color:"#94A3B8"},children:"Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets."})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"12px",justifyContent:"center"},children:[e.jsx("a",{href:"/#contact",className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",boxShadow:"0 4px 20px rgba(124, 58, 237, 0.35)",transition:"all 0.15s ease"},onMouseOver:l=>l.currentTarget.style.backgroundColor="var(--admin-primary-hover)",onMouseOut:l=>l.currentTarget.style.backgroundColor="var(--admin-primary)",children:"Let's Collaborate"}),e.jsx("a",{href:s||"#",onClick:f,className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#E2E8F0",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",transition:"all 0.15s ease"},onMouseOver:l=>{l.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.06)",l.currentTarget.style.borderColor="rgba(255, 255, 255, 0.1)"},onMouseOut:l=>{l.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.02)",l.currentTarget.style.borderColor="rgba(255, 255, 255, 0.06)"},children:"Contact Me"})]})]})},P=s=>{const j=s.features||[],f=["https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"],l=["Consolidates real-time information flow to design an unified interactive user interface. Reduces visual cognitive overload by staging details contextually.","Provides customizable workspace layouts, dashboard filters, and smart notifications to align with complex operational requirements and compliance controls.","Encrypted real-time data streaming pipeline optimized for low-latency delivery, high concurrent user loads, and complete data safety audits.","Centralized administration panel designed to manage user access privileges, audit data modifications, and check system performance metrics."],d=[["Consolidates all system components into a single audit-ready dashboard","Minimizes loading latency by implementing data caching strategies","Configured with strict role-based access logs to satisfy compliance"],["Supports automated alerts and delivery updates to target users","Custom filter menus based on status, severity, and timeline parameters","Audit log captures all user viewing and update actions for logs"],["Ensures end-to-end data encryption across secure transfer channels","Automatic backup systems with rapid failover disaster recovery","Simple integration hooks to connect to external systems"],["Real-time health telemetry checks showing process resource usages","Vibrant analytics visualizations presenting KPIs and outcomes","Simplified bulk-action menus to streamline repeated operations"]];return j.length>0?j.map((v,a)=>{const h=a%f.length,w=l[a%l.length],r=d[a%d.length];return{id:`mock-feat-${a}`,projectId:s.id,title:v,description:w,imageUrl:f[h],imageThumbnailUrl:f[h],imageAlt:`${v} Screenshot`,displayOrder:a,isActive:!0,bullets:r.map((i,o)=>({id:`mock-bullet-${a}-${o}`,featureId:`mock-feat-${a}`,text:i,displayOrder:o}))}}):[{id:"mock-feat-0",projectId:s.id,title:"Interactive Dashboard Operations",description:"A centralized workspace designed to simplify complex operational actions, view details contextually, and manage system states.",imageUrl:f[0],imageThumbnailUrl:f[0],imageAlt:"Dashboard Overview",displayOrder:0,isActive:!0,bullets:[{id:"b0-1",featureId:"mock-feat-0",text:"Consolidates all operational actions in a single control screen",displayOrder:0},{id:"b0-2",featureId:"mock-feat-0",text:"Vibrant charts presenting live telemetry and metrics values",displayOrder:1},{id:"b0-3",featureId:"mock-feat-0",text:"High security controls satisfying enterprise regulatory standards",displayOrder:2}]}]},oe=({project:s,onClose:j})=>{const[f,l]=p.useState([]),[d,v]=p.useState(!1),[a,h]=p.useState(null),[w,r]=p.useState(0),i=p.useRef(null),o=p.useRef(null);if(p.useEffect(()=>(s&&(document.body.style.overflow="hidden",o.current&&o.current.focus()),()=>{document.body.style.overflow=""}),[s]),p.useEffect(()=>{s&&(v(!0),l([]),_.getProjectFeatures(s.id).then(t=>{t&&t.length>0?l(t):l(P(s))}).catch(t=>{console.error("[ProjectDetailsModal] Failed loading details:",t),l(P(s))}).finally(()=>{v(!1)}))},[s]),p.useEffect(()=>{const t=()=>{if(i.current){const{scrollTop:y,scrollHeight:F,clientHeight:E}=i.current,M=F-E;M>0&&r(y/M*100)}},x=i.current;return x&&x.addEventListener("scroll",t),()=>{x&&x.removeEventListener("scroll",t)}},[s,d]),p.useEffect(()=>{if(d)return;const t=new IntersectionObserver(y=>{y.forEach(F=>{F.isIntersecting&&(F.target.classList.add("is-revealed"),t.unobserve(F.target))})},{threshold:.15}),x=document.querySelectorAll(".reveal-trigger");return x.forEach(y=>t.observe(y)),()=>{x.forEach(y=>t.unobserve(y))}},[f,d,s]),p.useEffect(()=>{const t=x=>{s&&(a?x.key==="ArrowLeft"?B():x.key==="ArrowRight"?R():x.key==="Escape"&&h(null):x.key==="Escape"&&j())};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[s,a,f]),!s)return null;const{title:c,description:k,category:C,client:A,role:u,timeline:m,platform:n,coverImage:g,technologies:N,demoUrl:S,githubUrl:D,features:W,problemSolved:T,solution:b,businessValue:I,fullDescription:z,impactMetrics:L}=s,B=()=>{if(!a)return;const t=[g,...f.map(F=>F.imageUrl).filter(F=>!!F)],x=t.indexOf(a.url);if(x===-1||t.length===0)return;const y=x>0?x-1:t.length-1;h({url:t[y],title:"Showcase Image"})},R=()=>{if(!a)return;const t=[g,...f.map(F=>F.imageUrl).filter(F=>!!F)],x=t.indexOf(a.url);if(x===-1||t.length===0)return;const y=x<t.length-1?x+1:0;h({url:t[y],title:"Showcase Image"})};return e.jsxs("div",{ref:o,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":"case-study-title",style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.35)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box",fontFamily:"'Manrope', sans-serif",outline:"none"},onClick:j,children:[e.jsxs("div",{ref:i,"data-particle-scroll":!0,style:{width:"100%",maxWidth:"1100px",height:"100%",maxHeight:"92vh",backgroundColor:"#FFFFFF",borderRadius:"24px",boxShadow:"0 30px 80px -15px rgba(0, 0, 0, 0.95)",overflowY:"auto",position:"relative",display:"flex",flexDirection:"column",boxSizing:"border-box",scrollbarWidth:"thin",scrollbarColor:"rgba(0,0,0,0.1) transparent",animation:"slideUpModal 350ms cubic-bezier(0.16, 1, 0.3, 1)"},onClick:t=>t.stopPropagation(),children:[e.jsx("div",{style:{position:"sticky",top:0,left:0,right:0,height:"4px",backgroundColor:"rgba(0,0,0,0.05)",zIndex:100,display:"block"},children:e.jsx("div",{style:{height:"100%",width:`${w}%`,backgroundColor:"#8B5CF6",boxShadow:"0 0 8px #8B5CF6",transition:"width 0.1s ease-out"}})}),e.jsxs("div",{className:"modal-sticky-top-bar",style:{position:"sticky",top:0,left:0,right:0,zIndex:150,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",backgroundColor:"rgba(9, 13, 26, 0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255, 255, 255, 0.08)",boxSizing:"border-box"},children:[e.jsxs("button",{type:"button",onClick:j,style:{backgroundColor:"transparent",border:"none",color:"#A78BFA",fontSize:"13.5px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",padding:"4px 8px",borderRadius:"8px",outline:"none",transition:"all 150ms ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]}),e.jsx("span",{children:"Back to Showcase"})]}),e.jsx("button",{type:"button",onClick:j,style:{width:"34px",height:"34px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.06)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 150ms ease"},"aria-label":"Close Case Study",children:"×"})]}),e.jsxs("div",{style:{position:"relative",width:"100%",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, rgba(9, 13, 26, 0) 70%)",padding:"36px 48px 32px 48px",boxSizing:"border-box",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"24px",overflow:"hidden"},className:"hero-section-grid",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",textAlign:"left",gap:"16px",width:"100%",maxWidth:"1000px",zIndex:2},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#A78BFA",backgroundColor:"rgba(139, 92, 246, 0.12)",border:"1px solid rgba(139, 92, 246, 0.2)",borderRadius:"999px",padding:"4px 14px",width:"fit-content",textTransform:"uppercase",letterSpacing:"0.06em",animationDelay:"0ms"},className:"animate-fade-in-up",children:C?C.replace(/case study/gi,"").trim():"Featured Project"}),e.jsx("h1",{id:"case-study-title",style:{margin:0,fontSize:"44px",fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.03em",lineHeight:"1.15",animationDelay:"60ms"},className:"animate-fade-in-up",children:c}),k&&e.jsx("p",{style:{margin:0,fontSize:"16.5px",lineHeight:"1.6",color:"#94A3B8",animationDelay:"120ms"},className:"animate-fade-in-up",children:k}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",gap:"32px",marginTop:"8px",borderTop:"1px solid rgba(255, 255, 255, 0.06)",paddingTop:"20px",width:"100%",animationDelay:"180ms"},className:"animate-fade-in-up",children:[{label:"Timeline",val:m||"2 Weeks",icon:"⏱"},{label:"My Role",val:u||"Lead Developer",icon:"👤"},{label:"Client",val:A||"Internal Dev",icon:"💼"},{label:"Platform",val:n||"Web Application",icon:"💻"}].map((t,x)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"3px"},children:[e.jsxs("span",{style:{fontSize:"9px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{children:t.icon})," ",t.label]}),e.jsx("span",{style:{fontSize:"13px",fontWeight:500,color:"#E2E8F0"},children:t.val})]},x))})]}),g&&e.jsx("div",{style:{width:"100%",maxWidth:"1040px",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(255, 255, 255, 0.05)",boxShadow:"0 20px 50px rgba(0, 0, 0, 0.35)",transition:"transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",cursor:"zoom-in",backgroundColor:"#090D1A",zIndex:2,marginTop:"16px",animationDelay:"240ms"},className:"animate-fade-in-up",onClick:()=>{h({url:g,title:`${c} Cover Screenshot`})},onMouseEnter:t=>{t.currentTarget.style.transform="translateY(-4px) scale(1.005)"},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0) scale(1)"},children:e.jsx("img",{src:g,alt:`${c} Showcase Cover`,style:{width:"100%",height:"auto",display:"block",objectFit:"cover"}})})]}),(T&&T.trim()!==""||b&&b.trim()!==""||I&&I.trim()!==""||z&&z.trim()!=="")&&e.jsx("div",{className:"case-story-section",style:{padding:"56px 48px 80px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{className:"case-story-container",style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"40px"},children:[e.jsxs("div",{className:"case-story-heading",style:{textAlign:"center",maxWidth:"600px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Project Narrative"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:650,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Journey & Outcome"})]}),e.jsxs("div",{className:"case-story-problem-solution",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"32px"},children:[T&&T.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #EF4444",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(239, 68, 68, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(239, 68, 68, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"0ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#EF4444"},children:"⚠️"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Challenge"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:T})]}),b&&b.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #8B5CF6",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(139, 92, 246, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(139, 92, 246, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"80ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#8B5CF6"},children:"💡"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Solution"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:b})]})]}),(z&&z.trim()!==""||I&&I.trim()!=="")&&e.jsxs("div",{className:"case-story-outcome-grid",style:{display:"flex",gap:"32px",marginTop:"16px",flexWrap:"wrap",width:"100%"},children:[z&&z.trim()!==""&&e.jsxs("div",{style:{flex:I&&I.trim()!==""?"1.8":"1",minWidth:"320px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #3B82F6",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#3B82F6"},children:"📄"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"Detailed Project Overview"})]}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:"1.8",color:"#475569",fontWeight:450,whiteSpace:"pre-wrap"},children:z})]}),I&&I.trim()!==""&&e.jsxs("div",{style:{flex:"1",minWidth:"280px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #10B981",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#10B981"},children:"📈"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"Business Outcome"})]}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:I})]})]})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",boxSizing:"border-box"},children:[d?e.jsx("div",{style:{padding:"56px 48px",display:"flex",flexDirection:"column",gap:"32px"},children:[1,2].map(t=>e.jsx("div",{style:{height:"260px",borderRadius:"16px",backgroundColor:"#F1F5F9",animation:"skeletonPulse 1.5s infinite"}},t))}):f.length===0?e.jsx("div",{style:{padding:"56px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"18px",backgroundColor:"#F8FAFC"},children:W.map((t,x)=>e.jsxs("div",{style:{border:"1px solid rgba(0,0,0,0.06)",borderRadius:"12px",padding:"20px",backgroundColor:"#FFFFFF",display:"flex",gap:"12px"},children:[e.jsxs("span",{style:{fontSize:"16px",color:"#8B5CF6",fontWeight:600},children:["0",x+1,"."]}),e.jsx("span",{style:{fontSize:"14.5px",color:"#0F172A",fontWeight:600},children:t})]},x))}):e.jsx("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:f.map((t,x)=>{const y=x%2===1,F=x%2===1;return e.jsx("div",{style:{width:"100%",backgroundColor:F?"#F3F4F6":"#FFFFFF",color:"#0F172A",padding:"44px 48px",boxSizing:"border-box",borderBottom:"1px solid rgba(0, 0, 0, 0.02)",display:"flex",justifyContent:"center"},className:"reveal-trigger feature-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"960px",display:"grid",gridTemplateColumns:y?"1.1fr 0.9fr":"0.9fr 1.1fr",gap:"40px",alignItems:"center"},className:"modal-content-grid",children:[e.jsx("div",{style:{order:y?1:2,width:"100%",borderRadius:"16px",border:"1px solid #E2E8F0",boxShadow:"0 16px 40px rgba(15, 23, 42, 0.04)",cursor:"zoom-in",transition:"all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",backgroundColor:"#FFFFFF",padding:"10px",boxSizing:"border-box"},className:"feature-image",onClick:()=>{t.imageUrl&&h({url:t.imageUrl,title:t.title,caption:t.description||void 0})},onMouseEnter:E=>{E.currentTarget.style.transform="translateY(-4px)",E.currentTarget.style.borderColor="rgba(139, 92, 246, 0.15)",E.currentTarget.style.boxShadow="0 20px 48px rgba(139, 92, 246, 0.06)"},onMouseLeave:E=>{E.currentTarget.style.transform="translateY(0)",E.currentTarget.style.borderColor="#E2E8F0",E.currentTarget.style.boxShadow="0 16px 40px rgba(15, 23, 42, 0.04)"},children:t.imageUrl?e.jsx("img",{src:t.imageUrl,alt:t.imageAlt||t.title,loading:"lazy",style:{width:"100%",height:"auto",display:"block",objectFit:"contain",borderRadius:"8px"}}):e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"220px",color:"#94A3B8",fontSize:"13px"},children:"Image Showcase Unavailable"})}),e.jsxs("div",{style:{order:y?2:1,display:"flex",flexDirection:"column",gap:"16px"},className:"feature-text-block",children:[e.jsxs("div",{style:{fontSize:"56px",fontWeight:700,color:"#8B5CF6",opacity:.1,lineHeight:1,letterSpacing:"-0.03em",fontFamily:"var(--font-primary, 'Manrope', sans-serif)"},children:["0",x+1]}),e.jsx("h3",{style:{margin:"4px 0 0 0",fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em",lineHeight:1.3},children:t.title}),t.description&&e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450,maxWidth:"540px"},children:t.description}),t.bullets&&t.bullets.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"6px"},children:t.bullets.map(E=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px"},children:[e.jsx("span",{style:{color:"#8B5CF6",fontWeight:700,fontSize:"13px",display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",backgroundColor:"rgba(139, 92, 246, 0.08)",flexShrink:0},children:"✓"}),e.jsx("span",{style:{fontSize:"13.5px",color:"#334155",lineHeight:"1.7",flex:1},children:E.text})]},E.id))})]})]})},t.id)})}),N&&N.length>0&&e.jsx("div",{className:"modal-tech-section",style:{padding:"56px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Technology Integration"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:650,color:"#0F172A",letterSpacing:"-0.02em"},children:"Engineered Stack & Tools"})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"10px"},children:N.map(t=>e.jsxs("span",{style:{fontSize:"13px",fontWeight:500,color:"#475569",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"7px 14px",height:"36px",boxSizing:"border-box",boxShadow:"0 2px 8px rgba(15, 23, 42, 0.02)",display:"inline-flex",alignItems:"center",gap:"8px",cursor:"default"},className:"tech-chip",children:[e.jsx("span",{style:{color:"#8B5CF6",fontSize:"10px"},children:"✦"})," ",t]},t))})]})}),L&&L.length>0&&e.jsx("div",{style:{padding:"40px 48px 44px",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 18% 78%, rgba(16, 185, 129, 0.06) 0%, rgba(9, 13, 26, 0) 46%)",color:"#FFFFFF",borderBottom:"1px solid rgba(255, 255, 255, 0.04)",display:"flex",justifyContent:"center"},className:"performance-metrics-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"880px",display:"flex",flexDirection:"column",gap:"22px"},children:[e.jsxs("div",{style:{textAlign:"center",maxWidth:"560px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"10.5px",fontWeight:600,color:"#10B981",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Performance Metrics"}),e.jsx("h2",{style:{margin:"6px 0 0 0",fontSize:"28px",fontWeight:650,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.08},children:"Measurable Business Impact"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"10px"},children:L.map((t,x)=>e.jsxs("div",{style:{backgroundColor:"rgba(255, 255, 255, 0.035)",border:"1px solid rgba(255, 255, 255, 0.09)",borderRadius:"12px",padding:"17px 18px 16px",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",gap:"6px",boxSizing:"border-box",minHeight:"112px",boxShadow:"0 14px 34px rgba(0, 0, 0, 0.12)",transition:"all 0.25s ease"},className:"metric-card",onMouseEnter:y=>{y.currentTarget.style.transform="translateY(-2px)",y.currentTarget.style.borderColor="rgba(16, 185, 129, 0.24)"},onMouseLeave:y=>{y.currentTarget.style.transform="translateY(0)",y.currentTarget.style.borderColor="rgba(255, 255, 255, 0.09)"},children:[e.jsx("span",{style:{width:"22px",height:"2px",borderRadius:"999px",backgroundColor:"#10B981",marginBottom:"4px"}}),e.jsx("span",{style:{fontSize:"30px",fontWeight:700,color:"#10B981",letterSpacing:"-0.02em",lineHeight:1},children:t.kpi}),e.jsx("span",{style:{fontSize:"12.75px",color:"#A8B3C7",fontWeight:500,lineHeight:1.35},children:t.label})]},x))})]})})]})]}),a&&e.jsxs("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.98)",backdropFilter:"blur(8px)",zIndex:1e4,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box"},onClick:()=>h(null),className:"lightbox-backdrop",children:[e.jsxs("div",{style:{position:"absolute",top:"20px",left:"24px",right:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#FFFFFF"},onClick:t=>t.stopPropagation(),children:[e.jsx("h4",{style:{margin:0,fontSize:"15px",fontWeight:600},children:a.title}),e.jsx("button",{type:"button",onClick:()=>h(null),style:{border:"none",backgroundColor:"transparent",color:"#94A3B8",fontSize:"28px",cursor:"pointer",outline:"none"},children:"×"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",maxWidth:"900px",position:"relative"},onClick:t=>t.stopPropagation(),children:[e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),B()},style:{position:"absolute",left:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"‹"}),e.jsx("div",{style:{width:"100%",maxHeight:"72vh",borderRadius:"12px",overflow:"hidden",border:"1.5px solid rgba(255, 255, 255, 0.08)",boxShadow:"0 20px 50px rgba(0,0,0,0.8)"},className:"lightbox-image-container",children:e.jsx("img",{src:a.url,alt:a.title,style:{width:"100%",height:"auto",maxHeight:"72vh",objectFit:"contain",display:"block"}})}),e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),R()},style:{position:"absolute",right:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"›"})]}),a.caption&&e.jsx("div",{style:{marginTop:"20px",color:"#94A3B8",fontSize:"13.5px",textAlign:"center",maxWidth:"600px",lineHeight:1.5},onClick:t=>t.stopPropagation(),children:a.caption})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes slideUpModal {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes skeletonPulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .reveal-trigger {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .reveal-trigger.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-trigger.narrative-card {
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .case-story-section {
          padding: 56px 48px 64px !important;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%) !important;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08) !important;
        }
        .case-story-container {
          max-width: 1120px !important;
          gap: 36px !important;
          counter-reset: caseStory;
        }
        .case-story-heading {
          max-width: none !important;
          margin: 0 !important;
          text-align: left !important;
          display: flex !important;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.12);
        }
        .case-story-heading::after {
          content: '';
          display: none;
        }
        .case-story-heading > span {
          display: block;
          margin-bottom: 0 !important;
          color: #4F46E5 !important;
          letter-spacing: 0.08em !important;
        }
        .case-story-heading h2 {
          margin: 0 !important;
          font-size: clamp(30px, 3.4vw, 42px) !important;
          line-height: 1.08 !important;
          letter-spacing: 0 !important;
          max-width: none;
          white-space: nowrap;
        }
        .case-story-problem-solution,
        .case-story-outcome-grid {
          position: relative;
          padding-left: 96px;
        }
        .case-story-problem-solution {
          display: flex !important;
          flex-direction: column;
          gap: 0 !important;
        }
        .case-story-outcome-grid {
          display: grid !important;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.72fr);
          gap: 36px !important;
          margin-top: 0 !important;
          padding-top: 32px;
          flex-wrap: nowrap !important;
          border-top: 1px solid rgba(15, 23, 42, 0.1);
        }
        .case-story-problem-solution::before,
        .case-story-outcome-grid::before {
          content: '';
          position: absolute;
          left: 38px;
          top: 42px;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.7), rgba(79, 70, 229, 0.62), rgba(16, 185, 129, 0.7));
        }
        .case-story-outcome-grid::before {
          top: 32px;
          background: linear-gradient(180deg, rgba(14, 165, 233, 0.6), rgba(16, 185, 129, 0.64));
        }
        .case-story-section .narrative-card {
          position: relative;
          min-width: 0 !important;
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 30px 0 !important;
          gap: 14px !important;
          overflow: visible;
          counter-increment: caseStory;
        }
        .case-story-problem-solution .narrative-card:first-child {
          padding-top: 0 !important;
        }
        .case-story-problem-solution .narrative-card + .narrative-card {
          border-top: 1px solid rgba(15, 23, 42, 0.1) !important;
        }
        .case-story-outcome-grid .narrative-card {
          flex: auto !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .case-story-outcome-grid .narrative-card:last-child {
          border-left: 1px solid rgba(15, 23, 42, 0.14) !important;
          padding-left: 36px !important;
        }
        .case-story-section .narrative-card::before {
          content: '0' counter(caseStory);
          position: absolute;
          left: -96px;
          top: 34px;
          width: 76px;
          color: #0F172A;
          font-size: 12px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.08em;
        }
        .case-story-problem-solution .narrative-card:first-child::before {
          top: 4px;
          color: #EF4444;
        }
        .case-story-problem-solution .narrative-card:nth-child(2)::before {
          color: #4F46E5;
        }
        .case-story-outcome-grid .narrative-card:first-child::before {
          top: 4px;
          color: #0EA5E9;
        }
        .case-story-outcome-grid .narrative-card:last-child::before {
          top: 4px;
          color: #10B981;
        }
        .case-story-section .narrative-card > span,
        .case-story-section .narrative-card > div:first-child > span {
          display: none !important;
        }
        .case-story-section .narrative-card h3 {
          margin: 0 !important;
          color: #0F172A !important;
          font-size: 28px ;
          line-height: 1.12 !important;
          font-weight: 850 !important;
          letter-spacing: 0 !important;
        }
        .case-story-section .narrative-card p {
          max-width: 780px;
          color: #475569 !important;
          font-size: 16px !important;
          line-height: 1.82 !important;
          font-weight: 450 !important;
        }
        .case-story-outcome-grid .narrative-card:last-child h3 {
          font-size: 18px !important;
        }
        .case-story-outcome-grid .narrative-card:last-child p {
          color: #334155 !important;
          font-size: 15px !important;
          font-weight: 500 !important;
        }
        .case-story-outcome-grid .narrative-card:only-child {
          grid-column: 1 / -1;
          border-left: 0 !important;
          padding-left: 0 !important;
        }
        .feature-section.reveal-trigger {
          opacity: 1 !important;
          transform: none !important;
        }
        .feature-section .feature-image {
          max-width: 440px;
          justify-self: center;
          align-self: center;
        }
        .feature-section .feature-image img {
          max-height: 300px;
          object-fit: contain !important;
        }
        .feature-section .feature-image,
        .feature-section .feature-text-block > * {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .feature-section.is-revealed .feature-image {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(1) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 50ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(2) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 100ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(3) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 150ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(4) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 200ms;
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUpImg {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lightbox-backdrop {
          animation: fadeInBackdrop 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .lightbox-image-container {
          animation: scaleUpImg 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tech-chip {
          transition: all 0.2s ease-in-out !important;
        }
        .tech-chip:hover {
          background-color: #F1F5F9 !important;
          border-color: #CBD5E1 !important;
          color: #1E293B !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04) !important;
        }
        .metric-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .metric-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #8B5CF6 !important;
          outline-offset: 4px !important;
        }
        @media (max-width: 900px) {
          .case-story-section {
            padding: 48px 32px 56px !important;
          }
          .case-story-container {
            gap: 32px !important;
          }
          .case-story-heading {
            gap: 6px !important;
            padding-bottom: 14px;
          }
          .case-story-problem-solution,
          .case-story-outcome-grid {
            padding-left: 68px;
          }
          .case-story-problem-solution::before,
          .case-story-outcome-grid::before {
            left: 26px;
          }
          .case-story-section .narrative-card::before {
            left: -68px;
            width: 48px;
          }
          .case-story-outcome-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .case-story-outcome-grid .narrative-card:last-child {
            border-left: 0 !important;
            border-top: 1px solid rgba(15, 23, 42, 0.1) !important;
            padding-left: 0 !important;
            padding-top: 28px !important;
          }
          .feature-section .feature-image {
            max-width: 520px;
          }
          .feature-section .feature-image img {
            max-height: 280px;
          }
          .modal-content-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-section-grid {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
          .hero-laptop-column {
            width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .case-story-section {
            padding: 40px 24px 48px !important;
          }
          .case-story-heading h2 {
            font-size: clamp(24px, 7vw, 30px) !important;
            line-height: 1 !important;
          }
          .case-story-problem-solution,
          .case-story-outcome-grid {
            padding-left: 0;
          }
          .case-story-problem-solution::before,
          .case-story-outcome-grid::before {
            display: none;
          }
          .case-story-section .narrative-card::before {
            position: static;
            display: block;
            width: auto;
            margin-bottom: 12px;
          }
          .case-story-section .narrative-card h3 {
            font-size: 24px !important;
          }
          .case-story-section .narrative-card p {
            font-size: 15px !important;
            line-height: 1.78 !important;
          }
          .feature-section .feature-image img {
            max-height: 240px;
          }
        }
      `}})]})},ae=()=>{const[s,j]=p.useState([]),[f,l]=p.useState(null),[d,v]=p.useState(!0),a=typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";p.useEffect(()=>{(async()=>{v(!0);try{const i=await _.getProjects();j(i)}catch(i){console.error("[ProjectsShowcasePage] Load error:",i)}finally{v(!1)}})()},[]),p.useEffect(()=>{if(s.length===0)return;const r=()=>{const i=window.location.hash;if(i){const o=i.replace("#",""),c=s.find(k=>k.id===o);c?(l(c),window.AnalyticsService&&window.AnalyticsService.logCustomEvent({session_id:sessionStorage.getItem("session_id")||"unknown",event_type:"project_view",event_metadata:{project_id:c.id,project_title:c.title}})):l(null)}else l(null)};return r(),window.addEventListener("hashchange",r),()=>{window.removeEventListener("hashchange",r)}},[s]);const h=r=>{window.location.hash=r.id},w=()=>{window.location.hash&&window.history.replaceState(null,"",window.location.pathname+window.location.search),l(null)};return e.jsxs("div",{className:"projects-showcase-container",children:[e.jsx("div",{className:"projects-back-wrapper",children:e.jsx(K,{label:"Back to Portfolio",fallbackUrl:`${a}#work`})}),e.jsx("section",{id:"project-collection-section",style:{width:"100%"},children:d?e.jsx("div",{style:{textAlign:"center",color:"#64748B",padding:"60px 0",fontSize:"15px"},children:"Loading case studies portfolio..."}):e.jsx(J,{projects:s,onViewDetails:h})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(re,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(ee,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(te,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(ie,{})}),e.jsx(oe,{project:f,onClose:w})]})},ne=()=>{const[s,j]=p.useState(!1);return window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",p.useEffect(()=>{const l=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,r=>{const i=Math.random()*16|0;return(r==="x"?i:i&3|8).toString(16)}),d=()=>{let r=localStorage.getItem("visitor_id");return r||(r=l(),localStorage.setItem("visitor_id",r)),r},v=()=>{let r=sessionStorage.getItem("session_id");return r||(r=l(),sessionStorage.setItem("session_id",r)),r},a=()=>{const r=navigator.userAgent;let i="Other",o="Other",c="Desktop";return r.includes("Firefox")||r.includes("FxiOS")?i="Firefox":r.includes("SamsungBrowser")?i="Samsung Browser":r.includes("Opera")||r.includes("OPR")?i="Opera":r.includes("Trident")?i="Internet Explorer":r.includes("Edge")||r.includes("Edg")||r.includes("EdgiOS")?i="Edge":r.includes("Chrome")||r.includes("CriOS")?i="Chrome":r.includes("Safari")&&(i="Safari"),r.includes("Windows")?o="Windows":r.includes("Macintosh")||r.includes("Mac OS X")?o="macOS":r.includes("Android")?o="Android":r.includes("iPhone")||r.includes("iPad")?o="iOS":r.includes("Linux")&&(o="Linux"),/Mobi|Android|iPhone|iPad|iPod/i.test(r)&&(c=/Tablet|iPad/i.test(r)?"Tablet":"Mobile"),{browser:i,os:o,deviceType:c,userAgent:r}};let h;return(async()=>{if(!window.AnalyticsService)return;const r=()=>{var n;try{return window.location.search.includes("telemetryDebug=true")||((n=window.localStorage)==null?void 0:n.getItem("telemetry_debug"))==="true"}catch{return!1}},i=v(),o=d(),c=a(),k=document.referrer||"",C=X(k,window.location.search);let A={ip_address:"Unknown",country:"Unknown",country_code:"Unknown",city:"Unknown"};try{const n=await fetch("https://ipapi.co/json/");if(n.ok){const g=await n.json();A={ip_address:g.ip||"Unknown",country:g.country_name||"Unknown",country_code:g.country_code||"Unknown",city:g.city||"Unknown"}}}catch{}!await window.AnalyticsService.logSession({id:i,visitor_id:o,ip_address:A.ip_address,country:A.country,country_code:A.country_code,city:A.city,user_agent:c.userAgent,browser:c.browser,operating_system:c.os,device_type:c.deviceType,referrer:k,traffic_source:C.source,traffic_source_display:C.sourceDisplay,traffic_medium:C.medium,traffic_campaign:C.campaign,traffic_content:C.content,traffic_term:C.term,referrer_url:C.referrer,attribution_type:C.attributionType})&&r()&&console.warn("[Telemetry] Visitor session was not recorded; continuing without blocking the portfolio."),await window.AnalyticsService.logPageView({session_id:i,page_path:window.location.pathname||"/pages/projects/index.html",page_title:document.title||"Projects Showcase"});const m=Date.now();h=setInterval(async()=>{const n=Math.floor((Date.now()-m)/1e3);await window.AnalyticsService.pingSession(i,n)},15e3)})(),()=>{h&&clearInterval(h)}},[]),e.jsxs(e.Fragment,{children:[e.jsx(Q,{}),e.jsx("main",{children:e.jsx(ae,{})})]})},O=document.getElementById("root");O&&H.createRoot(O).render(e.jsx(U.StrictMode,{children:e.jsx(q,{children:e.jsx(G,{children:e.jsx(Z,{children:e.jsx(ne,{})})})})}));
