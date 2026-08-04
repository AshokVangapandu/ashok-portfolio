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

export const ProjectsShowcasePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setSelectedProject(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '64px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '110px 24px 80px 24px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: "'Inter', sans-serif"
      }}
    >




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

      {/* 4. Technology Stack grid */}
      <section style={{ width: '100%' }}>
        <TechStackGrid />
      </section>

      {/* 5. Business Impact Metrics */}
      <section style={{ width: '100%' }}>
        <ImpactMetrics />
      </section>

      {/* 6. Industry Grid */}
      <section style={{ width: '100%' }}>
        <IndustryGrid />
      </section>

      {/* 7. Bottom CTA block */}
      <section style={{ width: '100%' }}>
        <CTASection />
      </section>

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
