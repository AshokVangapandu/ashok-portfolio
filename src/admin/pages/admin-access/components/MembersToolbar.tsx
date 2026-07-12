/* src/admin/pages/admin-access/components/MembersToolbar.tsx */
import React from 'react';
import { AdminRole, AdminStatus } from '../../../types/adminAccess';

interface MembersToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: AdminRole | 'All';
  setRoleFilter: (val: AdminRole | 'All') => void;
  statusFilter: AdminStatus | 'All';
  setStatusFilter: (val: AdminStatus | 'All') => void;
  onRefresh: () => void;
}

export const MembersToolbar: React.FC<MembersToolbarProps> = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onRefresh,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--admin-space-4)',
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--admin-radius-md) var(--admin-radius-md) 0 0',
        border: '1px solid var(--admin-border)',
        borderBottom: 'none',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '240px', boxSizing: 'border-box' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              border: '1px solid var(--admin-border)',
              borderRadius: '8px',
              fontSize: '13.5px',
              color: 'var(--admin-text)',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--admin-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
          />
        </div>

        {/* Role Select */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as AdminRole | 'All')}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '110px'
          }}
        >
          <option value="All">Role</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Portfolio Viewer">Portfolio Viewer</option>
        </select>

        {/* Status Select */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AdminStatus | 'All')}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--admin-border)',
            borderRadius: '8px',
            fontSize: '13.5px',
            color: 'var(--admin-text-secondary)',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '110px'
          }}
        >
          <option value="All">Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Refresh control */}
      <button
        onClick={onRefresh}
        className="hover-scale active-press"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          border: '1px solid var(--admin-border)',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          color: 'var(--admin-text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      </button>
    </div>
  );
};

export default MembersToolbar;
