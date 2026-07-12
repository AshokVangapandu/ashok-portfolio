/* src/admin/pages/social-links/components/UrlInput.tsx */
import React from 'react';
import { Input } from '../../../components/inputs/Input';

interface UrlInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ value, onChange, style, ...props }) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 16px',
        border: '1px solid var(--admin-border)',
        borderRadius: '8px',
        fontSize: '13.5px',
        color: 'var(--admin-text)',
        backgroundColor: '#F8FAFC', // Editable yet soft tinted default
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.15s ease',
        boxShadow: 'none',
        ...style
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--admin-primary)';
        e.currentTarget.style.backgroundColor = '#FFFFFF';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--admin-border)';
        e.currentTarget.style.backgroundColor = '#F8FAFC';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
};

export default UrlInput;
