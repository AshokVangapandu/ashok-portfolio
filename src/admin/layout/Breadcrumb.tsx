/* src/admin/layout/Breadcrumb.tsx */
import React from 'react';

interface BreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  onNavigate,
}) => {
  const getSegments = () => {
    // '/admin/messages' -> ['', 'admin', 'messages']
    const parts = currentPath.split('/').filter(Boolean);
    return parts.map((part, idx) => {
      const path = '/' + parts.slice(0, idx + 1).join('/');
      let label = part;
      
      // Map segments to cleaner labels
      if (part === 'admin') label = 'Admin';
      else if (part === 'contacts') label = 'Contacts';
      else if (part === 'testimonials') label = 'Testimonials';
      else if (part === 'resume') label = 'Resume Downloads';
      else if (part === 'analytics') label = 'Analytics';
      else if (part === 'settings') label = 'Settings';
      else if (part === 'portfolio') label = 'Portfolio Settings';
      else if (part === 'social-links') label = 'Social Links';
      else if (part === 'admin-access' || part === 'access') label = 'Admin Access';
      else {
        // Capitalize default
        label = part.charAt(0).toUpperCase() + part.slice(1);
      }

      return { label, path };
    });
  };

  const segments = getSegments();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--admin-space-2)',
        fontSize: '12px',
        color: 'var(--admin-text-secondary)',
        fontFamily: "'Inter', sans-serif",
        marginBottom: 'var(--admin-space-4)'
      }}
    >
      <button
        onClick={() => onNavigate('/admin/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: 'var(--admin-text-secondary)',
          fontWeight: 500,
          transition: 'color 0.15s'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--admin-text-secondary)'}
      >
        Home
      </button>

      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={seg.path}>
            <span style={{ opacity: 0.5 }}>/</span>
            {isLast ? (
              <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                {seg.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(seg.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'var(--admin-text-secondary)',
                  fontWeight: 500,
                  transition: 'color 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--admin-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--admin-text-secondary)'}
              >
                {seg.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
