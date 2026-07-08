import React from 'react';

interface DashboardCardProps {
  title: string;
  description: string;
  count?: number;
  icon?: React.ReactNode;
  actionLabel?: string;
  onClick?: () => void;
  href?: string;
}

/**
 * Reusable premium Dashboard entry/summary card component.
 * Displays title, metadata, badge counter, and links dynamically.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  count,
  icon,
  actionLabel = 'Manage',
  onClick,
  href,
}) => {
  const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cardStyle: React.CSSProperties = {
      background: 'rgba(255, 255, 255, 0.015)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      textDecoration: 'none',
      color: '#ffffff',
      transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      cursor: onClick || href ? 'pointer' : 'default',
    };

    if (href) {
      return (
        <a href={href} style={cardStyle} className="admin-dashboard-card">
          {children}
        </a>
      );
    }

    return (
      <div onClick={onClick} style={cardStyle} className="admin-dashboard-card">
        {children}
      </div>
    );
  };

  return (
    <CardWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(143, 133, 255, 0.1)',
            border: '1px solid rgba(143, 133, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8f85ff',
          }}
        >
          {icon || (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          )}
        </div>
        {count !== undefined && (
          <span
            style={{
              background: 'rgba(143, 133, 255, 0.15)',
              color: '#8f85ff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '8px',
              letterSpacing: '0.02em',
            }}
          >
            {count} Entries
          </span>
        )}
      </div>

      <div style={{ flexGrow: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.5)' }}>
          {description}
        </p>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#8f85ff',
          marginTop: '8px',
          transition: 'gap 200ms ease',
        }}
        className="card-action-trigger"
      >
        <span>{actionLabel}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-dashboard-card:hover {
          border-color: rgba(143, 133, 255, 0.25) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(143, 133, 255, 0.08);
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .admin-dashboard-card:hover .card-action-trigger {
          gap: 10px !important;
          color: #a39aff !important;
        }
      `}} />
    </CardWrapper>
  );
};
export default DashboardCard;
