/* src/admin/pages/admin-access/AdminAccessPage.tsx */
import React from 'react';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import { SummaryCards } from './components/SummaryCards';
import { MembersToolbar } from './components/MembersToolbar';
import { MembersTable } from './components/MembersTable';
import { InviteAdminModal } from './components/InviteAdminModal';
import { MemberDetailsModal } from './components/MemberDetailsModal';

export const AdminAccessPage: React.FC = () => {
  const {
    loading,
    summary,
    members,
    
    // Filters state
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,

    // Modals controls
    inviteModalOpen,
    setInviteModalOpen,
    detailsModalUser,
    setDetailsModalUser,

    // Actions
    refresh,
    handleInviteSubmit
  } = useAdminAccess();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--admin-space-6)',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* 1. Page Header panel */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxSizing: 'border-box'
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
            Access Management
          </h1>
          <p
            style={{
              margin: 0,
              color: 'var(--admin-text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            Manage users who can access the Portfolio Admin Dashboard and assign their access roles.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="hover-scale active-press animate-glow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'var(--admin-primary)',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--admin-shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <span>Invite Admin</span>
        </button>
      </div>


      {/* 2. Summary cards panel */}
      <SummaryCards summary={summary} />

      {/* 3. Toolbar & table logs wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <MembersToolbar
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRefresh={refresh}
        />

        <MembersTable
          members={members}
          onViewDetails={setDetailsModalUser}
          onInviteClick={() => setInviteModalOpen(true)}
        />

        {/* PAGINATION / FOOTER INFO CARD */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border)',
            borderTop: 'none',
            borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
            boxSizing: 'border-box',
            fontSize: '13px',
            color: 'var(--admin-text-secondary)'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--admin-text)' }}>{members.length}</strong> members
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Access changes take effect immediately.</span>
          </div>
        </div>
      </div>

      {/* 4. MODALS OVERLAYS */}
      <InviteAdminModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSubmit={handleInviteSubmit}
      />

      <MemberDetailsModal
        user={detailsModalUser}
        onClose={() => setDetailsModalUser(null)}
      />
    </div>
  );
};

export default AdminAccessPage;
