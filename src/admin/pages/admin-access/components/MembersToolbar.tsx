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
        gap: '16px',
        padding: '20px 24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px 12px 0 0',
        border: '1px solid var(--admin-border)',
        borderBottom: 'none',
        boxSizing: 'border-box',
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      {/* Search Input & Select Dropdowns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '260px', boxSizing: 'border-box' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search members by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px 0 36px',
              border: '1.5px solid rgba(226, 232, 240, 1)',
              borderRadius: '8px',
              fontSize: '13.5px',
              color: 'var(--admin-text)',
              backgroundColor: '#F8FAFC',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-primary)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Role Filter dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as AdminRole | 'All')}
            style={{
              height: '38px',
              padding: '0 32px 0 12px',
              border: '1.5px solid rgba(226, 232, 240, 1)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '120px',
              appearance: 'none'
            }}
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Portfolio Viewer">Portfolio Viewer</option>
          </select>
          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Status Filter dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminStatus | 'All')}
            style={{
              height: '38px',
              padding: '0 32px 0 12px',
              border: '1.5px solid rgba(226, 232, 240, 1)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '120px',
              appearance: 'none'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="hover-scale active-press"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          border: '1.5px solid rgba(226, 232, 240, 1)',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          color: '#475569',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--admin-primary)';
          e.currentTarget.style.borderColor = 'rgba(124, 92, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#475569';
          e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 1)';
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
