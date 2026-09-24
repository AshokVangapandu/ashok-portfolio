/* src/admin/hooks/useResumeDownloads.ts */
import { useState, useEffect, useCallback, useRef } from 'react';
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

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = (supabase as any)
        .from('resume_downloads')
        .select('*, resume_settings(version)', { count: 'exact' });

      // 1. Search Query filter (checks visitor_id, name, email, country, city, browser, etc.)
      if (search.trim()) {
        const q = `%${search.trim()}%`;
        const orClauses = [
          `visitor_id.ilike.${q}`,
          `country.ilike.${q}`,
          `city.ilike.${q}`,
          `browser.ilike.${q}`,
          `operating_system.ilike.${q}`,
          `device_type.ilike.${q}`,
          `page_source.ilike.${q}`,
          `referrer.ilike.${q}`
        ];

        // Check for matching visitor_profiles by name or email
        try {
          const { data: matchedProfiles } = await (supabase as any)
            .from('visitor_profiles')
            .select('visitor_id')
            .or(`full_name.ilike.${q},email.ilike.${q}`);

          if (matchedProfiles && matchedProfiles.length > 0) {
            const matchedIds = matchedProfiles.map((p: any) => p.visitor_id).filter(Boolean);
            if (matchedIds.length > 0) {
              orClauses.push(`visitor_id.in.(${matchedIds.map((id: string) => `"${id}"`).join(',')})`);
            }
          }
        } catch (_) {
          // Continue with standard filter if profile lookup fails
        }

        query = query.or(orClauses.join(','));
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

      // 3. Range Pagination limits
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end).order('downloaded_at', { ascending: false });

      const { data, count, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      const rawDownloads = data || [];
      const visitorIds = Array.from(new Set(rawDownloads.map((d: any) => d.visitor_id).filter(Boolean)));
      const sessionIds = Array.from(new Set(rawDownloads.map((d: any) => d.session_id).filter(Boolean)));

      const profilesMap = new Map<string, { full_name?: string | null; email?: string | null; avatar_url?: string | null }>();
      if (visitorIds.length > 0) {
        try {
          const { data: profiles, error: profErr } = await (supabase as any)
            .from('visitor_profiles')
            .select('visitor_id, full_name, email, avatar_url')
            .in('visitor_id', visitorIds);

          if (!profErr && profiles) {
            profiles.forEach((p: any) => {
              profilesMap.set(p.visitor_id, p);
            });
          }
        } catch (profCatchErr) {
          console.warn('[useResumeDownloads] Failed to fetch visitor profiles:', profCatchErr);
        }
      }

      const sessionsMap = new Map<string, { id: string; duration_seconds?: number | null; created_at?: string | null }>();
      if (sessionIds.length > 0) {
        try {
          const { data: sessions, error: sessErr } = await (supabase as any)
            .from('visitor_sessions')
            .select('id, duration_seconds, created_at')
            .in('id', sessionIds);

          if (!sessErr && sessions) {
            sessions.forEach((s: any) => {
              sessionsMap.set(s.id, s);
            });
          }
        } catch (sessCatchErr) {
          console.warn('[useResumeDownloads] Failed to fetch visitor sessions:', sessCatchErr);
        }
      }

      const enrichedDownloads = rawDownloads.map((d: any) => ({
        ...d,
        visitor_profiles: d.visitor_profiles || profilesMap.get(d.visitor_id) || null,
        visitor_sessions: d.visitor_sessions || sessionsMap.get(d.session_id) || null
      }));

      setDownloads(enrichedDownloads.map(mapSupabaseToResumeDownload));
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('[useResumeDownloads] Fetch error:', err);
      setError(err.message || 'Failed to fetch resume downloads.');
    } finally {
      setLoading(false);
    }
  }, [search, dateRange, page, pageSize]);

  // Trigger download list CSV export
  const exportCSV = async () => {
    try {
      let query = (supabase as any)
        .from('resume_downloads')
        .select('*, resume_settings(version)');

      if (search.trim()) {
        const q = `%${search.trim()}%`;
        const orClauses = [
          `visitor_id.ilike.${q}`,
          `country.ilike.${q}`,
          `city.ilike.${q}`,
          `browser.ilike.${q}`,
          `operating_system.ilike.${q}`,
          `device_type.ilike.${q}`,
          `page_source.ilike.${q}`,
          `referrer.ilike.${q}`
        ];

        try {
          const { data: matchedProfiles } = await (supabase as any)
            .from('visitor_profiles')
            .select('visitor_id')
            .or(`full_name.ilike.${q},email.ilike.${q}`);

          if (matchedProfiles && matchedProfiles.length > 0) {
            const matchedIds = matchedProfiles.map((p: any) => p.visitor_id).filter(Boolean);
            if (matchedIds.length > 0) {
              orClauses.push(`visitor_id.in.(${matchedIds.map((id: string) => `"${id}"`).join(',')})`);
            }
          }
        } catch (_) {}

        query = query.or(orClauses.join(','));
      }

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

      const { data, error: queryErr } = await query.order('downloaded_at', { ascending: false });
      if (queryErr) throw queryErr;

      const rawDownloads = data || [];
      const visitorIds = Array.from(new Set(rawDownloads.map((d: any) => d.visitor_id).filter(Boolean)));
      const sessionIds = Array.from(new Set(rawDownloads.map((d: any) => d.session_id).filter(Boolean)));

      const profilesMap = new Map<string, { full_name?: string | null; email?: string | null; avatar_url?: string | null }>();
      if (visitorIds.length > 0) {
        try {
          const { data: profiles, error: profErr } = await (supabase as any)
            .from('visitor_profiles')
            .select('visitor_id, full_name, email, avatar_url')
            .in('visitor_id', visitorIds);

          if (!profErr && profiles) {
            profiles.forEach((p: any) => {
              profilesMap.set(p.visitor_id, p);
            });
          }
        } catch (profCatchErr) {
          console.warn('[useResumeDownloads] Export CSV: Failed to fetch visitor profiles:', profCatchErr);
        }
      }

      const sessionsMap = new Map<string, { id: string; duration_seconds?: number | null; created_at?: string | null }>();
      if (sessionIds.length > 0) {
        try {
          const { data: sessions, error: sessErr } = await (supabase as any)
            .from('visitor_sessions')
            .select('id, duration_seconds, created_at')
            .in('id', sessionIds);

          if (!sessErr && sessions) {
            sessions.forEach((s: any) => {
              sessionsMap.set(s.id, s);
            });
          }
        } catch (sessCatchErr) {
          console.warn('[useResumeDownloads] Export CSV: Failed to fetch visitor sessions:', sessCatchErr);
        }
      }

      const enrichedDownloads = rawDownloads.map((d: any) => ({
        ...d,
        visitor_profiles: d.visitor_profiles || profilesMap.get(d.visitor_id) || null,
        visitor_sessions: d.visitor_sessions || sessionsMap.get(d.session_id) || null
      }));

      const mapped = enrichedDownloads.map(mapSupabaseToResumeDownload);
      
      const headers = [
        'Date & Time',
        'Visitor Name',
        'Visitor Email',
        'Visitor ID',
        'Country',
        'City',
        'Device',
        'Browser',
        'OS',
        'Source',
        'Duration',
        'IP Address',
        'Status'
      ];

      const rows = mapped.map((d: ResumeDownload) => [
        d.dateTime,
        d.visitorName,
        d.visitorEmail || '',
        d.visitorId || '',
        d.country,
        d.city,
        d.device,
        d.browser,
        d.os,
        d.source,
        d.duration,
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

  const fetchDownloadsRef = useRef(fetchDownloads);
  fetchDownloadsRef.current = fetchDownloads;

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  // Refresh on auth session change
  useEffect(() => {
    fetchDownloadsRef.current();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchDownloadsRef.current();
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

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
