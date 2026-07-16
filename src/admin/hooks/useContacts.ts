import { useState, useEffect, useMemo, useCallback } from 'react';
import { ContactSubmission } from '../types/contact';
import { contactService } from '../services/contactService';
import { supabase } from '../../services/supabase/client';

export const useContacts = () => {
  // Parse initial query params from URL
  const getInitialParams = () => {
    if (typeof window === 'undefined') {
      return { search: '', status: 'all', sort: 'newest' as const, page: 1, pageSize: 8 };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      status: params.get('status') || 'all',
      sort: (params.get('sort') as 'newest' | 'oldest') || 'newest',
      page: parseInt(params.get('page') || '1', 10),
      pageSize: parseInt(params.get('pageSize') || '8', 10)
    };
  };

  const initialParams = getInitialParams();

  // Component States
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Stats aggregate states
  const [statsData, setStatsData] = useState({ total: 0, open: 0, pending: 0, replied: 0 });

  // Filter States
  const [searchInput, setSearchInput] = useState<string>(initialParams.search);
  const [searchQuery, setSearchQuery] = useState<string>(initialParams.search);
  const [statusFilter, setStatusFilter] = useState<string>(initialParams.status);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>(initialParams.sort);
  const [currentPage, setCurrentPage] = useState<number>(initialParams.page);
  const [pageSize, setPageSize] = useState<number>(initialParams.pageSize);

  // 1. Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset page on query search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page when filter/sort attributes modify
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy, pageSize]);

  // 2. Sync URL Search Params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (pageSize !== 8) params.set('pageSize', String(pageSize));

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, statusFilter, sortBy, currentPage, pageSize]);

  // 3. Fetch Data & Stats from Supabase
  const loadSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Parallel queries: Fetch paginated data + overall stats aggregates
      const [submissionsResponse, statsResponse] = await Promise.all([
        contactService.getSubmissions({
          search: searchQuery,
          status: statusFilter,
          sortBy,
          page: currentPage,
          pageSize
        }),
        (supabase as any).from('contact_messages').select('status')
      ]);

      setSubmissions(submissionsResponse.data);
      setTotalCount(submissionsResponse.count);

      // Aggregate stats in memory (highly efficient - loads status string only)
      if (statsResponse.data) {
        const rows = statsResponse.data as { status: string }[];
        const total = rows.length;
        const open = rows.filter(r => !r.status || r.status.toLowerCase() === 'open' || r.status.toLowerCase() === 'new').length;
        const pending = rows.filter(r => r.status && r.status.toLowerCase() === 'reply_pending').length;
        const replied = rows.filter(r => r.status && r.status.toLowerCase() === 'replied').length;
        setStatsData({ total, open, pending, replied });
      }
    } catch (err: any) {
      console.error('[useContacts] Error loading contacts:', err);
      setError(err?.message || 'Failed to load contact submissions.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, currentPage, pageSize]);

  // Fetch on state variations
  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Calculate pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  // Calculate Stats
  const stats = useMemo(() => {
    return {
      total: statsData.total,
      open: statsData.open,
      pending: statsData.pending,
      replied: statsData.replied,
      awaitingReply: statsData.open + statsData.pending
    };
  }, [statsData]);

  // Reset helper method
  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return {
    submissions,
    allFilteredCount: totalCount,
    stats,
    isLoading,
    error,
    searchInput,
    setSearchInput,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    refresh: loadSubmissions,
    clearFilters
  };
};

export default useContacts;
