/* src/admin/components/inputs/Input.tsx */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--admin-space-1)',
        width: '100%',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {label && (
        <span 
          className="text-label"
          style={{ 
            fontSize: '12.5px', 
            fontWeight: 500, 
            color: 'var(--admin-text-secondary)'
          }}
        >
          {label}
        </span>
      )}
      <input
        style={{
          padding: 'var(--admin-space-2) var(--admin-space-3)',
          border: error ? '1px solid var(--admin-danger)' : '1px solid var(--admin-border)',
          borderRadius: 'var(--admin-radius-sm)',
          fontSize: '13.5px',
          color: 'var(--admin-text)',
          background: '#FFFFFF',
          outline: 'none',
          boxShadow: 'var(--admin-shadow-sm)',
          transition: 'border-color 0.15s ease',
          ...style
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = 'var(--admin-primary)';
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = 'var(--admin-border)';
        }}
        {...props}
      />
      {error && (
        <span 
          style={{ 
            fontSize: '11px', 
            color: 'var(--admin-danger)', 
            marginTop: '2px' 
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
