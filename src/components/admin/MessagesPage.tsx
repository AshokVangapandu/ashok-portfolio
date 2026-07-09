import React, { useState, useEffect } from 'react';
import { useContactMessages, ContactMessage } from '../../hooks/useContactMessages';

export const MessagesPage: React.FC = () => {
  const {
    messages,
    filteredCount,
    loading,
    error,
    fetchMessages,
    deleteMessage
  } = useContactMessages();

  // Search, Sorting, Pagination options
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Selected message state for detail modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Fetch messages when page, sort, or debounced search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages({
        page,
        pageSize,
        sortBy: 'created_at',
        sortOrder,
        searchQuery
      });
    }, 250); // slight debounce for typing

    return () => clearTimeout(timer);
  }, [page, sortOrder, searchQuery, fetchMessages]);

  // Reset page to 1 when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
    setPage(1);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent opening details modal
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      const success = await deleteMessage(id);
      if (success) {
        // If current page is now empty and we are not on page 1, step back a page
        if (messages.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          // reload current page
          fetchMessages({
            page,
            pageSize,
            sortBy: 'created_at',
            sortOrder,
            searchQuery
          });
        }
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  return (
    <div className="messages-page-root">
      <div className="messages-page-header">
        <h1 className="messages-page-title">Messages</h1>
        <p className="messages-page-subtitle">Manage client inquiries and contact form submissions</p>
      </div>

      {/* Filters and Actions Bar */}
      <div className="messages-filters-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="messages-search-field"
          />
        </div>

        <div className="sort-select-wrapper">
          <select value={sortOrder} onChange={handleSortChange} className="messages-sort-select">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Main Messages Content Area */}
      {error && (
        <div className="messages-error-banner">
          <span>⚠️ Error: {error}</span>
        </div>
      )}

      <div className="messages-table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton Rows
              [...Array(5)].map((_, i) => (
                <tr key={i} className="skeleton-row">
                  <td><div className="skeleton-cell w-32" /></td>
                  <td><div className="skeleton-cell w-48" /></td>
                  <td><div className="skeleton-cell w-64" /></td>
                  <td><div className="skeleton-cell w-24" /></td>
                  <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="skeleton-cell w-8" style={{ height: '32px' }} />
                  </td>
                </tr>
              ))
            ) : messages.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={5} className="table-empty-state">
                  <div className="empty-state-wrapper">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <h4>No contact messages yet.</h4>
                    <p>When clients send you messages from your portfolio, they will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Messages Data Rows
              messages.map((msg) => (
                <tr key={msg.id} onClick={() => setSelectedMessage(msg)} className="data-row">
                  <td className="font-semibold text-white">{msg.full_name}</td>
                  <td className="text-muted">{msg.email}</td>
                  <td className="message-subject-cell text-white">{msg.subject}</td>
                  <td className="text-muted">{formatDate(msg.created_at)}</td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleDelete(e, msg.id)}
                      className="table-action-btn delete"
                      title="Delete Message"
                      aria-label="Delete message"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && messages.length > 0 && (
        <div className="messages-pagination-bar">
          <span className="pagination-count-label">
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({filteredCount} total messages)
          </span>
          <div className="pagination-buttons">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Detail Overlay Panel */}
      {selectedMessage && (
        <div className="message-detail-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="message-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="detail-panel-header">
              <h3>Message Details</h3>
              <button onClick={() => setSelectedMessage(null)} className="detail-close-btn" aria-label="Close detail panel">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="detail-panel-body">
              <div className="detail-field">
                <span className="field-label">Sender Name</span>
                <p className="field-value text-white">{selectedMessage.full_name}</p>
              </div>
              <div className="detail-field">
                <span className="field-label">Email Address</span>
                <p className="field-value">
                  <a href={`mailto:${selectedMessage.email}`} className="detail-email-link">{selectedMessage.email}</a>
                </p>
              </div>
              {selectedMessage.company && (
                <div className="detail-field">
                  <span className="field-label">Company</span>
                  <p className="field-value text-white">{selectedMessage.company}</p>
                </div>
              )}
              {selectedMessage.phone_number && (
                <div className="detail-field">
                  <span className="field-label">Phone Number</span>
                  <p className="field-value text-white">{selectedMessage.phone_number}</p>
                </div>
              )}
              <div className="detail-field">
                <span className="field-label">Subject</span>
                <p className="field-value text-white font-semibold">{selectedMessage.subject}</p>
              </div>
              <div className="detail-field">
                <span className="field-label">Date Submitted</span>
                <p className="field-value">{formatDate(selectedMessage.created_at)}</p>
              </div>
              <div className="detail-field message-body-field">
                <span className="field-label">Message Content</span>
                <div className="field-value message-text-box">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="detail-panel-footer">
              <button 
                onClick={(e) => handleDelete(e, selectedMessage.id)}
                className="detail-action-btn delete"
              >
                Delete Message
              </button>
              <button onClick={() => setSelectedMessage(null)} className="detail-action-btn close">
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
