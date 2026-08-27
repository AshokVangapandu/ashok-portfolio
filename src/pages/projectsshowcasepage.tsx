/* src/pages/ProjectsShowcasePage.tsx */
import React, { useState, useEffect } from 'react';
import { Project } from '../types/Project';
import { projectService } from '../services/projectService';
import { FeaturedProject } from '../components/projects/featuredproject';
import { ProjectCollection } from '../components/projects/projectcollection';
import { ImpactMetrics } from '../components/projects/impactmetrics';
import { IndustryGrid } from '../components/projects/industrygrid';
import { TechStackGrid } from '../components/projects/techstackgrid';
import { CTASection } from '../components/projects/ctasection';
import { ProjectDetailsModal } from '../components/projects/projectdetailsmodal';
import { BackButton } from '../components/BackButton';

export const ProjectsShowcasePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
    ? '/ashok-portfolio/'
    : '/';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const list = await projectService.getProjects();
        setProjects(list);

        const feat = await projectService.getFeaturedProject();
        setFeaturedProject(feat);
      } catch (err) {
        console.error('[ProjectsShowcasePage] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const projId = hash.replace('#', '');
        const found = projects.find(p => p.id === projId);
        if (found) {
          setSelectedProject(found);
          if ((window as any).AnalyticsService) {
            (window as any).AnalyticsService.logCustomEvent({
              session_id: sessionStorage.getItem('session_id') || 'unknown',
              event_type: 'project_view',
              event_metadata: {
                project_id: found.id,
                project_title: found.title
              }
            });
          }
        } else {
          setSelectedProject(null);
        }
      } else {
        setSelectedProject(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [projects]);

  const handleOpenDetails = (proj: Project) => {
    window.location.hash = proj.id;
  };

  const handleCloseDetails = () => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setSelectedProject(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '36px 24px 80px 24px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Manrope', sans-serif"
      }}
    >
      {/* Top minimal back control (Desktop) */}
      <div className="projects-desktop-back-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
        <BackButton label="Back to Portfolio" fallbackUrl={`${baseUrl}#work`} />
      </div>




      {/* 3. Project Collection magazine grid layout */}
      <section id="project-collection-section" style={{ width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '40px' }}>Loading case studies portfolio...</div>
        ) : (
          <ProjectCollection
            projects={projects}
            onViewDetails={handleOpenDetails}
          />
        )}
      </section>

      {/* 4. Desktop Remaining Sections (Shown on Desktop ONLY > 768px) */}
      <div className="projects-desktop-remaining-sections" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <section style={{ width: '100%' }}>
          <TechStackGrid />
        </section>

        <section style={{ width: '100%' }}>
          <ImpactMetrics />
        </section>

        <section style={{ width: '100%' }}>
          <IndustryGrid />
        </section>

        <section style={{ width: '100%' }}>
          <CTASection />
        </section>
      </div>

      {/* 5. Mobile Remaining Sections (Shown on Mobile ONLY <= 768px) */}
      <div className="projects-mobile-remaining-sections">
        {/* Technology Stack Grid Container */}
        <section className="projects-mobile-tech-section" style={{ width: '100%' }}>
          <TechStackGrid />
        </section>

        {/* Business Impact Section */}
        <section className="projects-mobile-impact-section">
          <div className="projects-mobile-badge-pill green">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#10B981" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span>PROVEN BUSINESS IMPACT</span>
          </div>

          <div className="projects-mobile-impact-grid">
            <div className="impact-card green">
              <span className="impact-val">50K+</span>
              <span className="impact-lbl">Daily Active Users</span>
            </div>
            <div className="impact-card teal">
              <span className="impact-val">98%</span>
              <span className="impact-lbl">Client Satisfaction</span>
            </div>
            <div className="impact-card cyan">
              <span className="impact-val">60%</span>
              <span className="impact-lbl">Reduced Manual Work</span>
            </div>
            <div className="impact-card purple">
              <span className="impact-val">40%</span>
              <span className="impact-lbl">Faster Processing</span>
            </div>
            <div className="impact-card blue full">
              <span className="impact-val">100+</span>
              <span className="impact-lbl">Orchestrated Workflows</span>
            </div>
          </div>
        </section>

        {/* Industries & Domains Section */}
        <section className="projects-mobile-industry-section">
          <div className="projects-mobile-badge-pill">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#A78BFA" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>INDUSTRIES & DOMAINS I BUILD FOR</span>
          </div>

          <div className="projects-mobile-industry-strip-wrapper">
            <div className="projects-mobile-industry-strip">
              <div className="industry-pill"><span>🛡️</span> Legal</div>
              <div className="industry-pill"><span>🏢</span> Enterprise</div>
              <div className="industry-pill"><span>👥</span> HR / Staffing</div>
              <div className="industry-pill"><span>🏗️</span> Construction</div>
              <div className="industry-pill"><span>🏭</span> Manufacturing</div>
              <div className="industry-pill"><span>🎓</span> Education</div>
            </div>
          </div>
        </section>

        {/* Final CTA Card */}
        <section className="projects-mobile-cta-section">
          <div className="cta-icon-badge">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#A78BFA" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>

          <h2 className="projects-mobile-cta-title">
            Interested in building your next <br />
            <span className="purple-gradient-text">digital product?</span>
          </h2>

          <p className="projects-mobile-cta-desc">
            Let's design and architect enterprise-grade software users actually enjoy using. Reach out directly to collaborate on designs, dashboards, and custom widgets.
          </p>

          <div className="projects-mobile-cta-buttons">
            <button
              type="button"
              className="cta-primary-btn"
              onClick={() => {
                const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
                  ? '/ashok-portfolio/'
                  : '/';
                window.location.href = `${baseUrl}#contact`;
              }}
            >
              <span>Let's Collaborate →</span>
            </button>

            <button
              type="button"
              className="cta-secondary-btn"
              onClick={() => {
                const baseUrl = typeof window !== 'undefined' && window.location.pathname.startsWith('/ashok-portfolio')
                  ? '/ashok-portfolio/'
                  : '/';
                window.location.href = `${baseUrl}#contact`;
              }}
            >
              <span>Contact Me</span>
            </button>
          </div>
        </section>
      </div>

      {/* 8. Full-screen Detail Case Study Modal Panel */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={handleCloseDetails}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .featured-showcase-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 32px 24px !important;
          }
          .featured-screens-wrapper {
            min-height: 260px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProjectsShowcasePage;
