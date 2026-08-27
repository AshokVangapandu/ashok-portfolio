/* src/admin/pages/authorized-users/AuthorizedUsersPage.tsx */
import React, { useState } from 'react';
import { useAuthorizedUsers } from '../../hooks/useAuthorizedUsers';
import { Card } from '../../components/cards/Card';
import { AuthorizedUser, AccessLevel } from '../../types/authorizedUsers';

export const AuthorizedUsersPage: React.FC = () => {
  const {
    filteredUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    refresh
  } = useAuthorizedUsers();

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);

  // Add Form fields
  const [addEmail, setAddEmail] = useState('');
  const [addFullName, setAddFullName] = useState('');
  const [addAccessLevel, setAddAccessLevel] = useState<AccessLevel>('viewer');
  const [addNotes, setAddNotes] = useState('');
  const [addError, setAddError] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Edit Form fields
  const [editFullName, setEditFullName] = useState('');
  const [editAccessLevel, setEditAccessLevel] = useState<AccessLevel>('viewer');
  const [editNotes, setEditNotes] = useState('');
  const [editError, setEditError] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleOpenAddModal = () => {
    setAddEmail('');
    setAddFullName('');
    setAddAccessLevel('viewer');
    setAddNotes('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: AuthorizedUser) => {
    setEditingUser(user);
    setEditFullName(user.fullName || '');
    setEditAccessLevel(user.accessLevel || 'viewer');
    setEditNotes(user.notes || '');
    setEditError('');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const cleanEmail = addEmail.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAddError('Please enter a valid email address.');
      return;
    }

    setIsSubmittingAdd(true);
    try {
      await createUser({
        email: cleanEmail,
        fullName: addFullName,
        accessLevel: addAccessLevel,
        notes: addNotes
      });
      setIsAddModalOpen(false);
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add user.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError('');

    setIsSubmittingEdit(true);
    try {
      await updateUser(editingUser.id, {
        fullName: editFullName,
        accessLevel: editAccessLevel,
        notes: editNotes
      });
      setEditingUser(null);
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update user.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleToggleStatus = async (user: AuthorizedUser) => {
    setActionLoadingId(user.id);
    await toggleUserStatus(user.id, user.accessStatus);
    setActionLoadingId(null);
  };

  const handleDelete = async (user: AuthorizedUser) => {
    if (window.confirm(`Are you sure you want to remove ${user.email} from authorized users?`)) {
      setActionLoadingId(user.id);
      await deleteUser(user.id);
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getInitials = (email: string, name?: string | null) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--admin-space-6)',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Manrope', sans-serif"
      }}
    >


      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#991B1B',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Users
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-text)' }}>
              {stats.total}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Access
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>
              {stats.active}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Disabled Access
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444' }}>
              {stats.disabled}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Invitations
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#64748B' }}>
              {stats.pendingInvitations}
            </span>
          </div>
        </Card>
      </div>

      {/* Filter & Search Toolbar */}
      <Card style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid var(--admin-border)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filter Status Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '2px', borderRadius: '6px', gap: '2px' }}>
            {(['all', 'enabled', 'disabled'] as const).map((tab) => {
              const isSelected = statusFilter === tab;
              const label = tab === 'enabled' ? 'Active' : tab === 'disabled' ? 'Disabled' : 'All';
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    color: isSelected ? 'var(--admin-text)' : '#64748B',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => refresh()}
              className="hover-scale active-press"
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Refresh
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="hover-scale active-press"
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.2)'
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add User
            </button>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
            Loading authorized users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--admin-text)' }}>
                No Authorized Users
              </h3>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--admin-text-secondary)', maxWidth: '380px', lineHeight: 1.5 }}>
                Add trusted users who should be able to access your portfolio while Private Mode is active.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Add First User
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    User / Email
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Access Level
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Added Date
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Last Access
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isEnabled = user.accessStatus === 'enabled';
                  const isBusy = actionLoadingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid var(--admin-border)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Name & Email */}
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(124, 58, 237, 0.1)',
                              color: '#7C3AED',
                              fontWeight: 700,
                              fontSize: '13px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(124, 58, 237, 0.2)'
                            }}
                          >
                            {getInitials(user.email, user.fullName)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                              {user.fullName || user.email.split('@')[0]}
                            </span>
                            <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)' }}>
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Access Level */}
                      <td style={{ padding: '14px 20px', textTransform: 'capitalize', fontWeight: 500, color: 'var(--admin-text)' }}>
                        {user.accessLevel}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '10px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            backgroundColor: isEnabled ? '#D1FAE5' : '#FEE2E2',
                            color: isEnabled ? '#059669' : '#DC2626'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isEnabled ? '#059669' : '#DC2626'
                            }}
                          />
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>

                      {/* Added Date */}
                      <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Last Access */}
                      <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>
                        {formatDate(user.lastAccess)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggleStatus(user)}
                            className="hover-scale active-press"
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: isEnabled ? '1px solid #FCA5A5' : '1px solid #6EE7B7',
                              backgroundColor: isEnabled ? '#FEF2F2' : '#ECFDF5',
                              color: isEnabled ? '#991B1B' : '#065F46',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: isBusy ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {isEnabled ? 'Disable' : 'Enable'}
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleOpenEditModal(user)}
                            className="hover-scale active-press"
                            title="Edit User"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--admin-text)',
                              cursor: isBusy ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(user)}
                            className="hover-scale active-press"
                            title="Delete User"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#FFFFFF',
                              color: '#EF4444',
                              cursor: isBusy ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
                Add Authorized User
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {addError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
                {addError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@example.com"
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={addFullName}
                  onChange={(e) => setAddFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Access Level
                </label>
                <select
                  value={addAccessLevel}
                  onChange={(e) => setAddAccessLevel(e.target.value as AccessLevel)}
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="e.g. Shared for tech interview review"
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: isSubmittingAdd ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmittingAdd ? 'Saving...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
                Edit Authorized User
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {editError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '8px', color: '#991B1B', fontSize: '13px' }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Access Level
                </label>
                <select
                  value={editAccessLevel}
                  onChange={(e) => setEditAccessLevel(e.target.value as AccessLevel)}
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px' }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--admin-text)' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes..."
                  style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13.5px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#7C3AED', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: isSubmittingEdit ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizedUsersPage;
