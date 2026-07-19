/* src/admin/pages/admin-access/components/MemberRow.tsx */
import React from 'react';
import { AdminUser } from '../../../types/adminAccess';

interface MemberRowProps {
  user: AdminUser;
  onViewDetails: (u: AdminUser) => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({ user, onViewDetails }) => {
  // Visitor avatar helper
  const defaultAvatar = (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        border: '1px solid var(--admin-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  // Status dot badges
  const renderStatusBadge = () => {
    let dotColor = '#10B981'; // Active green
    let bgColor = '#ECFDF5';
    let textColor = '#10B981';
    let borderColor = 'rgba(16, 185, 129, 0.15)';

    if (user.status === 'Pending') {
      dotColor = '#D97706'; // Pending amber
      bgColor = '#FFFBEB';
      textColor = '#D97706';
      borderColor = 'rgba(217, 119, 6, 0.15)';
    } else if (user.status === 'Inactive') {
      dotColor = '#EF4444'; // Inactive red
      bgColor = '#FEF2F2';
      textColor = '#EF4444';
      borderColor = 'rgba(239, 68, 68, 0.15)';
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: dotColor }} />
        {user.status}
      </span>
    );
  };

  // Role badges matching design styling
  const renderRoleBadge = () => {
    let icon = null;
    let bgColor = 'rgba(99, 102, 241, 0.06)'; // Indigo for Super Admin
    let textColor = '#6366F1';
    let borderColor = 'rgba(99, 102, 241, 0.15)';

    if (user.role === 'Super Admin') {
      icon = (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        </svg>
      );
    } else if (user.role === 'Portfolio Viewer') {
      bgColor = 'rgba(59, 130, 246, 0.06)'; // Blue for viewers
      textColor = '#2563EB';
      borderColor = 'rgba(59, 130, 246, 0.15)';
      icon = (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    } else {
      bgColor = 'rgba(75, 85, 99, 0.06)'; // Gray for other roles
      textColor = '#4B5563';
      borderColor = 'rgba(75, 85, 99, 0.15)';
      icon = (
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      );
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}
      >
        {icon}
        {user.role}
      </span>
    );
  };

  // Permission chips list
  const renderPermissionChips = () => {
    if (user.role === 'Super Admin') {
      return (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--admin-primary)',
            backgroundColor: 'rgba(124, 58, 237, 0.06)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            padding: '4px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          Full Access
        </span>
      );
    }

    const visCount = user.permissions.includes('Testimonials') ? 3 : 2;
    const items = user.permissions.slice(0, visCount);
    const remaining = user.permissions.length - visCount;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
        {items.map((p) => {
          return (
            <span
              key={p}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                padding: '4px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </span>
          );
        })}
        {remaining > 0 && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--admin-primary)',
              backgroundColor: 'rgba(124, 58, 237, 0.06)',
              border: '1px solid rgba(124, 58, 237, 0.12)',
              padding: '4px 8px',
              borderRadius: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  };

  return (
    <tr
      style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background-color 150ms ease' }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.65)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Member Profile */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid var(--admin-border)',
                flexShrink: 0
              }}
            />
          ) : (
            defaultAvatar
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--admin-text)', whiteSpace: 'nowrap' }}>
              {user.name}
              {user.isYou && (
                <span style={{ fontSize: '10.5px', color: 'var(--admin-primary)', fontWeight: 700, marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  (You)
                </span>
              )}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--admin-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          </div>
        </div>
      </td>

      {/* Role */}
      <td style={{ padding: '16px 20px' }}>
        {renderRoleBadge()}
      </td>

      {/* Status */}
      <td style={{ padding: '16px 20px' }}>
        {renderStatusBadge()}
      </td>

      {/* Last Login */}
      <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 500, color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap' }}>
        {user.lastLogin}
      </td>

      {/* Permissions */}
      <td style={{ padding: '16px 20px' }}>
        {renderPermissionChips()}
      </td>

      {/* Actions */}
      <td style={{ padding: '16px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onViewDetails(user)}
            className="hover-scale active-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--admin-primary)';
              e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Details</span>
          </button>

          {/* Render more action button only for other team members */}
          {!user.isYou && (
            <button
              className="hover-scale active-press"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: 'var(--admin-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--admin-primary)';
                e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--admin-text-secondary)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default MemberRow;
