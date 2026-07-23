/* src/admin/components/portfolio-content/FormToggle.tsx */
import React from 'react';

interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string; // default green
  disabled?: boolean;
}

export const FormToggle: React.FC<FormToggleProps> = ({
  label,
  checked,
  onChange,
  activeColor = '#10B981',
  disabled = false
}) => {
  return (
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
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeColor }} />
        <span style={{ fontSize: '13.5px', fontWeight: 650, color: '#475569' }}>{label}</span>
      </div>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '999px',
          backgroundColor: checked ? activeColor : '#E2E8F0',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          opacity: disabled ? 0.6 : 1
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
            left: checked ? '23px' : '3px',
            transition: 'left 0.2s ease'
          }}
        />
      </div>
    </div>
  );
};

export default FormToggle;
