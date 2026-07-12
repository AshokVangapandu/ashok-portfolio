/* src/admin/pages/testimonials/components/TestimonialRow.tsx */
import React from 'react';
import { Testimonial } from '../../../types/testimonial';
import { RatingStars } from './RatingStars';
import { StatusBadge } from './StatusBadge';
import { ActionButtons } from './ActionButtons';

interface TestimonialRowProps {
  testimonial: Testimonial;
  onView?: () => void;
}

export const TestimonialRow: React.FC<TestimonialRowProps> = ({ testimonial, onView }) => {
  return (
    <tr
      style={{
        borderBottom: '1px solid var(--admin-border)',
        transition: 'background-color 0.15s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {/* 1. Visitor Column (Avatar + Name) */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={testimonial.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            alt={testimonial.name}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid var(--admin-border)'
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: '13.5px',
              color: 'var(--admin-text)',
              whiteSpace: 'nowrap'
            }}
          >
            {testimonial.name}
          </span>
        </div>
      </td>

      {/* 2. Company / Role Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--admin-text)'
            }}
          >
            {testimonial.company}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--admin-text-secondary)',
              fontWeight: 500
            }}
          >
            {testimonial.role}
          </span>
        </div>
      </td>

      {/* 3. Rating Stars Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <RatingStars rating={testimonial.rating} />
      </td>

      {/* 4. Preview Text Column (Truncate after two lines with ellipses) */}
      <td style={{ padding: '16px var(--admin-space-4)', maxWidth: '280px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: '1.45',
            color: 'var(--admin-text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {testimonial.preview}
        </p>
      </td>

      {/* 5. Country Column */}
      <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
        {testimonial.country}
      </td>

      {/* 6. Date Column */}
      <td style={{ padding: '16px var(--admin-space-4)', color: 'var(--admin-text-secondary)', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {testimonial.date}
      </td>

      {/* 7. Status Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <StatusBadge status={testimonial.status} />
      </td>

      {/* 8. Actions Column */}
      <td style={{ padding: '16px var(--admin-space-4)' }}>
        <ActionButtons onView={onView} />
      </td>
    </tr>
  );
};

export default TestimonialRow;
