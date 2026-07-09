import React from 'react';

interface TestimonialRow {
  id: number;
  initials: string;
  name: string;
  rating: number;
  review: string;
  status: 'approved' | 'pending';
  avatarColor: string;
}

export const TestimonialCard: React.FC = () => {
  const testimonials: TestimonialRow[] = [
    {
      id: 1,
      initials: 'SR',
      name: 'Sarah Connor',
      rating: 5,
      review: 'Ashok delivered a beautiful, modular Mendix UI widget set. Highly recommended!',
      status: 'approved',
      avatarColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      id: 2,
      initials: 'DW',
      name: 'David Wright',
      rating: 5,
      review: 'Incredibly neat React work. Excellent design sense and code consistency.',
      status: 'approved',
      avatarColor: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
    },
    {
      id: 3,
      initials: 'JL',
      name: 'Jessica Lopez',
      rating: 4,
      review: 'Very professional portfolio admin panel. Clean transitions and layouts.',
      status: 'pending',
      avatarColor: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    },
    {
      id: 4,
      initials: 'LM',
      name: 'Lucas Miller',
      rating: 5,
      review: 'Exceptional UX advice! Transformed our application look and feel.',
      status: 'approved',
      avatarColor: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    },
    {
      id: 5,
      initials: 'PT',
      name: 'Patricia Taylor',
      rating: 4,
      review: 'The design systems Ashok builds are robust, clean, and easily scalable.',
      status: 'pending',
      avatarColor: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
    },
  ];

  return (
    <div className="testimonial-card">
      <div className="testimonial-card-header">
        <h3 className="testimonial-card-title">Recent Testimonials</h3>
      </div>
      <div className="testimonial-card-body">
        <div className="testimonial-list">
          {testimonials.map((test) => (
            <div key={test.id} className="testimonial-row">
              <div className="testimonial-avatar" style={{ background: test.avatarColor }}>
                {test.initials}
              </div>
              <div className="testimonial-content">
                <div className="testimonial-meta">
                  <span className="testimonial-name">{test.name}</span>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill={i < test.rating ? '#ffb300' : 'rgba(255,255,255,0.1)'}
                        stroke={i < test.rating ? '#ffb300' : 'rgba(255,255,255,0.2)'}
                        strokeWidth="1.5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="testimonial-review">"{test.review}"</p>
              </div>
              <div className="testimonial-status">
                <span className={`status-badge ${test.status}`}>
                  {test.status === 'approved' ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
