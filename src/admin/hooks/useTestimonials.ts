/* src/admin/hooks/useTestimonials.ts */
import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '../types/testimonial';
import { testimonialService, TestimonialsQueryOptions } from '../services/testimonialService';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [totalCount, setTotalCount] = useState<number>(47);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState({
    total: 47,
    pending: 8,
    approved: 35,
    rejected: 4,
    trends: { total: '+3', pending: '+2', approved: '+1', rejected: '0' }
  });

  // Query States
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [rating, setRating] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const options: TestimonialsQueryOptions = {
        search,
        status,
        rating,
        sortBy,
        page,
        pageSize
      };

      const result = await testimonialService.getTestimonials(options);
      setTestimonials(result.data);
      
      const sumResult = await testimonialService.getSummary();
      setSummary(sumResult);
      setTotalCount(sumResult.total);
    } catch (err) {
      console.error('[useTestimonials] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, rating, sortBy, page, pageSize]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    totalCount,
    summary,
    
    // Filters State & Setters
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
    
    refresh: fetchTestimonials
  };
};

export default useTestimonials;
