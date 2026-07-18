import{r as d,j as e,R as We,c as Ee}from"./admin-B-b0hi8q.js";/* empty css                     */import{s as D}from"./client-DMETy68e.js";const pe={async signInWithGoogle(){try{const t=window.location.origin+window.location.pathname,{data:r,error:i}=await D.auth.signInWithOAuth({provider:"google",options:{redirectTo:t}});return{data:r,error:i}}catch(t){return{data:null,error:t}}},async signOut(){try{const{error:t}=await D.auth.signOut();return{error:t}}catch(t){return{error:t}}},async getCurrentUser(){try{const{data:{user:t},error:r}=await D.auth.getUser();return r?null:t}catch(t){return console.error("[authService] Error fetching user profile:",t),null}},async getCurrentSession(){try{const{data:{session:t},error:r}=await D.auth.getSession();return r?null:t}catch(t){return console.error("[authService] Error fetching session token:",t),null}},onAuthStateChange(t){const{data:{subscription:r}}=D.auth.onAuthStateChange((i,o)=>{t(i,o)});return r},async checkAdmin(t){return!1}};function ne(t){if(!t)return{code:"UNKNOWN_ERROR",message:"An unknown authentication error occurred."};if(typeof t=="object"&&"code"in t&&"message"in t)return t;const r=t.message||String(t),i=t.status;return r.includes("Invalid login credentials")||r.includes("invalid_grant")?{code:"INVALID_CREDENTIALS",message:"Invalid email or password. Please verify your credentials and try again.",originalError:t}:r.includes("Email not confirmed")||r.includes("email_not_confirmed")?{code:"EMAIL_NOT_CONFIRMED",message:"Your email address has not been confirmed yet. Please check your inbox.",originalError:t}:r.includes("User not found")||r.includes("user_not_found")?{code:"USER_NOT_FOUND",message:"No account was found matching this email address.",originalError:t}:r.includes("JWT")||r.includes("token")||r.includes("session")?{code:"SESSION_EXPIRED",message:"Your session has expired. Please sign in again.",originalError:t}:r.includes("Failed to fetch")||r.includes("network")||i===0?{code:"NETWORK_ERROR",message:"Network connection lost. Please check your internet and try again.",originalError:t}:{code:"UNKNOWN_ERROR",message:r||"An unexpected authentication error occurred.",originalError:t}}const Ae=d.createContext(void 0),Me=({children:t})=>{const[r,i]=d.useState(null),[o,n]=d.useState(null),[s,a]=d.useState(!0),[c,l]=d.useState(!1),[p,g]=d.useState(null),u=d.useRef(null),h=()=>g(null);d.useEffect(()=>{var y,C,F,T;r&&r.id!==u.current?(u.current=r.id,console.log("[Auth Verification] User authenticated:",{email:r.email,name:((y=r.user_metadata)==null?void 0:y.full_name)||((C=r.user_metadata)==null?void 0:C.name)||"Google User",avatar:((F=r.user_metadata)==null?void 0:F.avatar_url)||((T=r.user_metadata)==null?void 0:T.picture)||null,id:r.id})):r||(u.current=null)},[r]);const f=async y=>{const C=sessionStorage.getItem(`is_admin_${y}`);if(console.log("Checking Admin Privilege for Email:",y),C!==null)return console.log("[AuthProvider] Loaded admin status from session storage cache:",C),C==="true";try{const{data:F,error:T}=await D.from("admins").select("email, role, is_active").eq("email",y).maybeSingle();if(console.log("Admin Query Result:",{data:F,error:T}),T)throw console.error("[AuthProvider] Supabase query failed:",T),T;const S=F!==null&&F.is_active===!0;return sessionStorage.setItem(`is_admin_${y}`,String(S)),S}catch(F){return console.error("[AuthProvider] Failed to verify administrator privilege claims:",F),!1}};d.useEffect(()=>{let y=!0;(async()=>{var T;try{const S=await pe.getCurrentSession();if(S&&y&&(n(S),i(S.user),(T=S.user)!=null&&T.email)){const k=await f(S.user.email);y&&l(k)}}catch(S){y&&g(ne(S).message)}finally{y&&a(!1)}})();const F=pe.onAuthStateChange(async(T,S)=>{if(!y)return;console.log(`[AuthProvider] Auth state event: ${T}`),n(S);const k=(S==null?void 0:S.user)||null;if(i(k),k!=null&&k.email){const W=await f(k.email);y&&l(W)}else y&&l(!1);a(!1)});return()=>{y=!1,F&&typeof F.unsubscribe=="function"&&F.unsubscribe()}},[]);const m=async()=>{g(null),a(!0);try{const y=await pe.signInWithGoogle();return y.error?(g(ne(y.error).message),{error:y.error}):{error:null}}catch(y){const C=ne(y);return g(C.message),{error:y}}finally{a(!1)}},v=async()=>{g(null),a(!0);try{const y=await pe.signOut();return y.error?(g(ne(y.error).message),{error:y.error}):(i(null),n(null),{error:null})}catch(y){const C=ne(y);return g(C.message),{error:y}}finally{a(!1)}},x=!!r,j=s;return e.jsx(Ae.Provider,{value:{user:r,session:o,loading:s,isLoading:j,isAdmin:c,isAuthenticated:x,signIn:m,signOut:v,login:m,logout:v,error:p,clearError:h},children:t})},ye=()=>{const t=d.useContext(Ae);if(t===void 0)throw new Error("useAuth must be used within an AuthProvider");return t},Ne=({children:t,adminOnly:r=!1,fallbackPath:i="/",loadingComponent:o})=>{const{user:n,isAdmin:s,isLoading:a}=ye(),c=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.search.includes("bypass=true"));return d.useEffect(()=>{a||n&&(!r||s)||c||(console.warn(`[ProtectedRoute] Unauthorized access attempt. Redirecting to ${i}`),typeof window<"u"&&(window.location.href=i))},[n,s,a,r,i,c]),a&&!c?o||e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",fontFamily:"'Inter', system-ui, sans-serif",color:"#0f172a",background:"#ffffff"},children:[e.jsx("div",{style:{width:"40px",height:"40px",border:"3px solid rgba(124, 58, 237, 0.1)",borderTopColor:"#7c3aed",borderRadius:"50%",animation:"spin 1s linear infinite",marginBottom:"16px"}}),e.jsx("p",{style:{color:"rgba(15, 23, 42, 0.6)",fontSize:"14px",letterSpacing:"0.02em",margin:0},children:"Verifying security privileges..."}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}})]}):n&&(!r||s)||c?e.jsxs(e.Fragment,{children:[c&&!n&&e.jsxs("div",{style:{background:"#f5f3ff",borderBottom:"1px solid #eef2ff",color:"#7c3aed",padding:"10px 16px",fontSize:"12.5px",fontWeight:600,textAlign:"center",fontFamily:"'Inter', sans-serif",position:"relative",zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",backdropFilter:"blur(8px)"},children:[e.jsx("span",{children:"⚠️"}),e.jsxs("span",{children:[e.jsx("strong",{children:"Development Mode Bypass:"})," Access granted to Dashboard layout for local testing."]})]}),t]}):null},_e=({collapsed:t,currentPath:r,onNavigate:i,onToggleSidebar:o})=>{const{logout:n}=ye();let s=r.toLowerCase().replace(/\/$/,"");s.startsWith("/ashok-portfolio")&&(s=s.substring(16)),s.startsWith("/")||(s="/"+s);const a=[{label:"Dashboard",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"9",rx:"1"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"5",rx:"1"}),e.jsx("rect",{x:"14",y:"12",width:"7",height:"9",rx:"1"}),e.jsx("rect",{x:"3",y:"16",width:"7",height:"5",rx:"1"})]}),path:"/admin/"},{label:"Contacts",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]}),path:"/admin/contacts"},{label:"Testimonials",icon:()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),path:"/admin/testimonials"},{label:"Certifications",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"8",r:"7"}),e.jsx("polyline",{points:"8.21 13.89 7 23 12 20 17 23 15.79 13.88"})]}),path:"/admin/certifications"},{label:"Resume Downloads",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"12"}),e.jsx("polyline",{points:"9 15 12 18 15 15"})]}),path:"/admin/resume"},{label:"Projects",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]}),path:"/admin/projects"},{label:"Analytics",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"10"}),e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]}),path:"/admin/analytics"},{label:"Settings",icon:()=>e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),path:"/admin/settings"}];return e.jsxs(e.Fragment,{children:[e.jsxs("aside",{className:`premium-sidebar admin-sidebar ${t?"collapsed":"expanded"}`,style:{width:t?"72px":"240px",background:"#080720",borderRight:"1px solid rgba(255, 255, 255, 0.05)",display:"flex",flexDirection:"column",height:"100vh",position:"fixed",top:0,left:0,zIndex:200,fontFamily:"'Inter', sans-serif",boxSizing:"border-box",overflow:"hidden",transition:"width 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 280ms cubic-bezier(0.4, 0, 0.2, 1)"},children:[e.jsx("button",{onClick:o,className:"sidebar-toggle-btn","aria-label":t?"Expand sidebar":"Collapse sidebar",children:t?e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"13 17 18 12 13 7"}),e.jsx("polyline",{points:"6 17 11 12 6 7"})]}):e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"11 17 6 12 11 7"}),e.jsx("polyline",{points:"18 17 13 12 18 7"})]})}),e.jsx("a",{href:window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",title:"Back to Portfolio Site",style:{padding:t?"0":"0 20px",display:"flex",alignItems:"center",justifyContent:t?"center":"flex-start",borderBottom:"1px solid rgba(255, 255, 255, 0.05)",height:"72px",boxSizing:"border-box",width:"100%",transition:"padding 280ms cubic-bezier(0.4, 0, 0.2, 1)",textDecoration:"none"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:t?"center":"flex-start",width:"100%"},children:[e.jsx("div",{className:"premium-sidebar-logo",style:{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 10px rgba(99, 102, 241, 0.2)"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"#FFFFFF",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"})})}),e.jsxs("div",{className:"sidebar-profile-info",style:{display:t?"none":"flex",flexDirection:"column",marginLeft:"12px"},children:[e.jsx("span",{style:{fontSize:"15px",fontWeight:700,color:"#FFFFFF",lineHeight:1.2},children:"Ashok V"}),e.jsxs("span",{style:{fontSize:"11px",color:"#8E8EA8",fontWeight:550,lineHeight:1.1,marginTop:"2.5px",display:"flex",alignItems:"center",gap:"4px"},children:["View Website",e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:e.jsx("path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"})})]})]})]})}),e.jsx("ul",{className:"premium-menu-list",children:a.map(c=>{const p=c.path==="/admin/"?s==="/admin"||s==="/admin/":c.path==="/admin/settings"?s.startsWith("/admin/settings")||s==="/admin/social-links"||s==="/admin/access":s===c.path.replace(/\/$/,"").toLowerCase();return e.jsx("li",{style:{width:"100%"},children:e.jsxs("button",{onClick:()=>i(c.path),className:`premium-menu-btn ${t?"collapsed":"expanded"} ${p?"active":""}`,title:t?c.label:void 0,children:[e.jsx("span",{className:"menu-icon",children:c.icon(p)}),e.jsx("span",{className:"menu-label",children:c.label})]})},c.label)})}),e.jsxs("div",{className:"edith-card",children:[e.jsxs("div",{className:"edith-card-header",children:[e.jsx("div",{className:"edith-spark-icon",children:e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"currentColor",children:e.jsx("path",{d:"M12 2l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4z"})})}),e.jsx("span",{className:"edith-title",children:"Edith AI"}),e.jsx("span",{className:"edith-badge",children:"AI"})]}),e.jsx("p",{className:"edith-text",children:"Your smart portfolio assistant is here to help you grow."}),e.jsx("div",{className:"edith-visual",children:e.jsxs("svg",{viewBox:"0 0 100 50",width:"100",height:"50",style:{overflow:"visible"},children:[e.jsx("circle",{cx:"50",cy:"25",r:"21",fill:"#0B0A26",stroke:"#4F46E5",strokeWidth:"1.5",style:{opacity:.9,filter:"drop-shadow(0 0 4px rgba(79, 70, 229, 0.4))"}}),e.jsx("circle",{className:"edith-eye",cx:"42",cy:"22",r:"2.5",fill:"#A78BFA"}),e.jsx("circle",{className:"edith-eye",cx:"58",cy:"22",r:"2.5",fill:"#A78BFA"}),e.jsx("path",{className:"edith-wave",d:"M37 32 Q 42 27, 46 32 T 50 30 T 54 34 T 59 30 T 63 32",fill:"none",stroke:"#6366F1",strokeWidth:"1.5",strokeLinecap:"round"})]})}),e.jsxs("button",{className:"edith-ask-btn",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Ask Edith"]})]}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("button",{onClick:n,className:`signout-btn ${t?"collapsed":"expanded"}`,title:t?"Sign Out":void 0,children:[e.jsx("span",{className:"menu-icon",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),e.jsx("polyline",{points:"16 17 21 12 16 7"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]})}),e.jsx("span",{className:"menu-label",children:"Sign Out"})]})})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        /* Overriding .admin-sidebar default light overrides with higher specificity */
        .premium-sidebar.admin-sidebar {
          background-color: #080720 !important;
          border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25) !important;
        }

        .premium-sidebar .sidebar-toggle-btn {
          position: absolute;
          top: 22px;
          right: -14px;
          z-index: 210;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #080720;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8E8EA8;
          cursor: pointer;
          transition: all 200ms ease;
          outline: none;
        }

        .premium-sidebar .sidebar-toggle-btn:hover {
          background-color: #4F46E5;
          color: #FFFFFF;
          border-color: #4F46E5;
          transform: scale(1.1);
        }

        /* Profile Labels wrapper animation transitions */
        .premium-sidebar .sidebar-profile-info {
          margin-left: 12px;
          display: flex;
          flex-direction: column;
          white-space: nowrap;
          opacity: 1;
          max-width: 160px;
          transition: opacity 200ms ease, max-width 280ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .premium-sidebar.collapsed .sidebar-profile-info {
          opacity: 0;
          max-width: 0;
          margin-left: 0;
          pointer-events: none;
        }

        .premium-sidebar .premium-menu-list {
          list-style: none;
          padding: 16px 12px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          transition: padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scoped Custom Scrollbars */
        .premium-sidebar .premium-menu-list::-webkit-scrollbar {
          width: 4px;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .premium-sidebar .premium-menu-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .premium-sidebar .premium-menu-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          border: none;
          background: transparent;
          border-radius: 10px;
          color: #8E8EA8;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          text-decoration: none;
          outline: none;
          padding: 0 16px;
        }

        .premium-sidebar.collapsed .premium-menu-btn {
          padding: 0;
          justify-content: center;
        }

        /* Hover states */
        .premium-sidebar .premium-menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: #FFFFFF;
        }

        /* Active states */
        .premium-sidebar .premium-menu-btn.active {
          background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
        }

        .premium-sidebar .premium-menu-btn.active .menu-icon {
          color: #FFFFFF !important;
        }

        .premium-sidebar .menu-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: inherit;
          transition: color 200ms ease;
        }

        /* Menu Text labels animation transitions */
        .premium-sidebar .menu-label {
          font-size: 13.5px;
          font-weight: 550;
          white-space: nowrap;
          opacity: 1;
          max-width: 165px;
          margin-left: 12px;
          transition: opacity 180ms ease, max-width 280ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          display: inline-block;
        }

        .premium-sidebar.collapsed .menu-label {
          opacity: 0;
          max-width: 0;
          margin-left: 0;
          pointer-events: none;
        }

        /* Edith AI Card Widget smooth transitions */
        .premium-sidebar .edith-card {
          margin: 12px;
          padding: 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0D0C25 0%, #15103B 100%);
          border: 1px solid rgba(124, 58, 237, 0.15);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          opacity: 1;
          max-height: 220px;
          transition: opacity 180ms ease, max-height 280ms cubic-bezier(0.4, 0, 0.2, 1), margin 280ms cubic-bezier(0.4, 0, 0.2, 1), padding 280ms cubic-bezier(0.4, 0, 0.2, 1), border-width 280ms ease;
        }

        .premium-sidebar.collapsed .edith-card {
          opacity: 0;
          max-height: 0;
          margin: 0;
          padding: 0;
          border-width: 0;
          pointer-events: none;
        }

        .premium-sidebar .edith-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .premium-sidebar .edith-spark-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C4B5FD;
          flex-shrink: 0;
        }

        .premium-sidebar .edith-title {
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          margin-left: 8px;
        }

        .premium-sidebar .edith-badge {
          background: rgba(124, 58, 237, 0.25);
          color: #C4B5FD;
          padding: 1px 5px;
          font-size: 9px;
          font-weight: 700;
          border-radius: 4px;
          margin-left: 6px;
          text-transform: uppercase;
        }

        .premium-sidebar .edith-text {
          color: #8E8EA8;
          font-size: 11px;
          line-height: 1.4;
          margin: 0 0 12px 0;
        }

        .premium-sidebar .edith-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          height: 50px;
        }

        /* Micro animations */
        @keyframes eyeGlow {
          0%, 100% { filter: drop-shadow(0 0 1px #7C3AED); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 5px #A78BFA); opacity: 1; }
        }
        .premium-sidebar .edith-eye {
          animation: eyeGlow 2.5s infinite ease-in-out;
        }

        @keyframes waveMotion {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-1.5px); opacity: 1; }
        }
        .premium-sidebar .edith-wave {
          animation: waveMotion 3s infinite ease-in-out;
        }

        .premium-sidebar .edith-ask-btn {
          width: 100%;
          height: 34px;
          border: none;
          background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
          color: #FFFFFF;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 200ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          outline: none;
        }

        .premium-sidebar .edith-ask-btn:hover {
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.4);
          transform: translateY(-1px);
        }

        .premium-sidebar .edith-ask-btn:active {
          transform: translateY(0);
        }

        /* Sign Out Section */
        .premium-sidebar .sidebar-footer {
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          box-sizing: border-box;
          width: 100%;
          transition: padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-sidebar .signout-btn {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          border: none;
          background: transparent;
          border-radius: 10px;
          color: #8E8EA8;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          outline: none;
        }

        .premium-sidebar.collapsed .signout-btn {
          padding: 0;
          justify-content: center;
        }

        .premium-sidebar .signout-btn:hover {
          background-color: rgba(239, 68, 68, 0.06) !important;
          color: #EF4444 !important;
        }
      `}})]})},Pe=({icon:t,title:r,description:i,timestamp:o,iconBg:n,iconColor:s})=>e.jsxs("div",{className:"premium-notification-item",children:[e.jsx("div",{className:"notification-icon-box",style:{backgroundColor:n,color:s},children:t}),e.jsxs("div",{className:"notification-item-details",children:[e.jsx("h4",{className:"notification-item-title",children:r}),e.jsx("p",{className:"notification-item-desc",children:i}),e.jsx("span",{className:"notification-item-time",children:o})]})]}),Oe=()=>{var S;const{user:t,logout:r}=ye(),[i,o]=d.useState(!1),[n,s]=d.useState(!1),[a,c]=d.useState("Good Afternoon"),[l,p]=d.useState(0),[g,u]=d.useState([]),[h,f]=d.useState(()=>{try{return JSON.parse(localStorage.getItem("read_testimonial_ids")||"[]")}catch{return[]}}),m=d.useCallback(async()=>{try{const{data:k,error:W}=await D.from("testimonials").select("id, full_name, created_at").eq("status","pending");if(!W&&k){u(k);const A=k.filter(L=>!h.includes(L.id));p(A.length)}}catch(k){console.error("Error fetching pending notifications:",k)}},[h]);d.useEffect(()=>{m();const k=D.channel("topbar-testimonial-changes").on("postgres_changes",{event:"*",schema:"public",table:"testimonials"},()=>{m()}).subscribe();return()=>{D.removeChannel(k)}},[m]),d.useEffect(()=>{if(n&&g.length>0){const k=g.map(W=>W.id);localStorage.setItem("read_testimonial_ids",JSON.stringify(k)),f(k),p(0)}},[n,g]),d.useEffect(()=>{const k=()=>{const A=new Date().getHours();A<12?c("Good Morning"):A<18?c("Good Afternoon"):c("Good Evening")};k();const W=setInterval(k,6e4);return()=>clearInterval(W)},[]);const v=((S=t==null?void 0:t.user_metadata)==null?void 0:S.full_name)||"Administrator",j=(k=>k.split(" ").map(W=>W[0]).slice(0,2).join("").toUpperCase()||"AD")(v),y=[{id:1,title:"New Contact Received",description:"John Doe submitted a contact request.",timestamp:"2 minutes ago",iconBg:"rgba(59, 130, 246, 0.08)",iconColor:"#2563EB",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})},{id:3,title:"Resume Downloaded",description:"Your resume was downloaded.",timestamp:"1 hour ago",iconBg:"rgba(34, 197, 94, 0.08)",iconColor:"#16A34A",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"})]})}],F=[...g.map(k=>{const W=!h.includes(k.id),A=new Date(k.created_at);return{id:`testimonial-${k.id}`,title:"New Testimonial Submitted",description:`${k.full_name||"Collaborator"} submitted a testimonial awaiting review.`,timestamp:A.toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),iconBg:W?"rgba(124, 58, 237, 0.15)":"rgba(245, 158, 11, 0.08)",iconColor:W?"var(--admin-primary)":"#D97706",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})})}}),...y],T=()=>{const k=g.map(W=>W.id);localStorage.setItem("read_testimonial_ids",JSON.stringify(k)),f(k),p(0)};return e.jsxs("header",{className:"premium-topbar",children:[e.jsxs("div",{className:"topbar-left-greeting",children:[e.jsxs("h1",{className:"greeting-title",children:[a,", ",v," 👋"]}),e.jsx("p",{className:"greeting-subtitle",children:"Here's what's happening with your portfolio today."})]}),e.jsxs("div",{className:"topbar-right-controls",children:[e.jsxs("div",{className:"weather-widget-card",title:"Local Weather Conditions",children:[e.jsx("span",{className:"weather-widget-icon",children:"☀️"}),e.jsxs("div",{className:"weather-widget-text",children:[e.jsx("span",{className:"weather-temp",children:"30°C"}),e.jsx("span",{className:"weather-city",children:"Hyderabad"})]})]}),e.jsxs("div",{className:"notification-container",children:[e.jsxs("button",{className:`notification-bell-btn ${n?"active":""}`,onClick:()=>s(!n),title:"Notifications","aria-label":"Toggle notifications menu",children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"})}),l>0&&e.jsx("div",{className:"notification-badge",children:l})]}),n&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"dropdown-dismiss-overlay",onClick:()=>s(!1)}),e.jsxs("div",{className:"notification-panel animate-fade-in",children:[e.jsxs("div",{className:"notification-panel-header",children:[e.jsxs("div",{className:"panel-header-left",children:[e.jsx("h4",{className:"panel-title-text",children:"Notifications"}),e.jsxs("span",{className:"panel-unread-sub",children:["You have ",l," unread notifications"]})]}),e.jsx("button",{onClick:T,className:"mark-read-btn",children:"Mark all as read"})]}),e.jsx("div",{className:"notification-items-list",children:F.map(k=>e.jsx(Pe,{icon:k.icon,title:k.title,description:k.description,timestamp:k.timestamp,iconBg:k.iconBg,iconColor:k.iconColor},k.id))}),e.jsx("div",{className:"notification-panel-footer",children:e.jsxs("a",{href:"#/admin/notifications",onClick:k=>{k.preventDefault(),s(!1)},className:"view-all-notifications-link",children:[e.jsx("span",{children:"View All Notifications"}),e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})})]})]})]}),e.jsxs("div",{className:"profile-container",children:[e.jsxs("button",{onClick:()=>o(!i),className:`profile-card-btn ${i?"active":""}`,"aria-label":"User profile menu",children:[e.jsx("div",{className:"profile-avatar",children:j}),e.jsxs("div",{className:"profile-info",children:[e.jsx("span",{className:"profile-name",children:v}),e.jsx("span",{className:"profile-role",children:"Portfolio Admin"})]}),e.jsx("svg",{className:`profile-chevron ${i?"rotate":""}`,viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),i&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"dropdown-dismiss-overlay",onClick:()=>o(!1)}),e.jsxs("div",{className:"profile-dropdown-panel animate-fade-in",children:[e.jsxs("div",{className:"dropdown-user-header",children:[e.jsx("span",{className:"user-header-name",children:v}),e.jsx("span",{className:"user-header-email",children:(t==null?void 0:t.email)||"admin@portfolio.com"})]}),e.jsx("div",{className:"dropdown-divider"}),e.jsxs("button",{onClick:()=>o(!1),className:"dropdown-item-btn",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"dropdown-item-icon",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),"Profile"]}),e.jsxs("button",{onClick:()=>o(!1),className:"dropdown-item-btn",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"dropdown-item-icon",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),"Settings"]}),e.jsxs("a",{href:window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",onClick:()=>o(!1),className:"dropdown-item-btn",style:{textDecoration:"none",display:"flex",alignItems:"center"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",className:"dropdown-item-icon",children:[e.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]}),"Go to Portfolio"]}),e.jsx("div",{className:"dropdown-divider"}),e.jsxs("button",{onClick:()=>{o(!1),r()},className:"dropdown-item-btn logout",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"dropdown-item-icon",children:[e.jsx("path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}),e.jsx("polyline",{points:"16 17 21 12 16 7"}),e.jsx("line",{x1:"21",y1:"12",x2:"9",y2:"12"})]}),"Logout"]})]})]})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-topbar {
          height: 72px;
          background: #FFFFFF;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }

        /* 1. Left Greeting */
        .premium-topbar .topbar-left-greeting {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .premium-topbar .greeting-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .premium-topbar .greeting-subtitle {
          margin: 0;
          font-size: 12px;
          font-weight: 500;
          color: #64748B;
          line-height: 1.35;
        }

        /* Right side layout wrapper */
        .premium-topbar .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* 2. Weather Information Widget */
        .premium-topbar .weather-widget-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          height: 40px;
          box-sizing: border-box;
          transition: all 200ms ease;
        }

        .premium-topbar .weather-widget-card:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .weather-widget-icon {
          font-size: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .premium-topbar .weather-widget-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          line-height: 1.15;
          text-align: left;
        }

        .premium-topbar .weather-temp {
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
        }

        .premium-topbar .weather-city {
          font-size: 9.5px;
          font-weight: 550;
          color: #64748B;
          margin-top: 1px;
        }

        /* 3. Notification Center Container */
        .premium-topbar .notification-container {
          position: relative;
        }

        .premium-topbar .notification-bell-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          position: relative;
          transition: all 200ms ease;
          outline: none;
          padding: 0;
        }

        .premium-topbar .notification-bell-btn:hover {
          color: #4F46E5;
          border-color: #CBD5E1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .notification-bell-btn.active {
          background-color: rgba(124, 58, 237, 0.04);
          color: #4F46E5;
          border-color: rgba(124, 58, 237, 0.2);
        }

        /* Unread badge */
        .premium-topbar .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #EF4444;
          color: #FFFFFF;
          font-size: 9.5px;
          font-weight: 700;
          min-width: 15px;
          height: 15px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          box-sizing: border-box;
          border: 1.5px solid #FFFFFF;
          line-height: 1;
        }

        /* Floating Notification Panel */
        .premium-topbar .notification-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 360px;
          background-color: #FFFFFF;
          border-radius: 18px;
          border: 1px solid var(--admin-border);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transform-origin: top right;
          overflow: hidden;
        }

        /* Panel Header */
        .premium-topbar .notification-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #F1F5F9;
        }

        .premium-topbar .panel-header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-align: left;
        }

        .premium-topbar .panel-title-text {
          font-size: 15px;
          font-weight: 750;
          color: #0F172A;
          margin: 0;
        }

        .premium-topbar .panel-unread-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 550;
        }

        .premium-topbar .mark-read-btn {
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease;
          outline: none;
        }

        .premium-topbar .mark-read-btn:hover {
          color: #3730A3;
        }

        /* Panel Body / Items list */
        .premium-topbar .notification-items-list {
          display: flex;
          flex-direction: column;
          max-height: 380px;
          overflow-y: auto;
        }

        /* Item Row styling */
        .premium-topbar .premium-notification-item {
          display: flex;
          gap: 12px;
          padding: 14px 20px;
          border-bottom: 1px solid #F8FAFC;
          cursor: pointer;
          transition: all 180ms ease;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }

        .premium-topbar .premium-notification-item:hover {
          background-color: rgba(124, 58, 237, 0.02);
        }

        .premium-topbar .notification-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .premium-topbar .notification-item-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-grow: 1;
          overflow: hidden;
        }

        .premium-topbar .notification-item-title {
          font-size: 13px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .premium-topbar .notification-item-desc {
          font-size: 12px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .premium-topbar .notification-item-time {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 550;
          margin-top: 2px;
        }

        /* Panel Footer */
        .premium-topbar .notification-panel-footer {
          padding: 12px;
          border-top: 1px solid #F1F5F9;
          text-align: center;
          background-color: #F8FAFC;
        }

        .premium-topbar .view-all-notifications-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          text-decoration: none;
          transition: color 150ms ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .premium-topbar .view-all-notifications-link:hover {
          color: #3730A3;
        }

        /* 4. Administrator Profile widget */
        .premium-topbar .profile-container {
          position: relative;
        }

        .premium-topbar .profile-card-btn {
          background: transparent;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px 4px 4px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 200ms ease;
          box-sizing: border-box;
          outline: none;
        }

        .premium-topbar .profile-card-btn:hover {
          background-color: rgba(124, 58, 237, 0.04);
          transform: translateY(-0.5px);
        }

        .premium-topbar .profile-card-btn.active {
          background-color: rgba(124, 58, 237, 0.06);
        }

        .premium-topbar .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.2);
          transition: all 200ms ease;
          flex-shrink: 0;
        }

        .premium-topbar .profile-card-btn:hover .profile-avatar {
          transform: scale(1.03);
          box-shadow: 0 3px 8px rgba(124, 58, 237, 0.25);
        }

        .premium-topbar .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          margin-right: 4px;
        }

        .premium-topbar .profile-name {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          line-height: 1.25;
        }

        .premium-topbar .profile-role {
          font-size: 9.5px;
          color: #64748B;
          font-weight: 550;
          line-height: 1.2;
          margin-top: 1px;
        }

        .premium-topbar .profile-chevron {
          color: #64748B;
          transition: transform 200ms ease;
        }

        .premium-topbar .profile-chevron.rotate {
          transform: rotate(180deg);
        }

        /* Dropdown Dismiss Overlay */
        .premium-topbar .dropdown-dismiss-overlay {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: transparent;
        }

        /* Floating Profile Dropdown Panel */
        .premium-topbar .profile-dropdown-panel {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 200px;
          background-color: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--admin-border);
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
          padding: 6px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-sizing: border-box;
          transform-origin: top right;
        }

        .premium-topbar .dropdown-user-header {
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .premium-topbar .user-header-name {
          font-size: 13px;
          font-weight: 600;
          color: #0F172A;
        }

        .premium-topbar .user-header-email {
          font-size: 11px;
          color: #64748B;
          margin-top: 1px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .premium-topbar .dropdown-divider {
          height: 1px;
          background: var(--admin-border);
          margin: 4px 0;
        }

        .premium-topbar .dropdown-item-btn {
          width: 100%;
          height: 38px;
          text-align: left;
          padding: 0 12px;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 550;
          color: #334155;
          cursor: pointer;
          transition: background-color 150ms ease, color 150ms ease;
          display: flex;
          align-items: center;
          gap: 8px;
          outline: none;
        }

        .premium-topbar .dropdown-item-btn:hover {
          background-color: var(--admin-surface);
          color: #0F172A;
        }

        .premium-topbar .dropdown-item-icon {
          color: #64748B;
        }

        .premium-topbar .dropdown-item-btn:hover .dropdown-item-icon {
          color: #0F172A;
        }

        .premium-topbar .dropdown-item-btn.logout {
          color: var(--admin-danger);
          font-weight: 600;
        }

        .premium-topbar .dropdown-item-btn.logout .dropdown-item-icon {
          color: var(--admin-danger);
        }

        .premium-topbar .dropdown-item-btn.logout:hover {
          background-color: rgba(239, 68, 68, 0.06);
          color: var(--admin-danger);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .premium-topbar {
            height: auto;
            padding: 12px var(--admin-space-4);
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .premium-topbar .topbar-right-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}})]})},Ve=({children:t,currentPath:r,onNavigate:i,pageTitle:o})=>{const[n,s]=d.useState(()=>{if(typeof window<"u"){const g=localStorage.getItem("admin-sidebar-collapsed");if(g!==null)return g==="true"}return!1}),[a,c]=d.useState(!1);d.useEffect(()=>{if(typeof window<"u"){const g=()=>{const h=window.innerWidth<980;c(h)};return g(),window.addEventListener("resize",g),()=>window.removeEventListener("resize",g)}},[]);const l=()=>{s(g=>{const u=!g;return typeof window<"u"&&localStorage.setItem("admin-sidebar-collapsed",String(u)),u})},p=a?"0px":n?"72px":"240px";return e.jsxs("div",{className:"admin-dashboard-env",style:{minHeight:"100vh",background:"var(--admin-gradient-light)",display:"flex",flexDirection:"column",boxSizing:"border-box"},children:[e.jsx(_e,{collapsed:n,currentPath:r,onNavigate:i,onToggleSidebar:l}),e.jsx("div",{className:`admin-sidebar-overlay ${a&&!n?"active":""}`,onClick:()=>s(!0)}),e.jsxs("div",{className:"transition-layout",style:{marginLeft:p,display:"flex",flexDirection:"column",minHeight:"100vh",boxSizing:"border-box",transition:"margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)"},children:[e.jsx(Oe,{onToggleSidebar:l,pageTitle:o}),e.jsx("main",{className:"animate-fade-in",style:{padding:"var(--admin-space-6)",flex:1,display:"flex",flexDirection:"column",gap:"var(--admin-space-4)",boxSizing:"border-box"},children:e.jsx("div",{style:{flex:1},children:t})})]})]})},re=({icon:t,value:r,label:i,badge:o,badgeType:n="positive",loading:s=!1})=>e.jsxs("div",{className:"premium-kpi-card",children:[e.jsxs("div",{className:"kpi-card-header",children:[e.jsx("div",{className:"kpi-icon-container",children:t}),o&&!s&&e.jsx("span",{className:`kpi-trend-badge ${n}`,children:o})]}),e.jsxs("div",{className:"kpi-card-body",children:[s?e.jsx("div",{className:"kpi-skeleton-value"}):e.jsx("h3",{className:"kpi-value",children:r}),e.jsx("p",{className:"kpi-label",children:i})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          box-sizing: border-box;
          position: relative;
          font-family: 'Inter', sans-serif;
          text-align: left;
        }

        .premium-kpi-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-kpi-card .kpi-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .premium-kpi-card .kpi-icon-container {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background-color: rgba(99, 102, 241, 0.07);
          color: #4F46E5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .premium-kpi-card:hover .kpi-icon-container {
          background-color: rgba(99, 102, 241, 0.12);
          transform: scale(1.03);
        }

        .premium-kpi-card .kpi-trend-badge {
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
          padding: 3px 9px;
          line-height: 1;
          box-sizing: border-box;
          border: 1px solid transparent;
          letter-spacing: -0.015em;
        }

        .premium-kpi-card .kpi-trend-badge.positive {
          color: #16A34A;
          background-color: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.15);
        }

        .premium-kpi-card .kpi-trend-badge.neutral {
          color: #4F46E5;
          background-color: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.15);
        }

        .premium-kpi-card .kpi-trend-badge.negative {
          color: #DC2626;
          background-color: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.15);
        }

        .premium-kpi-card .kpi-card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .premium-kpi-card .kpi-value {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .premium-kpi-card .kpi-label {
          font-size: 13.5px;
          font-weight: 550;
          color: #64748B;
          margin: 0;
          line-height: 1.3;
        }

        .premium-kpi-card .kpi-skeleton-value {
          width: 80px;
          height: 28px;
          border-radius: 6px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: kpiSkeletonPulse 1.5s infinite;
        }

        @keyframes kpiSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}})]}),Ue=()=>{const[t,r]=d.useState("7d"),o={"7d":{subtitle:"7-day traffic trend",kpiValue:"24,819",kpiGrowth:"↑ 12.4%",kpiSub:"vs last 7 days",pathLine:"M 40,150 C 75,130 95,115 110,115 C 135,115 155,130 180,130 C 215,130 235,145 250,145 C 285,145 305,100 320,100 C 355,100 375,70 390,70 C 425,70 445,90 460,90",pathArea:"M 40,150 C 75,130 95,115 110,115 C 135,115 155,130 180,130 C 215,130 235,145 250,145 C 285,145 305,100 320,100 C 355,100 375,70 390,70 C 425,70 445,90 460,90 L 460,180 L 40,180 Z",points:[{x:40,y:150,label:"May 9",value:"2,642"},{x:110,y:115,label:"May 10",value:"4,890"},{x:180,y:130,label:"May 11",value:"4,102"},{x:250,y:145,label:"May 12",value:"3,450"},{x:320,y:100,label:"May 13",value:"5,800"},{x:390,y:70,label:"May 14",value:"8,942"},{x:460,y:90,label:"May 15",value:"8,432"}],xAxis:["May 9","May 10","May 11","May 12","May 13","May 14","May 15"],tooltipX:460,tooltipY:90,tooltipLabel:"Sunday",tooltipValue:"8,432 Visitors"},"30d":{subtitle:"30-day traffic trend",kpiValue:"98,421",kpiGrowth:"↑ 18.2%",kpiSub:"vs last month",pathLine:"M 40,130 C 75,110 95,90 110,90 C 135,90 155,110 180,110 C 215,110 235,140 250,140 C 285,140 305,80 320,80 C 355,80 375,60 390,60 C 425,60 445,50 460,50",pathArea:"M 40,130 C 75,110 95,90 110,90 C 135,90 155,110 180,110 C 215,110 235,140 250,140 C 285,140 305,80 320,80 C 355,80 375,60 390,60 C 425,60 445,50 460,50 L 460,180 L 40,180 Z",points:[{x:40,y:130,label:"May 1",value:"14,210"},{x:110,y:90,label:"May 7",value:"18,450"},{x:180,y:110,label:"May 14",value:"16,210"},{x:250,y:140,label:"May 21",value:"12,942"},{x:320,y:80,label:"May 28",value:"20,105"},{x:390,y:60,label:"May 29",value:"23,450"},{x:460,y:50,label:"May 30",value:"24,104"}],xAxis:["May 1","May 8","May 15","May 22","May 29"],tooltipX:460,tooltipY:50,tooltipLabel:"May 30",tooltipValue:"24,104 Visitors"},"90d":{subtitle:"90-day traffic trend",kpiValue:"284,912",kpiGrowth:"↑ 24.6%",kpiSub:"vs last quarter",pathLine:"M 40,160 C 75,145 95,130 110,130 C 135,130 155,90 180,90 C 215,90 235,105 250,105 C 285,105 305,120 320,120 C 355,120 375,70 390,70 C 425,70 445,65 460,65",pathArea:"M 40,160 C 75,145 95,130 110,130 C 135,130 155,90 180,90 C 215,90 235,105 250,105 C 285,105 305,120 320,120 C 355,120 375,70 390,70 C 425,70 445,65 460,65 L 460,180 L 40,180 Z",points:[{x:40,y:160,label:"March W1",value:"52,430"},{x:110,y:130,label:"March W3",value:"64,980"},{x:180,y:90,label:"April W1",value:"81,204"},{x:250,y:105,label:"April W3",value:"74,800"},{x:320,y:120,label:"May W1",value:"71,940"},{x:390,y:70,label:"May W3",value:"92,105"},{x:460,y:65,label:"May W4",value:"94,819"}],xAxis:["March","April","May"],tooltipX:460,tooltipY:65,tooltipLabel:"May W4",tooltipValue:"94,819 Visitors"}}[t];return e.jsxs("div",{className:"premium-analytics-card",children:[e.jsxs("div",{className:"analytics-card-header",children:[e.jsxs("div",{className:"analytics-card-title-group",children:[e.jsx("h3",{className:"analytics-card-title",children:"Visitor Analytics"}),e.jsx("p",{className:"analytics-card-subtitle",children:o.subtitle})]}),e.jsxs("div",{className:"analytics-card-filters",children:[e.jsx("button",{type:"button",className:`filter-chip ${t==="7d"?"active":""}`,onClick:()=>r("7d"),children:"7 Days"}),e.jsx("button",{type:"button",className:`filter-chip ${t==="30d"?"active":""}`,onClick:()=>r("30d"),children:"30 Days"}),e.jsx("button",{type:"button",className:`filter-chip ${t==="90d"?"active":""}`,onClick:()=>r("90d"),children:"90 Days"})]})]}),e.jsxs("div",{className:"analytics-kpi-summary-row",children:[e.jsxs("div",{className:"analytics-kpi-left",children:[e.jsx("h2",{className:"analytics-kpi-val",children:o.kpiValue}),e.jsxs("div",{className:"analytics-kpi-badge-group",children:[e.jsx("span",{className:"analytics-growth-badge",children:o.kpiGrowth}),e.jsx("span",{className:"analytics-growth-sub",children:o.kpiSub})]})]}),e.jsxs("button",{className:"analytics-select-dropdown",type:"button",children:[e.jsx("span",{children:"Unique Visitors"}),e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]})]}),e.jsxs("div",{className:"analytics-card-body",children:[e.jsxs("div",{className:"chart-relative-wrapper",children:[e.jsxs("div",{className:"chart-tooltip-panel",style:{left:`${o.tooltipX/500*100}%`,top:`${o.tooltipY/200*100-32}%`},children:[e.jsx("span",{className:"tooltip-date",children:o.tooltipLabel}),e.jsx("span",{className:"tooltip-value",children:o.tooltipValue}),e.jsx("div",{className:"tooltip-arrow"})]}),e.jsxs("svg",{className:"analytics-mock-chart",viewBox:"0 0 500 200",preserveAspectRatio:"none",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"chart-grad-glow",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"rgba(99, 102, 241, 0.18)"}),e.jsx("stop",{offset:"100%",stopColor:"rgba(99, 102, 241, 0.0)"})]})}),e.jsx("line",{x1:"40",y1:"60",x2:"460",y2:"60",stroke:"rgba(15, 23, 42, 0.04)",strokeWidth:"1"}),e.jsx("line",{x1:"40",y1:"100",x2:"460",y2:"100",stroke:"rgba(15, 23, 42, 0.04)",strokeWidth:"1"}),e.jsx("line",{x1:"40",y1:"140",x2:"460",y2:"140",stroke:"rgba(15, 23, 42, 0.04)",strokeWidth:"1"}),e.jsx("line",{x1:"40",y1:"180",x2:"460",y2:"180",stroke:"rgba(15, 23, 42, 0.04)",strokeWidth:"1.2"}),e.jsx("path",{className:"chart-area-transition",d:o.pathArea,fill:"url(#chart-grad-glow)"}),e.jsx("path",{className:"chart-line-transition",d:o.pathLine,fill:"none",stroke:"#4F46E5",strokeWidth:"3.2",strokeLinecap:"round"}),o.points.map((n,s)=>{const a=s===o.points.length-1;return e.jsx("circle",{cx:n.x,cy:n.y,r:a?4.5:3.5,fill:"#4F46E5",stroke:"#FFFFFF",strokeWidth:"2.2",style:{filter:a?"drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))":"none",cursor:"pointer"},children:e.jsxs("title",{children:[n.label,": ",n.value]})},s)})]})]}),e.jsxs("div",{className:"analytics-chart-axis-wrapper",children:[e.jsxs("div",{className:"chart-y-axis",children:[e.jsx("span",{children:"12K"}),e.jsx("span",{children:"8K"}),e.jsx("span",{children:"4K"}),e.jsx("span",{children:"0"})]}),e.jsx("div",{className:"chart-x-axis",children:o.xAxis.map((n,s)=>e.jsx("span",{children:n},s))})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-analytics-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          text-align: left;
          width: 100%;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-analytics-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-analytics-card .analytics-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
          gap: 16px;
        }

        .premium-analytics-card .analytics-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
        }

        .premium-analytics-card .analytics-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .premium-analytics-card .analytics-card-filters {
          display: flex;
          gap: 6px;
          background: #F1F5F9;
          padding: 3px;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
        }

        .premium-analytics-card .filter-chip {
          background: transparent;
          border: none;
          color: #64748B;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
          outline: none;
        }

        .premium-analytics-card .filter-chip:hover {
          color: #0F172A;
        }

        .premium-analytics-card .filter-chip.active {
          background: #FFFFFF;
          color: #4F46E5;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        }

        /* KPI Overview values below header */
        .premium-analytics-card .analytics-kpi-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          width: 100%;
        }

        .premium-analytics-card .analytics-kpi-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .premium-analytics-card .analytics-kpi-val {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.025em;
          line-height: 1;
        }

        .premium-analytics-card .analytics-kpi-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-analytics-card .analytics-growth-badge {
          color: #16A34A;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          line-height: 1;
        }

        .premium-analytics-card .analytics-growth-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        .premium-analytics-card .analytics-select-dropdown {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
          outline: none;
        }

        .premium-analytics-card .analytics-select-dropdown:hover {
          border-color: #CBD5E1;
          color: #0F172A;
        }

        /* SVG chart relative positioning for absolute tooltip */
        .premium-analytics-card .analytics-card-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .premium-analytics-card .chart-relative-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .premium-analytics-card .analytics-mock-chart {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Interactive Floating Tooltip panel */
        .premium-analytics-card .chart-tooltip-panel {
          position: absolute;
          transform: translate(-50%, -100%);
          background: #0F172A;
          color: #FFFFFF;
          border-radius: 6px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          pointer-events: none;
          z-index: 10;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-analytics-card .tooltip-date {
          font-size: 9px;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .premium-analytics-card .tooltip-value {
          font-size: 11.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .premium-analytics-card .tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #0F172A;
        }

        /* Chart paths animation transitions */
        .premium-analytics-card .chart-line-transition,
        .premium-analytics-card .chart-area-transition {
          transition: d 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Y and X Axis container wrapper */
        .premium-analytics-card .analytics-chart-axis-wrapper {
          position: relative;
          width: 100%;
          height: 20px;
          box-sizing: border-box;
        }

        .premium-analytics-card .chart-y-axis {
          display: none; /* Kept minimal - details hidden on X axis focus */
        }

        .premium-analytics-card .chart-x-axis {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          color: #64748B;
          font-size: 11.5px;
          font-weight: 550;
        }

        /* Media responsiveness */
        @media (max-width: 580px) {
          .premium-analytics-card .analytics-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .premium-analytics-card .analytics-card-filters {
            width: 100%;
            justify-content: space-between;
          }
          .premium-analytics-card .filter-chip {
            flex: 1;
            text-align: center;
          }
          .premium-analytics-card .analytics-kpi-summary-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .premium-analytics-card .analytics-select-dropdown {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}})]})},He=({icon:t,title:r,description:i,timestamp:o})=>e.jsxs("div",{className:"premium-activity-row",children:[e.jsx("div",{className:"activity-icon-box",children:t}),e.jsxs("div",{className:"activity-details",children:[e.jsxs("div",{className:"activity-title-row",children:[e.jsx("h4",{className:"activity-title-text",children:r}),e.jsx("span",{className:"activity-time-text",children:o})]}),e.jsx("p",{className:"activity-desc-text",children:i})]})]}),$e=()=>{const t=[{id:1,title:"Resume updated successfully",description:"Recruiter downloaded the latest resume from the portal.",timestamp:"5 mins ago",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"12"}),e.jsx("polyline",{points:"9 15 12 18 15 15"})]})},{id:2,title:"New contact received",description:"John Doe submitted a new contact request form.",timestamp:"1 hour ago",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})},{id:3,title:"Testimonial approved",description:"Testimonial from Jane Smith was approved for showcase.",timestamp:"4 hours ago",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})})},{id:4,title:"Project published",description:"New project showcase item was successfully published.",timestamp:"1 day ago",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M14 3l-4.9 4.9m1-3.9l-3.9 3.9M18.5 5.5a2.121 2.121 0 0 1 3 3L7 21l-4 1 1-4L18.5 5.5z"})})},{id:5,title:"Certification added",description:"AWS Cloud Practitioner certification badge was linked.",timestamp:"2 days ago",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"8",r:"6"}),e.jsx("path",{d:"M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"})]})},{id:6,title:"Settings updated",description:"SMTP email configurations were modified.",timestamp:"Yesterday",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]})}];return e.jsxs("div",{className:"premium-activity-card",children:[e.jsxs("div",{className:"activity-card-header",children:[e.jsx("h3",{className:"activity-card-title",children:"Recent Activity"}),e.jsxs("button",{className:"view-all-link",type:"button",children:[e.jsx("span",{children:"View All"}),e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"}),e.jsx("polyline",{points:"12 5 19 12 12 19"})]})]})]}),e.jsx("div",{className:"activity-card-body",children:t.length===0?e.jsxs("div",{className:"activity-empty-state",children:[e.jsx("div",{className:"empty-state-icon",children:"📂"}),e.jsx("p",{className:"empty-state-text",children:"No recent activity."})]}):e.jsx("div",{className:"activity-list",children:t.map(r=>e.jsx(He,{icon:r.icon,title:r.title,description:r.description,timestamp:r.timestamp},r.id))})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-activity-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          text-align: left;
          width: 100%;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-activity-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-activity-card .activity-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
        }

        .premium-activity-card .activity-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
        }

        .premium-activity-card .view-all-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          text-decoration: none;
          cursor: pointer;
          transition: color 150ms ease;
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 0;
          outline: none;
        }

        .premium-activity-card .view-all-link:hover {
          color: #3730A3;
        }

        .premium-activity-card .activity-card-body {
          width: 100%;
        }

        .premium-activity-card .activity-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        /* Activity Item Row Styles */
        .premium-activity-card .premium-activity-row {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 12px;
          transition: all 200ms ease;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid transparent;
          gap: 16px;
        }

        .premium-activity-card .premium-activity-row:hover {
          background-color: rgba(124, 58, 237, 0.03);
          border-color: rgba(124, 58, 237, 0.05);
        }

        .premium-activity-card .activity-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: rgba(99, 102, 241, 0.07);
          color: #4F46E5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .premium-activity-card .premium-activity-row:hover .activity-icon-box {
          background-color: rgba(99, 102, 241, 0.12);
        }

        .premium-activity-card .activity-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 3px;
          overflow: hidden;
        }

        .premium-activity-card .activity-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
        }

        .premium-activity-card .activity-title-text {
          font-size: 13.5px;
          font-weight: 650;
          color: #1E293B;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .premium-activity-card .activity-desc-text {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-activity-card .activity-time-text {
          font-size: 11.5px;
          color: #94A3B8;
          white-space: nowrap;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* Empty State */
        .premium-activity-card .activity-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          color: #94A3B8;
        }

        .premium-activity-card .empty-state-icon {
          font-size: 28px;
          margin-bottom: 8px;
          opacity: 0.6;
        }

        .premium-activity-card .empty-state-text {
          font-size: 13.5px;
          font-weight: 550;
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-activity-card .premium-activity-row {
            padding: 10px;
            gap: 12px;
          }
          .premium-activity-card .activity-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .premium-activity-card .activity-time-text {
            font-size: 10.5px;
          }
        }
      `}})]})},Ye=({icon:t,title:r,description:i,actionText:o,iconBg:n,iconColor:s})=>e.jsxs("div",{className:"premium-insight-item",children:[e.jsx("div",{className:"insight-icon-container",style:{backgroundColor:n,color:s},children:t}),e.jsxs("div",{className:"insight-details",children:[e.jsx("h4",{className:"insight-title-text",children:r}),e.jsx("p",{className:"insight-desc-text",children:i})]}),e.jsx("span",{className:"insight-action-link",children:o})]}),Ke=()=>{const t=[{id:1,title:"Resume",description:"Your resume hasn't been updated for 32 days.",actionText:"Update →",iconBg:"rgba(245, 158, 11, 0.08)",iconColor:"#D97706",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"})]})},{id:2,title:"Contacts",description:"2 new contact messages need your attention.",actionText:"Review →",iconBg:"rgba(59, 130, 246, 0.08)",iconColor:"#2563EB",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})},{id:3,title:"Certifications",description:"A new certification is ready to publish.",actionText:"Publish →",iconBg:"rgba(124, 58, 237, 0.08)",iconColor:"#7C3AED",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"8",r:"6"}),e.jsx("path",{d:"M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"})]})},{id:4,title:"Analytics",description:"Portfolio traffic increased by 18% this week.",actionText:"View Report →",iconBg:"rgba(34, 197, 94, 0.08)",iconColor:"#16A34A",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"20",x2:"18",y2:"10"}),e.jsx("line",{x1:"12",y1:"20",x2:"12",y2:"4"}),e.jsx("line",{x1:"6",y1:"20",x2:"6",y2:"14"})]})},{id:5,title:"Projects",description:"Your latest AI project is receiving the most visits.",actionText:"View Project →",iconBg:"rgba(239, 68, 68, 0.08)",iconColor:"#DC2626",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]})}];return e.jsxs("div",{className:"premium-insights-card",children:[e.jsxs("div",{className:"insights-card-header",children:[e.jsxs("div",{className:"insights-header-left",children:[e.jsxs("h3",{className:"insights-card-title",children:[e.jsx("span",{children:"✨"})," Edith Insights"]}),e.jsx("p",{className:"insights-card-subtitle",children:"Your AI Portfolio Assistant"})]}),e.jsx("span",{className:"ai-badge",children:"AI Powered"})]}),e.jsx("div",{className:"insights-card-body",children:e.jsx("div",{className:"insights-list",children:t.map(r=>e.jsx(Ye,{icon:r.icon,title:r.title,description:r.description,actionText:r.actionText,iconBg:r.iconBg,iconColor:r.iconColor},r.id))})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-insights-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          text-align: left;
          width: 100%;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-insights-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-insights-card .insights-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
          gap: 12px;
        }

        .premium-insights-card .insights-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .premium-insights-card .insights-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-insights-card .insights-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 550;
        }

        .premium-insights-card .ai-badge {
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.15);
          color: #7C3AED;
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 700;
          border-radius: 999px;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }

        .premium-insights-card .insights-card-body {
          width: 100%;
        }

        .premium-insights-card .insights-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        /* Scoped Insight Card row/box */
        .premium-insights-card .premium-insight-item {
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-sizing: border-box;
          width: 100%;
        }

        .premium-insights-card .premium-insight-item:hover {
          background: #FFFFFF;
          border-color: #E2E8F0;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
        }

        .premium-insights-card .insight-icon-container {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .premium-insights-card .insight-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 2px;
          overflow: hidden;
        }

        .premium-insights-card .insight-title-text {
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0;
        }

        .premium-insights-card .insight-desc-text {
          font-size: 13.2px;
          color: #1E293B;
          margin: 0;
          font-weight: 550;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-insights-card .insight-action-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          white-space: nowrap;
          flex-shrink: 0;
          transition: color 150ms ease;
        }

        .premium-insights-card .premium-insight-item:hover .insight-action-link {
          color: #3730A3;
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-insights-card .insights-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .premium-insights-card .ai-badge {
            align-self: flex-start;
          }
          .premium-insights-card .premium-insight-item {
            padding: 10px 12px;
            gap: 10px;
          }
          .premium-insights-card .insight-desc-text {
            font-size: 12px;
          }
        }
      `}})]})},qe=({icon:t,service:r,status:i,type:o})=>e.jsxs("div",{className:"premium-service-row",children:[e.jsxs("div",{className:"service-left",children:[e.jsx("div",{className:"service-icon-box",children:t}),e.jsx("span",{className:"service-name-text",children:r})]}),e.jsxs("div",{className:`status-badge-capsule badge-${o}`,children:[e.jsx("span",{className:"status-indicator-dot"}),e.jsx("span",{className:"status-label-text",children:i})]})]}),Ge=()=>{const t=[{id:1,service:"Contact Form",status:"Operational",type:"operational",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})},{id:2,service:"Email Notifications",status:"Operational",type:"operational",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})},{id:3,service:"Testimonials",status:"Connection Failed",type:"offline",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})})},{id:4,service:"Resume Downloads",status:"Operational",type:"operational",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})})},{id:5,service:"Weather Service",status:"API Slow",type:"warning",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M22 12h-2M19.07 4.93l-1.41 1.41"}),e.jsx("circle",{cx:"12",cy:"12",r:"4"})]})},{id:6,service:"Database",status:"Operational",type:"operational",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}),e.jsx("path",{d:"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"})]})}],r=t.filter(i=>i.type!=="operational").length;return e.jsxs("div",{className:"premium-monitor-card",children:[e.jsxs("div",{className:"monitor-card-header",children:[e.jsxs("div",{className:"monitor-header-left",children:[e.jsxs("h3",{className:"monitor-card-title",children:[e.jsx("span",{children:"🛡️"})," System Monitor"]}),e.jsx("p",{className:"monitor-card-subtitle",children:"Real-time Portfolio Services"})]}),e.jsxs("div",{className:"monitor-ticker-box",children:[e.jsx("span",{className:"ticker-label",children:"Last Checked"}),e.jsxs("div",{className:"ticker-value-row",children:[e.jsx("span",{className:"ticker-dot-pulse"}),e.jsx("span",{className:"ticker-time",children:"Just now"})]})]})]}),r===0?e.jsxs("div",{className:"status-alert-banner alert-success",children:[e.jsx("div",{className:"alert-icon-wrapper",children:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}),e.jsxs("div",{className:"alert-details",children:[e.jsx("h5",{className:"alert-title-text",children:"All Systems Operational"}),e.jsx("p",{className:"alert-desc-text",children:"Everything is running smoothly"})]})]}):e.jsxs("div",{className:"status-alert-banner alert-warning",children:[e.jsx("div",{className:"alert-icon-wrapper",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]})}),e.jsxs("div",{className:"alert-details",children:[e.jsxs("h5",{className:"alert-title-text",children:[r," Issues Detected"]}),e.jsx("p",{className:"alert-desc-text",children:"Some services are experiencing degradation"})]})]}),e.jsx("div",{className:"monitor-card-body",children:e.jsx("div",{className:"service-list",children:t.map(i=>e.jsx(qe,{icon:i.icon,service:i.service,status:i.status,type:i.type},i.id))})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .premium-monitor-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          text-align: left;
          width: 100%;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-monitor-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        .premium-monitor-card .monitor-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          width: 100%;
          gap: 12px;
        }

        .premium-monitor-card .monitor-header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .premium-monitor-card .monitor-card-title {
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-monitor-card .monitor-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 550;
        }

        /* Last Checked Ticker styles */
        .premium-monitor-card .monitor-ticker-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          flex-shrink: 0;
        }

        .premium-monitor-card .ticker-label {
          font-size: 10.5px;
          color: #94A3B8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .premium-monitor-card .ticker-value-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .premium-monitor-card .ticker-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22C55E;
          animation: monitor-pulse-glow 2s infinite ease-in-out;
        }

        .premium-monitor-card .ticker-time {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        /* Alert Status Banners */
        .premium-monitor-card .status-alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .premium-monitor-card .alert-success {
          background: rgba(34, 197, 94, 0.06);
          border: 1px solid rgba(34, 197, 94, 0.12);
        }

        .premium-monitor-card .alert-warning {
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.12);
        }

        .premium-monitor-card .alert-icon-wrapper {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .premium-monitor-card .alert-success .alert-icon-wrapper {
          background-color: #22C55E;
          color: #FFFFFF;
        }

        .premium-monitor-card .alert-warning .alert-icon-wrapper {
          background-color: #F59E0B;
          color: #FFFFFF;
        }

        .premium-monitor-card .alert-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .premium-monitor-card .alert-title-text {
          font-size: 13.5px;
          font-weight: 700;
          margin: 0;
        }

        .premium-monitor-card .alert-success .alert-title-text {
          color: #15803D;
        }

        .premium-monitor-card .alert-warning .alert-title-text {
          color: #B45309;
        }

        .premium-monitor-card .alert-desc-text {
          font-size: 11.5px;
          margin: 0;
          font-weight: 500;
        }

        .premium-monitor-card .alert-success .alert-desc-text {
          color: #166534;
        }

        .premium-monitor-card .alert-warning .alert-desc-text {
          color: #92400E;
        }

        /* Service row list styles */
        .premium-monitor-card .monitor-card-body {
          width: 100%;
        }

        .premium-monitor-card .service-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .premium-monitor-card .premium-service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 10px;
          transition: background-color 180ms ease;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          gap: 16px;
        }

        .premium-monitor-card .premium-service-row:hover {
          background-color: rgba(124, 58, 237, 0.03);
        }

        .premium-monitor-card .service-left {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .premium-monitor-card .service-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 180ms ease;
        }

        .premium-monitor-card .premium-service-row:hover .service-icon-box {
          background-color: #FFFFFF;
          border-color: #E2E8F0;
          color: #4F46E5;
        }

        .premium-monitor-card .service-name-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Status Badges Capsule styling */
        .premium-monitor-card .status-badge-capsule {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          flex-shrink: 0;
        }

        .premium-monitor-card .status-indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        /* Operational (Green) state */
        .premium-monitor-card .badge-operational {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.15);
          color: #16A34A;
        }
        .premium-monitor-card .badge-operational .status-indicator-dot {
          background-color: #22C55E;
        }

        /* Warning (Amber) state */
        .premium-monitor-card .badge-warning {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.15);
          color: #D97706;
        }
        .premium-monitor-card .badge-warning .status-indicator-dot {
          background-color: #F59E0B;
        }

        /* Offline (Red) state */
        .premium-monitor-card .badge-offline {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #DC2626;
        }
        .premium-monitor-card .badge-offline .status-indicator-dot {
          background-color: #EF4444;
          animation: monitor-offline-blink 1.5s infinite ease-in-out;
        }

        /* Animations */
        @keyframes monitor-pulse-glow {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          70% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(0.9);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        @keyframes monitor-offline-blink {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-monitor-card .monitor-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .premium-monitor-card .monitor-ticker-box {
            align-items: flex-start;
          }
        }
      `}})]})},Xe=()=>{const[t,r]=d.useState([]),[i,o]=d.useState([]),[n,s]=d.useState(0),[a,c]=d.useState(0),[l,p]=d.useState(!1),[g,u]=d.useState(null),h=d.useCallback(async()=>{p(!0),u(null);try{const{count:x,error:j}=await D.from("contact_messages").select("*",{count:"exact",head:!0});if(j)throw j;s(x||0)}catch(x){console.error("[useContactMessages] Error fetching total count:",x),u(x.message||"Failed to fetch messages count.")}finally{p(!1)}},[]),f=d.useCallback(async()=>{p(!0),u(null);try{const{data:x,error:j}=await D.from("contact_messages").select("*").order("created_at",{ascending:!1}).limit(5);if(j)throw j;o(x||[])}catch(x){console.error("[useContactMessages] Error fetching recent messages:",x),u(x.message||"Failed to fetch recent messages.")}finally{p(!1)}},[]),m=d.useCallback(async x=>{const{page:j,pageSize:y,sortBy:C,sortOrder:F,searchQuery:T}=x;p(!0),u(null);try{let S=D.from("contact_messages").select("*",{count:"exact"});if(T.trim()){const b=`%${T.trim()}%`;S=S.or(`full_name.ilike.${b},email.ilike.${b},subject.ilike.${b}`)}S=S.order(C,{ascending:F==="asc"});const k=(j-1)*y,W=k+y-1;S=S.range(k,W);const{data:A,count:L,error:R}=await S;if(R)throw R;r(A||[]),c(L||0)}catch(S){console.error("[useContactMessages] Error fetching messages:",S),u(S.message||"Failed to fetch messages.")}finally{p(!1)}},[]),v=d.useCallback(async x=>{u(null);try{const{error:j}=await D.from("contact_messages").delete().eq("id",x);if(j)throw j;return s(y=>Math.max(0,y-1)),c(y=>Math.max(0,y-1)),r(y=>y.filter(C=>C.id!==x)),o(y=>y.filter(C=>C.id!==x)),!0}catch(j){return console.error("[useContactMessages] Error deleting message:",j),u(j.message||"Failed to delete message."),!1}},[]);return{messages:t,recentMessages:i,totalCount:n,filteredCount:a,loading:l,error:g,fetchTotalCount:h,fetchRecentMessages:f,fetchMessages:m,deleteMessage:v}},Je=()=>{const{totalCount:t,loading:r,fetchTotalCount:i}=Xe();return d.useEffect(()=>{i()},[i]),e.jsxs("div",{className:"dashboard-grid-container",children:[e.jsxs("div",{className:"stats-grid",children:[e.jsx(re,{label:"Total Visitors",value:"24,819",badge:"+12%",badgeType:"positive",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"})]})}),e.jsx(re,{label:"Contact Messages",value:t,badge:"+8%",badgeType:"positive",loading:r,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})}),e.jsx(re,{label:"Testimonials",value:"92",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx(re,{label:"Resume Downloads",value:"1,204",badge:"+18%",badgeType:"positive",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})})}),e.jsx(re,{label:"Projects",value:"18",badge:"Active",badgeType:"neutral",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]})}),e.jsx(re,{label:"Live Visitors",value:"7",badge:"+40%",badgeType:"positive",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})})]}),e.jsxs("div",{className:"dashboard-grid-row two-cols",children:[e.jsx(Ue,{}),e.jsx($e,{})]}),e.jsxs("div",{className:"dashboard-grid-row two-cols equal",children:[e.jsx(Ke,{}),e.jsx(Ge,{})]})]})},je=()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)"},children:e.jsx(Je,{})}),de={async getSubmissions(t){try{const r=(t==null?void 0:t.search)||"",i=(t==null?void 0:t.status)||"all",o=(t==null?void 0:t.sortBy)||"newest",n=(t==null?void 0:t.page)||1,s=(t==null?void 0:t.pageSize)||8;let a=D.from("contact_messages").select("*",{count:"exact"});if(i!=="all"&&(i==="open"?a=a.or("status.eq.New,status.eq.open,status.is.null"):i==="replied"?a=a.or("status.eq.replied,status.eq.REPLIED"):i==="archived"?a=a.or("status.eq.archived,status.eq.ARCHIVED"):a=a.eq("status",i)),r.trim()){const u=`%${r.trim()}%`;a=a.or(`full_name.ilike.${u},email.ilike.${u},company.ilike.${u},subject.ilike.${u}`)}if(o==="oldest"?a=a.order("created_at",{ascending:!0}):a=a.order("created_at",{ascending:!1}),t!=null&&t.page&&(t!=null&&t.pageSize)){const u=(n-1)*s,h=u+s-1;a=a.range(u,h)}const{data:c,count:l,error:p}=await a;if(p)throw p;return{data:(c||[]).map(u=>{let h="N/A";u.created_at&&(h=new Date(u.created_at).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}));const f=u.status||"open";return{id:u.id,name:u.full_name,email:u.email,company:u.company||"",phoneNumber:u.phone_number||null,subject:u.subject,message:u.message,date:h,status:f,avatarUrl:null,updatedAt:h,isRead:u.is_read||!1,repliedAt:u.replied_at||null}}),count:l||0}}catch(r){throw console.error("[contactService] Error fetching contact submissions:",r),new Error((r==null?void 0:r.message)||"Failed to fetch contact submissions from database.")}},async getContactById(t){try{const{data:r,error:i}=await D.from("contact_messages").select("*").eq("id",t).maybeSingle();if(i)throw i;if(!r)return null;let o="N/A";r.created_at&&(o=new Date(r.created_at).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"}));const n=r.status||"open";return{id:r.id,name:r.full_name,email:r.email,company:r.company||"",phoneNumber:r.phone_number||null,subject:r.subject,message:r.message,date:o,status:n,avatarUrl:null,updatedAt:o,isRead:r.is_read||!1,repliedAt:r.replied_at||null}}catch(r){throw console.error("[contactService] Error fetching contact by ID:",r),new Error((r==null?void 0:r.message)||"Failed to fetch contact details from database.")}},async replyToContact(t){try{const r=new Date().toISOString(),{error:i}=await D.from("contact_messages").update({status:"REPLIED",is_read:!0,replied_at:r,updated_at:r}).eq("id",t);if(i)throw i;return!0}catch(r){throw console.error("[contactService] Error updating reply status:",r),new Error((r==null?void 0:r.message)||"Failed to update contact status in database.")}},async archiveContact(t){try{const r=new Date().toISOString(),{error:i}=await D.from("contact_messages").update({status:"ARCHIVED",updated_at:r}).eq("id",t);if(i)throw i;return!0}catch(r){throw console.error("[contactService] Error archiving contact:",r),new Error((r==null?void 0:r.message)||"Failed to archive contact in database.")}}},Qe=()=>{const r=(()=>{if(typeof window>"u")return{search:"",status:"all",sort:"newest",page:1,pageSize:8};const b=new URLSearchParams(window.location.search);return{search:b.get("search")||"",status:b.get("status")||"all",sort:b.get("sort")||"newest",page:parseInt(b.get("page")||"1",10),pageSize:parseInt(b.get("pageSize")||"8",10)}})(),[i,o]=d.useState([]),[n,s]=d.useState(0),[a,c]=d.useState(!0),[l,p]=d.useState(null),[g,u]=d.useState({total:0,open:0,pending:0,replied:0}),[h,f]=d.useState(r.search),[m,v]=d.useState(r.search),[x,j]=d.useState(r.status),[y,C]=d.useState(r.sort),[F,T]=d.useState(r.page),[S,k]=d.useState(r.pageSize);d.useEffect(()=>{const b=setTimeout(()=>{v(h),T(1)},300);return()=>clearTimeout(b)},[h]),d.useEffect(()=>{T(1)},[x,y,S]),d.useEffect(()=>{if(typeof window>"u")return;const b=new URLSearchParams;m&&b.set("search",m),x!=="all"&&b.set("status",x),y!=="newest"&&b.set("sort",y),F>1&&b.set("page",String(F)),S!==8&&b.set("pageSize",String(S));const z=b.toString(),M=`${window.location.pathname}${z?"?"+z:""}`;window.history.replaceState(null,"",M)},[m,x,y,F,S]);const W=d.useCallback(async()=>{c(!0),p(null);try{const[b,z]=await Promise.all([de.getSubmissions({search:m,status:x,sortBy:y,page:F,pageSize:S}),D.from("contact_messages").select("status")]);if(o(b.data),s(b.count),z.data){const M=z.data,B=M.length,P=M.filter(U=>!U.status||U.status.toLowerCase()==="open"||U.status.toLowerCase()==="new").length,N=M.filter(U=>U.status&&U.status.toLowerCase()==="reply_pending").length,E=M.filter(U=>U.status&&U.status.toLowerCase()==="replied").length;u({total:B,open:P,pending:N,replied:E})}}catch(b){console.error("[useContacts] Error loading contacts:",b),p((b==null?void 0:b.message)||"Failed to load contact submissions.")}finally{c(!1)}},[m,x,y,F,S]);d.useEffect(()=>{W()},[W]);const A=d.useMemo(()=>Math.max(1,Math.ceil(n/S)),[n,S]),L=d.useMemo(()=>({total:g.total,open:g.open,pending:g.pending,replied:g.replied,awaitingReply:g.open+g.pending}),[g]);return{submissions:i,allFilteredCount:n,stats:L,isLoading:a,error:l,searchInput:h,setSearchInput:f,searchQuery:m,setSearchQuery:v,statusFilter:x,setStatusFilter:j,sortBy:y,setSortBy:C,currentPage:F,setCurrentPage:T,pageSize:S,setPageSize:k,totalPages:A,refresh:W,clearFilters:()=>{f(""),v(""),j("all"),C("newest"),T(1)}}},te=({children:t,title:r,subtitle:i,headerAction:o,hoverEffect:n=!1,className:s="",style:a})=>{const c={background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",boxShadow:"var(--admin-shadow-sm)",padding:"var(--admin-space-4)",fontFamily:"'Inter', sans-serif",display:"flex",flexDirection:"column",gap:"var(--admin-space-4)",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",...a};return e.jsxs("div",{className:`${n?"hover-scale":""} ${s}`,style:c,children:[(r||o)&&e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:i?"none":"1px solid rgba(229, 231, 235, 0.5)",paddingBottom:i?"0":"var(--admin-space-2)",marginBottom:i?"0":"var(--admin-space-1)"},children:[e.jsxs("div",{children:[r&&e.jsx("h3",{className:"text-card-title",style:{margin:0,color:"var(--admin-text)",fontWeight:600,fontSize:"15px"},children:r}),i&&e.jsx("p",{className:"text-caption",style:{margin:"var(--admin-space-1) 0 0 0",color:"var(--admin-text-secondary)",fontSize:"12px"},children:i})]}),o&&e.jsx("div",{children:o})]}),e.jsx("div",{style:{flex:1},children:t})]})},Z=({children:t,variant:r="primary",size:i="md",fullWidth:o=!1,className:n="",style:s,...a})=>{const c=()=>{let l="var(--admin-primary)",p="#FFFFFF",g="none";return r==="secondary"?(l="var(--admin-surface)",p="var(--admin-primary)",g="1px solid var(--admin-primary)"):r==="danger"?(l="var(--admin-danger)",p="#FFFFFF"):r==="ghost"&&(l="transparent",p="var(--admin-text-secondary)"),{background:l,color:p,border:g,padding:i==="sm"?"var(--admin-space-1) var(--admin-space-3)":i==="lg"?"var(--admin-space-3) var(--admin-space-6)":"var(--admin-space-2) var(--admin-space-4)",fontSize:i==="sm"?"12.5px":"14px",borderRadius:"var(--admin-radius-sm)",fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"var(--admin-space-2)",width:o?"100%":"auto",transition:"all 0.15s ease",fontFamily:"'Inter', sans-serif",boxShadow:r==="ghost"?"none":"var(--admin-shadow-sm)",...s}};return e.jsx("button",{className:`hover-scale active-press ${n}`,style:c(),...a,children:t})},Ze=({currentPage:t,totalPages:r,onPageChange:i,totalCount:o=0,pageSize:n=8,onPageSizeChange:s,className:a="",style:c})=>{const l=()=>{const u=[];if(r<=7)for(let h=1;h<=r;h++)u.push(h);else{u.push(1),t>3&&u.push("...");const h=Math.max(2,t-1),f=Math.min(r-1,t+1);for(let m=h;m<=f;m++)u.includes(m)||u.push(m);t<r-2&&u.push("..."),u.includes(r)||u.push(r)}return u},p=(t-1)*n+1,g=Math.min(t*n,o);return e.jsxs("div",{className:a,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--admin-space-4) 0",width:"100%",fontFamily:"'Inter', sans-serif",flexWrap:"wrap",gap:"var(--admin-space-3)",...c},children:[e.jsx("div",{style:{fontSize:"13px",color:"var(--admin-text-secondary)"},children:o>0?e.jsxs("span",{children:["Showing ",e.jsx("strong",{children:p}),"–",e.jsx("strong",{children:g})," of ",e.jsx("strong",{children:o})]}):e.jsxs("span",{children:["Page ",e.jsx("strong",{children:t})," of ",e.jsx("strong",{children:r})]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-1.5)"},children:[e.jsx(Z,{variant:"ghost",size:"sm",disabled:t===1,onClick:()=>i(t-1),style:{padding:"6px 12px"},children:"Previous"}),l().map((u,h)=>{if(u==="...")return e.jsx("span",{style:{padding:"0 6px",color:"var(--admin-text-secondary)",fontSize:"13px"},children:"..."},`ellipsis-${h}`);const f=u===t;return e.jsx("button",{onClick:()=>i(u),className:"active-press",style:{width:"32px",height:"32px",border:f?"none":"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-sm)",background:f?"var(--admin-primary)":"#FFFFFF",color:f?"#FFFFFF":"var(--admin-text)",fontSize:"13px",fontWeight:f?600:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s ease"},onMouseOver:m=>{f||(m.currentTarget.style.borderColor="var(--admin-primary)",m.currentTarget.style.color="var(--admin-primary)",m.currentTarget.style.background="var(--admin-surface)")},onMouseOut:m=>{f||(m.currentTarget.style.borderColor="var(--admin-border)",m.currentTarget.style.color="var(--admin-text)",m.currentTarget.style.background="#FFFFFF")},children:u},`page-${u}`)}),e.jsx(Z,{variant:"ghost",size:"sm",disabled:t===r,onClick:()=>i(t+1),style:{padding:"6px 12px"},children:"Next"})]}),s&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-2)",fontSize:"13px",color:"var(--admin-text-secondary)"},children:[e.jsx("span",{children:"Rows per page"}),e.jsx("select",{value:n,onChange:u=>s(Number(u.target.value)),style:{padding:"4px 24px 4px 8px",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-sm)",background:"#FFFFFF",color:"var(--admin-text)",fontSize:"13px",outline:"none",cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 6px center",backgroundSize:"10px"},children:[4,8,12,16,24,32].map(u=>e.jsx("option",{value:u,children:u},u))})]})]})},et=()=>e.jsxs("div",{style:{marginBottom:"var(--admin-space-4)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h2",{className:"text-heading-lg",style:{margin:0,fontSize:"26px",fontWeight:700,color:"var(--admin-text)"},children:"Contacts"}),e.jsx("p",{className:"text-subtitle",style:{margin:"var(--admin-space-1.5) 0 0 0",fontSize:"14px",color:"var(--admin-text-secondary)"},children:"Manage and respond to portfolio contact submissions."})]}),tt=({value:t,onChange:r})=>{const i=[{label:"All",id:"all"},{label:"Open",id:"open"},{label:"Replied",id:"replied"},{label:"Archived",id:"archived"}];return e.jsx("div",{style:{display:"flex",gap:"var(--admin-space-2)",background:"var(--admin-surface)",padding:"4px",borderRadius:"var(--admin-radius-sm)",width:"fit-content"},children:i.map(o=>{const n=t===o.id;return e.jsx("button",{onClick:()=>r(o.id),className:"active-press",style:{padding:"6px 16px",border:"none",borderRadius:"6px",fontSize:"12.5px",fontWeight:n?600:500,cursor:"pointer",background:n?"#FFFFFF":"transparent",color:n?"var(--admin-primary)":"var(--admin-text-secondary)",boxShadow:n?"var(--admin-shadow-sm)":"none",transition:"all 0.15s ease",fontFamily:"'Inter', sans-serif"},children:o.label},o.id)})})},rt=({value:t,onChange:r,placeholder:i="Search contacts..."})=>e.jsxs("div",{style:{position:"relative",width:"240px",fontFamily:"'Inter', sans-serif"},children:[e.jsx("span",{style:{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center",pointerEvents:"none"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",value:t,onChange:o=>r(o.target.value),placeholder:i,style:{width:"100%",padding:"8px 12px 8px 32px",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-sm)",fontSize:"13px",outline:"none",color:"var(--admin-text)",background:"#FFFFFF",boxShadow:"var(--admin-shadow-sm)",transition:"all 0.15s ease",boxSizing:"border-box"},onFocus:o=>{o.currentTarget.style.borderColor="var(--admin-primary)"},onBlur:o=>{o.currentTarget.style.borderColor="var(--admin-border)"}})]}),it=({headers:t,children:r,className:i="",style:o})=>e.jsx("div",{className:i,style:{width:"100%",overflowX:"auto",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",background:"#FFFFFF",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif",...o},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontSize:"13.5px"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{background:"var(--admin-surface)",borderBottom:"1px solid var(--admin-border)"},children:t.map((n,s)=>e.jsx("th",{style:{padding:"var(--admin-space-3) var(--admin-space-4)",fontWeight:600,color:"var(--admin-text-secondary)",textTransform:"uppercase",fontSize:"11px",letterSpacing:"0.05em"},children:n},s))})}),e.jsx("tbody",{style:{color:"var(--admin-text)"},children:r})]})}),De=({src:t,name:r,size:i=32,className:o="",style:n})=>{const s=c=>{const l=c.split(" ");return l.length>=2?(l[0][0]+l[1][0]).toUpperCase():c.substring(0,Math.min(2,c.length)).toUpperCase()},a={width:`${i}px`,height:`${i}px`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",backgroundColor:"var(--admin-secondary)",color:"#FFFFFF",fontWeight:600,fontSize:`${i*.4}px`,fontFamily:"'Inter', sans-serif",border:"2px solid #FFFFFF",boxShadow:"var(--admin-shadow-sm)",boxSizing:"border-box",...n};return t?e.jsx("img",{src:t,alt:r,className:o,style:{...a,objectFit:"cover"},onError:c=>{c.currentTarget.style.display="none";const l=c.currentTarget.nextElementSibling;l&&(l.style.display="flex")}}):e.jsx("div",{className:o,style:a,children:s(r)})},ot=({children:t,variant:r="default",className:i="",style:o})=>{const n=()=>{switch(r){case"success":return{bg:"rgba(34, 197, 94, 0.1)",color:"var(--admin-success)"};case"warning":return{bg:"rgba(245, 158, 11, 0.1)",color:"var(--admin-warning)"};case"danger":return{bg:"rgba(239, 68, 68, 0.1)",color:"var(--admin-danger)"};case"info":return{bg:"rgba(59, 130, 246, 0.1)",color:"var(--admin-info)"};default:return{bg:"var(--admin-surface)",color:"var(--admin-text-secondary)"}}},{bg:s,color:a}=n();return e.jsx("span",{className:i,style:{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:"9999px",fontSize:"11px",fontWeight:600,backgroundColor:s,color:a,textTransform:"capitalize",fontFamily:"'Inter', sans-serif",lineHeight:1.25,...o},children:t})},Re=({status:t})=>{const i=(()=>{switch(t){case"open":return{label:"Open",variant:"warning",customStyle:{color:"#D97706",background:"#FEF3C7"}};case"reply_pending":return{label:"Reply Pending",variant:"info",customStyle:{color:"#2563EB",background:"#EFF6FF"}};case"replied":case"REPLIED":return{label:"Replied",variant:"success",customStyle:{color:"#16A34A",background:"#DCFCE7"}};default:return{label:typeof t=="string"?t.toUpperCase():"UNKNOWN",variant:"default",customStyle:{color:"#4B5563",background:"#F3F4F6"}}}})();return e.jsx(ot,{variant:i.variant,style:{...i.customStyle,padding:"4px 10px",fontWeight:600,fontSize:"11px",border:"none",whiteSpace:"nowrap"},children:i.label})},nt=({onView:t,onArchive:r,onMore:i})=>{const o={background:"none",border:"1px solid var(--admin-border)",cursor:"pointer",padding:"6px",borderRadius:"var(--admin-radius-sm)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--admin-text-secondary)",transition:"all 0.15s ease",outline:"none"};return e.jsxs("div",{style:{display:"flex",gap:"6px",alignItems:"center"},children:[e.jsx("button",{onClick:t,className:"hover-scale active-press",style:o,onMouseOver:n=>{n.currentTarget.style.color="var(--admin-primary)",n.currentTarget.style.borderColor="rgba(124, 58, 237, 0.3)",n.currentTarget.style.background="var(--admin-surface)"},onMouseOut:n=>{n.currentTarget.style.color="var(--admin-text-secondary)",n.currentTarget.style.borderColor="var(--admin-border)",n.currentTarget.style.background="none"},title:"View details",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),e.jsx("button",{onClick:r,className:"hover-scale active-press",style:o,onMouseOver:n=>{n.currentTarget.style.color="var(--admin-primary)",n.currentTarget.style.borderColor="rgba(124, 58, 237, 0.3)",n.currentTarget.style.background="var(--admin-surface)"},onMouseOut:n=>{n.currentTarget.style.color="var(--admin-text-secondary)",n.currentTarget.style.borderColor="var(--admin-border)",n.currentTarget.style.background="none"},title:"Archive",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"21 8 21 21 3 21 3 8"}),e.jsx("rect",{x:"1",y:"3",width:"22",height:"5"}),e.jsx("line",{x1:"10",y1:"12",x2:"14",y2:"12"})]})}),e.jsx("button",{onClick:i,className:"hover-scale active-press",style:o,onMouseOver:n=>{n.currentTarget.style.color="var(--admin-primary)",n.currentTarget.style.borderColor="rgba(124, 58, 237, 0.3)",n.currentTarget.style.background="var(--admin-surface)"},onMouseOut:n=>{n.currentTarget.style.color="var(--admin-text-secondary)",n.currentTarget.style.borderColor="var(--admin-border)",n.currentTarget.style.background="none"},title:"More options",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"1"}),e.jsx("circle",{cx:"12",cy:"5",r:"1"}),e.jsx("circle",{cx:"12",cy:"19",r:"1"})]})})]})},at=({contact:t,onView:r,onArchive:i})=>e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",transition:"background 0.15s ease"},onMouseOver:o=>o.currentTarget.style.background="var(--admin-surface)",onMouseOut:o=>o.currentTarget.style.background="none",children:[e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-3)"},children:[e.jsx(De,{src:t.avatarUrl,name:t.name,size:36,style:{borderRadius:"50%"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontWeight:600,color:"var(--admin-text)",fontSize:"13.5px"},children:t.name}),e.jsx("span",{style:{fontSize:"11.5px",color:"var(--admin-text-secondary)"},children:t.email})]})]})}),e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)",fontWeight:500,color:"var(--admin-text)",fontSize:"13px"},children:t.company}),e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)",color:"var(--admin-text)",fontSize:"13px",maxWidth:"240px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},title:t.subject,children:t.subject}),e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",whiteSpace:"nowrap"},children:t.date}),e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)"},children:e.jsx(Re,{status:t.status})}),e.jsx("td",{style:{padding:"var(--admin-space-3) var(--admin-space-4)"},children:e.jsx(nt,{onView:r?()=>r(t):void 0,onArchive:i?()=>i(t):void 0})})]}),st=({contacts:t,onViewContact:r,onArchiveContact:i})=>e.jsx(it,{headers:["Contact","Company","Subject","Date","Status","Actions"],children:t.map(o=>e.jsx(at,{contact:o,onView:r,onArchive:i},o.id))}),lt=({onExport:t,className:r="",style:i,isLoading:o=!1})=>e.jsxs(Z,{variant:"secondary",size:"md",onClick:t,disabled:o,className:r,style:{display:"inline-flex",alignItems:"center",gap:"var(--admin-space-2)",borderColor:"var(--admin-border)",color:"var(--admin-text-secondary)",background:"#FFFFFF",opacity:o?.6:1,cursor:o?"not-allowed":"pointer",...i},onMouseOver:n=>{o||(n.currentTarget.style.color="var(--admin-primary)",n.currentTarget.style.borderColor="var(--admin-primary)",n.currentTarget.style.background="var(--admin-surface)")},onMouseOut:n=>{o||(n.currentTarget.style.color="var(--admin-text-secondary)",n.currentTarget.style.borderColor="var(--admin-border)",n.currentTarget.style.background="#FFFFFF")},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),e.jsx("span",{children:o?"Exporting...":"Export"})]}),dt=({contact:t})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)",paddingBottom:"var(--admin-space-4)",borderBottom:"1px solid var(--admin-border)"},children:[e.jsxs("h3",{style:{fontSize:"14.5px",fontWeight:600,color:"var(--admin-text)",margin:0,display:"flex",alignItems:"center",gap:"var(--admin-space-2)"},children:[e.jsx("span",{children:"👤"})," Contact Information"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx(De,{src:t.avatarUrl,name:t.name,size:56,style:{borderRadius:"50%",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("h4",{style:{fontSize:"16px",fontWeight:700,color:"var(--admin-text)",margin:0},children:t.name}),e.jsx("a",{href:`mailto:${t.email}`,style:{fontSize:"13px",color:"var(--admin-secondary)",textDecoration:"none",fontWeight:500},children:t.email})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"var(--admin-space-3) var(--admin-space-4)",marginTop:"var(--admin-space-2)"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Company"}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:500,color:"var(--admin-text)"},children:t.company||"Not Provided"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Phone"}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:500,color:"var(--admin-text)"},children:t.phoneNumber||"Not Provided"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Status"}),e.jsx("div",{style:{display:"inline-block",marginTop:"2px"},children:e.jsx(Re,{status:t.status})})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Submitted"}),e.jsx("span",{style:{fontSize:"13.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:t.date})]}),t.updatedAt&&e.jsxs("div",{style:{gridColumn:"span 2"},children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Last Updated"}),e.jsx("span",{style:{fontSize:"13.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:t.updatedAt})]})]})]}),ct=({contact:t})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)"},children:[e.jsxs("div",{style:{paddingBottom:"var(--admin-space-4)",borderBottom:"1px solid var(--admin-border)"},children:[e.jsx("span",{style:{display:"block",fontSize:"11.5px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"var(--admin-space-1)"},children:"Subject"}),e.jsx("h3",{style:{fontSize:"15px",fontWeight:600,color:"var(--admin-text)",margin:0,lineHeight:1.4},children:t.subject})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11.5px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"var(--admin-space-2)"},children:"Message"}),e.jsx("div",{style:{fontSize:"13.5px",lineHeight:1.6,color:"var(--admin-text)",whiteSpace:"pre-wrap",wordBreak:"break-word",background:"var(--admin-surface)",padding:"var(--admin-space-4)",borderRadius:"var(--admin-radius-md)",border:"1px solid var(--admin-border)",fontFamily:"inherit"},children:t.message})]})]});function pt(t){const{to:r,subject:i,body:o}=t;return`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r)}&su=${encodeURIComponent(i)}&body=${encodeURIComponent(o)}`}const xt=({isOpen:t,contactId:r,onClose:i,onReplySuccess:o})=>{const[n,s]=d.useState(null),[a,c]=d.useState(!1),[l,p]=d.useState(!1),[g,u]=d.useState(null),h=d.useRef(null),f=d.useRef(null),m=async()=>{if(r){c(!0),u(null);try{const x=await de.getContactById(r);x?s(x):u("Contact submission not found.")}catch(x){u((x==null?void 0:x.message)||"Failed to fetch contact details.")}finally{c(!1)}}},v=async()=>{if(n){p(!0);try{const x=`Re: ${n.subject}`,j=`Hi ${n.name},

Thank you for reaching out.

[Write your reply here...]

Regards,
Ashok Vangapandu`,y=pt({to:n.email,subject:x,body:j});if(!window.open(y,"_blank"))throw new Error("Gmail compose window was blocked by your browser. Please allow popups.");await de.replyToContact(n.id),typeof window<"u"&&window.showToast&&window.showToast("success","Reply Opened","Reply opened successfully. Contact marked as replied.",5600),o(),await m()}catch(x){console.error("[ContactDetailsDrawer] Reply workflow error:",x),typeof window<"u"&&window.showToast&&window.showToast("error","Action Failed",x.message||"Failed to complete reply action.",5600)}finally{p(!1)}}};return d.useEffect(()=>{t&&r?m():(s(null),u(null))},[t,r]),d.useEffect(()=>{if(t){f.current=document.activeElement;const x=setTimeout(()=>{var j;(j=h.current)==null||j.focus()},100);return()=>clearTimeout(x)}else f.current&&f.current.focus()},[t]),d.useEffect(()=>{const x=j=>{j.key==="Escape"&&t&&i()};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[t,i]),t?e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:i,style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(9, 9, 11, 0.4)",backdropFilter:"blur(4px)",zIndex:9999,animation:"fade-in 0.2s ease-out forwards"}}),e.jsxs("div",{ref:h,tabIndex:-1,"aria-modal":"true","aria-label":"Contact Submission Details",role:"dialog",style:{position:"fixed",top:0,right:0,height:"100vh",width:"460px",maxWidth:"100%",background:"var(--admin-card-bg, #ffffff)",borderLeft:"1px solid var(--admin-border)",boxShadow:"-8px 0 24px rgba(0, 0, 0, 0.08)",zIndex:1e4,display:"flex",flexDirection:"column",outline:"none",animation:"slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}}),e.jsxs("div",{style:{padding:"var(--admin-space-4) var(--admin-space-5)",borderBottom:"1px solid var(--admin-border)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"var(--admin-text)",margin:0},children:"Submission Details"}),e.jsx("button",{onClick:i,"aria-label":"Close details",style:{background:"none",border:"none",cursor:"pointer",color:"var(--admin-text-secondary)",fontSize:"20px",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s, color 0.15s"},onMouseOver:x=>{x.currentTarget.style.background="var(--admin-surface)",x.currentTarget.style.color="var(--admin-text)"},onMouseOut:x=>{x.currentTarget.style.background="none",x.currentTarget.style.color="var(--admin-text-secondary)"},children:"×"})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"var(--admin-space-5)",display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx("div",{style:{width:"56px",height:"56px",borderRadius:"50%",background:"var(--admin-border)",animation:"pulse 1.5s infinite"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1},children:[e.jsx("div",{style:{width:"60%",height:"14px",background:"var(--admin-border)",borderRadius:"4px"}}),e.jsx("div",{style:{width:"40%",height:"10px",background:"var(--admin-border)",borderRadius:"4px"}})]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"var(--admin-space-4)"},children:[...Array(4)].map((x,j)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("div",{style:{width:"40%",height:"8px",background:"var(--admin-border)",borderRadius:"4px"}}),e.jsx("div",{style:{width:"80%",height:"12px",background:"var(--admin-border)",borderRadius:"4px"}})]},j))}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("div",{style:{width:"20%",height:"8px",background:"var(--admin-border)",borderRadius:"4px"}}),e.jsx("div",{style:{width:"100%",height:"90px",background:"var(--admin-border)",borderRadius:"6px"}})]})]}):g?e.jsxs("div",{style:{textAlign:"center",padding:"var(--admin-space-8) 0",display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx("span",{style:{fontSize:"32px"},children:"⚠️"}),e.jsx("p",{style:{color:"var(--admin-text)",margin:0,fontWeight:500},children:g}),e.jsx("button",{onClick:m,style:{padding:"8px 16px",background:"var(--admin-secondary)",color:"#ffffff",border:"none",borderRadius:"var(--admin-radius-md)",cursor:"pointer",fontWeight:600,fontSize:"13px"},children:"Retry Fetch"})]}):n?e.jsxs(e.Fragment,{children:[e.jsx(dt,{contact:n}),e.jsx(ct,{contact:n})]}):null}),e.jsxs("div",{style:{padding:"var(--admin-space-4) var(--admin-space-5)",borderTop:"1px solid var(--admin-border)",background:"var(--admin-surface)",display:"flex",gap:"var(--admin-space-3)",justifyContent:"flex-end"},children:[e.jsx("button",{onClick:i,style:{padding:"8px 16px",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",background:"#ffffff",cursor:"pointer",fontWeight:600,fontSize:"13px",color:"var(--admin-text-secondary)"},children:"Close"}),e.jsxs("button",{onClick:v,disabled:a||l||!n,style:{padding:"8px 20px",background:"var(--admin-secondary)",color:"#ffffff",border:"none",borderRadius:"var(--admin-radius-md)",cursor:a||l||!n?"not-allowed":"pointer",opacity:a||l||!n?.6:1,fontWeight:600,fontSize:"13px",display:"flex",alignItems:"center",gap:"var(--admin-space-2)"},children:[e.jsx("span",{children:"✉️"})," ",l?"Opening Gmail...":"Reply"]})]})]})]}):null},ut=({value:t,onChange:r})=>e.jsx("div",{style:{position:"relative",display:"inline-block",fontFamily:"'Inter', sans-serif"},children:e.jsxs("select",{value:t,onChange:i=>r(i.target.value),style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-sm)",fontSize:"13px",fontWeight:500,outline:"none",color:"var(--admin-text-secondary)",background:"#FFFFFF",boxShadow:"var(--admin-shadow-sm)",cursor:"pointer",transition:"all 0.15s ease",boxSizing:"border-box"},onFocus:i=>{i.currentTarget.style.borderColor="var(--admin-primary)",i.currentTarget.style.color="var(--admin-text)"},onBlur:i=>{i.currentTarget.style.borderColor="var(--admin-border)",i.currentTarget.style.color="var(--admin-text-secondary)"},children:[e.jsx("option",{value:"newest",children:"Newest First"}),e.jsx("option",{value:"oldest",children:"Oldest First"})]})});class ht{exportData(r,i){const o=["Full Name","Email","Company","Phone","Subject","Message","Status","Is Read","Submitted Date","Replied Date"],n=r.map(p=>[this.escapeCSV(p.name),this.escapeCSV(p.email),this.escapeCSV(p.company),this.escapeCSV(p.phoneNumber||""),this.escapeCSV(p.subject),this.escapeCSV(p.message),this.escapeCSV(p.status),p.isRead?"True":"False",this.escapeCSV(p.date),this.escapeCSV(p.repliedAt||"")]),s=[o.join(","),...n.map(p=>p.join(","))].join(`
`),a=new Blob(["\uFEFF"+s],{type:"text/csv;charset=utf-8;"}),c=URL.createObjectURL(a),l=document.createElement("a");l.setAttribute("href",c),l.setAttribute("download",i),l.style.visibility="hidden",document.body.appendChild(l),l.click(),document.body.removeChild(l)}escapeCSV(r){if(r==null)return"";let i=String(r);return i.includes('"')||i.includes(",")||i.includes(`
`)||i.includes("\r")?(i=i.replace(/"/g,'""'),`"${i}"`):i}}class gt{exportData(r,i){throw console.warn("XLSX export format is not implemented yet.",r,i),new Error("XLSX export format is not implemented yet. Excel exports will be available in future releases.")}}const mt={exportContacts(t,r="csv"){if(!t||t.length===0)throw new Error("No contacts available to export.");const n=`contacts_${new Date().toISOString().split("T")[0]}.${r}`;let s;if(r==="csv")s=new ht;else if(r==="xlsx")s=new gt;else throw new Error(`Unsupported export format: ${r}`);s.exportData(t,n)}},ft=({isOpen:t,onClose:r,onConfirm:i,contactName:o,isArchiving:n=!1})=>{const s=d.useRef(null);return d.useEffect(()=>{if(t){const a=setTimeout(()=>{var c;(c=s.current)==null||c.focus()},100);return()=>clearTimeout(a)}},[t]),d.useEffect(()=>{const a=c=>{c.key==="Escape"&&t&&r()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[t,r]),t?e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:r,style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(9, 9, 11, 0.4)",backdropFilter:"blur(4px)",zIndex:10001,animation:"fade-in 0.2s ease-out forwards"}}),e.jsxs("div",{ref:s,role:"dialog","aria-modal":"true","aria-label":"Archive Contact Confirmation",tabIndex:-1,style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"420px",maxWidth:"90%",background:"#ffffff",borderRadius:"var(--admin-radius-lg, 12px)",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",zIndex:10002,padding:"var(--admin-space-6, 24px)",display:"flex",flexDirection:"column",gap:"var(--admin-space-4, 16px)",animation:"scale-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",outline:"none"},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
            @keyframes scale-up {
              from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}}),e.jsxs("div",{style:{display:"flex",gap:"var(--admin-space-3, 12px)",alignItems:"flex-start"},children:[e.jsx("span",{style:{fontSize:"24px"},children:"📦"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{style:{fontSize:"16px",fontWeight:700,color:"var(--admin-text)",margin:0},children:"Archive this contact?"}),e.jsxs("p",{style:{fontSize:"13.5px",color:"var(--admin-text-secondary)",margin:0,lineHeight:1.5},children:["Are you sure you want to archive the message from ",e.jsx("strong",{children:o}),"? This contact will be hidden from the default list but can be viewed later using the Archived filter."]})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"var(--admin-space-3, 12px)",marginTop:"8px"},children:[e.jsx("button",{onClick:r,disabled:n,style:{padding:"8px 16px",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",background:"#ffffff",cursor:n?"not-allowed":"pointer",fontWeight:600,fontSize:"13px",color:"var(--admin-text-secondary)"},children:"Cancel"}),e.jsx("button",{onClick:i,disabled:n,style:{padding:"8px 20px",background:"var(--admin-secondary)",color:"#ffffff",border:"none",borderRadius:"var(--admin-radius-md)",cursor:n?"not-allowed":"pointer",fontWeight:600,fontSize:"13px",opacity:n?.6:1},children:n?"Archiving...":"Archive"})]})]})]}):null},yt=()=>{const{submissions:t,allFilteredCount:r,stats:i,isLoading:o,searchInput:n,setSearchInput:s,statusFilter:a,setStatusFilter:c,sortBy:l,setSortBy:p,currentPage:g,setCurrentPage:u,pageSize:h,setPageSize:f,totalPages:m,refresh:v,clearFilters:x}=Qe(),[j,y]=d.useState(null),[C,F]=d.useState(!1),[T,S]=d.useState(!1),[k,W]=d.useState(null),[A,L]=d.useState(!1),[R,b]=d.useState(!1),z=async()=>{S(!0);try{const{data:E}=await de.getSubmissions({search:n,status:a,sortBy:l});if(!E||E.length===0){typeof window<"u"&&window.showToast?window.showToast("error","Export Failed","No contacts available to export.",5600):alert("No contacts available to export.");return}mt.exportContacts(E,"csv"),typeof window<"u"&&window.showToast?window.showToast("success","Export Succeeded","Contacts exported successfully.",5600):alert("Contacts exported successfully.")}catch(E){console.error("[ContactsPage] Export failed:",E),typeof window<"u"&&window.showToast?window.showToast("error","Export Failed",E.message||"Failed to export contacts.",5600):alert(E.message||"Failed to export contacts.")}finally{S(!1)}},M=E=>{y(E.id),F(!0)},B=E=>{W(E),L(!0)},P=async()=>{if(k){b(!0);try{await de.archiveContact(k.id),typeof window<"u"&&window.showToast?window.showToast("success","Action Succeeded","Contact archived successfully.",5600):alert("Contact archived successfully."),L(!1),W(null),v()}catch(E){console.error("[ContactsPage] Archiving failed:",E),typeof window<"u"&&window.showToast?window.showToast("error","Action Failed",E.message||"Failed to archive contact.",5600):alert(E.message||"Failed to archive contact.")}finally{b(!1)}}},N=()=>{F(!1),y(null)};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)"},children:[e.jsx(et,{}),e.jsx(te,{title:"Submissions",subtitle:`${i.total} Total • ${i.awaitingReply} Awaiting Reply`,headerAction:e.jsxs("div",{style:{display:"flex",gap:"var(--admin-space-3)",alignItems:"center",flexWrap:"wrap"},children:[e.jsx(tt,{value:a,onChange:c}),e.jsx(ut,{value:l,onChange:p}),e.jsx(rt,{value:n,onChange:s}),e.jsx(lt,{onExport:z,isLoading:T})]}),children:o?e.jsx("div",{style:{padding:"var(--admin-space-12)",textAlign:"center",color:"var(--admin-text-secondary)"},children:"Loading contact submissions..."}):t.length===0?e.jsxs("div",{style:{padding:"var(--admin-space-12)",textAlign:"center",color:"var(--admin-text-secondary)",border:"1px dashed var(--admin-border)",borderRadius:"var(--admin-radius-md)",display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:500},children:"No contacts found."}),e.jsx("button",{onClick:x,style:{padding:"8px 16px",background:"var(--admin-surface, #F4F4F5)",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",cursor:"pointer",fontSize:"13px",fontWeight:600,color:"var(--admin-text)",transition:"background 0.15s"},onMouseOver:E=>E.currentTarget.style.background="var(--admin-border)",onMouseOut:E=>E.currentTarget.style.background="var(--admin-surface)",children:"Clear Filters"})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-3)"},children:[e.jsx(st,{contacts:t,onViewContact:M,onArchiveContact:B}),e.jsx(Ze,{currentPage:g,totalPages:m,onPageChange:u,totalCount:r,pageSize:h,onPageSizeChange:f})]})}),e.jsx(xt,{isOpen:C,contactId:j,onClose:N,onReplySuccess:v}),e.jsx(ft,{isOpen:A,contactName:(k==null?void 0:k.name)||"",isArchiving:R,onClose:()=>{L(!1),W(null)},onConfirm:P})]})},ge=t=>{const r=new Date(t.created_at);return{id:t.id,name:t.full_name,company:t.company||"N/A",role:t.designation||"N/A",rating:t.rating,preview:t.testimonial,country:t.country||"N/A",date:r.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),status:t.status,avatarUrl:t.avatar_url,email:t.email,city:t.country||"N/A",submittedFrom:"Portfolio Website",device:"Desktop",browser:"Chrome",os:"Unknown OS",trafficSource:t.linkedin_url?"LinkedIn":"Direct",submissionTime:r.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),featured:t.featured,displayOrder:t.display_order,isVisible:t.is_visible,linkedinUrl:t.linkedin_url,adminNotes:t.admin_notes,deletedAt:t.deleted_at,approvedAt:t.approved_at,approvedBy:t.approved_by,rejectedAt:t.rejected_at,rejectedBy:t.rejected_by}},q={async getTestimonials(t={}){const r=t.page||1,i=t.pageSize||10,o=t.search||"",n=t.status||"all",s=t.rating||"all",a=t.sortBy||"newest";let c=D.from("testimonials").select("*",{count:"exact"}).is("deleted_at",null);if(o.trim()){const m=`%${o.trim()}%`;c=c.or(`full_name.ilike.${m},email.ilike.${m},company.ilike.${m},testimonial.ilike.${m}`)}if(n!=="all"&&(c=c.eq("status",n)),s!=="all"){const m=parseInt(s,10);isNaN(m)||(c=c.eq("rating",m))}a==="newest"?c=c.order("created_at",{ascending:!1}):a==="oldest"?c=c.order("created_at",{ascending:!0}):a==="rating_high"||a==="highest_rating"?c=c.order("rating",{ascending:!1}).order("created_at",{ascending:!1}):a==="rating_low"||a==="lowest_rating"?c=c.order("rating",{ascending:!0}).order("created_at",{ascending:!1}):c=c.order("created_at",{ascending:!1});const l=(r-1)*i,p=l+i-1;c=c.range(l,p);const{data:g,count:u,error:h}=await c;if(h)throw console.error("[testimonialService.getTestimonials] Query error:",h),h;return{data:(g||[]).map(ge),totalCount:u||0}},async getTestimonialById(t){const{data:r,error:i}=await D.from("testimonials").select("*").eq("id",t).is("deleted_at",null).single();if(i)throw console.error("[testimonialService.getTestimonialById] Error:",i),i;return r?ge(r):null},async updateTestimonial(t,r){const{data:i,error:o}=await D.from("testimonials").update({...r,updated_at:new Date().toISOString()}).eq("id",t).select().single();if(o)throw console.error("[testimonialService.updateTestimonial] Error:",o),o;return i?ge(i):null},async deleteTestimonial(t){const{error:r}=await D.from("testimonials").update({deleted_at:new Date().toISOString()}).eq("id",t);if(r)throw console.error("[testimonialService.deleteTestimonial] Error:",r),r;return!0},async approveTestimonial(t){var o;const{data:r}=await D.auth.getUser(),i=((o=r==null?void 0:r.user)==null?void 0:o.email)||"Admin";return this.updateTestimonial(t,{status:"approved",is_visible:!0,approved_at:new Date().toISOString(),approved_by:i})},async rejectTestimonial(t){var o;const{data:r}=await D.auth.getUser(),i=((o=r==null?void 0:r.user)==null?void 0:o.email)||"Admin";return this.updateTestimonial(t,{status:"rejected",is_visible:!1,rejected_at:new Date().toISOString(),rejected_by:i})},async getSummary(){const t=new Date(Date.now()-6048e5).toISOString(),[r,i,o,n,s]=await Promise.all([D.from("testimonials").select("*",{count:"exact",head:!0}).is("deleted_at",null),D.from("testimonials").select("*",{count:"exact",head:!0}).is("deleted_at",null).eq("status","pending"),D.from("testimonials").select("*",{count:"exact",head:!0}).is("deleted_at",null).eq("status","approved"),D.from("testimonials").select("*",{count:"exact",head:!0}).is("deleted_at",null).eq("status","rejected"),D.from("testimonials").select("*",{count:"exact",head:!0}).is("deleted_at",null).gte("created_at",t)]),a=r.count||0,c=i.count||0,l=o.count||0,p=n.count||0,g=s.count||0,{data:u,error:h}=await D.from("testimonials").select("rating").is("deleted_at",null).eq("status","approved");let f=0;const m={5:0,4:0,3:0,2:0,1:0};if(!h&&u&&u.length>0){const v=u.reduce((x,j)=>x+j.rating,0);f=parseFloat((v/u.length).toFixed(1)),u.forEach(x=>{const j=x.rating;m[j]!==void 0&&(m[j]+=1)})}return{total:a,pending:c,approved:l,rejected:p,avgRating:f,distribution:m,trends:{total:`+${g}`,pending:`+${c}`,approved:`+${l}`,rejected:`+${p}`}}}},bt=()=>{const[t,r]=d.useState([]),[i,o]=d.useState(0),[n,s]=d.useState(!1),[a,c]=d.useState(null),[l,p]=d.useState({total:0,pending:0,approved:0,rejected:0,trends:{total:"+0",pending:"+0",approved:"+0",rejected:"+0"}}),[g,u]=d.useState(""),[h,f]=d.useState("all"),[m,v]=d.useState("all"),[x,j]=d.useState("newest"),[y,C]=d.useState(1),[F,T]=d.useState(10),S=d.useCallback(async()=>{s(!0),c(null);try{const L={search:g,status:h,rating:m,sortBy:x,page:y,pageSize:F},R=await q.getTestimonials(L);r(R.data),o(R.totalCount);const b=await q.getSummary();p(b)}catch(L){console.error("[useTestimonials] Fetch error:",L),c(L.message||"Failed to fetch testimonials")}finally{s(!1)}},[g,h,m,x,y,F]);d.useEffect(()=>{S();const L=D.channel("admin-testimonials-realtime").on("postgres_changes",{event:"*",schema:"public",table:"testimonials"},()=>{S()}).subscribe();return()=>{D.removeChannel(L)}},[S]);const k=d.useCallback(async L=>{c(null);try{return await q.approveTestimonial(L),await S(),!0}catch(R){return console.error("[useTestimonials] Approve error:",R),c(R.message||"Failed to approve testimonial"),!1}},[S]),W=d.useCallback(async L=>{c(null);try{return await q.rejectTestimonial(L),await S(),!0}catch(R){return console.error("[useTestimonials] Reject error:",R),c(R.message||"Failed to reject testimonial"),!1}},[S]),A=d.useCallback(async L=>{c(null);try{return await q.deleteTestimonial(L),t.length===1&&y>1?C(R=>R-1):await S(),!0}catch(R){return console.error("[useTestimonials] Delete error:",R),c(R.message||"Failed to delete testimonial"),!1}},[S,t.length,y]);return{testimonials:t,loading:n,error:a,totalCount:i,summary:l,search:g,setSearch:u,status:h,setStatus:f,rating:m,setRating:v,sortBy:x,setSortBy:j,page:y,setPage:C,pageSize:F,setPageSize:T,approveTestimonial:k,rejectTestimonial:W,deleteTestimonial:A,refresh:S}},vt=()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"var(--admin-space-2)"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"Testimonials"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500},children:"Review, approve, and manage testimonials submitted by visitors."})]}),xe=({label:t,value:r,subtitle:i,icon:o,accent:n,loading:s=!1})=>{const a={blue:{bg:"rgba(37, 99, 235, 0.07)",color:"#2563EB",sub:"#2563EB"},amber:{bg:"rgba(245, 158, 11, 0.08)",color:"#D97706",sub:"#B45309"},green:{bg:"rgba(34, 197, 94, 0.08)",color:"#16A34A",sub:"#15803D"},red:{bg:"rgba(239, 68, 68, 0.08)",color:"#DC2626",sub:"#B91C1C"}}[n];return e.jsxs("div",{className:`testimonial-kpi-card accent-${n}`,children:[e.jsxs("div",{className:"card-header",children:[e.jsx("span",{className:"card-title",children:t}),e.jsx("div",{className:"card-icon-container",style:{backgroundColor:a.bg,color:a.color},children:o})]}),e.jsxs("div",{className:"card-body",children:[s?e.jsx("div",{className:"card-skeleton-value"}):e.jsx("span",{className:"card-value",children:r}),e.jsx("span",{className:"card-subtitle",style:{color:a.sub},children:i})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .testimonial-kpi-card {
          background: #FFFFFF;
          border: 1px solid var(--admin-border, #E5E7EB);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 220ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 220ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
          box-sizing: border-box;
          position: relative;
          font-family: 'Inter', sans-serif;
          text-align: left;
        }

        .testimonial-kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(124, 58, 237, 0.15);
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.06);
        }

        .testimonial-kpi-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .testimonial-kpi-card .card-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--admin-text-secondary, #64748B);
          margin: 0;
          line-height: 1.2;
        }

        .testimonial-kpi-card .card-icon-container {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .testimonial-kpi-card:hover .card-icon-container {
          transform: scale(1.04);
        }

        .testimonial-kpi-card .card-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }

        .testimonial-kpi-card .card-value {
          font-size: 30px;
          font-weight: 700;
          color: var(--admin-text, #0F172A);
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .testimonial-kpi-card .card-subtitle {
          font-size: 12px;
          font-weight: 500;
          margin: 0;
          line-height: 1.2;
        }

        .testimonial-kpi-card .card-skeleton-value {
          width: 70px;
          height: 33px;
          border-radius: 6px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: cardSkeletonPulse 1.5s infinite;
          margin-bottom: 2px;
        }

        @keyframes cardSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}})]})},jt=({summary:t,loading:r=!1})=>e.jsxs("div",{className:"stats-grid",children:[e.jsx(xe,{label:"Total Testimonials",value:t.total,subtitle:`${t.trends&&t.trends.total||"+3"} This Week`,accent:"blue",loading:r,icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx(xe,{label:"Pending Review",value:t.pending,subtitle:"Needs Attention",accent:"amber",loading:r,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]})}),e.jsx(xe,{label:"Approved",value:t.approved,subtitle:"Visible on Portfolio",accent:"green",loading:r,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]})}),e.jsx(xe,{label:"Rejected",value:t.rejected,subtitle:"Hidden from Portfolio",accent:"red",loading:r,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]})})]}),wt=({search:t,setSearch:r,status:i,setStatus:o,rating:n,setRating:s,sortBy:a,setSortBy:c,disabled:l=!1})=>e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"var(--admin-space-4)",padding:"var(--admin-space-4)",background:"#FFFFFF",borderRadius:"var(--admin-radius-md) var(--admin-radius-md) 0 0",border:"1px solid var(--admin-border)",borderBottom:"none",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"var(--admin-space-3)",flex:1},children:[e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"240px",boxSizing:"border-box"},children:[e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",placeholder:"Search testimonials...",value:t,onChange:p=>r(p.target.value),disabled:l,style:{width:"100%",padding:"8px 12px 8px 36px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:l?"var(--admin-surface, #F8FAFC)":"#FFFFFF",boxSizing:"border-box",outline:"none",transition:"border-color 0.15s ease",cursor:l?"not-allowed":"text"},onFocus:p=>{l||(p.currentTarget.style.borderColor="var(--admin-primary)")},onBlur:p=>{p.currentTarget.style.borderColor="var(--admin-border)"}})]}),e.jsxs("select",{value:i,onChange:p=>o(p.target.value),disabled:l,style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:l?"var(--admin-surface, #F8FAFC)":"#FFFFFF",cursor:l?"not-allowed":"pointer",outline:"none",minWidth:"100px"},children:[e.jsx("option",{value:"all",children:"Status"}),e.jsx("option",{value:"approved",children:"Approved"}),e.jsx("option",{value:"pending",children:"Pending"}),e.jsx("option",{value:"remind_later",children:"Remind Later"}),e.jsx("option",{value:"rejected",children:"Rejected"})]}),e.jsxs("select",{value:n,onChange:p=>s(p.target.value),disabled:l,style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:l?"var(--admin-surface, #F8FAFC)":"#FFFFFF",cursor:l?"not-allowed":"pointer",outline:"none",minWidth:"100px"},children:[e.jsx("option",{value:"all",children:"Rating"}),e.jsx("option",{value:"5",children:"5 Stars"}),e.jsx("option",{value:"4",children:"4 Stars"}),e.jsx("option",{value:"3",children:"3 Stars"}),e.jsx("option",{value:"2",children:"2 Stars"}),e.jsx("option",{value:"1",children:"1 Star"})]}),e.jsxs("select",{value:a,onChange:p=>c(p.target.value),disabled:l,style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:l?"var(--admin-surface, #F8FAFC)":"#FFFFFF",cursor:l?"not-allowed":"pointer",outline:"none",minWidth:"120px"},children:[e.jsx("option",{value:"newest",children:"Newest First"}),e.jsx("option",{value:"oldest",children:"Oldest First"}),e.jsx("option",{value:"highest_rating",children:"Highest Rating"}),e.jsx("option",{value:"lowest_rating",children:"Lowest Rating"})]})]}),e.jsx("div",{children:e.jsxs("button",{className:"hover-scale active-press",disabled:l,style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 14px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13px",fontWeight:600,color:"var(--admin-text)",backgroundColor:l?"var(--admin-surface, #F8FAFC)":"#FFFFFF",cursor:l?"not-allowed":"pointer",transition:"all 0.15s ease"},onMouseOver:p=>{l||(p.currentTarget.style.backgroundColor="var(--admin-surface)",p.currentTarget.style.color="var(--admin-primary)",p.currentTarget.style.borderColor="rgba(124, 58, 237, 0.2)")},onMouseOut:p=>{p.currentTarget.style.backgroundColor="#FFFFFF",p.currentTarget.style.color="var(--admin-text)",p.currentTarget.style.borderColor="var(--admin-border)"},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})}),e.jsx("span",{children:"Export CSV"})]})})]}),Ft=({rating:t})=>{const r=Array.from({length:5},(i,o)=>o+1);return e.jsx("div",{style:{display:"inline-flex",alignItems:"center",gap:"3px"},children:r.map(i=>{const o=i<=t;return e.jsx("span",{style:{display:"flex",alignItems:"center"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:o?"#F59E0B":"#E5E7EB",stroke:o?"#F59E0B":"#D1D5DB",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})})},i)})})},Le=({status:t})=>{let r="Pending",i="#F3E8FF",o="#7C3AED",n="#7C3AED";switch(t){case"approved":r="Approved",i="#DCFCE7",o="#16A34A",n="#16A34A";break;case"rejected":r="Rejected",i="#FEE2E2",o="#EF4444",n="#EF4444";break;case"remind_later":r="Remind Later",i="#FEF3C7",o="#D97706",n="#D97706";break;case"pending":default:r="Pending",i="#F3E8FF",o="#7C3AED",n="#7C3AED";break}return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 12px",borderRadius:"9999px",fontSize:"12px",fontWeight:600,backgroundColor:i,color:o,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:n,display:"inline-block"}}),e.jsx("span",{children:r})]})},kt=({onView:t})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsxs("button",{onClick:t,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"1px solid #E2E8F0",borderRadius:"20px",backgroundColor:"#FFFFFF",color:"#0F172A",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:r=>{r.currentTarget.style.backgroundColor="#F8FAFC",r.currentTarget.style.borderColor="#CBD5E1"},onMouseOut:r=>{r.currentTarget.style.backgroundColor="#FFFFFF",r.currentTarget.style.borderColor="#E2E8F0"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),e.jsx("span",{children:"View"})]}),e.jsxs("button",{className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"1px solid #FFEDD5",borderRadius:"20px",backgroundColor:"#FFF9F2",color:"#D97706",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:r=>{r.currentTarget.style.backgroundColor="#FFEDD5"},onMouseOut:r=>{r.currentTarget.style.backgroundColor="#FFF9F2"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),e.jsx("span",{children:"Later"})]})]}),St=({testimonial:t,onView:r})=>e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",transition:"background-color 0.15s ease"},onMouseOver:i=>{i.currentTarget.style.backgroundColor="rgba(248, 250, 252, 0.6)"},onMouseOut:i=>{i.currentTarget.style.backgroundColor="transparent"},children:[e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("img",{src:t.avatarUrl||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",alt:t.name,style:{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)"}}),e.jsx("span",{style:{fontWeight:700,fontSize:"13.5px",color:"var(--admin-text)",whiteSpace:"nowrap"},children:t.name})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text)"},children:t.company}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:t.role})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsx(Ft,{rating:t.rating})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",maxWidth:"280px"},children:e.jsx("p",{style:{margin:0,fontSize:"13px",lineHeight:"1.45",color:"var(--admin-text-secondary)",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis"},children:t.preview})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:t.country}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500,whiteSpace:"nowrap"},children:t.date}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsx(Le,{status:t.status})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsx(kt,{onView:r})})]}),Ct=({testimonials:t,onViewTestimonial:r})=>{const i=["Visitor","Company / Role","Rating","Preview","Country","Date","Status","Actions"];return e.jsx("div",{style:{width:"100%",overflowX:"auto",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",boxSizing:"border-box"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#F8FAFC",borderBottom:"1px solid var(--admin-border)"},children:i.map(o=>e.jsx("th",{style:{padding:"12px var(--admin-space-4)",fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:o},o))})}),e.jsx("tbody",{children:t.map(o=>e.jsx(St,{testimonial:o,onView:()=>r==null?void 0:r(o)},o.id))})]})})},zt=({isOpen:t,testimonialId:r,onClose:i,onSuccess:o})=>{const[n,s]=d.useState(null),[a,c]=d.useState(!1),[l,p]=d.useState(!1),[g,u]=d.useState(null),[h,f]=d.useState(!1),[m,v]=d.useState(!0),[x,j]=d.useState(0),[y,C]=d.useState(""),F=d.useRef(null),T=d.useRef(null),S=b=>b.split(" ").map(z=>z[0]).join("").toUpperCase().substring(0,2),k=async()=>{if(r){c(!0),u(null);try{const b=await q.getTestimonialById(r);b?(s(b),f(b.featured||!1),v(b.isVisible!==!1),j(b.displayOrder||0),C(b.adminNotes||"")):u("Testimonial not found.")}catch(b){u((b==null?void 0:b.message)||"Failed to fetch testimonial details.")}finally{c(!1)}}};d.useEffect(()=>{t&&r?k():(s(null),u(null))},[t,r]),d.useEffect(()=>{if(t){T.current=document.activeElement;const b=setTimeout(()=>{var z;(z=F.current)==null||z.focus()},100);return()=>clearTimeout(b)}else T.current&&T.current.focus()},[t]),d.useEffect(()=>{const b=z=>{z.key==="Escape"&&t&&i()};return window.addEventListener("keydown",b),()=>window.removeEventListener("keydown",b)},[t,i]);const W=async()=>{var b;if(n){p(!0);try{const{data:z}=await D.auth.getUser(),M=((b=z==null?void 0:z.user)==null?void 0:b.email)||"Admin";await q.updateTestimonial(n.id,{status:"approved",featured:h,is_visible:!0,display_order:x,admin_notes:y,approved_at:new Date().toISOString(),approved_by:M}),v(!0),typeof window<"u"&&window.showToast&&window.showToast("success","Testimonial Approved","The testimonial has been approved and settings updated.",4e3),o(),i()}catch(z){console.error("[TestimonialDetailsDrawer] Approval error:",z),typeof window<"u"&&window.showToast&&window.showToast("error","Action Failed",z.message||"Failed to approve testimonial.",6e3)}finally{p(!1)}}},A=async()=>{var b;if(n){p(!0);try{const{data:z}=await D.auth.getUser(),M=((b=z==null?void 0:z.user)==null?void 0:b.email)||"Admin";await q.updateTestimonial(n.id,{status:"rejected",featured:h,is_visible:!1,display_order:x,admin_notes:y,rejected_at:new Date().toISOString(),rejected_by:M}),v(!1),typeof window<"u"&&window.showToast&&window.showToast("success","Testimonial Rejected","The testimonial has been rejected and settings updated.",4e3),o(),i()}catch(z){console.error("[TestimonialDetailsDrawer] Rejection error:",z),typeof window<"u"&&window.showToast&&window.showToast("error","Action Failed",z.message||"Failed to reject testimonial.",6e3)}finally{p(!1)}}},L=async()=>{if(n){p(!0);try{await q.updateTestimonial(n.id,{featured:h,is_visible:m,display_order:x,admin_notes:y}),typeof window<"u"&&window.showToast&&window.showToast("success","Changes Saved","Portfolio settings and notes updated successfully.",4e3),o(),await k()}catch(b){console.error("[TestimonialDetailsDrawer] Save error:",b),typeof window<"u"&&window.showToast&&window.showToast("error","Save Failed",b.message||"Failed to save changes.",6e3)}finally{p(!1)}}},R=async()=>{if(n&&window.confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")){p(!0);try{await q.deleteTestimonial(n.id),typeof window<"u"&&window.showToast&&window.showToast("success","Testimonial Deleted","The testimonial was deleted successfully.",4e3),o(),i()}catch(b){console.error("[TestimonialDetailsDrawer] Delete error:",b),typeof window<"u"&&window.showToast&&window.showToast("error","Delete Failed",b.message||"Failed to delete testimonial.",6e3)}finally{p(!1)}}};return t?e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:i,style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"rgba(9, 9, 11, 0.4)",backdropFilter:"blur(4px)",zIndex:9999,animation:"fade-in 0.2s ease-out forwards"}}),e.jsxs("div",{ref:F,tabIndex:-1,"aria-modal":"true","aria-label":"Testimonial Details Drawer",role:"dialog",style:{position:"fixed",top:0,right:0,height:"100vh",width:"520px",maxWidth:"100%",background:"var(--admin-card-bg, #ffffff)",borderLeft:"1px solid var(--admin-border)",boxShadow:"-8px 0 24px rgba(0, 0, 0, 0.08)",zIndex:1e4,display:"flex",flexDirection:"column",outline:"none",fontFamily:"'Inter', sans-serif",animation:"slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .5; }
            }
          `}}),e.jsxs("div",{style:{padding:"var(--admin-space-4) var(--admin-space-5)",borderBottom:"1px solid var(--admin-border)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h2",{style:{fontSize:"16px",fontWeight:700,color:"var(--admin-text)",margin:0},children:"Testimonial Details"}),e.jsx("button",{onClick:i,"aria-label":"Close drawer",style:{background:"none",border:"none",cursor:"pointer",color:"var(--admin-text-secondary)",fontSize:"20px",width:"32px",height:"32px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s, color 0.15s"},onMouseOver:b=>{b.currentTarget.style.background="var(--admin-surface)",b.currentTarget.style.color="var(--admin-text)"},onMouseOut:b=>{b.currentTarget.style.background="none",b.currentTarget.style.color="var(--admin-text-secondary)"},children:"×"})]}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:"var(--admin-space-5)",display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:a?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx("div",{style:{width:"56px",height:"56px",borderRadius:"50%",background:"var(--admin-border)",animation:"pulse 1.5s infinite"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",flex:1},children:[e.jsx("div",{style:{width:"60%",height:"14px",background:"var(--admin-border)",borderRadius:"4px",animation:"pulse 1.5s infinite"}}),e.jsx("div",{style:{width:"40%",height:"10px",background:"var(--admin-border)",borderRadius:"4px",animation:"pulse 1.5s infinite"}})]})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"var(--admin-space-4)"},children:[...Array(4)].map((b,z)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("div",{style:{width:"45%",height:"8px",background:"var(--admin-border)",borderRadius:"4px",animation:"pulse 1.5s infinite"}}),e.jsx("div",{style:{width:"85%",height:"12px",background:"var(--admin-border)",borderRadius:"4px",animation:"pulse 1.5s infinite"}})]},z))}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("div",{style:{width:"25%",height:"8px",background:"var(--admin-border)",borderRadius:"4px",animation:"pulse 1.5s infinite"}}),e.jsx("div",{style:{width:"100%",height:"90px",background:"var(--admin-border)",borderRadius:"6px",animation:"pulse 1.5s infinite"}})]})]}):g?e.jsxs("div",{style:{textAlign:"center",padding:"var(--admin-space-8) 0",display:"flex",flexDirection:"column",alignItems:"center",gap:"var(--admin-space-4)"},children:[e.jsx("span",{style:{fontSize:"32px"},children:"⚠️"}),e.jsx("p",{style:{color:"var(--admin-text)",margin:0,fontWeight:500},children:g}),e.jsx("button",{onClick:k,style:{padding:"8px 16px",background:"var(--admin-primary)",color:"#ffffff",border:"none",borderRadius:"var(--admin-radius-md)",cursor:"pointer",fontWeight:600,fontSize:"13px"},children:"Retry"})]}):n?e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Visitor Information"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"var(--admin-space-4)"},children:[n.avatarUrl?e.jsx("img",{src:n.avatarUrl,alt:n.name,style:{width:"56px",height:"56px",borderRadius:"50%",objectFit:"cover",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}):e.jsx("div",{style:{width:"56px",height:"56px",borderRadius:"50%",backgroundColor:"var(--admin-surface, #F3E8FF)",color:"var(--admin-primary, #7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:"18px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"},children:S(n.name)}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("h4",{style:{fontSize:"15px",fontWeight:700,color:"var(--admin-text)",margin:0},children:n.name}),e.jsx("a",{href:`mailto:${n.email}`,style:{fontSize:"13px",color:"var(--admin-primary)",textDecoration:"none",fontWeight:500},children:n.email})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"var(--admin-space-3) var(--admin-space-4)",marginTop:"8px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Company"}),e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:n.company})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Designation"}),e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:n.role})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Country"}),e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:n.country})]}),e.jsxs("div",{children:[e.jsx("span",{style:{display:"block",fontSize:"11px",color:"var(--admin-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"2px"},children:"Submitted Date"}),e.jsxs("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:[n.date," ",n.submissionTime]})]})]})]}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Rating"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[[1,2,3,4,5].map(b=>e.jsx("span",{style:{color:b<=n.rating?"#F59E0B":"#E2E8F0",fontSize:"22px"},children:"★"},b)),e.jsxs("span",{style:{fontSize:"14px",color:"var(--admin-text-secondary)",marginLeft:"8px",fontWeight:700},children:["(",n.rating,"/5)"]})]})]}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Testimonial"}),e.jsx("div",{style:{backgroundColor:"var(--admin-surface, #F8FAFC)",border:"1px solid var(--admin-border)",borderRadius:"8px",padding:"16px",fontSize:"13.5px",color:"var(--admin-text)",lineHeight:"1.6",whiteSpace:"pre-wrap",maxHeight:"180px",overflowY:"auto",boxSizing:"border-box"},children:n.preview})]}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Current Status"}),e.jsx(Le,{status:n.status})]}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Portfolio Settings"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:"Featured"}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)"},children:"Show in the featured carousel on portfolio"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("span",{style:{fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)"},children:h?"On":"Off"}),e.jsx("button",{type:"button",onClick:()=>f(!h),disabled:l,style:{width:"46px",height:"24px",borderRadius:"12px",backgroundColor:h?"var(--admin-primary)":"#CBD5E1",border:"none",position:"relative",cursor:l?"not-allowed":"pointer",padding:0,display:"flex",alignItems:"center",transition:"background-color 0.2s ease",outline:"none"},children:e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"#FFFFFF",position:"absolute",left:h?"26px":"2px",transition:"left 0.2s cubic-bezier(0.25, 1, 0.5, 1)",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.15)"}})})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:"Visible on Portfolio"}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)"},children:"Toggle visibility on public sections"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("span",{style:{fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)"},children:m?"On":"Off"}),e.jsx("button",{type:"button",onClick:()=>v(!m),disabled:l,style:{width:"46px",height:"24px",borderRadius:"12px",backgroundColor:m?"var(--admin-primary)":"#CBD5E1",border:"none",position:"relative",cursor:l?"not-allowed":"pointer",padding:0,display:"flex",alignItems:"center",transition:"background-color 0.2s ease",outline:"none"},children:e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"#FFFFFF",position:"absolute",left:m?"26px":"2px",transition:"left 0.2s cubic-bezier(0.25, 1, 0.5, 1)",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.15)"}})})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)"},children:"Display Order"}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)"},children:"Sequence order index for custom sorting"})]}),e.jsx("input",{type:"number",value:x,disabled:l,onChange:b=>j(parseInt(b.target.value,10)||0),style:{width:"80px",padding:"6px 10px",border:"1px solid var(--admin-border)",borderRadius:"6px",fontSize:"13px",color:"var(--admin-text)",textAlign:"center",outline:"none",boxSizing:"border-box"}})]})]}),e.jsx("hr",{style:{border:"none",borderBottom:"1px solid var(--admin-border)",margin:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("h3",{style:{fontSize:"12px",fontWeight:700,textTransform:"uppercase",color:"var(--admin-text-secondary)",margin:0,letterSpacing:"0.05em"},children:"Admin Notes"}),e.jsx("textarea",{value:y,disabled:l,onChange:b=>C(b.target.value),placeholder:"Enter internal comments... (Private inside admin dashboard)",style:{width:"100%",height:"80px",padding:"10px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13px",color:"var(--admin-text)",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}})]})]}):null}),n&&!a&&e.jsxs("div",{style:{position:"sticky",bottom:0,padding:"16px 20px",borderTop:"1px solid var(--admin-border)",backgroundColor:"#FFFFFF",display:"flex",flexDirection:"column",gap:"12px",zIndex:10,boxShadow:"0 -4px 12px rgba(0, 0, 0, 0.03)"},children:[e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx("button",{onClick:A,disabled:l,style:{flex:1,padding:"10px 14px",border:"1px solid #FCA5A5",borderRadius:"8px",backgroundColor:"#FFF5F5",color:"var(--admin-danger)",fontSize:"13px",fontWeight:600,cursor:l?"not-allowed":"pointer",opacity:l?.7:1,transition:"all 0.15s ease"},children:"Reject"}),e.jsx("button",{onClick:W,disabled:l,style:{flex:1,padding:"10px 14px",border:"none",borderRadius:"8px",backgroundColor:"#10B981",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:l?"not-allowed":"pointer",opacity:l?.7:1,transition:"all 0.15s ease"},children:"Approve"}),e.jsx("button",{onClick:L,disabled:l,style:{flex:1.5,padding:"10px 14px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:l?"not-allowed":"pointer",opacity:l?.7:1,transition:"all 0.15s ease"},children:"Save Changes"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("button",{onClick:R,disabled:l,style:{background:"none",border:"none",color:"var(--admin-danger)",fontSize:"13px",fontWeight:600,cursor:l?"not-allowed":"pointer",padding:0,textDecoration:"underline"},children:"Delete"}),e.jsx("button",{onClick:i,disabled:l,style:{padding:"8px 16px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:600,cursor:l?"not-allowed":"pointer",transition:"all 0.15s ease"},children:"Cancel"})]})]})]})]}):null},Ie=()=>{const t=Array.from({length:5});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",padding:"24px",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",boxSizing:"border-box"},children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #F1F5F9",paddingBottom:"12px"},children:Array.from({length:6}).map((r,i)=>e.jsx("div",{className:"skeleton-cell",style:{width:"80px",height:"16px",borderRadius:"4px"}},i))}),t.map((r,i)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0",borderBottom:"1px solid #F8FAFC"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("div",{className:"skeleton-cell",style:{width:"36px",height:"36px",borderRadius:"50%"}}),e.jsx("div",{className:"skeleton-cell",style:{width:"100px",height:"14px",borderRadius:"4px"}})]}),e.jsx("div",{className:"skeleton-cell",style:{width:"120px",height:"14px",borderRadius:"4px"}}),e.jsx("div",{className:"skeleton-cell",style:{width:"60px",height:"14px",borderRadius:"4px"}}),e.jsx("div",{className:"skeleton-cell",style:{width:"180px",height:"14px",borderRadius:"4px"}}),e.jsx("div",{className:"skeleton-cell",style:{width:"80px",height:"24px",borderRadius:"12px"}}),e.jsx("div",{className:"skeleton-cell",style:{width:"100px",height:"32px",borderRadius:"16px"}})]},i))]})},Tt=({title:t="No Testimonials Found",description:r="There are no testimonials matching your filter criteria.",onClear:i})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"var(--admin-space-12) var(--admin-space-6)",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",textAlign:"center",boxSizing:"border-box"},children:[e.jsx("div",{style:{width:"64px",height:"64px",borderRadius:"50%",backgroundColor:"var(--admin-surface)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--admin-primary)",marginBottom:"var(--admin-space-4)"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx("h3",{style:{margin:"0 0 var(--admin-space-1.5) 0",fontSize:"16px",fontWeight:700,color:"var(--admin-text)"},children:t}),e.jsx("p",{style:{margin:0,fontSize:"13.5px",color:"var(--admin-text-secondary)",maxWidth:"320px",lineHeight:"1.5"},children:r}),i&&e.jsx("button",{onClick:i,className:"hover-scale active-press",style:{marginTop:"var(--admin-space-4)",padding:"8px 16px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:"pointer"},children:"Clear Filters"})]}),Wt=()=>{const[t,r]=d.useState(null),{testimonials:i,loading:o,error:n,totalCount:s,summary:a,search:c,setSearch:l,status:p,setStatus:g,rating:u,setRating:h,sortBy:f,setSortBy:m,page:v,setPage:x,pageSize:j,setPageSize:y,refresh:C}=bt(),F=s===0?0:(v-1)*j+1,T=Math.min(s,v*j),S=Math.ceil(s/j)||1,k=Array.from({length:S},(W,A)=>A+1);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:[e.jsx(vt,{}),e.jsx(jt,{summary:a,loading:o}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx(wt,{search:c,setSearch:l,status:p,setStatus:g,rating:u,setRating:h,sortBy:f,setSortBy:m,disabled:o}),o?e.jsx(Ie,{}):n?e.jsxs("div",{style:{padding:"var(--admin-space-8) var(--admin-space-4)",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",textAlign:"center",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("p",{style:{color:"var(--admin-danger, #EF4444)",fontWeight:600,fontSize:"14px",margin:"0 0 12px 0"},children:["Error loading testimonials: ",n]}),e.jsx("button",{onClick:()=>C(),style:{padding:"8px 16px",background:"var(--admin-primary, #7C3AED)",color:"#FFFFFF",border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:600,fontSize:"13px"},children:"Retry"})]}):i.length===0?e.jsx(Tt,{title:"No Testimonials Found",description:"There are no testimonials matching your filter criteria.",onClear:()=>{l(""),g("all"),h("all"),m("newest"),x(1)}}):e.jsx(Ct,{testimonials:i,onViewTestimonial:r}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--admin-space-4)",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",fontFamily:"'Inter', sans-serif",fontSize:"13px",color:"var(--admin-text-secondary)",boxSizing:"border-box"},children:[e.jsxs("div",{children:["Showing ",e.jsxs("strong",{style:{color:"var(--admin-text)"},children:[F,"–",T]})," of ",e.jsx("strong",{style:{color:"var(--admin-text)"},children:s})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("button",{disabled:v===1||o,onClick:()=>x(W=>Math.max(1,W-1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:v===1||o?"#D1D5DB":"var(--admin-text)",cursor:v===1||o?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Previous"}),k.map(W=>e.jsx("button",{onClick:()=>x(W),disabled:o,style:{width:"32px",height:"32px",borderRadius:"6px",border:v===W?"none":"1px solid var(--admin-border)",backgroundColor:v===W?"var(--admin-primary)":"#FFFFFF",color:v===W?"#FFFFFF":"var(--admin-text)",fontWeight:600,fontSize:"12px",cursor:o?"not-allowed":"pointer"},children:W},W)),e.jsx("button",{disabled:v===S||o,onClick:()=>x(W=>Math.min(S,W+1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:v===S||o?"#D1D5DB":"var(--admin-text)",cursor:v===S||o?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Next"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{children:"Rows per page:"}),e.jsxs("select",{value:j,onChange:W=>y(parseInt(W.target.value,10)),style:{padding:"4px 8px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",fontSize:"12px",fontWeight:600,cursor:"pointer",outline:"none"},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]}),e.jsx(zt,{isOpen:t!==null,testimonialId:(t==null?void 0:t.id)||null,onClose:()=>r(null),onSuccess:C})]})},le=t=>({id:t.id,resumeName:t.resume_name,fileName:t.file_name,storagePath:t.storage_path,publicUrl:t.public_url,previewUrl:t.preview_url,version:t.version,fileSize:t.file_size,uploadedAt:t.uploaded_at,updatedAt:t.updated_at,isActive:t.is_active}),ue={async uploadResume(t,r,i,o=!1){const n=`resumes/${Date.now()}-${t.name}`,{error:s}=await D.storage.from("resume-files").upload(n,t,{cacheControl:"3600",upsert:!0});if(s)throw console.error("[resumeService.uploadResume] Storage upload error:",s),s;const{data:{publicUrl:a}}=D.storage.from("resume-files").getPublicUrl(n),{data:c,error:l}=await D.from("resume_settings").insert([{resume_name:r,file_name:t.name,storage_path:n,public_url:a,preview_url:a,version:i,file_size:t.size,is_active:o}]).select().single();if(l)throw console.error("[resumeService.uploadResume] Database insert error:",l),l;return le(c)},async getActiveResume(){const{data:t,error:r}=await D.from("resume_settings").select("*").eq("is_active",!0).maybeSingle();if(r)throw console.error("[resumeService.getActiveResume] Error:",r),r;return t?le(t):null},async updateResume(t,r){const{data:i,error:o}=await D.from("resume_settings").update(r).eq("id",t).select().single();if(o)throw console.error("[resumeService.updateResume] Error:",o),o;return le(i)},async deleteResume(t){const{data:r,error:i}=await D.from("resume_settings").select("storage_path").eq("id",t).single();if(i)throw console.error("[resumeService.deleteResume] Fetch record error:",i),i;const{error:o}=await D.from("resume_settings").delete().eq("id",t);if(o)throw console.error("[resumeService.deleteResume] Database delete error:",o),o;if(r&&r.storage_path)try{const{error:n}=await D.storage.from("resume-files").remove([r.storage_path]);n&&console.warn("[resumeService.deleteResume] Storage delete warning:",n)}catch(n){console.warn("[resumeService.deleteResume] Storage delete caught exception:",n)}return!0},async setActiveResume(t){const{data:r,error:i}=await D.from("resume_settings").update({is_active:!0}).eq("id",t).select().single();if(i)throw console.error("[resumeService.setActiveResume] Error:",i),i;return le(r)}},At=({resumes:t,onViewDetails:r,onActivate:i,onDelete:o,onReplace:n})=>{const s=["Resume Name","Version","File Size","Upload Date","Status","Actions"],a=l=>{if(l===0)return"0 B";const p=1024,g=["B","KB","MB","GB"],u=Math.floor(Math.log(l)/Math.log(p));return parseFloat((l/Math.pow(p,u)).toFixed(2))+" "+g[u]},c=l=>{try{return new Date(l).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})}catch{return l}};return e.jsx("div",{style:{width:"100%",overflowX:"auto",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",boxSizing:"border-box",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#F8FAFC",borderBottom:"1px solid var(--admin-border)"},children:s.map(l=>e.jsx("th",{style:{padding:"14px var(--admin-space-4)",fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:l},l))})}),e.jsx("tbody",{children:t.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:s.length,style:{padding:"40px",textAlign:"center",color:"var(--admin-text-secondary)",fontSize:"14px"},children:"No resumes uploaded yet. Click Upload Resume PDF to add one."})}):t.map(l=>e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",backgroundColor:"#FFFFFF",transition:"background-color 0.15s ease"},children:[e.jsxs("td",{style:{padding:"14px var(--admin-space-4)",fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)"},children:[l.resumeName,e.jsx("div",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:400,marginTop:"2px"},children:l.fileName})]}),e.jsx("td",{style:{padding:"14px var(--admin-space-4)",fontSize:"13.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:l.version}),e.jsx("td",{style:{padding:"14px var(--admin-space-4)",fontSize:"13.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:a(l.fileSize)}),e.jsx("td",{style:{padding:"14px var(--admin-space-4)",fontSize:"13.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:c(l.uploadedAt)}),e.jsx("td",{style:{padding:"14px var(--admin-space-4)"},children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"4px 10px",borderRadius:"20px",backgroundColor:l.isActive?"#ECFDF5":"#F1F5F9",color:l.isActive?"#10B981":"#64748B",fontSize:"11px",fontWeight:700},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:l.isActive?"#10B981":"#94A3B8"}}),l.isActive?"Active":"Inactive"]})}),e.jsx("td",{style:{padding:"14px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("button",{type:"button",onClick:()=>r(l),style:{padding:"4px 8px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:"var(--admin-text)",fontSize:"11.5px",fontWeight:600,cursor:"pointer",transition:"background-color 0.15s ease"},onMouseEnter:p=>p.currentTarget.style.backgroundColor="#F8FAFC",onMouseLeave:p=>p.currentTarget.style.backgroundColor="#FFFFFF",children:"Details"}),!l.isActive&&e.jsx("button",{type:"button",onClick:()=>i(l.id),style:{padding:"4px 8px",border:"none",borderRadius:"6px",backgroundColor:"#10B981",color:"#FFFFFF",fontSize:"11.5px",fontWeight:600,cursor:"pointer",transition:"background-color 0.15s ease"},onMouseEnter:p=>p.currentTarget.style.backgroundColor="#059669",onMouseLeave:p=>p.currentTarget.style.backgroundColor="#10B981",children:"Activate"}),e.jsx("button",{type:"button",onClick:()=>n(l),style:{padding:"4px 8px",border:"1px solid rgba(124, 92, 255, 0.2)",borderRadius:"6px",backgroundColor:"rgba(124, 92, 255, 0.04)",color:"#7C5CFF",fontSize:"11.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseEnter:p=>{p.currentTarget.style.backgroundColor="rgba(124, 92, 255, 0.08)"},onMouseLeave:p=>{p.currentTarget.style.backgroundColor="rgba(124, 92, 255, 0.04)"},children:"Replace"}),e.jsx("button",{type:"button",onClick:()=>o(l.id),style:{padding:"4px 8px",border:"1px solid rgba(239, 68, 68, 0.2)",borderRadius:"6px",backgroundColor:"rgba(239, 68, 68, 0.04)",color:"#EF4444",fontSize:"11.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseEnter:p=>{p.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.08)"},onMouseLeave:p=>{p.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.04)"},children:"Delete"})]})})]},l.id))})]})})},Dt=({isOpen:t,mode:r,selectedResume:i,onClose:o,onSave:n})=>{const[s,a]=d.useState(""),[c,l]=d.useState(""),[p,g]=d.useState(null),[u,h]=d.useState(!1),f=d.useRef(null);if(d.useEffect(()=>{t&&(r==="replace"&&i?(a(i.resumeName),l(i.version),g(null)):(a(""),l(""),g(null)),h(!1))},[t,r,i]),!t)return null;const m=x=>{var y;const j=(y=x.target.files)==null?void 0:y[0];if(j){if(j.type!=="application/pdf"){typeof window<"u"&&window.showToast&&window.showToast("error","Invalid File Type","Please upload a PDF file only.",5e3);return}g(j)}},v=async x=>{if(x.preventDefault(),!s.trim()||!c.trim()){typeof window<"u"&&window.showToast&&window.showToast("error","Validation Error","Please fill in all fields.",5e3);return}if(!p){typeof window<"u"&&window.showToast&&window.showToast("error","Validation Error","Please select a resume PDF file.",5e3);return}h(!0);try{await n(p,s.trim(),c.trim()),o()}catch{}finally{h(!1)}};return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:o,style:{position:"fixed",left:0,top:0,width:"100vw",height:"100vh",backgroundColor:"rgba(15, 23, 42, 0.4)",backdropFilter:"blur(4px)",zIndex:1e4}}),e.jsxs("div",{style:{position:"fixed",left:"50%",top:"50%",transform:"translate(-50%, -50%)",width:"460px",backgroundColor:"#FFFFFF",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",zIndex:10001,display:"flex",flexDirection:"column",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{padding:"20px 24px",borderBottom:"1px solid var(--admin-border)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h3",{style:{margin:0,fontSize:"16.5px",fontWeight:700,color:"#0F172A"},children:r==="replace"?"Replace Resume File":"Upload Resume PDF"}),e.jsx("button",{type:"button",onClick:o,style:{border:"none",backgroundColor:"transparent",cursor:"pointer",color:"#94A3B8",padding:0,display:"flex"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("form",{onSubmit:v,style:{padding:"24px",display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Resume Name *"}),e.jsx("input",{type:"text",placeholder:"e.g., Ashok Vangapandu Resume",value:s,onChange:x=>a(x.target.value),disabled:u,style:{width:"100%",height:"38px",padding:"0 12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"8px",fontSize:"13.5px",boxSizing:"border-box",outline:"none",color:"#0F172A"}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Version *"}),e.jsx("input",{type:"text",placeholder:"e.g., v4.2",value:c,onChange:x=>l(x.target.value),disabled:u,style:{width:"100%",height:"38px",padding:"0 12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"8px",fontSize:"13.5px",boxSizing:"border-box",outline:"none",color:"#0F172A"}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Select PDF Document *"}),e.jsx("input",{type:"file",ref:f,onChange:m,accept:"application/pdf",style:{display:"none"}}),e.jsxs("div",{onClick:()=>{var x;return!u&&((x=f.current)==null?void 0:x.click())},style:{border:"1.5px dashed rgba(124, 92, 255, 0.25)",borderRadius:"10px",backgroundColor:"rgba(124, 92, 255, 0.02)",padding:"24px",textAlign:"center",cursor:u?"not-allowed":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"#7C5CFF",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"12",y1:"18",x2:"12",y2:"12"}),e.jsx("polyline",{points:"9 15 12 18 15 15"})]}),p?e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"#0F172A"},children:p.name}),e.jsxs("span",{style:{fontSize:"11px",color:"#64748B"},children:[(p.size/1024).toFixed(1)," KB · Ready to upload"]})]}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"#475569"},children:"Click to select PDF resume"}),e.jsx("span",{style:{fontSize:"10px",color:"#94A3B8"},children:"PDF format only, up to 10MB"})]})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"10px",marginTop:"12px",paddingTop:"16px",borderTop:"1px solid var(--admin-border)"},children:[e.jsx("button",{type:"button",onClick:o,disabled:u,style:{padding:"8px 16px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"#475569",fontSize:"12.5px",fontWeight:600,cursor:u?"not-allowed":"pointer"},children:"Cancel"}),e.jsx("button",{type:"submit",disabled:u,style:{padding:"8px 18px",border:"none",borderRadius:"8px",backgroundColor:u?"#94A3B8":"var(--admin-primary)",color:"#FFFFFF",fontSize:"12.5px",fontWeight:600,cursor:u?"not-allowed":"pointer",boxShadow:u?"none":"0 2px 6px rgba(124, 92, 255, 0.15)"},children:u?"Uploading...":r==="replace"?"Replace":"Upload & Activate"})]})]})]})]})},Rt=({resume:t,onClose:r})=>{if(!t)return null;const i=n=>{if(n===0)return"0 B";const s=1024,a=["B","KB","MB","GB"],c=Math.floor(Math.log(n)/Math.log(s));return parseFloat((n/Math.pow(s,c)).toFixed(2))+" "+a[c]},o=n=>{try{return new Date(n).toLocaleString("en-US",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{return n}};return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:r,style:{position:"fixed",left:0,top:0,width:"100vw",height:"100vh",backgroundColor:"rgba(15, 23, 42, 0.4)",backdropFilter:"blur(4px)",zIndex:1e4}}),e.jsxs("div",{style:{position:"fixed",left:"50%",top:"50%",transform:"translate(-50%, -50%)",width:"500px",backgroundColor:"#FFFFFF",borderRadius:"12px",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",zIndex:10001,display:"flex",flexDirection:"column",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{padding:"20px 24px",borderBottom:"1px solid var(--admin-border)",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("h3",{style:{margin:0,fontSize:"16.5px",fontWeight:700,color:"#0F172A"},children:"Resume Details"}),e.jsx("button",{type:"button",onClick:r,style:{border:"none",backgroundColor:"transparent",cursor:"pointer",color:"#94A3B8",padding:0,display:"flex"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsx("div",{style:{padding:"24px",display:"flex",flexDirection:"column",gap:"16px"},children:[{label:"Resume Name",value:t.resumeName},{label:"File Name",value:t.fileName},{label:"Version",value:t.version},{label:"File Size",value:i(t.fileSize)},{label:"Uploaded At",value:o(t.uploadedAt)},{label:"Last Updated",value:o(t.updatedAt)},{label:"Status",value:e.jsx("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",padding:"3px 8px",borderRadius:"12px",backgroundColor:t.isActive?"#ECFDF5":"#F1F5F9",color:t.isActive?"#10B981":"#64748B",fontSize:"11px",fontWeight:700},children:t.isActive?"Active":"Inactive"})},{label:"Storage Path",value:t.storagePath,isCode:!0},{label:"Public URL",value:e.jsx("a",{href:t.publicUrl,target:"_blank",rel:"noreferrer",style:{color:"var(--admin-primary)",textDecoration:"none",fontWeight:600,wordBreak:"break-all"},children:"View File ↗"})}].map((n,s)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",borderBottom:s<8?"1px solid #F1F5F9":"none",paddingBottom:s<8?"12px":0},children:[e.jsx("span",{style:{fontSize:"11.5px",fontWeight:650,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.02em"},children:n.label}),n.isCode?e.jsx("code",{style:{fontSize:"12.5px",color:"#0F172A",backgroundColor:"#F8FAFC",padding:"4px 8px",borderRadius:"4px",wordBreak:"break-all",fontFamily:"monospace"},children:n.value}):e.jsx("span",{style:{fontSize:"13.5px",color:"#0F172A",fontWeight:500},children:n.value})]},s))}),e.jsx("div",{style:{padding:"16px 24px",borderTop:"1px solid var(--admin-border)",display:"flex",justifyContent:"flex-end",boxSizing:"border-box"},children:e.jsx("button",{type:"button",onClick:r,style:{padding:"8px 18px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"#475569",fontSize:"12.5px",fontWeight:600,cursor:"pointer"},children:"Close"})})]})]})},we=t=>{const r=new Date(t.downloaded_at),i=r.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),o=r.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0}),n=t.visitor_id?`Visitor (${t.visitor_id.substring(0,6)})`:"Anonymous Visitor";let s="Desktop";(t.device_type==="Mobile"||t.device_type==="Tablet")&&(s=t.device_type);let a=t.referrer||"Direct";if(a.includes("linkedin.com"))a="LinkedIn";else if(a.includes("github.com"))a="GitHub";else if(a.includes("google.com"))a="Google Search";else if(a.startsWith("http"))try{a=new URL(a).hostname}catch{}return{id:t.id,dateTime:`${i}, ${o}`,visitorName:n,visitorEmail:null,avatarUrl:null,isKnown:!1,country:t.country||"Unknown",city:t.city||"Unknown",device:s,source:a,downloadedFrom:t.page_source||"Homepage",duration:"--",browser:t.browser||"Unknown",os:t.operating_system||"Unknown",submissionTime:o,ipAddress:t.ip_address,status:t.download_status,resumeVersion:t.resume_settings?t.resume_settings.version:"Unknown",sessionId:t.session_id,userAgent:t.user_agent,referrer:t.referrer,pageSource:t.page_source}},Lt=()=>{const[t,r]=d.useState([]),[i,o]=d.useState(0),[n,s]=d.useState(!1),[a,c]=d.useState(null),[l,p]=d.useState(""),[g,u]=d.useState("all"),[h,f]=d.useState(1),[m,v]=d.useState(10),x=d.useCallback(()=>{let C=D.from("resume_downloads").select("*, resume_settings(version)",{count:"exact"});if(l.trim()){const T=`%${l.trim()}%`;C=C.or(`visitor_id.ilike.${T},country.ilike.${T},city.ilike.${T},browser.ilike.${T},operating_system.ilike.${T},device_type.ilike.${T},page_source.ilike.${T},referrer.ilike.${T}`)}const F=new Date;if(g==="today"){const T=new Date(F.getFullYear(),F.getMonth(),F.getDate()).toISOString();C=C.gte("downloaded_at",T)}else if(g==="yesterday"){const T=new Date(F.getFullYear(),F.getMonth(),F.getDate()-1).toISOString(),S=new Date(F.getFullYear(),F.getMonth(),F.getDate()).toISOString();C=C.gte("downloaded_at",T).lt("downloaded_at",S)}else if(g==="7days"){const T=new Date(F.getTime()-6048e5).toISOString();C=C.gte("downloaded_at",T)}else if(g==="30days"){const T=new Date(F.getTime()-2592e6).toISOString();C=C.gte("downloaded_at",T)}return C},[l,g]),j=d.useCallback(async()=>{s(!0),c(null);try{let C=x();const F=(h-1)*m,T=F+m-1;C=C.range(F,T).order("downloaded_at",{ascending:!1});const{data:S,count:k,error:W}=await C;if(W)throw W;r((S||[]).map(we)),o(k||0)}catch(C){console.error("[useResumeDownloads] Fetch error:",C),c(C.message||"Failed to fetch resume downloads.")}finally{s(!1)}},[x,h,m]),y=async()=>{try{const{data:C,error:F}=await x().order("downloaded_at",{ascending:!1});if(F)throw F;const T=(C||[]).map(we),S=["Date & Time","Visitor ID","Country","City","Device","Browser","OS","Page Source","Referrer","IP Address","Status"],k=T.map(b=>[b.dateTime,b.visitorName,b.country,b.city,b.device,b.browser,b.os,b.downloadedFrom,b.source,b.ipAddress||"",b.status]),W=[S.join(","),...k.map(b=>b.map(z=>`"${(z||"").toString().replace(/"/g,'""')}"`).join(","))].join(`
`),A=new Blob([W],{type:"text/csv;charset=utf-8;"}),L=URL.createObjectURL(A),R=document.createElement("a");R.href=L,R.setAttribute("download",`resume_downloads_export_${Date.now()}.csv`),document.body.appendChild(R),R.click(),document.body.removeChild(R),URL.revokeObjectURL(L)}catch(C){console.error("[useResumeDownloads] Export CSV error:",C),typeof window<"u"&&window.showToast&&window.showToast("error","Export Failed",C.message||"CSV generation failed.",5e3)}};return d.useEffect(()=>{j()},[j]),d.useEffect(()=>{f(1)},[l,g]),{downloads:t,loading:n,totalCount:i,error:a,search:l,setSearch:p,dateRange:g,setDateRange:u,page:h,setPage:f,pageSize:m,setPageSize:v,refresh:j,exportCSV:y}},It=({search:t,setSearch:r,dateRange:i,setDateRange:o,onRefresh:n,onExportCSV:s})=>e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"var(--admin-space-4)",padding:"var(--admin-space-4)",background:"#FFFFFF",borderRadius:"var(--admin-radius-md) var(--admin-radius-md) 0 0",border:"1px solid var(--admin-border)",borderBottom:"none",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"var(--admin-space-3)",flex:1},children:[e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"240px",boxSizing:"border-box"},children:[e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",placeholder:"Search downloads...",value:t,onChange:a=>r(a.target.value),style:{width:"100%",padding:"8px 12px 8px 36px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",boxSizing:"border-box",outline:"none",transition:"border-color 0.15s ease"},onFocus:a=>a.currentTarget.style.borderColor="var(--admin-primary)",onBlur:a=>a.currentTarget.style.borderColor="var(--admin-border)"})]}),e.jsxs("select",{value:i,onChange:a=>o(a.target.value),style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:"#FFFFFF",cursor:"pointer",outline:"none",minWidth:"130px"},children:[e.jsx("option",{value:"all",children:"Date Range"}),e.jsx("option",{value:"today",children:"Today"}),e.jsx("option",{value:"yesterday",children:"Yesterday"}),e.jsx("option",{value:"7days",children:"Last 7 Days"}),e.jsx("option",{value:"30days",children:"Last 30 Days"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsxs("button",{onClick:s,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 14px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13px",fontWeight:600,color:"var(--admin-text)",backgroundColor:"#FFFFFF",cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:a=>{a.currentTarget.style.backgroundColor="var(--admin-surface)",a.currentTarget.style.color="var(--admin-primary)",a.currentTarget.style.borderColor="rgba(124, 58, 237, 0.2)"},onMouseOut:a=>{a.currentTarget.style.backgroundColor="#FFFFFF",a.currentTarget.style.color="var(--admin-text)",a.currentTarget.style.borderColor="var(--admin-border)"},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})}),e.jsx("span",{children:"Export CSV"})]}),e.jsx("button",{onClick:n,className:"hover-scale active-press","aria-label":"Refresh list",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"8px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:a=>{a.currentTarget.style.backgroundColor="var(--admin-surface)",a.currentTarget.style.color="var(--admin-primary)"},onMouseOut:a=>{a.currentTarget.style.backgroundColor="#FFFFFF",a.currentTarget.style.color="var(--admin-text-secondary)"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M23 4v6h-6"}),e.jsx("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})]})})]})]}),be=({status:t,isKnown:r})=>{const i=t?t.toLowerCase()==="failed":!1,o=t?!i:r,n=t?i?"Failed":"Completed":r?"Known Visitor":"Anonymous";return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 12px",borderRadius:"9999px",fontSize:"12px",fontWeight:600,backgroundColor:o?"#ECFDF5":i?"#FEF2F2":"#F1F5F9",color:o?"#10B981":i?"#EF4444":"#64748B",whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:o?"#10B981":i?"#EF4444":"#64748B",display:"inline-block"}}),e.jsx("span",{children:n})]})},Bt=({download:t,onView:r})=>{const i=e.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"50%",backgroundColor:"#F1F5F9",border:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),o=t.dateTime.split(`
`);return e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",transition:"background-color 0.15s ease"},onMouseOver:n=>{n.currentTarget.style.backgroundColor="rgba(248, 250, 252, 0.6)"},onMouseOut:n=>{n.currentTarget.style.backgroundColor="transparent"},children:[e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text)"},children:o[0]}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:o[1]})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[t.isKnown&&t.avatarUrl?e.jsx("img",{src:t.avatarUrl,alt:t.visitorName,style:{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)",flexShrink:0}}):i,e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontWeight:700,fontSize:"13.5px",color:t.isKnown?"var(--admin-text)":"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:t.visitorName}),t.isKnown&&t.visitorEmail&&e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500,whiteSpace:"nowrap"},children:t.visitorEmail})]})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text)"},children:t.country}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:t.city})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:t.device}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:t.source}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:t.downloadedFrom}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:t.duration}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsx(be,{status:t.status})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("button",{onClick:r,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"1px solid #E2E8F0",borderRadius:"20px",backgroundColor:"#FFFFFF",color:"#0F172A",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:n=>{n.currentTarget.style.backgroundColor="#F8FAFC",n.currentTarget.style.borderColor="#CBD5E1"},onMouseOut:n=>{n.currentTarget.style.backgroundColor="#FFFFFF",n.currentTarget.style.borderColor="#E2E8F0"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),e.jsx("span",{children:"View"})]})})]})},Et=({downloads:t,onViewDownload:r})=>{const i=["Date & Time","Visitor","Country","Device","Source","Downloaded From","Duration","Status","Action"];return e.jsx("div",{style:{width:"100%",overflowX:"auto",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",boxSizing:"border-box"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#F8FAFC",borderBottom:"1px solid var(--admin-border)"},children:i.map(o=>e.jsx("th",{style:{padding:"12px var(--admin-space-4)",fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:o},o))})}),e.jsx("tbody",{children:t.map(o=>e.jsx(Bt,{download:o,onView:()=>r==null?void 0:r(o)},o.id))})]})})},Mt=({download:t,onClose:r})=>(d.useEffect(()=>{const i=o=>{o.key==="Escape"&&r()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[r]),t?e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:r,style:{position:"fixed",inset:0,backgroundColor:"rgba(15, 23, 42, 0.3)",backdropFilter:"blur(4px)",zIndex:9999,animation:"drawerFadeIn 200ms ease-out"}}),e.jsxs("aside",{onClick:i=>i.stopPropagation(),style:{position:"fixed",right:0,top:0,bottom:0,width:"460px",height:"100vh",backgroundColor:"#FFFFFF",boxShadow:"-10px 0 30px rgba(15, 23, 42, 0.08)",zIndex:1e4,display:"flex",flexDirection:"column",boxSizing:"border-box",fontFamily:"'Inter', sans-serif",animation:"drawerSlideIn 250ms cubic-bezier(0.16, 1, 0.3, 1)"},children:[e.jsxs("div",{style:{padding:"24px",borderBottom:"1.5px dashed rgba(226, 232, 240, 1)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h2",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"#0F172A",letterSpacing:"-0.02em"},children:"Download Details"}),e.jsx("span",{style:{fontSize:"12.5px",color:"#64748B",fontWeight:500},children:"Full session and visitor information for this download event."})]}),e.jsx("button",{type:"button",onClick:r,style:{border:"none",backgroundColor:"transparent",cursor:"pointer",color:"#94A3B8",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",transition:"background-color 0.15s ease"},onMouseEnter:i=>i.currentTarget.style.backgroundColor="#F1F5F9",onMouseLeave:i=>i.currentTarget.style.backgroundColor="transparent",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:"20px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Visitor Details"}),[{label:"Visitor Name",value:t.visitorName},{label:"IP Address",value:t.ipAddress||"Not Available"},{label:"Country",value:t.country},{label:"City",value:t.city}].map((i,o)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #F1F5F9",paddingBottom:"8px"},children:[e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:i.label}),e.jsx("span",{style:{fontSize:"13px",color:"#0F172A",fontWeight:600},children:i.value})]},o))]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Download Info"}),[{label:"Resume Version",value:t.resumeVersion||"Unknown"},{label:"Downloaded At",value:t.dateTime},{label:"Downloaded From",value:t.downloadedFrom},{label:"Traffic Source",value:t.source}].map((i,o)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #F1F5F9",paddingBottom:"8px"},children:[e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:i.label}),e.jsx("span",{style:{fontSize:"13px",color:"#0F172A",fontWeight:600},children:i.value})]},o)),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #F1F5F9",paddingBottom:"8px",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:"Status"}),e.jsx(be,{status:t.status||"completed"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Device & Browser"}),[{label:"Device",value:t.device},{label:"Browser",value:t.browser},{label:"Operating System",value:t.os}].map((i,o)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #F1F5F9",paddingBottom:"8px"},children:[e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:i.label}),e.jsx("span",{style:{fontSize:"13px",color:"#0F172A",fontWeight:600},children:i.value})]},o))]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"8px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Session Metadata"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"#64748B",fontWeight:500},children:"Session ID"}),e.jsx("code",{style:{fontSize:"12px",color:"#0F172A",backgroundColor:"#F8FAFC",padding:"6px 10px",borderRadius:"6px",border:"1px solid #E2E8F0",fontFamily:"monospace",wordBreak:"break-all"},children:t.sessionId||"Not Available"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginTop:"6px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"#64748B",fontWeight:500},children:"Referrer URL"}),e.jsx("span",{style:{fontSize:"12.5px",color:"#0F172A",fontWeight:500,wordBreak:"break-all"},children:t.referrer||"Direct Entry"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginTop:"6px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"#64748B",fontWeight:500},children:"Landing Page"}),e.jsx("span",{style:{fontSize:"12.5px",color:"#0F172A",fontWeight:500,wordBreak:"break-all"},children:t.pageSource||"Homepage"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginTop:"6px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"#64748B",fontWeight:500},children:"User Agent"}),e.jsx("p",{style:{margin:0,fontSize:"12px",color:"#475569",lineHeight:1.5,backgroundColor:"#F8FAFC",padding:"10px 12px",borderRadius:"8px",border:"1px solid #E2E8F0",wordBreak:"break-all"},children:t.userAgent||"Not Available"})]})]})]}),e.jsx("div",{style:{padding:"16px 24px",borderTop:"1.5px dashed rgba(226, 232, 240, 1)",display:"flex",justifyContent:"flex-end",boxSizing:"border-box",backgroundColor:"#F8FAFC"},children:e.jsx("button",{type:"button",onClick:r,style:{padding:"10px 20px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"10px",backgroundColor:"#FFFFFF",color:"#475569",fontSize:"13.5px",fontWeight:600,cursor:"pointer",transition:"background-color 0.15s ease"},onMouseEnter:i=>i.currentTarget.style.backgroundColor="#F8FAFC",onMouseLeave:i=>i.currentTarget.style.backgroundColor="#FFFFFF",children:"Close Details"})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
          @keyframes drawerFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes drawerSlideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}})]})]}):null),Nt=()=>{const[t,r]=d.useState("downloads"),[i,o]=d.useState(null),{downloads:n,loading:s,totalCount:a,error:c,search:l,setSearch:p,dateRange:g,setDateRange:u,page:h,setPage:f,pageSize:m,setPageSize:v,refresh:x,exportCSV:j}=Lt(),y=Math.ceil(a/m),C=a===0?0:(h-1)*m+1,F=Math.min(h*m,a),[T,S]=d.useState([]),[k,W]=d.useState(!0),[A,L]=d.useState(!1),[R,b]=d.useState("upload"),[z,M]=d.useState(null),[B,P]=d.useState(!1),N=(I,_,O)=>{typeof window<"u"&&window.showToast?window.showToast(I,_,O,4e3):console.log(`[Toast ${I}] ${_}: ${O}`)},E=async()=>{W(!0);try{const{data:I,error:_}=await D.from("resume_settings").select("*").order("uploaded_at",{ascending:!1});if(_)throw _;S((I||[]).map(le))}catch(I){console.error("[ResumePage.fetchResumes] Error:",I),N("error","Fetch Failed",I.message||"Failed to load resumes.")}finally{W(!1)}};d.useEffect(()=>{t==="management"&&E()},[t]);const U=async(I,_,O)=>{try{R==="replace"&&z&&await ue.deleteResume(z.id),await ue.uploadResume(I,_,O,!0),N("success",R==="replace"?"Resume Replaced":"Resume Uploaded","Resume PDF uploaded and set to active."),E()}catch(w){throw console.error("[ResumePage.handleSaveResume] Error:",w),N("error","Upload Failed",w.message||"Failed to upload resume."),w}},G=async I=>{try{await ue.setActiveResume(I),N("success","Resume Activated","The selected resume is now active."),E()}catch(_){console.error("[ResumePage.handleActivate] Error:",_),N("error","Activation Failed",_.message||"Failed to activate resume.")}},J=async I=>{if(window.confirm("Are you sure you want to delete this resume? This will delete the file from storage and cannot be undone."))try{await ue.deleteResume(I),N("success","Resume Deleted","Resume settings and storage file removed."),E()}catch(_){console.error("[ResumePage.handleDelete] Error:",_),N("error","Delete Failed",_.message||"Failed to delete resume.")}};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-4)"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"var(--admin-space-2)"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:t==="downloads"?"Resume Downloads":"Resume Management"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500},children:t==="downloads"?"Track visitors who downloaded your resume and view their session details.":"Upload, replace, and activate your resume PDF available for download on the public portfolio."})]}),t==="management"&&e.jsxs("button",{type:"button",onClick:()=>{b("upload"),M(null),L(!0)},className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 18px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease",boxShadow:"0 4px 12px rgba(124, 92, 255, 0.2)"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Upload Resume PDF"]})]}),e.jsxs("div",{style:{display:"flex",borderBottom:"2px solid var(--admin-border)",gap:"24px",marginBottom:"var(--admin-space-4)"},children:[e.jsx("button",{onClick:()=>r("downloads"),style:{padding:"12px 4px",border:"none",borderBottom:t==="downloads"?"2.5px solid var(--admin-primary)":"2.5px solid transparent",backgroundColor:"transparent",color:t==="downloads"?"var(--admin-primary)":"var(--admin-text-secondary)",fontWeight:700,fontSize:"14px",cursor:"pointer",transition:"all 0.15s ease",outline:"none"},children:"Downloads Log"}),e.jsx("button",{onClick:()=>r("management"),style:{padding:"12px 4px",border:"none",borderBottom:t==="management"?"2.5px solid var(--admin-primary)":"2.5px solid transparent",backgroundColor:"transparent",color:t==="management"?"var(--admin-primary)":"var(--admin-text-secondary)",fontWeight:700,fontSize:"14px",cursor:"pointer",transition:"all 0.15s ease",outline:"none"},children:"File Management"})]}),t==="downloads"?e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx(It,{search:l,setSearch:p,dateRange:g,setDateRange:u,onRefresh:x,onExportCSV:j}),c?e.jsxs("div",{style:{padding:"40px",textAlign:"center",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",color:"#EF4444",fontSize:"14px",fontWeight:500},children:["Error loading logs: ",c]}):s?e.jsx("div",{style:{padding:"40px",textAlign:"center",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",color:"var(--admin-text-secondary)",fontSize:"14px"},children:"Loading downloads log..."}):e.jsxs(e.Fragment,{children:[e.jsx(Et,{downloads:n,onViewDownload:o}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--admin-space-4)",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",fontFamily:"'Inter', sans-serif",fontSize:"13px",color:"var(--admin-text-secondary)",boxSizing:"border-box"},children:[e.jsxs("div",{children:["Showing ",e.jsxs("strong",{style:{color:"var(--admin-text)"},children:[C,"–",F]})," of ",e.jsx("strong",{style:{color:"var(--admin-text)"},children:a})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("button",{disabled:h===1,onClick:()=>f(I=>Math.max(1,I-1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:h===1?"#D1D5DB":"var(--admin-text)",cursor:h===1?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Previous"}),Array.from({length:y},(I,_)=>_+1).map(I=>e.jsx("button",{onClick:()=>f(I),style:{width:"32px",height:"32px",borderRadius:"6px",border:"none",backgroundColor:h===I?"var(--admin-primary)":"#FFFFFF",color:h===I?"#FFFFFF":"var(--admin-text)",borderStyle:h===I?"none":"solid",borderWidth:h===I?"none":"1px",borderColor:"var(--admin-border)",fontWeight:600,fontSize:"12px",cursor:"pointer"},children:I},I)),e.jsx("button",{disabled:h===y||y===0,onClick:()=>f(I=>Math.min(y,I+1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:h===y||y===0?"#D1D5DB":"var(--admin-text)",cursor:h===y||y===0?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Next"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{children:"Rows per page:"}),e.jsxs("select",{value:m,onChange:I=>v(parseInt(I.target.value,10)),style:{padding:"4px 8px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",fontSize:"12px",fontWeight:600,cursor:"pointer",outline:"none"},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]}),e.jsx(Mt,{download:i,onClose:()=>o(null)})]}):k?e.jsx("div",{style:{padding:"40px",textAlign:"center",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",color:"var(--admin-text-secondary)"},children:"Loading resumes..."}):e.jsxs(e.Fragment,{children:[e.jsx(At,{resumes:T,onViewDetails:I=>{M(I),P(!0)},onActivate:G,onDelete:J,onReplace:I=>{M(I),b("replace"),L(!0)}}),e.jsx(Dt,{isOpen:A,mode:R,selectedResume:z,onClose:()=>{L(!1),M(null)},onSave:U}),e.jsx(Rt,{resume:z,onClose:()=>{P(!1),M(null)}})]})]})},_t={totalVisitors:24312,uniqueVisitors:18740,avgSessionTime:"3m 42s",formSubmissions:386,testimonialsCount:47,trends:{totalVisitors:"+12.4%",uniqueVisitors:"+9.1%",avgSessionTime:"+5.7%",formSubmissions:"+18.2%",testimonialsCount:"+3.0%"}},Pt=[{label:"Mon",visitors:1200},{label:"Tue",visitors:2800},{label:"Wed",visitors:2100},{label:"Thu",visitors:4100},{label:"Fri",visitors:3800},{label:"Sat",visitors:5400},{label:"Sun",visitors:4900}],Ot=[{label:"Wk 1",visitors:12400},{label:"Wk 2",visitors:15300},{label:"Wk 3",visitors:18700},{label:"Wk 4",visitors:24312}],Vt=[{label:"Jan",visitors:45e3},{label:"Feb",visitors:56e3},{label:"Mar",visitors:62e3},{label:"Apr",visitors:78e3}],Ut=[{id:"a1",type:"visit",title:"New visitor from LinkedIn",subtitle:"Mumbai, India",time:"2m ago"},{id:"a2",type:"submission",title:"Contact form submitted",subtitle:"john@example.com",time:"14m ago"},{id:"a3",type:"testimonial",title:"Testimonial received",subtitle:"5 stars - Sarah K.",time:"1h ago"},{id:"a4",type:"project",title:"Digital Twin Viewer viewed",subtitle:"Berlin, Germany",time:"2h ago"},{id:"a5",type:"download",title:"Resume downloaded",subtitle:"Toronto, Canada",time:"3h ago"}],Ht=[{country:"India",count:8240,percentage:34,code:"IN"},{country:"United States",count:6110,percentage:25,code:"US"},{country:"Germany",count:3820,percentage:16,code:"DE"},{country:"United Kingdom",count:2950,percentage:12,code:"GB"},{country:"Canada",count:1870,percentage:8,code:"CA"},{country:"Other",count:1322,percentage:5,code:"GLOBE"}],$t=[{rank:1,source:"LinkedIn",percentage:38,type:"linkedin"},{rank:2,source:"Google Search",percentage:27,type:"google"},{rank:3,source:"GitHub",percentage:18,type:"github"},{rank:4,source:"Direct",percentage:12,type:"direct"},{rank:5,source:"Other",percentage:5,type:"other"}],Yt=[{name:"Desktop",percentage:56},{name:"Mobile",percentage:34},{name:"Tablet",percentage:10}],Kt=[{name:"Chrome",percentage:64},{name:"Edge",percentage:14},{name:"Safari",percentage:11},{name:"Firefox",percentage:7},{name:"Other",percentage:4}],qt=[{name:"Windows",percentage:42},{name:"macOS",percentage:28},{name:"Android",percentage:14},{name:"iOS",percentage:10},{name:"Linux",percentage:6}],Gt={newPercentage:68,returningPercentage:32,newTrend:"+12.5%",returningTrend:"+8.3%"},Xt=[{hour:"12a",value:2},{hour:"1a",value:1},{hour:"2a",value:1},{hour:"3a",value:0},{hour:"4a",value:0},{hour:"5a",value:1},{hour:"6a",value:3},{hour:"7a",value:4},{hour:"8a",value:7},{hour:"9a",value:8},{hour:"10a",value:6},{hour:"11a",value:7},{hour:"12p",value:9},{hour:"1p",value:8},{hour:"2p",value:7},{hour:"3p",value:8},{hour:"4p",value:9},{hour:"5p",value:8},{hour:"6p",value:6},{hour:"7p",value:5},{hour:"8p",value:4},{hour:"9p",value:3},{hour:"10p",value:2},{hour:"11p",value:1}],Jt=[{id:"v1",dateTime:`Jan 15, 2024
10:42 AM`,visitorName:"Sarah Johnson",visitorEmail:"sarah.johnson@designstudio.com",avatarUrl:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",isKnown:!0,country:"United States",city:"New York",device:"Desktop",source:"LinkedIn",pageViewed:"Hero Section",duration:"8m 22s",browser:"Chrome 120",os:"macOS Sonoma",status:"Known Visitor"},{id:"v2",dateTime:`Jan 15, 2024
09:18 AM`,visitorName:"Anonymous Visitor",visitorEmail:null,avatarUrl:null,isKnown:!1,country:"Germany",city:"Berlin",device:"Desktop",source:"Google Search",pageViewed:"About Page",duration:"5m 10s",browser:"Chrome 120",os:"Windows 11",status:"Anonymous"},{id:"v3",dateTime:`Jan 14, 2024
3:55 PM`,visitorName:"Marcus Chen",visitorEmail:"marcus@techcorp.io",avatarUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",isKnown:!0,country:"Singapore",city:"Singapore",device:"Mobile",source:"GitHub",pageViewed:"Projects Page",duration:"12m 04s",browser:"Chrome Mobile",os:"Android 14",status:"Known Visitor"},{id:"v4",dateTime:`Jan 14, 2024
11:29 AM`,visitorName:"Emma Williams",visitorEmail:"emma.w@creativeagency.co",avatarUrl:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",isKnown:!0,country:"United Kingdom",city:"London",device:"Desktop",source:"Direct",pageViewed:"Home Page",duration:"6m 47s",browser:"Safari 17",os:"macOS Sonoma",status:"Known Visitor"},{id:"v5",dateTime:`Jan 13, 2024
7:02 PM`,visitorName:"Anonymous Visitor",visitorEmail:null,avatarUrl:null,isKnown:!1,country:"Canada",city:"Toronto",device:"Tablet",source:"Direct",pageViewed:"About Page",duration:"3m 15s",browser:"Safari Mobile",os:"iOS 17",status:"Anonymous"},{id:"v6",dateTime:`Jan 13, 2024
2:14 PM`,visitorName:"David Park",visitorEmail:"d.park@startup.xyz",avatarUrl:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",isKnown:!0,country:"South Korea",city:"Seoul",device:"Desktop",source:"LinkedIn",pageViewed:"Hero Section",duration:"9m 38s",browser:"Chrome 120",os:"Windows 11",status:"Known Visitor"},{id:"v7",dateTime:`Jan 12, 2024
5:33 PM`,visitorName:"Olivia Martinez",visitorEmail:"olivia@digitalmedia.es",avatarUrl:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",isKnown:!0,country:"Spain",city:"Madrid",device:"Desktop",source:"Google Search",pageViewed:"Projects Page",duration:"14m 51s",browser:"Safari 17",os:"macOS Sonoma",status:"Known Visitor"},{id:"v8",dateTime:`Jan 12, 2024
1:47 PM`,visitorName:"Anonymous Visitor",visitorEmail:null,avatarUrl:null,isKnown:!1,country:"India",city:"Bangalore",device:"Mobile",source:"GitHub",pageViewed:"Home Page",duration:"2m 09s",browser:"Chrome Mobile",os:"Android 14",status:"Anonymous"},{id:"v9",dateTime:`Jan 11, 2024
10:05 AM`,visitorName:"Lars Andersen",visitorEmail:"lars@nordic.dk",avatarUrl:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",isKnown:!0,country:"Denmark",city:"Copenhagen",device:"Desktop",source:"Direct",pageViewed:"About Page",duration:"7m 22s",browser:"Firefox 121",os:"macOS Sonoma",status:"Known Visitor"}],K={async getSummary(){return _t},async getTrends(t="daily"){return t==="weekly"?Ot:t==="monthly"?Vt:Pt},async getActivities(){return Ut},async getLocations(){return Ht},async getSources(){return $t},async getDevices(){return Yt},async getBrowsers(){return Kt},async getOS(){return qt},async getVisitorComparison(){return Gt},async getPeakHours(){return Xt},async getVisitors(t={}){let r=[...Jt];if(t.search){const c=t.search.toLowerCase().trim();r=r.filter(l=>l.visitorName.toLowerCase().includes(c)||l.visitorEmail&&l.visitorEmail.toLowerCase().includes(c)||l.country.toLowerCase().includes(c)||l.city.toLowerCase().includes(c)||l.source.toLowerCase().includes(c)||l.pageViewed.toLowerCase().includes(c))}const i=386,o=t.page||1,n=t.pageSize||10,s=(o-1)*n;return{data:r.slice(s,s+n),totalCount:i}}},Qt=()=>{const[t,r]=d.useState(!1),[i,o]=d.useState("30days"),[n,s]=d.useState("daily"),[a,c]=d.useState(()=>{const O=localStorage.getItem("admin_analytics_view_mode");return O==="list"||O==="grid"?O:"grid"}),l=O=>{c(O),localStorage.setItem("admin_analytics_view_mode",O)},[p,g]=d.useState(""),[u,h]=d.useState(1),[f,m]=d.useState(10),[v,x]=d.useState([]),[j,y]=d.useState(386),[C,F]=d.useState(null),[T,S]=d.useState([]),[k,W]=d.useState([]),[A,L]=d.useState([]),[R,b]=d.useState([]),[z,M]=d.useState([]),[B,P]=d.useState([]),[N,E]=d.useState([]),[U,G]=d.useState(null),[J,I]=d.useState([]),_=d.useCallback(async()=>{r(!0);try{const[O,w,V,H,X,ie,ce,Y,ee,oe,$]=await Promise.all([K.getSummary(),K.getTrends(n),K.getActivities(),K.getLocations(),K.getSources(),K.getDevices(),K.getBrowsers(),K.getOS(),K.getVisitorComparison(),K.getPeakHours(),K.getVisitors({search:p,page:u,pageSize:f})]);F(O),S(w),W(V),L(H),b(X),M(ie),P(ce),E(Y),G(ee),I(oe),x($.data),y($.totalCount)}catch(O){console.error("[useAnalytics] Fetch error:",O)}finally{r(!1)}},[n,p,u,f]);return d.useEffect(()=>{_()},[_]),{loading:t,timeRange:i,setTimeRange:o,viewMode:a,setViewMode:l,trendMode:n,setTrendMode:s,search:p,setSearch:g,page:u,setPage:h,pageSize:f,setPageSize:m,visitors:v,totalVisitorsCount:j,summary:C,trends:T,activities:k,locations:A,sources:R,devices:z,browsers:B,operatingSystems:N,visitorComparison:U,peakHours:J,refresh:_}},Zt=()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"var(--admin-space-2)"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"Portfolio Analytics"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500},children:"Monitor portfolio traffic, visitor engagement and project performance in real time."})]}),er=({timeRange:t,setTimeRange:r,viewMode:i,setViewMode:o,onRefresh:n})=>{const s=[{id:"today",label:"Today"},{id:"7days",label:"Last 7 Days"},{id:"30days",label:"Last 30 Days"},{id:"90days",label:"Last 90 Days"}];return e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"16px",flexWrap:"wrap",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[s.map(a=>{const c=t===a.id;return e.jsx("button",{onClick:()=>r(a.id),className:"hover-scale active-press",style:{padding:"8px 16px",borderRadius:"8px",border:c?"none":"1px solid var(--admin-border)",backgroundColor:c?"var(--admin-primary)":"#FFFFFF",color:c?"#FFFFFF":"var(--admin-text-secondary)",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:a.label},a.id)}),e.jsx("button",{onClick:n,className:"hover-scale active-press","aria-label":"Refresh stats",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"8px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:a=>{a.currentTarget.style.backgroundColor="var(--admin-surface)",a.currentTarget.style.color="var(--admin-primary)"},onMouseOut:a=>{a.currentTarget.style.backgroundColor="#FFFFFF",a.currentTarget.style.color="var(--admin-text-secondary)"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M23 4v6h-6"}),e.jsx("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})]})})]}),e.jsx("div",{style:{height:"24px",width:"1px",backgroundColor:"var(--admin-border)"}}),e.jsxs("div",{style:{display:"inline-flex",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"8px",padding:"2px",boxSizing:"border-box"},children:[e.jsxs("button",{onClick:()=>o("list"),style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"none",borderRadius:"6px",backgroundColor:i==="list"?"var(--admin-primary)":"transparent",color:i==="list"?"#FFFFFF":"var(--admin-text-secondary)",fontSize:"12.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"8",y1:"6",x2:"21",y2:"6"}),e.jsx("line",{x1:"8",y1:"12",x2:"21",y2:"12"}),e.jsx("line",{x1:"8",y1:"18",x2:"21",y2:"18"}),e.jsx("line",{x1:"3",y1:"6",x2:"3.01",y2:"6"}),e.jsx("line",{x1:"3",y1:"12",x2:"3.01",y2:"12"}),e.jsx("line",{x1:"3",y1:"18",x2:"3.01",y2:"18"})]}),e.jsx("span",{children:"List View"})]}),e.jsxs("button",{onClick:()=>o("grid"),style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"none",borderRadius:"6px",backgroundColor:i==="grid"?"var(--admin-primary)":"transparent",color:i==="grid"?"#FFFFFF":"var(--admin-text-secondary)",fontSize:"12.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7"})]}),e.jsx("span",{children:"Grid"})]})]})]})},tr=({visitors:t,totalCount:r,search:i,setSearch:o,page:n,setPage:s,pageSize:a,setPageSize:c,onRefresh:l,onViewDetails:p})=>{const g=e.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"50%",backgroundColor:"#F1F5F9",border:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),u=1,h=Math.min(t.length,a);return e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"var(--admin-space-4)",padding:"var(--admin-space-4)",background:"#FFFFFF",borderRadius:"var(--admin-radius-md) var(--admin-radius-md) 0 0",border:"1px solid var(--admin-border)",borderBottom:"none",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"var(--admin-space-3)",flex:1},children:[e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"240px",boxSizing:"border-box"},children:[e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",placeholder:"Search downloads...",value:i,onChange:f=>o(f.target.value),style:{width:"100%",padding:"8px 12px 8px 36px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",boxSizing:"border-box",outline:"none",transition:"border-color 0.15s ease"},onFocus:f=>f.currentTarget.style.borderColor="var(--admin-primary)",onBlur:f=>f.currentTarget.style.borderColor="var(--admin-border)"})]}),e.jsxs("select",{defaultValue:"all",style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:"#FFFFFF",cursor:"pointer",outline:"none",minWidth:"130px"},children:[e.jsx("option",{value:"all",children:"Date Range"}),e.jsx("option",{value:"today",children:"Today"}),e.jsx("option",{value:"7days",children:"Last 7 Days"}),e.jsx("option",{value:"30days",children:"Last 30 Days"})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsxs("button",{className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"8px 14px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13px",fontWeight:600,color:"var(--admin-text)",backgroundColor:"#FFFFFF",cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})}),e.jsx("span",{children:"Export CSV"})]}),e.jsx("button",{onClick:l,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"8px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M23 4v6h-6"}),e.jsx("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})]})})]})]}),e.jsx("div",{style:{width:"100%",overflowX:"auto",background:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"0",boxSizing:"border-box"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#F8FAFC",borderBottom:"1px solid var(--admin-border)"},children:["Date & Time","Visitor","Country","Device","Source","Downloaded From","Duration","Status","Action"].map(f=>e.jsx("th",{style:{padding:"12px var(--admin-space-4)",fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:f},f))})}),e.jsx("tbody",{children:t.map(f=>{const m=f.dateTime.split(`
`);return e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",transition:"background-color 0.15s ease"},onMouseOver:v=>v.currentTarget.style.backgroundColor="rgba(248, 250, 252, 0.6)",onMouseOut:v=>v.currentTarget.style.backgroundColor="transparent",children:[e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text)"},children:m[0]}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:m[1]})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[f.isKnown&&f.avatarUrl?e.jsx("img",{src:f.avatarUrl,alt:f.visitorName,style:{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)",flexShrink:0}}):g,e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontWeight:700,fontSize:"13.5px",color:f.isKnown?"var(--admin-text)":"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:f.visitorName}),f.isKnown&&f.visitorEmail&&e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500,whiteSpace:"nowrap"},children:f.visitorEmail})]})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text)"},children:f.country}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:f.city})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:f.device}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:f.source}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:f.pageViewed}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",color:"var(--admin-text-secondary)",fontSize:"13px",fontWeight:500},children:f.duration}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsx(be,{isKnown:f.isKnown})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("button",{onClick:()=>p==null?void 0:p(f),className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"1px solid #E2E8F0",borderRadius:"20px",backgroundColor:"#FFFFFF",color:"#0F172A",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),e.jsx("span",{children:"View"})]})})]},f.id)})})]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"var(--admin-space-4)",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",fontFamily:"'Inter', sans-serif",fontSize:"13px",color:"var(--admin-text-secondary)",boxSizing:"border-box"},children:[e.jsxs("div",{children:["Showing ",e.jsxs("strong",{style:{color:"var(--admin-text)"},children:[u,"–",h]})," of ",e.jsx("strong",{style:{color:"var(--admin-text)"},children:r})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("button",{disabled:n===1,onClick:()=>s(f=>Math.max(1,f-1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:n===1?"#D1D5DB":"var(--admin-text)",cursor:n===1?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Previous"}),e.jsx("button",{style:{width:"32px",height:"32px",borderRadius:"6px",border:"none",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontWeight:600,fontSize:"12px",cursor:"pointer"},children:"1"}),[2,3].map(f=>e.jsx("button",{onClick:()=>s(f),style:{width:"32px",height:"32px",borderRadius:"6px",border:"1px solid var(--admin-border)",backgroundColor:"#FFFFFF",color:"var(--admin-text)",fontWeight:600,fontSize:"12px",cursor:"pointer"},children:f},f)),e.jsx("span",{style:{margin:"0 4px",opacity:.6},children:"..."}),e.jsx("button",{onClick:()=>s(43),style:{width:"32px",height:"32px",borderRadius:"6px",border:"1px solid var(--admin-border)",backgroundColor:"#FFFFFF",color:"var(--admin-text)",fontWeight:600,fontSize:"12px",cursor:"pointer"},children:"43"}),e.jsx("button",{disabled:n===43,onClick:()=>s(f=>Math.min(43,f+1)),style:{padding:"6px 12px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:n===43?"#D1D5DB":"var(--admin-text)",cursor:n===43?"not-allowed":"pointer",fontWeight:600,fontSize:"12px"},children:"Next"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{children:"Rows per page:"}),e.jsxs("select",{value:a,onChange:f=>c(parseInt(f.target.value,10)),style:{padding:"4px 8px",border:"1px solid var(--admin-border)",borderRadius:"6px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",fontSize:"12px",fontWeight:600,cursor:"pointer",outline:"none"},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})},rr=({trends:t,trendMode:r,setTrendMode:i,loading:o=!1})=>{const l=t.length>0?Math.max(...t.map(m=>m.visitors))*1.15:6e3,p=t.map((m,v)=>{const x=40+v/(t.length-1)*520,j=160-m.visitors/l*(180-20*2);return{x,y:j,label:m.label,value:m.visitors}}),u=(()=>{if(p.length===0)return"";let m=`M ${p[0].x} ${p[0].y}`;for(let v=0;v<p.length-1;v++){const x=p[v],j=p[v+1],y=x.x+(j.x-x.x)/2,C=x.y,F=x.x+(j.x-x.x)/2,T=j.y;m+=` C ${y} ${C}, ${F} ${T}, ${j.x} ${j.y}`}return m})(),h=p.length>0?`${u} L ${p[p.length-1].x} 160 L ${p[0].x} 160 Z`:"",f=[{id:"daily",label:"Daily"},{id:"weekly",label:"Weekly"},{id:"monthly",label:"Monthly"}];return e.jsxs("div",{style:{flex:1.5,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"320px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"Visitor Trend"}),e.jsx("span",{style:{fontSize:"12px",color:"var(--admin-text-secondary)"},children:"Last 7 days • Updated just now"})]}),e.jsx("div",{style:{display:"flex",backgroundColor:"#F8FAFC",borderRadius:"8px",padding:"2px"},children:f.map(m=>{const v=r===m.id;return e.jsx("button",{onClick:()=>i(m.id),style:{padding:"6px 12px",border:"none",borderRadius:"6px",backgroundColor:v?"#FFFFFF":"transparent",color:v?"var(--admin-primary)":"var(--admin-text-secondary)",fontSize:"12px",fontWeight:600,cursor:"pointer",boxShadow:v?"0 1px 3px rgba(0,0,0,0.05)":"none",transition:"all 0.15s ease"},children:m.label},m.id)})})]}),e.jsx("div",{style:{width:"100%",overflowX:"auto",position:"relative"},children:o?e.jsx("div",{style:{height:"180px",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("div",{className:"skeleton-cell",style:{width:"100%",height:"100%",borderRadius:"8px"}})}):e.jsxs("svg",{viewBox:"0 0 600 180",width:"100%",height:180,style:{display:"block",overflow:"visible"},children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:"chart-area-grad",x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:"var(--admin-primary)",stopOpacity:"0.18"}),e.jsx("stop",{offset:"100%",stopColor:"var(--admin-primary)",stopOpacity:"0.0"})]})}),[0,1,2,3].map(m=>{const v=20+m/3*140;return e.jsx("line",{x1:40,y1:v,x2:560,y2:v,stroke:"#EEF2FF",strokeWidth:"1.5",strokeDasharray:"4 4"},m)}),h&&e.jsx("path",{d:h,fill:"url(#chart-area-grad)"}),u&&e.jsx("path",{d:u,fill:"none",stroke:"var(--admin-primary)",strokeWidth:"2.5",strokeLinecap:"round"}),p.map((m,v)=>e.jsxs("g",{children:[e.jsx("circle",{cx:m.x,cy:m.y,r:"6",fill:"var(--admin-primary)",style:{opacity:.15,cursor:"pointer"}}),e.jsx("circle",{cx:m.x,cy:m.y,r:"4",fill:"#FFFFFF",stroke:"var(--admin-primary)",strokeWidth:"2.5",style:{cursor:"pointer"},children:e.jsx("title",{children:`${m.label}: ${m.value.toLocaleString()}`})}),e.jsx("text",{x:m.x,y:176,textAnchor:"middle",fill:"var(--admin-text-secondary)",fontSize:"11",fontWeight:"600",children:m.label})]},v))]})})]})},ir=({activities:t,loading:r=!1})=>{const i=s=>{switch(s){case"visit":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]});case"submission":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]});case"testimonial":return e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})});case"project":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]});case"download":return e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"})});default:return null}},o=s=>{switch(s){case"visit":return"rgba(124, 58, 237, 0.08)";case"submission":return"rgba(59, 130, 246, 0.08)";case"testimonial":return"rgba(245, 158, 11, 0.08)";case"project":return"rgba(16, 185, 129, 0.08)";case"download":return"rgba(107, 114, 128, 0.08)";default:return"var(--admin-surface)"}},n=s=>{switch(s){case"visit":return"var(--admin-primary)";case"submission":return"#3B82F6";case"testimonial":return"#F59E0B";case"project":return"#10B981";case"download":return"#6B7280";default:return"var(--admin-text)"}};return e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"300px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"Recent Activity"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"20px",flex:1},children:r?Array.from({length:5}).map((s,a)=>e.jsx("div",{className:"skeleton-cell",style:{height:"48px",borderRadius:"8px"}},a)):t.map(s=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("div",{style:{width:"32px",height:"32px",borderRadius:"50%",backgroundColor:o(s.type),color:n(s.type),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:i(s.type)}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx("span",{style:{fontSize:"13.5px",fontWeight:700,color:"var(--admin-text)"},children:s.title}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:s.subtitle})]})]}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500,whiteSpace:"nowrap"},children:s.time})]},s.id))})]})},or=({locations:t,loading:r=!1})=>{const i=o=>{switch(o){case"IN":return"🇮🇳";case"US":return"🇺🇸";case"DE":return"🇩🇪";case"GB":return"🇬🇧";case"CA":return"🇨🇦";default:return"🌐"}};return e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"300px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"🌍 Visitor Locations"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px",flex:1},children:r?Array.from({length:5}).map((o,n)=>e.jsx("div",{className:"skeleton-cell",style:{height:"32px",borderRadius:"6px"}},n)):t.map(o=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{fontSize:"16px"},children:i(o.code)}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)"},children:o.country})]}),e.jsxs("span",{style:{fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)"},children:[o.count.toLocaleString()," - ",o.percentage,"%"]})]}),e.jsx("div",{style:{height:"6px",width:"100%",backgroundColor:"#F1F5F9",borderRadius:"3px",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${o.percentage}%`,backgroundColor:"var(--admin-primary)",borderRadius:"3px"}})})]},o.country))})]})},nr=({sources:t,loading:r=!1})=>{const i=o=>{switch(o){case"linkedin":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}),e.jsx("rect",{x:"2",y:"9",width:"4",height:"12"}),e.jsx("circle",{cx:"4",cy:"4",r:"2"})]});case"google":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]});case"github":return e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"})});case"direct":return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),e.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]});default:return e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"1"}),e.jsx("circle",{cx:"19",cy:"12",r:"1"}),e.jsx("circle",{cx:"5",cy:"12",r:"1"})]})}};return e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"300px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"📈 Traffic Sources"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px",flex:1},children:r?Array.from({length:5}).map((o,n)=>e.jsx("div",{className:"skeleton-cell",style:{height:"36px",borderRadius:"6px"}},n)):t.map(o=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",backgroundColor:"rgba(248, 250, 252, 0.7)",borderRadius:"8px",border:"1px solid var(--admin-border)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[e.jsxs("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-text-secondary)",width:"24px"},children:["#",o.rank]}),e.jsx("div",{style:{width:"28px",height:"28px",borderRadius:"50%",backgroundColor:"rgba(124, 58, 237, 0.08)",color:"var(--admin-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:i(o.type)}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:700,color:"var(--admin-text)"},children:o.source})]}),e.jsxs("span",{style:{fontSize:"12px",fontWeight:700,color:"var(--admin-primary)",backgroundColor:"rgba(124, 58, 237, 0.06)",padding:"4px 10px",borderRadius:"12px"},children:[o.percentage,"%"]})]},o.source))})]})},ar=({devices:t,loading:r=!1})=>{const n=2*Math.PI*40,s=50,a=["var(--admin-primary)","#9061F9","#CABFFD"];let c=0;return e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"220px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"📱 Device Distribution"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",flex:1,justifyContent:"center"},children:r?e.jsx("div",{className:"skeleton-cell",style:{width:"100px",height:"100px",borderRadius:"50%"}}):e.jsxs("div",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"space-around",gap:"16px",flexWrap:"wrap"},children:[e.jsxs("svg",{viewBox:"0 0 100 100",width:"100",height:"100",style:{transform:"rotate(-90deg)",overflow:"visible",flexShrink:0},children:[e.jsx("circle",{cx:s,cy:s,r:40,fill:"transparent",stroke:"#F1F5F9",strokeWidth:12}),t.map((l,p)=>{const g=l.percentage/100*n,u=n-c/100*n;return c+=l.percentage,e.jsx("circle",{cx:s,cy:s,r:40,fill:"transparent",stroke:a[p%a.length],strokeWidth:12,strokeDasharray:`${g} ${n}`,strokeDashoffset:u,strokeLinecap:"round",style:{transition:"stroke-dashoffset 0.3s ease"}},l.name)})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:t.map((l,p)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("div",{style:{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:a[p%a.length]}}),e.jsx("span",{style:{fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:600},children:l.name}),e.jsxs("span",{style:{fontSize:"12.5px",color:"var(--admin-text)",fontWeight:700,marginLeft:"auto"},children:[l.percentage,"%"]})]},l.name))})]})})]})},sr=({browsers:t,loading:r=!1})=>e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"220px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"🌐 Browser Usage"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"12px",flex:1,justifyContent:"center"},children:r?Array.from({length:5}).map((i,o)=>e.jsx("div",{className:"skeleton-cell",style:{height:"24px",borderRadius:"4px"}},o)):t.map(i=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"80px 1fr 40px",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:600},children:i.name}),e.jsx("div",{style:{height:"6px",backgroundColor:"#F1F5F9",borderRadius:"3px",overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",width:`${i.percentage}%`,backgroundColor:"var(--admin-primary)",borderRadius:"3px"}})}),e.jsxs("span",{style:{fontSize:"12.5px",color:"var(--admin-text)",fontWeight:700,textAlign:"right"},children:[i.percentage,"%"]})]},i.name))})]}),lr=({operatingSystems:t,loading:r=!1})=>e.jsxs("div",{style:{flex:1,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"220px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"💻 Operating Systems"}),e.jsx("div",{style:{display:"flex",flex:1,alignItems:"flex-end",justifyContent:"space-around",gap:"8px",minHeight:"140px"},children:r?Array.from({length:5}).map((o,n)=>e.jsx("div",{className:"skeleton-cell",style:{width:"32px",height:"100px",borderRadius:"4px"}},n)):t.map(o=>{const n=o.percentage/100*100;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",flex:1},children:[e.jsxs("span",{style:{fontSize:"11px",fontWeight:700,color:"var(--admin-text)"},children:[o.percentage,"%"]}),e.jsx("div",{style:{height:"100px",width:"32px",display:"flex",alignItems:"flex-end",backgroundColor:"#F1F5F9",borderRadius:"6px",overflow:"hidden"},children:e.jsx("div",{style:{height:`${n}px`,width:"100%",backgroundColor:"var(--admin-primary)",borderRadius:"0 0 6px 6px",transition:"height 0.3s ease"}})}),e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:600,whiteSpace:"nowrap"},children:o.name})]},o.name)})})]}),dr=({comparison:t,loading:r=!1})=>t?e.jsxs("div",{style:{flex:1.5,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"300px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"👥 New vs Returning Visitors"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"20px",flex:1,justifyContent:"center"},children:r?e.jsx("div",{className:"skeleton-cell",style:{height:"80px",borderRadius:"8px"}}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:"24px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsxs("span",{style:{fontSize:"28px",fontWeight:800,color:"var(--admin-primary)"},children:[t.newPercentage,"%"]}),e.jsx("span",{style:{fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:600},children:"New Visitors"}),e.jsx("span",{style:{fontSize:"11px",color:"#16A34A",fontWeight:600},children:t.newTrend})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px",alignItems:"flex-end",textAlign:"right"},children:[e.jsxs("span",{style:{fontSize:"28px",fontWeight:800,color:"#9061F9"},children:[t.returningPercentage,"%"]}),e.jsx("span",{style:{fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:600},children:"Returning Visitors"}),e.jsx("span",{style:{fontSize:"11px",color:"#16A34A",fontWeight:600},children:t.returningTrend})]})]}),e.jsxs("div",{style:{height:"8px",width:"100%",backgroundColor:"#F1F5F9",borderRadius:"4px",display:"flex",overflow:"hidden",marginTop:"10px"},children:[e.jsx("div",{style:{width:`${t.newPercentage}%`,height:"100%",backgroundColor:"var(--admin-primary)",transition:"width 0.3s ease"}}),e.jsx("div",{style:{width:`${t.returningPercentage}%`,height:"100%",backgroundColor:"#CABFFD",transition:"width 0.3s ease"}})]})]})})]}):null,cr=({peakHours:t,loading:r=!1})=>{const i=a=>a===0?"#F8FAFC":`rgba(124, 58, 237, ${a/9*.9+.1})`,o=a=>a>5?"#FFFFFF":"var(--admin-text)",n=t.slice(0,16),s=t.slice(16);return e.jsxs("div",{style:{flex:2,backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-md)",padding:"24px",display:"flex",flexDirection:"column",boxSizing:"border-box",minWidth:"320px",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif"},children:[e.jsx("h3",{style:{margin:"0 0 20px 0",fontSize:"15px",fontWeight:700,color:"var(--admin-text)"},children:"⏰ Peak Visiting Hours"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px",flex:1,justifyContent:"center"},children:r?e.jsx("div",{className:"skeleton-cell",style:{height:"110px",borderRadius:"8px"}}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",overflowX:"auto",paddingBottom:"4px"},children:[e.jsx("div",{style:{display:"flex",gap:"6px",minWidth:"480px"},children:n.map(a=>e.jsx("div",{title:`${a.hour}: level ${a.value}`,style:{flex:1,aspectRatio:"1",borderRadius:"6px",backgroundColor:i(a.value),color:o(a.value),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"4px",boxSizing:"border-box",minWidth:"24px"},children:e.jsx("span",{style:{fontSize:"9px",fontWeight:600,opacity:.8},children:a.hour})},a.hour))}),e.jsx("div",{style:{display:"flex",gap:"6px",minWidth:"480px"},children:s.map(a=>e.jsx("div",{title:`${a.hour}: level ${a.value}`,style:{flex:1,aspectRatio:"1",borderRadius:"6px",backgroundColor:i(a.value),color:o(a.value),display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"4px",boxSizing:"border-box",minWidth:"24px"},children:e.jsx("span",{style:{fontSize:"9px",fontWeight:600,opacity:.8},children:a.hour})},a.hour))}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"var(--admin-text-secondary)",marginTop:"8px",fontWeight:600},children:[e.jsx("span",{children:"Low"}),[0,2,4,6,8].map(a=>e.jsx("div",{style:{width:"12px",height:"12px",borderRadius:"3px",backgroundColor:i(a)}},a)),e.jsx("span",{children:"High"})]})]})})]})},ae=({title:t,value:r,trend:i,icon:o})=>e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"16px",padding:"20px 24px",display:"flex",flexDirection:"column",gap:"12px",boxSizing:"border-box",boxShadow:"var(--admin-shadow-sm)",fontFamily:"'Inter', sans-serif",position:"relative",minWidth:"160px",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"},onMouseOver:n=>{n.currentTarget.style.transform="translateY(-2px)",n.currentTarget.style.boxShadow="0 10px 20px -5px rgba(0, 0, 0, 0.05)"},onMouseOut:n=>{n.currentTarget.style.transform="translateY(0)",n.currentTarget.style.boxShadow="var(--admin-shadow-sm)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("div",{style:{width:"38px",height:"38px",borderRadius:"10px",backgroundColor:"rgba(124, 58, 237, 0.08)",color:"var(--admin-primary)",display:"flex",alignItems:"center",justifyContent:"center"},children:o}),e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"var(--admin-primary)",backgroundColor:"rgba(124, 58, 237, 0.06)",padding:"4px 10px",borderRadius:"12px"},children:i})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"24px",fontWeight:800,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:r}),e.jsx("span",{style:{fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:t})]})]}),pr=({summary:t,trends:r,activities:i,locations:o,sources:n,devices:s,browsers:a,operatingSystems:c,visitorComparison:l,peakHours:p,loading:g,trendMode:u,setTrendMode:h})=>{const f=e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]}),m=e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),v=e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),x=e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]}),j=e.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})});return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[t&&e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"16px"},children:[e.jsx(ae,{title:"Total Visitors",value:t.totalVisitors.toLocaleString(),trend:t.trends.totalVisitors,icon:f}),e.jsx(ae,{title:"Unique Visitors",value:t.uniqueVisitors.toLocaleString(),trend:t.trends.uniqueVisitors,icon:m}),e.jsx(ae,{title:"Avg Session",value:t.avgSessionTime,trend:t.trends.avgSessionTime,icon:v}),e.jsx(ae,{title:"Form Submissions",value:t.formSubmissions.toLocaleString(),trend:t.trends.formSubmissions,icon:x}),e.jsx(ae,{title:"Testimonials",value:t.testimonialsCount.toLocaleString(),trend:t.trends.testimonialsCount,icon:j})]}),e.jsxs("div",{style:{display:"flex",gap:"24px",flexWrap:"wrap",width:"100%"},children:[e.jsx(rr,{trends:r,trendMode:u,setTrendMode:h,loading:g}),e.jsx(ir,{activities:i,loading:g})]}),e.jsxs("div",{style:{display:"flex",gap:"24px",flexWrap:"wrap",width:"100%"},children:[e.jsx(or,{locations:o,loading:g}),e.jsx(nr,{sources:n,loading:g})]}),e.jsxs("div",{style:{display:"flex",gap:"24px",flexWrap:"wrap",width:"100%"},children:[e.jsx(ar,{devices:s,loading:g}),e.jsx(sr,{browsers:a,loading:g}),e.jsx(lr,{operatingSystems:c,loading:g})]}),e.jsxs("div",{style:{display:"flex",gap:"24px",flexWrap:"wrap",width:"100%",marginBottom:"24px"},children:[e.jsx(dr,{comparison:l,loading:g}),e.jsx(cr,{peakHours:p,loading:g})]})]})},xr=({visitor:t,onClose:r})=>{if(d.useEffect(()=>{const n=s=>{s.key==="Escape"&&r()};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[r]),!t)return null;const i=t.dateTime.replace(`
`," at "),o=e.jsx("div",{style:{width:"64px",height:"64px",borderRadius:"50%",backgroundColor:"#F1F5F9",border:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})});return e.jsxs("div",{onClick:r,style:{position:"fixed",inset:0,backgroundColor:"rgba(15, 23, 42, 0.45)",backdropFilter:"blur(4px)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"var(--admin-space-4)",boxSizing:"border-box",animation:"modalFadeIn 200ms ease-out"},children:[e.jsxs("div",{onClick:n=>n.stopPropagation(),style:{width:"100%",maxWidth:"750px",backgroundColor:"#FFFFFF",borderRadius:"16px",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.15)",display:"flex",flexDirection:"column",maxHeight:"90vh",fontFamily:"'Inter', sans-serif",boxSizing:"border-box",overflow:"hidden",animation:"modalScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)"},children:[e.jsxs("div",{style:{padding:"24px 32px",borderBottom:"1px solid #EEF2FF",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h2",{style:{margin:0,fontSize:"20px",fontWeight:700,color:"var(--admin-text)"},children:"Download Details"}),e.jsx("p",{style:{margin:0,fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Full session and visitor information for this download."})]}),e.jsx("button",{onClick:r,className:"hover-scale active-press",style:{background:"none",border:"1px solid #E2E8F0",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--admin-text-secondary)",transition:"all 0.15s ease"},onMouseOver:n=>{n.currentTarget.style.backgroundColor="var(--admin-surface)",n.currentTarget.style.color="var(--admin-text)"},onMouseOut:n=>{n.currentTarget.style.backgroundColor="transparent",n.currentTarget.style.color="var(--admin-text-secondary)"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{style:{padding:"32px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"28px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{padding:"24px",border:"1px solid var(--admin-border)",borderRadius:"12px",display:"flex",alignItems:"center",boxSizing:"border-box"},children:[t.isKnown&&t.avatarUrl?e.jsx("img",{src:t.avatarUrl,alt:t.visitorName,style:{width:"64px",height:"64px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)",flexShrink:0}}):o,e.jsxs("div",{style:{marginLeft:"24px",display:"flex",flexDirection:"column",gap:"3px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"var(--admin-text)"},children:t.visitorName}),t.isKnown&&t.visitorEmail&&e.jsx("a",{href:`mailto:${t.visitorEmail}`,style:{fontSize:"14px",color:"var(--admin-primary)",fontWeight:500,textDecoration:"none"},children:t.visitorEmail}),e.jsxs("span",{style:{fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:500},children:[t.country," ",e.jsx("span",{style:{opacity:.5,margin:"0 4px"},children:"•"})," ",t.city]})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"24px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{border:"1px solid var(--admin-border)",borderRadius:"12px",padding:"20px 24px",display:"flex",flexDirection:"column",gap:"16px",boxSizing:"border-box"},children:[e.jsx("h4",{style:{margin:0,fontSize:"11px",fontWeight:700,color:"var(--admin-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase"},children:"Download Details"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Date & Time"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:i})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Downloaded From"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.pageViewed})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Traffic Source"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.source})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Session Duration"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.duration})]})]})]}),e.jsxs("div",{style:{border:"1px solid var(--admin-border)",borderRadius:"12px",padding:"20px 24px",display:"flex",flexDirection:"column",gap:"16px",boxSizing:"border-box"},children:[e.jsx("h4",{style:{margin:0,fontSize:"11px",fontWeight:700,color:"var(--admin-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase"},children:"Device & Browser"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Device"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.device})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Browser"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.browser})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Operating System"}),e.jsx("div",{style:{fontSize:"13.5px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.os})]})]})]})]})]}),e.jsx("div",{style:{padding:"20px 32px",backgroundColor:"#FFFFFF",borderTop:"1px solid #EEF2FF",display:"flex",alignItems:"center",justifyContent:"flex-end",boxSizing:"border-box"},children:e.jsx("button",{onClick:r,className:"hover-scale active-press",style:{padding:"10px 24px",border:"none",borderRadius:"8px",backgroundColor:"#F1F5F9",color:"#0F172A",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:n=>n.currentTarget.style.backgroundColor="#E2E8F0",onMouseOut:n=>n.currentTarget.style.backgroundColor="#F1F5F9",children:"Close"})})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}})]})},ur=()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px",boxSizing:"border-box"},children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(5, 1fr)",gap:"16px"},children:Array.from({length:5}).map((t,r)=>e.jsx("div",{className:"skeleton-cell",style:{height:"110px",borderRadius:"12px"}},r))}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:"24px"},children:[e.jsx("div",{className:"skeleton-cell",style:{height:"240px",borderRadius:"12px"}}),e.jsx("div",{className:"skeleton-cell",style:{height:"240px",borderRadius:"12px"}})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px"},children:[e.jsx("div",{className:"skeleton-cell",style:{height:"280px",borderRadius:"12px"}}),e.jsx("div",{className:"skeleton-cell",style:{height:"280px",borderRadius:"12px"}})]}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"24px"},children:Array.from({length:3}).map((t,r)=>e.jsx("div",{className:"skeleton-cell",style:{height:"180px",borderRadius:"12px"}},r))})]}),hr=()=>{const[t,r]=d.useState(null),{loading:i,timeRange:o,setTimeRange:n,viewMode:s,setViewMode:a,trendMode:c,setTrendMode:l,search:p,setSearch:g,page:u,setPage:h,pageSize:f,setPageSize:m,visitors:v,totalVisitorsCount:x,summary:j,trends:y,activities:C,locations:F,sources:T,devices:S,browsers:k,operatingSystems:W,visitorComparison:A,peakHours:L,refresh:R}=Qt(),b=i&&!j;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-6)",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"16px",marginBottom:"8px"},children:[e.jsx(Zt,{}),e.jsx(er,{timeRange:o,setTimeRange:n,viewMode:s,setViewMode:a,onRefresh:R})]}),b?e.jsx(ur,{}):e.jsx("div",{style:{animation:"viewFadeIn 250ms ease-out",boxSizing:"border-box"},children:s==="list"?e.jsx(tr,{visitors:v,totalCount:x,search:p,setSearch:g,page:u,setPage:h,pageSize:f,setPageSize:m,onRefresh:R,onViewDetails:r}):e.jsx(pr,{summary:j,trends:y,activities:C,locations:F,sources:T,devices:S,browsers:k,operatingSystems:W,visitorComparison:A,peakHours:L,loading:i,trendMode:c,setTrendMode:l})},s),e.jsx(xr,{visitor:t,onClose:()=>r(null)}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes viewFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}})]})},gr={visibility:"public",isOpenForWork:!0,resumeFileName:"Resume_v4_2026.pdf",resumeLastUpdated:"09 July 2026",resumeStatus:"Active"},Fe={async getSettings(){return{...gr}},async updateSettings(t){return console.log("[portfolioSettingsService] Update payload:",t),!0}},mr=()=>{const[t,r]=d.useState(!1),[i,o]=d.useState(null),[n,s]=d.useState("public"),[a,c]=d.useState(!0),[l,p]=d.useState("Resume_v4_2026.pdf"),[g,u]=d.useState("09 July 2026"),[h,f]=d.useState("Active"),[m,v]=d.useState(!0),x=d.useCallback(async()=>{r(!0);try{const F=await Fe.getSettings();o(F),s(F.visibility),c(F.isOpenForWork),p(F.resumeFileName),u(F.resumeLastUpdated),f(F.resumeStatus)}catch(F){console.error("[usePortfolioSettings] Fetch error:",F)}finally{r(!1)}},[]);d.useEffect(()=>{x()},[x]);const j=i?n!==i.visibility||a!==i.isOpenForWork:!1;return{loading:t,visibility:n,setVisibility:s,isOpenForWork:a,setIsOpenForWork:c,resumeFileName:l,resumeLastUpdated:g,resumeStatus:h,showAlert:m,setShowAlert:v,isDirty:j,handleSave:async()=>{r(!0);try{const F={visibility:n,isOpenForWork:a,resumeFileName:l,resumeLastUpdated:g,resumeStatus:h};await Fe.updateSettings(F),o(F),v(!0)}catch(F){console.error("[usePortfolioSettings] Save error:",F)}finally{r(!1)}},handleDiscard:()=>{i&&(s(i.visibility),c(i.isOpenForWork))},refresh:x}},fr=({selected:t,onChange:r})=>{const i=[{value:"public",title:"Public",desc:"Your portfolio is publicly accessible to everyone.",dotColor:"#10B981",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"2",y1:"12",x2:"22",y2:"12"}),e.jsx("path",{d:"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})]})},{value:"maintenance",title:"Maintenance",desc:"Visitors will see a maintenance page while updates are in progress.",dotColor:"#F59E0B",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})})},{value:"private",title:"Private",desc:"Only authorized users can access the portfolio.",dotColor:"#64748B",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"11",width:"18",height:"11",rx:"2",ry:"2"}),e.jsx("path",{d:"M7 11V7a5 5 0 0 1 10 0v4"})]})}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",boxSizing:"border-box"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:700,color:"#0F172A",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Portfolio Status"}),e.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"13px",color:"var(--admin-text-secondary)"},children:"Control who can access your portfolio."}),e.jsx("div",{className:"responsive-grid",style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"16px",boxSizing:"border-box"},children:i.map(o=>{const n=t===o.value;return e.jsxs("div",{onClick:()=>r(o.value),className:"hover-scale active-press",style:{backgroundColor:"#FFFFFF",border:n?"1.5px solid var(--admin-primary)":"1px solid var(--admin-border)",borderRadius:"12px",padding:"20px",cursor:"pointer",display:"flex",flexDirection:"column",gap:"14px",position:"relative",boxSizing:"border-box",boxShadow:n?"0 4px 12px rgba(124, 58, 237, 0.08)":"var(--admin-shadow-sm)",transition:"all 0.2s ease"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"8px",backgroundColor:n?"rgba(124, 58, 237, 0.06)":"#F8FAFC",color:n?"var(--admin-primary)":"var(--admin-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center"},children:o.icon}),n&&e.jsx("div",{style:{width:"20px",height:"20px",borderRadius:"50%",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"6px"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:o.dotColor}}),e.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--admin-text)"},children:o.title})]}),e.jsx("p",{style:{margin:0,fontSize:"12px",color:"var(--admin-text-secondary)",fontWeight:500,lineHeight:1.4},children:o.desc})]})]},o.value)})})]})},yr=({checked:t,onChange:r})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px",maxWidth:"70%"},children:[e.jsx("h3",{style:{margin:0,fontSize:"14px",fontWeight:700,color:"var(--admin-text)"},children:"Open for Work"}),e.jsx("p",{style:{margin:0,fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:500,lineHeight:1.4},children:'Control whether the "Open for Work" badge is displayed on your public portfolio.'})]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"14px",flexShrink:0},children:[t&&e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",borderRadius:"20px",backgroundColor:"#ECFDF5",color:"#10B981",fontSize:"11.5px",fontWeight:700,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:"#10B981"}}),"Open for Work"]}),e.jsx("span",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text-secondary)"},children:t?"On":"Off"}),e.jsx("button",{type:"button",onClick:()=>r(!t),style:{width:"46px",height:"24px",borderRadius:"12px",backgroundColor:t?"var(--admin-primary)":"#CBD5E1",border:"none",position:"relative",cursor:"pointer",padding:0,display:"flex",alignItems:"center",transition:"background-color 0.2s ease",outline:"none"},children:e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"#FFFFFF",position:"absolute",left:t?"26px":"2px",transition:"left 0.2s cubic-bezier(0.25, 1, 0.5, 1)",boxShadow:"0 1px 3px rgba(0, 0, 0, 0.15)"}})})]})]}),br=({fileName:t,lastUpdated:r,status:i,onReplace:o,onPreview:n})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",width:"100%",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"14px",fontWeight:700,color:"var(--admin-text)"},children:"Resume Management"}),e.jsx("p",{style:{margin:0,fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:500,lineHeight:1.4},children:"Manage the resume file that visitors download from your portfolio."})]}),e.jsxs("div",{style:{padding:"16px 20px",border:"1px solid var(--admin-border)",borderRadius:"10px",backgroundColor:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[e.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"8px",backgroundColor:"#EEF2FF",color:"var(--admin-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),e.jsx("polyline",{points:"10 9 9 9 8 9"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"var(--admin-text)"},children:t}),e.jsxs("span",{style:{fontSize:"11.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:["Last updated · ",r]})]})]}),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"5px",padding:"6px 12px",borderRadius:"20px",backgroundColor:"#ECFDF5",color:"#10B981",fontSize:"11.5px",fontWeight:700},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),e.jsx("span",{children:i})]})]}),e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"12px"},children:[e.jsxs("button",{type:"button",onClick:o,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 18px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"17 8 12 3 7 8"}),e.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),e.jsx("span",{children:"Replace Resume"})]}),e.jsxs("button",{type:"button",onClick:n,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 18px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"#0F172A",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),e.jsx("span",{children:"Preview Resume"})]})]}),e.jsx("p",{style:{margin:0,fontSize:"12px",color:"var(--admin-text-secondary)",fontWeight:500,lineHeight:1.4},children:"Uploading a new resume automatically replaces the existing file available for download on the public portfolio."})]}),vr=({type:t="success",title:r,message:i,onClose:o})=>{const s=(()=>{switch(t){case"success":return{bgColor:"#ECFDF5",borderColor:"#10B981",textColor:"#065F46",titleColor:"#065F46",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"#10B981",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]})};case"warning":return{bgColor:"#FFFBEB",borderColor:"#F59E0B",textColor:"#92400E",titleColor:"#92400E",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"#F59E0B",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),e.jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),e.jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]})};case"error":return{bgColor:"#FEF2F2",borderColor:"#EF4444",textColor:"#991B1B",titleColor:"#991B1B",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"#EF4444",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),e.jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]})};case"info":default:return{bgColor:"#EFF6FF",borderColor:"#3B82F6",textColor:"#1E40AF",titleColor:"#1E40AF",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"#3B82F6",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]})}}})();return e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:"12px",padding:"14px 18px",backgroundColor:s.bgColor,border:`1px solid ${s.borderColor}`,borderRadius:"8px",width:"100%",boxSizing:"border-box",position:"relative",fontFamily:"'Inter', sans-serif"},children:[e.jsx("div",{style:{marginTop:"2px",display:"flex",alignItems:"center",flexShrink:0},children:s.icon}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",flex:1},children:[e.jsx("span",{style:{fontSize:"13.5px",fontWeight:700,color:s.titleColor},children:r}),e.jsx("p",{style:{margin:0,fontSize:"12.5px",color:s.textColor,fontWeight:500,lineHeight:1.4},children:i})]}),o&&e.jsx("button",{onClick:o,style:{background:"none",border:"none",color:s.textColor,cursor:"pointer",padding:"2px",marginLeft:"8px",opacity:.7,display:"flex",alignItems:"center",alignSelf:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]})},jr=({isDirty:t,onSave:r,onDiscard:i})=>e.jsxs("div",{style:{position:"sticky",bottom:0,margin:"32px -32px -32px -32px",padding:"16px 32px",backgroundColor:"#FFFFFF",borderTop:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"12px",zIndex:100,boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsx("button",{type:"button",disabled:!t,onClick:i,className:t?"hover-scale active-press":"",style:{padding:"10px 24px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:t?"#0F172A":"#94A3B8",fontSize:"13.5px",fontWeight:600,cursor:t?"pointer":"not-allowed",opacity:t?1:.6,transition:"all 0.15s ease"},children:"Cancel"}),e.jsx("button",{type:"button",disabled:!t,onClick:r,className:t?"hover-scale active-press animate-glow":"",style:{padding:"10px 24px",border:"none",borderRadius:"8px",backgroundColor:t?"var(--admin-primary)":"rgba(124, 58, 237, 0.4)",color:"#FFFFFF",fontSize:"13.5px",fontWeight:600,cursor:t?"pointer":"not-allowed",transition:"all 0.15s ease"},children:"Save Changes"})]}),ve=({options:t,activeId:r,onChange:i,className:o="",style:n})=>e.jsx("div",{className:o,style:{display:"flex",borderBottom:"1px solid var(--admin-border)",width:"100%",gap:"var(--admin-space-4)",fontFamily:"'Inter', sans-serif",...n},children:t.map(s=>{const a=s.id===r;return e.jsxs("button",{onClick:()=>i(s.id),style:{padding:"var(--admin-space-3) 0",border:"none",background:"none",cursor:"pointer",color:a?"var(--admin-primary)":"var(--admin-text-secondary)",fontWeight:a?600:500,fontSize:"13.5px",position:"relative",display:"flex",alignItems:"center",gap:"var(--admin-space-1.5)",transition:"color 0.15s ease"},children:[e.jsx("span",{children:s.label}),s.count!==void 0&&e.jsx("span",{style:{fontSize:"10px",background:a?"var(--admin-primary)":"var(--admin-border)",color:a?"#FFFFFF":"var(--admin-text-secondary)",padding:"1px 6px",borderRadius:"9999px",fontWeight:600},children:s.count}),a&&e.jsx("div",{className:"animate-fade-in",style:{position:"absolute",bottom:"-1px",left:0,right:0,height:"2px",backgroundColor:"var(--admin-primary)",borderRadius:"9999px"}})]},s.id)})}),ke=()=>{const{visibility:t,setVisibility:r,isOpenForWork:i,setIsOpenForWork:o,resumeFileName:n,resumeLastUpdated:s,resumeStatus:a,showAlert:c,setShowAlert:l,isDirty:p,handleSave:g,handleDiscard:u}=mr();return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-6)",width:"100%",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"Portfolio Settings"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500,lineHeight:1.4},children:"Manage your portfolio visibility and public availability."})]}),e.jsx(ve,{options:[{id:"portfolio",label:"Portfolio Settings"},{id:"social-links",label:"Social Links"},{id:"admin-access",label:"Admin Access"}],activeId:"portfolio",onChange:h=>{const f=h==="portfolio"?"/admin/settings/portfolio":`/admin/settings/${h}`,v=window.location.pathname.startsWith("/ashok-portfolio")?`/ashok-portfolio${f}`:f;window.history.pushState(null,"",v),window.dispatchEvent(new PopStateEvent("popstate"))},style:{marginBottom:"var(--admin-space-2)"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px",boxSizing:"border-box"},children:[e.jsx(te,{children:e.jsx(fr,{selected:t,onChange:r})}),e.jsx(te,{children:e.jsx(yr,{checked:i,onChange:o})}),e.jsx(te,{children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"20px"},children:[e.jsx(br,{fileName:n,lastUpdated:s,status:a}),c&&e.jsx(vr,{type:"success",title:"Resume updated successfully.",message:"The latest resume is now available on your portfolio.",onClose:()=>l(!1)})]})})]}),e.jsx(jr,{isDirty:p,onSave:g,onDiscard:u})]})},wr=[{id:"sl1",platform:"LinkedIn",url:"https://linkedin.com/in/ashokvangapandu"},{id:"sl2",platform:"GitHub",url:"https://github.com/ashokvangapandu"},{id:"sl3",platform:"Behance",url:"https://behance.net/ashok"},{id:"sl4",platform:"Twitter / X",url:"https://twitter.com/ashok"},{id:"sl5",platform:"Medium",url:"https://medium.com/@ashok"}],Se={async getLinks(){return[...wr]},async updateLinks(t){return console.log("[socialLinksService] Updated links:",t),!0}},Fr=()=>{const[t,r]=d.useState(!1),[i,o]=d.useState([]),[n,s]=d.useState([]),a=d.useCallback(async()=>{r(!0);try{const u=await Se.getLinks();o(u),s(u.map(h=>({...h})))}catch(u){console.error("[useSocialLinks] Fetch error:",u)}finally{r(!1)}},[]);d.useEffect(()=>{a()},[a]);const c=(u,h)=>{s(f=>f.map(m=>m.id===u?{...m,url:h}:m))},l=i.length===n.length&&i.length>0?n.some((u,h)=>u.url!==i[h].url):!1;return{loading:t,links:n,updateLinkUrl:c,isDirty:l,handleSave:async()=>{r(!0);try{await Se.updateLinks(n),o(n.map(u=>({...u})))}catch(u){console.error("[useSocialLinks] Save error:",u)}finally{r(!1)}},handleDiscard:()=>{s(i.map(u=>({...u})))},refresh:a}},kr=({platform:t})=>{const r=t.toLowerCase();return r.includes("linkedin")?e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"}),e.jsx("rect",{x:"2",y:"9",width:"4",height:"12"}),e.jsx("circle",{cx:"4",cy:"4",r:"2"})]}):r.includes("github")?e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"})}):r.includes("behance")?e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M9 8H5v8h4a4 4 0 0 0 0-8zM19 11h-4a2 2 0 0 0 4 0zM14 6h6"}),e.jsx("path",{d:"M5 12h4"})]}):r.includes("twitter")||r.includes("x")?e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4l11.733 16h4.267l-11.733 -16z"}),e.jsx("path",{d:"M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"})]}):r.includes("medium")?e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"6",cy:"12",rx:"4",ry:"4"}),e.jsx("ellipse",{cx:"15",cy:"12",rx:"2",ry:"4"}),e.jsx("ellipse",{cx:"21",cy:"12",rx:"1",ry:"4"})]}):e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),e.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]})},Sr=({label:t,error:r,style:i,className:o="",...n})=>e.jsxs("div",{className:o,style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-1)",width:"100%",fontFamily:"'Inter', sans-serif"},children:[t&&e.jsx("span",{className:"text-label",style:{fontSize:"12.5px",fontWeight:500,color:"var(--admin-text-secondary)"},children:t}),e.jsx("input",{style:{padding:"var(--admin-space-2) var(--admin-space-3)",border:r?"1px solid var(--admin-danger)":"1px solid var(--admin-border)",borderRadius:"var(--admin-radius-sm)",fontSize:"13.5px",color:"var(--admin-text)",background:"#FFFFFF",outline:"none",boxShadow:"var(--admin-shadow-sm)",transition:"border-color 0.15s ease",...i},onFocus:s=>{r||(s.currentTarget.style.borderColor="var(--admin-primary)")},onBlur:s=>{r||(s.currentTarget.style.borderColor="var(--admin-border)")},...n}),r&&e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-danger)",marginTop:"2px"},children:r})]}),Cr=({value:t,onChange:r,style:i,...o})=>e.jsx(Sr,{value:t,onChange:n=>r(n.target.value),style:{width:"100%",padding:"10px 16px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#F8FAFC",outline:"none",boxSizing:"border-box",transition:"all 0.15s ease",boxShadow:"none",...i},onFocus:n=>{n.currentTarget.style.borderColor="var(--admin-primary)",n.currentTarget.style.backgroundColor="#FFFFFF",n.currentTarget.style.boxShadow="0 0 0 3px rgba(124, 58, 237, 0.1)"},onBlur:n=>{n.currentTarget.style.borderColor="var(--admin-border)",n.currentTarget.style.backgroundColor="#F8FAFC",n.currentTarget.style.boxShadow="none"},...o}),zr=({style:t,...r})=>e.jsx("button",{type:"button",className:"hover-scale active-press",style:{display:"flex",alignItems:"center",justifyContent:"center",width:"36px",height:"36px",border:"1px solid var(--admin-border)",borderRadius:"50%",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease",boxShadow:"var(--admin-shadow-sm)",...t},onMouseOver:i=>{i.currentTarget.style.backgroundColor="var(--admin-surface)",i.currentTarget.style.color="var(--admin-primary)"},onMouseOut:i=>{i.currentTarget.style.backgroundColor="#FFFFFF",i.currentTarget.style.color="var(--admin-text-secondary)"},...r,children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),Tr=({style:t,...r})=>e.jsx("button",{type:"button",className:"hover-scale active-press",style:{display:"flex",alignItems:"center",justifyContent:"center",width:"36px",height:"36px",border:"1px solid var(--admin-border)",borderRadius:"50%",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease",boxShadow:"var(--admin-shadow-sm)",...t},onMouseOver:i=>{i.currentTarget.style.backgroundColor="#FEF2F2",i.currentTarget.style.borderColor="#FCA5A5",i.currentTarget.style.color="var(--admin-danger)"},onMouseOut:i=>{i.currentTarget.style.backgroundColor="#FFFFFF",i.currentTarget.style.borderColor="var(--admin-border)",i.currentTarget.style.color="var(--admin-text-secondary)"},...r,children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}),e.jsx("line",{x1:"10",y1:"11",x2:"10",y2:"17"}),e.jsx("line",{x1:"14",y1:"11",x2:"14",y2:"17"})]})}),Wr=({link:t,isLast:r=!1,onUrlChange:i,onEdit:o,onDelete:n})=>e.jsxs("div",{className:`social-link-row-card ${r?"is-last":""}`,children:[e.jsxs("div",{className:"social-platform-info",children:[e.jsx("div",{className:"social-platform-icon-box",children:e.jsx(kr,{platform:t.platform})}),e.jsx("span",{className:"social-platform-label",children:t.platform})]}),e.jsx("div",{className:"social-input-container",children:e.jsx(Cr,{value:t.url,placeholder:`Enter your ${t.platform} URL`,onChange:i,"aria-label":`${t.platform} URL`})}),e.jsxs("div",{className:"social-actions-container",children:[e.jsx(zr,{onClick:o,title:"Edit link metadata","aria-label":`Edit ${t.platform} Link`}),e.jsx(Tr,{onClick:n,title:"Delete link","aria-label":`Delete ${t.platform} Link`})]})]}),Ar=({title:t,description:r,icon:i,actionText:o,onAction:n,className:s="",style:a})=>e.jsxs("div",{className:`animate-fade-in ${s}`,style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"var(--admin-space-12) var(--admin-space-4)",textAlign:"center",background:"#FFFFFF",border:"1px dashed var(--admin-border)",borderRadius:"var(--admin-radius-lg)",fontFamily:"'Inter', sans-serif",gap:"var(--admin-space-3)",...a},children:[i&&e.jsx("div",{style:{color:"var(--admin-text-secondary)",opacity:.5,marginBottom:"var(--admin-space-2)"},children:i}),e.jsx("h3",{style:{margin:0,color:"var(--admin-text)",fontWeight:600,fontSize:"15px"},children:t}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"13px",maxWidth:"320px",lineHeight:1.5},children:r}),o&&n&&e.jsx(Z,{variant:"primary",size:"sm",onClick:n,style:{marginTop:"var(--admin-space-2)"},children:o})]}),Dr=({onAddClick:t})=>e.jsx(Ar,{title:"No Social Links Found",description:"You haven't added any social media links yet. Add your links to display them on your portfolio website.",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"48",height:"48",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}),e.jsx("path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"})]}),actionText:"Add Social Link",onAction:t,style:{padding:"48px 32px"}}),Rr=({links:t,onUrlChange:r,onEdit:i,onDelete:o,onAddClick:n})=>t.length===0?e.jsx(Dr,{onAddClick:n}):e.jsx("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"16px",boxShadow:"var(--admin-shadow-sm)",display:"flex",flexDirection:"column",width:"100%",boxSizing:"border-box",overflow:"hidden"},children:t.map((s,a)=>e.jsx(Wr,{link:s,isLast:a===t.length-1,onUrlChange:c=>r(s.id,c),onEdit:()=>i==null?void 0:i(s.id),onDelete:()=>o==null?void 0:o(s.id)},s.id))}),Be=({children:t,style:r,...i})=>e.jsx(Z,{variant:"primary",size:"md",style:{borderRadius:"12px",padding:"10px 24px",fontSize:"13.5px",fontWeight:600,...r},...i,children:t}),Lr=({style:t,...r})=>e.jsxs(Be,{style:{display:"inline-flex",alignItems:"center",gap:"8px",...t},...r,children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),e.jsx("span",{children:"Add New Link"})]}),Ir=({children:t,style:r,...i})=>e.jsx("button",{className:"hover-scale active-press",style:{padding:"10px 24px",border:"1px solid var(--admin-border)",borderRadius:"12px",backgroundColor:"#FFFFFF",color:"var(--admin-text)",fontSize:"13.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease",fontFamily:"'Inter', sans-serif",boxShadow:"var(--admin-shadow-sm)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:i.disabled?.6:1,...r},onMouseOver:o=>{i.disabled||(o.currentTarget.style.backgroundColor="var(--admin-surface)")},onMouseOut:o=>{i.disabled||(o.currentTarget.style.backgroundColor="#FFFFFF")},...i,children:t}),Br=({isDirty:t,onSave:r,onDiscard:i})=>e.jsxs("div",{style:{position:"sticky",bottom:0,margin:"32px -32px -32px -32px",padding:"16px 32px",backgroundColor:"#FFFFFF",borderTop:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"12px",zIndex:100,boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsx(Ir,{disabled:!t,onClick:i,style:{color:t?"var(--admin-text)":"var(--admin-text-secondary)",opacity:t?1:.6,cursor:t?"pointer":"not-allowed"},children:"Cancel"}),e.jsx(Be,{disabled:!t,onClick:r,style:{backgroundColor:t?"var(--admin-primary)":"rgba(124, 58, 237, 0.4)",cursor:t?"pointer":"not-allowed"},children:"Save Changes"})]}),se=({width:t="100%",height:r="16px",variant:i="text",className:o="",style:n})=>{const s=()=>i==="circle"?"50%":i==="rect"?"var(--admin-radius-sm)":"4px";return e.jsx("div",{className:`animate-pulse ${o}`,style:{width:typeof t=="number"?`${t}px`:t,height:typeof r=="number"?`${r}px`:r,borderRadius:s(),backgroundColor:"rgba(124, 58, 237, 0.08)",...n}})},Er=()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"16px",boxShadow:"var(--admin-shadow-sm)",width:"100%",boxSizing:"border-box",overflow:"hidden"},children:[1,2,3,4,5].map(t=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",padding:"16px 24px",borderBottom:t===5?"none":"1px solid var(--admin-border)",boxSizing:"border-box",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",width:"150px",flexShrink:0},children:[e.jsx(se,{variant:"circle",width:36,height:36}),e.jsx(se,{variant:"text",width:80,height:16})]}),e.jsx("div",{style:{flex:1},children:e.jsx(se,{variant:"rect",height:38})}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"8px",flexShrink:0},children:[e.jsx(se,{variant:"circle",width:36,height:36}),e.jsx(se,{variant:"circle",width:36,height:36})]})]},t))}),Ce=()=>{const{loading:t,links:r,updateLinkUrl:i,isDirty:o,handleSave:n,handleDiscard:s}=Fr(),a=()=>{console.log("[SocialLinksPage] Add New Link clicked")},c=p=>{console.log("[SocialLinksPage] Edit Link clicked for:",p)},l=p=>{console.log("[SocialLinksPage] Delete Link clicked for:",p)};return e.jsxs("div",{className:"social-links-container",children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"16px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"Social Links"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500,lineHeight:1.4},children:"Manage and update your links displayed on the portfolio."})]}),e.jsx(Lr,{onClick:a})]}),e.jsx(ve,{options:[{id:"portfolio",label:"Portfolio Settings"},{id:"social-links",label:"Social Links"},{id:"admin-access",label:"Admin Access"}],activeId:"social-links",onChange:p=>{const g=p==="portfolio"?"/admin/settings/portfolio":`/admin/settings/${p}`,h=window.location.pathname.startsWith("/ashok-portfolio")?`/ashok-portfolio${g}`:g;window.history.pushState(null,"",h),window.dispatchEvent(new PopStateEvent("popstate"))},style:{marginBottom:"var(--admin-space-2)",width:"100%"}}),t?e.jsx(Er,{}):e.jsx(Rr,{links:r,onUrlChange:i,onEdit:c,onDelete:l,onAddClick:a}),e.jsx(Br,{isDirty:o,onSave:n,onDiscard:s})]})},Mr={superAdmins:1,portfolioViewers:2,pendingInvitations:1,activeMembers:3},Nr=[{id:"u1",name:"Ashok Kumar",email:"ashok@portfolio.dev",avatarUrl:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",role:"Super Admin",status:"Active",lastLogin:"Today, 10:42 AM",permissions:["Dashboard","Inquiries","Testimonials","Resume Downloads","Analytics","Projects","Portfolio Configuration","Access Management"],joinedDate:"Oct 01, 2023",recentLogin:"Today · 10:42 AM",lastActivity:"Today · 10:45 AM",invitationAcceptedDate:"Oct 01, 2023",isYou:!0},{id:"u2",name:"Sarah Johnson",email:"sarah.johnson@designstudio.com",avatarUrl:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",role:"Portfolio Viewer",status:"Active",lastLogin:"Jan 14, 2024",permissions:["Dashboard","Inquiries","Testimonials","Resume Downloads","Analytics"],joinedDate:"Nov 10, 2023",recentLogin:"Jan 14, 2024 · 3:55 PM",lastActivity:"Jan 14, 2024",invitationAcceptedDate:"Nov 11, 2023",isYou:!1},{id:"u3",name:"Marcus Chen",email:"marcus@techcorp.io",avatarUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",role:"Portfolio Viewer",status:"Pending",lastLogin:"—",permissions:["Dashboard","Analytics"],joinedDate:"Jan 15, 2024",recentLogin:null,lastActivity:null,invitationAcceptedDate:null,isYou:!1}],me={async getSummary(){return Mr},async getMembers(t={}){let r=[...Nr];if(t.search){const i=t.search.toLowerCase().trim();r=r.filter(o=>o.name.toLowerCase().includes(i)||o.email.toLowerCase().includes(i))}return t.role&&t.role!=="All"&&(r=r.filter(i=>i.role===t.role)),t.status&&t.status!=="All"&&(r=r.filter(i=>i.status===t.status)),r},async inviteAdmin(t,r){return console.log(`[adminAccessService] Invited ${t} with role ${r}`),!0}},_r=()=>{const[t,r]=d.useState(!1),[i,o]=d.useState(null),[n,s]=d.useState([]),[a,c]=d.useState(""),[l,p]=d.useState("All"),[g,u]=d.useState("All"),[h,f]=d.useState(!1),[m,v]=d.useState(null),x=d.useCallback(async()=>{r(!0);try{const[y,C]=await Promise.all([me.getSummary(),me.getMembers({search:a,role:l,status:g})]);o(y),s(C)}catch(y){console.error("[useAdminAccess] Fetch error:",y)}finally{r(!1)}},[a,l,g]);return d.useEffect(()=>{x()},[x]),{loading:t,summary:i,members:n,search:a,setSearch:c,roleFilter:l,setRoleFilter:p,statusFilter:g,setStatusFilter:u,inviteModalOpen:h,setInviteModalOpen:f,detailsModalUser:m,setDetailsModalUser:v,refresh:x,handleInviteSubmit:async(y,C)=>{r(!0);try{await me.inviteAdmin(y,C),await x(),f(!1)}catch(F){console.error("[useAdminAccess] Invite submit error:",F)}finally{r(!1)}}}},Pr=({summary:t})=>{if(!t)return null;const r=[{label:"Super Admins",value:t.superAdmins,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"}),e.jsx("path",{d:"M3 20h18"})]})},{label:"Portfolio Viewers",value:t.portfolioViewers,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})},{label:"Pending Invitations",value:t.pendingInvitations,icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}),e.jsx("polyline",{points:"22,6 12,13 2,6"})]})},{label:"Active Members",value:t.activeMembers,icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("circle",{cx:"12",cy:"12",r:"10"})})}];return e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"var(--admin-space-4)",width:"100%",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:r.map(i=>e.jsxs("div",{style:{backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderRadius:"16px",padding:"24px",display:"flex",alignItems:"center",gap:"20px",boxSizing:"border-box",boxShadow:"var(--admin-shadow-sm)",transition:"all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"},onMouseOver:o=>{o.currentTarget.style.transform="translateY(-2px)",o.currentTarget.style.boxShadow="0 10px 20px -5px rgba(0, 0, 0, 0.05)"},onMouseOut:o=>{o.currentTarget.style.transform="translateY(0)",o.currentTarget.style.boxShadow="var(--admin-shadow-sm)"},children:[e.jsx("div",{style:{width:"46px",height:"46px",borderRadius:"50%",backgroundColor:"rgba(124, 58, 237, 0.05)",color:"var(--admin-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:i.icon}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("span",{style:{fontSize:"26px",fontWeight:800,color:"var(--admin-text)",letterSpacing:"-0.02em",lineHeight:1},children:i.value}),e.jsx("span",{style:{fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:i.label})]})]},i.label))})},Or=({search:t,setSearch:r,roleFilter:i,setRoleFilter:o,statusFilter:n,setStatusFilter:s,onRefresh:a})=>e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"var(--admin-space-4)",padding:"16px 20px",backgroundColor:"#FFFFFF",borderRadius:"var(--admin-radius-md) var(--admin-radius-md) 0 0",border:"1px solid var(--admin-border)",borderBottom:"none",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"12px",flex:1},children:[e.jsxs("div",{style:{position:"relative",width:"100%",maxWidth:"240px",boxSizing:"border-box"},children:[e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",placeholder:"Search members...",value:t,onChange:c=>r(c.target.value),style:{width:"100%",padding:"8px 12px 8px 36px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",boxSizing:"border-box",outline:"none",transition:"border-color 0.15s ease"},onFocus:c=>c.currentTarget.style.borderColor="var(--admin-primary)",onBlur:c=>c.currentTarget.style.borderColor="var(--admin-border)"})]}),e.jsxs("select",{value:i,onChange:c=>o(c.target.value),style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:"#FFFFFF",cursor:"pointer",outline:"none",minWidth:"110px"},children:[e.jsx("option",{value:"All",children:"Role"}),e.jsx("option",{value:"Super Admin",children:"Super Admin"}),e.jsx("option",{value:"Admin",children:"Admin"}),e.jsx("option",{value:"Portfolio Viewer",children:"Portfolio Viewer"})]}),e.jsxs("select",{value:n,onChange:c=>s(c.target.value),style:{padding:"8px 12px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text-secondary)",backgroundColor:"#FFFFFF",cursor:"pointer",outline:"none",minWidth:"110px"},children:[e.jsx("option",{value:"All",children:"Status"}),e.jsx("option",{value:"Active",children:"Active"}),e.jsx("option",{value:"Pending",children:"Pending"}),e.jsx("option",{value:"Inactive",children:"Inactive"})]})]}),e.jsx("button",{onClick:a,className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"8px",border:"1px solid var(--admin-border)",borderRadius:"8px",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M23 4v6h-6"}),e.jsx("path",{d:"M20.49 15a9 9 0 1 1-2.12-9.36L23 10"})]})})]}),Vr=({user:t,onViewDetails:r})=>{const i=e.jsx("div",{style:{width:"36px",height:"36px",borderRadius:"50%",backgroundColor:"#F1F5F9",border:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),o=()=>{let a="#10B981",c="rgba(16, 185, 129, 0.06)",l="#10B981";return t.status==="Pending"?(a="#F59E0B",c="rgba(245, 158, 11, 0.06)",l="#F59E0B"):t.status==="Inactive"&&(a="#EF4444",c="rgba(239, 68, 68, 0.06)",l="#EF4444"),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"4px 10px",borderRadius:"12px",backgroundColor:c,color:l,fontSize:"11.5px",fontWeight:600,whiteSpace:"nowrap"},children:[e.jsx("span",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:a}}),t.status]})},n=()=>{let a=null,c="rgba(124, 58, 237, 0.08)",l="var(--admin-primary)";return t.role==="Super Admin"?a=e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{marginRight:"4px"},children:e.jsx("path",{d:"M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"})}):(c="rgba(59, 130, 246, 0.08)",l="#2563EB",a=e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{marginRight:"4px"},children:e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"})})),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",padding:"4px 10px",borderRadius:"12px",backgroundColor:c,color:l,fontSize:"11.5px",fontWeight:600,whiteSpace:"nowrap"},children:[a,t.role]})},s=()=>{if(t.role==="Super Admin")return e.jsx("span",{style:{fontSize:"11px",fontWeight:600,color:"var(--admin-primary)",backgroundColor:"rgba(124, 58, 237, 0.08)",padding:"4px 10px",borderRadius:"12px",whiteSpace:"nowrap"},children:"Full Access"});t.permissions.slice(0,2);const a=t.permissions.includes("Testimonials")?3:2,c=t.permissions.slice(0,a),l=t.permissions.length-a;return e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:"6px",alignItems:"center"},children:[c.map(p=>{let g=p;return p==="Inquiries"&&(g="Inquiries"),e.jsx("span",{style:{fontSize:"11px",fontWeight:500,color:"var(--admin-text-secondary)",backgroundColor:"#F1F5F9",padding:"4px 8px",borderRadius:"6px",whiteSpace:"nowrap"},children:g},p)}),l>0&&e.jsxs("span",{style:{fontSize:"11px",fontWeight:600,color:"var(--admin-primary)",backgroundColor:"rgba(124, 58, 237, 0.05)",padding:"4px 8px",borderRadius:"6px",whiteSpace:"nowrap"},children:["+",l]})]})};return e.jsxs("tr",{style:{borderBottom:"1px solid var(--admin-border)",transition:"background-color 0.15s ease"},onMouseOver:a=>a.currentTarget.style.backgroundColor="rgba(248, 250, 252, 0.6)",onMouseOut:a=>a.currentTarget.style.backgroundColor="transparent",children:[e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[t.avatarUrl?e.jsx("img",{src:t.avatarUrl,alt:t.name,style:{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)",flexShrink:0}}):i,e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsxs("span",{style:{fontWeight:700,fontSize:"13.5px",color:"var(--admin-text)",whiteSpace:"nowrap"},children:[t.name,t.isYou&&e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-primary)",fontWeight:500,marginLeft:"6px"},children:"(You)"})]}),e.jsx("span",{style:{fontSize:"11.5px",color:"var(--admin-text-secondary)",fontWeight:500,whiteSpace:"nowrap"},children:t.email})]})]})}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:n()}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:o()}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)",fontSize:"13px",fontWeight:500,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:t.lastLogin}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:s()}),e.jsx("td",{style:{padding:"16px var(--admin-space-4)"},children:e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"8px"},children:[e.jsxs("button",{onClick:()=>r(t),className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"6px 12px",border:"1px solid #E2E8F0",borderRadius:"20px",backgroundColor:"#FFFFFF",color:"#0F172A",fontSize:"12px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease",whiteSpace:"nowrap"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]}),e.jsx("span",{children:"Details"})]}),!t.isYou&&e.jsx("button",{className:"hover-scale active-press",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"28px",height:"28px",border:"1px solid #E2E8F0",borderRadius:"50%",backgroundColor:"#FFFFFF",color:"var(--admin-text-secondary)",cursor:"pointer",transition:"all 0.15s ease"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"1"}),e.jsx("circle",{cx:"12",cy:"5",r:"1"}),e.jsx("circle",{cx:"12",cy:"19",r:"1"})]})})]})})]})},Ur=({members:t,onViewDetails:r})=>e.jsx("div",{style:{width:"100%",overflowX:"auto",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",boxSizing:"border-box",borderRadius:"0"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsx("tr",{style:{backgroundColor:"#F8FAFC",borderBottom:"1px solid var(--admin-border)"},children:["Member","Role","Status","Last Login","Permissions","Actions"].map(i=>e.jsx("th",{style:{padding:"12px var(--admin-space-4)",fontSize:"12px",fontWeight:600,color:"var(--admin-text-secondary)",whiteSpace:"nowrap"},children:i},i))})}),e.jsx("tbody",{children:t.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,style:{padding:"48px var(--admin-space-4)",textAlign:"center",color:"var(--admin-text-secondary)",fontSize:"14px"},children:"No administrative members match active filter selections."})}):t.map(i=>e.jsx(Vr,{user:i,onViewDetails:r},i.id))})]})}),Hr=({isOpen:t,onClose:r,onSubmit:i})=>{const[o,n]=d.useState(""),[s,a]=d.useState("Portfolio Viewer");if(d.useEffect(()=>{const g=u=>{u.key==="Escape"&&r()};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[r]),!t)return null;const l=(()=>{switch(s){case"Super Admin":return{title:"👑 Super Admin",desc:"Full access to all features and settings"};case"Admin":return{title:"⚙ Admin",desc:"Can manage dashboard and team members"};case"Portfolio Viewer":return{title:"👁 Portfolio Viewer",desc:"Portfolio Viewers have read-only access and cannot modify any data. They can view Dashboard, Inquiries, Testimonials, Resume Downloads and Analytics."};default:return null}})(),p=g=>{g.preventDefault(),o.trim()&&(i(o,s),n(""))};return e.jsxs("div",{onClick:r,style:{position:"fixed",inset:0,backgroundColor:"rgba(15, 23, 42, 0.45)",backdropFilter:"blur(4px)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"var(--admin-space-4)",boxSizing:"border-box",animation:"inviteFadeIn 200ms ease-out"},children:[e.jsxs("div",{onClick:g=>g.stopPropagation(),style:{width:"100%",maxWidth:"520px",backgroundColor:"#FFFFFF",borderRadius:"16px",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.15)",display:"flex",flexDirection:"column",maxHeight:"90vh",fontFamily:"'Inter', sans-serif",boxSizing:"border-box",overflow:"hidden",animation:"inviteScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)"},children:[e.jsxs("div",{style:{padding:"20px 24px",borderBottom:"1px solid #EEF2FF",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("h2",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"var(--admin-text)"},children:"Invite Admin"}),e.jsx("p",{style:{margin:0,fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Add a new team member to manage your portfolio."})]}),e.jsx("button",{onClick:r,className:"hover-scale active-press",style:{background:"none",border:"1px solid #E2E8F0",borderRadius:"50%",width:"30px",height:"30px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--admin-text-secondary)",transition:"all 0.15s ease"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("form",{onSubmit:p,style:{padding:"24px",display:"flex",flexDirection:"column",gap:"20px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"12px",fontWeight:700,color:"#0F172A",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Email Address"}),e.jsx("input",{type:"email",required:!0,placeholder:"Enter email address...",value:o,onChange:g=>n(g.target.value),style:{width:"100%",padding:"10px 14px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",outline:"none",boxSizing:"border-box",transition:"border-color 0.15s ease"},onFocus:g=>g.currentTarget.style.borderColor="var(--admin-primary)",onBlur:g=>g.currentTarget.style.borderColor="var(--admin-border)"})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"12px",fontWeight:700,color:"#0F172A",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Role"}),e.jsxs("select",{value:s,onChange:g=>a(g.target.value),style:{width:"100%",padding:"10px 14px",border:"1px solid var(--admin-border)",borderRadius:"8px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",outline:"none",cursor:"pointer",boxSizing:"border-box"},children:[e.jsx("option",{value:"Super Admin",children:"Super Admin"}),e.jsx("option",{value:"Admin",children:"Admin"}),e.jsx("option",{value:"Portfolio Viewer",children:"Portfolio Viewer"})]})]}),l&&e.jsxs("div",{style:{padding:"16px",backgroundColor:"rgba(124, 58, 237, 0.04)",border:"1px solid rgba(124, 58, 237, 0.08)",borderRadius:"8px",display:"flex",flexDirection:"column",gap:"4px",boxSizing:"border-box",animation:"roleFade 200ms ease-out"},children:[e.jsx("span",{style:{fontSize:"13px",fontWeight:700,color:"var(--admin-primary)"},children:l.title}),e.jsx("p",{style:{margin:0,fontSize:"12px",color:"var(--admin-text-secondary)",fontWeight:500,lineHeight:1.5},children:l.desc})]}),e.jsxs("div",{style:{marginTop:"10px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"12px",boxSizing:"border-box"},children:[e.jsx("button",{type:"button",onClick:r,className:"hover-scale active-press",style:{padding:"10px 20px",border:"none",borderRadius:"8px",backgroundColor:"#F1F5F9",color:"#0F172A",fontSize:"13.5px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:g=>g.currentTarget.style.backgroundColor="#E2E8F0",onMouseOut:g=>g.currentTarget.style.backgroundColor="#F1F5F9",children:"Cancel"}),e.jsxs("button",{type:"submit",className:"hover-scale active-press",style:{padding:"10px 20px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13.5px",fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"8px",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"22",y1:"2",x2:"11",y2:"13"}),e.jsx("polygon",{points:"22 2 15 22 11 13 2 9 22 2"})]}),e.jsx("span",{children:"Send Invitation"})]})]})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes inviteFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes inviteScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes roleFade {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}})]})},$r=({user:t,onClose:r})=>{if(d.useEffect(()=>{const a=c=>{c.key==="Escape"&&r()};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[r]),!t)return null;const i=e.jsx("div",{style:{width:"56px",height:"56px",borderRadius:"50%",backgroundColor:"#F1F5F9",border:"1px solid var(--admin-border)",display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8",flexShrink:0},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),o=()=>{let a="#10B981",c="rgba(16, 185, 129, 0.06)",l="#10B981";return t.status==="Pending"?(a="#F59E0B",c="rgba(245, 158, 11, 0.06)",l="#F59E0B"):t.status==="Inactive"&&(a="#EF4444",c="rgba(239, 68, 68, 0.06)",l="#EF4444"),e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"5px",padding:"2px 8px",borderRadius:"10px",backgroundColor:c,color:l,fontSize:"11px",fontWeight:600},children:[e.jsx("span",{style:{width:"5px",height:"5px",borderRadius:"50%",backgroundColor:a}}),t.status]})},n=()=>{let a="rgba(124, 58, 237, 0.08)",c="var(--admin-primary)";return t.role!=="Super Admin"&&(a="rgba(59, 130, 246, 0.08)",c="#2563EB"),e.jsx("span",{style:{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:"10px",backgroundColor:a,color:c,fontSize:"11px",fontWeight:600},children:t.role})},s=["Dashboard","Inquiries","Testimonials","Resume Downloads","Analytics","Projects","Portfolio Configuration","Access Management"];return e.jsxs("div",{onClick:r,style:{position:"fixed",inset:0,backgroundColor:"rgba(15, 23, 42, 0.45)",backdropFilter:"blur(4px)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:"var(--admin-space-4)",boxSizing:"border-box",animation:"detailsFadeIn 200ms ease-out"},children:[e.jsxs("div",{onClick:a=>a.stopPropagation(),style:{width:"100%",maxWidth:"720px",backgroundColor:"#FFFFFF",borderRadius:"16px",boxShadow:"0 25px 50px -12px rgba(0, 0, 0, 0.15)",display:"flex",flexDirection:"column",maxHeight:"90vh",fontFamily:"'Inter', sans-serif",boxSizing:"border-box",overflow:"hidden",animation:"detailsScaleUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1)"},children:[e.jsxs("div",{style:{padding:"20px 24px",borderBottom:"1px solid #EEF2FF",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[e.jsx("h2",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"var(--admin-text)"},children:"Member Details"}),e.jsx("p",{style:{margin:0,fontSize:"12.5px",color:"var(--admin-text-secondary)",fontWeight:500},children:"View permissions and activity for this team member."})]}),e.jsx("button",{onClick:r,className:"hover-scale active-press",style:{background:"none",border:"1px solid #E2E8F0",borderRadius:"50%",width:"30px",height:"30px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"var(--admin-text-secondary)",transition:"all 0.15s ease"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{style:{padding:"24px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"24px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{padding:"20px 24px",backgroundColor:"rgba(248, 250, 252, 0.6)",border:"1px solid var(--admin-border)",borderRadius:"12px",display:"flex",flexDirection:"column",gap:"16px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px"},children:[t.avatarUrl?e.jsx("img",{src:t.avatarUrl,alt:t.name,style:{width:"56px",height:"56px",borderRadius:"50%",objectFit:"cover",border:"1px solid var(--admin-border)",flexShrink:0}}):i,e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"},children:[e.jsx("h3",{style:{margin:0,fontSize:"16.5px",fontWeight:700,color:"var(--admin-text)"},children:t.name}),n(),o()]}),e.jsx("span",{style:{fontSize:"13px",color:"var(--admin-primary)",fontWeight:500},children:t.email})]})]}),e.jsxs("div",{style:{borderTop:"1px solid var(--admin-border)",paddingTop:"14px",display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"12px",boxSizing:"border-box"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"},children:"Joined Date"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.joinedDate})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"},children:"Last Login"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.lastLogin})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"},children:"Status"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.status})]})]})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{border:"1px solid var(--admin-border)",borderRadius:"12px",padding:"20px",display:"flex",flexDirection:"column",gap:"14px",boxSizing:"border-box"},children:[e.jsx("h4",{style:{margin:0,fontSize:"11px",fontWeight:700,color:"var(--admin-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase"},children:"Permission Overview"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"10px"},children:s.map(a=>{const c=t.role==="Super Admin"||t.permissions.includes(a);return e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx("span",{style:{fontSize:"13px",color:"var(--admin-text)",fontWeight:500},children:a}),c?e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"11.5px",color:"#10B981",fontWeight:600},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),e.jsx("span",{children:"View"})]}):e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"11.5px",color:"#94A3B8",fontWeight:500},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]}),e.jsx("span",{children:"No Access"})]})]},a)})})]}),e.jsxs("div",{style:{border:"1px solid var(--admin-border)",borderRadius:"12px",padding:"20px",display:"flex",flexDirection:"column",gap:"14px",boxSizing:"border-box"},children:[e.jsx("h4",{style:{margin:0,fontSize:"11px",fontWeight:700,color:"var(--admin-text-secondary)",letterSpacing:"0.05em",textTransform:"uppercase"},children:"Activity"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Recent Login"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.recentLogin||"—"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Last Active"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.lastActivity||"—"})]}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"11px",color:"var(--admin-text-secondary)",fontWeight:500},children:"Invitation Accepted"}),e.jsx("div",{style:{fontSize:"13px",fontWeight:600,color:"var(--admin-text)",marginTop:"2px"},children:t.invitationAcceptedDate||"—"})]})]})]})]})]}),e.jsxs("div",{style:{padding:"16px 24px",backgroundColor:"#FFFFFF",borderTop:"1px solid #EEF2FF",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{disabled:t.isYou,className:t.isYou?"":"hover-scale active-press",style:{padding:"10px 18px",border:"1px solid #EF4444",borderRadius:"8px",backgroundColor:"transparent",color:"#EF4444",fontSize:"13px",fontWeight:600,cursor:t.isYou?"not-allowed":"pointer",opacity:t.isYou?.4:1,transition:"all 0.15s ease"},onMouseOver:a=>{t.isYou||(a.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.05)")},onMouseOut:a=>{t.isYou||(a.currentTarget.style.backgroundColor="transparent")},children:"Deactivate"}),e.jsx("button",{disabled:t.isYou,className:t.isYou?"":"hover-scale active-press",style:{padding:"10px 18px",border:"none",borderRadius:"8px",backgroundColor:"#EF4444",color:"#FFFFFF",fontSize:"13px",fontWeight:600,cursor:t.isYou?"not-allowed":"pointer",opacity:t.isYou?.4:1,transition:"all 0.15s ease"},onMouseOver:a=>{t.isYou||(a.currentTarget.style.backgroundColor="#DC2626")},onMouseOut:a=>{t.isYou||(a.currentTarget.style.backgroundColor="#EF4444")},children:"Remove Access"})]}),e.jsx("button",{onClick:r,className:"hover-scale active-press",style:{padding:"10px 20px",border:"none",borderRadius:"8px",backgroundColor:"#F1F5F9",color:"#0F172A",fontSize:"13px",fontWeight:600,cursor:"pointer",transition:"all 0.15s ease"},onMouseOver:a=>a.currentTarget.style.backgroundColor="#E2E8F0",onMouseOut:a=>a.currentTarget.style.backgroundColor="#F1F5F9",children:"Close"})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes detailsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes detailsScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}})]})},ze=()=>{const{summary:t,members:r,search:i,setSearch:o,roleFilter:n,setRoleFilter:s,statusFilter:a,setStatusFilter:c,inviteModalOpen:l,setInviteModalOpen:p,detailsModalUser:g,setDetailsModalUser:u,refresh:h,handleInviteSubmit:f}=_r();return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-6)",width:"100%",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:"16px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"Access Management"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500,lineHeight:1.4},children:"Manage users who can access the Portfolio Admin Dashboard and assign their access roles."})]}),e.jsxs("button",{onClick:()=>p(!0),className:"hover-scale active-press animate-glow",style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"10px 20px",border:"none",borderRadius:"8px",backgroundColor:"var(--admin-primary)",color:"#FFFFFF",fontSize:"13.5px",fontWeight:600,cursor:"pointer",boxShadow:"var(--admin-shadow-sm)",transition:"all 0.15s ease"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("line",{x1:"19",y1:"8",x2:"19",y2:"14"}),e.jsx("line",{x1:"22",y1:"11",x2:"16",y2:"11"})]}),e.jsx("span",{children:"Invite Admin"})]})]}),e.jsx(ve,{options:[{id:"portfolio",label:"Portfolio Settings"},{id:"social-links",label:"Social Links"},{id:"admin-access",label:"Admin Access"}],activeId:"admin-access",onChange:m=>{const v=m==="portfolio"?"/admin/settings/portfolio":`/admin/settings/${m}`,j=window.location.pathname.startsWith("/ashok-portfolio")?`/ashok-portfolio${v}`:v;window.history.pushState(null,"",j),window.dispatchEvent(new PopStateEvent("popstate"))},style:{marginBottom:"var(--admin-space-2)",width:"100%"}}),e.jsx(Pr,{summary:t}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx(Or,{search:i,setSearch:o,roleFilter:n,setRoleFilter:s,statusFilter:a,setStatusFilter:c,onRefresh:h}),e.jsx(Ur,{members:r,onViewDetails:u}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",backgroundColor:"#FFFFFF",border:"1px solid var(--admin-border)",borderTop:"none",borderRadius:"0 0 var(--admin-radius-md) var(--admin-radius-md)",boxSizing:"border-box",fontSize:"13px",color:"var(--admin-text-secondary)"},children:[e.jsxs("div",{children:["Showing ",e.jsx("strong",{style:{color:"var(--admin-text)"},children:r.length})," members"]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:"6px",color:"var(--admin-text-secondary)",fontWeight:500},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",style:{opacity:.8},children:e.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})}),e.jsx("span",{children:"Access changes take effect immediately."})]})]})]}),e.jsx(Hr,{isOpen:l,onClose:()=>p(!1),onSubmit:f}),e.jsx($r,{user:g,onClose:()=>u(null)})]})},Yr=({onAddClick:t})=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"var(--admin-space-2)",flexWrap:"wrap",gap:"var(--admin-space-4)"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h1",{style:{margin:0,fontSize:"28px",fontWeight:700,color:"var(--admin-text)",letterSpacing:"-0.02em"},children:"🏆 Certifications"}),e.jsx("p",{style:{margin:0,color:"var(--admin-text-secondary)",fontSize:"14px",fontWeight:500},children:"Manage and publish professional certifications displayed on your portfolio."})]}),e.jsxs(Z,{variant:"primary",onClick:t,style:{backgroundColor:"#7C5CFF",borderRadius:"var(--admin-radius-sm)",display:"inline-flex",alignItems:"center",gap:"8px"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),e.jsx("span",{children:"Add Certification"})]})]}),Kr=({total:t,published:r,draft:i,featured:o})=>{const n=[{title:"Total Certifications",value:t,helperText:"All registered credentials",iconColor:"#7C5CFF",iconBg:"rgba(124, 92, 255, 0.1)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"8",r:"6"}),e.jsx("path",{d:"M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"})]})},{title:"Published",value:r,helperText:"Live on your portfolio",iconColor:"#22C55E",iconBg:"rgba(34, 197, 94, 0.1)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),e.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]})},{title:"Draft",value:i,helperText:"Work in progress",iconColor:"#F59E0B",iconBg:"rgba(245, 158, 11, 0.1)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"})]})},{title:"Featured",value:o,helperText:"Highlighted at the top",iconColor:"#A78BFA",iconBg:"rgba(167, 139, 250, 0.1)",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"})})}];return e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:"var(--admin-space-4)",width:"100%",boxSizing:"border-box"},children:n.map((s,a)=>e.jsxs(te,{hoverEffect:!0,style:{padding:"20px"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:"13px",color:"var(--admin-text-secondary)",fontWeight:500,fontFamily:"'Inter', sans-serif"},children:s.title}),e.jsx("h2",{style:{margin:"6px 0 0 0",fontWeight:750,color:"var(--admin-text)",fontSize:"28px",fontFamily:"'Inter', sans-serif",letterSpacing:"-0.02em"},children:s.value})]}),e.jsx("div",{style:{width:"42px",height:"42px",borderRadius:"10px",backgroundColor:s.iconBg,color:s.iconColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:s.icon})]}),e.jsx("div",{style:{marginTop:"12px",fontSize:"12px",color:"var(--admin-text-secondary)",fontWeight:500,fontFamily:"'Inter', sans-serif"},children:s.helperText})]},a))})},qr=({searchVal:t,setSearchVal:r,filterVal:i,setFilterVal:o,sortVal:n,setSortVal:s})=>{const[a,c]=d.useState(!1);return e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"16px",padding:"16px",background:"#FFFFFF",borderRadius:"var(--admin-radius-md) var(--admin-radius-md) 0 0",border:"1px solid var(--admin-border)",boxSizing:"border-box",width:"100%"},children:[e.jsxs("div",{style:{position:"relative",flex:1,boxSizing:"border-box"},children:[e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsx("input",{type:"text",placeholder:"Search certifications by title, organization, or skills...",value:t,onChange:l=>r(l.target.value),onFocus:()=>c(!0),onBlur:()=>c(!1),style:{width:"100%",height:"40px",padding:"10px 12px 10px 38px",border:a?"1px solid var(--admin-primary)":"1px solid var(--admin-border)",borderRadius:"10px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",boxSizing:"border-box",outline:"none",boxShadow:a?"0 0 0 3px rgba(124, 92, 255, 0.15)":"none",transition:"all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"}})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",flexShrink:0},children:[e.jsxs("div",{style:{position:"relative",display:"inline-flex",alignItems:"center"},children:[e.jsxs("select",{value:i,onChange:l=>o(l.target.value),style:{appearance:"none",WebkitAppearance:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",height:"40px",padding:"0 36px 0 16px",border:"1px solid var(--admin-border)",borderRadius:"10px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",fontWeight:550,cursor:"pointer",boxSizing:"border-box",outline:"none",transition:"all 0.2s ease"},onFocus:l=>{l.currentTarget.style.borderColor="var(--admin-primary)",l.currentTarget.style.boxShadow="0 0 0 3px rgba(124, 92, 255, 0.15)"},onBlur:l=>{l.currentTarget.style.borderColor="var(--admin-border)",l.currentTarget.style.boxShadow="none"},children:[e.jsx("option",{value:"all",children:"All Statuses"}),e.jsx("option",{value:"published",children:"Published"}),e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"featured",children:"Featured"})]}),e.jsx("span",{style:{position:"absolute",right:"12px",pointerEvents:"none",display:"flex",alignItems:"center",color:"var(--admin-text-secondary)"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),e.jsxs("div",{style:{position:"relative",display:"inline-flex",alignItems:"center"},children:[e.jsxs("select",{value:n,onChange:l=>s(l.target.value),style:{appearance:"none",WebkitAppearance:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",height:"40px",padding:"0 36px 0 16px",border:"1px solid var(--admin-border)",borderRadius:"10px",fontSize:"13.5px",color:"var(--admin-text)",backgroundColor:"#FFFFFF",fontWeight:550,cursor:"pointer",boxSizing:"border-box",outline:"none",transition:"all 0.2s ease"},onFocus:l=>{l.currentTarget.style.borderColor="var(--admin-primary)",l.currentTarget.style.boxShadow="0 0 0 3px rgba(124, 92, 255, 0.15)"},onBlur:l=>{l.currentTarget.style.borderColor="var(--admin-border)",l.currentTarget.style.boxShadow="none"},children:[e.jsx("option",{value:"newest",children:"Newest First"}),e.jsx("option",{value:"oldest",children:"Oldest First"}),e.jsx("option",{value:"title_asc",children:"Title A–Z"}),e.jsx("option",{value:"title_desc",children:"Title Z–A"})]}),e.jsx("span",{style:{position:"absolute",right:"12px",pointerEvents:"none",display:"flex",alignItems:"center",color:"var(--admin-text-secondary)"},children:e.jsx("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]})]})]})},Gr=({certifications:t,onEditClick:r,onDeleteClick:i,isFiltered:o,onClearFilters:n})=>{const[s,a]=d.useState([]),[c,l]=d.useState(null),p=h=>{a(f=>f.includes(h)?f.filter(m=>m!==h):[...f,h])},g=()=>{s.length===t.length?a([]):a(t.map(h=>h.id))};if(!t||t.length===0)return o?e.jsx(te,{style:{padding:"60px 40px",textAlign:"center",backgroundColor:"#FFFFFF"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"80px",height:"80px",borderRadius:"50%",backgroundColor:"var(--admin-surface)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",opacity:.8},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"40",height:"40",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"var(--admin-text)"},children:"No matching certifications"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"var(--admin-text-secondary)",maxWidth:"320px"},children:"We couldn't find any certifications matching your search/filters. Try clearing your search term or filter parameters."})]}),n&&e.jsx(Z,{variant:"primary",onClick:n,style:{backgroundColor:"#7C5CFF",borderRadius:"var(--admin-radius-sm)",marginTop:"8px"},children:"Clear Search & Filters"})]})}):e.jsx(te,{style:{padding:"60px 40px",textAlign:"center",backgroundColor:"#FFFFFF"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"},children:[e.jsx("div",{style:{width:"80px",height:"80px",borderRadius:"50%",backgroundColor:"var(--admin-surface)",color:"var(--admin-text-secondary)",display:"flex",alignItems:"center",justifyContent:"center",opacity:.8},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"40",height:"40",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6"}),e.jsx("path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18"}),e.jsx("path",{d:"M4 22h16"}),e.jsx("path",{d:"M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"}),e.jsx("path",{d:"M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:700,color:"var(--admin-text)"},children:"No certifications found"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"var(--admin-text-secondary)",maxWidth:"320px"},children:"Add your first credential to showcase your professional certifications on your portfolio."})]}),e.jsxs(Z,{variant:"primary",onClick:()=>console.log("TODO: Add Certification"),style:{backgroundColor:"#7C5CFF",borderRadius:"var(--admin-radius-sm)",marginTop:"8px"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"12",y1:"5",x2:"12",y2:"19"}),e.jsx("line",{x1:"5",y1:"12",x2:"19",y2:"12"})]}),"Add Certification"]})]})});const u=h=>{switch(h){case"Published":case"published":case"Featured":return{bg:"rgba(16, 185, 129, 0.08)",color:"#10B981",border:"1px solid rgba(16, 185, 129, 0.15)"};case"Draft":case"draft":return{bg:"rgba(245, 158, 11, 0.08)",color:"#F59E0B",border:"1px solid rgba(245, 158, 11, 0.15)"};case"Expired":return{bg:"rgba(239, 68, 68, 0.08)",color:"#EF4444",border:"1px solid rgba(239, 68, 68, 0.15)"};case"Archived":return{bg:"rgba(100, 116, 139, 0.08)",color:"#64748B",border:"1px solid rgba(100, 116, 139, 0.15)"}}};return e.jsxs("div",{className:"admin-table-container",style:{background:"#FFFFFF",border:"1.5px solid rgba(226, 232, 240, 0.8)",borderTop:"none",borderRadius:"0 0 16px 16px",width:"100%",boxSizing:"border-box",overflow:"hidden"},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
        .admin-table-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.8);
          border-radius: 99px;
        }
        .admin-table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
      `}}),e.jsx("div",{className:"admin-table-scroll-wrapper",style:{width:"100%",overflowX:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",textAlign:"left",fontFamily:"'Inter', sans-serif"},children:[e.jsx("thead",{children:e.jsxs("tr",{style:{backgroundColor:"rgba(248, 250, 252, 0.7)",borderBottom:"1.5px solid rgba(226, 232, 240, 0.8)",height:"48px"},children:[e.jsx("th",{style:{padding:"0 24px",width:"40px",verticalAlign:"middle",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:e.jsx("input",{type:"checkbox",checked:s.length===t.length,onChange:g,style:{cursor:"pointer",width:"16px",height:"16px",borderRadius:"4px",border:"1.5px solid rgba(203, 213, 225, 1)"}})}),e.jsx("th",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",padding:"14px 16px",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:"Certificate"}),e.jsx("th",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",padding:"14px 16px",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:"Organization"}),e.jsx("th",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",padding:"14px 16px",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:"Issued"}),e.jsx("th",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",padding:"14px 16px",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:"Status"}),e.jsx("th",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.06em",padding:"14px 24px",textAlign:"right",position:"sticky",top:0,zIndex:10,backgroundColor:"#F8FAFC"},children:"Actions"})]})}),e.jsx("tbody",{children:t.map(h=>{const f=u(h.status),m=s.includes(h.id),v=c===h.id;return e.jsxs("tr",{onMouseEnter:()=>l(h.id),onMouseLeave:()=>l(null),style:{borderBottom:"1px solid rgba(226, 232, 240, 0.6)",backgroundColor:m?"rgba(124, 92, 255, 0.03)":v?"rgba(124, 92, 255, 0.015)":"transparent",transition:"all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",height:"60px"},children:[e.jsx("td",{style:{padding:"0 24px",verticalAlign:"middle"},children:e.jsx("input",{type:"checkbox",checked:m,onChange:()=>p(h.id),style:{cursor:"pointer",width:"16px",height:"16px",borderRadius:"4px",border:"1.5px solid rgba(203, 213, 225, 1)"}})}),e.jsx("td",{style:{padding:"12px 16px",verticalAlign:"middle"},children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px"},children:[e.jsx("span",{style:{fontSize:"14px",fontWeight:700,color:"#0F172A"},children:h.title}),e.jsx("a",{href:"/certifications",onClick:x=>{x.preventDefault(),console.log("TODO: Navigate to preview full cert")},style:{fontSize:"12px",fontWeight:600,color:"#7C5CFF",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"2px",width:"fit-content"},children:"View credential →"})]})}),e.jsx("td",{style:{padding:"12px 16px",verticalAlign:"middle"},children:e.jsx("span",{style:{fontSize:"13.5px",color:"#475569",fontWeight:650},children:h.issuer})}),e.jsx("td",{style:{padding:"12px 16px",verticalAlign:"middle"},children:e.jsx("span",{style:{fontSize:"13.5px",color:"#475569",fontWeight:600},children:h.issueDate})}),e.jsx("td",{style:{padding:"12px 16px",verticalAlign:"middle"},children:e.jsx("span",{style:{fontSize:"11px",fontWeight:700,height:"24px",padding:"0 12px",borderRadius:"999px",backgroundColor:f.bg,color:f.color,border:f.border,textTransform:"uppercase",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box"},children:h.status})}),e.jsx("td",{style:{padding:"12px 24px",verticalAlign:"middle",textAlign:"right"},children:e.jsxs("div",{style:{display:"flex",gap:"8px",justifyContent:"flex-end"},children:[e.jsx("button",{type:"button",title:"Preview",onClick:()=>console.log("TODO: Preview",h.id),style:{width:"32px",height:"32px",borderRadius:"50%",border:"1.5px solid rgba(59, 130, 246, 0.15)",backgroundColor:"rgba(59, 130, 246, 0.05)",color:"#3B82F6",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"},onMouseEnter:x=>{x.currentTarget.style.backgroundColor="rgba(59, 130, 246, 0.12)"},onMouseLeave:x=>{x.currentTarget.style.backgroundColor="rgba(59, 130, 246, 0.05)"},onFocus:x=>{x.currentTarget.style.borderColor="#3B82F6",x.currentTarget.style.boxShadow="0 0 0 2px rgba(59, 130, 246, 0.2)",x.currentTarget.style.outline="none"},onBlur:x=>{x.currentTarget.style.borderColor="rgba(59, 130, 246, 0.15)",x.currentTarget.style.boxShadow="none"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),e.jsx("button",{type:"button",title:"Edit",onClick:()=>r(h),style:{width:"32px",height:"32px",borderRadius:"50%",border:"1.5px solid rgba(124, 92, 255, 0.15)",backgroundColor:"rgba(124, 92, 255, 0.05)",color:"#7C5CFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"},onMouseEnter:x=>{x.currentTarget.style.backgroundColor="rgba(124, 92, 255, 0.12)"},onMouseLeave:x=>{x.currentTarget.style.backgroundColor="rgba(124, 92, 255, 0.05)"},onFocus:x=>{x.currentTarget.style.borderColor="#7C5CFF",x.currentTarget.style.boxShadow="0 0 0 2px rgba(124, 92, 255, 0.2)",x.currentTarget.style.outline="none"},onBlur:x=>{x.currentTarget.style.borderColor="rgba(124, 92, 255, 0.15)",x.currentTarget.style.boxShadow="none"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}),e.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),e.jsx("button",{type:"button",title:"Delete",onClick:()=>i(h.id),style:{width:"32px",height:"32px",borderRadius:"50%",border:"1.5px solid rgba(100, 116, 139, 0.15)",backgroundColor:"rgba(100, 116, 139, 0.05)",color:"#64748B",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"},onMouseEnter:x=>{x.currentTarget.style.backgroundColor="rgba(239, 68, 68, 0.08)",x.currentTarget.style.color="#EF4444",x.currentTarget.style.borderColor="rgba(239, 68, 68, 0.2)"},onMouseLeave:x=>{x.currentTarget.style.backgroundColor="rgba(100, 116, 139, 0.05)",x.currentTarget.style.color="#64748B",x.currentTarget.style.borderColor="rgba(100, 116, 139, 0.15)"},onFocus:x=>{x.currentTarget.style.borderColor="#EF4444",x.currentTarget.style.boxShadow="0 0 0 2px rgba(239, 68, 68, 0.2)",x.currentTarget.style.outline="none"},onBlur:x=>{x.currentTarget.style.borderColor="rgba(100, 116, 139, 0.15)",x.currentTarget.style.boxShadow="none"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]})})]})})]},h.id)})})]})}),e.jsxs("div",{style:{borderTop:"1px solid rgba(226, 232, 240, 0.8)",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",boxSizing:"border-box",backgroundColor:"#FFFFFF"},children:[e.jsxs("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:["Showing 6 of ",t.length," certifications"]}),e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx("button",{type:"button",disabled:!0,style:{width:"32px",height:"32px",borderRadius:"50%",border:"1px solid rgba(226, 232, 240, 0.8)",backgroundColor:"#FFFFFF",color:"#94A3B8",fontSize:"14px",fontWeight:600,cursor:"not-allowed",opacity:.6,display:"flex",alignItems:"center",justifyContent:"center",outline:"none"},children:"<"}),e.jsx("button",{type:"button",style:{width:"32px",height:"32px",borderRadius:"50%",border:"none",backgroundColor:"#7C5CFF",color:"#FFFFFF",fontSize:"13px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none"},children:"1"}),e.jsx("button",{type:"button",style:{width:"32px",height:"32px",borderRadius:"50%",border:"none",backgroundColor:"transparent",color:"#94A3B8",fontSize:"13px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none"},onMouseEnter:h=>h.currentTarget.style.color="#7C5CFF",onMouseLeave:h=>h.currentTarget.style.color="#94A3B8",children:"2"}),e.jsx("button",{type:"button",style:{width:"32px",height:"32px",borderRadius:"50%",border:"none",backgroundColor:"transparent",color:"#94A3B8",fontSize:"13px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none"},onMouseEnter:h=>h.currentTarget.style.color="#7C5CFF",onMouseLeave:h=>h.currentTarget.style.color="#94A3B8",children:"3"}),e.jsx("button",{type:"button",style:{width:"32px",height:"32px",borderRadius:"50%",border:"1px solid rgba(226, 232, 240, 0.8)",backgroundColor:"#FFFFFF",color:"#94A3B8",fontSize:"14px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",outline:"none",transition:"all 0.2s ease"},onMouseEnter:h=>{h.currentTarget.style.backgroundColor="var(--admin-surface)",h.currentTarget.style.color="#7C5CFF"},onMouseLeave:h=>{h.currentTarget.style.backgroundColor="#FFFFFF",h.currentTarget.style.color="#94A3B8"},children:">"})]})]})]})},fe=t=>({id:t.id,title:t.title,issuer:t.issuer,category:t.category,description:t.description,issueDate:t.issue_date,expiryDate:t.expiry_date,credentialId:t.credential_id,credentialUrl:t.credential_url,certificateImageUrl:t.certificate_image_url,certificateFileUrl:t.certificate_file_url,skills:t.skills,status:t.status,isFeatured:t.is_featured,displayOrder:t.display_order,createdAt:t.created_at,updatedAt:t.updated_at}),Q={async getCertifications(){const{data:t,error:r}=await D.from("certifications").select("*").order("created_at",{ascending:!1});if(r)throw console.error("[certificationService.getCertifications] Error:",r),r;return(t||[]).map(fe)},async uploadAsset(t,r){const{data:i,error:o}=await D.storage.from("certifications").upload(r,t,{cacheControl:"3600",upsert:!0});if(o)throw console.error("[certificationService.uploadAsset] Error uploading:",o),o;const{data:{publicUrl:n}}=D.storage.from("certifications").getPublicUrl(r);return n},async createCertification(t){const{data:r,error:i}=await D.from("certifications").insert([t]).select().single();if(i)throw console.error("[certificationService.createCertification] Error:",i),i;return fe(r)},async updateCertification(t,r){const{data:i,error:o}=await D.from("certifications").update({...r,updated_at:new Date().toISOString()}).eq("id",t).select().single();if(o)throw console.error("[certificationService.updateCertification] Error:",o),o;return fe(i)},async deleteCertification(t){const{data:r,error:i}=await D.from("certifications").select("certificate_image_url, certificate_file_url").eq("id",t).single();if(i)throw console.error("[certificationService.deleteCertification] Fetch error:",i),i;const o=[],n=a=>{if(!a)return null;const c=a.split("/storage/v1/object/public/certifications/");return c.length===2?c[1]:null};if(r){const a=n(r.certificate_image_url);a&&o.push(a);const c=n(r.certificate_file_url);c&&o.push(c)}const{error:s}=await D.from("certifications").delete().eq("id",t);if(s)throw console.error("[certificationService.deleteCertification] Database delete error:",s),s;if(o.length>0)try{const{error:a}=await D.storage.from("certifications").remove(o);a&&console.warn("[certificationService.deleteCertification] Storage cleanup warning:",a)}catch(a){console.warn("[certificationService.deleteCertification] Storage cleanup caught warning:",a)}return!0}},Xr=({isOpen:t,mode:r,selectedCertification:i,onClose:o,onSave:n})=>{const[s,a]=d.useState(""),[c,l]=d.useState(""),[p,g]=d.useState(""),[u,h]=d.useState(""),[f,m]=d.useState(""),[v,x]=d.useState(""),[j,y]=d.useState(null),[C,F]=d.useState(null),[T,S]=d.useState(null),[k,W]=d.useState(null),[A,L]=d.useState(!1),[R,b]=d.useState([]),[z,M]=d.useState(""),[B,P]=d.useState(!0),[N,E]=d.useState(!1),U=d.useRef(null),G=d.useRef(null);if(d.useEffect(()=>{const w=V=>{V.key==="Escape"&&t&&o()};return window.addEventListener("keydown",w),()=>window.removeEventListener("keydown",w)},[t,o]),d.useEffect(()=>{t&&(r==="edit"&&i?(a(i.title||""),l(i.issuer||""),g(i.credentialId||""),h(i.description||""),m(i.issueDate||""),x(i.expiryDate||""),y(i.certificateImageUrl||null),F(i.certificateFileUrl||null),b(i.skills||[]),P(!0),E(i.isFeatured||!1),S(null),W(null)):(a(""),l(""),g(""),h(""),m(""),x(""),y(null),F(null),S(null),W(null),b([]),M(""),P(!0),E(!1)))},[t,r,i]),!t)return null;const J=w=>{if((w.key==="Enter"||w.key===",")&&z.trim()){w.preventDefault();const V=z.trim().replace(/,$/,"");R.includes(V)||b([...R,V]),M("")}},I=w=>{b(R.filter(V=>V!==w))},_=async w=>{var ie,ce;if(!s.trim()||!c.trim()||!f.trim()){typeof window<"u"&&window.showToast&&window.showToast("error","Validation Error","Please fill in all required fields (*).",5e3);return}const V=Date.parse(f),H=Date.parse(v);if(!isNaN(V)&&!isNaN(H)&&new Date(H)<new Date(V)){typeof window<"u"&&window.showToast&&window.showToast("error","Validation Error","Expiry Date cannot be earlier than Issue Date.",5e3);return}const X=w&&(w.toLowerCase()==="draft"||w.toLowerCase()==="pending")?"draft":"published";if(r==="create"){L(!0);try{let Y="",ee="";if(T){const $=`icons/${Date.now()}-${T.name}`;Y=await Q.uploadAsset(T,$)}if(k){const $=`media/${Date.now()}-${k.name}`;ee=await Q.uploadAsset(k,$)}const oe=await Q.createCertification({title:s,issuer:c,category:"General",description:u.trim()||null,issue_date:f.trim(),expiry_date:v.trim()||null,credential_id:p.trim()||null,credential_url:null,certificate_image_url:Y||null,certificate_file_url:ee||null,skills:R.length>0?R:null,status:X,is_featured:N,display_order:0});typeof window<"u"&&window.showToast&&window.showToast("success","Certification Added","Certification added successfully.",4e3),n(oe)}catch(Y){typeof window<"u"&&window.showToast&&window.showToast("error","Submission Failed",Y.message||"Failed to save certification.",5e3),L(!1)}}else{if(!i)return;L(!0);try{let Y=j,ee=C;if(T){const he=`icons/${Date.now()}-${T.name}`;Y=await Q.uploadAsset(T,he)}if(k){const he=`media/${Date.now()}-${k.name}`;ee=await Q.uploadAsset(k,he)}const oe=await Q.updateCertification(i.id,{title:s,issuer:c,description:u.trim()||null,issue_date:f.trim(),expiry_date:v.trim()||null,credential_id:p.trim()||null,credential_url:null,certificate_image_url:Y||null,certificate_file_url:ee||null,skills:R.length>0?R:null,status:X,is_featured:N});let $="Certification updated successfully.";X==="published"&&((ie=i.status)==null?void 0:ie.toLowerCase())!=="published"?$="Certification published successfully.":X==="draft"&&((ce=i.status)==null?void 0:ce.toLowerCase())==="published"?$="Certification moved to draft.":N&&!i.isFeatured?$="Certification marked as featured.":!N&&i.isFeatured&&($="Certification removed from featured."),typeof window<"u"&&window.showToast&&window.showToast("success","Certification Updated",$,4e3),n(oe)}catch(Y){typeof window<"u"&&window.showToast&&window.showToast("error","Update Failed",Y.message||"Failed to update certification.",5e3),L(!1)}}},O=(w,V)=>{var X;const H=(X=w.target.files)==null?void 0:X[0];if(H){if(H.size>10*1024*1024){typeof window<"u"&&window.showToast&&window.showToast("error","File Too Large","File size must not exceed 10MB.",5e3);return}if(!["image/png","image/jpeg","image/jpg","image/webp","application/pdf"].includes(H.type)){typeof window<"u"&&window.showToast&&window.showToast("error","Invalid File Type","Only PNG, JPG, JPEG, WebP, and PDF files are allowed.",5e3);return}V==="icon"?(S(H),y(URL.createObjectURL(H))):(W(H),F(URL.createObjectURL(H)))}};return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:o,style:{position:"fixed",left:0,top:0,width:"100vw",height:"100vh",backgroundColor:"rgba(15, 23, 42, 0.3)",backdropFilter:"blur(4px)",zIndex:999}}),e.jsxs("aside",{onClick:w=>w.stopPropagation(),style:{position:"fixed",right:0,top:0,bottom:0,width:"560px",height:"100vh",backgroundColor:"#FFFFFF",boxShadow:"-10px 0 30px rgba(15, 23, 42, 0.08)",zIndex:1e3,display:"flex",flexDirection:"column",boxSizing:"border-box",fontFamily:"'Inter', sans-serif"},children:[e.jsxs("div",{style:{padding:"24px",borderBottom:"1.5px dashed rgba(226, 232, 240, 1)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:[e.jsx("h2",{style:{margin:0,fontSize:"20px",fontWeight:700,color:"#0F172A",letterSpacing:"-0.02em"},children:r==="create"?"Add New Certification":"Edit Certification"}),e.jsx("span",{style:{fontSize:"13px",color:"#64748B",fontWeight:500},children:r==="create"?"Fill in the details below to add a new certification to your portfolio.":"Update the certification information displayed on your portfolio."})]}),e.jsx("button",{type:"button",onClick:o,style:{border:"none",backgroundColor:"rgba(241, 245, 29, 0.01)",cursor:"pointer",color:"#94A3B8",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",transition:"background-color 0.15s ease"},onMouseEnter:w=>w.currentTarget.style.backgroundColor="#F1F5F9",onMouseLeave:w=>w.currentTarget.style.backgroundColor="transparent",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"18",height:"18",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto",padding:"24px",display:"flex",flexDirection:"column",gap:"24px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Basic Information"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Certificate Title *"}),e.jsx("input",{type:"text",placeholder:"e.g., Mendix Advanced Developer",value:s,onChange:w=>a(w.target.value),style:{width:"100%",height:"40px",padding:"0 12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none"}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Issuing Organization *"}),e.jsx("input",{type:"text",placeholder:"e.g., Mendix Academy",value:c,onChange:w=>l(w.target.value),style:{width:"100%",height:"40px",padding:"0 12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none"}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Credential ID"}),e.jsx("input",{type:"text",placeholder:"e.g., CERT-2024-12345",value:p,onChange:w=>g(w.target.value),style:{width:"100%",height:"40px",padding:"0 12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none"}})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Description"}),e.jsx("textarea",{placeholder:"Add a brief description of this certification...",value:u,onChange:w=>h(w.target.value),rows:3,style:{width:"100%",padding:"12px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none",fontFamily:"inherit",resize:"none"}})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Dates"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Issue Date *"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{type:"text",placeholder:"Jan 2024",value:f,onChange:w=>m(w.target.value),style:{width:"100%",height:"40px",padding:"0 12px 0 38px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none"}}),e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94A3B8",display:"flex"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("label",{style:{fontSize:"13px",fontWeight:650,color:"#475569"},children:"Expiry Date"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx("input",{type:"text",placeholder:"No expiry",value:v,onChange:w=>x(w.target.value),style:{width:"100%",height:"40px",padding:"0 12px 0 38px",border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",fontSize:"13.5px",boxSizing:"border-box",color:"#0F172A",outline:"none"}}),e.jsx("span",{style:{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94A3B8",display:"flex"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"15",height:"15",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})})]})]})]})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1.25fr",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Icon"}),e.jsx("input",{type:"file",ref:U,onChange:w=>O(w,"icon"),accept:"image/*,application/pdf",style:{display:"none"}}),e.jsx("div",{onClick:()=>{var w;return(w=U.current)==null?void 0:w.click()},style:{height:"140px",border:"1.5px dashed rgba(124, 92, 255, 0.2)",borderRadius:"12px",backgroundColor:"rgba(124, 92, 255, 0.02)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"10px",cursor:"pointer",padding:"16px",boxSizing:"border-box",textAlign:"center"},children:j?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",width:"100%",height:"100%",justifyContent:"center"},children:[j.toLowerCase().includes(".pdf")||T&&T.type==="application/pdf"?e.jsxs("svg",{viewBox:"0 0 24 24",width:"36",height:"36",fill:"none",stroke:"#EF4444",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("text",{x:"12",y:"18",textAnchor:"middle",fill:"#EF4444",fontSize:"5px",fontWeight:"bold",fontFamily:"sans-serif",children:"PDF"})]}):e.jsx("img",{src:j,alt:"Icon Preview",style:{maxHeight:"60px",maxWidth:"100%",objectFit:"contain",borderRadius:"4px"}}),e.jsxs("div",{style:{display:"flex",gap:"8px",zIndex:10},children:[e.jsx("button",{type:"button",onClick:w=>{var V;w.stopPropagation(),(V=U.current)==null||V.click()},style:{padding:"4px 10px",border:"1px solid #CBD5E1",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FFFFFF",color:"#475569",cursor:"pointer"},children:"Replace"}),e.jsx("button",{type:"button",onClick:w=>{w.stopPropagation(),y(null),S(null)},style:{padding:"4px 10px",border:"1px solid #FCA5A5",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FEF2F2",color:"#EF4444",cursor:"pointer"},children:"Remove"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"24",height:"24",fill:"none",stroke:"#7C5CFF",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"17 8 12 3 7 8"}),e.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"12.5px",fontWeight:700,color:"#475569"},children:"Drag & drop icon"}),e.jsx("div",{style:{fontSize:"10px",color:"#94A3B8",marginTop:"2px"},children:"PNG, JPG or PDF up to 10MB"})]}),e.jsx("button",{type:"button",style:{padding:"4px 12px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FFFFFF",color:"#475569"},children:"Browse Files"})]})})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Media"}),e.jsx("input",{type:"file",ref:G,onChange:w=>O(w,"media"),accept:"image/*,application/pdf",style:{display:"none"}}),e.jsx("div",{onClick:()=>{var w;return(w=G.current)==null?void 0:w.click()},style:{height:"140px",border:"1.5px dashed rgba(124, 92, 255, 0.2)",borderRadius:"12px",backgroundColor:"rgba(124, 92, 255, 0.02)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"10px",cursor:"pointer",padding:"16px",boxSizing:"border-box",textAlign:"center"},children:C?e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",width:"100%",height:"100%",justifyContent:"center"},children:[C.toLowerCase().includes(".pdf")||k&&k.type==="application/pdf"?e.jsxs("svg",{viewBox:"0 0 24 24",width:"36",height:"36",fill:"none",stroke:"#EF4444",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("text",{x:"12",y:"18",textAnchor:"middle",fill:"#EF4444",fontSize:"5px",fontWeight:"bold",fontFamily:"sans-serif",children:"PDF"})]}):e.jsx("img",{src:C,alt:"Media Preview",style:{maxHeight:"60px",maxWidth:"100%",objectFit:"contain",borderRadius:"4px"}}),e.jsxs("div",{style:{display:"flex",gap:"8px",zIndex:10},children:[e.jsx("button",{type:"button",onClick:w=>{var V;w.stopPropagation(),(V=G.current)==null||V.click()},style:{padding:"4px 10px",border:"1px solid #CBD5E1",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FFFFFF",color:"#475569",cursor:"pointer"},children:"Replace"}),e.jsx("button",{type:"button",onClick:w=>{w.stopPropagation(),F(null),W(null)},style:{padding:"4px 10px",border:"1px solid #FCA5A5",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FEF2F2",color:"#EF4444",cursor:"pointer"},children:"Remove"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"24",height:"24",fill:"none",stroke:"#7C5CFF",strokeWidth:"2",children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"17 8 12 3 7 8"}),e.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"12.5px",fontWeight:700,color:"#475569"},children:"Drag & drop certificate image"}),e.jsx("div",{style:{fontSize:"10px",color:"#94A3B8",marginTop:"2px"},children:"PNG, JPG or PDF up to 10MB"})]}),e.jsx("button",{type:"button",style:{padding:"4px 12px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"6px",fontSize:"11px",fontWeight:600,backgroundColor:"#FFFFFF",color:"#475569"},children:"Browse Files"})]})})]})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Skills & Tags"}),e.jsxs("div",{style:{border:"1.5px solid rgba(226, 232, 240, 1)",borderRadius:"10px",padding:"8px 12px",display:"flex",flexWrap:"wrap",gap:"8px",alignItems:"center",boxSizing:"border-box",minHeight:"40px"},children:[R.map(w=>e.jsxs("span",{style:{backgroundColor:"rgba(124, 92, 255, 0.08)",color:"#7C5CFF",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:600,display:"inline-flex",alignItems:"center",gap:"6px"},children:[w,e.jsx("span",{onClick:()=>I(w),style:{cursor:"pointer",display:"flex",alignItems:"center",color:"rgba(124, 92, 255, 0.6)"},children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"12",height:"12",fill:"none",stroke:"currentColor",strokeWidth:"3",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]},w)),e.jsx("input",{type:"text",placeholder:"Add skill...",value:z,onChange:w=>M(w.target.value),onKeyDown:J,style:{border:"none",outline:"none",fontSize:"13.5px",color:"#0F172A",flex:1,minWidth:"80px",padding:0}})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px"},children:[e.jsx("span",{style:{fontSize:"11px",fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Status"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(248, 250, 252, 0.5)",border:"1.5px solid rgba(226, 232, 240, 0.8)",borderRadius:"12px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"#10B981"}}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:600,color:"#475569"},children:"Verified"})]}),e.jsx("div",{onClick:()=>P(!B),style:{width:"44px",height:"24px",borderRadius:"999px",backgroundColor:B?"#10B981":"#E2E8F0",position:"relative",cursor:"pointer",transition:"background-color 0.2s ease"},children:e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"#FFFFFF",position:"absolute",top:"3px",left:B?"23px":"3px",transition:"left 0.2s ease"}})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"rgba(248, 250, 252, 0.5)",border:"1.5px solid rgba(226, 232, 240, 0.8)",borderRadius:"12px",boxSizing:"border-box"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"#8B5CF6"}}),e.jsx("span",{style:{fontSize:"13.5px",fontWeight:600,color:"#475569"},children:"Featured"})]}),e.jsx("div",{onClick:()=>E(!N),style:{width:"44px",height:"24px",borderRadius:"999px",backgroundColor:N?"#8B5CF6":"#E2E8F0",position:"relative",cursor:"pointer",transition:"background-color 0.2s ease"},children:e.jsx("div",{style:{width:"18px",height:"18px",borderRadius:"50%",backgroundColor:"#FFFFFF",position:"absolute",top:"3px",left:N?"23px":"3px",transition:"left 0.2s ease"}})})]})]})]}),e.jsxs("div",{style:{padding:"16px 24px",borderTop:"1.5px dashed rgba(226, 232, 240, 1)",display:"flex",justifyContent:"flex-end",gap:"12px",boxSizing:"border-box",backgroundColor:"#F8FAFC"},children:[e.jsx("button",{type:"button",onClick:o,style:{padding:"10px 20px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"10px",backgroundColor:"#FFFFFF",color:"#475569",fontSize:"13.5px",fontWeight:600,cursor:"pointer",transition:"background-color 0.15s ease"},onMouseEnter:w=>w.currentTarget.style.backgroundColor="#F8FAFC",onMouseLeave:w=>w.currentTarget.style.backgroundColor="#FFFFFF",children:"Cancel"}),r==="create"?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",disabled:A,onClick:()=>_("Draft"),style:{padding:"10px 20px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"10px",backgroundColor:"#FFFFFF",color:A?"#94A3B8":"#475569",fontSize:"13.5px",fontWeight:600,cursor:A?"not-allowed":"pointer",transition:"background-color 0.15s ease",opacity:A?.6:1},onMouseEnter:w=>{A||(w.currentTarget.style.backgroundColor="#F8FAFC")},onMouseLeave:w=>{A||(w.currentTarget.style.backgroundColor="#FFFFFF")},children:A?"Saving...":"Save as Draft"}),e.jsx("button",{type:"button",disabled:A,onClick:()=>_("Published"),style:{padding:"10px 20px",border:"none",borderRadius:"10px",backgroundColor:A?"#94A3B8":"#7C5CFF",color:"#FFFFFF",fontSize:"13.5px",fontWeight:600,cursor:A?"not-allowed":"pointer",transition:"background-color 0.15s ease",boxShadow:A?"none":"0 4px 12px rgba(124, 92, 255, 0.25)",opacity:A?.6:1},onMouseEnter:w=>{A||(w.currentTarget.style.backgroundColor="#6D4EE3")},onMouseLeave:w=>{A||(w.currentTarget.style.backgroundColor="#7C5CFF")},children:A?"Saving...":"Publish"})]}):e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",disabled:A,onClick:()=>_("Draft"),style:{padding:"10px 20px",border:"1px solid rgba(226, 232, 240, 1)",borderRadius:"10px",backgroundColor:"#FFFFFF",color:A?"#94A3B8":"#475569",fontSize:"13.5px",fontWeight:600,cursor:A?"not-allowed":"pointer",transition:"background-color 0.15s ease",opacity:A?.6:1},onMouseEnter:w=>{A||(w.currentTarget.style.backgroundColor="#F8FAFC")},onMouseLeave:w=>{A||(w.currentTarget.style.backgroundColor="#FFFFFF")},children:A?"Saving...":"Save Changes"}),e.jsx("button",{type:"button",disabled:A,onClick:()=>_("Published"),style:{padding:"10px 20px",border:"none",borderRadius:"10px",backgroundColor:A?"#94A3B8":"#7C5CFF",color:"#FFFFFF",fontSize:"13.5px",fontWeight:600,cursor:A?"not-allowed":"pointer",transition:"background-color 0.15s ease",boxShadow:A?"none":"0 4px 12px rgba(124, 92, 255, 0.25)",opacity:A?.6:1},onMouseEnter:w=>{A||(w.currentTarget.style.backgroundColor="#6D4EE3")},onMouseLeave:w=>{A||(w.currentTarget.style.backgroundColor="#7C5CFF")},children:A?"Saving...":"Update & Publish"})]})]})]})]})},Jr=()=>{const[t,r]=d.useState([]),[i,o]=d.useState(!0),[n,s]=d.useState(null),[a,c]=d.useState(!1),[l,p]=d.useState("create"),[g,u]=d.useState(null),[h,f]=d.useState(""),[m,v]=d.useState("all"),[x,j]=d.useState("newest"),y=d.useCallback(async()=>{o(!0),s(null);try{const z=await Q.getCertifications();r(z)}catch(z){console.error("[CertificationsPage] Failed to fetch data:",z),s(z.message||"Failed to fetch certifications."),typeof window<"u"&&window.showToast&&window.showToast("error","Error Loading Data",z.message||"Failed to load certifications.",5e3)}finally{o(!1)}},[]);d.useEffect(()=>{y()},[y]);const C=We.useMemo(()=>{let z=[...t];m==="published"?z=z.filter(B=>B.status==="published"||B.status==="Published"):m==="draft"?z=z.filter(B=>B.status==="draft"||B.status==="Draft"):m==="featured"&&(z=z.filter(B=>B.isFeatured));const M=h.toLowerCase().trim();return M&&(z=z.filter(B=>{var J,I,_,O,w;const P=(J=B.title)==null?void 0:J.toLowerCase().includes(M),N=(I=B.issuer)==null?void 0:I.toLowerCase().includes(M),E=(_=B.category)==null?void 0:_.toLowerCase().includes(M),U=(O=B.credentialId)==null?void 0:O.toLowerCase().includes(M),G=(w=B.skills)==null?void 0:w.some(V=>V.toLowerCase().includes(M));return P||N||E||U||G})),x==="newest"?z.sort((B,P)=>{const N=B.issueDate?Date.parse(B.issueDate):0;return(P.issueDate?Date.parse(P.issueDate):0)-N}):x==="oldest"?z.sort((B,P)=>{const N=B.issueDate?Date.parse(B.issueDate):0,E=P.issueDate?Date.parse(P.issueDate):0;return N-E}):x==="title_asc"?z.sort((B,P)=>(B.title||"").localeCompare(P.title||"")):x==="title_desc"&&z.sort((B,P)=>(P.title||"").localeCompare(B.title||"")),z},[t,h,m,x]),F=()=>{f(""),v("all"),j("newest")},T=t.length,S=t.filter(z=>z.status==="published"||z.status==="Published").length,k=t.filter(z=>z.status==="draft"||z.status==="Draft").length,W=t.filter(z=>z.isFeatured).length,A=()=>{p("create"),u(null),c(!0)},L=z=>{p("edit"),u(z),c(!0)},R=z=>{y(),c(!1)},b=async z=>{const M=t.find(B=>B.id===z);if(M&&window.confirm(`Are you sure you want to delete the certification "${M.title}"? This action cannot be undone.`))try{await Q.deleteCertification(z),typeof window<"u"&&window.showToast&&window.showToast("success","Certification Deleted","Certification deleted successfully.",4e3),y()}catch(B){typeof window<"u"&&window.showToast&&window.showToast("error","Delete Failed",B.message||"Failed to delete certification.",5e3)}};return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--admin-space-5)"},children:[e.jsx(Yr,{onAddClick:A}),e.jsx(Kr,{total:T,published:S,draft:k,featured:W}),e.jsxs("div",{style:{display:"flex",flexDirection:"column"},children:[e.jsx(qr,{searchVal:h,setSearchVal:f,filterVal:m,setFilterVal:v,sortVal:x,setSortVal:j}),i?e.jsx(Ie,{}):n?e.jsxs("div",{style:{padding:"24px",textAlign:"center",color:"#EF4444",backgroundColor:"#FFFFFF",borderRadius:"var(--admin-radius-md)",border:"1px solid var(--admin-border)"},children:["Error loading certifications: ",n]}):e.jsx(Gr,{certifications:C,onEditClick:L,onDeleteClick:b,isFiltered:h.trim()!==""||m!=="all",onClearFilters:F})]}),e.jsx(Xr,{isOpen:a,mode:l,selectedCertification:g,onClose:()=>c(!1),onSave:R})]})},Qr=t=>{let r=t.replace(/\/$/,"").toLowerCase();switch(r.startsWith("/ashok-portfolio")&&(r=r.substring(16)),r.startsWith("/")||(r="/"+r),r){case"/admin":case"/admin/index.html":return{component:e.jsx(je,{}),pageTitle:"Admin Dashboard"};case"/admin/certifications":return{component:e.jsx(Jr,{}),pageTitle:"Certifications"};case"/admin/contacts":return{component:e.jsx(yt,{}),pageTitle:"Contacts"};case"/admin/testimonials":return{component:e.jsx(Wt,{}),pageTitle:"Testimonials Manager"};case"/admin/resume":return{component:e.jsx(Nt,{}),pageTitle:"Resume Downloads"};case"/admin/analytics":return{component:e.jsx(hr,{}),pageTitle:"Visitor Analytics"};case"/admin/settings":return{component:e.jsx(ke,{}),pageTitle:"Settings"};case"/admin/settings/portfolio":return{component:e.jsx(ke,{}),pageTitle:"Portfolio Settings"};case"/admin/settings/social-links":return{component:e.jsx(Ce,{}),pageTitle:"Social Links"};case"/admin/settings/admin-access":return{component:e.jsx(ze,{}),pageTitle:"Admin Access"};case"/admin/social-links":return{component:e.jsx(Ce,{}),pageTitle:"Social Media Links"};case"/admin/access":return{component:e.jsx(ze,{}),pageTitle:"Access Privilege Control"};default:return{component:e.jsx(je,{}),pageTitle:"Admin Dashboard"}}},Zr=()=>{const[t,r]=d.useState(()=>typeof window<"u"?window.location.pathname:"/admin/");d.useEffect(()=>{const a=()=>{r(window.location.pathname)};return window.addEventListener("popstate",a),()=>window.removeEventListener("popstate",a)},[]);const i=a=>{if(typeof window<"u"){const l=window.location.pathname.startsWith("/ashok-portfolio")?`/ashok-portfolio${a}`:a;window.history.pushState(null,"",l),r(l)}},o=()=>typeof window<"u"&&window.location.pathname.startsWith("/ashok-portfolio")?"/ashok-portfolio/":"/",{component:n,pageTitle:s}=Qr(t);return e.jsx(Ne,{adminOnly:!0,fallbackPath:o(),children:e.jsx(Ve,{currentPath:t,onNavigate:i,pageTitle:s,children:n})})},Te=document.getElementById("root");Te&&Ee.createRoot(Te).render(e.jsx(We.StrictMode,{children:e.jsx(Me,{children:e.jsx(Zr,{})})}));
