/* src/components/projects/ProjectDetailsModal.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectFeature, ProjectGallery } from '../../types/Project';
import { projectService } from '../../services/projectService';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

const getMockFeaturesForProject = (project: Project): ProjectFeature[] => {
  const defaultFeatures = project.features || [];

  const sampleImages = [
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  ];

  const sampleDescriptions = [
    'Consolidates real-time information flow to design an unified interactive user interface. Reduces visual cognitive overload by staging details contextually.',
    'Provides customizable workspace layouts, dashboard filters, and smart notifications to align with complex operational requirements and compliance controls.',
    'Encrypted real-time data streaming pipeline optimized for low-latency delivery, high concurrent user loads, and complete data safety audits.',
    'Centralized administration panel designed to manage user access privileges, audit data modifications, and check system performance metrics.'
  ];

  const sampleBullets = [
    [
      'Consolidates all system components into a single audit-ready dashboard',
      'Minimizes loading latency by implementing data caching strategies',
      'Configured with strict role-based access logs to satisfy compliance'
    ],
    [
      'Supports automated alerts and delivery updates to target users',
      'Custom filter menus based on status, severity, and timeline parameters',
      'Audit log captures all user viewing and update actions for logs'
    ],
    [
      'Ensures end-to-end data encryption across secure transfer channels',
      'Automatic backup systems with rapid failover disaster recovery',
      'Simple integration hooks to connect to external systems'
    ],
    [
      'Real-time health telemetry checks showing process resource usages',
      'Vibrant analytics visualizations presenting KPIs and outcomes',
      'Simplified bulk-action menus to streamline repeated operations'
    ]
  ];

  if (defaultFeatures.length > 0) {
    return defaultFeatures.map((featText, index) => {
      const imgIdx = index % sampleImages.length;
      const descText = sampleDescriptions[index % sampleDescriptions.length];
      const bulletGroup = sampleBullets[index % sampleBullets.length];

      return {
        id: `mock-feat-${index}`,
        projectId: project.id,
        title: featText,
        description: descText,
        imageUrl: sampleImages[imgIdx],
        imageThumbnailUrl: sampleImages[imgIdx],
        imageAlt: `${featText} Screenshot`,
        displayOrder: index,
        isActive: true,
        bullets: bulletGroup.map((bText, bIndex) => ({
          id: `mock-bullet-${index}-${bIndex}`,
          featureId: `mock-feat-${index}`,
          text: bText,
          displayOrder: bIndex
        }))
      };
    });
  }

  return [
    {
      id: 'mock-feat-0',
      projectId: project.id,
      title: 'Interactive Dashboard Operations',
      description: 'A centralized workspace designed to simplify complex operational actions, view details contextually, and manage system states.',
      imageUrl: sampleImages[0],
      imageThumbnailUrl: sampleImages[0],
      imageAlt: 'Dashboard Overview',
      displayOrder: 0,
      isActive: true,
      bullets: [
        { id: 'b0-1', featureId: 'mock-feat-0', text: 'Consolidates all operational actions in a single control screen', displayOrder: 0 },
        { id: 'b0-2', featureId: 'mock-feat-0', text: 'Vibrant charts presenting live telemetry and metrics values', displayOrder: 1 },
        { id: 'b0-3', featureId: 'mock-feat-0', text: 'High security controls satisfying enterprise regulatory standards', displayOrder: 2 }
      ]
    }
  ];
};

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
}) => {
  const [featuresList, setFeaturesList] = useState<ProjectFeature[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Lightbox & Scroll States
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string; caption?: string } | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      if (modalContainerRef.current) {
        modalContainerRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // Fetch Features
  useEffect(() => {
    if (project) {
      setLoadingDetails(true);
      setFeaturesList([]);
      projectService.getProjectFeatures(project.id)
        .then((feats) => {
          if (feats && feats.length > 0) {
            setFeaturesList(feats);
          } else {
            setFeaturesList(getMockFeaturesForProject(project));
          }
        })
        .catch((err) => {
          console.error('[ProjectDetailsModal] Failed loading details:', err);
          setFeaturesList(getMockFeaturesForProject(project));
        })
        .finally(() => {
          setLoadingDetails(false);
        });
    }
  }, [project]);

  // Calculate scroll completion
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const totalHeight = scrollHeight - clientHeight;
        if (totalHeight > 0) {
          setScrollProgress((scrollTop / totalHeight) * 100);
        }
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [project, loadingDetails]);

  // Intersection Observer for scroll-driven fade-in entrance sequences
  useEffect(() => {
    if (loadingDetails) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.reveal-trigger');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [featuresList, loadingDetails, project]);

  // Keyboard navigation for Lightbox and Modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!project) return;

      if (activeLightboxImg) {
        if (e.key === 'ArrowLeft') {
          handlePrevImage();
        } else if (e.key === 'ArrowRight') {
          handleNextImage();
        } else if (e.key === 'Escape') {
          setActiveLightboxImg(null);
        }
      } else {
        if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [project, activeLightboxImg, featuresList]);

  if (!project) return null;

  const {
    title,
    description,
    category,
    client,
    role,
    timeline,
    platform,
    coverImage,
    technologies,
    demoUrl,
    githubUrl,
    features,
    problemSolved,
    solution,
    businessValue,
    fullDescription,
    impactMetrics
  } = project;

  // Lightbox navigators
  const handlePrevImage = () => {
    if (!activeLightboxImg) return;
    const items = [
      coverImage,
      ...featuresList.map(f => f.imageUrl).filter((url): url is string => !!url)
    ];
    const idx = items.indexOf(activeLightboxImg.url);
    if (idx === -1 || items.length === 0) return;

    const prevIdx = idx > 0 ? idx - 1 : items.length - 1;
    setActiveLightboxImg({ url: items[prevIdx], title: 'Showcase Image' });
  };

  const handleNextImage = () => {
    if (!activeLightboxImg) return;
    const items = [
      coverImage,
      ...featuresList.map(f => f.imageUrl).filter((url): url is string => !!url)
    ];
    const idx = items.indexOf(activeLightboxImg.url);
    if (idx === -1 || items.length === 0) return;

    const nextIdx = idx < items.length - 1 ? idx + 1 : 0;
    setActiveLightboxImg({ url: items[nextIdx], title: 'Showcase Image' });
  };

  return (
    <div
      ref={modalContainerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        outline: 'none'
      }}
      onClick={onClose}
    >
      {/* Scrollable Modal Container */}
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '100%',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF', // Clean White landing page body background
          borderRadius: '24px',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,0,0,0.1) transparent',
          animation: 'slideUpModal 350ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reading Completion Indicator */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 100,
            display: 'block'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${scrollProgress}%`,
              backgroundColor: '#8B5CF6',
              boxShadow: '0 0 8px #8B5CF6',
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>

        {/* STICKY MODAL TOP BAR NAV */}
        <div
          className="modal-sticky-top-bar"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            backgroundColor: 'rgba(9, 13, 26, 0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxSizing: 'border-box'
          }}
        >
          {/* Back Action Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#A78BFA',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 150ms ease'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Showcase</span>
          </button>

          {/* Close Action Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              outline: 'none',
              transition: 'all 150ms ease'
            }}
            aria-label="Close Case Study"
          >
            &times;
          </button>
        </div>

        {/* SECTION 1: IMMERSIVE CENTURED DARK HERO SECTION */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#090D1A', // Dark Hero
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, rgba(9, 13, 26, 0) 70%)',
            padding: '36px 48px 32px 48px',
            boxSizing: 'border-box',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
            overflow: 'hidden'
          }}
          className="hero-section-grid"
        >
          {/* Header Left-Aligned Text Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: '16px', width: '100%', maxWidth: '1000px', zIndex: 2 }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#A78BFA',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '999px',
                padding: '4px 14px',
                width: 'fit-content',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                animationDelay: '0ms'
              }}
              className="animate-fade-in-up"
            >
              {category ? category.replace(/case study/gi, '').trim() : 'Featured Project'}
            </span>

            <h1
              id="case-study-title"
              style={{
                margin: 0,
                fontSize: '44px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: '1.15',
                animationDelay: '60ms'
              }}
              className="animate-fade-in-up"
            >
              {title}
            </h1>

            {description && (
              <p
                style={{
                  margin: 0,
                  fontSize: '16.5px',
                  lineHeight: '1.6',
                  color: '#94A3B8',
                  animationDelay: '120ms'
                }}
                className="animate-fade-in-up"
              >
                {description}
              </p>
            )}

            {/* Spec metadata horizontal grid */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: '32px',
                marginTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '20px',
                width: '100%',
                animationDelay: '180ms'
              }}
              className="animate-fade-in-up"
            >
              {[
                { label: 'Timeline', val: timeline || '2 Weeks', icon: '⏱' },
                { label: 'My Role', val: role || 'Lead Developer', icon: '👤' },
                { label: 'Client', val: client || 'Internal Dev', icon: '💼' },
                { label: 'Platform', val: platform || 'Web Application', icon: '💻' }
              ].map((meta, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
                  <span style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{meta.icon}</span> {meta.label}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#E2E8F0' }}>
                    {meta.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Centered Large Cover Image - Centered below text and above Narrative */}
          {coverImage && (
            <div
              style={{
                width: '100%',
                maxWidth: '1040px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'zoom-in',
                backgroundColor: '#090D1A',
                zIndex: 2,
                marginTop: '16px',
                animationDelay: '240ms'
              }}
              className="animate-fade-in-up"
              onClick={() => {
                setActiveLightboxImg({
                  url: coverImage,
                  title: `${title} Cover Screenshot`
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.005)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <img
                src={coverImage}
                alt={`${title} Showcase Cover`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>
        {/* SECTION 1.5: THE NARRATIVE (PROBLEM, SOLUTION, BUSINESS VALUE) */}
        {((problemSolved && problemSolved.trim() !== '') || (solution && solution.trim() !== '') || (businessValue && businessValue.trim() !== '') || (fullDescription && fullDescription.trim() !== '')) && (
          <div
            className='case-story-section'
            style={{
              padding: '56px 48px 80px 48px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div className='case-story-container' style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div className='case-story-heading' style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#8B5CF6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Project Narrative
                </span>
                <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 650, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  The Journey & Outcome
                </h2>
              </div>

              <div className='case-story-problem-solution' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {/* Column 1: The Challenge */}
                {problemSolved && problemSolved.trim() !== '' && (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderTop: '4px solid #EF4444',
                      borderRadius: '16px',
                      padding: '44px 36px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.01) 0%, #FFFFFF 100%)',
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)',
                      transitionDelay: '0ms'
                    }}
                    className="reveal-trigger narrative-card"
                  >
                    <span style={{ fontSize: '32px', color: '#EF4444' }}>⚠️</span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}>The Challenge</h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.75', color: '#475569', fontWeight: 450 }}>
                      {problemSolved}
                    </p>
                  </div>
                )}

                {/* Column 2: The Solution */}
                {solution && solution.trim() !== '' && (
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderTop: '4px solid #8B5CF6',
                      borderRadius: '16px',
                      padding: '44px 36px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.01) 0%, #FFFFFF 100%)',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.02), 0 1px 3px rgba(0, 0, 0, 0.01)',
                      transitionDelay: '80ms'
                    }}
                    className="reveal-trigger narrative-card"
                  >
                    <span style={{ fontSize: '32px', color: '#8B5CF6' }}>💡</span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}>The Solution</h3>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.75', color: '#475569', fontWeight: 450 }}>
                      {solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Detailed Project Overview & Business Outcome Grid */}
              {((fullDescription && fullDescription.trim() !== '') || (businessValue && businessValue.trim() !== '')) && (
                <div
                  className='case-story-outcome-grid'
                  style={{
                    display: 'flex',
                    gap: '32px',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}
                >
                  {/* Detailed Project Overview (Left / Main) */}
                  {fullDescription && fullDescription.trim() !== '' && (
                    <div
                      style={{
                        flex: businessValue && businessValue.trim() !== '' ? '1.8' : '1',
                        minWidth: '320px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderLeft: '4px solid #3B82F6',
                        borderRadius: '16px',
                        padding: '40px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.02)'
                      }}
                      className="reveal-trigger narrative-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px', color: '#3B82F6' }}>📄</span>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}>
                          Detailed Project Overview
                        </h3>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14.5px',
                          lineHeight: '1.8',
                          color: '#475569',
                          fontWeight: 450,
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {fullDescription}
                      </p>
                    </div>
                  )}

                  {/* Business Outcome (Right / Support) */}
                  {businessValue && businessValue.trim() !== '' && (
                    <div
                      style={{
                        flex: '1',
                        minWidth: '280px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderLeft: '4px solid #10B981',
                        borderRadius: '16px',
                        padding: '40px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.02)'
                      }}
                      className="reveal-trigger narrative-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '28px', color: '#10B981' }}>📈</span>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' }}>
                          Business Outcome
                        </h3>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.75',
                          color: '#475569',
                          fontWeight: 450
                        }}
                      >
                        {businessValue}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: THE MAIN VISUAL CASE STUDY BODY */}
        <div style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>

          {/* SKELETON LOADER DURING MOUNT DETAILS FETCH */}
          {loadingDetails ? (
            <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ height: '260px', borderRadius: '16px', backgroundColor: '#F1F5F9', animation: 'skeletonPulse 1.5s infinite' }} />
              ))}
            </div>
          ) : featuresList.length === 0 ? (
            /* Fallback to cards */
            <div style={{ padding: '56px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', backgroundColor: '#F8FAFC' }}>
              {features.map((f: string, i: number) => (
                <div key={i} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', padding: '20px', backgroundColor: '#FFFFFF', display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#8B5CF6', fontWeight: 600 }}>0{i + 1}.</span>
                  <span style={{ fontSize: '14.5px', color: '#0F172A', fontWeight: 600 }}>{f}</span>
                </div>
              ))}
            </div>
          ) : (
            /* VISUAL STORYTELLING ALTERNATING FULL-WIDTH SECTIONS */
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {featuresList.map((feature, idx) => {
                // Feature 01 (idx=0): Text LEFT, Image RIGHT -> isLeftImage should be false
                const isLeftImage = idx % 2 === 1;
                const isEvenBackground = idx % 2 === 1;

                return (
                  <div
                    key={feature.id}
                    style={{
                      width: '100%',
                      backgroundColor: isEvenBackground ? '#F3F4F6' : '#FFFFFF',
                      color: '#0F172A',
                      padding: '44px 48px',
                      boxSizing: 'border-box',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                    className="reveal-trigger feature-section"
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '960px',
                        display: 'grid',
                        gridTemplateColumns: isLeftImage ? '1.1fr 0.9fr' : '0.9fr 1.1fr',
                        gap: '40px',
                        alignItems: 'center'
                      }}
                      className="modal-content-grid"
                    >
                      {/* 1. Large Screenshot Display Column - Dominant */}
                      <div
                        style={{
                          order: isLeftImage ? 1 : 2,
                          width: '100%',
                          borderRadius: '16px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)',
                          cursor: 'zoom-in',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          backgroundColor: '#FFFFFF',
                          padding: '10px',
                          boxSizing: 'border-box'
                        }}
                        className="feature-image"
                        onClick={() => {
                          if (feature.imageUrl) {
                            setActiveLightboxImg({
                              url: feature.imageUrl,
                              title: feature.title,
                              caption: feature.description || undefined
                            });
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)';
                          e.currentTarget.style.boxShadow = '0 20px 48px rgba(139, 92, 246, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.04)';
                        }}
                      >
                        {feature.imageUrl ? (
                          <img
                            src={feature.imageUrl}
                            alt={feature.imageAlt || feature.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                              objectFit: 'contain',
                              borderRadius: '8px'
                            }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: '#94A3B8', fontSize: '13px' }}>
                            Image Showcase Unavailable
                          </div>
                        )}
                      </div>

                      {/* 2. Text / Bullets Support Column */}
                      <div
                        style={{
                          order: isLeftImage ? 2 : 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px'
                        }}
                        className="feature-text-block"
                      >
                        {/* Styled Feature Number Marker */}
                        <div
                          style={{
                            fontSize: '56px',
                            fontWeight: 700,
                            color: '#8B5CF6',
                            opacity: 0.1,
                            lineHeight: 1,
                            letterSpacing: '-0.03em',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}
                        >
                          0{idx + 1}
                        </div>

                        <h3
                          style={{
                            margin: '4px 0 0 0',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#0F172A',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.3
                          }}
                        >
                          {feature.title}
                        </h3>

                        {feature.description && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              lineHeight: '1.75',
                              color: '#475569',
                              fontWeight: 450,
                              maxWidth: '540px'
                            }}
                          >
                            {feature.description}
                          </p>
                        )}

                        {/* Bullet items with purple checkmarks and improved whitespace */}
                        {feature.bullets && feature.bullets.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                            {feature.bullets.map((bullet) => (
                              <div key={bullet.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <span
                                  style={{
                                    color: '#8B5CF6',
                                    fontWeight: 700,
                                    fontSize: '13px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                                    flexShrink: 0
                                  }}
                                >
                                  ✓
                                </span>
                                <span style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.7', flex: 1 }}>
                                  {bullet.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* SECTION 2.3: TECHNOLOGY STACK */}
          {technologies && technologies.length > 0 && (
            <div
              className="modal-tech-section"
              style={{
                padding: '56px 48px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#8B5CF6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Technology Integration
                  </span>
                  <h2 style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 650, color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Engineered Stack & Tools
                  </h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#475569',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        height: '36px',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'default'
                      }}
                      className="tech-chip"
                    >
                      <span style={{ color: '#8B5CF6', fontSize: '10px' }}>✦</span> {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* SECTION 2.5: PERFORMANCE IMPACT (KPI METRICS) */}
          {impactMetrics && impactMetrics.length > 0 && (
            <div
              style={{
                padding: '40px 48px 44px',
                backgroundColor: '#090D1A',
                backgroundImage: 'radial-gradient(circle at 18% 78%, rgba(16, 185, 129, 0.06) 0%, rgba(9, 13, 26, 0) 46%)',
                color: '#FFFFFF',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                justifyContent: 'center'
              }}
              className="performance-metrics-section"
            >
              <div style={{ width: '100%', maxWidth: '880px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Performance Metrics
                  </span>
                  <h2 style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: 650, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
                    Measurable Business Impact
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {impactMetrics.map((metric, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.035)',
                        border: '1px solid rgba(255, 255, 255, 0.09)',
                        borderRadius: '12px',
                        padding: '17px 18px 16px',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        gap: '6px',
                        boxSizing: 'border-box',
                        minHeight: '112px',
                        boxShadow: '0 14px 34px rgba(0, 0, 0, 0.12)',
                        transition: 'all 0.25s ease'
                      }}
                      className="metric-card"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.24)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                      }}
                    >
                      <span style={{ width: '22px', height: '2px', borderRadius: '999px', backgroundColor: '#10B981', marginBottom: '4px' }} />
                      <span style={{ fontSize: '30px', fontWeight: 700, color: '#10B981', letterSpacing: '-0.02em', lineHeight: 1 }}>
                        {metric.kpi}
                      </span>
                      <span style={{ fontSize: '12.75px', color: '#A8B3C7', fontWeight: 500, lineHeight: 1.35 }}>
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX INTERACTIVE OVERLAY */}
      {activeLightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.98)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            boxSizing: 'border-box'
          }}
          onClick={() => setActiveLightboxImg(null)}
          className="lightbox-backdrop"
        >
          {/* Lightbox Header */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              right: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{activeLightboxImg.title}</h4>
            <button
              type="button"
              onClick={() => setActiveLightboxImg(null)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#94A3B8',
                fontSize: '28px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              &times;
            </button>
          </div>

          {/* Lightbox content grid */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '900px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              style={{
                position: 'absolute',
                left: '-60px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)'}
            >
              ‹
            </button>

            {/* Lightbox central image */}
            <div
              style={{
                width: '100%',
                maxHeight: '72vh',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
              className="lightbox-image-container"
            >
              <img
                src={activeLightboxImg.url}
                alt={activeLightboxImg.title}
                style={{ width: '100%', height: 'auto', maxHeight: '72vh', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              style={{
                position: 'absolute',
                right: '-60px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.65)'}
            >
              ›
            </button>
          </div>

          {/* Lightbox caption */}
          {activeLightboxImg.caption && (
            <div
              style={{
                marginTop: '20px',
                color: '#94A3B8',
                fontSize: '13.5px',
                textAlign: 'center',
                maxWidth: '600px',
                lineHeight: 1.5
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {activeLightboxImg.caption}
            </div>
          )}
        </div>
      )}

      {/* Embedding Custom CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideUpModal {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes skeletonPulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .reveal-trigger {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .reveal-trigger.is-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-trigger.narrative-card {
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .case-story-section {
          padding: 56px 48px 64px !important;
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%) !important;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08) !important;
        }
        .case-story-container {
          max-width: 1120px !important;
          gap: 36px !important;
          counter-reset: caseStory;
        }
        .case-story-heading {
          max-width: none !important;
          margin: 0 !important;
          text-align: left !important;
          display: flex !important;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.12);
        }
        .case-story-heading::after {
          content: '';
          display: none;
        }
        .case-story-heading > span {
          display: block;
          margin-bottom: 0 !important;
          color: #4F46E5 !important;
          letter-spacing: 0.08em !important;
        }
        .case-story-heading h2 {
          margin: 0 !important;
          font-size: clamp(30px, 3.4vw, 42px) !important;
          line-height: 1.08 !important;
          letter-spacing: 0 !important;
          max-width: none;
          white-space: nowrap;
        }
        .case-story-problem-solution,
        .case-story-outcome-grid {
          position: relative;
          padding-left: 96px;
        }
        .case-story-problem-solution {
          display: flex !important;
          flex-direction: column;
          gap: 0 !important;
        }
        .case-story-outcome-grid {
          display: grid !important;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.72fr);
          gap: 36px !important;
          margin-top: 0 !important;
          padding-top: 32px;
          flex-wrap: nowrap !important;
          border-top: 1px solid rgba(15, 23, 42, 0.1);
        }
        .case-story-problem-solution::before,
        .case-story-outcome-grid::before {
          content: '';
          position: absolute;
          left: 38px;
          top: 42px;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.7), rgba(79, 70, 229, 0.62), rgba(16, 185, 129, 0.7));
        }
        .case-story-outcome-grid::before {
          top: 32px;
          background: linear-gradient(180deg, rgba(14, 165, 233, 0.6), rgba(16, 185, 129, 0.64));
        }
        .case-story-section .narrative-card {
          position: relative;
          min-width: 0 !important;
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 30px 0 !important;
          gap: 14px !important;
          overflow: visible;
          counter-increment: caseStory;
        }
        .case-story-problem-solution .narrative-card:first-child {
          padding-top: 0 !important;
        }
        .case-story-problem-solution .narrative-card + .narrative-card {
          border-top: 1px solid rgba(15, 23, 42, 0.1) !important;
        }
        .case-story-outcome-grid .narrative-card {
          flex: auto !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .case-story-outcome-grid .narrative-card:last-child {
          border-left: 1px solid rgba(15, 23, 42, 0.14) !important;
          padding-left: 36px !important;
        }
        .case-story-section .narrative-card::before {
          content: '0' counter(caseStory);
          position: absolute;
          left: -96px;
          top: 34px;
          width: 76px;
          color: #0F172A;
          font-size: 12px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.08em;
        }
        .case-story-problem-solution .narrative-card:first-child::before {
          top: 4px;
          color: #EF4444;
        }
        .case-story-problem-solution .narrative-card:nth-child(2)::before {
          color: #4F46E5;
        }
        .case-story-outcome-grid .narrative-card:first-child::before {
          top: 4px;
          color: #0EA5E9;
        }
        .case-story-outcome-grid .narrative-card:last-child::before {
          top: 4px;
          color: #10B981;
        }
        .case-story-section .narrative-card > span,
        .case-story-section .narrative-card > div:first-child > span {
          display: none !important;
        }
        .case-story-section .narrative-card h3 {
          margin: 0 !important;
          color: #0F172A !important;
          font-size: 28px ;
          line-height: 1.12 !important;
          font-weight: 850 !important;
          letter-spacing: 0 !important;
        }
        .case-story-section .narrative-card p {
          max-width: 780px;
          color: #475569 !important;
          font-size: 16px !important;
          line-height: 1.82 !important;
          font-weight: 450 !important;
        }
        .case-story-outcome-grid .narrative-card:last-child h3 {
          font-size: 18px !important;
        }
        .case-story-outcome-grid .narrative-card:last-child p {
          color: #334155 !important;
          font-size: 15px !important;
          font-weight: 500 !important;
        }
        .case-story-outcome-grid .narrative-card:only-child {
          grid-column: 1 / -1;
          border-left: 0 !important;
          padding-left: 0 !important;
        }
        .feature-section.reveal-trigger {
          opacity: 1 !important;
          transform: none !important;
        }
        .feature-section .feature-image {
          max-width: 440px;
          justify-self: center;
          align-self: center;
        }
        .feature-section .feature-image img {
          max-height: 300px;
          object-fit: contain !important;
        }
        .feature-section .feature-image,
        .feature-section .feature-text-block > * {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .feature-section.is-revealed .feature-image {
          opacity: 1;
          transform: translateY(0);
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(1) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 50ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(2) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 100ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(3) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 150ms;
        }
        .feature-section.is-revealed .feature-text-block > *:nth-child(4) {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 200ms;
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUpImg {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lightbox-backdrop {
          animation: fadeInBackdrop 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .lightbox-image-container {
          animation: scaleUpImg 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tech-chip {
          transition: all 0.2s ease-in-out !important;
        }
        .tech-chip:hover {
          background-color: #F1F5F9 !important;
          border-color: #CBD5E1 !important;
          color: #1E293B !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04) !important;
        }
        .metric-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .metric-card:hover {
          transform: translateY(-4px) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #8B5CF6 !important;
          outline-offset: 4px !important;
        }
        @media (max-width: 900px) {
          .case-story-section {
            padding: 48px 32px 56px !important;
          }
          .case-story-container {
            gap: 32px !important;
          }
          .case-story-heading {
            gap: 6px !important;
            padding-bottom: 14px;
          }
          .case-story-problem-solution,
          .case-story-outcome-grid {
            padding-left: 68px;
          }
          .case-story-problem-solution::before,
          .case-story-outcome-grid::before {
            left: 26px;
          }
          .case-story-section .narrative-card::before {
            left: -68px;
            width: 48px;
          }
          .case-story-outcome-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .case-story-outcome-grid .narrative-card:last-child {
            border-left: 0 !important;
            border-top: 1px solid rgba(15, 23, 42, 0.1) !important;
            padding-left: 0 !important;
            padding-top: 28px !important;
          }
          .feature-section .feature-image {
            max-width: 520px;
          }
          .feature-section .feature-image img {
            max-height: 280px;
          }
          .modal-content-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-section-grid {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
          }
          .hero-laptop-column {
            width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .case-story-section {
            padding: 40px 24px 48px !important;
          }
          .case-story-heading h2 {
            font-size: clamp(24px, 7vw, 30px) !important;
            line-height: 1 !important;
          }
          .case-story-problem-solution,
          .case-story-outcome-grid {
            padding-left: 0;
          }
          .case-story-problem-solution::before,
          .case-story-outcome-grid::before {
            display: none;
          }
          .case-story-section .narrative-card::before {
            position: static;
            display: block;
            width: auto;
            margin-bottom: 12px;
          }
          .case-story-section .narrative-card h3 {
            font-size: 24px !important;
          }
          .case-story-section .narrative-card p {
            font-size: 15px !important;
            line-height: 1.78 !important;
          }
          .feature-section .feature-image img {
            max-height: 240px;
          }
        }
      `}} />
    </div>
  );
};

export default ProjectDetailsModal;

