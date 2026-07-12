import React, { useState } from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { TestimonialsHeader } from './components/TestimonialsHeader';
import { TestimonialsSummaryCards } from './components/TestimonialsSummaryCards';
import { TestimonialsToolbar } from './components/TestimonialsToolbar';
import { TestimonialsTable } from './components/TestimonialsTable';
import { TestimonialDetailsModal } from './components/TestimonialDetailsModal';
import { Testimonial } from '../../types/testimonial';

export const TestimonialsPage: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  const {
    testimonials,
    loading,
    totalCount,
    summary,
    
    // Filters
    search,
    setSearch,
    status,
    setStatus,
    rating,
    setRating,
    sortBy,
    setSortBy,
    page,
    setPage,
    pageSize,
    setPageSize
  } = useTestimonials();

  // Static pagination details
  const showingStart = 1;
  const showingEnd = Math.min(testimonials.length, pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--admin-space-5)' }}>
      {/* 1. Header component */}
      <TestimonialsHeader />

      {/* 2. Summary count cards */}
      <TestimonialsSummaryCards summary={summary} loading={loading} />

      {/* 3. Toolbar and Table content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TestimonialsToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          rating={rating}
          setRating={setRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        <TestimonialsTable 
          testimonials={testimonials} 
          onViewTestimonial={setSelectedTestimonial}
        />
        
        {/* 4. Table Pagination footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--admin-space-4)',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--admin-border)',
            borderTop: 'none',
            borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: 'var(--admin-text-secondary)',
            boxSizing: 'border-box'
          }}
        >
          {/* Bottom Left: Showing stats */}
          <div>
            Showing <strong style={{ color: 'var(--admin-text)' }}>{showingStart}–{showingEnd}</strong> of <strong style={{ color: 'var(--admin-text)' }}>{totalCount}</strong>
          </div>

          {/* Bottom Center: Prev/Next buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: page === 1 ? '#D1D5DB' : 'var(--admin-text)',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              Previous
            </button>

            {[1, 2, 3].map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: page === pNum ? 'none' : '1px solid var(--admin-border)',
                  backgroundColor: page === pNum ? 'var(--admin-primary)' : '#FFFFFF',
                  color: page === pNum ? '#FFFFFF' : 'var(--admin-text)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              disabled={page === 3}
              onClick={() => setPage((prev) => Math.min(3, prev + 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: page === 3 ? '#D1D5DB' : 'var(--admin-text)',
                cursor: page === 3 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              Next
            </button>
          </div>

          {/* Bottom Right: Rows per page selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
              style={{
                padding: '4px 8px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: 'var(--admin-text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Details popup modal */}
      <TestimonialDetailsModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </div>
  );
};

export default TestimonialsPage;
