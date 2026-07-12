/* src/admin/pages/social-links/components/LoadingSkeleton.tsx */
import React from 'react';
import { Skeleton } from '../../../components/loaders/Skeleton';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '16px',
        boxShadow: 'var(--admin-shadow-sm)',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {[1, 2, 3, 4, 5].map((idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '16px 24px',
            borderBottom: idx === 5 ? 'none' : '1px solid var(--admin-border)',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          {/* Left Info: Avatar + Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '150px', flexShrink: 0 }}>
            <Skeleton variant="circle" width={36} height={36} />
            <Skeleton variant="text" width={80} height={16} />
          </div>

          {/* Center Input placeholder */}
          <div style={{ flex: 1 }}>
            <Skeleton variant="rect" height={38} />
          </div>

          {/* Right Actions placeholders */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Skeleton variant="circle" width={36} height={36} />
            <Skeleton variant="circle" width={36} height={36} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
