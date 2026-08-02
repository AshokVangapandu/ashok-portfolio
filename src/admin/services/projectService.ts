/* src/admin/services/projectService.ts */
import { supabase } from '../../services/supabase/client';
import {
  AdminProject,
  SupabaseProject,
  mapSupabaseToAdminProject,
  isUUID,
  ProjectFeature,
  FeatureBullet,
  ProjectGallery,
  SupabaseProjectFeature,
  SupabaseFeatureBullet,
  SupabaseProjectGallery,
  mapSupabaseToProjectFeature,
  mapProjectFeatureToSupabase,
  mapSupabaseToFeatureBullet,
  mapFeatureBulletToSupabase,
  mapSupabaseToProjectGallery,
  mapProjectGalleryToSupabase
} from '../types/project';
import projectsData from '../../data/projects.json';

export const projectService = {
  /**
   * Retrieves all projects from Supabase with local fallback.
   */
  async getProjects(): Promise<AdminProject[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[projectService] Supabase projects query failed, using local cache:', error.message);
        return this.getLocalCache();
      }

      const dbProjects = ((data as any) as SupabaseProject[] || []).map(mapSupabaseToAdminProject);
      // Sync local cache for consistency
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('admin_projects_cache', JSON.stringify(dbProjects));
      }
      return dbProjects;
    } catch (err: any) {
      console.warn('[projectService] Supabase query caught error, using local cache:', err);
      return this.getLocalCache();
    }
  },

  /**
   * Creates a new project.
   */
  async createProject(projectData: AdminProject): Promise<AdminProject> {
    try {
      const insertPayload: any = {
        title: projectData.title,
        description: projectData.description,
        full_description: projectData.fullDescription,
        category: projectData.category,
        client: projectData.client || null,
        role: projectData.role || null,
        timeline: projectData.timeline || null,
        platform: projectData.platform || null,
        users: projectData.users || null,
        status: projectData.status,
        business_value: projectData.businessValue || null,
        technologies: projectData.technologies,
        cover_image_url: projectData.coverImageUrl,
        images: projectData.images,
        problem_solved: projectData.problemSolved,
        solution: projectData.solution,
        features: projectData.features,
        impact_metrics: projectData.impactMetrics,
        layout_type: projectData.layoutType,
        demo_url: projectData.demoUrl || null,
        github_url: projectData.githubUrl || null,
        docs_url: projectData.docsUrl || null,
        is_featured: projectData.isFeatured
      };

      if (projectData.id && isUUID(projectData.id)) {
        insertPayload.id = projectData.id;
      }

      const { data, error } = await (supabase as any)
        .from('projects')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }
      const newProj = mapSupabaseToAdminProject(data);
      this.addToLocalCache(newProj);
      return newProj;
    } catch (err: any) {
      console.error('[projectService] Supabase create failed:', err);
      throw err;
    }
  },

  async updateProject(id: string, updates: AdminProject): Promise<AdminProject> {
    if (!isUUID(id)) {
      console.log('[projectService] updateProject: ID is not a valid UUID. Redirecting to createProject.');
      return this.createProject(updates);
    }

    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          full_description: updates.fullDescription,
          category: updates.category,
          client: updates.client || null,
          role: updates.role || null,
          timeline: updates.timeline || null,
          platform: updates.platform || null,
          users: updates.users || null,
          status: updates.status,
          business_value: updates.businessValue || null,
          technologies: updates.technologies,
          cover_image_url: updates.coverImageUrl,
          images: updates.images,
          problem_solved: updates.problemSolved,
          solution: updates.solution,
          features: updates.features,
          impact_metrics: updates.impactMetrics,
          layout_type: updates.layoutType,
          demo_url: updates.demoUrl || null,
          github_url: updates.githubUrl || null,
          docs_url: updates.docsUrl || null,
          is_featured: updates.isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      const updatedProj = mapSupabaseToAdminProject(data);
      this.updateLocalCache(id, updatedProj);
      return updatedProj;
    } catch (err: any) {
      console.error('[projectService] Supabase update failed:', err);
      throw err;
    }
  },

  /**
   * Deletes a project.
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      // Fetch details to find cover image for cleanup
      const { data: proj } = await (supabase as any)
        .from('projects')
        .select('cover_image_url')
        .eq('id', id)
        .single();

      const imagePath = proj?.cover_image_url ? proj.cover_image_url.split('/storage/v1/object/public/projects/')[1] : null;

      const { error } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Cleanup asset
      if (imagePath) {
        await supabase.storage.from('projects').remove([imagePath]);
      }

      this.removeFromLocalCache(id);
      return true;
    } catch (err: any) {
      console.error('[projectService] Supabase delete failed:', err);
      throw err;
    }
  },

  /**
   * Upload asset wrapper for files (cover images, screenshots).
   */
  async uploadAsset(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('[projectService.uploadAsset] Error uploading:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(path);

    return publicUrl;
  },

  // --- Local Cache Helpers ---
  getLocalCache(): AdminProject[] {
    if (typeof localStorage === 'undefined') {
      return this.getLocalMockProjects();
    }
    const cached = localStorage.getItem('admin_projects_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    const mocks = this.getLocalMockProjects();
    localStorage.setItem('admin_projects_cache', JSON.stringify(mocks));
    return mocks;
  },

  addToLocalCache(proj: AdminProject) {
    const cache = this.getLocalCache();
    cache.unshift(proj);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('admin_projects_cache', JSON.stringify(cache));
    }
  },

  updateLocalCache(id: string, updates: AdminProject) {
    const cache = this.getLocalCache();
    const idx = cache.findIndex(p => p.id === id);
    if (idx !== -1) {
      cache[idx] = { ...cache[idx], ...updates, id }; // keep target id
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('admin_projects_cache', JSON.stringify(cache));
      }
    }
  },

  removeFromLocalCache(id: string) {
    const cache = this.getLocalCache();
    const filtered = cache.filter(p => p.id !== id);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('admin_projects_cache', JSON.stringify(filtered));
    }
  },

  getLocalMockProjects(): AdminProject[] {
    const rawData = projectsData as any[];
    return rawData.map((item, idx) => ({
      id: item.id || `proj-${idx}`,
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'General',
      client: item.client || '',
      role: item.role || '',
      timeline: item.timeline || '',
      platform: item.platform || '',
      users: item.users || '',
      status: item.status || ((idx % 3 === 0) ? 'draft' : 'published'),
      businessValue: item.businessValue || '',
      technologies: item.technologies || [],
      coverImageUrl: item.coverImage || null,
      images: item.images || [],
      problemSolved: item.problemSolved || '',
      solution: item.problemSolved || '', // Fallback to problemSolved or empty
      fullDescription: item.description || '', // Fallback to description or empty
      features: item.features || [],
      impactMetrics: item.impactMetrics || [],
      layoutType: item.layoutType || 'medium',
      demoUrl: item.demoUrl,
      githubUrl: item.githubUrl,
      docsUrl: item.docsUrl,
      updatedAt: new Date().toISOString(),
      isFeatured: item.layoutType === 'large'
    }));
  },

  getStoragePath(projectUuid: string, category: 'hero' | 'features' | 'gallery' | 'thumbs', fileName: string): string {
    const originalFileName = fileName;
    
    // 1. Normalize unicode (decomposes combined characters like accents)
    let sanitized = fileName.normalize('NFD');
    // 2. Convert to lowercase
    sanitized = sanitized.toLowerCase();
    // 3. Replace em dash — or en dash – with hyphen
    sanitized = sanitized.replace(/[—–]/g, '-');
    // 4. Remove all non-ASCII characters
    sanitized = sanitized.replace(/[^\x00-\x7F]/g, '');
    // 5. Replace spaces and tabs with hyphen
    sanitized = sanitized.replace(/\s+/g, '-');
    // 6. Collapse duplicate hyphens
    sanitized = sanitized.replace(/-+/g, '-');
    // 7. Strip out any character not in [a-z0-9._-]
    sanitized = sanitized.replace(/[^a-z0-9._-]/g, '');
    // 8. Collapse duplicate hyphens again if needed
    sanitized = sanitized.replace(/-+/g, '-');
    // 9. Trim leading/trailing hyphens (excluding extension)
    sanitized = sanitized.replace(/^-+|-+$/g, '');

    console.log(`[Storage Sanitization] Category: ${category}. Original: "${originalFileName}" -> Sanitized: "${sanitized}"`);

    return `${projectUuid}/${category}/${sanitized}`;
  },

  async getProjectFeatures(projectId: string): Promise<ProjectFeature[]> {
    const { data, error } = await (supabase as any)
      .from('project_features')
      .select('*, bullets:feature_bullets(*)')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[projectService.getProjectFeatures] Error:', error);
      throw error;
    }

    const features = (data as SupabaseProjectFeature[] || []).map(rawFeature => {
      const feature = mapSupabaseToProjectFeature(rawFeature);
      const rawBullets = (rawFeature as any).bullets as SupabaseFeatureBullet[];
      if (rawBullets) {
        feature.bullets = rawBullets
          .map(mapSupabaseToFeatureBullet)
          .sort((a, b) => a.displayOrder - b.displayOrder);
      }
      return feature;
    });

    return features;
  },

  async getProjectGallery(projectId: string): Promise<ProjectGallery[]> {
    const { data, error } = await (supabase as any)
      .from('project_gallery')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[projectService.getProjectGallery] Error:', error);
      throw error;
    }

    return (data as SupabaseProjectGallery[] || []).map(mapSupabaseToProjectGallery);
  },

  async createProjectFeature(feature: Omit<ProjectFeature, 'id'>): Promise<ProjectFeature> {
    const payload = mapProjectFeatureToSupabase({ ...feature, id: undefined as any });
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

    const { data, error } = await (supabase as any)
      .from('project_features')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[projectService.createProjectFeature] Error:', error);
      throw error;
    }

    return mapSupabaseToProjectFeature(data);
  },

  async updateProjectFeature(id: string, updates: Partial<ProjectFeature>): Promise<ProjectFeature> {
    const dbUpdates = mapProjectFeatureToSupabase({ ...updates, id } as ProjectFeature);
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);
    delete (dbUpdates as any).project_id;

    const { data, error } = await (supabase as any)
      .from('project_features')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[projectService.updateProjectFeature] Error:', error);
      throw error;
    }

    return mapSupabaseToProjectFeature(data);
  },

  async deleteProjectFeature(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('project_features')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[projectService.deleteProjectFeature] Error:', error);
      throw error;
    }

    return true;
  },

  async createFeatureBullet(bullet: Omit<FeatureBullet, 'id'>): Promise<FeatureBullet> {
    const payload = mapFeatureBulletToSupabase({ ...bullet, id: undefined as any });
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);

    const { data, error } = await (supabase as any)
      .from('feature_bullets')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[projectService.createFeatureBullet] Error:', error);
      throw error;
    }

    return mapSupabaseToFeatureBullet(data);
  },

  async updateFeatureBullet(id: string, updates: Partial<FeatureBullet>): Promise<FeatureBullet> {
    const dbUpdates = mapFeatureBulletToSupabase({ ...updates, id } as FeatureBullet);
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);
    delete (dbUpdates as any).feature_id;

    const { data, error } = await (supabase as any)
      .from('feature_bullets')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[projectService.updateFeatureBullet] Error:', error);
      throw error;
    }

    return mapSupabaseToFeatureBullet(data);
  },

  async deleteFeatureBullet(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('feature_bullets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[projectService.deleteFeatureBullet] Error:', error);
      throw error;
    }

    return true;
  },

  async createGalleryItem(item: Omit<ProjectGallery, 'id'>): Promise<ProjectGallery> {
    const { data, error } = await (supabase as any)
      .from('project_gallery')
      .insert([mapProjectGalleryToSupabase({ ...item, id: undefined as any })])
      .select()
      .single();

    if (error) {
      console.error('[projectService.createGalleryItem] Error:', error);
      throw error;
    }

    return mapSupabaseToProjectGallery(data);
  },

  async updateGalleryItem(id: string, updates: Partial<ProjectGallery>): Promise<ProjectGallery> {
    const dbUpdates = mapProjectGalleryToSupabase({ ...updates, id } as ProjectGallery);
    Object.keys(dbUpdates).forEach(key => (dbUpdates as any)[key] === undefined && delete (dbUpdates as any)[key]);
    delete (dbUpdates as any).project_id;

    const { data, error } = await (supabase as any)
      .from('project_gallery')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[projectService.updateGalleryItem] Error:', error);
      throw error;
    }

    return mapSupabaseToProjectGallery(data);
  },

  async deleteGalleryItem(id: string): Promise<boolean> {
    const { error } = await (supabase as any)
      .from('project_gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[projectService.deleteGalleryItem] Error:', error);
      throw error;
    }

    return true;
  }
};

export default projectService;
