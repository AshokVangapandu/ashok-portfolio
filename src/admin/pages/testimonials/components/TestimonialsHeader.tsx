/* src/admin/pages/testimonials/components/TestimonialsHeader.tsx */
import React from 'react';

export const TestimonialsHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'var(--admin-space-2)' }}>
      <h1
        style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--admin-text)',
          letterSpacing: '-0.02em'
        }}
      >
        Testimonials
      </h1>
      <p
        style={{
          margin: 0,
          color: 'var(--admin-text-secondary)',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        Review, approve, and manage testimonials submitted by visitors.
      </p>
    </div>
  );
};

export default TestimonialsHeader;
