/* src/admin/services/toolsProductsService.ts */
import { supabase } from '../../services/supabase/client';
import { ToolsProduct, SupabaseToolsProduct, mapSupabaseToToolsProduct, ProductCapability } from '../types/toolsProducts';
import productsData from '../../data/products.json';

const CACHE_KEY = 'admin_tools_products_cache';

export const toolsProductsService = {
  /**
   * Retrieves all tools & products from Supabase with local fallback.
   */
  async getToolsProducts(): Promise<ToolsProduct[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[toolsProductsService] Supabase query failed, using local cache:', error.message);
        return this.getLocalCache();
      }

      const mapped = ((data as any) as SupabaseToolsProduct[] || []).map(mapSupabaseToToolsProduct);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    } catch (err: any) {
      console.warn('[toolsProductsService] Query caught error, using local cache:', err);
      return this.getLocalCache();
    }
  },

  /**
   * Creates a new tools product with relational capabilities & technologies.
   */
  async createToolsProduct(product: ToolsProduct): Promise<ToolsProduct> {
    try {
      // 1. Insert product details
      const { data, error } = await (supabase as any)
        .from('tools_products')
        .insert([
          {
            title: product.title,
            description: product.description,
            type: product.type,
            version: product.version,
            category: product.category,
            cover_image_url: product.coverImageUrl,
            preview_image_url: product.previewImageUrl,
            rating: product.rating,
            downloads: product.downloads,
            views: product.views,
            marketplace_url: product.marketplaceUrl,
            github_url: product.githubUrl,
            docs_url: product.docsUrl,
            demo_url: product.demoUrl,
            is_featured: product.isFeatured,
            is_coming_soon: product.isComingSoon,
            problem_solved: product.problemSolved,
            status: product.status
          }
        ])
        .select()
        .single();

      if (error) throw error;
      const insertedProduct = mapSupabaseToToolsProduct(data);

      // If this product is featured, unset any other featured products
      if (product.isFeatured) {
        await (supabase as any)
          .from('tools_products')
          .update({ is_featured: false })
          .neq('id', insertedProduct.id);
      }

      // 2. Insert capabilities
      if (product.capabilities.length > 0) {
        const caps = product.capabilities.map((c, idx) => ({
          product_id: insertedProduct.id,
          title: c.title,
          description: c.description,
          icon: c.icon,
          display_order: idx
        }));
        await (supabase as any).from('product_capabilities').insert(caps);
      }

      // 3. Insert technologies
      if (product.technologies.length > 0) {
        const techs = product.technologies.map((t, idx) => ({
          product_id: insertedProduct.id,
          name: t,
          display_order: idx
        }));
        await (supabase as any).from('product_technologies').insert(techs);
      }

      // Retrieve full record with joins
      const { data: finalRecord } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('id', insertedProduct.id)
        .single();

      const mapped = mapSupabaseToToolsProduct(finalRecord);
      this.addToLocalCache(mapped);
      return mapped;
    } catch (err: any) {
      console.warn('[toolsProductsService] Supabase create failed, saving to local cache:', err.message);
      this.addToLocalCache(product);
      return product;
    }
  },

  /**
   * Updates an existing tools product and its repeater rows.
   */
  async updateToolsProduct(id: string, updates: ToolsProduct): Promise<ToolsProduct> {
    try {
      // 1. Update product info
      const { error } = await (supabase as any)
        .from('tools_products')
        .update({
          title: updates.title,
          description: updates.description,
          type: updates.type,
          version: updates.version,
          category: updates.category,
          cover_image_url: updates.coverImageUrl,
          preview_image_url: updates.previewImageUrl,
          rating: updates.rating,
          downloads: updates.downloads,
          views: updates.views,
          marketplace_url: updates.marketplaceUrl,
          github_url: updates.githubUrl,
          docs_url: updates.docsUrl,
          demo_url: updates.demoUrl,
          is_featured: updates.isFeatured,
          is_coming_soon: updates.isComingSoon,
          problem_solved: updates.problemSolved,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // If this product is featured, unset any other featured products
      if (updates.isFeatured) {
        await (supabase as any)
          .from('tools_products')
          .update({ is_featured: false })
          .neq('id', id);
      }

      // 2. Cascade delete existing caps and techs
      await (supabase as any).from('product_capabilities').delete().eq('product_id', id);
      await (supabase as any).from('product_technologies').delete().eq('product_id', id);

      // 3. Re-insert new caps
      if (updates.capabilities.length > 0) {
        const caps = updates.capabilities.map((c, idx) => ({
          product_id: id,
          title: c.title,
          description: c.description,
          icon: c.icon,
          display_order: idx
        }));
        await (supabase as any).from('product_capabilities').insert(caps);
      }

      // 4. Re-insert new techs
      if (updates.technologies.length > 0) {
        const techs = updates.technologies.map((t, idx) => ({
          product_id: id,
          name: t,
          display_order: idx
        }));
        await (supabase as any).from('product_technologies').insert(techs);
      }

      // Retrieve full updated record
      const { data: finalRecord } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('id', id)
        .single();

      const mapped = mapSupabaseToToolsProduct(finalRecord);
      this.updateLocalCache(id, mapped);
      return mapped;
    } catch (err: any) {
      console.warn('[toolsProductsService] Supabase update failed, saving to local cache:', err.message);
      this.updateLocalCache(id, updates);
      return updates;
    }
  },

  /**
   * Deletes a tools product.
   */
  async deleteToolsProduct(id: string): Promise<boolean> {
    try {
      // Find asset paths for storage cleanup
      const { data: prod } = await (supabase as any)
        .from('tools_products')
        .select('cover_image_url, preview_image_url')
        .eq('id', id)
        .single();

      const coverPath = prod?.cover_image_url ? prod.cover_image_url.split('/storage/v1/object/public/tools-products/')[1] : null;
      const previewPath = prod?.preview_image_url ? prod.preview_image_url.split('/storage/v1/object/public/tools-products/')[1] : null;

      const { error } = await (supabase as any)
        .from('tools_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete storage files
      const pathsToDelete = [coverPath, previewPath].filter(Boolean) as string[];
      if (pathsToDelete.length > 0) {
        await supabase.storage.from('tools-products').remove(pathsToDelete);
      }

      this.removeFromLocalCache(id);
      return true;
    } catch (err: any) {
      console.warn('[toolsProductsService] Supabase delete failed, removing from cache:', err.message);
      this.removeFromLocalCache(id);
      return true;
    }
  },

  /**
   * Upload asset to storage.
   */
  async uploadAsset(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('tools-products')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('[toolsProductsService.uploadAsset] Error uploading:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('tools-products')
      .getPublicUrl(path);

    return publicUrl;
  },

  // --- Local Cache Helpers ---
  getLocalCache(): ToolsProduct[] {
    if (typeof localStorage === 'undefined') {
      return this.getLocalMockProducts();
    }
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    const mocks = this.getLocalMockProducts();
    localStorage.setItem(CACHE_KEY, JSON.stringify(mocks));
    return mocks;
  },

  addToLocalCache(product: ToolsProduct) {
    const cache = this.getLocalCache();
    cache.unshift(product);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  },

  updateLocalCache(id: string, updates: ToolsProduct) {
    const cache = this.getLocalCache();
    const idx = cache.findIndex(p => p.id === id);
    if (idx !== -1) {
      cache[idx] = { ...cache[idx], ...updates, id };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      }
    }
  },

  removeFromLocalCache(id: string) {
    const cache = this.getLocalCache();
    const filtered = cache.filter(p => p.id !== id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    }
  },

  getLocalMockProducts(): ToolsProduct[] {
    const rawData = productsData as any[];
    return rawData.map((item, idx) => {
      // Map features arrays to capabilities formats
      const capabilities: ProductCapability[] = (item.features || []).map((f: string, fIdx: number) => ({
        title: f,
        description: `Capability ${fIdx + 1} details.`,
        icon: 'check-circle'
      }));

      return {
        id: item.id || `mock-${idx}`,
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'Widget',
        version: item.version || '1.0.0',
        category: item.category || 'General',
        coverImageUrl: item.coverImage || null,
        previewImageUrl: item.previewImage || null,
        rating: item.rating || 5,
        downloads: item.downloads || 0,
        views: item.views || 0,
        updatedAt: item.updatedAt || new Date().toISOString(),
        marketplaceUrl: item.marketplaceUrl || null,
        githubUrl: item.githubUrl || null,
        docsUrl: item.docsUrl || null,
        demoUrl: item.demoUrl || null,
        isFeatured: item.featured || false,
        isComingSoon: item.comingSoon || false,
        problemSolved: item.problemSolved || null,
        status: (idx % 3 === 0) ? 'draft' : 'published',
        capabilities,
        technologies: item.technologies || [],
        features: item.features || []
      };
    });
  }
};

export default toolsProductsService;
