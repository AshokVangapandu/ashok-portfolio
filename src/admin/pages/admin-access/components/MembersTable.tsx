/* src/admin/pages/admin-access/components/MembersTable.tsx */
import React from 'react';
import { AdminUser } from '../../../types/adminAccess';
import { MemberRow } from './MemberRow';

interface MembersTableProps {
  members: AdminUser[];
  onViewDetails: (u: AdminUser) => void;
  onInviteClick?: () => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  onViewDetails,
  onInviteClick,
}) => {
  if (members.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--admin-border)',
          borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
          boxSizing: 'border-box',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(124, 92, 255, 0.05)',
            color: 'var(--admin-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: 'var(--admin-text)' }}>
          No Team Members Yet
        </h3>
        
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--admin-text-secondary)', maxWidth: '320px', lineHeight: 1.4, fontWeight: 500 }}>
          Invite administrators to help manage your portfolio dashboard.
        </p>

        {onInviteClick && (
          <button
            onClick={onInviteClick}
            className="hover-scale active-press"
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'var(--admin-primary)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 92, 255, 0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            Invite First Admin
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        boxSizing: 'border-box',
        borderRadius: '0'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: "'Inter', sans-serif" }}>
        <thead>
          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--admin-border)' }}>
            {['Member', 'Role', 'Status', 'Last Login', 'Permissions', 'Actions'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '14px var(--admin-space-4)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((u) => (
            <MemberRow
              key={u.id}
              user={u}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
