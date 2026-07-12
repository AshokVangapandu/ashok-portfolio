/* src/admin/pages/admin-access/components/MembersTable.tsx */
import React from 'react';
import { AdminUser } from '../../../types/adminAccess';
import { MemberRow } from './MemberRow';

interface MembersTableProps {
  members: AdminUser[];
  onViewDetails: (u: AdminUser) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  onViewDetails,
}) => {
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
                  padding: '12px var(--admin-space-4)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--admin-text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '48px var(--admin-space-4)', textAlign: 'center', color: 'var(--admin-text-secondary)', fontSize: '14px' }}>
                No administrative members match active filter selections.
              </td>
            </tr>
          ) : (
            members.map((u) => (
              <MemberRow
                key={u.id}
                user={u}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
