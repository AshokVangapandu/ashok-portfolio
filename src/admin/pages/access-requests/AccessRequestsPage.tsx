/* src/admin/pages/access-requests/AccessRequestsPage.tsx */
import React, { useState } from 'react';
import { useAccessRequests } from '../../hooks/useAccessRequests';
import { Card } from '../../components/cards/Card';
import { AccessRequest } from '../../types/accessRequests';

export const AccessRequestsPage: React.FC = () => {
  const {
    filteredRequests,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    approveRequest,
    rejectRequest,
    refresh
  } = useAccessRequests();

  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');

  const handleOpenDetails = (req: AccessRequest) => {
    setSelectedRequest(req);
    setAdminNotesInput(req.notes || '');
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await approveRequest(id);
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest((prev) => (prev ? { ...prev, requestStatus: 'approved' } : null));
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to approve request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await rejectRequest(id, adminNotesInput);
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest((prev) => (prev ? { ...prev, requestStatus: 'rejected', notes: adminNotesInput } : null));
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to reject request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

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
              Total Requests
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-text)' }}>
              {stats.total}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Review
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>
              {stats.pending}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Approved
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>
              {stats.approved}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Rejected
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444' }}>
              {stats.rejected}
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
              placeholder="Search by name, email, or company..."
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
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
              const isSelected = statusFilter === tab;
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
                    textTransform: 'capitalize',
                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
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
        </div>
      </Card>

      {/* Main Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
            Loading access requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--admin-text)' }}>
              No Access Requests Yet
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--admin-text-secondary)', maxWidth: '360px', lineHeight: 1.5 }}>
              When visitors request access on your private portfolio page, their details will appear here for review.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Visitor Name & Email
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Company & Title
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Requested On
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const isPending = req.requestStatus === 'pending';
                  const isApproved = req.requestStatus === 'approved';
                  const isBusy = actionLoadingId === req.id;

                  const badgeBg = isPending ? '#FEF3C7' : isApproved ? '#D1FAE5' : '#FEE2E2';
                  const badgeColor = isPending ? '#D97706' : isApproved ? '#059669' : '#DC2626';

                  return (
                    <tr
                      key={req.id}
                      style={{
                        borderBottom: '1px solid var(--admin-border)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                            {req.fullName}
                          </span>
                          <span style={{ fontSize: '12.5px', color: 'var(--admin-text-secondary)' }}>
                            {req.email}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--admin-text)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{req.company || 'N/A'}</span>
                          {req.jobTitle && (
                            <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                              {req.jobTitle}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>
                        {formatDate(req.requestedAt)}
                      </td>
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
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            textTransform: 'capitalize'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: badgeColor
                            }}
                          />
                          {req.requestStatus}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(req)}
                            className="hover-scale active-press"
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#FFFFFF',
                              color: 'var(--admin-text)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Details
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleApprove(req.id)}
                                className="hover-scale active-press"
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #10B981',
                                  backgroundColor: '#ECFDF5',
                                  color: '#059669',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: isBusy ? 'not-allowed' : 'pointer'
                                }}
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleReject(req.id)}
                                className="hover-scale active-press"
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #FCA5A5',
                                  backgroundColor: '#FEF2F2',
                                  color: '#991B1B',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: isBusy ? 'not-allowed' : 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
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

      {/* Details Modal */}
      {selectedRequest && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)' }}>
                  Request Details
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                  Requested on {formatDate(selectedRequest.requestedAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Full Name</span>
                  <div style={{ fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>{selectedRequest.fullName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Email</span>
                  <div style={{ fontWeight: 600, color: 'var(--admin-text)', marginTop: '2px' }}>{selectedRequest.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Company</span>
                  <div style={{ fontWeight: 500, color: 'var(--admin-text)', marginTop: '2px' }}>{selectedRequest.company || 'N/A'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Job Title</span>
                  <div style={{ fontWeight: 500, color: 'var(--admin-text)', marginTop: '2px' }}>{selectedRequest.jobTitle || 'N/A'}</div>
                </div>
              </div>

              {selectedRequest.linkedinUrl && (
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>LinkedIn Profile</span>
                  <div style={{ marginTop: '2px' }}>
                    <a href={selectedRequest.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED', fontWeight: 500, textDecoration: 'none' }}>
                      {selectedRequest.linkedinUrl} ↗
                    </a>
                  </div>
                </div>
              )}

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Reason for Request</span>
                <p style={{ margin: '4px 0 0 0', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', lineHeight: 1.5, color: 'var(--admin-text)' }}>
                  {selectedRequest.reason}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase' }}>Admin Review Notes</span>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Internal notes for approval or rejection..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '13px', marginTop: '4px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>

              {selectedRequest.requestStatus === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedRequest.id)}
                    style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#991B1B', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reject Request
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApprove(selectedRequest.id)}
                    style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Approve & Authorize User
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessRequestsPage;
