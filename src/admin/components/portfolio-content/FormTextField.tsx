/* src/admin/components/portfolio-content/FormTextField.tsx */
import React from 'react';

interface FormTextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'textarea' | 'url';
  rows?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = 'text',
  rows = 3,
  icon,
  disabled = false
}) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: icon ? '0 12px 0 38px' : '0 12px',
    border: '1.5px solid rgba(226, 232, 240, 1)',
    borderRadius: '10px',
    fontSize: '13.5px',
    boxSizing: 'border-box',
    color: '#0F172A',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: disabled ? '#F8FAFC' : '#FFFFFF',
    cursor: disabled ? 'not-allowed' : 'text'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ fontSize: '13px', fontWeight: 650, color: '#475569' }}>
        {label} {required && <span style={{ color: 'var(--admin-danger)' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          disabled={disabled}
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
            resize: 'none',
            backgroundColor: disabled ? '#F8FAFC' : '#FFFFFF',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
        />
      ) : (
        <div style={{ position: 'relative', width: '100%' }}>
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                display: 'flex'
              }}
            >
              {icon}
            </span>
          )}
          <input
            type={type === 'url' ? 'url' : 'text'}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{
              ...inputStyle,
              height: '40px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FormTextField;
