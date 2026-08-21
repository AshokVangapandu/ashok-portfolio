import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginButton } from './auth/LoginButton';
import { UserMenu } from './auth/UserMenu';

/**
 * Responsive Navigation Header Component.
 * Integrates navigation links, mobile toggles, scrolled header shadow animations,
 * and delegates the Authentication Section to either LoginButton or UserMenu.
 */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isCertifications = typeof window !== 'undefined' && window.location.pathname.includes('/certifications');

  return (
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
          <a href="#expertise" onClick={closeMenu}>Expertise</a>
          <a href="#widget-lab" onClick={closeMenu}>Widgets</a>
          <a href="#certifications" onClick={closeMenu}>Certifications</a>
          <a href="#behind-build" onClick={closeMenu}>Process</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#resume" onClick={closeMenu}>Resume</a>
          <a href="#heard" onClick={closeMenu}>Wall of Love</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          
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

      {/* Styled helper overrides for responsive positioning of auth section */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 980px) {
          .navbar-auth-container {
            display: flex !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
            border-left: none !important;
            margin-top: 18px;
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </header>
  );
};
export default Navbar;
