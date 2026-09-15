/* src/pages/ProjectsShowcasePage.tsx */
import React, { useState, useEffect } from 'react';
import { Project } from '../types/Project';
import { projectService } from '../services/projectService';
import { ProjectCollection } from '../components/projects/projectcollection';
import { ImpactMetrics } from '../components/projects/impactmetrics';
import { IndustryGrid } from '../components/projects/industrygrid';
import { TechStackGrid } from '../components/projects/techstackgrid';
import { CTASection } from '../components/projects/ctasection';
import { ProjectDetailsModal } from '../components/projects/projectdetailsmodal';
import { BackButton } from '../components/BackButton';

export const ProjectsShowcasePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
    <div className="projects-showcase-container">
      {/* Top minimal back control */}
      <div className="projects-back-wrapper">
        <BackButton label="Back to Portfolio" fallbackUrl={`${baseUrl}#work`} />
      </div>

      {/* 1. Project Collection (Archive Carousel & Master-Detail Showcase) */}
      <section id="project-collection-section" style={{ width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '60px 0', fontSize: '15px' }}>
            Loading case studies portfolio...
          </div>
        ) : (
          <ProjectCollection
            projects={projects}
            onViewDetails={handleOpenDetails}
          />
        )}
      </section>

      {/* 2. Technologies Powering Enterprise Solutions */}
      <section style={{ width: '100%' }}>
        <TechStackGrid />
      </section>

      {/* 3. Proven Business Impact Metrics */}
      <section style={{ width: '100%' }}>
        <ImpactMetrics />
      </section>

      {/* 4. Industries & Domains I Build For */}
      <section style={{ width: '100%' }}>
        <IndustryGrid />
      </section>

      {/* 5. CTA Collaboration Card */}
      <section style={{ width: '100%' }}>
        <CTASection />
      </section>

      {/* 6. Full-screen Detail Case Study Modal Panel */}
      <ProjectDetailsModal
        project={selectedProject}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default ProjectsShowcasePage;
