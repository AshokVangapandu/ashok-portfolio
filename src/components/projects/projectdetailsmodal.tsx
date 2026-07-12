/* src/components/projects/ProjectDetailsModal.tsx */
import React, { useEffect } from 'react';
import { Project } from '../../types/Project';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  if (!project) return null;

  const {
    title,
    description,
    category,
    client,
    role,
    timeline,
    platform,
    users,
    status,
    businessValue,
    technologies,
    coverImage,
    problemSolved,
    features,
    impactMetrics,
    demoUrl,
    githubUrl
  } = project;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '40px 24px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
      onClick={onClose}
    >
      {/* Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: '#0A0E1A',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          alignSelf: 'flex-start',
          animation: 'slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden' }}>
          <img
            src={coverImage}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 30%, #0A0E1A 100%)'
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="hover-scale active-press"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Back text navigation */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#A78BFA',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)',
              outline: 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Showcase
          </button>
        </div>

        {/* Content Columns layout */}
        <div
          style={{
            padding: '0 40px 40px 40px',
            display: 'grid',
            gridTemplateColumns: '1.8fr 1fr',
            gap: '40px',
            boxSizing: 'border-box'
          }}
          className="modal-content-grid"
        >
          {/* Left Column: Storytelling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#C4B5FD',
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  width: 'fit-content',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {category} Case Study
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 850, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overview</span>
              <p style={{ margin: 0, fontSize: '15.5px', lineHeight: 1.6, color: '#94A3B8' }}>{description}</p>
            </div>

            {/* Problem Solved */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Problem Statement</span>
              <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#E2E8F0', fontStyle: 'italic' }}>
                "{problemSolved}"
              </p>
            </div>

            {/* Key Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Core Implementations</span>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {features.map((f, i) => (
                  <li key={i} style={{ fontSize: '14.5px', color: '#94A3B8', lineHeight: 1.5 }}>
                    <strong style={{ color: '#FFFFFF' }}>{f}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Technologies Used</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: '11px',
                      fontWeight: 650,
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: '#C4B5FD'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Project Details Specifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Specs Grid */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {[
                { label: 'Client / Sponsor', val: client },
                { label: 'My Role', val: role },
                { label: 'Timeline', val: timeline },
                { label: 'Platform Interface', val: platform },
                { label: 'Scale / Users', val: users },
                { label: 'Project Status', val: status },
                { label: 'Business Impact Value', val: businessValue }
              ].map((spec, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: i < 6 ? '12px' : 0 }}>
                  <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {spec.label}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 650, color: '#E2E8F0', lineHeight: 1.4 }}>
                    {spec.val}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA external links buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-scale active-press"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 0',
                    borderRadius: '10px',
                    backgroundColor: 'var(--admin-primary)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                  Launch Live Preview
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover-scale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 0',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
                >
                  Explore Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpModal {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 900px) {
          .modal-content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProjectDetailsModal;
