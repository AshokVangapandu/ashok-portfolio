/* src/admin/services/toolsProductsService.ts */
import { supabase } from '../../services/supabase/client';
import { ToolsProduct, SupabaseToolsProduct, mapSupabaseToToolsProduct, ProductCapability } from '../types/toolsProducts';
import productsData from '../../data/products.json';

const CACHE_KEY = 'admin_tools_products_cache';
const canUseLocalFallback = () => import.meta.env.DEV && typeof localStorage !== 'undefined';

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
        if (canUseLocalFallback()) {
          console.warn('[toolsProductsService] Supabase query failed, using local dev cache:', error.message);
          return this.getLocalCache();
        }
        throw error;
      }

      const mapped = ((data as any) as SupabaseToolsProduct[] || []).map(mapSupabaseToToolsProduct);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    } catch (err: any) {
      if (canUseLocalFallback()) {
        console.warn('[toolsProductsService] Query caught error, using local dev cache:', err);
        return this.getLocalCache();
      }
      throw err;
    }
  },

  /**
   * Creates a new tools product with relational capabilities & technologies.
   */
  async createToolsProduct(product: ToolsProduct): Promise<ToolsProduct> {
    let createdProductId: string | null = null;
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
      createdProductId = insertedProduct.id;

      // If this product is featured, unset any other featured products
      if (product.isFeatured) {
        const { error: featuredError } = await (supabase as any)
          .from('tools_products')
          .update({ is_featured: false })
          .neq('id', insertedProduct.id);
        if (featuredError) throw featuredError;
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
        const { error: capsError } = await (supabase as any).from('product_capabilities').insert(caps);
        if (capsError) throw capsError;
      }

      // 3. Insert technologies
      if (product.technologies.length > 0) {
        const techs = product.technologies.map((t, idx) => ({
          product_id: insertedProduct.id,
          name: t,
          display_order: idx
        }));
        const { error: techsError } = await (supabase as any).from('product_technologies').insert(techs);
        if (techsError) throw techsError;
      }

      // Retrieve full record with joins
      const { data: finalRecord, error: finalError } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('id', insertedProduct.id)
        .single();

      if (finalError || !finalRecord) throw finalError || new Error('Product was created but could not be verified.');

      const mapped = mapSupabaseToToolsProduct(finalRecord);
      this.addToLocalCache(mapped);
      return mapped;
    } catch (err: any) {
      console.error('[toolsProductsService] Supabase create failed:', err);
      if (createdProductId) {
        const { error: cleanupError } = await (supabase as any)
          .from('tools_products')
          .delete()
          .eq('id', createdProductId);
        if (cleanupError) {
          console.warn('[toolsProductsService] Failed to clean up partially-created product:', cleanupError);
        }
      }
      throw err;
    }
  },

  /**
   * Updates an existing tools product and its repeater rows.
   */
  async updateToolsProduct(id: string, updates: ToolsProduct): Promise<ToolsProduct> {
    let snapshot: any = null;
    try {
      const { data: existingRecord, error: snapshotError } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('id', id)
        .single();

      if (snapshotError || !existingRecord) {
        throw snapshotError || new Error('Existing product could not be loaded before update.');
      }
      snapshot = existingRecord;

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
        const { error: featuredError } = await (supabase as any)
          .from('tools_products')
          .update({ is_featured: false })
          .neq('id', id);
        if (featuredError) throw featuredError;
      }

      // 2. Cascade delete existing caps and techs
      const { error: deleteCapsError } = await (supabase as any).from('product_capabilities').delete().eq('product_id', id);
      if (deleteCapsError) throw deleteCapsError;

      const { error: deleteTechsError } = await (supabase as any).from('product_technologies').delete().eq('product_id', id);
      if (deleteTechsError) throw deleteTechsError;

      // 3. Re-insert new caps
      if (updates.capabilities.length > 0) {
        const caps = updates.capabilities.map((c, idx) => ({
          product_id: id,
          title: c.title,
          description: c.description,
          icon: c.icon,
          display_order: idx
        }));
        const { error: capsError } = await (supabase as any).from('product_capabilities').insert(caps);
        if (capsError) throw capsError;
      }

      // 4. Re-insert new techs
      if (updates.technologies.length > 0) {
        const techs = updates.technologies.map((t, idx) => ({
          product_id: id,
          name: t,
          display_order: idx
        }));
        const { error: techsError } = await (supabase as any).from('product_technologies').insert(techs);
        if (techsError) throw techsError;
      }

      // Retrieve full updated record
      const { data: finalRecord, error: finalError } = await (supabase as any)
        .from('tools_products')
        .select('*, product_capabilities(*), product_technologies(*)')
        .eq('id', id)
        .single();

      if (finalError || !finalRecord) throw finalError || new Error('Product was updated but could not be verified.');

      const mapped = mapSupabaseToToolsProduct(finalRecord);
      this.updateLocalCache(id, mapped);
      return mapped;
    } catch (err: any) {
      console.error('[toolsProductsService] Supabase update failed:', err);
      if (snapshot) {
        try {
          const { error: rollbackProductError } = await (supabase as any)
            .from('tools_products')
            .update({
              title: snapshot.title,
              description: snapshot.description,
              type: snapshot.type,
              version: snapshot.version,
              category: snapshot.category,
              cover_image_url: snapshot.cover_image_url,
              preview_image_url: snapshot.preview_image_url,
              rating: snapshot.rating,
              downloads: snapshot.downloads,
              views: snapshot.views,
              marketplace_url: snapshot.marketplace_url,
              github_url: snapshot.github_url,
              docs_url: snapshot.docs_url,
              demo_url: snapshot.demo_url,
              is_featured: snapshot.is_featured,
              is_coming_soon: snapshot.is_coming_soon,
              problem_solved: snapshot.problem_solved,
              status: snapshot.status
            })
            .eq('id', id);
          if (rollbackProductError) throw rollbackProductError;

          const { error: rollbackCapsDeleteError } = await (supabase as any)
            .from('product_capabilities')
            .delete()
            .eq('product_id', id);
          if (rollbackCapsDeleteError) throw rollbackCapsDeleteError;

          const { error: rollbackTechsDeleteError } = await (supabase as any)
            .from('product_technologies')
            .delete()
            .eq('product_id', id);
          if (rollbackTechsDeleteError) throw rollbackTechsDeleteError;

          const previousCaps = (snapshot.product_capabilities || []).map((cap: any) => ({
            product_id: id,
            title: cap.title,
            description: cap.description,
            icon: cap.icon,
            display_order: cap.display_order
          }));
          if (previousCaps.length > 0) {
            const { error: rollbackCapsInsertError } = await (supabase as any)
              .from('product_capabilities')
              .insert(previousCaps);
            if (rollbackCapsInsertError) throw rollbackCapsInsertError;
          }

          const previousTechs = (snapshot.product_technologies || []).map((tech: any) => ({
            product_id: id,
            name: tech.name,
            display_order: tech.display_order
          }));
          if (previousTechs.length > 0) {
            const { error: rollbackTechsInsertError } = await (supabase as any)
              .from('product_technologies')
              .insert(previousTechs);
            if (rollbackTechsInsertError) throw rollbackTechsInsertError;
          }
        } catch (rollbackErr) {
          console.warn('[toolsProductsService] Failed to restore previous product state after update error:', rollbackErr);
        }
      }
      throw err;
    }
  },

  /**
   * Deletes a tools product.
   */
  async deleteToolsProduct(id: string): Promise<boolean> {
    try {
      // Find asset paths for storage cleanup
      const { data: prod, error: fetchError } = await (supabase as any)
        .from('tools_products')
        .select('cover_image_url, preview_image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

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
        const { error: storageError } = await supabase.storage.from('tools-products').remove(pathsToDelete);
        if (storageError) {
          console.warn('[toolsProductsService] Product deleted, but asset cleanup failed:', storageError);
        }
      }

      this.removeFromLocalCache(id);
      return true;
    } catch (err: any) {
      console.error('[toolsProductsService] Supabase delete failed:', err);
      throw err;
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
