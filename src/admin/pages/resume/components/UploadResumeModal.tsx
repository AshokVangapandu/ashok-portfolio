/* src/admin/pages/resume/components/UploadResumeModal.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { ResumeSetting } from '../../../types/resume';
import { MediaUpload } from '../../../components/portfolio-content/MediaUpload';

interface UploadResumeModalProps {
  isOpen: boolean;
  mode: 'upload' | 'replace';
  selectedResume: ResumeSetting | null;
  onClose: () => void;
  onSave: (file: File, resumeName: string, version: string) => Promise<void>;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  mode,
  selectedResume,
  onClose,
  onSave
}) => {
  const [resumeName, setResumeName] = useState('');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'replace' && selectedResume) {
        setResumeName(selectedResume.resumeName);
        setVersion(selectedResume.version);
        setFile(null);
      } else {
        setResumeName('');
        setVersion('');
        setFile(null);
      }
      setIsSubmitting(false);
    }
  }, [isOpen, mode, selectedResume]);

  if (!isOpen) return null;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeName.trim() || !version.trim()) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Validation Error', 'Please fill in all fields.', 5000);
      }
      return;
    }

    if (!file) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Validation Error', 'Please select a resume PDF file.', 5000);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(file, resumeName.trim(), version.trim());
      onClose();
    } catch (err: any) {
      // Error handled by parent page
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: 700, color: '#0F172A' }}>
            {mode === 'replace' ? 'Replace Resume File' : 'Upload Resume PDF'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 0,
              display: 'flex'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Resume Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
              Resume Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Ashok Vangapandu Resume"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 12px',
                border: '1.5px solid rgba(226, 232, 240, 1)',
                borderRadius: '8px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#0F172A'
              }}
            />
          </div>

          {/* Version */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
              Version *
            </label>
            <input
              type="text"
              placeholder="e.g., v4.2"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 12px',
                border: '1.5px solid rgba(226, 232, 240, 1)',
                borderRadius: '8px',
                fontSize: '13.5px',
                boxSizing: 'border-box',
                outline: 'none',
                color: '#0F172A'
              }}
            />
          </div>

          {/* File Upload Zone */}
          <MediaUpload
            label="Select PDF Document"
            helperText="PDF format only, up to 10MB"
            accept="application/pdf"
            previewUrl={file ? 'resume.pdf' : null}
            file={file}
            onChange={(selectedFile) => {
              setFile(selectedFile);
            }}
            required
            disabled={isSubmitting}
            height="140px"
          />

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--admin-border)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 18px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: isSubmitting ? '#94A3B8' : 'var(--admin-primary)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitting ? 'none' : '0 2px 6px rgba(124, 92, 255, 0.15)'
              }}
            >
              {isSubmitting ? 'Uploading...' : mode === 'replace' ? 'Replace' : 'Upload & Activate'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
