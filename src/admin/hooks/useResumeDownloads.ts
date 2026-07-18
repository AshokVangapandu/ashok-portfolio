/* src/admin/hooks/useResumeDownloads.ts */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabase/client';
import { ResumeDownload, mapSupabaseToResumeDownload } from '../types/resumeDownload';

export const useResumeDownloads = () => {
  const [downloads, setDownloads] = useState<ResumeDownload[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Helper to build the query filters based on states
  const buildQuery = useCallback(() => {
    let query = (supabase as any)
      .from('resume_downloads')
      .select('*, resume_settings(version)', { count: 'exact' });

    // 1. Search Query filter (checks visitor_id, country, city, browser, device_type, etc.)
    if (search.trim()) {
      const q = `%${search.trim()}%`;
      query = query.or(`visitor_id.ilike.${q},country.ilike.${q},city.ilike.${q},browser.ilike.${q},operating_system.ilike.${q},device_type.ilike.${q},page_source.ilike.${q},referrer.ilike.${q}`);
    }

    // 2. Date Range filters
    const now = new Date();
    if (dateRange === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      query = query.gte('downloaded_at', todayStart);
    } else if (dateRange === 'yesterday') {
      const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      query = query.gte('downloaded_at', yesterdayStart).lt('downloaded_at', todayStart);
    } else if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('downloaded_at', sevenDaysAgo);
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('downloaded_at', thirtyDaysAgo);
    }

    return query;
  }, [search, dateRange]);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = buildQuery();

      // 3. Range Pagination limits
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end).order('downloaded_at', { ascending: false });

      const { data, count, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      setDownloads((data || []).map(mapSupabaseToResumeDownload));
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('[useResumeDownloads] Fetch error:', err);
      setError(err.message || 'Failed to fetch resume downloads.');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, page, pageSize]);

  // Trigger download list CSV export
  const exportCSV = async () => {
    try {
      // Query ALL matching records ignoring range pagination limits
      const { data, error: queryErr } = await buildQuery().order('downloaded_at', { ascending: false });
      if (queryErr) throw queryErr;

      const mapped = (data || []).map(mapSupabaseToResumeDownload);
      
      const headers = [
        'Date & Time',
        'Visitor ID',
        'Country',
        'City',
        'Device',
        'Browser',
        'OS',
        'Page Source',
        'Referrer',
        'IP Address',
        'Status'
      ];

      const rows = mapped.map((d: ResumeDownload) => [
        d.dateTime,
        d.visitorName,
        d.country,
        d.city,
        d.device,
        d.browser,
        d.os,
        d.downloadedFrom,
        d.source,
        d.ipAddress || '',
        d.status
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((val: any) => `"${(val || '').toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_downloads_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('[useResumeDownloads] Export CSV error:', err);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('error', 'Export Failed', err.message || 'CSV generation failed.', 5000);
      }
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  // Reset page when filter inputs change
  useEffect(() => {
    setPage(1);
  }, [search, dateRange]);

  return {
    downloads,
    loading,
    totalCount,
    error,
    
    // States and setters
    search,
    setSearch,
    dateRange,
    setDateRange,
    page,
    setPage,
    pageSize,
    setPageSize,
    
    refresh: fetchDownloads,
    exportCSV
  };
};

export default useResumeDownloads;
