import React, { useState } from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import { TestimonialsHeader } from './components/TestimonialsHeader';
import { TestimonialsSummaryCards } from './components/TestimonialsSummaryCards';
import { TestimonialsToolbar } from './components/TestimonialsToolbar';
import { TestimonialsTable } from './components/TestimonialsTable';
import { TestimonialDetailsDrawer } from './components/TestimonialDetailsDrawer';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { Testimonial } from '../../types/testimonial';

export const TestimonialsPage: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  const {
    testimonials,
    loading,
    error,
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
    setPageSize,
    
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonial,
    refresh
  } = useTestimonials();

  // Dynamic pagination details
  const showingStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingEnd = Math.min(totalCount, page * pageSize);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);

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
          disabled={loading}
        />
        
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div
            style={{
              padding: 'var(--admin-space-8) var(--admin-space-4)',
              background: '#FFFFFF',
              border: '1px solid var(--admin-border)',
              borderRadius: '0 0 var(--admin-radius-md) var(--admin-radius-md)',
              textAlign: 'center',
              boxSizing: 'border-box',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <p style={{ color: 'var(--admin-danger, #EF4444)', fontWeight: 600, fontSize: '14px', margin: '0 0 12px 0' }}>
              Error loading testimonials: {error}
            </p>
            <button
              onClick={() => refresh()}
              style={{
                padding: '8px 16px',
                background: 'var(--admin-primary, #7C3AED)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Retry
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <EmptyState
            title="No Testimonials Found"
            description="There are no testimonials matching your filter criteria."
            onClear={() => {
              setSearch('');
              setStatus('all');
              setRating('all');
              setSortBy('newest');
              setPage(1);
            }}
          />
        ) : (
          <TestimonialsTable 
            testimonials={testimonials} 
            onViewTestimonial={setSelectedTestimonial}
          />
        )}
        
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
              disabled={page === 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: (page === 1 || loading) ? '#D1D5DB' : 'var(--admin-text)',
                cursor: (page === 1 || loading) ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              Previous
            </button>

            {pageNumbers.map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                disabled={loading}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: page === pNum ? 'none' : '1px solid var(--admin-border)',
                  backgroundColor: page === pNum ? 'var(--admin-primary)' : '#FFFFFF',
                  color: page === pNum ? '#FFFFFF' : 'var(--admin-text)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              style={{
                padding: '6px 12px',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: (page === totalPages || loading) ? '#D1D5DB' : 'var(--admin-text)',
                cursor: (page === totalPages || loading) ? 'not-allowed' : 'pointer',
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

      {/* 5. Details popup drawer */}
      <TestimonialDetailsDrawer
        isOpen={selectedTestimonial !== null}
        testimonialId={selectedTestimonial?.id || null}
        onClose={() => setSelectedTestimonial(null)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TestimonialsPage;
