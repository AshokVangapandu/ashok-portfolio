/* src/admin/hooks/useTestimonials.ts */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Testimonial } from '../types/testimonial';
import { testimonialService, TestimonialsQueryOptions } from '../services/testimonialService';
import { supabase } from '../../services/supabase/client';
import { useAuth } from '../../hooks/useAuth';

export const useTestimonials = () => {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    trends: { total: '+0', pending: '+0', approved: '+0', rejected: '+0' }
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
    setError(null);
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
      setTotalCount(result.totalCount);
      
      const sumResult = await testimonialService.getSummary();
      setSummary(sumResult);
    } catch (err: any) {
      console.error('[useTestimonials] Fetch error:', err);
      setError(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [search, status, rating, sortBy, page, pageSize]);

  const fetchRef = useRef(fetchTestimonials);
  fetchRef.current = fetchTestimonials;

  // 1. Refresh when query parameters change
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // 2. Refresh when user auth status changes or is verified
  useEffect(() => {
    fetchRef.current();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchRef.current();
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [user]);

  // 3. Persistent Realtime subscription & window focus handlers
  useEffect(() => {
    const channel = supabase
      .channel('admin-testimonials-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        () => {
          fetchRef.current();
        }
      )
      .subscribe();

    const handleFocus = () => {
      fetchRef.current();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const approveTestimonial = useCallback(async (id: string) => {
    setError(null);
    try {
      await testimonialService.approveTestimonial(id);
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      console.error('[useTestimonials] Approve error:', err);
      setError(err.message || 'Failed to approve testimonial');
      return false;
    }
  }, [fetchTestimonials]);

  const rejectTestimonial = useCallback(async (id: string) => {
    setError(null);
    try {
      await testimonialService.rejectTestimonial(id);
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      console.error('[useTestimonials] Reject error:', err);
      setError(err.message || 'Failed to reject testimonial');
      return false;
    }
  }, [fetchTestimonials]);

  const deleteTestimonial = useCallback(async (id: string) => {
    setError(null);
    try {
      await testimonialService.deleteTestimonial(id);
      if (testimonials.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTestimonials();
      }
      return true;
    } catch (err: any) {
      console.error('[useTestimonials] Delete error:', err);
      setError(err.message || 'Failed to delete testimonial');
      return false;
    }
  }, [fetchTestimonials, testimonials.length, page]);

  return {
    testimonials,
    loading,
    error,
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
    
    // Mutation actions
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonial,
    refresh: fetchTestimonials
  };
};

export default useTestimonials;
