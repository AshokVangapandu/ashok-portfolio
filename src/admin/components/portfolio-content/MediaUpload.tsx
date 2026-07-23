/* src/admin/components/portfolio-content/MediaUpload.tsx */
import React, { useRef, useState } from 'react';

interface MediaUploadProps {
  label?: string;
  helperText?: string;
  accept?: string; // e.g., "image/*,application/pdf"
  maxSize?: number; // in bytes, default 10MB
  previewUrl: string | null;
  file: File | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
  required?: boolean;
  disabled?: boolean;
  height?: string | number;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  label,
  helperText = 'PNG, JPG or PDF up to 10MB',
  accept = 'image/*,application/pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  previewUrl,
  file,
  onChange,
  required = false,
  disabled = false,
  height = '140px'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const processFile = (selectedFile: File) => {
    // Validation
    if (selectedFile.size > maxSize) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'File Too Large',
          `File size must not exceed ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`,
          5000
        );
      }
      return;
    }

    // MIME type check
    const acceptTypes = accept.split(',').map(t => t.trim());
    let isTypeAllowed = false;
    for (const type of acceptTypes) {
      if (type.endsWith('/*')) {
        const prefix = type.substring(0, type.length - 2);
        if (selectedFile.type.startsWith(prefix)) {
          isTypeAllowed = true;
          break;
        }
      } else if (type === selectedFile.type || type.includes(selectedFile.name.substring(selectedFile.name.lastIndexOf('.')))) {
        isTypeAllowed = true;
        break;
      }
    }

    if (!isTypeAllowed) {
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(
          'error',
          'Invalid File Type',
          `Only ${accept.replace(/image\/\*/g, 'images').toUpperCase()} files are allowed.`,
          5000
        );
      }
      return;
    }

    // Set preview and trigger callback
    const objectUrl = URL.createObjectURL(selectedFile);
    onChange(selectedFile, objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isPdf = (url: string | null, selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === 'application/pdf') return true;
    if (url && url.toLowerCase().includes('.pdf')) return true;
    return false;
  };

  const borderStyles = () => {
    if (isDragOver) return '1.5px dashed var(--admin-primary)';
    if (isFocused) return '1.5px dashed var(--admin-primary)';
    return '1.5px dashed rgba(124, 92, 255, 0.25)';
  };

  const bgStyles = () => {
    if (isDragOver) return 'rgba(124, 92, 255, 0.06)';
    if (isFocused) return 'rgba(124, 92, 255, 0.04)';
    return 'rgba(124, 92, 255, 0.02)';
  };

  const boxHighlight = () => {
    if (isDragOver || isFocused) return '0 0 0 3px rgba(124, 92, 255, 0.15)';
    return 'none';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {label} {required && <span style={{ color: 'var(--admin-danger)' }}>*</span>}
        </span>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
        style={{ display: 'none' }}
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={disabled ? -1 : 0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          border: borderStyles(),
          borderRadius: '12px',
          backgroundColor: bgStyles(),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: '16px',
          boxSizing: 'border-box',
          textAlign: 'center',
          outline: 'none',
          boxShadow: boxHighlight(),
          transition: 'all 0.2s ease',
        }}
      >
        {previewUrl ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              height: '100%',
              justifyContent: 'center'
            }}
          >
            {isPdf(previewUrl, file) ? (
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#EF4444" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <text x="12" y="18" textAnchor="middle" fill="#EF4444" fontSize="5px" fontWeight="bold" fontFamily="sans-serif">PDF</text>
              </svg>
            ) : (
              <img
                src={previewUrl}
                alt="Upload Preview"
                style={{
                  maxHeight: '60px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
            )}
            {file && (
              <span style={{ fontSize: '11px', color: '#64748B', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </span>
            )}
            <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
              <button
                type="button"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                style={{
                  padding: '4px 10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  cursor: disabled ? 'not-allowed' : 'pointer'
                }}
              >
                Replace
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={handleRemove}
                style={{
                  padding: '4px 10px',
                  border: '1px solid #FCA5A5',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444',
                  cursor: disabled ? 'not-allowed' : 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#7C5CFF" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569' }}>
                Drag & drop file
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                {helperText}
              </div>
            </div>
            <button
              type="button"
              disabled={disabled}
              style={{
                padding: '4px 12px',
                border: '1px solid rgba(226, 232, 240, 1)',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#FFFFFF',
                color: '#475569',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              Browse Files
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
