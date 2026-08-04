import{r as d,j as e,R as U,c as O}from"./index-Dqbl8sJf.js";import{b as $,A as V,P as Y}from"./admin-C3gvLNEQ.js";import{m as q,s as G,p as P}from"./Mendix-Brandmark-BOoBh7AY.js";import{r as Z}from"./attribution-CswXgDyo.js";import{G as K}from"./GlobalRouteGuard-C8kwDrBA.js";import"./projects-CA_ptObU.js";const X=({projects:o,onViewDetails:g})=>{const[f,s]=d.useState(""),[l,u]=d.useState(0),[a,m]=d.useState(!1),F=d.useRef(null),C=o.filter(i=>{const n=f.toLowerCase();return i.title.toLowerCase().includes(n)||i.description.toLowerCase().includes(n)||i.role.toLowerCase().includes(n)||i.category.toLowerCase().includes(n)||i.technologies.some(b=>b.toLowerCase().includes(n))}),r=C[l]||null;return d.useEffect(()=>{if(a||C.length<=1)return;const i=setInterval(()=>{u(n=>(n+1)%C.length)},4500);return()=>clearInterval(i)},[a,C.length]),d.useEffect(()=>{if(!F.current)return;const i=F.current,n=i.children[l];if(!n)return;const b=i.clientWidth,S=n.offsetLeft,T=n.clientWidth;i.scrollTo({left:S-b/2+T/2,behavior:"smooth"})},[l]),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",boxSizing:"border-box",gap:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"24px",flexWrap:"wrap",borderBottom:"1px solid rgba(255, 255, 255, 0.05)",paddingBottom:"20px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"14px",color:"#A78BFA"},children:"★"}),e.jsx("h2",{style:{fontSize:"22px",fontWeight:800,margin:0,color:"#FFFFFF",letterSpacing:"-0.03em"},children:"Case Studies Archive"})]}),e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"340px"},children:[e.jsx("input",{type:"text",value:f,onChange:i=>{s(i.target.value),u(0)},placeholder:"Search case studies...",style:{width:"100%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.08)",borderRadius:"999px",padding:"10px 16px 10px 40px",color:"#FFFFFF",fontSize:"13.5px",outline:"none",transition:"all 0.2s ease",boxSizing:"border-box"}}),e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"#64748B"},children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})]})]}),C.length>0?e.jsx("div",{ref:F,onMouseEnter:()=>m(!0),onMouseLeave:()=>m(!1),className:"horizontal-scroll-carousel",style:{display:"flex",width:"100%",overflowX:"auto",gap:"20px",padding:"24px 0",boxSizing:"border-box",scrollSnapType:"x mandatory",scrollBehavior:"smooth"},children:C.map((i,n)=>{const b=n===l;return e.jsxs("div",{onClick:()=>{u(n),m(!0)},style:{width:"240px",height:"140px",borderRadius:"12px",overflow:"hidden",position:"relative",flexShrink:0,cursor:"pointer",border:b?"2px solid #8B5CF6":"1px solid rgba(255,255,255,0.06)",boxShadow:b?"0 0 20px rgba(139, 92, 246, 0.3)":"none",transform:b?"scale(1.03)":"scale(0.97)",opacity:b?1:.5,transition:"all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",scrollSnapAlign:"center"},children:[e.jsx("img",{src:i.coverImage,alt:i.title,style:{width:"100%",height:"100%",objectFit:"cover"}}),e.jsxs("div",{style:{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"12px",boxSizing:"border-box"},children:[e.jsx("span",{style:{fontSize:"9px",fontWeight:800,color:"#A78BFA",textTransform:"uppercase",letterSpacing:"0.05em"},children:i.category}),e.jsx("h4",{style:{margin:"4px 0 0 0",fontSize:"13px",fontWeight:700,color:"#FFFFFF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:i.title})]})]},i.id)})}):e.jsx("div",{style:{color:"#64748B",fontSize:"14px",textAlign:"center",padding:"60px 0",fontWeight:500},children:"No case studies match your search queries."}),r&&e.jsxs("div",{style:{width:"100%",backgroundColor:"rgba(15, 22, 40, 0.4)",border:"1px solid rgba(255, 255, 255, 0.05)",borderRadius:"24px",padding:"36px",boxSizing:"border-box",marginTop:"8px",display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"40px",alignItems:"start",transition:"all 0.4s ease"},className:"active-project-details-grid",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",textAlign:"left"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:800,color:"#A78BFA",textTransform:"uppercase",backgroundColor:"rgba(124, 58, 237, 0.12)",border:"1px solid rgba(124, 58, 237, 0.2)",borderRadius:"999px",padding:"4px 12px"},children:r.category}),e.jsx("span",{style:{color:"rgba(255,255,255,0.15)"},children:"•"}),e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:600},children:r.timeline})]}),e.jsx("h3",{style:{fontSize:"32px",fontWeight:850,margin:0,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.2},children:r.title}),e.jsx("p",{style:{fontSize:"15px",lineHeight:1.6,color:"#94A3B8",margin:0,fontWeight:450},children:r.description}),r.problemSolved&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",backgroundColor:"rgba(255, 255, 255, 0.01)",padding:"16px",borderRadius:"12px",border:"1px solid rgba(255, 255, 255, 0.03)"},children:[e.jsx("strong",{style:{fontSize:"12px",textTransform:"uppercase",color:"#C4B5FD",letterSpacing:"0.04em"},children:"Problem Solved"}),e.jsxs("p",{style:{margin:0,fontSize:"13.5px",lineHeight:1.5,color:"#94A3B8",fontWeight:450},children:['"',r.problemSolved,'"']})]}),e.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap",marginTop:"8px"},children:[r.impactMetrics.map((i,n)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",backgroundColor:"rgba(16, 185, 129, 0.05)",border:"1px solid rgba(16, 185, 129, 0.15)",borderRadius:"8px",padding:"10px 16px",minWidth:"120px"},children:[e.jsx("span",{style:{fontSize:"18px",fontWeight:850,color:"#10B981"},children:i.kpi}),e.jsx("span",{style:{fontSize:"10px",color:"#64748B",fontWeight:600,textTransform:"uppercase"},children:i.label})]},n)),r.users&&e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",backgroundColor:"rgba(124, 58, 237, 0.05)",border:"1px solid rgba(124, 58, 237, 0.15)",borderRadius:"8px",padding:"10px 16px",minWidth:"120px"},children:[e.jsx("span",{style:{fontSize:"18px",fontWeight:850,color:"#A78BFA"},children:r.users}),e.jsx("span",{style:{fontSize:"10px",color:"#64748B",fontWeight:600,textTransform:"uppercase"},children:"Active Users"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"12px"},children:[e.jsx("button",{type:"button",onClick:()=>g(r),className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",border:"none",fontSize:"13.5px",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 16px rgba(124, 58, 237, 0.25)",transition:"all 0.15s ease"},children:"View Full Case Study Details →"}),r.demoUrl&&e.jsx("a",{href:r.demoUrl,target:"_blank",rel:"noreferrer",className:"hover-scale",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"rgba(255, 255, 255, 0.03)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#FFFFFF",fontSize:"13.5px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center"},children:"Live Preview"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",width:"100%"},children:[e.jsx("div",{style:{width:"100%",height:"280px",borderRadius:"16px",overflow:"hidden",position:"relative",backgroundColor:"#090D1A",border:"1px solid rgba(255, 255, 255, 0.06)"},children:e.jsx("img",{src:r.coverImage,alt:r.title,style:{width:"100%",height:"100%",objectFit:"cover"}})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"16px",backgroundColor:"rgba(255, 255, 255, 0.01)",padding:"20px",borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.03)",textAlign:"left"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.02em"},children:"My Role"}),e.jsx("p",{style:{margin:"4px 0 0 0",fontSize:"13.5px",color:"#E2E8F0",fontWeight:700},children:r.role})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"10.5px",color:"#64748B",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.02em"},children:"Target Client"}),e.jsx("p",{style:{margin:"4px 0 0 0",fontSize:"13.5px",color:"#E2E8F0",fontWeight:700},children:r.client})]})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:"8px"},children:r.technologies.map(i=>e.jsx("span",{style:{fontSize:"11px",fontWeight:600,padding:"5px 12px",borderRadius:"6px",backgroundColor:"rgba(255, 255, 255, 0.03)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#94A3B8"},children:i},i))})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},Q=()=>{const o=[{value:"50K+",label:"Daily Active Users"},{value:"98%",label:"Client Satisfaction Rate"},{value:"60%",label:"Reduced Manual Workflows"},{value:"40%",label:"Faster Processing Speed"},{value:"100+",label:"Orchestrated Workflows"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"32px",width:"100%",boxSizing:"border-box",padding:"24px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"14px",color:"#A78BFA"},children:"★"}),e.jsx("h3",{style:{fontSize:"18px",fontWeight:800,margin:0,color:"#FFFFFF",letterSpacing:"-0.02em"},children:"Proven Business Impact"})]}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"32px",width:"100%"},className:"impact-metrics-row",children:o.map((g,f)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",minWidth:"160px",textAlign:"left"},children:[e.jsx("span",{style:{fontSize:"40px",fontWeight:850,background:"linear-gradient(135deg, #10B981, #34D399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.03em",lineHeight:1},children:g.value}),e.jsxs("span",{style:{fontSize:"11px",color:"#64748B",fontWeight:650,textTransform:"uppercase",letterSpacing:"0.04em",lineHeight:1.3},children:[g.label.split(" ")[0]," ",e.jsx("br",{})," ",g.label.split(" ").slice(1).join(" ")]})]},f))}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @media (max-width: 768px) {
          .impact-metrics-row {
            justify-content: flex-start !important;
          }
        }
      `}})]})},J=()=>{const o=["Healthcare","Legal","Enterprise","HR / Staffing","Construction","Manufacturing","Education","Government"],g=[...o,...o];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",width:"100%",boxSizing:"border-box",padding:"40px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)",overflow:"hidden"},children:[e.jsx("div",{style:{textAlign:"center"},children:e.jsx("h3",{style:{fontSize:"11px",fontWeight:800,margin:0,color:"#64748B",letterSpacing:"0.25em",textTransform:"uppercase"},children:"INDUSTRIES & DOMAINS I BUILD FOR"})}),e.jsxs("div",{style:{width:"100%",overflow:"hidden",position:"relative",padding:"12px 0",display:"flex",alignItems:"center"},children:[e.jsx("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:"120px",background:"linear-gradient(90deg, #080c25 0%, transparent 100%)",zIndex:3,pointerEvents:"none"}}),e.jsx("div",{style:{position:"absolute",right:0,top:0,bottom:0,width:"120px",background:"linear-gradient(270deg, #080c25 0%, transparent 100%)",zIndex:3,pointerEvents:"none"}}),e.jsx("div",{className:"industry-marquee-track",style:{display:"flex",alignItems:"center",gap:"40px",width:"max-content",animation:"marquee-ind 40s linear infinite"},children:g.map((f,s)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"40px"},children:[e.jsx("span",{style:{fontSize:"15px",fontWeight:800,color:"#94A3B8",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"},children:f}),e.jsx("span",{style:{color:"#8B5CF6",fontSize:"18px",fontWeight:900},children:"•"})]},s))})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},ee=()=>{const o=[{name:"Mendix",label:"Low-Code Engine",icon:e.jsx("img",{src:q,style:{width:"30px",height:"30px",objectFit:"contain"},alt:"Mendix"})},{name:"React",label:"UI Framework",icon:e.jsxs("svg",{viewBox:"-11.5 -10.23 23 20.46",width:"32",height:"32",children:[e.jsx("circle",{cx:"0",cy:"0",r:"2.05",fill:"#61DAFB"}),e.jsxs("g",{stroke:"#61DAFB",strokeWidth:"1",fill:"none",children:[e.jsx("ellipse",{rx:"11",ry:"4.2"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(60)"}),e.jsx("ellipse",{rx:"11",ry:"4.2",transform:"rotate(120)"})]})]})},{name:"TypeScript",label:"Typed Scripting",icon:e.jsxs("svg",{viewBox:"0 0 100 100",width:"32",height:"32",children:[e.jsx("rect",{width:"100",height:"100",fill:"#3178C6",rx:"12"}),e.jsx("path",{d:"M63 40h-8.5v35h-9V40h-8.5v-7.5H63V40zm12.5 19.3c-1.5-1-3.6-1.7-6.2-1.7-3 0-4.8 1.4-4.8 3.5 0 2 1.6 3 4.8 4.2 4.6 1.7 8.3 3.5 8.3 8.7 0 5.4-4.5 9-11.3 9-3.7 0-7.2-1.1-9.2-2.7l3-6.5c1.8 1.3 4.5 2.2 7 2.2 3.1 0 4.8-1.4 4.8-3.6 0-2.3-1.8-3.2-5.1-4.5-4.5-1.7-8-3.8-8-8.5 0-5 4-8.7 10.5-8.7 3.3 0 6 1 7.7 2.1l-3.2 6.1z",fill:"#FFFFFF"})]})},{name:"SCSS",label:"Sassy CSS Styles",icon:e.jsx("img",{src:G,style:{width:"32px",height:"32px",objectFit:"contain"},alt:"SCSS"})},{name:"Figma",label:"UI/UX Design",icon:e.jsxs("svg",{viewBox:"0 0 38 57",width:"22",height:"32",fill:"none",children:[e.jsx("path",{d:"M19 19C19 8.5 10.5 0 0 0V19H19Z",fill:"#F24E1E"}),e.jsx("path",{d:"M19 0H38V19H19V0Z",fill:"#FF7262"}),e.jsx("path",{d:"M19 19H38V38H19V19Z",fill:"#10B981"}),e.jsx("path",{d:"M19 38C19 27.5 10.5 19 0 19V38H19Z",fill:"#A259FF"}),e.jsx("path",{d:"M19 57C19 46.5 10.5 38 0 38H19V57Z",fill:"#1ABC9C"})]})},{name:"Node.js",label:"Runtime Engine",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"#339933",children:e.jsx("path",{d:"M12 1.3L3.1 6.4v10.2l8.9 5.1 8.9-5.1V6.4L12 1.3zm6.6 14.3l-6.6 3.8-6.6-3.8V8.6l6.6-3.8 6.6 3.8v7z"})})},{name:"Vite",label:"Fast Bundling",icon:e.jsxs("svg",{viewBox:"0 0 256 256",width:"32",height:"32",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"viteGrad",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#41D1FF"}),e.jsx("stop",{offset:"100%",stopColor:"#BD34FE"})]})}),e.jsx("path",{d:"M128 0L24 180h56l48-84 48 84h56L128 0z",fill:"url(#viteGrad)"}),e.jsx("polygon",{points:"128 50 80 150 115 150 100 230 176 120 135 120 128 50",fill:"#FFC517"})]})}],g=[...o,...o,...o],[f,s]=d.useState(.5),l=d.useRef(null),u=d.useRef(),a=d.useRef(),m=d.useRef(!1),F=d.useRef(.88),C=.88,r=.016,i=()=>{if(!l.current)return;const h=l.current,p=h.scrollLeft+h.clientWidth/2,c=h.scrollWidth/3;if(c>0){const I=h.scrollLeft%c/c;s(I)}Array.from(h.children).forEach(I=>{const k=I;if(k.dataset.type!=="card")return;const L=k.offsetLeft+k.clientWidth/2,E=Math.abs(L-p),v=Math.max(0,1-E/200),z=.92+v*.11,W=.35+v*.65,D=(1-v)*1.2,R=50+v*50,M=v*-3.5;k.style.transform=`scale(${z}) translateY(${M}px) translateZ(0)`,k.style.opacity=`${W}`,k.style.filter=`blur(${D}px) saturate(${R}%)`;const t=v*.6,x=.04+v*.38;k.style.borderColor=`rgba(167, 139, 250, ${x})`,k.style.backgroundColor=`rgba(10, 15, 30, ${.4+v*.25})`,k.style.boxShadow=`
        0 8px 24px rgba(0, 0, 0, ${.12+v*.08}), 
        0 0 24px rgba(167, 139, 250, ${t*.16}),
        inset 0 1px 0 rgba(255, 255, 255, 0.02)
      `;const y=k.querySelector(".tech-icon-wrapper");y&&(y.style.transform=`scale(${1+v*.12})`,y.style.filter=`brightness(${1+v*.25})`);const w=k.querySelector(".tech-label");w&&(w.style.opacity=`${v}`,w.style.height=`${v*14}px`)})};d.useEffect(()=>{const h=()=>{if(l.current){const p=l.current;if(m.current?F.current>0&&(F.current=Math.max(0,F.current-.04)):F.current<C&&(F.current=Math.min(C,F.current+r)),F.current>0){let c=p.scrollLeft+F.current;const j=p.scrollWidth/3;j>0&&(c>=j*2?c-=j:c<=j&&(c+=j),p.scrollLeft=c)}}u.current=requestAnimationFrame(h)};return u.current=requestAnimationFrame(h),()=>{u.current&&cancelAnimationFrame(u.current),a.current&&cancelAnimationFrame(a.current)}},[]),d.useEffect(()=>{const h=()=>{if(!l.current)return;const p=l.current,c=p.scrollWidth/3;c>0?(p.scrollLeft=c,i()):requestAnimationFrame(h)};h()},[]);const n=h=>{if(!l.current)return;const p=l.current,c=p.children[h];if(!c)return;m.current=!0;const j=p.clientWidth,I=c.offsetLeft-j/2+c.clientWidth/2,k=p.scrollLeft,L=performance.now(),E=650;a.current&&cancelAnimationFrame(a.current);const B=v=>{const z=v-L,W=Math.min(1,z/E),D=1-Math.pow(1-W,3);p.scrollLeft=k+(I-k)*D,W<1?a.current=requestAnimationFrame(B):setTimeout(()=>{m.current=!1},1500)};a.current=requestAnimationFrame(B)},b=()=>{if(!l.current)return 0;const h=l.current,p=h.scrollLeft+h.clientWidth/2,c=Array.from(h.children);let j=1/0,I=0;return c.forEach((k,L)=>{const E=k;if(E.dataset.type!=="card")return;const B=E.offsetLeft+E.clientWidth/2,v=Math.abs(B-p);v<j&&(j=v,I=L)}),I},S=()=>{const h=b(),p=l.current;if(!p)return;let c=h+1;for(;c<p.children.length;){const j=p.children[c];if(j&&j.dataset.type==="card"){n(c);break}c++}},T=()=>{const h=b(),p=l.current;if(!p)return;let c=h-1;for(;c>=0;){const j=p.children[c];if(j&&j.dataset.type==="card"){n(c);break}c--}};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"40px",width:"100%",boxSizing:"border-box",padding:"60px 0 20px 0",borderTop:"1px solid rgba(255, 255, 255, 0.05)",position:"relative"},children:[e.jsxs("div",{style:{textAlign:"center",display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:850,color:"#A78BFA",letterSpacing:"0.2em",textTransform:"uppercase"},children:"TECH & TOOLS I WORK WITH"}),e.jsxs("h2",{style:{margin:0,fontSize:"clamp(28px, 4vw, 42px)",fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.2},children:["Modern technologies powering ",e.jsx("br",{}),e.jsx("span",{style:{background:"linear-gradient(135deg, #7C3AED, #A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"enterprise"})," solutions"]})]}),e.jsxs("div",{style:{width:"100%",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px",boxSizing:"border-box"},onMouseEnter:()=>{m.current=!0},onMouseLeave:()=>{m.current=!1},children:[e.jsx("button",{onClick:T,type:"button",style:{width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,position:"absolute",left:"24px",transition:"all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"},className:"slider-arrow",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"19",y1:"12",x2:"5",y2:"12"}),e.jsx("polyline",{points:"12 19 5 12 12 5"})]})}),e.jsx("div",{ref:l,onScroll:i,style:{width:"calc(100% - 100px)",overflowX:"auto",display:"flex",alignItems:"center",padding:"28px 0",scrollBehavior:"auto",position:"relative",maskImage:"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)"},className:"horizontal-scroll-carousel",children:g.map((h,p)=>e.jsxs(U.Fragment,{children:[e.jsxs("div",{"data-type":"card",onClick:()=>n(p*2),style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",cursor:"pointer",flexShrink:0,width:"120px",height:"120px",borderRadius:"16px",border:"1px solid rgba(255, 255, 255, 0.05)",padding:"16px 8px",boxSizing:"border-box",transition:"transform 0.15s ease-out, opacity 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out, filter 0.15s ease-out",willChange:"transform, opacity, filter",position:"relative"},children:[e.jsx("div",{className:"tech-icon-wrapper",style:{transition:"transform 0.2s ease, filter 0.2s ease",display:"flex",alignItems:"center",justifyContent:"center"},children:h.icon}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1px",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"12.5px",fontWeight:600,color:"#FFFFFF",textAlign:"center",whiteSpace:"nowrap"},children:h.name}),e.jsx("span",{className:"tech-label",style:{fontSize:"9px",color:"#A78BFA",fontWeight:500,textAlign:"center",whiteSpace:"nowrap",opacity:0,height:0,overflow:"hidden",transition:"opacity 0.2s ease, height 0.2s ease"},children:h.label})]})]}),e.jsx("span",{style:{color:"rgba(139, 92, 246, 0.25)",fontSize:"12px",margin:"0 24px",flexShrink:0,userSelect:"none"},children:"♦"})]},p))}),e.jsx("button",{onClick:S,type:"button",style:{width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,position:"absolute",right:"24px",transition:"all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)"},className:"slider-arrow",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})})]}),e.jsx("div",{style:{width:"100px",height:"2px",backgroundColor:"rgba(255, 255, 255, 0.08)",borderRadius:"999px",position:"relative",overflow:"hidden",marginTop:"-12px"},children:e.jsx("div",{style:{position:"absolute",top:0,left:`${f*70}%`,width:"30%",height:"100%",backgroundColor:"#8B5CF6",borderRadius:"999px",boxShadow:"0 0 6px rgba(139, 92, 246, 0.6)",transition:"left 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)"}})}),e.jsx("span",{style:{fontSize:"11px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"},children:"Auto-scrolling • Center item is highlighted"}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},te=()=>{const[o,g]=d.useState("");d.useEffect(()=>{let s=!0;return $.getLinks().then(l=>{if(!s)return;const u=l.find(a=>a.platform.toLowerCase()==="email");if(u&&u.url){const a=u.url.trim(),m=a.startsWith("mailto:")?a:`mailto:${a}`;g(m)}}).catch(l=>{console.error("[CTASection] Failed to load email link:",l)}),()=>{s=!1}},[]);const f=s=>{o||(s.preventDefault(),typeof window<"u"&&window.showToast?window.showToast("info","Link Not Configured","Email address has not been configured yet.",5e3):alert("Email address has not been configured yet."))};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"64px 40px",background:"radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",border:"1px solid rgba(255, 255, 255, 0.04)",borderRadius:"24px",width:"100%",boxSizing:"border-box",gap:"24px",fontFamily:"'Inter', sans-serif",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{width:"52px",height:"52px",borderRadius:"50%",backgroundColor:"rgba(124, 58, 237, 0.1)",border:"1px solid rgba(124, 58, 237, 0.2)",color:"#C4B5FD",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"12 2 2 7 12 12 22 7 12 2"}),e.jsx("polyline",{points:"2 17 12 22 22 17"}),e.jsx("polyline",{points:"2 12 12 17 22 12"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",maxWidth:"560px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"26px",fontWeight:850,color:"#FFFFFF",letterSpacing:"-0.02em"},children:"Interested in building your next digital product?"}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:1.5,color:"#94A3B8"},children:"Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets."})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"12px",justifyContent:"center"},children:[e.jsx("a",{href:"/#contact",className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",boxShadow:"0 4px 20px rgba(124, 58, 237, 0.35)",transition:"all 0.15s ease"},onMouseOver:s=>s.currentTarget.style.backgroundColor="var(--admin-primary-hover)",onMouseOut:s=>s.currentTarget.style.backgroundColor="var(--admin-primary)",children:"Let's Collaborate"}),e.jsx("a",{href:o||"#",onClick:f,className:"hover-scale active-press",style:{padding:"12px 28px",borderRadius:"999px",backgroundColor:"rgba(255, 255, 255, 0.02)",border:"1px solid rgba(255, 255, 255, 0.06)",color:"#E2E8F0",fontSize:"14px",fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",transition:"all 0.15s ease"},onMouseOver:s=>{s.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.06)",s.currentTarget.style.borderColor="rgba(255, 255, 255, 0.1)"},onMouseOut:s=>{s.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.02)",s.currentTarget.style.borderColor="rgba(255, 255, 255, 0.06)"},children:"Contact Me"})]})]})},_=o=>{const g=o.features||[],f=["https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"],s=["Consolidates real-time information flow to design an unified interactive user interface. Reduces visual cognitive overload by staging details contextually.","Provides customizable workspace layouts, dashboard filters, and smart notifications to align with complex operational requirements and compliance controls.","Encrypted real-time data streaming pipeline optimized for low-latency delivery, high concurrent user loads, and complete data safety audits.","Centralized administration panel designed to manage user access privileges, audit data modifications, and check system performance metrics."],l=[["Consolidates all system components into a single audit-ready dashboard","Minimizes loading latency by implementing data caching strategies","Configured with strict role-based access logs to satisfy compliance"],["Supports automated alerts and delivery updates to target users","Custom filter menus based on status, severity, and timeline parameters","Audit log captures all user viewing and update actions for logs"],["Ensures end-to-end data encryption across secure transfer channels","Automatic backup systems with rapid failover disaster recovery","Simple integration hooks to connect to external systems"],["Real-time health telemetry checks showing process resource usages","Vibrant analytics visualizations presenting KPIs and outcomes","Simplified bulk-action menus to streamline repeated operations"]];return g.length>0?g.map((u,a)=>{const m=a%f.length,F=s[a%s.length],C=l[a%l.length];return{id:`mock-feat-${a}`,projectId:o.id,title:u,description:F,imageUrl:f[m],imageThumbnailUrl:f[m],imageAlt:`${u} Screenshot`,displayOrder:a,isActive:!0,bullets:C.map((r,i)=>({id:`mock-bullet-${a}-${i}`,featureId:`mock-feat-${a}`,text:r,displayOrder:i}))}}):[{id:"mock-feat-0",projectId:o.id,title:"Interactive Dashboard Operations",description:"A centralized workspace designed to simplify complex operational actions, view details contextually, and manage system states.",imageUrl:f[0],imageThumbnailUrl:f[0],imageAlt:"Dashboard Overview",displayOrder:0,isActive:!0,bullets:[{id:"b0-1",featureId:"mock-feat-0",text:"Consolidates all operational actions in a single control screen",displayOrder:0},{id:"b0-2",featureId:"mock-feat-0",text:"Vibrant charts presenting live telemetry and metrics values",displayOrder:1},{id:"b0-3",featureId:"mock-feat-0",text:"High security controls satisfying enterprise regulatory standards",displayOrder:2}]}]},re=({project:o,onClose:g})=>{const[f,s]=d.useState([]),[l,u]=d.useState(!1),[a,m]=d.useState(null),[F,C]=d.useState(0),r=d.useRef(null),i=d.useRef(null);if(d.useEffect(()=>(o&&(document.body.style.overflow="hidden",i.current&&i.current.focus()),()=>{document.body.style.overflow=""}),[o]),d.useEffect(()=>{o&&(u(!0),s([]),P.getProjectFeatures(o.id).then(t=>{t&&t.length>0?s(t):s(_(o))}).catch(t=>{console.error("[ProjectDetailsModal] Failed loading details:",t),s(_(o))}).finally(()=>{u(!1)}))},[o]),d.useEffect(()=>{const t=()=>{if(r.current){const{scrollTop:y,scrollHeight:w,clientHeight:A}=r.current,N=w-A;N>0&&C(y/N*100)}},x=r.current;return x&&x.addEventListener("scroll",t),()=>{x&&x.removeEventListener("scroll",t)}},[o,l]),d.useEffect(()=>{if(l)return;const t=new IntersectionObserver(y=>{y.forEach(w=>{w.isIntersecting&&(w.target.classList.add("is-revealed"),t.unobserve(w.target))})},{threshold:.15}),x=document.querySelectorAll(".reveal-trigger");return x.forEach(y=>t.observe(y)),()=>{x.forEach(y=>t.unobserve(y))}},[f,l,o]),d.useEffect(()=>{const t=x=>{o&&(a?x.key==="ArrowLeft"?R():x.key==="ArrowRight"?M():x.key==="Escape"&&m(null):x.key==="Escape"&&g())};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[o,a,f]),!o)return null;const{title:n,description:b,category:S,client:T,role:h,timeline:p,platform:c,coverImage:j,technologies:I,demoUrl:k,githubUrl:L,features:E,problemSolved:B,solution:v,businessValue:z,fullDescription:W,impactMetrics:D}=o,R=()=>{if(!a)return;const t=[j,...f.map(w=>w.imageUrl).filter(w=>!!w)],x=t.indexOf(a.url);if(x===-1||t.length===0)return;const y=x>0?x-1:t.length-1;m({url:t[y],title:"Showcase Image"})},M=()=>{if(!a)return;const t=[j,...f.map(w=>w.imageUrl).filter(w=>!!w)],x=t.indexOf(a.url);if(x===-1||t.length===0)return;const y=x<t.length-1?x+1:0;m({url:t[y],title:"Showcase Image"})};return e.jsxs("div",{ref:i,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":"case-study-title",style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.95)",backdropFilter:"blur(16px)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box",fontFamily:"'Inter', sans-serif",outline:"none"},onClick:g,children:[e.jsxs("div",{ref:r,style:{width:"100%",maxWidth:"1100px",height:"100%",maxHeight:"92vh",backgroundColor:"#FFFFFF",borderRadius:"24px",boxShadow:"0 30px 80px -15px rgba(0, 0, 0, 0.95)",overflowY:"auto",position:"relative",display:"flex",flexDirection:"column",boxSizing:"border-box",scrollbarWidth:"thin",scrollbarColor:"rgba(0,0,0,0.1) transparent",animation:"slideUpModal 350ms cubic-bezier(0.16, 1, 0.3, 1)"},onClick:t=>t.stopPropagation(),children:[e.jsx("div",{style:{position:"sticky",top:0,left:0,right:0,height:"4px",backgroundColor:"rgba(0,0,0,0.05)",zIndex:100,display:"block"},children:e.jsx("div",{style:{height:"100%",width:`${F}%`,backgroundColor:"#8B5CF6",boxShadow:"0 0 8px #8B5CF6",transition:"width 0.1s ease-out"}})}),e.jsxs("div",{style:{position:"relative",width:"100%",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, rgba(9, 13, 26, 0) 70%)",padding:"80px 48px 32px 48px",boxSizing:"border-box",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"24px",overflow:"hidden"},className:"hero-section-grid",children:[e.jsx("button",{type:"button",onClick:g,style:{position:"absolute",top:"24px",right:"24px",width:"40px",height:"40px",borderRadius:"50%",backgroundColor:"rgba(255, 255, 255, 0.05)",border:"1px solid rgba(255, 255, 255, 0.1)",color:"#FFFFFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",transition:"all 150ms cubic-bezier(0.16, 1, 0.3, 1)",outline:"none",zIndex:10},"aria-label":"Close Case Study",onMouseEnter:t=>{t.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.2)",t.currentTarget.style.borderColor="rgba(239, 68, 68, 0.4)"},onMouseLeave:t=>{t.currentTarget.style.backgroundColor="rgba(255, 255, 255, 0.05)",t.currentTarget.style.borderColor="rgba(255, 255, 255, 0.1)"},children:"×"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",textAlign:"left",gap:"16px",width:"100%",maxWidth:"1000px",zIndex:2},children:[e.jsx("button",{type:"button",onClick:g,style:{backgroundColor:"transparent",border:"none",color:"#C4B5FD",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",padding:0,width:"fit-content",outline:"none",marginBottom:"4px",transition:"color 150ms cubic-bezier(0.16, 1, 0.3, 1)"},onMouseEnter:t=>t.currentTarget.style.color="#FFFFFF",onMouseLeave:t=>t.currentTarget.style.color="#C4B5FD",children:"← Back to Showcase"}),e.jsx("span",{style:{fontSize:"11px",fontWeight:800,color:"#A78BFA",backgroundColor:"rgba(139, 92, 246, 0.12)",border:"1px solid rgba(139, 92, 246, 0.2)",borderRadius:"999px",padding:"4px 14px",width:"fit-content",textTransform:"uppercase",letterSpacing:"0.06em",animationDelay:"0ms"},className:"animate-fade-in-up",children:S?`${S.replace(/case study/gi,"").trim()} Case Study`:"Project Case Study"}),e.jsx("h1",{id:"case-study-title",style:{margin:0,fontSize:"44px",fontWeight:900,color:"#FFFFFF",letterSpacing:"-0.03em",lineHeight:"1.15",animationDelay:"60ms"},className:"animate-fade-in-up",children:n}),b&&e.jsx("p",{style:{margin:0,fontSize:"16.5px",lineHeight:"1.6",color:"#94A3B8",animationDelay:"120ms"},className:"animate-fade-in-up",children:b}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",gap:"32px",marginTop:"8px",borderTop:"1px solid rgba(255, 255, 255, 0.06)",paddingTop:"20px",width:"100%",animationDelay:"180ms"},className:"animate-fade-in-up",children:[{label:"Timeline",val:p||"2 Weeks",icon:"⏱"},{label:"My Role",val:h||"Lead Developer",icon:"👤"},{label:"Client",val:T||"Internal Dev",icon:"💼"},{label:"Platform",val:c||"Web Application",icon:"💻"}].map((t,x)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:"3px"},children:[e.jsxs("span",{style:{fontSize:"9px",color:"#64748B",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{children:t.icon})," ",t.label]}),e.jsx("span",{style:{fontSize:"13px",fontWeight:650,color:"#E2E8F0"},children:t.val})]},x))})]}),j&&e.jsx("div",{style:{width:"100%",maxWidth:"1040px",borderRadius:"16px",overflow:"hidden",border:"1px solid rgba(255, 255, 255, 0.05)",boxShadow:"0 20px 50px rgba(0, 0, 0, 0.35)",transition:"transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",cursor:"zoom-in",backgroundColor:"#090D1A",zIndex:2,marginTop:"16px",animationDelay:"240ms"},className:"animate-fade-in-up",onClick:()=>{m({url:j,title:`${n} Cover Screenshot`})},onMouseEnter:t=>{t.currentTarget.style.transform="translateY(-4px) scale(1.005)"},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0) scale(1)"},children:e.jsx("img",{src:j,alt:`${n} Showcase Cover`,style:{width:"100%",height:"auto",display:"block",objectFit:"cover"}})})]}),(B&&B.trim()!==""||v&&v.trim()!==""||z&&z.trim()!==""||W&&W.trim()!=="")&&e.jsx("div",{className:"case-story-section",style:{padding:"56px 48px 80px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{className:"case-story-container",style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"40px"},children:[e.jsxs("div",{className:"case-story-heading",style:{textAlign:"center",maxWidth:"600px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:800,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Project Narrative"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:900,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Journey & Outcome"})]}),e.jsxs("div",{className:"case-story-problem-solution",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"32px"},children:[B&&B.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #EF4444",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(239, 68, 68, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(239, 68, 68, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"0ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#EF4444"},children:"⚠️"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Challenge"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:B})]}),v&&v.trim()!==""&&e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderTop:"4px solid #8B5CF6",borderRadius:"16px",padding:"44px 36px",display:"flex",flexDirection:"column",gap:"24px",background:"linear-gradient(180deg, rgba(139, 92, 246, 0.01) 0%, #FFFFFF 100%)",boxShadow:"0 10px 30px rgba(139, 92, 246, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)",transitionDelay:"80ms"},className:"reveal-trigger narrative-card",children:[e.jsx("span",{style:{fontSize:"32px",color:"#8B5CF6"},children:"💡"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.02em"},children:"The Solution"}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:v})]})]}),(W&&W.trim()!==""||z&&z.trim()!=="")&&e.jsxs("div",{className:"case-story-outcome-grid",style:{display:"flex",gap:"32px",marginTop:"16px",flexWrap:"wrap",width:"100%"},children:[W&&W.trim()!==""&&e.jsxs("div",{style:{flex:z&&z.trim()!==""?"1.8":"1",minWidth:"320px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #3B82F6",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#3B82F6"},children:"📄"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.02em"},children:"Detailed Project Overview"})]}),e.jsx("p",{style:{margin:0,fontSize:"14.5px",lineHeight:"1.8",color:"#475569",fontWeight:450,whiteSpace:"pre-wrap"},children:W})]}),z&&z.trim()!==""&&e.jsxs("div",{style:{flex:"1",minWidth:"280px",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderLeft:"4px solid #10B981",borderRadius:"16px",padding:"40px",boxSizing:"border-box",display:"flex",flexDirection:"column",gap:"16px",boxShadow:"0 8px 24px rgba(15, 23, 42, 0.02)"},className:"reveal-trigger narrative-card",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"28px",color:"#10B981"},children:"📈"}),e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.02em"},children:"Business Outcome"})]}),e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450},children:z})]})]})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",boxSizing:"border-box"},children:[l?e.jsx("div",{style:{padding:"56px 48px",display:"flex",flexDirection:"column",gap:"32px"},children:[1,2].map(t=>e.jsx("div",{style:{height:"260px",borderRadius:"16px",backgroundColor:"#F1F5F9",animation:"skeletonPulse 1.5s infinite"}},t))}):f.length===0?e.jsx("div",{style:{padding:"56px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"18px",backgroundColor:"#F8FAFC"},children:E.map((t,x)=>e.jsxs("div",{style:{border:"1px solid rgba(0,0,0,0.06)",borderRadius:"12px",padding:"20px",backgroundColor:"#FFFFFF",display:"flex",gap:"12px"},children:[e.jsxs("span",{style:{fontSize:"16px",color:"#8B5CF6",fontWeight:800},children:["0",x+1,"."]}),e.jsx("span",{style:{fontSize:"14.5px",color:"#0F172A",fontWeight:650},children:t})]},x))}):e.jsx("div",{style:{display:"flex",flexDirection:"column",width:"100%"},children:f.map((t,x)=>{const y=x%2===1,w=x%2===1;return e.jsx("div",{style:{width:"100%",backgroundColor:w?"#F3F4F6":"#FFFFFF",color:"#0F172A",padding:"44px 48px",boxSizing:"border-box",borderBottom:"1px solid rgba(0, 0, 0, 0.02)",display:"flex",justifyContent:"center"},className:"reveal-trigger feature-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"960px",display:"grid",gridTemplateColumns:y?"1.1fr 0.9fr":"0.9fr 1.1fr",gap:"40px",alignItems:"center"},className:"modal-content-grid",children:[e.jsx("div",{style:{order:y?1:2,width:"100%",borderRadius:"16px",border:"1px solid #E2E8F0",boxShadow:"0 16px 40px rgba(15, 23, 42, 0.04)",cursor:"zoom-in",transition:"all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",backgroundColor:"#FFFFFF",padding:"10px",boxSizing:"border-box"},className:"feature-image",onClick:()=>{t.imageUrl&&m({url:t.imageUrl,title:t.title,caption:t.description||void 0})},onMouseEnter:A=>{A.currentTarget.style.transform="translateY(-4px)",A.currentTarget.style.borderColor="rgba(139, 92, 246, 0.15)",A.currentTarget.style.boxShadow="0 20px 48px rgba(139, 92, 246, 0.06)"},onMouseLeave:A=>{A.currentTarget.style.transform="translateY(0)",A.currentTarget.style.borderColor="#E2E8F0",A.currentTarget.style.boxShadow="0 16px 40px rgba(15, 23, 42, 0.04)"},children:t.imageUrl?e.jsx("img",{src:t.imageUrl,alt:t.imageAlt||t.title,loading:"lazy",style:{width:"100%",height:"auto",display:"block",objectFit:"contain",borderRadius:"8px"}}):e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"220px",color:"#94A3B8",fontSize:"13px"},children:"Image Showcase Unavailable"})}),e.jsxs("div",{style:{order:y?2:1,display:"flex",flexDirection:"column",gap:"16px"},className:"feature-text-block",children:[e.jsxs("div",{style:{fontSize:"56px",fontWeight:900,color:"#8B5CF6",opacity:.08,lineHeight:1,letterSpacing:"-0.03em",fontFamily:"system-ui, -apple-system, sans-serif"},children:["0",x+1]}),e.jsx("h3",{style:{margin:"4px 0 0 0",fontSize:"28px",fontWeight:800,color:"#0F172A",letterSpacing:"-0.02em",lineHeight:1.3},children:t.title}),t.description&&e.jsx("p",{style:{margin:0,fontSize:"14px",lineHeight:"1.75",color:"#475569",fontWeight:450,maxWidth:"540px"},children:t.description}),t.bullets&&t.bullets.length>0&&e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"6px"},children:t.bullets.map(A=>e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px"},children:[e.jsx("span",{style:{color:"#8B5CF6",fontWeight:900,fontSize:"13px",display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",backgroundColor:"rgba(139, 92, 246, 0.08)",flexShrink:0},children:"✓"}),e.jsx("span",{style:{fontSize:"13.5px",color:"#334155",lineHeight:"1.7",flex:1},children:A.text})]},A.id))})]})]})},t.id)})}),I&&I.length>0&&e.jsx("div",{style:{padding:"56px 48px",backgroundColor:"#FFFFFF",borderBottom:"1px solid rgba(0, 0, 0, 0.05)",display:"flex",justifyContent:"center"},children:e.jsxs("div",{style:{width:"100%",maxWidth:"1000px",display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:800,color:"#8B5CF6",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Technology Integration"}),e.jsx("h2",{style:{margin:"8px 0 0 0",fontSize:"32px",fontWeight:900,color:"#0F172A",letterSpacing:"-0.02em"},children:"Engineered Stack & Tools"})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"10px"},children:I.map(t=>e.jsxs("span",{style:{fontSize:"13px",fontWeight:600,color:"#475569",backgroundColor:"#FFFFFF",border:"1px solid #E2E8F0",borderRadius:"8px",padding:"7px 14px",height:"36px",boxSizing:"border-box",boxShadow:"0 2px 8px rgba(15, 23, 42, 0.02)",display:"inline-flex",alignItems:"center",gap:"8px",cursor:"default"},className:"tech-chip",children:[e.jsx("span",{style:{color:"#8B5CF6",fontSize:"10px"},children:"✦"})," ",t]},t))})]})}),D&&D.length>0&&e.jsx("div",{style:{padding:"40px 48px 44px",backgroundColor:"#090D1A",backgroundImage:"radial-gradient(circle at 18% 78%, rgba(16, 185, 129, 0.06) 0%, rgba(9, 13, 26, 0) 46%)",color:"#FFFFFF",borderBottom:"1px solid rgba(255, 255, 255, 0.04)",display:"flex",justifyContent:"center"},className:"performance-metrics-section",children:e.jsxs("div",{style:{width:"100%",maxWidth:"880px",display:"flex",flexDirection:"column",gap:"22px"},children:[e.jsxs("div",{style:{textAlign:"center",maxWidth:"560px",margin:"0 auto"},children:[e.jsx("span",{style:{fontSize:"10.5px",fontWeight:800,color:"#10B981",letterSpacing:"0.08em",textTransform:"uppercase"},children:"Performance Metrics"}),e.jsx("h2",{style:{margin:"6px 0 0 0",fontSize:"28px",fontWeight:850,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.08},children:"Measurable Business Impact"})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",gap:"10px"},children:D.map((t,x)=>e.jsxs("div",{style:{backgroundColor:"rgba(255, 255, 255, 0.035)",border:"1px solid rgba(255, 255, 255, 0.09)",borderRadius:"12px",padding:"17px 18px 16px",textAlign:"left",display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",gap:"6px",boxSizing:"border-box",minHeight:"112px",boxShadow:"0 14px 34px rgba(0, 0, 0, 0.12)",transition:"all 0.25s ease"},className:"metric-card",onMouseEnter:y=>{y.currentTarget.style.transform="translateY(-2px)",y.currentTarget.style.borderColor="rgba(16, 185, 129, 0.24)"},onMouseLeave:y=>{y.currentTarget.style.transform="translateY(0)",y.currentTarget.style.borderColor="rgba(255, 255, 255, 0.09)"},children:[e.jsx("span",{style:{width:"22px",height:"2px",borderRadius:"999px",backgroundColor:"#10B981",marginBottom:"4px"}}),e.jsx("span",{style:{fontSize:"30px",fontWeight:850,color:"#10B981",letterSpacing:"-0.02em",lineHeight:1},children:t.kpi}),e.jsx("span",{style:{fontSize:"12.75px",color:"#A8B3C7",fontWeight:550,lineHeight:1.35},children:t.label})]},x))})]})})]})]}),a&&e.jsxs("div",{style:{position:"fixed",inset:0,backgroundColor:"rgba(3, 7, 18, 0.98)",backdropFilter:"blur(8px)",zIndex:1e4,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"24px",boxSizing:"border-box"},onClick:()=>m(null),className:"lightbox-backdrop",children:[e.jsxs("div",{style:{position:"absolute",top:"20px",left:"24px",right:"24px",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#FFFFFF"},onClick:t=>t.stopPropagation(),children:[e.jsx("h4",{style:{margin:0,fontSize:"15px",fontWeight:800},children:a.title}),e.jsx("button",{type:"button",onClick:()=>m(null),style:{border:"none",backgroundColor:"transparent",color:"#94A3B8",fontSize:"28px",cursor:"pointer",outline:"none"},children:"×"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",maxWidth:"900px",position:"relative"},onClick:t=>t.stopPropagation(),children:[e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),R()},style:{position:"absolute",left:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"‹"}),e.jsx("div",{style:{width:"100%",maxHeight:"72vh",borderRadius:"12px",overflow:"hidden",border:"1.5px solid rgba(255, 255, 255, 0.08)",boxShadow:"0 20px 50px rgba(0,0,0,0.8)"},className:"lightbox-image-container",children:e.jsx("img",{src:a.url,alt:a.title,style:{width:"100%",height:"auto",maxHeight:"72vh",objectFit:"contain",display:"block"}})}),e.jsx("button",{type:"button",onClick:t=>{t.stopPropagation(),M()},style:{position:"absolute",right:"-60px",backgroundColor:"rgba(15, 23, 42, 0.65)",border:"1px solid rgba(255, 255, 255, 0.12)",color:"#FFFFFF",width:"44px",height:"44px",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",outline:"none",transition:"all 0.15s ease"},onMouseEnter:t=>t.currentTarget.style.backgroundColor="rgba(139, 92, 246, 0.35)",onMouseLeave:t=>t.currentTarget.style.backgroundColor="rgba(15, 23, 42, 0.65)",children:"›"})]}),a.caption&&e.jsx("div",{style:{marginTop:"20px",color:"#94A3B8",fontSize:"13.5px",textAlign:"center",maxWidth:"600px",lineHeight:1.5},onClick:t=>t.stopPropagation(),children:a.caption})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
          font-size: 28px !important;
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
      `}})]})},ie=()=>{const[o,g]=d.useState([]),[f,s]=d.useState(null),[l,u]=d.useState(null),[a,m]=d.useState(!0);d.useEffect(()=>{(async()=>{m(!0);try{const i=await P.getProjects();g(i);const n=await P.getFeaturedProject();s(n)}catch(i){console.error("[ProjectsShowcasePage] Load error:",i)}finally{m(!1)}})()},[]),d.useEffect(()=>{if(o.length===0)return;const r=()=>{const i=window.location.hash;if(i){const n=i.replace("#",""),b=o.find(S=>S.id===n);b?(u(b),window.AnalyticsService&&window.AnalyticsService.logCustomEvent({session_id:sessionStorage.getItem("session_id")||"unknown",event_type:"project_view",event_metadata:{project_id:b.id,project_title:b.title}})):u(null)}else u(null)};return r(),window.addEventListener("hashchange",r),()=>{window.removeEventListener("hashchange",r)}},[o]);const F=r=>{window.location.hash=r.id},C=()=>{window.location.hash&&window.history.pushState(null,"",window.location.pathname+window.location.search),u(null)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"64px",width:"100%",maxWidth:"1200px",margin:"0 auto",padding:"110px 24px 80px 24px",boxSizing:"border-box",color:"#FFFFFF",fontFamily:"'Inter', sans-serif"},children:[e.jsx("section",{id:"project-collection-section",style:{width:"100%"},children:a?e.jsx("div",{style:{textAlign:"center",color:"#64748B",padding:"40px"},children:"Loading case studies portfolio..."}):e.jsx(X,{projects:o,onViewDetails:F})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(ee,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(Q,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(J,{})}),e.jsx("section",{style:{width:"100%"},children:e.jsx(te,{})}),e.jsx(re,{project:l,onClose:C}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
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
      `}})]})},oe=()=>{const[o,g]=d.useState(!1),s=window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/";return d.useEffect(()=>{const l=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,r=>{const i=Math.random()*16|0;return(r==="x"?i:i&3|8).toString(16)}),u=()=>{let r=localStorage.getItem("visitor_id");return r||(r=l(),localStorage.setItem("visitor_id",r)),r},a=()=>{let r=sessionStorage.getItem("session_id");return r||(r=l(),sessionStorage.setItem("session_id",r)),r},m=()=>{const r=navigator.userAgent;let i="Other",n="Other",b="Desktop";return r.includes("Firefox")?i="Firefox":r.includes("SamsungBrowser")?i="Samsung Browser":r.includes("Opera")||r.includes("OPR")?i="Opera":r.includes("Trident")?i="Internet Explorer":r.includes("Edge")||r.includes("Edg")?i="Edge":r.includes("Chrome")?i="Chrome":r.includes("Safari")&&(i="Safari"),r.includes("Windows")?n="Windows":r.includes("Macintosh")||r.includes("Mac OS X")?n="macOS":r.includes("Android")?n="Android":r.includes("iPhone")||r.includes("iPad")?n="iOS":r.includes("Linux")&&(n="Linux"),/Mobi|Android|iPhone|iPad|iPod/i.test(r)&&(b=/Tablet|iPad/i.test(r)?"Tablet":"Mobile"),{browser:i,os:n,deviceType:b,userAgent:r}};let F;return(async()=>{if(!window.AnalyticsService)return;const r=a(),i=u(),n=m(),b=document.referrer||"",S=Z(b,window.location.search);let T={ip_address:"Unknown",country:"Unknown",country_code:"Unknown",city:"Unknown"};try{const p=await fetch("https://ipapi.co/json/");if(p.ok){const c=await p.json();T={ip_address:c.ip||"Unknown",country:c.country_name||"Unknown",country_code:c.country_code||"Unknown",city:c.city||"Unknown"}}}catch{}await window.AnalyticsService.logSession({id:r,visitor_id:i,ip_address:T.ip_address,country:T.country,country_code:T.country_code,city:T.city,user_agent:n.userAgent,browser:n.browser,operating_system:n.os,device_type:n.deviceType,referrer:b,traffic_source:S.source,traffic_source_display:S.sourceDisplay,traffic_medium:S.medium,traffic_campaign:S.campaign,traffic_content:S.content,traffic_term:S.term,referrer_url:S.referrer,attribution_type:S.attributionType}),await window.AnalyticsService.logPageView({session_id:r,page_path:window.location.pathname||"/pages/projects/index.html",page_title:document.title||"Projects Showcase"});const h=Date.now();F=setInterval(async()=>{const p=Math.floor((Date.now()-h)/1e3);await window.AnalyticsService.pingSession(r,p)},15e3)})(),()=>{F&&clearInterval(F)}},[]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"site-bg","aria-hidden":"true",children:[e.jsx("div",{className:"light-ribbon ribbon-one"}),e.jsx("div",{className:"light-ribbon ribbon-two"}),e.jsx("div",{className:"light-ribbon ribbon-three"}),e.jsx("div",{className:"aurora"}),e.jsxs("div",{className:"particle-field",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsx("div",{className:"noise"})]}),e.jsx("header",{className:"site-header",style:{position:"fixed",top:0,width:"100%",zIndex:1e3},children:e.jsxs("nav",{className:"navbar","aria-label":"Projects showcase navigation",children:[e.jsxs("a",{className:"brand",href:s,"aria-label":"Ashok Vangapandu home",children:[e.jsx("span",{className:"brand-mark",children:"AV"}),e.jsx("span",{className:"brand-copy",children:e.jsx("span",{className:"brand-name",children:"Ashok Vangapandu"})})]}),e.jsxs("button",{className:`nav-toggle ${o?"active":""}`,type:"button","aria-label":"Open navigation","aria-expanded":o,onClick:()=>g(!o),children:[e.jsx("span",{}),e.jsx("span",{})]}),e.jsxs("div",{className:`nav-links ${o?"active":""}`,"data-nav-menu":!0,children:[e.jsx("a",{href:`${s}#expertise`,onClick:()=>g(!1),children:"Expertise"}),e.jsx("a",{href:`${s}pages/projects/index.html`,className:"active",style:{color:"var(--admin-secondary)",fontWeight:700},onClick:()=>g(!1),children:"Projects"}),e.jsx("a",{href:`${s}#behind-build`,onClick:()=>g(!1),children:"Process"}),e.jsx("a",{href:`${s}#work`,onClick:()=>g(!1),children:"Work"}),e.jsx("a",{href:`${s}widgets/index.html`,onClick:()=>g(!1),children:"Tools & Products"}),e.jsx("a",{href:`${s}certifications/index.html`,onClick:()=>g(!1),children:"Certifications"}),e.jsx("a",{href:`${s}#contact`,onClick:()=>g(!1),children:"Contact"})]})]})}),e.jsx("main",{children:e.jsx(ie,{})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            flex-direction: column;
            width: 100%;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: rgba(15, 20, 33, 0.95);
            backdrop-filter: blur(12px);
            padding: 24px;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            gap: 16px;
          }
          .nav-links.active {
            display: flex;
          }
          .nav-toggle.active span:first-child {
            transform: rotate(45deg) translate(5px, 5px);
          }
          .nav-toggle.active span:last-child {
            transform: rotate(-45deg) translate(5px, -5px);
          }
        }
      `}})]})},H=document.getElementById("root");H&&O.createRoot(H).render(e.jsx(U.StrictMode,{children:e.jsx(V,{children:e.jsx(Y,{children:e.jsx(K,{children:e.jsx(oe,{})})})})}));
