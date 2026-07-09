import React, { useEffect } from 'react';
import { useContactMessages } from '../../hooks/useContactMessages';

export const MessageCard: React.FC = () => {
  const { recentMessages, loading, error, fetchRecentMessages } = useContactMessages();

  useEffect(() => {
    fetchRecentMessages();
  }, [fetchRecentMessages]);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'CM';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getAvatarGradient = (email: string) => {
    const gradients = [
      'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
      'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)',
      'linear-gradient(135deg, #F09819 0%, #EDDE5D 100%)',
      'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      'linear-gradient(135deg, #f12711 0%, #f5af19 100%)'
    ];
    let sum = 0;
    const str = email || '';
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = new Date();
      const then = new Date(dateStr);
      const diffMs = now.getTime() - then.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="message-card">
      <div className="message-card-header">
        <h3 className="message-card-title">Recent Messages</h3>
      </div>
      <div className="message-card-body">
        {error && (
          <div style={{ color: '#ff5e62', fontSize: '13px', margin: '8px 0', fontWeight: 500 }}>
            ⚠️ Failed to load messages: {error}
          </div>
        )}
        <div className="message-list">
          {loading ? (
            // Message Row Skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="message-row skeleton-row-flex" style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px' }}>
                <div className="skeleton-cell" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-cell" style={{ width: '80px', height: '14px' }} />
                  <div className="skeleton-cell" style={{ width: '160px', height: '12px' }} />
                </div>
              </div>
            ))
          ) : recentMessages.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted, #a8afbf)', fontSize: '14px' }}>
              No contact messages yet.
            </div>
          ) : (
            recentMessages.map((msg) => {
              const statusClass = msg.status === 'New' ? 'unread' : 'read';
              return (
                <div key={msg.id} className="message-row">
                  <div className="message-avatar" style={{ background: getAvatarGradient(msg.email) }}>
                    {getInitials(msg.full_name)}
                  </div>
                  <div className="message-content">
                    <div className="message-meta">
                      <span className="message-name">{msg.full_name}</span>
                      <span className="message-time">{formatRelativeTime(msg.created_at)}</span>
                    </div>
                    <p className="message-subject">{msg.subject}</p>
                  </div>
                  <div className="message-status">
                    <span className={`status-badge ${statusClass}`}>
                      {msg.status === 'New' ? 'Unread' : 'Read'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
