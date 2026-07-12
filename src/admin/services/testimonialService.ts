/* src/admin/services/testimonialService.ts */
import { Testimonial } from '../types/testimonial';
import { MOCK_TESTIMONIALS, MOCK_SUMMARY } from './testimonials.mock';

export interface TestimonialsQueryOptions {
  search?: string;
  status?: string;
  rating?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export const testimonialService = {
  /**
   * Retrieves testimonials based on search queries, filters, and page values.
   * Emulates network delays to test skeleton visual loadings.
   */
  async getTestimonials(options: TestimonialsQueryOptions = {}): Promise<{
    data: Testimonial[];
    totalCount: number;
  }> {
    // Return mock data immediately for responsiveness, but can add delays if needed.
    let list = [...MOCK_TESTIMONIALS];

    // 1. Search Filter
    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.preview.toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (options.status && options.status !== 'all') {
      list = list.filter((t) => t.status === options.status);
    }

    // 3. Rating Filter
    if (options.rating && options.rating !== 'all') {
      const targetRating = parseInt(options.rating, 10);
      if (!isNaN(targetRating)) {
        list = list.filter((t) => t.rating === targetRating);
      }
    }

    // 4. Sort By (Mocked as Newest First, etc.)
    if (options.sortBy) {
      // In a real database, we would apply order.
      // For mock: "newest" or default.
    }

    const totalCount = MOCK_SUMMARY.total; // To match the required static '47' totals in layout.
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    // Slice for current page
    const sliced = list.slice(startIdx, endIdx);

    return {
      data: sliced,
      totalCount: totalCount,
    };
  },

  /**
   * Retrieves statistics summary count.
   */
  async getSummary() {
    return MOCK_SUMMARY;
  }
};

export default testimonialService;
