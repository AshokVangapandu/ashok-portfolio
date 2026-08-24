import{r as h,j as e,R as U,c as V}from"./index-Dqbl8sJf.js";import{b as $,A as Y,P as q}from"./admin-tKiMbs6I.js";import{m as G,s as K,p as M}from"./Mendix-Brandmark-Bby_JaqM.js";import{B as Z,G as X}from"./GlobalRouteGuard-DRlQjgci.js";import{r as J}from"./attribution-CswXgDyo.js";import"./projects-CA_ptObU.js";const Q=({projects:d,onViewDetails:v})=>{var N,F;const[y,x]=h.useState(""),[p,f]=h.useState(0),[c,g]=h.useState(!1),S=h.useRef(null),o=h.useRef(null),b=()=>{if(o.current&&l.length>0){const s=o.current.scrollLeft,n=Math.round(s/240),a=Math.min(Math.max(0,n),l.length-1);a!==p&&f(a)}},l=d.filter(s=>{const i=y.toLowerCase();return s.title.toLowerCase().includes(i)||s.description.toLowerCase().includes(i)||s.role.toLowerCase().includes(i)||s.category.toLowerCase().includes(i)||s.technologies.some(n=>n.toLowerCase().includes(i))}),r=l[p]||null;return h.useEffect(()=>{if(c||l.length<=1)return;const s=setInterval(()=>{f(i=>(i+1)%l.length)},4500);return()=>clearInterval(s)},[c,l.length]),h.useEffect(()=>{if(!S.current)return;const s=S.current,i=s.children[p];if(!i)return;const n=s.clientWidth,a=i.offsetLeft,u=i.clientWidth;s.scrollTo({left:a-n/2+u/2,behavior:"smooth"})},[p]),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",boxSizing:"border-box"},children:[e.jsxs("div",{className:"projects-desktop-collection-wrapper",style:{width:"100%",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"24px",flexWrap:"wrap",borderBottom:"1px solid rgba(255, 255, 255, 0.05)",paddingBottom:"20px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"14px",color:"#A78BFA"},children:"★"}),e.jsx("h2",{style:{fontSize:"22px",fontWeight:800,margin:0,color:"#FFFFFF",letterSpacing:"-0.03em"},children:"Case Studies Archive"})]}),e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"340px"},children:[e.jsx("input",{type:"text",value:y,onChange:s=>{x(s.target.value),f(0)},placeholder:"Search case studies...",style:{width:"100%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:"999px",padding:"10px 16px 10px 40px",color:"#FFFFFF",fontSize:"13.5px",outline:"none",transition:"all 0.2s ease",boxSizing:"border-box"}}),e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"#64748B"},children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})]})]}),l.length>0?e.jsx("div",{ref:S,onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),className:"horizontal-scroll-carousel",style:{display:"flex",width:"100%",overflowX:"auto",gap:"20px",padding:"24px 0",boxSizing:"border-box",scrollSnapType:"x mandatory",scrollBehavior:"smooth"},children:l.map((s,i)=>{const n=i===p;return e.jsxs("div",{onClick:()=>{f(i),g(!0)},style:{width:"240px",height:"140px",borderRadius:"12px",overflow:"hidden",position:"relative",flexShrink:0,cursor:"pointer",border:n?"2px solid #8B5CF6":"1px solid rgba(255,255,255,0.06)",boxShadow:n?"0 0 20px rgba(139, 92, 246, 0.3)":"none",transform:n?"scale(1.03)":"scale(0.97)",opacity:n?1:.5,transition:"all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",scrollSnapAlign:"center"},children:[e.jsx("img",{src:s.coverImage,alt:s.title,style:{width:"100%",height:"100%",objectFit:"cover"}}),e.jsxs("div",{style:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"12px",boxSizing:"border-box"},children:[e.jsx("span",{style:{fontSize:"9px",fontWeight:800,color:"#A78BFA",textTransform:"uppercase",letterSpacing:"0.05em"},children:s.category}),e.jsx("h4",{style:{margin:"4px 0 0 0",fontSize:"13px",fontWeight:700,color:"#FFFFFF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:s.title})]})]},s.id)})}):e.jsx("div",{style:{color:"#64748B",fontSize:"14px",textAlign:"center",padding:"60px 0",fontWeight:500},children:"No case studies match your search queries."}),r&&e.jsxs("div",{style:{width:"100%",backgroundColor:"rgba(15, 22, 40, 0.4)",border:"1px solid rgba(255, 255, 255, 0.05)",borderRadius:"24px",padding:"36px",boxSizing:"border-box",marginTop:"8px",display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"40px",alignItems:"start",transition:"all 0.4s ease"},className:"active-project-details-grid",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",textAlign:"left"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:800,color:"#A78BFA",textTransform:"uppercase",backgroundColor:"rgba(124, 58, 237, 0.12)",border:"1px solid rgba(124, 58, 237, 0.2)",borderRadius:"999px",padding:"4px 12px"},children:r.category}),e.jsx("span",{style:{color:"rgba(255,255,255,0.15)"},children:"•"}),e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:600},children:r.timeline})]}),e.jsx("h3",{style:{fontSize:"32px",fontWeight:850,margin:0,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.2},children:r.title}),e.jsx("p",{style:{fontSize:"15px",lineHeight:1.6,color:"#94A3B8",margin:0,fontWeight:450},children:r.description}),r.problemSolved&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",backgroundColor:"rgba(255, 255, 255, 0.01)",padding:"16px",borderRadius:"12px",border:"1px solid rgba(255, 255, 255, 0.03)"},children:[e.jsx("strong",{style:{fontSize:"12px",textTransform:"uppercase",color:"#C4B5FD",letterSpacing:"0.04em"},children:"Problem Solved"}),e.jsxs("p",{style:{margin:0,fontSize:"13.5px",lineHeight:1.5,color:"#94A3B8",fontWeight:450},children:['"',r.problemSolved,'"']})]}),e.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap",marginTop:"8px"},children:[r.impactMetrics.map((s,i)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",backgroundColor:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 16px",minWidth:"120px"},children:[e.jsx("span",{style:{fontSize:"18px",fontWeight:850,color:"#10B981"},children:s.kpi}),e.jsx("span",{style:{fontSize:"10px",color:"#64748B",fontWeight:600,textTransform:"uppercase"},children:s.label})]},i)),r.users&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",backgroundColor:"rgba(124, 58, 237, 0.05)",border:"1px solid rgba(124, 58, 237, 0.15)",borderRadius:"8px",padding:"10px 16px",minWidth:"120px"},children:[e.jsx("span",{style:{fontSize:"18px",fontWeight:850,color:"#A78BFA"},children:r.users}),e.jsx("span",{style:{fontSize:"10px",color:"#64748B",fontWeight:600,textTransform:"uppercase"},children:"Active Users"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"12px"},children:[e.jsx("button",{type:"button",onClick:()=>v(r),className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",border:"none",fontSize:"13.5px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(124, 58, 237, 0.25)",transition:"all 0.15s ease"},children:"View Full Case Study Details →"}),r.demoUrl&&e.jsx("a",{href:r.demoUrl,target:"_blank",rel:"noreferrer",className:"hover-scale",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"rgba(255, 255, 255, 0.03)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#FFFFFF",fontSize:"13.5px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center"},children:"Live Preview"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",width:"100%"},children:[e.jsx("div",{style:{width:"100%",height:"280px",borderRadius:"16px",overflow:"hidden",position:"relative",backgroundColor:"#090D1A",border:"1px solid rgba(255, 255, 255, 0.06)"},children:e.jsx("img",{src:r.coverImage,alt:r.title,style:{width:"100%",height:"100%",objectFit:"cover"}})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"16px",backgroundColor:"rgba(255, 255, 255, 0.01)",padding:"20px",borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.03)",textAlign:"left"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.02em"},children:"My Role"}),e.jsx("p",{style:{margin:"4px 0 0 0",fontSize:"13.5px",color:"#E2E8F0",fontWeight:700},children:r.role})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.02em"},children:"Target Client"}),e.jsx("p",{style:{margin:"4px 0 0 0",fontSize:"13.5px",color:"#E2E8F0",fontWeight:700},children:r.client})]})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:r.technologies.map(s=>e.jsx("span",{style:{fontSize:"11px",fontWeight:600,padding:"5px 12px",borderRadius:"6px",backgroundColor:"rgba(255, 255, 255, 0.03)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#94A3B8"},children:s},s))})]})]})]}),e.jsxs("div",{className:"projects-mobile-collection-wrapper",children:[e.jsxs("div",{className:"projects-mobile-header-bar",children:[e.jsxs("button",{type:"button",onClick:()=>{const s=typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";window.location.href=`${s}#work`},className:"projects-mobile-back-btn",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]}),e.jsx("span",{children:"Back to Portfolio"})]}),e.jsx("button",{type:"button",className:"projects-mobile-share-btn",onClick:()=>{navigator.share?navigator.share({title:"Projects | Ashok Vangapandu",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),window.showToast&&window.showToast("success","Link Copied","Projects link copied to clipboard!",3e3))},"aria-label":"Share page",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"18",cy:"5",r:"3"}),e.jsx("circle",{cx:"6",cy:"12",r:"3"}),e.jsx("circle",{cx:"18",cy:"19",r:"3"}),e.jsx("line",{x1:"8.59",y1:"13.51",x2:"15.42",y2:"17.49"}),e.jsx("line",{x1:"15.41",y1:"6.51",x2:"8.59",y2:"10.49"})]})})]}),e.jsxs("div",{className:"projects-mobile-hero",children:[e.jsxs("div",{className:"projects-mobile-badge-pill",children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",fill:"rgba(168, 85, 247, 0.2)",stroke:"#A78BFA",strokeWidth:"1.5"})}),e.jsx("span",{children:"PROJECTS ARCHIVE"})]}),e.jsxs("h1",{className:"projects-mobile-hero-title",children:["Real Solutions. ",e.jsx("br",{}),e.jsx("span",{className:"purple-gradient-text",children:"Real Impact."})]}),e.jsx("p",{className:"projects-mobile-hero-desc",children:"Explore enterprise-grade solutions I've built to solve real business challenges and deliver measurable results."}),e.jsxs("div",{className:"projects-mobile-search-wrapper",children:[e.jsxs("div",{className:"projects-mobile-search-box",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"#64748B",strokeWidth:"2.5",className:"search-icon",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]}),e.jsx("input",{type:"text",value:y,onChange:s=>{x(s.target.value),f(0)},placeholder:"Search projects...",className:"projects-mobile-search-input"}),y&&e.jsx("button",{type:"button",onClick:()=>x(""),className:"projects-mobile-search-clear",children:"✕"})]}),e.jsx("button",{type:"button",className:"projects-mobile-filter-btn","aria-label":"Filter case studies",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"4",y1:"21",x2:"4",y2:"14"}),e.jsx("line",{x1:"4",y1:"10",x2:"4",y2:"3"}),e.jsx("line",{x1:"12",y1:"21",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"3"}),e.jsx("line",{x1:"20",y1:"21",x2:"20",y2:"16"}),e.jsx("line",{x1:"20",y1:"12",x2:"20",y2:"3"}),e.jsx("line",{x1:"1",y1:"14",x2:"7",y2:"14"}),e.jsx("line",{x1:"9",y1:"8",x2:"15",y2:"8"}),e.jsx("line",{x1:"17",y1:"16",x2:"23",y2:"16"})]})})]})]}),l.length>0?e.jsxs("div",{className:"projects-mobile-rail-wrapper",children:[e.jsx("div",{className:"projects-mobile-rail",ref:o,onScroll:b,children:l.map((s,i)=>{const n=i===p;return e.jsxs("div",{className:`projects-mobile-rail-card ${n?"active":""}`,onClick:()=>{f(i),g(!0)},children:[e.jsx("div",{className:"projects-mobile-rail-img-box",children:e.jsx("img",{src:s.coverImage,alt:s.title})}),e.jsxs("div",{className:"projects-mobile-rail-card-info",children:[e.jsx("span",{className:"projects-mobile-rail-card-cat",children:s.category}),e.jsx("h4",{className:"projects-mobile-rail-card-title",children:s.title})]})]},s.id)})}),e.jsx("div",{className:"projects-mobile-rail-dots",children:l.map((s,i)=>e.jsx("span",{className:`projects-mobile-rail-dot ${p===i?"active":""}`,onClick:()=>{f(i),g(!0),o.current&&o.current.scrollTo({left:i*240,behavior:"smooth"})}},i))})]}):e.jsx("div",{className:"projects-mobile-empty-state",children:"No case studies match your search query."}),r&&e.jsxs("div",{className:"projects-mobile-featured-card",children:[e.jsxs("div",{className:"projects-mobile-featured-meta",children:[e.jsx("span",{className:"cat-pill",children:r.category}),e.jsx("span",{className:"dot",children:"•"}),e.jsx("span",{className:"timeline",children:r.timeline})]}),e.jsx("h2",{className:"projects-mobile-featured-title",children:r.title}),e.jsx("p",{className:"projects-mobile-featured-desc",children:r.description}),e.jsx("div",{className:"projects-mobile-featured-img-box",children:e.jsx("img",{src:r.coverImage,alt:r.title})}),r.problemSolved&&e.jsxs("div",{className:"projects-mobile-problem-card",children:[e.jsxs("div",{className:"problem-header",children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"#C4B5FD",strokeWidth:"2",children:e.jsx("path",{d:"M9 18h6m-5 3h4m-7-9a7 7 0 1 1 12 0c0 2.5-1.5 4.5-3 5.5v1.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V17.5c-1.5-1-3-3-3-5.5z"})}),e.jsx("span",{children:"PROBLEM SOLVED"})]}),e.jsxs("p",{className:"problem-text",children:['"',r.problemSolved,'"']})]}),e.jsxs("div",{className:"projects-mobile-role-card",children:[e.jsxs("div",{className:"role-grid",children:[e.jsxs("div",{className:"role-item",children:[e.jsx("div",{className:"icon-badge",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),e.jsxs("div",{className:"role-meta",children:[e.jsx("span",{className:"label",children:"MY ROLE"}),e.jsx("span",{className:"val",children:r.role})]})]}),e.jsxs("div",{className:"role-item",children:[e.jsx("div",{className:"icon-badge",children:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:e.jsx("path",{d:"M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"})})}),e.jsxs("div",{className:"role-meta",children:[e.jsx("span",{className:"label",children:"TARGET CLIENT"}),e.jsx("span",{className:"val",children:r.client})]})]})]}),e.jsx("div",{className:"tech-pills-row",children:r.technologies.map(s=>e.jsx("span",{className:"tech-pill",children:s},s))})]}),e.jsxs("div",{className:"projects-mobile-metrics-grid",children:[e.jsxs("div",{className:"metric-card green",children:[e.jsx("div",{className:"metric-icon",children:"⚡"}),e.jsx("span",{className:"metric-val",children:((N=r.impactMetrics[0])==null?void 0:N.kpi)||"100%"}),e.jsx("span",{className:"metric-lbl",children:((F=r.impactMetrics[0])==null?void 0:F.label)||"Mobile Responsive"})]}),e.jsxs("div",{className:"metric-card teal",children:[e.jsx("div",{className:"metric-icon",children:"📱"}),e.jsx("span",{className:"metric-val",children:"Mobile"}),e.jsx("span",{className:"metric-lbl",children:"Cross-platform Experience"})]}),e.jsxs("div",{className:"metric-card cyan",children:[e.jsx("div",{className:"metric-icon",children:"⏱️"}),e.jsx("span",{className:"metric-val",children:"Real-Time"}),e.jsx("span",{className:"metric-lbl",children:"Operational Workflows"})]}),e.jsxs("div",{className:"metric-card purple",children:[e.jsx("div",{className:"metric-icon",children:"🛡️"}),e.jsx("span",{className:"metric-val",children:"Enterprise"}),e.jsx("span",{className:"metric-lbl",children:"Manufacturing Ready"})]})]}),e.jsxs("button",{type:"button",onClick:()=>v(r),className:"projects-mobile-view-details-btn",children:[e.jsx("span",{children:"View Full Case Study Details"}),e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .horizontal-scroll-carousel::-webkit-scrollbar {
          display: none;
        }
        .horizontal-scroll-carousel {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 900px) {
          .active-project-details-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            padding: 24px !important;
          }
        }
      `}})]})},ee=()=>{const d=[{value:"50K+",label:"Daily Active Users"},{value:"98%",label:"Client Satisfaction Rate"},{value:"60%",label:"Reduced Manual Workflows"},{value:"40%",label:"Faster Processing Speed"},{value:"100+",label:"Orchestrated Workflows"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"32px",width:"100%",boxSizing:"border-box",padding:"24px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"14px",color:"#A78BFA"},children:"★"}),e.jsx("h3",{style:{fontSize:"18px",fontWeight:800,margin:0,color:"#FFFFFF",letterSpacing:"-0.02em"},children:"Proven Business Impact"})]}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"32px",width:"100%"},className:"impact-metrics-row",children:d.map((v,y)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",minWidth:"160px",textAlign:"left"},children:[e.jsx("span",{style:{fontSize:"40px",fontWeight:850,background:"linear-gradient(135deg, #10B981, #34D399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.03em",lineHeight:1},children:v.value}),e.jsxs("span",{style:{fontSize:"11px",color:"#64748B",fontWeight:650,textTransform:"uppercase",letterSpacing:"0.04em",lineHeight:1.3},children:[v.label.split(" ")[0]," ",e.jsx("br",{})," ",v.label.split(" ").slice(1).join(" ")]})]},y))}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @media (max-width: 768px) {
          .impact-metrics-row {
            justify-content: flex-start !important;
          }
        }
      `}})]})},te=()=>{const d=["Healthcare","Legal","Enterprise","HR / Staffing","Construction","Manufacturing","Education","Government"],v=[...d,...d];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",width:"100%",boxSizing:"border-box",padding:"40px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)",overflow:"hidden"},children:[e.jsx("div",{style:{textAlign:"center"},children:e.jsx("h3",{style:{fontSize:"11px",fontWeight:800,margin:0,color:"#64748B",letterSpacing:"0.25em",textTransform:"uppercase"},children:"INDUSTRIES & DOMAINS I BUILD FOR"})}),e.jsx("div",{style:{width:"100%",overflow:"hidden",position:"relative",padding:"12px 0",display:"flex",alignItems:"center",WebkitMaskImage:"linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",maskImage:"linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)"},children:e.jsx("div",{className:"industry-marquee-track",style:{display:"flex",alignItems:"center",gap:"40px",width:"max-content",animation:"marquee-ind 40s linear infinite"},children:v.map((y,x)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"40px"},children:[e.jsx("span",{style:{fontSize:"15px",fontWeight:800,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"},children:y}),e.jsx("span",{style:{color:"#8B5CF6",fontSize:"18px",fontWeight:900},children:"•"})]},x))})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},H=()=>{const d=[{name:"Mendix",label:"Low-Code Engine",icon:e.jsx("img",{src:G,style:{width:"30px",height:"30px",objectFit:"contain"},alt:"Mendix"})},{name:"React",label:"UI Framework",icon:e.jsxs("svg",{viewBox:"-11.5 -10.23 23 20.46",width:"32",height:"32",children:[e.jsx("circle",{cx:"0",cy:"0",r:"2.05",fill:"#61DAFB"}),e.jsxs("g",{stroke:"#61DAFB",strokeWidth:"1",fill:"none",children:[e.jsx("ellipse",{rx:"11",ry:"4.2"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(60)"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(120)"})]})]})},{name:"TypeScript",label:"Typed Scripting",icon:e.jsxs("svg",{viewBox:"0 0 100 100",width:"32",height:"32",children:[e.jsx("rect",{width:"100",height:"100",fill:"#3178C6",rx:"12"}),e.jsx("path",{d:"M63 40h-8.5v35h-9V40h-8.5v-7.5H63V40zm12.5 19.3c-1.5-1-3.6-1.7-6.2-1.7-3 0-4.8 1.4-4.8 3.5 0 2 1.6 3 4.8 4.2 4.6 1.7 8.3 3.5 8.3 8.7 0 5.4-4.5 9-11.3 9-3.7 0-7.2-1.1-9.2-2.7l3-6.5c1.8 1.3 4.5 2.2 7 2.2 3.1 0 4.8-1.4 4.8-3.6 0-2.3-1.8-3.2-5.1-4.5-4.5-1.7-8-3.8-8-8.5 0-5 4-8.7 10.5-8.7 3.3 0 6 1 7.7 2.1l-3.2 6.1z",fill:"#FFFFFF"})]})},{name:"SCSS",label:"Sassy CSS Styles",icon:e.jsx("img",{src:K,style:{width:"32px",height:"32px",objectFit:"contain"},alt:"SCSS"})},{name:"Figma",label:"UI/UX Design",icon:e.jsxs("svg",{viewBox:"0 0 38 57",width:"22",height:"32",fill:"none",children:[e.jsx("path",{d:"M19 19C19 8.5 10.5 0 0 0V19H19Z",fill:"#F24E1E"}),e.jsx("path",{d:"M19 0H38V19H19V0Z",fill:"#FF7262"}),e.jsx("path",{d:"M19 19H38V38H19V19Z",fill:"#10B981"}),e.jsx("path",{d:"M19 38C19 27.5 10.5 19 0 19V38H19Z",fill:"#A259FF"}),e.jsx("path",{d:"M19 57C19 46.5 10.5 38 0 38H19V57Z",fill:"#1ABC9C"})]})},{name:"Node.js",label:"Runtime Engine",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"#339933",children:e.jsx("path",{d:"M12 1.3L3.1 6.4v10.2l8.9 5.1 8.9-5.1V6.4L12 1.3zm6.6 14.3l-6.6 3.8-6.6-3.8V8.6l6.6-3.8 6.6 3.8v7z"})})},{name:"Vite",label:"Fast Bundling",icon:e.jsxs("svg",{viewBox:"0 0 256 256",width:"32",height:"32",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"viteGrad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#41D1FF"}),e.jsx("stop",{offset:"100%",stopColor:"#BD34FE"})]})}),e.jsx("path",{d:"M128 0L24 180h56l48-84 48 84h56L128 0z",fill:"url(#viteGrad)"}),e.jsx("polygon",{points:"128 50 80 150 115 150 100 230 176 120 135 120 128 50",fill:"#FFC517"})]})}],v=[...d,...d,...d],[y,x]=h.useState(.5),p=h.useRef(null),f=h.useRef(),c=h.useRef(),g=h.useRef(!1),S=h.useRef(.88),o=.88,b=.016,l=()=>{if(!p.current)return;const i=p.current,n=i.scrollLeft+i.clientWidth/2,a=i.scrollWidth/3;if(a>0){const I=i.scrollLeft%a/a;x(I)}Array.from(i.children).forEach(I=>{const C=I;if(C.dataset.type!=="card")return;const D=C.offsetLeft+C.clientWidth/2,T=Math.abs(D-n),w=Math.max(0,1-T/200),z=.92+w*.11,W=.35+w*.65,E=(1-w)*1.2,R=50+w*50,L=w*-3.5;C.style.transform=`scale(${z}) translateY(${L}px) translateZ(0)`,C.style.opacity=`${W}`,C.style.filter=`blur(${E}px) saturate(${R}%)`;const t=w*.6,m=.04+w*.38;C.style.borderColor=`rgba(167, 139, 250, ${m})`,C.style.backgroundColor=`rgba(10, 15, 30, ${.4+w*.25})`,C.style.boxShadow=`
        0 8px 24px rgba(0, 0, 0, ${.12+w*.08}), 
        0 0 24px rgba(167, 139, 250, ${t*.16}),
        inset 0 1px 0 rgba(255, 255, 255, 0.02)
      `;const j=C.querySelector(".tech-icon-wrapper");j&&(j.style.transform=`scale(${1+w*.12})`,j.style.filter=`brightness(${1+w*.25})`);const k=C.querySelector(".tech-label");k&&(k.style.opacity=`${w}`,k.style.height=`${w*14}px`)})};h.useEffect(()=>{const i=()=>{if(p.current){const n=p.current;if(g.current?S.current>0&&(S.current=Math.max(0,S.current-.04)):S.current<o&&(S.current=Math.min(o,S.current+b)),S.current>0){let a=n.scrollLeft+S.current;const u=n.scrollWidth/3;u>0&&(a>=u*2?a-=u:a<=u&&(a+=u),n.scrollLeft=a)}}f.current=requestAnimationFrame(i)};return f.current=requestAnimationFrame(i),()=>{f.current&&cancelAnimationFrame(f.current),c.current&&cancelAnimationFrame(c.current)}},[]),h.useEffect(()=>{const i=()=>{if(!p.current)return;const n=p.current,a=n.scrollWidth/3;a>0?(n.scrollLeft=a,l()):requestAnimationFrame(i)};i()},[]);const r=i=>{if(!p.current)return;const n=p.current,a=n.children[i];if(!a)return;g.current=!0;const u=n.clientWidth,I=a.offsetLeft-u/2+a.clientWidth/2,C=n.scrollLeft,D=performance.now(),T=650;c.current&&cancelAnimationFrame(c.current);const B=w=>{const z=w-D,W=Math.min(1,z/T),E=1-Math.pow(1-W,3);n.scrollLeft=C+(I-C)*E,W<1?c.current=requestAnimationFrame(B):setTimeout(()=>{g.current=!1},1500)};c.current=requestAnimationFrame(B)},N=()=>{if(!p.current)return 0;const i=p.current,n=i.scrollLeft+i.clientWidth/2,a=Array.from(i.children);let u=1/0,I=0;return a.forEach((C,D)=>{const T=C;if(T.dataset.type!=="card")return;const B=T.offsetLeft+T.clientWidth/2,w=Math.abs(B-n);w<u&&(u=w,I=D)}),I},F=()=>{const i=N(),n=p.current;if(!n)return;let a=i+1;for(;a<n.children.length;){const u=n.children[a];if(u&&u.dataset.type==="card"){r(a);break}a++}},s=()=>{const i=N(),n=p.current;if(!n)return;let a=i-1;for(;a>=0;){const u=n.children[a];if(u&&u.dataset.type==="card"){r(a);break}a--}};return e.jsxs("div",{style:{width:"100%"},children:[e.jsxs("div",{className:"tech-desktop-grid-container",style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"40px",width:"100%",boxSizing:"border-box",padding:"60px 0 20px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)",position:"relative"},children:[e.jsxs("div",{style:{textAlign:"center",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:850,color:"#A78BFA",letterSpacing:"0.2em",textTransform:"uppercase"},children:"TECH & TOOLS I WORK WITH"}),e.jsxs("h2",{style:{margin:0,fontSize:"clamp(28px, 4vw, 42px)",fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.2},children:["Modern technologies powering ",e.jsx("br",{}),e.jsx("span",{style:{background:"linear-gradient(135deg, #7C3AED, #A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"enterprise"})," solutions"]})]}),e.jsxs("div",{style:{width:"100%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",boxSizing:"border-box"},onMouseEnter:()=>{g.current=!0},onMouseLeave:()=>{g.current=!1},children:[e.jsx("button",{onClick:s,type:"button",style:{width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,position:"absolute",left:"24px",transition:"all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"},className:"slider-arrow",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]})}),e.jsx("div",{ref:p,onScroll:l,style:{width:"calc(100% - 100px)",overflowX:"auto",display:"flex",alignItems:"center",padding:"28px 0",scrollBehavior:"auto",position:"relative",maskImage:"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"},className:"horizontal-scroll-carousel",children:v.map((i,n)=>e.jsxs(U.Fragment,{children:[e.jsxs("div",{"data-type":"card",onClick:()=>r(n*2),style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",cursor:"pointer",flexShrink:0,width:"120px",height:"120px",borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.05)",padding:"16px 8px",boxSizing:"border-box",transition:"transform 0.15s ease-out, opacity 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out, filter 0.15s ease-out",willChange:"transform, opacity, filter",position:"relative"},children:[e.jsx("div",{className:"tech-icon-wrapper",style:{transition:"transform 0.2s ease, filter 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center"},children:i.icon}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1px",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"12.5px",fontWeight:600,color:"#FFFFFF",textAlign:"center",whiteSpace:"nowrap"},children:i.name}),e.jsx("span",{className:"tech-label",style:{fontSize:"9px",color:"#A78BFA",fontWeight:500,textAlign:"center",whiteSpace:"nowrap",opacity:0,height:0,overflow:"hidden",transition:"opacity 0.2s ease, height 0.2s ease"},children:i.label})]})]}),e.jsx("span",{style:{color:"rgba(139, 92, 246, 0.25)",fontSize:"12px",margin:"0 24px",flexShrink:0,userSelect:"none"},children:"♦"})]},n))}),e.jsx("button",{onClick:F,type:"button",style:{width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,position:"absolute",right:"24px",transition:"all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"},className:"slider-arrow",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})})]}),e.jsx("div",{style:{width:"100px",height:"2px",backgroundColor:"rgba(255, 255, 255, 0.08)",borderRadius:"999px",position:"relative",overflow:"hidden",marginTop:"-12px"},children:e.jsx("div",{style:{position:"absolute",top:0,left:`${y*70}%`,width:"30%",height:"100%",backgroundColor:"#8B5CF6",borderRadius:"999px",boxShadow:"0 0 6px rgba(139, 92, 246, 0.6)",transition:"left 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)"}})}),e.jsx("span",{style:{fontSize:"11px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Technologies behind the products I build"})]}),e.jsxs("div",{className:"tech-mobile-grid-container",children:[e.jsxs("div",{className:"tech-mobile-header",children:[e.jsxs("div",{className:"projects-mobile-badge-pill",children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:e.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})}),e.jsx("span",{children:"TECH & TOOLS I WORK WITH"})]}),e.jsxs("h2",{className:"tech-mobile-title",children:["Modern technologies powering ",e.jsx("span",{className:"purple-gradient-text",children:"enterprise"})," solutions"]})]}),e.jsx("div",{className:"tech-mobile-ticker-wrapper",children:e.jsx("div",{className:"tech-mobile-ticker-track",children:v.map((i,n)=>e.jsx("div",{className:"tech-mobile-icon-card",title:i.name,children:i.icon},n))})})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .horizontal-scroll-carousel::-webkit-scrollbar {
          display: none !important;
        }
        .horizontal-scroll-carousel {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .slider-arrow:hover {
          background-color: rgba(124, 58, 237, 0.15) !important;
          border-color: rgba(124, 58, 237, 0.3) !important;
          color: #FFFFFF !important;
          transform: scale(1.05);
        }
        .slider-arrow:active {
          transform: scale(0.95);
        }
      `}})]})},ie=()=>{const[d,v]=h.useState("");h.useEffect(()=>{let x=!0;return $.getLinks().then(p=>{if(!x)return;const f=p.find(c=>c.platform.toLowerCase()==="email");if(f&&f.url){const c=f.url.trim(),g=c.startsWith("mailto:")?c:`mailto:${c}`;v(g)}}).catch(p=>{console.error("[CTASection] Failed to load email link:",p)}),()=>{x=!1}},[]);const y=x=>{d||(x.preventDefault(),typeof window<"u"&&window.showToast?window.showToast("info","Link Not Configured","Email address has not been configured yet.",5e3):alert("Email address has not been configured yet."))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"64px 40px",background:"radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",border:"1px solid rgba(255, 255, 255, 0.04)",borderRadius:"24px",width:"100%",boxSizing:"border-box",gap:"24px",fontFamily:"'Inter', sans-serif",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"rgba(124, 58, 237, 0.1)",border:"1px solid rgba(124, 58, 237, 0.2)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",maxWidth:"560px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"26px",fontWeight:850,color:"#FFFFFF",letterSpacing:"-0.02em"},children:"Interested in building your next digital product?"}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:1.5,color:"#94A3B8"},children:"Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets."})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"12px",justifyContent:"center"},children:[e.jsx("a",{href:"/#contact",className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",boxShadow:"0 4px 20px rgba(124, 58, 237, 0.35)",transition:"all 0.15s ease"},onMouseOver:x=>x.currentTarget.style.backgroundColor="var(--admin-primary-hover)",onMouseOut:x=>x.currentTarget.style.backgroundColor="var(--admin-primary)",children:"Let's Collaborate"}),e.jsx("a",{href:d||"#",onClick:y,className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#E2E8F0",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",transition:"all 0.15s ease"},onMouseOver:x=>{x.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.06)",x.currentTarget.style.borderColor="rgba(255, 255, 255, 0.1)"},onMouseOut:x=>{x.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.02)",x.currentTarget.style.borderColor="rgba(255, 255, 255, 0.06)"},children:"Contact Me"})]})]})},_=d=>{const v=d.features||[],y=["https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"],x=["Consolidates real-time information flow to design an unified interactive user interface. Reduces visual cognitive overload by staging details contextually.","Provides customizable workspace layouts, dashboard filters, and smart notifications to align with complex operational requirements and compliance controls.","Encrypted real-time data streaming pipeline optimized for low-latency delivery, high concurrent user loads, and complete data safety audits.","Centralized administration panel designed to manage user access privileges, audit data modifications, and check system performance metrics."],p=[["Consolidates all system components into a single audit-ready dashboard","Minimizes loading latency by implementing data caching strategies","Configured with strict role-based access logs to satisfy compliance"],["Supports automated alerts and delivery updates to target users","Custom filter menus based on status, severity, and timeline parameters","Audit log captures all user viewing and update actions for logs"],["Ensures end-to-end data encryption across secure transfer channels","Automatic backup systems with rapid failover disaster recovery","Simple integration hooks to connect to external systems"],["Real-time health telemetry checks showing process resource usages","Vibrant analytics visualizations presenting KPIs and outcomes","Simplified bulk-action menus to streamline repeated operations"]];return v.length>0?v.map((f,c)=>{const g=c%y.length,S=x[c%x.length],o=p[c%p.length];return{id:`mock-feat-${c}`,projectId:d.id,title:f,description:S,imageUrl:y[g],imageThumbnailUrl:y[g],imageAlt:`${f} Screenshot`,displayOrder:c,isActive:!0,bullets:o.map((b,l)=>({id:`mock-bullet-${c}-${l}`,featureId:`mock-feat-${c}`,text:b,displayOrder:l}))}}):[{id:"mock-feat-0",projectId:d.id,title:"Interactive Dashboard Operations",description:"A centralized workspace designed to simplify complex operational actions, view details contextually, and manage system states.",imageUrl:y[0],imageThumbnailUrl:y[0],imageAlt:"Dashboard Overview",displayOrder:0,isActive:!0,bullets:[{id:"b0-1",featureId:"mock-feat-0",text:"Consolidates all operational actions in a single control screen",displayOrder:0},{id:"b0-2",featureId:"mock-feat-0",text:"Vibrant charts presenting live telemetry and metrics values",displayOrder:1},{id:"b0-3",featureId:"mock-feat-0",text:"High security controls satisfying enterprise regulatory standards",displayOrder:2}]}]},re=({project:d,onClose:v})=>{const[y,x]=h.useState([]),[p,f]=h.useState(!1),[c,g]=h.useState(null),[S,o]=h.useState(0),b=h.useRef(null),l=h.useRef(null);if(h.useEffect(()=>(d&&(document.body.style.overflow="hidden",l.current&&l.current.focus()),()=>{document.body.style.overflow=""}),[d]),h.useEffect(()=>{d&&(f(!0),x([]),M.getProjectFeatures(d.id).then(t=>{t&&t.length>0?x(t):x(_(d))}).catch(t=>{console.error("[ProjectDetailsModal] Failed loading details:",t),x(_(d))}).finally(()=>{f(!1)}))},[d]),h.useEffect(()=>{const t=()=>{if(b.current){const{scrollTop:j,scrollHeight:k,clientHeight:A}=b.current,P=k-A;P>0&&o(j/P*100)}},m=b.current;return m&&m.addEventListener("scroll",t),()=>{m&&m.removeEventListener("scroll",t)}},[d,p]),h.useEffect(()=>{if(p)return;const t=new IntersectionObserver(j=>{j.forEach(k=>{k.isIntersecting&&(k.target.classList.add("is-revealed"),t.unobserve(k.target))})},{threshold:.15}),m=document.querySelectorAll(".reveal-trigger");return m.forEach(j=>t.observe(j)),()=>{m.forEach(j=>t.unobserve(j))}},[y,p,d]),h.useEffect(()=>{const t=m=>{d&&(c?m.key==="ArrowLeft"?R():m.key==="ArrowRight"?L():m.key==="Escape"&&g(null):m.key==="Escape"&&v())};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[d,c,y]),!d)return null;const{title:r,description:N,category:F,client:s,role:i,timeline:n,platform:a,coverImage:u,technologies:I,demoUrl:C,githubUrl:D,features:T,problemSolved:B,solution:w,businessValue:z,fullDescription:W,impactMetrics:E}=d,R=()=>{if(!c)return;const t=[u,...y.map(k=>k.imageUrl).filter(k=>!!k)],m=t.indexOf(c.url);if(m===-1||t.length===0)return;const j=m>0?m-1:t.length-1;g({url:t[j],title:"Showcase Image"})},L=()=>{if(!c)return;const t=[u,...y.map(k=>k.imageUrl).filter(k=>!!k)],m=t.indexOf(c.url);if(m===-1||t.length===0)return;const j=m<t.length-1?m+1:0;g({url:t[j],title:"Showcase Image"})};return e.jsxs("div",{ref:l,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":"case-study-title",style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.95)",backdropFilter:"blur(16px)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box",fontFamily:"'Inter', sans-serif",outline:"none"},onClick:v,children:[e.jsxs("div",{ref:b,style:{width:"100%",maxWidth:"1100px",height:"100%",maxHeight:"92vh",backgroundColor:"#FFFFFF",borderRadius:"24px",boxShadow:"0 30px 80px -15px rgba(0, 0, 0, 0.95)",overflowY:"auto",position:"relative",display:"flex",flexDirection:"column",boxSizing:"border-box",scrollbarWidth:"thin",scrollbarColor:"rgba(0,0,0,0.1) transparent",animation:"slideUpModal 350ms cubic-bezier(0.16, 1, 0.3, 1)"},onClick:t=>t.stopPropagation(),children:[e.jsx("div",{style:{position:"sticky",top:0,left:0,right:0,height:"4px",backgroundColor:"rgba(0,0,0,0.05)",zIndex:100,display:"block"},children:e.jsx("div",{style:{height:"100%",width:`${S}%`,backgroundColor:"#8B5CF6",boxShadow:"0 0 8px #8B5CF6",transition:"width 0.1s ease-out"}})}),e.jsxs("div",{className:"modal-sticky-top-bar",style:{position:"sticky",top:0,left:0,right:0,zIndex:150,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",backgroundColor:"rgba(9, 13, 26, 0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255, 255, 255, 0.08)",boxSizing:"border-box"},children:[e.jsxs("button",{type:"button",onClick:v,style:{backgroundColor:"transparent",border:"none",color:"#A78BFA",fontSize:"13.5px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",padding:"4px 8px",borderRadius:"8px",outline:"none",transition:"all 150ms ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]}),e.jsx("span",{children:"Back to Showcase"})]}),e.jsx("button",{type:"button",onClick:v,style:{width:"34px",height:"34px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.06)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 150ms ease"},"aria-label":"Close Case Study",children:"×"})]}),e.jsxs("div",{style:{position:"relative",width:"100%",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, rgba(9, 13, 26, 0) 70%)",padding:"36px 48px 32px 48px",boxSizing:"border-box",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"24px",overflow:"hidden"},className:"hero-section-grid",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",textAlign:"left",gap:"16px",width:"100%",maxWidth:"1000px",zIndex:2},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#A78BFA",backgroundColor:"rgba(139, 92, 246, 0.12)",border:"1px solid rgba(139, 92, 246, 0.2)",borderRadius:"999px",padding:"4px 14px",width:"fit-content",textTransform:"uppercase",letterSpacing:"0.06em",animationDelay:"0ms"},className:"animate-fade-in-up",children:F?F.replace(/case study/gi,"").trim():"Featured Project"}),e.jsx("h1",{id:"case-study-title",style:{margin:0,fontSize:"44px",fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.03em",lineHeight:"1.15",animationDelay:"60ms"},className:"animate-fade-in-up",children:r}),N&&e.jsx("p",{style:{margin:0,fontSize:"16.5px",lineHeight:"1.6",color:"#94A3B8",animationDelay:"120ms"},className:"animate-fade-in-up",children:N}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",gap:"32px",marginTop:"8px",borderTop:"1px solid rgba(255, 255, 255, 0.06)",paddingTop:"20px",width:"100%",animationDelay:"180ms"},className:"animate-fade-in-up",children:[{label:"Timeline",val:n||"2 Weeks",icon:"⏱"},{label:"My Role",val:i||"Lead Developer",icon:"👤"},{label:"Client",val:s||"Internal Dev",icon:"💼"},{label:"Platform",val:a||"Web Application",icon:"💻"}].map((t,m)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"3px"},children:[e.jsxs("span",{style:{fontSize:"9px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{children:t.icon})," ",t.label]}),e.jsx("span",{style:{fontSize:"13px",fontWeight:500,color:"#E2E8F0"},children:t.val})]},m))})]}),u&&e.jsx("div",{style:{width:"100%",maxWidth:"1040px",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(255, 255, 255, 0.05)",boxShadow:"0 20px 50px rgba(0, 0, 0, 0.35)",transition:"transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",cursor:"zoom-in",backgroundColor:"#090D1A",zIndex:2,marginTop:"16px",animationDelay:"240ms"},className:"animate-fade-in-up",onClick:()=>{g({url:u,title:`${r} Cover Screenshot`})},onMouseEnter:t=>{t.currentTarget.style.transform="translateY(-4px) scale(1.005)"},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0) scale(1)"},children:e.jsx("img",{src:u,alt:`${r} Showcase Cover`,style:{width:"100%",height:"auto",display:"block",objectFit:"cover"}})})]}),(B&&B.trim()!==""||w&&w.trim()!==""||z&&z.trim()!==""||W&&W.trim()!=="")&&e.jsx("div",{className:"case-story-section",style:{padding:"56px 48px 80px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{className:"case-story-container",style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"40px"},children:[e.jsxs("div",{className:"case-story-heading",style:{textAlign:"center",maxWidth:"600px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Project Narrative"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:650,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Journey & Outcome"})]}),e.jsxs("div",{className:"case-story-problem-solution",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"32px"},children:[B&&B.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #EF4444",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(239, 68, 68, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(239, 68, 68, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"0ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#EF4444"},children:"⚠️"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Challenge"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:B})]}),w&&w.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #8B5CF6",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(139, 92, 246, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(139, 92, 246, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"80ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#8B5CF6"},children:"💡"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Solution"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:w})]})]}),(W&&W.trim()!==""||z&&z.trim()!=="")&&e.jsxs("div",{className:"case-story-outcome-grid",style:{display:"flex",gap:"32px",marginTop:"16px",flexWrap:"wrap",width:"100%"},children:[W&&W.trim()!==""&&e.jsxs("div",{style:{flex:z&&z.trim()!==""?"1.8":"1",minWidth:"320px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #3B82F6",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#3B82F6"},children:"📄"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"Detailed Project Overview"})]}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:"1.8",color:"#475569",fontWeight:450,whiteSpace:"pre-wrap"},children:W})]}),z&&z.trim()!==""&&e.jsxs("div",{style:{flex:"1",minWidth:"280px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #10B981",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#10B981"},children:"📈"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em"},children:"Business Outcome"})]}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:z})]})]})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",boxSizing:"border-box"},children:[p?e.jsx("div",{style:{padding:"56px 48px",display:"flex",flexDirection:"column",gap:"32px"},children:[1,2].map(t=>e.jsx("div",{style:{height:"260px",borderRadius:"16px",backgroundColor:"#F1F5F9",animation:"skeletonPulse 1.5s infinite"}},t))}):y.length===0?e.jsx("div",{style:{padding:"56px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"18px",backgroundColor:"#F8FAFC"},children:T.map((t,m)=>e.jsxs("div",{style:{border:"1px solid rgba(0,0,0,0.06)",borderRadius:"12px",padding:"20px",backgroundColor:"#FFFFFF",display:"flex",gap:"12px"},children:[e.jsxs("span",{style:{fontSize:"16px",color:"#8B5CF6",fontWeight:600},children:["0",m+1,"."]}),e.jsx("span",{style:{fontSize:"14.5px",color:"#0F172A",fontWeight:600},children:t})]},m))}):e.jsx("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:y.map((t,m)=>{const j=m%2===1,k=m%2===1;return e.jsx("div",{style:{width:"100%",backgroundColor:k?"#F3F4F6":"#FFFFFF",color:"#0F172A",padding:"44px 48px",boxSizing:"border-box",borderBottom:"1px solid rgba(0, 0, 0, 0.02)",display:"flex",justifyContent:"center"},className:"reveal-trigger feature-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"960px",display:"grid",gridTemplateColumns:j?"1.1fr 0.9fr":"0.9fr 1.1fr",gap:"40px",alignItems:"center"},className:"modal-content-grid",children:[e.jsx("div",{style:{order:j?1:2,width:"100%",borderRadius:"16px",border:"1px solid #E2E8F0",boxShadow:"0 16px 40px rgba(15, 23, 42, 0.04)",cursor:"zoom-in",transition:"all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",backgroundColor:"#FFFFFF",padding:"10px",boxSizing:"border-box"},className:"feature-image",onClick:()=>{t.imageUrl&&g({url:t.imageUrl,title:t.title,caption:t.description||void 0})},onMouseEnter:A=>{A.currentTarget.style.transform="translateY(-4px)",A.currentTarget.style.borderColor="rgba(139, 92, 246, 0.15)",A.currentTarget.style.boxShadow="0 20px 48px rgba(139, 92, 246, 0.06)"},onMouseLeave:A=>{A.currentTarget.style.transform="translateY(0)",A.currentTarget.style.borderColor="#E2E8F0",A.currentTarget.style.boxShadow="0 16px 40px rgba(15, 23, 42, 0.04)"},children:t.imageUrl?e.jsx("img",{src:t.imageUrl,alt:t.imageAlt||t.title,loading:"lazy",style:{width:"100%",height:"auto",display:"block",objectFit:"contain",borderRadius:"8px"}}):e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"220px",color:"#94A3B8",fontSize:"13px"},children:"Image Showcase Unavailable"})}),e.jsxs("div",{style:{order:j?2:1,display:"flex",flexDirection:"column",gap:"16px"},className:"feature-text-block",children:[e.jsxs("div",{style:{fontSize:"56px",fontWeight:700,color:"#8B5CF6",opacity:.1,lineHeight:1,letterSpacing:"-0.03em",fontFamily:"system-ui, -apple-system, sans-serif"},children:["0",m+1]}),e.jsx("h3",{style:{margin:"4px 0 0 0",fontSize:"18px",fontWeight:600,color:"#0F172A",letterSpacing:"-0.02em",lineHeight:1.3},children:t.title}),t.description&&e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450,maxWidth:"540px"},children:t.description}),t.bullets&&t.bullets.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"6px"},children:t.bullets.map(A=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px"},children:[e.jsx("span",{style:{color:"#8B5CF6",fontWeight:700,fontSize:"13px",display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",backgroundColor:"rgba(139, 92, 246, 0.08)",flexShrink:0},children:"✓"}),e.jsx("span",{style:{fontSize:"13.5px",color:"#334155",lineHeight:"1.7",flex:1},children:A.text})]},A.id))})]})]})},t.id)})}),I&&I.length>0&&e.jsx("div",{className:"modal-tech-section",style:{padding:"56px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Technology Integration"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:650,color:"#0F172A",letterSpacing:"-0.02em"},children:"Engineered Stack & Tools"})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"10px"},children:I.map(t=>e.jsxs("span",{style:{fontSize:"13px",fontWeight:500,color:"#475569",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"7px 14px",height:"36px",boxSizing:"border-box",boxShadow:"0 2px 8px rgba(15, 23, 42, 0.02)",display:"inline-flex",alignItems:"center",gap:"8px",cursor:"default"},className:"tech-chip",children:[e.jsx("span",{style:{color:"#8B5CF6",fontSize:"10px"},children:"✦"})," ",t]},t))})]})}),E&&E.length>0&&e.jsx("div",{style:{padding:"40px 48px 44px",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 18% 78%, rgba(16, 185, 129, 0.06) 0%, rgba(9, 13, 26, 0) 46%)",color:"#FFFFFF",borderBottom:"1px solid rgba(255, 255, 255, 0.04)",display:"flex",justifyContent:"center"},className:"performance-metrics-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"880px",display:"flex",flexDirection:"column",gap:"22px"},children:[e.jsxs("div",{style:{textAlign:"center",maxWidth:"560px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"10.5px",fontWeight:600,color:"#10B981",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Performance Metrics"}),e.jsx("h2",{style:{margin:"6px 0 0 0",fontSize:"28px",fontWeight:650,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.08},children:"Measurable Business Impact"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"10px"},children:E.map((t,m)=>e.jsxs("div",{style:{backgroundColor:"rgba(255, 255, 255, 0.035)",border:"1px solid rgba(255, 255, 255, 0.09)",borderRadius:"12px",padding:"17px 18px 16px",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",gap:"6px",boxSizing:"border-box",minHeight:"112px",boxShadow:"0 14px 34px rgba(0, 0, 0, 0.12)",transition:"all 0.25s ease"},className:"metric-card",onMouseEnter:j=>{j.currentTarget.style.transform="translateY(-2px)",j.currentTarget.style.borderColor="rgba(16, 185, 129, 0.24)"},onMouseLeave:j=>{j.currentTarget.style.transform="translateY(0)",j.currentTarget.style.borderColor="rgba(255, 255, 255, 0.09)"},children:[e.jsx("span",{style:{width:"22px",height:"2px",borderRadius:"999px",backgroundColor:"#10B981",marginBottom:"4px"}}),e.jsx("span",{style:{fontSize:"30px",fontWeight:700,color:"#10B981",letterSpacing:"-0.02em",lineHeight:1},children:t.kpi}),e.jsx("span",{style:{fontSize:"12.75px",color:"#A8B3C7",fontWeight:500,lineHeight:1.35},children:t.label})]},m))})]})})]})]}),c&&e.jsxs("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.98)",backdropFilter:"blur(8px)",zIndex:1e4,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box"},onClick:()=>g(null),className:"lightbox-backdrop",children:[e.jsxs("div",{style:{position:"absolute",top:"20px",left:"24px",right:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#FFFFFF"},onClick:t=>t.stopPropagation(),children:[e.jsx("h4",{style:{margin:0,fontSize:"15px",fontWeight:600},children:c.title}),e.jsx("button",{type:"button",onClick:()=>g(null),style:{border:"none",backgroundColor:"transparent",color:"#94A3B8",fontSize:"28px",cursor:"pointer",outline:"none"},children:"×"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",maxWidth:"900px",position:"relative"},onClick:t=>t.stopPropagation(),children:[e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),R()},style:{position:"absolute",left:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"‹"}),e.jsx("div",{style:{width:"100%",maxHeight:"72vh",borderRadius:"12px",overflow:"hidden",border:"1.5px solid rgba(255, 255, 255, 0.08)",boxShadow:"0 20px 50px rgba(0,0,0,0.8)"},className:"lightbox-image-container",children:e.jsx("img",{src:c.url,alt:c.title,style:{width:"100%",height:"auto",maxHeight:"72vh",objectFit:"contain",display:"block"}})}),e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),L()},style:{position:"absolute",right:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"›"})]}),c.caption&&e.jsx("div",{style:{marginTop:"20px",color:"#94A3B8",fontSize:"13.5px",textAlign:"center",maxWidth:"600px",lineHeight:1.5},onClick:t=>t.stopPropagation(),children:c.caption})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},se=()=>{const[d,v]=h.useState([]),[y,x]=h.useState(null),[p,f]=h.useState(null),[c,g]=h.useState(!0),S=typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";h.useEffect(()=>{(async()=>{g(!0);try{const r=await M.getProjects();v(r);const N=await M.getFeaturedProject();x(N)}catch(r){console.error("[ProjectsShowcasePage] Load error:",r)}finally{g(!1)}})()},[]),h.useEffect(()=>{if(d.length===0)return;const l=()=>{const r=window.location.hash;if(r){const N=r.replace("#",""),F=d.find(s=>s.id===N);F?(f(F),window.AnalyticsService&&window.AnalyticsService.logCustomEvent({session_id:sessionStorage.getItem("session_id")||"unknown",event_type:"project_view",event_metadata:{project_id:F.id,project_title:F.title}})):f(null)}else f(null)};return l(),window.addEventListener("hashchange",l),()=>{window.removeEventListener("hashchange",l)}},[d]);const o=l=>{window.location.hash=l.id},b=()=>{window.location.hash&&window.history.replaceState(null,"",window.location.pathname+window.location.search),f(null)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"40px",width:"100%",maxWidth:"1200px",margin:"0 auto",padding:"36px 24px 80px 24px",boxSizing:"border-box",color:"#FFFFFF",fontFamily:"'Inter', sans-serif"},children:[e.jsx("div",{className:"projects-desktop-back-wrapper",style:{width:"100%",display:"flex",justifyContent:"flex-start"},children:e.jsx(Z,{label:"Back to Portfolio",fallbackUrl:`${S}#work`})}),e.jsx("section",{id:"project-collection-section",style:{width:"100%"},children:c?e.jsx("div",{style:{textAlign:"center",color:"#64748B",padding:"40px"},children:"Loading case studies portfolio..."}):e.jsx(Q,{projects:d,onViewDetails:o})}),e.jsxs("div",{className:"projects-desktop-remaining-sections",style:{width:"100%",display:"flex",flexDirection:"column",gap:"40px"},children:[e.jsx("section",{style:{width:"100%"},children:e.jsx(H,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(ee,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(te,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(ie,{})})]}),e.jsxs("div",{className:"projects-mobile-remaining-sections",children:[e.jsx("section",{className:"projects-mobile-tech-section",style:{width:"100%"},children:e.jsx(H,{})}),e.jsxs("section",{className:"projects-mobile-impact-section",children:[e.jsxs("div",{className:"projects-mobile-badge-pill green",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"#10B981",strokeWidth:"2",children:[e.jsx("polyline",{points:"23 6 13.5 15.5 8.5 10.5 1 18"}),e.jsx("polyline",{points:"17 6 23 6 23 12"})]}),e.jsx("span",{children:"PROVEN BUSINESS IMPACT"})]}),e.jsxs("div",{className:"projects-mobile-impact-grid",children:[e.jsxs("div",{className:"impact-card green",children:[e.jsx("span",{className:"impact-val",children:"50K+"}),e.jsx("span",{className:"impact-lbl",children:"Daily Active Users"})]}),e.jsxs("div",{className:"impact-card teal",children:[e.jsx("span",{className:"impact-val",children:"98%"}),e.jsx("span",{className:"impact-lbl",children:"Client Satisfaction"})]}),e.jsxs("div",{className:"impact-card cyan",children:[e.jsx("span",{className:"impact-val",children:"60%"}),e.jsx("span",{className:"impact-lbl",children:"Reduced Manual Work"})]}),e.jsxs("div",{className:"impact-card purple",children:[e.jsx("span",{className:"impact-val",children:"40%"}),e.jsx("span",{className:"impact-lbl",children:"Faster Processing"})]}),e.jsxs("div",{className:"impact-card blue full",children:[e.jsx("span",{className:"impact-val",children:"100+"}),e.jsx("span",{className:"impact-lbl",children:"Orchestrated Workflows"})]})]})]}),e.jsxs("section",{className:"projects-mobile-industry-section",children:[e.jsxs("div",{className:"projects-mobile-badge-pill",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]}),e.jsx("span",{children:"INDUSTRIES & DOMAINS I BUILD FOR"})]}),e.jsx("div",{className:"projects-mobile-industry-strip-wrapper",children:e.jsxs("div",{className:"projects-mobile-industry-strip",children:[e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"🛡️"})," Legal"]}),e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"🏢"})," Enterprise"]}),e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"👥"})," HR / Staffing"]}),e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"🏗️"})," Construction"]}),e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"🏭"})," Manufacturing"]}),e.jsxs("div",{className:"industry-pill",children:[e.jsx("span",{children:"🎓"})," Education"]})]})})]}),e.jsxs("section",{className:"projects-mobile-cta-section",children:[e.jsx("div",{className:"cta-icon-badge",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"#A78BFA",strokeWidth:"2",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]})}),e.jsxs("h2",{className:"projects-mobile-cta-title",children:["Interested in building your next ",e.jsx("br",{}),e.jsx("span",{className:"purple-gradient-text",children:"digital product?"})]}),e.jsx("p",{className:"projects-mobile-cta-desc",children:"Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets."}),e.jsxs("div",{className:"projects-mobile-cta-buttons",children:[e.jsx("button",{type:"button",className:"cta-primary-btn",onClick:()=>{const l=typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";window.location.href=`${l}#contact`},children:e.jsx("span",{children:"Let's Collaborate →"})}),e.jsx("button",{type:"button",className:"cta-secondary-btn",onClick:()=>{const l=typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";window.location.href=`${l}#contact`},children:e.jsx("span",{children:"Contact Me"})})]})]})]}),e.jsx(re,{project:p,onClose:b}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @media (max-width: 900px) {
          .featured-showcase-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 32px 24px !important;
          }
          .featured-screens-wrapper {
            min-height: 260px !important;
          }
        }
      `}})]})},oe=()=>{const[d,v]=h.useState(!1);return window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",h.useEffect(()=>{const x=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,o=>{const b=Math.random()*16|0;return(o==="x"?b:b&3|8).toString(16)}),p=()=>{let o=localStorage.getItem("visitor_id");return o||(o=x(),localStorage.setItem("visitor_id",o)),o},f=()=>{let o=sessionStorage.getItem("session_id");return o||(o=x(),sessionStorage.setItem("session_id",o)),o},c=()=>{const o=navigator.userAgent;let b="Other",l="Other",r="Desktop";return o.includes("Firefox")?b="Firefox":o.includes("SamsungBrowser")?b="Samsung Browser":o.includes("Opera")||o.includes("OPR")?b="Opera":o.includes("Trident")?b="Internet Explorer":o.includes("Edge")||o.includes("Edg")?b="Edge":o.includes("Chrome")?b="Chrome":o.includes("Safari")&&(b="Safari"),o.includes("Windows")?l="Windows":o.includes("Macintosh")||o.includes("Mac OS X")?l="macOS":o.includes("Android")?l="Android":o.includes("iPhone")||o.includes("iPad")?l="iOS":o.includes("Linux")&&(l="Linux"),/Mobi|Android|iPhone|iPad|iPod/i.test(o)&&(r=/Tablet|iPad/i.test(o)?"Tablet":"Mobile"),{browser:b,os:l,deviceType:r,userAgent:o}};let g;return(async()=>{if(!window.AnalyticsService)return;const o=()=>{var a;try{return window.location.search.includes("telemetryDebug=true")||((a=window.localStorage)==null?void 0:a.getItem("telemetry_debug"))==="true"}catch{return!1}},b=f(),l=p(),r=c(),N=document.referrer||"",F=J(N,window.location.search);let s={ip_address:"Unknown",country:"Unknown",country_code:"Unknown",city:"Unknown"};try{const a=await fetch("https://ipapi.co/json/");if(a.ok){const u=await a.json();s={ip_address:u.ip||"Unknown",country:u.country_name||"Unknown",country_code:u.country_code||"Unknown",city:u.city||"Unknown"}}}catch{}!await window.AnalyticsService.logSession({id:b,visitor_id:l,ip_address:s.ip_address,country:s.country,country_code:s.country_code,city:s.city,user_agent:r.userAgent,browser:r.browser,operating_system:r.os,device_type:r.deviceType,referrer:N,traffic_source:F.source,traffic_source_display:F.sourceDisplay,traffic_medium:F.medium,traffic_campaign:F.campaign,traffic_content:F.content,traffic_term:F.term,referrer_url:F.referrer,attribution_type:F.attributionType})&&o()&&console.warn("[Telemetry] Visitor session was not recorded; continuing without blocking the portfolio."),await window.AnalyticsService.logPageView({session_id:b,page_path:window.location.pathname||"/pages/projects/index.html",page_title:document.title||"Projects Showcase"});const n=Date.now();g=setInterval(async()=>{const a=Math.floor((Date.now()-n)/1e3);await window.AnalyticsService.pingSession(b,a)},15e3)})(),()=>{g&&clearInterval(g)}},[]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"site-bg","aria-hidden":"true",children:[e.jsx("div",{className:"light-ribbon ribbon-one"}),e.jsx("div",{className:"light-ribbon ribbon-two"}),e.jsx("div",{className:"light-ribbon ribbon-three"}),e.jsx("div",{className:"aurora"}),e.jsxs("div",{className:"particle-field",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsx("div",{className:"noise"})]}),e.jsx("main",{children:e.jsx(se,{})})]})},O=document.getElementById("root");O&&V.createRoot(O).render(e.jsx(U.StrictMode,{children:e.jsx(Y,{children:e.jsx(q,{children:e.jsx(X,{children:e.jsx(oe,{})})})})}));
