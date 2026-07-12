/* src/admin/hooks/useResumeDownloads.ts */
import { useState, useEffect, useCallback } from 'react';
import { ResumeDownload } from '../types/resumeDownload';
import { resumeDownloadService, ResumeDownloadsQueryOptions } from '../services/resumeDownloadService';

export const useResumeDownloads = () => {
  const [downloads, setDownloads] = useState<ResumeDownload[]>([]);
  const [totalCount, setTotalCount] = useState<number>(386);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchDownloads = useCallback(async () => {
    setLoading(true);
    try {
      const options: ResumeDownloadsQueryOptions = {
        search,
        page,
        pageSize
      };
      
      const result = await resumeDownloadService.getDownloads(options);
      setDownloads(result.data);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('[useResumeDownloads] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  return {
    downloads,
    loading,
    totalCount,
    
    // States and setters
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    
    refresh: fetchDownloads
  };
};

export default useResumeDownloads;
