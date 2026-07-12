/* src/admin/pages/certifications/components/CertificationDrawer.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { Certification } from '../mockCertifications';

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
  
  // Skills Tags state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  
  // Links state
  const [verificationUrl, setVerificationUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  
  // Toggle states
  const [isVerified, setIsVerified] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Hidden file input refs
  const iconInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

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
        setCredentialId('MX-ADV-2026-4587'); // Mock pre-population from details
        setDescription('This certification represents advanced knowledge of domain models, microflows, validation, security rules, performance checks, and custom API integration.');
        setIssueDate(selectedCertification.issueDate || '');
        setExpiryDate('No expiry');
        setIconPreview(selectedCertification.thumbnailUrl || null);
        setMediaPreview(selectedCertification.thumbnailUrl || null);
        setSkills(['Mendix', 'React', 'UI/UX']);
        setVerificationUrl('https://credentials.mendix.com/MX-ADV-2026-4587');
        setDownloadUrl('https://credentials.mendix.com/MX-ADV-2026-4587/download.pdf');
        setIsVerified(true);
        setIsFeatured(selectedCertification.status === 'Featured');
        setIsPublished(selectedCertification.status === 'Published' || selectedCertification.status === 'Featured');
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
        setSkills([]);
        setSkillInput('');
        setVerificationUrl('');
        setDownloadUrl('');
        setIsVerified(true);
        setIsFeatured(false);
        setIsPublished(true);
      }
    }
  }, [isOpen, mode, selectedCertification]);

  if (!isOpen) return null;

  // Add a skill tag to state array
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const cleanSkill = skillInput.trim().replace(/,$/, '');
      if (!skills.includes(cleanSkill)) {
        setSkills([...skills, cleanSkill]);
      }
      setSkillInput('');
    }
  };

  // Remove a skill tag from state array
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Trigger form submission callback
  const handleSubmit = (statusOverride?: Certification['status']) => {
    // Simple mock field validations
    if (!title.trim() || !issuer.trim()) {
      alert('Please fill out Certificate Title and Issuing Organization fields.');
      return;
    }

    let statusVal: Certification['status'] = 'Published';
    if (statusOverride) {
      statusVal = statusOverride;
    } else {
      if (!isPublished) {
        statusVal = 'Draft';
      } else if (isFeatured) {
        statusVal = 'Published'; // Or handle Featured custom
      }
    }

    onSave({
      id: selectedCertification?.id || `cert-${Date.now()}`,
      title,
      issuer,
      issueDate: issueDate || 'Jun 2026',
      status: statusVal,
      thumbnailUrl: iconPreview || 'https://images.unsplash.com/photo-1589330694653-ded6df53f6ee?auto=format&fit=crop&w=300&q=80'
    });
  };

  // Handle Mock File uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'icon' | 'media') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'icon') {
          setIconPreview(reader.result as string);
        } else {
          setMediaPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 999
        }}
      />

      {/* Drawer slide-in panel */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '560px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.08)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {mode === 'create' ? 'Add New Certification' : 'Edit Certification'}
            </h2>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
              {mode === 'create' 
                ? 'Fill in the details below to add a new certification to your portfolio.' 
                : 'Update the certification information displayed on your portfolio.'}
            </span>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'rgba(241, 245, 29, 0.01)',
              cursor: 'pointer',
              color: '#94A3B8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box'
          }}
        >
          {/* Basic Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Basic Information
            </span>

            {/* Title Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Certificate Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Mendix Advanced Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Issuer Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Issuing Organization *
              </label>
              <input
                type="text"
                placeholder="e.g., Mendix Academy"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Credential ID Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Credential ID
              </label>
              <input
                type="text"
                placeholder="e.g., CERT-2024-12345"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Description Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Description
              </label>
              <textarea
                placeholder="Add a brief description of this certification..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            </div>
          </div>

          {/* Dates Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dates
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Issue Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                  Issue Date *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Jan 2024"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px 0 38px',
                      border: '1.5px solid rgba(226, 232, 240, 1)',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Expiry Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                  Expiry Date
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="No expiry"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px 0 38px',
                      border: '1.5px solid rgba(226, 232, 240, 1)',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex' }}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Icon & Media Upload Zones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '16px' }}>
              {/* Icon zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Icon
                </span>
                <input
                  type="file"
                  ref={iconInputRef}
                  onChange={(e) => handleFileChange(e, 'icon')}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => iconInputRef.current?.click()}
                  style={{
                    height: '140px',
                    border: '1.5px dashed rgba(124, 92, 255, 0.2)',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(124, 92, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '16px',
                    boxSizing: 'border-box',
                    textAlign: 'center'
                  }}
                >
                  {iconPreview ? (
                    <img src={iconPreview} alt="Icon Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#7C5CFF" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569' }}>Drag & drop icon</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>PNG, JPG or PDF up to 10MB</div>
                      </div>
                      <button type="button" style={{ padding: '4px 12px', border: '1px solid rgba(226, 232, 240, 1)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#FFFFFF', color: '#475569' }}>
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Media zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Media
                </span>
                <input
                  type="file"
                  ref={mediaInputRef}
                  onChange={(e) => handleFileChange(e, 'media')}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <div
                  onClick={() => mediaInputRef.current?.click()}
                  style={{
                    height: '140px',
                    border: '1.5px dashed rgba(124, 92, 255, 0.2)',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(124, 92, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '16px',
                    boxSizing: 'border-box',
                    textAlign: 'center'
                  }}
                >
                  {mediaPreview ? (
                    <img src={mediaPreview} alt="Media Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#7C5CFF" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569' }}>Drag & drop certificate image</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>PNG, JPG or PDF up to 10MB</div>
                      </div>
                      <button type="button" style={{ padding: '4px 12px', border: '1px solid rgba(226, 232, 240, 1)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, backgroundColor: '#FFFFFF', color: '#475569' }}>
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills and Tags Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skills & Tags
            </span>
            <div
              style={{
                border: '1.5px solid rgba(226, 232, 240, 1)',
                borderRadius: '10px',
                padding: '8px 12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
                boxSizing: 'border-box',
                minHeight: '40px'
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    backgroundColor: 'rgba(124, 92, 255, 0.08)',
                    color: '#7C5CFF',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {skill}
                  <span
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'rgba(124, 92, 255, 0.6)'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '13.5px',
                  color: '#0F172A',
                  flex: 1,
                  minWidth: '80px',
                  padding: 0
                }}
              />
            </div>
          </div>

          {/* Links Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Links
            </span>

            {/* Verification URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Credential Verification URL
              </label>
              <input
                type="text"
                placeholder="https://credentials.mendix.com/..."
                value={verificationUrl}
                onChange={(e) => setVerificationUrl(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>

            {/* Download URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
                Certificate Download URL
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: '1.5px solid rgba(226, 232, 240, 1)',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Status Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </span>

            {/* Verified toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(248, 250, 252, 0.5)',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>Verified</span>
              </div>
              <div
                onClick={() => setIsVerified(!isVerified)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: isVerified ? '#10B981' : '#E2E8F0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: isVerified ? '23px' : '3px',
                    transition: 'left 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Featured toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(248, 250, 252, 0.5)',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>Featured</span>
              </div>
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: isFeatured ? '#8B5CF6' : '#E2E8F0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: isFeatured ? '23px' : '3px',
                    transition: 'left 0.2s ease'
                  }}
                />
              </div>
            </div>

            {/* Published toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(248, 250, 252, 0.5)',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>Published</span>
              </div>
              <div
                onClick={() => setIsPublished(!isPublished)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  backgroundColor: isPublished ? '#10B981' : '#E2E8F0',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: isPublished ? '23px' : '3px',
                    transition: 'left 0.2s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1.5px dashed rgba(226, 232, 240, 1)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            boxSizing: 'border-box',
            backgroundColor: '#F8FAFC'
          }}
        >
          {/* Cancel button */}
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
              {/* Save as Draft button */}
              <button
                type="button"
                onClick={() => handleSubmit('Draft')}
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
                Save as Draft
              </button>

              {/* Publish button */}
              <button
                type="button"
                onClick={() => handleSubmit('Published')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: '#7C5CFF',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  boxShadow: '0 4px 12px rgba(124, 92, 255, 0.25)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D4EE3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C5CFF'}
              >
                Publish
              </button>
            </>
          ) : (
            <>
              {/* Save Changes button */}
              <button
                type="button"
                onClick={() => handleSubmit('Draft')}
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
                Save Changes
              </button>

              {/* Update & Publish button */}
              <button
                type="button"
                onClick={() => handleSubmit('Published')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: '#7C5CFF',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  boxShadow: '0 4px 12px rgba(124, 92, 255, 0.25)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D4EE3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C5CFF'}
              >
                Update & Publish
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default CertificationDrawer;
