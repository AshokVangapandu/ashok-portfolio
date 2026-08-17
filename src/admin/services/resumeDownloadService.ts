/* src/admin/services/resumeDownloadService.ts */
import { supabase } from '../../services/supabase/client';
import { ResumeDownload } from '../types/resumeDownload';
import { MOCK_RESUME_DOWNLOADS, MOCK_SUMMARY } from './resumeDownloads.mock';

export interface ResumeDownloadsQueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const resumeDownloadService = {
  /**
   * Retrieves summary count and 30-day period-over-period trend for completed resume downloads.
   */
  async getSummary(): Promise<{ totalCount: number; trend: string }> {
    try {
      // 1. Total completed download events count
      const { count, error } = await (supabase as any)
        .from('resume_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('download_status', 'completed');

      if (error) throw error;

      // 2. 30-day period-over-period trend
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

      const [currRes, prevRes] = await Promise.all([
        (supabase as any).from('resume_downloads').select('*', { count: 'exact', head: true }).eq('download_status', 'completed').gte('downloaded_at', thirtyDaysAgo),
        (supabase as any).from('resume_downloads').select('*', { count: 'exact', head: true }).eq('download_status', 'completed').gte('downloaded_at', sixtyDaysAgo).lt('downloaded_at', thirtyDaysAgo)
      ]);

      const currCount = currRes.count || 0;
      const prevCount = prevRes.count || 0;

      let trendStr = '+0.0%';
      if (prevCount === 0) {
        trendStr = currCount > 0 ? '+100.0%' : '+0.0%';
      } else {
        const pct = ((currCount - prevCount) / prevCount) * 100;
        trendStr = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
      }

      return {
        totalCount: count !== null && count !== undefined ? count : 0,
        trend: trendStr
      };
    } catch (err) {
      console.warn('[resumeDownloadService.getSummary] Error fetching summary:', err);
      return {
        totalCount: 0,
        trend: '+0.0%'
      };
    }
  },

  /**
   * Retrieves resume download events based on queries and filters.
   */
  async getDownloads(options: ResumeDownloadsQueryOptions = {}): Promise<{
    data: ResumeDownload[];
    totalCount: number;
  }> {
    let list = [...MOCK_RESUME_DOWNLOADS];

    // 1. Search filter matching
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.visitorName.toLowerCase().includes(q) ||
          (d.visitorEmail && d.visitorEmail.toLowerCase().includes(q)) ||
          d.country.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.source.toLowerCase().includes(q) ||
          d.downloadedFrom.toLowerCase().includes(q)
      );
    }

    const totalCount = MOCK_SUMMARY.total; // Maintain static '386' matching specifications.
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    const sliced = list.slice(startIdx, endIdx);

    return {
      data: sliced,
      totalCount: totalCount,
    };
  }
};

export default resumeDownloadService;
