/* src/components/admin/ContentPublishingCard.tsx */
import React, { useEffect, useState, useCallback } from 'react';
import { projectService } from '../../admin/services/projectService';
import { certificationService } from '../../admin/services/certificationService';
import { testimonialService } from '../../admin/services/testimonialService';
import { resumeService } from '../../admin/services/resumeService';
import { AdminProject } from '../../admin/types/project';
import { Certification } from '../../admin/types/certification';
import { ResumeSetting } from '../../admin/types/resume';

export const ContentPublishingCard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  // Top Metric Counts
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [draftsCount, setDraftsCount] = useState<number>(0);
  const [needsReviewCount, setNeedsReviewCount] = useState<number>(0);

  // Category Subtext Counts
  const [publishedProjects, setPublishedProjects] = useState<number>(0);
  const [publishedCertifications, setPublishedCertifications] = useState<number>(0);
  const [approvedTestimonials, setApprovedTestimonials] = useState<number>(0);
  const [resumeSubtext, setResumeSubtext] = useState<string>('Up to date');

  // Attention Banner Content
  const [bannerTitle, setBannerTitle] = useState<string>('All items up to date');
  const [bannerSubtitle, setBannerSubtitle] = useState<string>('All portfolio content is organized and publication ready.');

  const loadContentData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, certsRes, testimonialSummary, activeResume] = await Promise.all([
        projectService.getProjects().catch(() => [] as AdminProject[]),
        certificationService.getCertifications().catch(() => [] as Certification[]),
        testimonialService.getSummary().catch(() => ({ total: 0, approved: 0, pending: 0, rejected: 0 })),
        resumeService.getActiveResume().catch(() => null as ResumeSetting | null)
      ]);

      // 1. Projects Breakdown
      const pubProjects = projectsRes.filter(p => p.status === 'published').length;
      const draftProjs = projectsRes.filter(p => p.status === 'draft').length;
      const missingThumbProjs = projectsRes.filter(p => !p.coverImageUrl || p.coverImageUrl.trim() === '').length;

      // 2. Certifications Breakdown
      const pubCerts = certsRes.filter(c => c.status === 'published').length;
      const draftCerts = certsRes.filter(c => c.status === 'draft').length;
      const pendingCerts = certsRes.filter(c => (c.status as string) === 'pending').length;

      // 3. Testimonials Breakdown
      const appTestimonials = testimonialSummary.approved || 0;
      const pendingTestimonials = testimonialSummary.pending || 0;

      // 4. Resume Subtext
      let rSub = 'Up to date';
      if (!activeResume) {
        rSub = 'No active resume';
      } else if (activeResume.updatedAt || activeResume.uploadedAt) {
        const dateStr = activeResume.updatedAt || activeResume.uploadedAt;
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const diffMs = Date.now() - d.getTime();
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (days <= 0) {
            rSub = 'Updated today';
          } else if (days === 1) {
            rSub = 'Updated 1 day ago';
          } else {
            rSub = `Updated ${days} days ago`;
          }
        }
      }

      // 5. Aggregate Summaries
      const pubTotal = pubProjects + pubCerts + appTestimonials;
      const draftTotal = draftProjs + draftCerts + pendingTestimonials;

      // 6. Actionable Attention Items
      const attentionItems: string[] = [];
      if (pendingTestimonials > 0) {
        attentionItems.push(`${pendingTestimonials} ${pendingTestimonials === 1 ? 'Testimonial' : 'Testimonials'} pending approval`);
      }
      if (pendingCerts > 0) {
        attentionItems.push(`${pendingCerts} ${pendingCerts === 1 ? 'Certification' : 'Certifications'} pending review`);
      }
      if (missingThumbProjs > 0) {
        attentionItems.push(`${missingThumbProjs} ${missingThumbProjs === 1 ? 'Project' : 'Projects'} missing thumbnail`);
      }

      const reviewTotal = pendingTestimonials + pendingCerts + missingThumbProjs;

      setPublishedCount(pubTotal);
      setDraftsCount(draftTotal);
      setNeedsReviewCount(reviewTotal);

      setPublishedProjects(pubProjects);
      setPublishedCertifications(pubCerts);
      setApprovedTestimonials(appTestimonials);
      setResumeSubtext(rSub);

      if (reviewTotal > 0) {
        setBannerTitle(`${reviewTotal} ${reviewTotal === 1 ? 'item needs' : 'items need'} attention`);
        setBannerSubtitle(attentionItems.join('  •  '));
      } else {
        setBannerTitle('All items up to date');
        setBannerSubtitle('All portfolio content is organized and publication ready.');
      }
    } catch (err) {
      console.warn('[ContentPublishingCard] Error loading content data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContentData();
  }, [loadContentData]);

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
      </div>

      {/* 2. Top Summary Metric Cards (3 Columns) */}
      <div className="summary-cards-row">
        <div className="metric-card published">
          <div className="metric-header">
            <span className="dot green"></span>
            <span className="metric-label green-label">PUBLISHED</span>
          </div>
          <span className="metric-count">{loading ? '...' : publishedCount.toLocaleString()}</span>
        </div>

        <div className="metric-card drafts">
          <div className="metric-header">
            <span className="dot purple"></span>
            <span className="metric-label purple-label">DRAFTS</span>
          </div>
          <span className="metric-count">{loading ? '...' : draftsCount.toLocaleString()}</span>
        </div>

        <div className="metric-card review">
          <div className="metric-header">
            <span className="dot orange"></span>
            <span className="metric-label orange-label">NEEDS REVIEW</span>
          </div>
          <span className="metric-count">{loading ? '...' : needsReviewCount.toLocaleString()}</span>
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
            <span className="cat-sub">{loading ? '...' : `${publishedProjects} Published`}</span>
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
            <span className="cat-sub">{loading ? '...' : `${publishedCertifications} Published`}</span>
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
            <span className="cat-sub">{loading ? '...' : `${approvedTestimonials} Approved`}</span>
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
            <span className="cat-sub">{loading ? '...' : resumeSubtext}</span>
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
      <div className={`attention-cta-banner ${needsReviewCount === 0 ? 'banner-all-clear' : ''}`}>
        <div className="banner-left">
          <div className={`warning-icon-wrapper ${needsReviewCount === 0 ? 'icon-success' : ''}`}>
            {needsReviewCount > 0 ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
          <div className="banner-text">
            <h5 className="banner-title">{loading ? 'Loading content status...' : bannerTitle}</h5>
            <p className="banner-sub">{loading ? 'Checking publication status...' : bannerSubtitle}</p>
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

        .content-publishing-card .attention-cta-banner.banner-all-clear {
          background: #F0FDF4;
          border-color: #BBF7D0;
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

        .content-publishing-card .warning-icon-wrapper.icon-success {
          background: #16A34A;
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

        .content-publishing-card .banner-all-clear .banner-title {
          color: #15803D;
        }

        .content-publishing-card .banner-sub {
          font-size: 12.5px;
          color: #92400E;
          margin: 0;
          font-weight: 500;
        }

        .content-publishing-card .banner-all-clear .banner-sub {
          color: #166534;
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
