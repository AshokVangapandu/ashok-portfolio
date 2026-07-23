/* src/admin/components/portfolio-content/FormSection.tsx */
import React from 'react';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  columns?: string; // e.g. "1fr 1fr" or default empty for full-width single column
  gap?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  columns,
  gap = '16px'
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const bodyStyle: React.CSSProperties = columns
    ? {
        display: 'grid',
        gridTemplateColumns: columns,
        gap
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap
      };

  return (
    <div style={containerStyle}>
      {title && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {title}
        </span>
      )}
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
