/* src/services/portfolioStatsService.ts */
import { supabase } from './supabase/client';
import { productService } from './productService';
import { projectService } from './projectService';

export interface PortfolioStats {
  totalProducts: number;
  totalProjects: number;
  totalDownloads: number;
  averageRating: number;
  totalReviews: number;
  featuredProducts: number;
  totalCertifications: number;
  totalWidgets: number;
  totalPlugins: number;
}

let cachedStats: PortfolioStats | null = null;
let pendingPromise: Promise<PortfolioStats> | null = null;

export const portfolioStatsService = {
  /**
   * Aggregates stats across all portfolio tables (products, projects, certifications).
   * Caches results in-memory to prevent redundant API fetches.
   */
  async getPortfolioStatistics(forceRefresh = false): Promise<PortfolioStats> {
    if (cachedStats && !forceRefresh) {
      return cachedStats;
    }

    if (pendingPromise && !forceRefresh) {
      return pendingPromise;
    }

    pendingPromise = (async () => {
      try {
        // Fetch all published products
        const products = await productService.getProducts().catch((err) => {
          console.warn('[portfolioStatsService] Failed to fetch products:', err);
          return [];
        });

        // Fetch all published projects
        const projects = await projectService.getProjects().catch((err) => {
          console.warn('[portfolioStatsService] Failed to fetch projects:', err);
          return [];
        });

        // Fetch certifications count
        let certificationsCount = 0;
        try {
          const { count, error } = await supabase
            .from('certifications')
            .select('*', { count: 'exact', head: true });
          
          if (error) {
            console.warn('[portfolioStatsService] Certifications fetch error:', error);
          } else {
            certificationsCount = count || 0;
          }
        } catch (err) {
          console.warn('[portfolioStatsService] Certifications fetch caught error:', err);
        }

        // 1. Calculate active downloads
        const totalDownloads = products.reduce((acc, p) => {
          const dl = typeof p.downloads === 'string' ? parseInt(p.downloads.replace(/[^0-9]/g, ''), 10) : p.downloads;
          return acc + (Number(dl) || 0);
        }, 0);

        // 2. User satisfaction (average rating)
        const ratedProducts = products.filter(p => p.rating !== undefined && p.rating !== null);
        const averageRating = ratedProducts.length > 0
          ? Number((ratedProducts.reduce((acc, p) => acc + Number(p.rating), 0) / ratedProducts.length).toFixed(2))
          : 0.0;

        // 3. Reviews Count
        // Requirement 3: Count of published products as the reviews count fallback
        const totalReviews = products.length;

        // 4. Counts by type
        const totalWidgets = products.filter(p => p.type?.toLowerCase() === 'widget').length;
        const totalPlugins = products.filter(p => p.type?.toLowerCase() === 'plugin').length;
        const featuredProducts = products.filter(p => p.featured).length;

        const stats: PortfolioStats = {
          totalProducts: products.length,
          totalProjects: projects.length,
          totalDownloads,
          averageRating,
          totalReviews,
          featuredProducts,
          totalCertifications: certificationsCount,
          totalWidgets,
          totalPlugins
        };

        cachedStats = stats;
        return stats;
      } catch (error) {
        console.error('[portfolioStatsService] Error aggregating statistics:', error);
        // Fallback defaults
        return {
          totalProducts: 0,
          totalProjects: 0,
          totalDownloads: 0,
          averageRating: 0.0,
          totalReviews: 0,
          featuredProducts: 0,
          totalCertifications: 0,
          totalWidgets: 0,
          totalPlugins: 0
        };
      } finally {
        pendingPromise = null;
      }
    })();

    return pendingPromise;
  },

  /**
   * Formats large numbers appropriately.
   * Examples:
   * - 950 -> "950"
   * - 1200 -> "1.2K"
   * - 25600 -> "25.6K"
   * - 1400000 -> "1.4M"
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      const formatted = (num / 1000000).toFixed(1);
      return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}M` : `${formatted}M`;
    }
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return formatted.endsWith('.0') ? `${formatted.slice(0, -2)}K` : `${formatted}K`;
    }
    return String(num);
  }
};
