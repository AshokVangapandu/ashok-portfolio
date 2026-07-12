/* src/admin/pages/testimonials/components/RatingStars.tsx */
import React from 'react';

interface RatingStarsProps {
  rating: number; // 1-5
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, idx) => idx + 1);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {stars.map((star) => {
        const isFilled = star <= rating;
        return (
          <span key={star} style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill={isFilled ? '#F59E0B' : '#E5E7EB'} // Yellow-500 vs Gray-200
              stroke={isFilled ? '#F59E0B' : '#D1D5DB'} // Stroke colors
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
