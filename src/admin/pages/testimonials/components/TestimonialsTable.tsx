/* src/admin/pages/testimonials/components/TestimonialsTable.tsx */
import React from 'react';
import { Testimonial } from '../../../types/testimonial';
import { TestimonialRow } from './TestimonialRow';

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onViewTestimonial?: (t: Testimonial) => void;
}

export const TestimonialsTable: React.FC<TestimonialsTableProps> = ({ testimonials, onViewTestimonial }) => {
  const headers = [
    'Visitor',
    'Company / Role',
    'Rating',
    'Preview',
    'Country',
    'Date',
    'Status',
    'Actions'
  ];

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        background: '#FFFFFF',
        border: '1px solid var(--admin-border)',
        borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
        boxSizing: 'border-box'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontFamily: "'Manrope', sans-serif"
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#F8FAFC', // Slate-50 background header
              borderBottom: '1px solid var(--admin-border)'
            }}
          >
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: '12px var(--admin-space-4)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--admin-text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <TestimonialRow 
              key={t.id} 
              testimonial={t} 
              onView={() => onViewTestimonial?.(t)} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestimonialsTable;
