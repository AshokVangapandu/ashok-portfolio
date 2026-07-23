/* src/admin/pages/certifications/components/CertificationDrawer.tsx */
import React, { useState, useEffect } from 'react';
import { Certification } from '../mockCertifications';
import { certificationService } from '../../../services/certificationService';
import { MediaUpload } from '../../../components/portfolio-content/MediaUpload';
import { FormContainer } from '../../../components/portfolio-content/FormContainer';
import { FormSection } from '../../../components/portfolio-content/FormSection';
import { FormTextField } from '../../../components/portfolio-content/FormTextField';
import { FormToggle } from '../../../components/portfolio-content/FormToggle';
import { FormTagSelector } from '../../../components/portfolio-content/FormTagSelector';

interface CertificationDrawerProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedCertification: Certification | null;
  onClose: () => void;
  onSave: (data: Partial<Certification>) => void;
}

export const CertificationDrawer: React.FC<CertificationDrawerProps> = ({
  isOpen,
  mode,
  selectedCertification,
  onClose,
  onSave
}) => {
  // Form Field States
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [description, setDescription] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  // Icon and Media uploads
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Skills Tags state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  // Toggle states
  const [isVerified, setIsVerified] = useState(true);
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
      if (mode === 'edit' && selectedCertification) {
        setTitle(selectedCertification.title || '');
        setIssuer(selectedCertification.issuer || '');
        setCredentialId(selectedCertification.credentialId || '');
        setDescription(selectedCertification.description || '');
        setIssueDate(selectedCertification.issueDate || '');
        setExpiryDate(selectedCertification.expiryDate || '');
        setIconPreview(selectedCertification.certificateImageUrl || null);
        setMediaPreview(selectedCertification.certificateFileUrl || null);
        setSkills(selectedCertification.skills || []);
        setIsVerified(true);
        setIsFeatured(selectedCertification.isFeatured || false);
        setIconFile(null);
        setMediaFile(null);
      } else {
        // Clear all fields for Create Mode
        setTitle('');
        setIssuer('');
        setCredentialId('');
        setDescription('');
        setIssueDate('');
        setExpiryDate('');
        setIconPreview(null);
        setMediaPreview(null);
        setIconFile(null);
        setMediaFile(null);
        setSkills([]);
        setSkillInput('');
        setIsVerified(true);
        setIsFeatured(false);
      }
    }
  }, [isOpen, mode, selectedCertification]);

  if (!isOpen) return null;

  // Remove a skill tag from state array
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Trigger form submission callback
  const handleSubmit = async (statusOverride?: Certification['status']) => {
    // Validation
    if (!title.trim() || !issuer.trim() || !issueDate.trim()) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Validation Error', 'Please fill in all required fields (*).', 5000);
      }
      return;
    }

    // Expiry Date validation
    const parsedIssue = Date.parse(issueDate);
    const parsedExpiry = Date.parse(expiryDate);
    if (!isNaN(parsedIssue) && !isNaN(parsedExpiry)) {
      if (new Date(parsedExpiry) < new Date(parsedIssue)) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('error', 'Validation Error', 'Expiry Date cannot be earlier than Issue Date.', 5000);
        }
        return;
      }
    }

    const dbStatus = (statusOverride && (statusOverride.toLowerCase() === 'draft' || statusOverride.toLowerCase() === 'pending')) ? 'draft' : 'published';

    if (mode === 'create') {
      setIsSubmitting(true);
      try {
        let iconUrl = '';
        let mediaUrl = '';

        // Upload assets if present
        if (iconFile) {
          const iconPath = `icons/${Date.now()}-${iconFile.name}`;
          iconUrl = await certificationService.uploadAsset(iconFile, iconPath);
        }

        if (mediaFile) {
          const mediaPath = `media/${Date.now()}-${mediaFile.name}`;
          mediaUrl = await certificationService.uploadAsset(mediaFile, mediaPath);
        }

        // Save record to Supabase
        const newCert = await certificationService.createCertification({
          title,
          issuer,
          category: 'General',
          description: description.trim() || null,
          issue_date: issueDate.trim(),
          expiry_date: expiryDate.trim() || null,
          credential_id: credentialId.trim() || null,
          credential_url: null,
          certificate_image_url: iconUrl || null,
          certificate_file_url: mediaUrl || null,
          skills: skills.length > 0 ? skills : null,
          status: dbStatus,
          is_featured: isFeatured,
          display_order: 0
        });

        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Certification Added', 'Certification added successfully.', 4000);
        }

        onSave(newCert);
      } catch (err: any) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('error', 'Submission Failed', err.message || 'Failed to save certification.', 5000);
        }
        setIsSubmitting(false);
      }
    } else {
      if (!selectedCertification) return;
      setIsSubmitting(true);
      try {
        let iconUrl = iconPreview;
        let mediaUrl = mediaPreview;

        // Upload replacement assets if selected
        if (iconFile) {
          const iconPath = `icons/${Date.now()}-${iconFile.name}`;
          iconUrl = await certificationService.uploadAsset(iconFile, iconPath);
        }

        if (mediaFile) {
          const mediaPath = `media/${Date.now()}-${mediaFile.name}`;
          mediaUrl = await certificationService.uploadAsset(mediaFile, mediaPath);
        }

        // Perform update query
        const updatedCert = await certificationService.updateCertification(selectedCertification.id, {
          title,
          issuer,
          description: description.trim() || null,
          issue_date: issueDate.trim(),
          expiry_date: expiryDate.trim() || null,
          credential_id: credentialId.trim() || null,
          credential_url: null,
          certificate_image_url: iconUrl || null,
          certificate_file_url: mediaUrl || null,
          skills: skills.length > 0 ? skills : null,
          status: dbStatus,
          is_featured: isFeatured
        });

        let msg = 'Certification updated successfully.';
        if (dbStatus === 'published' && selectedCertification.status?.toLowerCase() !== 'published') {
          msg = 'Certification published successfully.';
        } else if (dbStatus === 'draft' && selectedCertification.status?.toLowerCase() === 'published') {
          msg = 'Certification moved to draft.';
        } else if (isFeatured && !selectedCertification.isFeatured) {
          msg = 'Certification marked as featured.';
        } else if (!isFeatured && selectedCertification.isFeatured) {
          msg = 'Certification removed from featured.';
        }

        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('success', 'Certification Updated', msg, 4000);
        }

        onSave(updatedCert);
      } catch (err: any) {
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast('error', 'Update Failed', err.message || 'Failed to update certification.', 5000);
        }
        setIsSubmitting(false);
      }
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
            onClick={() => handleSubmit('Draft')}
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
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Published')}
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
            {isSubmitting ? 'Saving...' : 'Publish'}
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Draft')}
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Published')}
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
            {isSubmitting ? 'Saving...' : 'Update & Publish'}
          </button>
        </>
      )}
    </>
  );

  return (
    <FormContainer
      title={mode === 'create' ? 'Add New Certification' : 'Edit Certification'}
      description={
        mode === 'create'
          ? 'Fill in the details below to add a new certification to your portfolio.'
          : 'Update the certification information displayed on your portfolio.'
      }
      onClose={onClose}
      isSubmitting={isSubmitting}
      actions={footerActions}
    >
      <FormSection title="Basic Information">
        <FormTextField
          label="Certificate Title"
          placeholder="e.g., Mendix Advanced Developer"
          value={title}
          onChange={setTitle}
          required
          disabled={isSubmitting}
        />
        <FormTextField
          label="Issuing Organization"
          placeholder="e.g., Mendix Academy"
          value={issuer}
          onChange={setIssuer}
          required
          disabled={isSubmitting}
        />
        <FormTextField
          label="Credential ID"
          placeholder="e.g., CERT-2024-12345"
          value={credentialId}
          onChange={setCredentialId}
          disabled={isSubmitting}
        />
        <FormTextField
          label="Description"
          placeholder="Add a brief description of this certification..."
          value={description}
          onChange={setDescription}
          type="textarea"
          rows={3}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormSection title="Dates" columns="1fr 1fr">
        <FormTextField
          label="Issue Date"
          placeholder="Jan 2024"
          value={issueDate}
          onChange={setIssueDate}
          required
          disabled={isSubmitting}
          icon={
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
        <FormTextField
          label="Expiry Date"
          placeholder="No expiry"
          value={expiryDate}
          onChange={setExpiryDate}
          disabled={isSubmitting}
          icon={
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
      </FormSection>

      <FormSection columns="1fr 1.25fr">
        <MediaUpload
          label="Icon"
          helperText="PNG, JPG or PDF up to 10MB"
          previewUrl={iconPreview}
          file={iconFile}
          onChange={(file, preview) => {
            setIconFile(file);
            setIconPreview(preview);
          }}
          disabled={isSubmitting}
        />
        <MediaUpload
          label="Media"
          helperText="PNG, JPG or PDF up to 10MB"
          previewUrl={mediaPreview}
          file={mediaFile}
          onChange={(file, preview) => {
            setMediaFile(file);
            setMediaPreview(preview);
          }}
          disabled={isSubmitting}
        />
      </FormSection>

      <FormTagSelector
        label="Skills & Tags"
        tags={skills}
        inputVal={skillInput}
        onInputChange={setSkillInput}
        onAddTag={(tag) => setSkills([...skills, tag])}
        onRemoveTag={handleRemoveSkill}
        disabled={isSubmitting}
      />

      <FormSection title="Status">
        <FormToggle
          label="Verified"
          checked={isVerified}
          onChange={setIsVerified}
          activeColor="#10B981"
          disabled={isSubmitting}
        />
        <FormToggle
          label="Featured"
          checked={isFeatured}
          onChange={setIsFeatured}
          activeColor="#8B5CF6"
          disabled={isSubmitting}
        />
      </FormSection>
    </FormContainer>
  );
};

export default CertificationDrawer;
