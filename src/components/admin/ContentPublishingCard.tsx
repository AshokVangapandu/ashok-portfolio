/* src/components/admin/ContentPublishingCard.tsx */
import React, { useEffect, useState, useCallback } from 'react';
import { projectService } from '../../admin/services/projectService';
import { certificationService } from '../../admin/services/certificationService';
import { testimonialService } from '../../admin/services/testimonialService';
import { AdminProject } from '../../admin/types/project';
import { Certification } from '../../admin/types/certification';

export const ContentPublishingCard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastEvaluatedAt, setLastEvaluatedAt] = useState<Date>(new Date());

  // Aggregate Metric Counts
  const [publishedTotal, setPublishedTotal] = useState<number>(0);
  const [draftsTotal, setDraftsTotal] = useState<number>(0);
  const [needsReviewTotal, setNeedsReviewTotal] = useState<number>(0);

  // Content Items Specific Counts
  const [projectsPublished, setProjectsPublished] = useState<number>(0);
  const [projectsDrafts, setProjectsDrafts] = useState<number>(0);

  const [certsPublished, setCertsPublished] = useState<number>(0);
  const [certsDrafts, setCertsDrafts] = useState<number>(0);
  const [certsPending, setCertsPending] = useState<number>(0);

  const [testimonialsApproved, setTestimonialsApproved] = useState<number>(0);
  const [testimonialsPending, setTestimonialsPending] = useState<number>(0);

  const loadContentData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, certsRes, testimonialSummary] = await Promise.all([
        projectService.getProjects().catch(() => [] as AdminProject[]),
        certificationService.getCertifications().catch(() => [] as Certification[]),
        testimonialService.getSummary().catch(() => ({ total: 0, approved: 0, pending: 0, rejected: 0 }))
      ]);

      // 1. Projects
      const pubProjs = projectsRes.filter(p => p.status === 'published').length;
      const draftProjs = projectsRes.filter(p => p.status === 'draft').length;

      // 2. Certifications
      const pubCerts = certsRes.filter(c => c.status === 'published').length;
      const draftCerts = certsRes.filter(c => c.status === 'draft').length;
      const pendingCerts = certsRes.filter(c => (c.status as string) === 'pending').length;

      // 3. Testimonials
      const appTestimonials = testimonialSummary.approved || 0;
      const pendingTestimonials = testimonialSummary.pending || 0;

      // Aggregates
      const totalPub = pubProjs + pubCerts + appTestimonials;
      const totalDrafts = draftProjs + draftCerts;
      const totalReview = pendingTestimonials + pendingCerts;

      setProjectsPublished(pubProjs);
      setProjectsDrafts(draftProjs);

      setCertsPublished(pubCerts);
      setCertsDrafts(draftCerts);
      setCertsPending(pendingCerts);

      setTestimonialsApproved(appTestimonials);
      setTestimonialsPending(pendingTestimonials);

      setPublishedTotal(totalPub);
      setDraftsTotal(totalDrafts);
      setNeedsReviewTotal(totalReview);

      setLastEvaluatedAt(new Date());
    } catch (err) {
      console.warn('[ContentPublishingCard] Error loading content publishing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContentData();
  }, [loadContentData]);

  const handleNavigate = (destination: string) => {
    window.history.pushState({}, '', destination);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const formattedTimestamp = lastEvaluatedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="content-publishing-card">
      {/* 1. Header with Icon, Titles & Dynamic Header Status Pill */}
      <div className="cp-header">
        <div className="cp-header-left">
          <div className="cp-header-icon-box">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="cp-header-titles">
            <h3 className="cp-title">Content & Publishing</h3>
            <p className="cp-subtitle">Keep your portfolio content organized and publication-ready.</p>
          </div>
        </div>

        {/* Dynamic Status Pill */}
        {needsReviewTotal > 0 ? (
          <div className="cp-status-pill pill-attention">
            <span className="pill-dot dot-amber" />
            <span>Content needs attention</span>
          </div>
        ) : draftsTotal > 0 ? (
          <div className="cp-status-pill pill-drafts">
            <span className="pill-dot dot-purple" />
            <span>Content has unpublished drafts</span>
          </div>
        ) : (
          <div className="cp-status-pill pill-success">
            <span className="pill-dot dot-green" />
            <span>Content is up to date</span>
          </div>
        )}
      </div>

      {/* 2. Top 3 Summary Metric Cards */}
      <div className="cp-summary-cards-row">
        {/* PUBLISHED */}
        <div className="cp-summary-card card-published">
          <div className="summary-card-icon icon-published">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label label-published">PUBLISHED</span>
            <span className="summary-card-count">{loading ? '...' : publishedTotal}</span>
            <span className="summary-card-sub">Live on your portfolio</span>
          </div>
        </div>

        {/* DRAFTS */}
        <div className="cp-summary-card card-drafts">
          <div className="summary-card-icon icon-drafts">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label label-drafts">DRAFTS</span>
            <span className="summary-card-count">{loading ? '...' : draftsTotal}</span>
            <span className="summary-card-sub">Not yet published</span>
          </div>
        </div>

        {/* NEEDS REVIEW */}
        <div className="cp-summary-card card-review">
          <div className="summary-card-icon icon-review">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="summary-card-body">
            <span className="summary-card-label label-review">NEEDS REVIEW</span>
            <span className="summary-card-count">{loading ? '...' : needsReviewTotal}</span>
            <span className="summary-card-sub">Awaiting your review</span>
          </div>
        </div>
      </div>

      {/* 3. Content Rows List (Projects, Certifications, Testimonials) */}
      <div className="cp-content-list">
        {/* Projects Row */}
        <div
          className="cp-content-row"
          onClick={() => handleNavigate('/admin/projects')}
        >
          <div className="row-left">
            <div className="row-icon-box icon-projects">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="row-details">
              <h4 className="row-title">Projects</h4>
              <p className="row-desc">Showcase your work and key projects.</p>
            </div>
          </div>

          <div className="row-right">
            <span className="row-status-pill pill-published">
              <span className="row-pill-dot dot-green" />
              {loading ? '...' : `${projectsPublished} Published`}
            </span>
            <button
              type="button"
              className="row-action-link"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('/admin/projects');
              }}
            >
              <span>View Projects</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Certifications Row */}
        <div
          className={`cp-content-row ${certsPending > 0 ? 'highlight-attention' : ''}`}
          onClick={() => handleNavigate('/admin/certifications')}
        >
          <div className="row-left">
            <div className="row-icon-box icon-certs">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <div className="row-details">
              <h4 className="row-title">Certifications</h4>
              <p className="row-desc">Display your professional certifications.</p>
            </div>
          </div>

          <div className="row-right">
            {certsPending > 0 ? (
              <span className="row-status-pill pill-attention">
                <span className="row-pill-dot dot-amber" />
                {loading ? '...' : `${certsPending} Needs Review`}
              </span>
            ) : (
              <span className="row-status-pill pill-published">
                <span className="row-pill-dot dot-green" />
                {loading ? '...' : `${certsPublished} Published`}
              </span>
            )}
            <button
              type="button"
              className="row-action-link"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('/admin/certifications');
              }}
            >
              <span>{certsPending > 0 ? 'Review Certifications' : 'View Certifications'}</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Testimonials Row */}
        <div
          className={`cp-content-row ${testimonialsPending > 0 ? 'highlight-attention' : ''}`}
          onClick={() => handleNavigate('/admin/testimonials')}
        >
          <div className="row-left">
            <div className="row-icon-box icon-testimonials">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="row-details">
              <h4 className="row-title">Testimonials</h4>
              <p className="row-desc">Share feedback from clients and colleagues.</p>
            </div>
          </div>

          <div className="row-right">
            {testimonialsPending > 0 ? (
              <span className="row-status-pill pill-attention">
                <span className="row-pill-dot dot-amber" />
                {loading ? '...' : `${testimonialsPending} Needs Review`}
              </span>
            ) : (
              <span className="row-status-pill pill-published">
                <span className="row-pill-dot dot-green" />
                {loading ? '...' : `${testimonialsApproved} Approved`}
              </span>
            )}
            <button
              type="button"
              className="row-action-link"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('/admin/testimonials');
              }}
            >
              <span>{testimonialsPending > 0 ? 'Review Testimonials' : 'View Testimonials'}</span>
              <span className="action-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Footer Row */}
      <div className="cp-footer">
        <button
          type="button"
          className="cp-footer-updated"
          onClick={() => loadContentData()}
          title="Refresh content data"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          <span>Last updated: {formattedTimestamp}</span>
        </button>

        <button
          type="button"
          className="cp-footer-link"
          onClick={() => handleNavigate('/admin/projects')}
        >
          <span>Manage Content</span>
          <span className="action-arrow">→</span>
        </button>
      </div>

      {/* Scoped CSS Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        .content-publishing-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03), 0 2px 6px -1px rgba(15, 23, 42, 0.02);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          text-align: left;
          width: 100%;
          gap: 18px;
        }

        /* 1. Header Section */
        .content-publishing-card .cp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .content-publishing-card .cp-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .content-publishing-card .cp-header-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #F3E8FF;
          color: #9333EA;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .cp-header-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .content-publishing-card .cp-title {
          font-size: 19px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.25;
        }

        .content-publishing-card .cp-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.3;
        }

        /* Header Status Pill */
        .content-publishing-card .cp-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .content-publishing-card .pill-success {
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #15803D;
        }

        .content-publishing-card .pill-attention {
          background: #FFFBEB;
          border: 1px solid #FEF3C7;
          color: #B45309;
        }

        .content-publishing-card .pill-drafts {
          background: #F5F3FF;
          border: 1px solid #EDE9FE;
          color: #6D28D9;
        }

        .content-publishing-card .pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .content-publishing-card .dot-green { background: #16A34A; }
        .content-publishing-card .dot-amber { background: #D97706; }
        .content-publishing-card .dot-purple { background: #7C3AED; }

        /* 2. Top Summary Metric Cards */
        .content-publishing-card .cp-summary-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          width: 100%;
        }

        .content-publishing-card .cp-summary-card {
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid transparent;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }

        .content-publishing-card .cp-summary-card:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .content-publishing-card .card-published {
          background: #F0FDF4;
          border-color: #DCFCE7;
        }

        .content-publishing-card .card-drafts {
          background: #F5F3FF;
          border-color: #EDE9FE;
        }

        .content-publishing-card .card-review {
          background: #FFFBEB;
          border-color: #FEF3C7;
        }

        .content-publishing-card .summary-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .icon-published { background: #DCFCE7; color: #16A34A; }
        .content-publishing-card .icon-drafts { background: #EDE9FE; color: #7C3AED; }
        .content-publishing-card .icon-review { background: #FEF3C7; color: #D97706; }

        .content-publishing-card .summary-card-body {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .content-publishing-card .summary-card-label {
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: 0.04em;
        }

        .content-publishing-card .label-published { color: #15803D; }
        .content-publishing-card .label-drafts { color: #6D28D9; }
        .content-publishing-card .label-review { color: #B45309; }

        .content-publishing-card .summary-card-count {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
        }

        .content-publishing-card .summary-card-sub {
          font-size: 11.5px;
          color: #64748B;
          font-weight: 500;
        }

        /* 3. Content Rows List */
        .content-publishing-card .cp-content-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .content-publishing-card .cp-content-row {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          cursor: pointer;
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
          box-sizing: border-box;
          width: 100%;
        }

        .content-publishing-card .cp-content-row:hover {
          transform: translateY(-1.5px);
          border-color: #CBD5E1;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
        }

        .content-publishing-card .cp-content-row.highlight-attention {
          background: #FFFDF5;
          border-color: #FCD34D;
        }

        .content-publishing-card .row-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .content-publishing-card .row-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .content-publishing-card .icon-projects { background: #F3E8FF; color: #7C3AED; }
        .content-publishing-card .icon-certs { background: #ECFDF5; color: #059669; }
        .content-publishing-card .icon-testimonials { background: #FFE4E6; color: #E11D48; }

        .content-publishing-card .row-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .content-publishing-card .row-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          line-height: 1.25;
        }

        .content-publishing-card .row-desc {
          font-size: 12.5px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
          line-height: 1.35;
        }

        .content-publishing-card .row-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .content-publishing-card .row-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 650;
          padding: 3px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .content-publishing-card .pill-published {
          background: #DCFCE7;
          color: #15803D;
        }

        .content-publishing-card .row-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .content-publishing-card .row-action-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          padding: 0;
          white-space: nowrap;
          transition: color 150ms ease, transform 150ms ease;
        }

        .content-publishing-card .row-action-link:hover {
          color: #3730A3;
          transform: translateX(2px);
        }

        .content-publishing-card .action-arrow {
          font-size: 14px;
          line-height: 1;
        }

        /* 4. Footer Row */
        .content-publishing-card .cp-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #F1F5F9;
          gap: 12px;
          width: 100%;
        }

        .content-publishing-card .cp-footer-updated {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease;
        }

        .content-publishing-card .cp-footer-updated:hover {
          color: #0F172A;
        }

        .content-publishing-card .cp-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #4F46E5;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          padding: 0;
          transition: color 150ms ease, transform 150ms ease;
        }

        .content-publishing-card .cp-footer-link:hover {
          color: #3730A3;
          transform: translateX(2px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
          .content-publishing-card {
            padding: 16px;
          }
          .content-publishing-card .cp-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .content-publishing-card .cp-summary-cards-row {
            grid-template-columns: 1fr;
          }
          .content-publishing-card .cp-content-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .content-publishing-card .row-right {
            width: 100%;
            justify-content: space-between;
          }
          .content-publishing-card .cp-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}} />
    </div>
  );
};

export default ContentPublishingCard;
