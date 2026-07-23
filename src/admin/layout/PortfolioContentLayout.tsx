/* src/admin/layout/PortfolioContentLayout.tsx */
import React from 'react';
import { LoadingSkeleton } from '../pages/testimonials/components/LoadingSkeleton';
import { PrimaryActionButton } from '../components/portfolio-content/PrimaryActionButton';
import { EmptyState } from '../components/portfolio-content/EmptyState';

// ==========================================
// 1. Shared Layout Shell Container
// ==========================================
interface PortfolioContentLayoutProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  stats?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const PortfolioContentLayout: React.FC<PortfolioContentLayoutProps> = ({
  title,
  description,
  primaryAction,
  stats,
  toolbar,
  children,
  footer
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--admin-space-2)',
          flexWrap: 'wrap',
          gap: 'var(--admin-space-4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--admin-text)',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              color: 'var(--admin-text-secondary)',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {description}
          </p>
        </div>

        {primaryAction && (
          <PrimaryActionButton
            label={primaryAction.label}
            onClick={primaryAction.onClick}
            icon={primaryAction.icon}
          />
        )}
      </div>

      {/* Overview Statistics Section */}
      {stats}

      {/* Main Content Area (Toolbar & Child Content) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {toolbar}
        {children}
      </div>

      {/* Footer / Pagination Section */}
      {footer}
    </div>
  );
};

// ==========================================
// 2. Shared Statistics Grid Wrapper
// ==========================================
interface PortfolioContentStatsProps {
  children: React.ReactNode;
}

export const PortfolioContentStats: React.FC<PortfolioContentStatsProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--admin-space-4)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 3. Shared Toolbar Wrapper
// ==========================================
interface PortfolioContentToolbarProps {
  children: React.ReactNode;
}

export const PortfolioContentToolbar: React.FC<PortfolioContentToolbarProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px',
        background: '#FFFFFF',
        borderRadius: 'var(--admin-radius-md) var(--admin-radius-md) 0 0',
        border: '1px solid var(--admin-border)',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

// ==========================================
// 4. Shared Empty State Wrapper (Re-exported for backward compatibility)
// ==========================================
export const PortfolioContentEmptyState = EmptyState;

// ==========================================
// 5. Shared Loading Skeleton Wrapper
// ==========================================
export const PortfolioContentLoading: React.FC = () => {
  return <LoadingSkeleton />;
};
