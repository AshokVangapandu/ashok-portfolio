/* src/admin/components/portfolio-content/FormTagSelector.tsx */
import React from 'react';

interface FormTagSelectorProps {
  label: string;
  tags: string[];
  inputVal: string;
  onInputChange: (val: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const FormTagSelector: React.FC<FormTagSelectorProps> = ({
  label,
  tags,
  inputVal,
  onInputChange,
  onAddTag,
  onRemoveTag,
  placeholder = 'Add skill...',
  disabled = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      const cleanTag = inputVal.trim().replace(/,$/, '');
      if (!tags.includes(cleanTag)) {
        onAddTag(cleanTag);
      }
      onInputChange('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {label}
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
          minHeight: '40px',
          backgroundColor: disabled ? '#F8FAFC' : '#FFFFFF'
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
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
            {tag}
            {!disabled && (
              <span
                onClick={() => onRemoveTag(tag)}
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
            )}
          </span>
        ))}
        <input
          type="text"
          placeholder={disabled ? '' : placeholder}
          value={inputVal}
          onChange={(e) => !disabled && onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '13.5px',
            color: '#0F172A',
            flex: 1,
            minWidth: '80px',
            padding: 0,
            backgroundColor: 'transparent',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
        />
      </div>
    </div>
  );
};

export default FormTagSelector;
