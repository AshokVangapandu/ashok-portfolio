import React from 'react';
import { ProtectedRoute } from '../auth/ProtectedRoute';

/**
 * Temporary Admin Dashboard page.
 * Restricts access to authorized administrators only.
 */
export const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute adminOnly fallbackPath="/">
      <div
        className="admin-dashboard-temp"
        style={{
          background: '#ffffff',
          color: '#0f172a',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {/* Large Crown Icon */}
          <div style={{ marginBottom: '24px', color: '#ffd700', display: 'flex', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 24 24"
              width="80"
              height="80"
              fill="currentColor"
              stroke="#ffd700"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
              <rect x="3" y="17" width="18" height="3" rx="1" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              margin: '0 0 12px 0',
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Admin Dashboard
          </h1>

          {/* Subtitle / Status */}
          <p
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#475569',
              margin: '0 0 24px 0',
              lineHeight: 1.6,
            }}
          >
            Welcome, Administrator!<br />
            This dashboard is currently under development.<br />
            Soon you'll be able to manage:
          </p>

          {/* Checklist Panel */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {[
                'Contact Messages',
                'Testimonials',
                'Portfolio Content',
                'Analytics',
                'Settings',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#334155',
                  }}
                >
                  <span style={{ color: '#ffd700', fontSize: '18px' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation link button */}
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '12px 24px',
              textDecoration: 'none',
              transition: 'all 200ms ease',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e293b';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0f172a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>← Back to Portfolio</span>
          </a>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
