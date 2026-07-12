/* src/components/projects/ProjectCollection.tsx */
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
    }, 4500);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        gap: '24px',
      }}
    >
      {/* Header & Search Bar wrapper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '24px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#A78BFA' }}>★</span>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              margin: 0,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
            }}
          >
            Case Studies Archive
          </h2>
        </div>

        {/* Sleek Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search case studies..."
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              padding: '10px 16px 10px 40px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748B',
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Mini Horizontal Carousel wrapper */}
      {filteredProjects.length > 0 ? (
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="horizontal-scroll-carousel"
          style={{
            display: 'flex',
            width: '100%',
            overflowX: 'auto',
            gap: '20px',
            padding: '24px 0',
            boxSizing: 'border-box',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
          }}
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
                style={{
                  width: '240px',
                  height: '140px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: isActive
                    ? '2px solid #8B5CF6'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isActive
                    ? '0 0 20px rgba(139, 92, 246, 0.3)'
                    : 'none',
                  transform: isActive ? 'scale(1.03)' : 'scale(0.97)',
                  opacity: isActive ? 1 : 0.5,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  scrollSnapAlign: 'center',
                }}
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#A78BFA',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {project.category}
                  </span>
                  <h4
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {project.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            color: '#64748B',
            fontSize: '14px',
            textAlign: 'center',
            padding: '60px 0',
            fontWeight: 500,
          }}
        >
          No case studies match your search queries.
        </div>
      )}

      {/* Active Project Details Showcase */}
      {activeProject && (
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(15, 22, 40, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '36px',
            boxSizing: 'border-box',
            marginTop: '8px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'start',
            transition: 'all 0.4s ease',
          }}
          className="active-project-details-grid"
        >
          {/* Left Side: Info details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#A78BFA',
                  textTransform: 'uppercase',
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                  borderRadius: '999px',
                  padding: '4px 12px',
                }}
              >
                {activeProject.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
              <span
                style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}
              >
                {activeProject.timeline}
              </span>
            </div>

            <h3
              style={{
                fontSize: '32px',
                fontWeight: 850,
                margin: 0,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {activeProject.title}
            </h3>

            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#94A3B8',
                margin: 0,
                fontWeight: 450,
              }}
            >
              {activeProject.description}
            </p>

            {activeProject.problemSolved && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                }}
              >
                <strong
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    color: '#C4B5FD',
                    letterSpacing: '0.04em',
                  }}
                >
                  Problem Solved
                </strong>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    color: '#94A3B8',
                    fontWeight: 450,
                  }}
                >
                  "{activeProject.problemSolved}"
                </p>
              </div>
            )}

            {/* Impact Metric Row */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              {activeProject.impactMetrics.map((im, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    minWidth: '120px',
                  }}
                >
                  <span
                    style={{ fontSize: '18px', fontWeight: 850, color: '#10B981' }}
                  >
                    {im.kpi}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#64748B',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    {im.label}
                  </span>
                </div>
              ))}
              {activeProject.users && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    minWidth: '120px',
                  }}
                >
                  <span
                    style={{ fontSize: '18px', fontWeight: 850, color: '#A78BFA' }}
                  >
                    {activeProject.users}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#64748B',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    Active Users
                  </span>
                </div>
              )}
            </div>

            {/* CTA Action triggers */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '12px',
              }}
            >
              <button
                type="button"
                onClick={() => onViewDetails(activeProject)}
                className="hover-scale active-press"
                style={{
                  padding: '12px 28px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--admin-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                View Full Case Study Details &rarr;
              </button>

              {activeProject.demoUrl && (
                <a
                  href={activeProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover-scale"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Live Preview
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Visual Image Preview & Stats stack */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#090D1A',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <img
                src={activeProject.coverImage}
                alt={activeProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Role, Client metadata */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                textAlign: 'left',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '10.5px',
                    color: '#64748B',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  My Role
                </span>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '13.5px',
                    color: '#E2E8F0',
                    fontWeight: 700,
                  }}
                >
                  {activeProject.role}
                </p>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '10.5px',
                    color: '#64748B',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  Target Client
                </span>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '13.5px',
                    color: '#E2E8F0',
                    fontWeight: 700,
                  }}
                >
                  {activeProject.client}
                </p>
              </div>
            </div>

            {/* Technologies Grid */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeProject.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#94A3B8',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Styles overrides for hiding horizontal scroll bars */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .horizontal-scroll-carousel::-webkit-scrollbar {
          display: none;
        }
        .horizontal-scroll-carousel {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 900px) {
          .active-project-details-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            padding: 24px !important;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default ProjectCollection;
