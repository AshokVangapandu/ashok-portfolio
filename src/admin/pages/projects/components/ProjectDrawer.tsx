/* src/admin/pages/projects/components/ProjectDrawer.tsx */
import React, { useState, useEffect } from 'react';
import { AdminProject } from '../../../types/project';
import { projectService } from '../../../services/projectService';
import { MediaUpload } from '../../../components/portfolio-content/MediaUpload';
import { FormContainer } from '../../../components/portfolio-content/FormContainer';
import { FormSection } from '../../../components/portfolio-content/FormSection';
import { FormTextField } from '../../../components/portfolio-content/FormTextField';
import { FormToggle } from '../../../components/portfolio-content/FormToggle';
import { FormTagSelector } from '../../../components/portfolio-content/FormTagSelector';

interface ProjectDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedProject: AdminProject | null;
  onClose: () => void;
  onSave: (data: AdminProject) => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  isOpen,
  mode,
  selectedProject,
  onClose,
  onSave
}) => {
  // Form Field States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');
  const [timeline, setTimeline] = useState('');
  const [platform, setPlatform] = useState('');
  const [users, setUsers] = useState('');
  const [businessValue, setBusinessValue] = useState('');

  // Details
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [solution, setSolution] = useState('');

  // Key Features
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  // Technologies Tags state
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Metrics
  const [impactMetrics, setImpactMetrics] = useState<{ kpi: string; label: string }[]>([]);

  // Links
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');

  // Media
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle/Status states
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);

  // Escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Populate data when drawer opens or changes mode
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && selectedProject) {
        setTitle(selectedProject.title || '');
        setCategory(selectedProject.category || '');
        setClient(selectedProject.client || '');
        setRole(selectedProject.role || '');
        setTimeline(selectedProject.timeline || '');
        setPlatform(selectedProject.platform || '');
        setUsers(selectedProject.users || '');
        setBusinessValue(selectedProject.businessValue || '');
        setDescription(selectedProject.description || '');
        setFullDescription(selectedProject.fullDescription || '');
        setProblemSolved(selectedProject.problemSolved || '');
        setSolution(selectedProject.solution || '');
        setFeatures(selectedProject.features || []);
        setTechnologies(selectedProject.technologies || []);
        setImpactMetrics(selectedProject.impactMetrics || []);
        setDemoUrl(selectedProject.demoUrl || '');
        setGithubUrl(selectedProject.githubUrl || '');
        setDocsUrl(selectedProject.docsUrl || '');
        setCoverPreview(selectedProject.coverImageUrl || null);
        setStatus(selectedProject.status || 'draft');
        setIsFeatured(selectedProject.isFeatured || false);
        setCoverFile(null);
      } else {
        // Clear all fields for Create Mode
        setTitle('');
        setCategory('');
        setClient('');
        setRole('');
        setTimeline('');
        setPlatform('');
        setUsers('');
        setBusinessValue('');
        setDescription('');
        setFullDescription('');
        setProblemSolved('');
        setSolution('');
        setFeatures([]);
        setFeatureInput('');
        setTechnologies([]);
        setTechInput('');
        setImpactMetrics([]);
        setDemoUrl('');
        setGithubUrl('');
        setDocsUrl('');
        setCoverPreview(null);
        setCoverFile(null);
        setStatus('draft');
        setIsFeatured(false);
      }
    }
  }, [isOpen, mode, selectedProject]);

  if (!isOpen) return null;

  // Features list actions
  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatures(features.filter(f => f !== featureToRemove));
  };

  // Technologies list actions
  const handleRemoveTech = (techToRemove: string) => {
    setTechnologies(technologies.filter(t => t !== techToRemove));
  };

  // Metrics list actions
  const handleAddMetric = () => {
    setImpactMetrics([...impactMetrics, { kpi: '', label: '' }]);
  };

  const handleRemoveMetric = (index: number) => {
    setImpactMetrics(impactMetrics.filter((_, i) => i !== index));
  };

  const handleMetricChange = (index: number, field: 'kpi' | 'label', value: string) => {
    const updated = [...impactMetrics];
    updated[index][field] = value;
    setImpactMetrics(updated);
  };

  // Trigger form submission callback
  const handleSubmit = async (statusOverride?: 'draft' | 'published') => {
    // Validation
    if (!title.trim() || !category.trim()) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Validation Error', 'Please fill in all required fields (*).', 5000);
      }
      return;
    }

    const currentStatus = statusOverride || status;

    setIsSubmitting(true);
    try {
      let iconUrl = coverPreview;

      // Upload hero image if present
      if (coverFile) {
        const path = `projects/${Date.now()}-${coverFile.name}`;
        // Since asset uploading isn't connected to backend storage in this phase, simulate public url
        iconUrl = `https://txoszrnjkrlbjzpjisvp.supabase.co/storage/v1/object/public/projects/${path}`;
      }

      const payload: AdminProject = {
        id: selectedProject?.id || `proj-${Date.now()}`,
        title,
        description,
        fullDescription,
        category,
        client,
        role,
        timeline,
        platform,
        users,
        status: currentStatus,
        businessValue,
        technologies,
        coverImageUrl: iconUrl,
        images: selectedProject?.images || [],
        problemSolved,
        solution,
        features,
        impactMetrics,
        layoutType: isFeatured ? 'large' : 'medium',
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        docsUrl: docsUrl || undefined,
        updatedAt: new Date().toISOString(),
        isFeatured
      };

      if (mode === 'create') {
        await projectService.createProject(payload);
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Project Created', 'Project created successfully.', 4000);
        }
      } else {
        await projectService.updateProject(payload.id, payload);
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Project Updated', 'Project updated successfully.', 4000);
        }
      }

      onSave(payload);
    } catch (err: any) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Submission Failed', err.message || 'Failed to save project.', 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerActions = (
    <>
      <button
        type="button"
        onClick={onClose}
        style={{
          padding: '10px 20px',
          border: '1px solid rgba(226, 232, 240, 1)',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          color: '#475569',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
      >
        Cancel
      </button>

      {mode === 'create' ? (
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(226, 232, 240, 1)',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: isSubmitting ? '#94A3B8' : '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: isSubmitting ? '#94A3B8' : '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(124, 92, 255, 0.25)',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#6D4EE3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#7C5CFF';
            }}
          >
            Publish
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            style={{
              padding: '10px 20px',
              border: '1px solid rgba(226, 232, 240, 1)',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              color: isSubmitting ? '#94A3B8' : '#475569',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: isSubmitting ? '#94A3B8' : '#7C5CFF',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(124, 92, 255, 0.25)',
              opacity: isSubmitting ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#6D4EE3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#7C5CFF';
            }}
          >
            Update & Publish
          </button>
        </>
      )}
    </>
  );

  return (
    <FormContainer
      title={mode === 'create' ? 'Add New Project' : 'Edit Project'}
      description={
        mode === 'create'
          ? 'Fill in the details below to add a new project to your portfolio.'
          : 'Update the project information displayed on your portfolio.'
      }
      onClose={onClose}
      isSubmitting={isSubmitting}
      actions={footerActions}
    >
      <FormSection title="Section 1 — Basic Information" columns="1fr 1fr">
        <FormTextField
          label="Project Name"
          placeholder="e.g., Enterprise Core Dashboard"
          value={title}
          onChange={setTitle}
          required
          disabled={isSubmitting}
        />
        <FormTextField
          label="Category"
          placeholder="e.g., Enterprise, Healthcare, Finance"
          value={category}
          onChange={setCategory}
          required
          disabled={isSubmitting}
        />
        <FormTextField
          label="Client"
          placeholder="e.g., IndiSH Tech"
          value={client}
          onChange={setClient}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Role"
          placeholder="e.g., Lead Architect, Frontend Engineer"
          value={role}
          onChange={setRole}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Duration"
          placeholder="e.g., 6 Months, Jan - Jun 2024"
          value={timeline}
          onChange={setTimeline}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Platform"
          placeholder="e.g., Web, iOS, Android, Desktop"
          value={platform}
          onChange={setPlatform}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 2 — Media">
        <MediaUpload
          label="Hero Image"
          helperText="PNG, JPG or SVG up to 10MB"
          previewUrl={coverPreview}
          file={coverFile}
          onChange={(file, preview) => {
            setCoverFile(file);
            setCoverPreview(preview);
          }}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 3 — Project Details">
        <FormTextField
          label="Short Description"
          placeholder="Brief summary of the project..."
          value={description}
          onChange={setDescription}
          type="textarea"
          rows={2}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Full Description"
          placeholder="Detailed description of the project..."
          value={fullDescription}
          onChange={setFullDescription}
          type="textarea"
          rows={4}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Problem Statement"
          placeholder="What challenges or user needs were addressed?"
          value={problemSolved}
          onChange={setProblemSolved}
          type="textarea"
          rows={3}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Solution"
          placeholder="Describe the solution architecture and engineering choices..."
          value={solution}
          onChange={setSolution}
          type="textarea"
          rows={3}
          disabled={isSubmitting}
        />
        <FormTagSelector
          label="Key Features"
          tags={features}
          inputVal={featureInput}
          onInputChange={setFeatureInput}
          onAddTag={(tag) => setFeatures([...features, tag])}
          onRemoveTag={handleRemoveFeature}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 4 — Technologies">
        <FormTagSelector
          label="Technologies & Frameworks"
          tags={technologies}
          inputVal={techInput}
          onInputChange={setTechInput}
          onAddTag={(tag) => setTechnologies([...technologies, tag])}
          onRemoveTag={handleRemoveTech}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 5 — Metrics & Highlights">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--admin-space-4)', width: '100%' }}>
            <FormTextField
              label="Users Count / Reach"
              placeholder="e.g., 50k+ Monthly Active Users"
              value={users}
              onChange={setUsers}
              disabled={isSubmitting}
            />
            <FormTextField
              label="Business Value / ROI"
              placeholder="e.g., 40% reduction in processing latency"
              value={businessValue}
              onChange={setBusinessValue}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginTop: 'var(--admin-space-2)' }}>
            <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '8px' }}>
              Impact Metrics List
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {impactMetrics.map((metric, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="KPI Value (e.g. 99.9%)"
                      value={metric.kpi}
                      onChange={(e) => handleMetricChange(idx, 'kpi', e.target.value)}
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px' }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <input
                      type="text"
                      placeholder="KPI Label (e.g. Core System Uptime)"
                      value={metric.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      disabled={isSubmitting}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--admin-border)', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    disabled={isSubmitting}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMetric}
                disabled={isSubmitting}
                style={{
                  alignSelf: 'flex-start',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px dashed #7C5CFF',
                  backgroundColor: 'rgba(124, 92, 255, 0.05)',
                  color: '#7C5CFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Add Metric KPI
              </button>
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Section 6 — External Links" columns="1fr 1fr">
        <FormTextField
          label="Live Demo Link"
          placeholder="https://example.com/demo"
          value={demoUrl}
          onChange={setDemoUrl}
          disabled={isSubmitting}
        />
        <FormTextField
          label="GitHub Source Link"
          placeholder="https://github.com/username/project"
          value={githubUrl}
          onChange={setGithubUrl}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Documentation Link"
          placeholder="https://docs.example.com"
          value={docsUrl}
          onChange={setDocsUrl}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Section 7 — Status">
        <FormToggle
          label="Featured"
          checked={isFeatured}
          onChange={setIsFeatured}
          activeColor="#8B5CF6"
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--admin-text)', fontWeight: 550 }}>
            <input
              type="radio"
              name="projectStatus"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              disabled={isSubmitting}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Draft Mode
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--admin-text)', fontWeight: 550 }}>
            <input
              type="radio"
              name="projectStatus"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              disabled={isSubmitting}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            Publish Live
          </label>
        </div>
      </FormSection>
    </FormContainer>
  );
};
