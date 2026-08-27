/* src/admin/pages/maintenance-subscribers/MaintenanceSubscribersPage.tsx */
import React, { useState } from 'react';
import { useMaintenanceSubscribers } from '../../hooks/useMaintenanceSubscribers';
import { Card } from '../../components/cards/Card';

export const MaintenanceSubscribersPage: React.FC = () => {
  const {
    filteredSubscribers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    markAsNotified,
    deleteSubscriber,
    refresh
  } = useMaintenanceSubscribers();

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleMarkNotified = async (id: string) => {
    setActionLoadingId(id);
    await markAsNotified(id);
    setActionLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      setActionLoadingId(id);
      await deleteSubscriber(id);
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
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
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      {/* Error Banner */}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Subscribers
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-text)' }}>
              {stats.total}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>
              {stats.pending}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Queued
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#7C3AED' }}>
              {stats.queued}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Notified
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>
              {stats.notified}
            </span>
          </div>
        </Card>

        <Card style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's New
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--admin-primary)' }}>
              {stats.todayNew}
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
              placeholder="Search by email..."
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
            {(['all', 'pending', 'queued', 'notified'] as const).map((tab) => {
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
            Loading maintenance subscribers...
          </div>
        ) : filteredSubscribers.length === 0 ? (
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--admin-text)' }}>
              No Maintenance Subscribers Yet
            </h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--admin-text-secondary)', maxWidth: '360px', lineHeight: 1.5 }}>
              When visitors subscribe through the Notify Me form on your maintenance page, they'll appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--admin-border)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Subscriber Email
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Subscribed On
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Source
                  </th>
                  <th style={{ padding: '12px 20px', fontWeight: 700, color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((item) => {
                  const isPending = item.status === 'pending';
                  const isQueued = item.status === 'queued';
                  const isActionBusy = actionLoadingId === item.id;

                  const badgeBg = isPending ? '#FEF3C7' : isQueued ? '#EDE9FE' : '#D1FAE5';
                  const badgeColor = isPending ? '#D97706' : isQueued ? '#7C3AED' : '#059669';
                  const statusLabel = isPending ? 'Pending' : isQueued ? 'Queued' : 'Notified';

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--admin-border)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--admin-text)' }}>
                        {item.email}
                      </td>
                      <td style={{ padding: '10px 16px', color: 'var(--admin-text-secondary)', fontSize: '13px' }}>
                        {formatDate(item.subscribedAt)}
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
                            color: badgeColor
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
                          {statusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--admin-text-secondary)', fontSize: '12.5px' }}>
                        {item.source || 'maintenance_page'}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {(isPending || isQueued) && (
                            <button
                              type="button"
                              disabled={isActionBusy}
                              onClick={() => handleMarkNotified(item.id)}
                              className="hover-scale active-press"
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: '1px solid #10B981',
                                backgroundColor: '#ECFDF5',
                                color: '#059669',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: isActionBusy ? 'not-allowed' : 'pointer'
                              }}
                            >
                              Mark Notified
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isActionBusy}
                            onClick={() => handleDelete(item.id)}
                            className="hover-scale active-press"
                            title="Delete Subscriber"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: '#FFFFFF',
                              color: '#EF4444',
                              cursor: isActionBusy ? 'not-allowed' : 'pointer',
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
    </div>
  );
};

export default MaintenanceSubscribersPage;
