/* src/admin/services/resumeDownloadService.ts */
import { ResumeDownload } from '../types/resumeDownload';
import { MOCK_RESUME_DOWNLOADS, MOCK_SUMMARY } from './resumeDownloads.mock';

export interface ResumeDownloadsQueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

export const resumeDownloadService = {
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
