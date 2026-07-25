/* src/services/productService.ts */
import { supabase } from './supabase/client';
import { Product } from '../types/Product';
import productsData from '../data/products.json';

export const productService = {
  /**
   * Fetches published products from Supabase with caching and file mappings.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[public productService] Query failed, using local cache:', error.message);
        return this.getLocalCache();
      }

      return (data || []).map(this.mapSupabaseToProduct);
    } catch (err: any) {
      console.warn('[public productService] Query caught error, using local cache:', err);
      return this.getLocalCache();
    }
  },

  /**
   * Resolves the featured product item.
   */
  async getFeaturedProduct(): Promise<Product | null> {
    const list = await this.getProducts();
    return list.find(p => p.featured) || list[0] || null;
  },

  /**
   * Local Cache Fallback logic.
   */
  getLocalCache(): Product[] {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem('admin_tools_products_cache');
      if (cached) {
        try {
          const list: any[] = JSON.parse(cached);
          // Map each admin schema to public Product schema
          return list
            .filter(p => p.status === 'published')
            .map(this.mapAdminToPublicProject);
        } catch (e) {
          console.warn('[public productService] Failed to parse cached products:', e);
        }
      }
    }
    // Temporary reference data – remove after real content is added.
    // Final fallback to JSON file data
    const raw = productsData as any[];
    return raw.map(this.mapJsonToProject);
  },

  /**
   * Helper to map Supabase database record to public Product type.
   */
  mapSupabaseToProduct(raw: any): Product {
    const features: string[] = (raw.product_capabilities || []).map((c: any) => c.title);
    const technologies: string[] = (raw.product_technologies || []).map((t: any) => t.name);

    return {
      id: raw.id,
      title: raw.title,
      description: raw.description || '',
      type: raw.type,
      version: raw.version,
      category: raw.category,
      coverImage: raw.cover_image_url || raw.preview_image_url || '',
      previewImage: raw.preview_image_url || undefined,
      technologies,
      rating: Number(raw.rating) || 5.0,
      downloads: raw.downloads || 0,
      views: raw.views || 0,
      updatedAt: raw.updated_at || raw.created_at || new Date().toISOString(),
      marketplaceUrl: raw.marketplace_url || null,
      githubUrl: raw.github_url || null,
      docsUrl: raw.docs_url || null,
      demoUrl: raw.demo_url || null,
      featured: raw.is_featured || false,
      comingSoon: raw.is_coming_soon || false,
      features,
      problemSolved: raw.problem_solved || null
    };
  },

  /**
   * Helper to map Admin model to public Product type.
   */
  mapAdminToPublicProject(admin: any): Product {
    const features: string[] = (admin.capabilities || []).map((c: any) => c.title);

    return {
      id: admin.id,
      title: admin.title,
      description: admin.description || '',
      type: admin.type,
      version: admin.version,
      category: admin.category,
      coverImage: admin.coverImageUrl || admin.previewImageUrl || '',
      previewImage: admin.previewImageUrl || undefined,
      technologies: admin.technologies || [],
      rating: admin.rating || 5.0,
      downloads: admin.downloads || 0,
      views: admin.views || 0,
      updatedAt: admin.updatedAt || new Date().toISOString(),
      marketplaceUrl: admin.marketplaceUrl || null,
      githubUrl: admin.githubUrl || null,
      docsUrl: admin.docsUrl || null,
      demoUrl: admin.demoUrl || null,
      featured: admin.isFeatured || false,
      comingSoon: admin.isComingSoon || false,
      features,
      problemSolved: admin.problemSolved || null
    };
  },

  /**
   * Helper to map raw JSON objects to Product type.
   */
  mapJsonToProject(item: any): Product {
    return {
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'Widget',
      version: item.version || '1.0.0',
      category: item.category || 'General',
      coverImage: item.coverImage || item.previewImage || '',
      previewImage: item.previewImage || undefined,
      technologies: item.technologies || [],
      rating: item.rating || 5.0,
      downloads: item.downloads || 0,
      views: item.views || 0,
      updatedAt: item.updatedAt || new Date().toISOString(),
      marketplaceUrl: item.marketplaceUrl || null,
      githubUrl: item.githubUrl || null,
      docsUrl: item.docsUrl || null,
      demoUrl: item.demoUrl || null,
      featured: item.featured || false,
      comingSoon: item.comingSoon || false,
      features: item.features || [],
      problemSolved: item.problemSolved || null
    };
  }
};

export default productService;
