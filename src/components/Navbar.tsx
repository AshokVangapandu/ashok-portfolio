import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginButton } from './auth/LoginButton';
import { UserMenu } from './auth/UserMenu';
import { LogoutButton } from './auth/LogoutButton';
import { Avatar } from './Avatar';

/**
 * Responsive Navigation Header Component.
 * Integrates navigation links, mobile toggles, scrolled header shadow animations,
 * and delegates the Authentication Section to either LoginButton or UserMenu.
 */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, login, signIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const roleSubtitle = isAuthenticated && user
    ? (isAdmin ? 'Administrator' : 'Collaborator')
    : 'Navigation';

  return (
    <>
      <div 
        className={`mobile-drawer-backdrop ${isOpen ? 'is-open' : ''}`} 
        onClick={closeMenu}
        aria-hidden="true"
      />
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} data-header>
        <nav className="navbar" aria-label="Primary navigation">
          <a className="brand" href="#hero" aria-label="Ashok Vangapandu home" onClick={closeMenu}>
            <span className="brand-mark">
              <img src="assets/images/AV%20White%20Icon.svg" alt="AV Logo" className="brand-mark-img" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">Ashok Vangapandu</span>
            </span>
            <span className="brand-mobile-title">Portfolio</span>
          </a>

          {/* Mobile menu toggle trigger */}
          <button
            className={`nav-toggle ${isOpen ? 'is-open' : ''}`}
            type="button"
            aria-label="Open navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            data-nav-toggle
          >
            <span></span>
            <span></span>
          </button>

          {/* Navigation list containing links and Auth actions */}
          <div className={`nav-links ${isOpen ? 'is-open' : ''}`} data-nav-menu>
            {/* Drawer Header (Mobile Side Panel Only) */}
            <div className="mobile-drawer-header">
              {isAuthenticated && user ? (
                <div 
                  className="drawer-brand is-authenticated"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  role="button"
                  tabIndex={0}
                  style={{ position: 'relative' }}
                >
                  <div className="drawer-brand-icon">
                    <Avatar 
                      imageUrl={userAvatar} 
                      displayName={userName} 
                      size={32}
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="drawer-brand-text">
                    <span className="brand-title">{userName}</span>
                    <span className="brand-subtitle">{roleSubtitle}</span>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="drawer-brand-chevron"
                    style={{
                      color: '#A78BFA',
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease',
                      marginLeft: '2px',
                      flexShrink: 0
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>

                  {/* Attached User Menu Popover matching exact header width */}
                  {isUserMenuOpen && (
                    <div className="drawer-user-popover" onClick={(e) => e.stopPropagation()}>
                      {isAdmin && (
                        <a
                          href="/admin"
                          className="popover-attached-item popover-item-admin"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            closeMenu();
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span>👑</span>
                            <span>Admin</span>
                          </span>
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </a>
                      )}
                      <LogoutButton
                        className="popover-attached-item popover-item-logout"
                        style={{ width: '100%', justifyContent: 'space-between', padding: '8px 10px', height: '36px', minHeight: '36px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 650 }}
                        onSuccess={() => {
                          setIsUserMenuOpen(false);
                          closeMenu();
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <LoginButton onSuccess={closeMenu} />
              )}
              <button 
                type="button" 
                className="drawer-close-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  closeMenu();
                }}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Section 1: EXPLORE */}
            <div className="mobile-menu-section-label">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              <span>EXPLORE</span>
            </div>

            <div className="mobile-menu-nav-card">
              {/* Row 1: Expertise */}
              <a href="#expertise" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span className="menu-row-label">Expertise</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 2: Custom Tooling */}
              <a href="#widget-lab" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
                </div>
                <span className="menu-row-label">Custom Tooling</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 3: Certifications */}
              <a href="#certifications" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <span className="menu-row-label">Certifications</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 4: Behind the Build */}
              <a href="#behind-build" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </div>
                <span className="menu-row-label">Behind the Build</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 5: Projects */}
              <a href="#work" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <span className="menu-row-label">Projects</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 6: Resume */}
              <a href="#resume" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <span className="menu-row-label">Resume</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 7: Testimonials */}
              <a href="#heard" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span className="menu-row-label">Testimonials</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>

              {/* Row 8: Contact */}
              <a href="#contact" className="mobile-menu-row" onClick={closeMenu}>
                <div className="menu-row-icon-box">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <span className="menu-row-label">Contact</span>
                <svg className="menu-row-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>

            {/* Section 2: LET'S CONNECT (Compact Horizontal Icon Bar) */}
            <div className="mobile-menu-section-label">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>LET'S CONNECT</span>
            </div>

            <div className="mobile-connect-icons-row">
              <a href="https://linkedin.com/in/ashokvangapandu" target="_blank" rel="noopener noreferrer" className="connect-icon-pill linkedin" onClick={closeMenu} aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>
                <span>LinkedIn</span>
              </a>

              <a href="https://github.com/AshokVangapandu" target="_blank" rel="noopener noreferrer" className="connect-icon-pill github" onClick={closeMenu} aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                <span>GitHub</span>
              </a>

              <a href="mailto:ashokvangapandu@gmail.com" className="connect-icon-pill email" onClick={closeMenu} aria-label="Email Me">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>Email</span>
              </a>
            </div>
            
            {/* Integrated Authentication UI Section */}
            <div 
              className="navbar-auth-container"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '12px',
                paddingLeft: '12px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {isAuthenticated ? <UserMenu /> : <LoginButton />}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
