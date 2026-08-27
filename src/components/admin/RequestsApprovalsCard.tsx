/* src/components/admin/RequestsApprovalsCard.tsx */
import React, { useEffect, useState, useCallback } from 'react';
import { contactService } from '../../admin/services/contactService';
import { accessRequestService } from '../../services/accessRequestService';
import { testimonialService } from '../../admin/services/testimonialService';
import { adminAccessService } from '../../admin/services/adminAccessService';
import { AccessRequest } from '../../admin/types/accessRequests';
import { AdminUser } from '../../admin/types/adminAccess';

export interface DashboardRequest {
  id: string;
  category: 'CONTACT' | 'PRIVATE ACCESS' | 'TESTIMONIAL' | 'ADMIN';
  title: string;
  description: string;
  badge: 'NEW' | 'PENDING' | 'REVIEW';
  badgeType: 'positive' | 'amber';
  rawTime: string;
  timestamp: string;
  icon: React.ReactNode;
}

// Relative time calculation utility
function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return 'recently';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'recently';
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export const RequestsApprovalsCard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [requestsList, setRequestsList] = useState<DashboardRequest[]>([]);
  const [totalAttentionCount, setTotalAttentionCount] = useState<number>(0);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const [contactRes, accessRes, testimonialRes, adminRes] = await Promise.all([
        contactService.getSubmissions({ status: 'open' }).catch(() => ({ data: [], count: 0 })),
        accessRequestService.getRequests().catch(() => [] as AccessRequest[]),
        testimonialService.getTestimonials({ status: 'pending' }).catch(() => ({ data: [], totalCount: 0 })),
        adminAccessService.getMembers({ status: 'Pending' }).catch(() => [] as AdminUser[])
      ]);

      const combined: DashboardRequest[] = [];

      // 1. Contact Messages (Open / New)
      if (contactRes.data && Array.isArray(contactRes.data)) {
        contactRes.data.forEach((msg) => {
          if (msg.status === 'open' || msg.status === 'New' || !msg.status) {
            const isoTime = msg.updatedAt || new Date().toISOString();
            combined.push({
              id: `contact-${msg.id}`,
              category: 'CONTACT',
              title: 'New contact message',
              description: msg.subject ? `Subject: ${msg.subject}` : `Message from ${msg.name || 'visitor'}.`,
              badge: 'NEW',
              badgeType: 'positive',
              rawTime: isoTime,
              timestamp: formatRelativeTime(isoTime),
              icon: (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              )
            });
          }
        });
      }

      // 2. Private Access Requests (Pending)
      if (accessRes && Array.isArray(accessRes)) {
        accessRes.forEach((req) => {
          if (req.requestStatus === 'pending') {
            const isoTime = req.requestedAt || req.createdAt || new Date().toISOString();
            combined.push({
              id: `access-${req.id}`,
              category: 'PRIVATE ACCESS',
              title: 'Private portfolio access request',
              description: req.fullName ? `${req.fullName} requested access.` : 'A visitor is waiting for access approval.',
              badge: 'PENDING',
              badgeType: 'amber',
              rawTime: isoTime,
              timestamp: formatRelativeTime(isoTime),
              icon: (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )
            });
          }
        });
      }

      // 3. Testimonials Awaiting Review (Pending)
      if (testimonialRes.data && Array.isArray(testimonialRes.data)) {
        testimonialRes.data.forEach((t) => {
          if (t.status === 'pending') {
            const isoTime = t.date || new Date().toISOString();
            combined.push({
              id: `testimonial-${t.id}`,
              category: 'TESTIMONIAL',
              title: 'Testimonial awaiting approval',
              description: t.name ? `New testimonial from ${t.name}.` : 'A new testimonial is waiting for your review.',
              badge: 'REVIEW',
              badgeType: 'amber',
              rawTime: isoTime,
              timestamp: formatRelativeTime(isoTime),
              icon: (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )
            });
          }
        });
      }

      // 4. Admin Invitations Awaiting Action (Pending)
      if (adminRes && Array.isArray(adminRes)) {
        adminRes.forEach((u) => {
          if (u.status === 'Pending') {
            const isoTime = u.joinedDate || new Date().toISOString();
            combined.push({
              id: `admin-${u.id}`,
              category: 'ADMIN',
              title: 'Admin invitation request',
              description: u.email ? `Invitation pending for ${u.email}.` : 'An administrator invitation is awaiting action.',
              badge: 'PENDING',
              badgeType: 'amber',
              rawTime: isoTime,
              timestamp: formatRelativeTime(isoTime),
              icon: (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="17" y1="11" x2="23" y2="11" />
                </svg>
              )
            });
          }
        });
      }

      // Sort Newest -> Oldest
      combined.sort((a, b) => new Date(b.rawTime).getTime() - new Date(a.rawTime).getTime());

      setTotalAttentionCount(combined.length);
      setRequestsList(combined);
    } catch (err) {
      console.warn('[RequestsApprovalsCard] Error loading requests:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Display limit: concise top 5 actionable items
  const displayedRequests = requestsList.slice(0, 5);

  return (
    <div className="premium-requests-card">
      {/* 1. Header Section */}
      <div className="requests-card-header">
        <div className="requests-header-left">
          <h3 className="requests-card-title">Requests & Approvals</h3>
          <p className="requests-card-subtitle">Things that need your attention.</p>
        </div>

        <button className="view-all-link" type="button">
          <span>View All</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* 2. Prominent Attention Summary Banner */}
      <div className={`requests-summary-banner ${totalAttentionCount === 0 ? 'banner-all-clear' : ''}`}>
        <div className="summary-pill-content">
          <span className={`summary-dot ${totalAttentionCount === 0 ? 'green' : 'amber'}`} />
          <span className={`summary-title-text ${totalAttentionCount === 0 ? 'green-text' : ''}`}>
            {loading ? 'Checking pending requests...' : totalAttentionCount === 0 ? 'You\'re all caught up' : `${totalAttentionCount} ${totalAttentionCount === 1 ? 'item needs' : 'items need'} your attention`}
          </span>
        </div>
      </div>

      {/* 3. Requests Feed List */}
      <div className="requests-card-body">
        {loading ? (
          /* Loading Skeletons */
          <div className="requests-list">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="premium-request-row req-skeleton-row">
                <div className="request-icon-box req-skeleton-box" />
                <div className="request-details" style={{ width: '100%' }}>
                  <div className="req-skeleton-text short" />
                  <div className="req-skeleton-text medium" style={{ marginTop: 4 }} />
                  <div className="req-skeleton-text long" style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Fallback */
          <div className="requests-empty-state">
            <div className="empty-state-icon">⚠️</div>
            <p className="empty-state-text">Unable to load pending requests.</p>
          </div>
        ) : displayedRequests.length === 0 ? (
          /* Clean Empty State */
          <div className="requests-empty-state">
            <div className="empty-state-icon">🎉</div>
            <p className="empty-state-text">You're all caught up</p>
            <p className="empty-state-sub">No requests or approvals need your attention right now.</p>
          </div>
        ) : (
          <div className="requests-list">
            {displayedRequests.map((item) => (
              <div key={item.id} className="premium-request-row">
                {/* Icon Container */}
                <div className="request-icon-box">
                  {item.icon}
                </div>

                {/* Details (Category, Title, Description) */}
                <div className="request-details">
                  <span className="request-category-tag">{item.category}</span>
                  <h4 className="request-title-text">{item.title}</h4>
                  <p className="request-desc-text">{item.description}</p>
                </div>

                {/* Meta Right (Badge & Timestamp) */}
                <div className="request-meta-right">
                  <span className={`request-status-badge badge-${item.badgeType}`}>
                    {item.badge}
                  </span>
                  <span className="request-time-text">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .premium-requests-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.015), 0 2px 4px -2px rgba(15, 23, 42, 0.015);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
          text-align: left;
          width: 100%;
          gap: 16px;
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), 
                      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-requests-card:hover {
          transform: translateY(-2.5px);
          border-color: rgba(99, 102, 241, 0.18);
          box-shadow: 0 10px 20px -3px rgba(15, 23, 42, 0.05), 0 4px 8px -4px rgba(15, 23, 42, 0.05);
        }

        /* 1. Header */
        .premium-requests-card .requests-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          gap: 12px;
        }

        .premium-requests-card .requests-header-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .premium-requests-card .requests-card-title {
          font-size: 17px;
          font-weight: 750;
          margin: 0;
          color: #0F172A;
          letter-spacing: -0.015em;
        }

        .premium-requests-card .requests-card-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
        }

        .premium-requests-card .view-all-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #4F46E5;
          text-decoration: none;
          cursor: pointer;
          transition: color 150ms ease;
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          padding: 0;
          outline: none;
          flex-shrink: 0;
        }

        .premium-requests-card .view-all-link:hover {
          color: #3730A3;
        }

        /* 2. Summary Banner */
        .premium-requests-card .requests-summary-banner {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 12px;
          padding: 10px 14px;
          width: 100%;
          box-sizing: border-box;
          transition: all 200ms ease;
        }

        .premium-requests-card .requests-summary-banner.banner-all-clear {
          background: #F0FDF4;
          border-color: #BBF7D0;
        }

        .premium-requests-card .summary-pill-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .premium-requests-card .summary-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .premium-requests-card .summary-dot.amber {
          background-color: #F59E0B;
        }

        .premium-requests-card .summary-dot.green {
          background-color: #16A34A;
        }

        .premium-requests-card .summary-title-text {
          font-size: 13px;
          font-weight: 700;
          color: #B45309;
        }

        .premium-requests-card .summary-title-text.green-text {
          color: #15803D;
        }

        /* 3. Feed List */
        .premium-requests-card .requests-card-body {
          width: 100%;
        }

        .premium-requests-card .requests-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .premium-requests-card .premium-request-row {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          transition: all 200ms ease;
          width: 100%;
          box-sizing: border-box;
          gap: 14px;
        }

        .premium-requests-card .premium-request-row:hover {
          border-color: #E2E8F0;
          background-color: rgba(124, 58, 237, 0.02);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        .premium-requests-card .request-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background-color: rgba(99, 102, 241, 0.08);
          color: #4F46E5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 200ms ease;
        }

        .premium-requests-card .premium-request-row:hover .request-icon-box {
          background-color: rgba(99, 102, 241, 0.14);
        }

        .premium-requests-card .request-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 2px;
          overflow: hidden;
        }

        .premium-requests-card .request-category-tag {
          font-size: 10.5px;
          font-weight: 750;
          color: #64748B;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .premium-requests-card .request-title-text {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .premium-requests-card .request-desc-text {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-requests-card .request-meta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }

        .premium-requests-card .request-status-badge {
          font-size: 10.5px;
          font-weight: 700;
          border-radius: 999px;
          padding: 3px 8px;
          line-height: 1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .premium-requests-card .badge-positive {
          color: #16A34A;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.18);
        }

        .premium-requests-card .badge-amber {
          color: #D97706;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.18);
        }

        .premium-requests-card .request-time-text {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Empty & Error State */
        .premium-requests-card .requests-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 20px;
          text-align: center;
        }

        .premium-requests-card .empty-state-icon {
          font-size: 28px;
          margin-bottom: 6px;
        }

        .premium-requests-card .empty-state-text {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .premium-requests-card .empty-state-sub {
          font-size: 12.5px;
          color: #64748B;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        /* Skeleton Loading */
        .premium-requests-card .req-skeleton-box {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: reqSkeletonPulse 1.5s infinite;
        }

        .premium-requests-card .req-skeleton-text {
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: reqSkeletonPulse 1.5s infinite;
        }

        .premium-requests-card .req-skeleton-text.short { width: 80px; }
        .premium-requests-card .req-skeleton-text.medium { width: 140px; }
        .premium-requests-card .req-skeleton-text.long { width: 190px; }

        @keyframes reqSkeletonPulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Media Responsiveness */
        @media (max-width: 580px) {
          .premium-requests-card .premium-request-row {
            padding: 10px;
            gap: 10px;
          }
          .premium-requests-card .request-meta-right {
            align-items: flex-end;
          }
          .premium-requests-card .request-title-text {
            font-size: 12.5px;
          }
          .premium-requests-card .request-desc-text {
            font-size: 11.5px;
          }
        }
      `}} />
    </div>
  );
};

export default RequestsApprovalsCard;
