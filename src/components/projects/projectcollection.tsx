/* src/components/projects/projectcollection.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../../types/Project';

interface ProjectCollectionProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
}

export const ProjectCollection: React.FC<ProjectCollectionProps> = ({
  projects,
  onViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter projects by search query
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.role.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.technologies.some((t) => t.toLowerCase().includes(query))
    );
  });

  const activeProject = filteredProjects[activeIndex] || null;

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || filteredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, filteredProjects.length]);

  // Center active element in carousel view
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeChild = container.children[activeIndex] as HTMLElement;
    if (!activeChild) return;

    const containerWidth = container.clientWidth;
    const childOffset = activeChild.offsetLeft;
    const childWidth = activeChild.clientWidth;

    container.scrollTo({
      left: childOffset - containerWidth / 2 + childWidth / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  return (
    <div className="projects-collection-wrapper">
      {/* 1. Header & Search Bar */}
      <div className="projects-collection-header-row">
        <div className="projects-collection-title-group">
          <span className="projects-collection-star-bullet">★</span>
          <h2 className="projects-collection-title">
            Case Studies Archive
          </h2>
        </div>

        {/* Sleek Search Input */}
        <div className="projects-collection-search-box">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="projects-collection-search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search case studies..."
            className="projects-collection-search-input"
          />
        </div>
      </div>

      {/* 2. Horizontal Project Carousel */}
      {filteredProjects.length > 0 ? (
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="projects-carousel-track"
        >
          {filteredProjects.map((project, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={project.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPaused(true);
                }}
                className={`projects-carousel-card ${isActive ? 'active' : ''}`}
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="projects-carousel-card-img"
                />
                <div className="projects-carousel-card-overlay">
                  <span className="projects-carousel-card-cat">
                    {project.category}
                  </span>
                  <h4 className="projects-carousel-card-title">
                    {project.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="projects-empty-archive">
          No case studies match your search queries.
        </div>
      )}

      {/* 3. Active Project Details Showcase */}
      {activeProject && (
        <div className="active-project-showcase-card">
          {/* Left Side: Info details */}
          <div className="active-project-left-col">
            <div className="active-project-badges-row">
              <span className="active-project-cat-pill">
                {activeProject.category}
              </span>
              <span className="active-project-dot">•</span>
              <span className="active-project-timeline">
                {activeProject.timeline}
              </span>
            </div>

            <h3 className="active-project-title">
              {activeProject.title}
            </h3>

            <p className="active-project-desc">
              {activeProject.description}
            </p>

            {activeProject.problemSolved && (
              <div className="active-project-problem-box">
                <strong className="active-project-problem-label">
                  Problem Solved
                </strong>
                <p className="active-project-problem-text">
                  "{activeProject.problemSolved}"
                </p>
              </div>
            )}

            {/* Impact Metric Row / Grid */}
            <div className="active-project-metrics-row">
              {activeProject.impactMetrics.map((im, idx) => (
                <div key={idx} className="active-project-metric-card green">
                  <span className="active-project-metric-val">
                    {im.kpi}
                  </span>
                  <span className="active-project-metric-lbl">
                    {im.label}
                  </span>
                </div>
              ))}
              {activeProject.users && (
                <div className="active-project-metric-card purple">
                  <span className="active-project-metric-val">
                    {activeProject.users}
                  </span>
                  <span className="active-project-metric-lbl">
                    Active Users
                  </span>
                </div>
              )}
            </div>

            {/* CTA Action triggers */}
            <div className="active-project-actions-row">
              <button
                type="button"
                onClick={() => onViewDetails(activeProject)}
                className="active-project-details-btn"
              >
                <span>View Full Case Study Details</span>
                <span style={{ fontSize: '15px' }}>→</span>
              </button>

              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="active-project-preview-btn"
                >
                  Live Preview
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Visual Image Preview & Stats stack */}
          <div className="active-project-right-col">
            <div className="active-project-img-box">
              <img
                src={activeProject.coverImage}
                alt={activeProject.title}
                className="active-project-img"
              />
            </div>

            {/* Role, Client metadata */}
            <div className="active-project-meta-box">
              <div>
                <span className="active-project-meta-label">
                  My Role
                </span>
                <p className="active-project-meta-val">
                  {activeProject.role}
                </p>
              </div>
              <div>
                <span className="active-project-meta-label">
                  Target Client
                </span>
                <p className="active-project-meta-val">
                  {activeProject.client}
                </p>
              </div>
            </div>

            {/* Technologies Grid */}
            <div className="active-project-tech-tags">
              {activeProject.technologies.map((tech) => (
                <span key={tech} className="active-project-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCollection;
