/* src/components/admin/ContentPublishingCard.tsx */
import React from 'react';

export const ContentPublishingCard: React.FC = () => {
  return (
    <div className="content-publishing-card">
      {/* 1. Header Section */}
      <div className="card-header-area">
        <div className="header-left">
          <div className="header-icon-box">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div>
            <h3 className="card-title-text">Content & Publishing</h3>
            <p className="card-subtitle-text">Keep your portfolio content organized and publication-ready.</p>
          </div>
        </div>

        <button className="quick-edit-btn" type="button">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Quick Edit</span>
        </button>
      </div>

      {/* 2. Top Summary Metric Cards (3 Columns) */}
      <div className="summary-cards-row">
        <div className="metric-card published">
          <div className="metric-header">
            <span className="dot green"></span>
            <span className="metric-label green-label">PUBLISHED</span>
          </div>
          <span className="metric-count">37</span>
        </div>

        <div className="metric-card drafts">
          <div className="metric-header">
            <span className="dot purple"></span>
            <span className="metric-label purple-label">DRAFTS</span>
          </div>
          <span className="metric-count">3</span>
        </div>

        <div className="metric-card review">
          <div className="metric-header">
            <span className="dot orange"></span>
            <span className="metric-label orange-label">NEEDS REVIEW</span>
          </div>
          <span className="metric-count">2</span>
        </div>
      </div>

      {/* 3. Categories Grid (2x2) */}
      <div className="categories-grid">
        <div className="category-card">
          <div className="cat-icon-box purple-bg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="cat-details">
            <span className="cat-title">Projects</span>
            <span className="cat-sub">18 Published</span>
          </div>
        </div>

        <div className="category-card">
          <div className="cat-icon-box green-bg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <div className="cat-details">
            <span className="cat-title">Certifications</span>
            <span className="cat-sub">12 Published</span>
          </div>
        </div>

        <div className="category-card">
          <div className="cat-icon-box pink-bg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="cat-details">
            <span className="cat-title">Testimonials</span>
            <span className="cat-sub">92 Approved</span>
          </div>
        </div>

        <div className="category-card">
          <div className="cat-icon-box orange-bg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="cat-details">
            <span className="cat-title">Resume</span>
            <span className="cat-sub">Up to date</span>
          </div>
        </div>
      </div>

      {/* 4. Horizontal Pipeline Legend Bar */}
      <div className="pipeline-legend-bar">
        <div className="legend-item">
          <span className="legend-dot green"></span>
          <span className="legend-title">Published</span>
          <span className="legend-desc">Content that is currently live.</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot purple"></span>
          <span className="legend-title">Drafts</span>
          <span className="legend-desc">Content that exists but is not published.</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot orange"></span>
          <span className="legend-title">Needs Review</span>
          <span className="legend-desc">Content requiring admin attention.</span>
        </div>
      </div>

      {/* 5. Bottom Attention & Action Banner */}
      <div className="attention-cta-banner">
        <div className="banner-left">
          <div className="warning-icon-wrapper">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="banner-text">
            <h5 className="banner-title">2 items need attention</h5>
            <p className="banner-sub">1 Certification pending review &nbsp;•&nbsp; 1 Project missing thumbnail</p>
          </div>
        </div>

        <button className="view-content-btn" type="button">
          <span>View Content</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .content-publishing-card {
          background: #FFFFFF;
          border: 1px solid #EAEBEF;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          text-align: left;
          width: 100%;
          gap: 20px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .content-publishing-card:hover {
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }

        /* 1. Header Area */
        .content-publishing-card .card-header-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .content-publishing-card .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .content-publishing-card .header-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background-color: rgba(124, 58, 237, 0.08);
          color: #7C3AED;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .card-title-text {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #1E1B4B;
          letter-spacing: -0.01em;
        }

        .content-publishing-card .card-subtitle-text {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          font-weight: 450;
        }

        .content-publishing-card .quick-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          background: #F5F3FF;
          border: 1px solid #DDD6FE;
          color: #6D28D9;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .content-publishing-card .quick-edit-btn:hover {
          background: #EDE9FE;
          border-color: #C4B5FD;
        }

        /* 2. Top Summary Metric Cards (3 Columns) */
        .content-publishing-card .summary-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
        }

        .content-publishing-card .metric-card {
          padding: 16px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid transparent;
        }

        .content-publishing-card .metric-card.published {
          background: #F2FBF7;
          border-color: #D1F2E4;
        }

        .content-publishing-card .metric-card.drafts {
          background: #F5F3FF;
          border-color: #EDE9FE;
        }

        .content-publishing-card .metric-card.review {
          background: #FFFBEB;
          border-color: #FDE68A;
        }

        .content-publishing-card .metric-header {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .content-publishing-card .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .content-publishing-card .dot.green { background-color: #10B981; }
        .content-publishing-card .dot.purple { background-color: #7C3AED; }
        .content-publishing-card .dot.orange { background-color: #F59E0B; }

        .content-publishing-card .metric-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .content-publishing-card .green-label { color: #047857; }
        .content-publishing-card .purple-label { color: #5B21B6; }
        .content-publishing-card .orange-label { color: #B45309; }

        .content-publishing-card .metric-count {
          font-size: 26px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1;
        }

        /* 3. Categories Grid (2x2) */
        .content-publishing-card .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
        }

        .content-publishing-card .category-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #F1F5F9;
          background: #FFFFFF;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .content-publishing-card .category-card:hover {
          border-color: #E2E8F0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .content-publishing-card .cat-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .purple-bg { background: #EEF2FF; color: #4F46E5; }
        .content-publishing-card .green-bg { background: #ECFDF5; color: #059669; }
        .content-publishing-card .pink-bg { background: #FDF2F8; color: #DB2777; }
        .content-publishing-card .orange-bg { background: #FFF7ED; color: #EA580C; }

        .content-publishing-card .cat-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .content-publishing-card .cat-title {
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
        }

        .content-publishing-card .cat-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 450;
        }

        /* 4. Horizontal Pipeline Legend Bar */
        .content-publishing-card .pipeline-legend-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-radius: 12px;
          background: #FAFAFC;
          border: 1px solid #F1F5F9;
          gap: 16px;
        }

        .content-publishing-card .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .content-publishing-card .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .content-publishing-card .legend-dot.green { background: #10B981; }
        .content-publishing-card .legend-dot.purple { background: #7C3AED; }
        .content-publishing-card .legend-dot.orange { background: #F59E0B; }

        .content-publishing-card .legend-title {
          font-weight: 700;
          color: #1E293B;
        }

        .content-publishing-card .legend-desc {
          color: #64748B;
          font-weight: 450;
        }

        /* 5. Bottom Attention & Action Banner */
        .content-publishing-card .attention-cta-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-radius: 14px;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          width: 100%;
          box-sizing: border-box;
          gap: 16px;
        }

        .content-publishing-card .banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .content-publishing-card .warning-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F59E0B;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .banner-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .content-publishing-card .banner-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #B45309;
          margin: 0;
        }

        .content-publishing-card .banner-sub {
          font-size: 12.5px;
          color: #92400E;
          margin: 0;
          font-weight: 500;
        }

        .content-publishing-card .view-content-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #D97706;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          padding: 0;
        }

        .content-publishing-card .view-content-btn:hover {
          color: #B45309;
          transform: translateX(2px);
        }

        /* Responsiveness */
        @media (max-width: 768px) {
          .content-publishing-card .pipeline-legend-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        @media (max-width: 640px) {
          .content-publishing-card .summary-cards-row {
            grid-template-columns: 1fr;
          }
          .content-publishing-card .categories-grid {
            grid-template-columns: 1fr;
          }
          .content-publishing-card .attention-cta-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .content-publishing-card .view-content-btn {
            align-self: flex-end;
          }
        }
      `}} />
    </div>
  );
};

export default ContentPublishingCard;
