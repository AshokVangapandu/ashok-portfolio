/* src/components/projects/ProjectCard.tsx */
import React from 'react';
import { Project } from '../../types/Project';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
}) => {
  const {
    title,
    description,
    category,
    client,
    role,
    timeline,
    users,
    technologies,
    coverImage,
    impactMetrics,
    layoutType = 'medium',
  } = project;

  // Compute sizing and layout directions based on layoutType
  const isLarge = layoutType === 'large';
  const isCompact = layoutType === 'compact';

  return (
    <div
      onClick={() => onViewDetails(project)}
      style={{
        gridColumn: isLarge ? 'span 2' : 'span 1',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(12, 16, 28, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '20px',
        boxSizing: 'border-box',
        gap: '16px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)'
      }}
      className="project-magazine-card"
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(124, 58, 237, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.25)';
      }}
    >
      {/* 1. Image Wrapper */}
      <div
        style={{
          width: '100%',
          height: isCompact ? '150px' : isLarge ? '240px' : '180px',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#070a13',
          flexShrink: 0
        }}
      >
        <img
          src={coverImage}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="magazine-card-image"
        />
        {/* Subtle top glare glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* 2. Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {category}
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '10px' }}>•</span>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{timeline}</span>
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: isLarge ? '22px' : '18px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#94A3B8',
            display: '-webkit-box',
            WebkitLineClamp: isLarge ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 450
          }}
        >
          {description}
        </p>
      </div>

      {/* 3. Tech tags & Role */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 550 }}>
          {role}
        </span>
        <span style={{ color: 'rgba(255, 255, 255, 0.1)', fontSize: '10px' }}>•</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#64748B'
              }}
            >
              #{tech.toLowerCase().replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Impact metrics & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.03)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {impactMetrics.slice(0, 1).map((im, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '6px',
                padding: '4px 10px'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981' }}>{im.kpi}</span>
              <span style={{ fontSize: '9px', color: '#10B981', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{im.label}</span>
            </div>
          ))}
          {users && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                borderRadius: '6px',
                padding: '4px 10px'
              }}
            >
              <span style={{ fontSize: '9px', color: '#A78BFA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{users}</span>
            </div>
          )}
        </div>

        <span
          style={{
            color: '#A78BFA',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'gap 0.2s ease'
          }}
          className="magazine-card-action-text"
        >
          View Case Study
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease' }}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
