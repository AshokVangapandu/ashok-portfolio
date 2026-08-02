/* src/services/projectService.ts */
import { supabase } from './supabase/client';
import { Project, ProjectFeature, ProjectGallery } from '../types/Project';
import projectsData from '../data/projects.json';

export const projectService = {
  /**
   * Fetches published projects from Supabase with caching and file mappings.
   */
  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[public projectService] Query failed, using local cache:', error.message);
        return this.getLocalCache();
      }

      return (data || []).map(this.mapSupabaseToProject);
    } catch (err: any) {
      console.warn('[public projectService] Query caught error, using local cache:', err);
      return this.getLocalCache();
    }
  },

  /**
   * Resolves the featured project item.
   */
  async getFeaturedProject(): Promise<Project | null> {
    const list = await this.getProjects();
    return list.find(p => p.layoutType === 'large') || list[0] || null;
  },

  /**
   * Local Cache Fallback logic.
   */
  getLocalCache(): Project[] {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem('admin_projects_cache');
      if (cached) {
        try {
          const list: any[] = JSON.parse(cached);
          // Map each admin schema to public Project schema
          return list
            .filter(p => p.status === 'published')
            .map(this.mapAdminToPublicProject);
        } catch (e) {
          console.warn('[public projectService] Failed to parse cached projects:', e);
        }
      }
    }
    // Temporary reference data – remove after real content is added.
    // Final fallback to JSON file data
    const raw = projectsData as any[];
    return raw.map(this.mapJsonToProject);
  },

  /**
   * Helper to map Supabase database record to public Project type.
   */
  mapSupabaseToProject(raw: any): Project {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description || '',
      category: raw.category || 'General',
      client: raw.client || '',
      role: raw.role || '',
      timeline: raw.timeline || '',
      platform: raw.platform || '',
      users: raw.users || '',
      status: raw.status || 'published',
      businessValue: raw.business_value || '',
      technologies: raw.technologies || [],
      coverImage: raw.cover_image_url || '',
      images: raw.images || [],
      problemSolved: raw.problem_solved || '',
      solution: raw.solution || '',
      fullDescription: raw.full_description || '',
      features: raw.features || [],
      impactMetrics: Array.isArray(raw.impact_metrics) ? raw.impact_metrics : [],
      layoutType: raw.layout_type || 'medium',
      demoUrl: raw.demo_url || undefined,
      githubUrl: raw.github_url || undefined,
      docsUrl: raw.docs_url || undefined
    };
  },

  /**
   * Helper to map Admin model to public Project type.
   */
  mapAdminToPublicProject(admin: any): Project {
    return {
      id: admin.id,
      title: admin.title,
      description: admin.description || '',
      category: admin.category || 'General',
      client: admin.client || '',
      role: admin.role || '',
      timeline: admin.timeline || '',
      platform: admin.platform || '',
      users: admin.users || '',
      status: admin.status || 'published',
      businessValue: admin.businessValue || '',
      technologies: admin.technologies || [],
      coverImage: admin.coverImageUrl || '',
      images: admin.images || [],
      problemSolved: admin.problemSolved || '',
      solution: admin.solution || '',
      fullDescription: admin.fullDescription || '',
      features: admin.features || [],
      impactMetrics: Array.isArray(admin.impactMetrics) ? admin.impactMetrics : [],
      layoutType: admin.layoutType || 'medium',
      demoUrl: admin.demoUrl || undefined,
      githubUrl: admin.githubUrl || undefined,
      docsUrl: admin.docsUrl || undefined
    };
  },

  /**
   * Helper to map raw JSON objects to Project type.
   */
  mapJsonToProject(item: any): Project {
    return {
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'General',
      client: item.client || '',
      role: item.role || '',
      timeline: item.timeline || '',
      platform: item.platform || '',
      users: item.users || '',
      status: item.status || 'published',
      businessValue: item.businessValue || '',
      technologies: item.technologies || [],
      coverImage: item.coverImage || '',
      images: item.images || [],
      problemSolved: item.problemSolved || '',
      solution: item.solution || '',
      fullDescription: item.fullDescription || '',
      features: item.features || [],
      impactMetrics: Array.isArray(item.impactMetrics) ? item.impactMetrics : [],
      layoutType: item.layoutType || 'medium',
      demoUrl: item.demoUrl,
      githubUrl: item.githubUrl,
      docsUrl: item.docsUrl
    };
  },

  async getProjectFeatures(projectId: string): Promise<ProjectFeature[]> {
    const { data, error } = await (supabase as any)
      .from('project_features')
      .select('*, bullets:feature_bullets(*)')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[projectService.getProjectFeatures] Error:', error);
      return [];
    }

    return (data || []).map((rawFeature: any) => {
      const bullets = (rawFeature.bullets || []).map((rawBullet: any) => ({
        id: rawBullet.id,
        featureId: rawBullet.feature_id,
        text: rawBullet.text,
        displayOrder: rawBullet.display_order,
        createdAt: rawBullet.created_at
      })).sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      return {
        id: rawFeature.id,
        projectId: rawFeature.project_id,
        title: rawFeature.title,
        description: rawFeature.description,
        imageUrl: rawFeature.image_url,
        imageThumbnailUrl: rawFeature.image_thumbnail_url,
        imageAlt: rawFeature.image_alt,
        displayOrder: rawFeature.display_order,
        isActive: rawFeature.is_active,
        createdAt: rawFeature.created_at,
        updatedAt: rawFeature.updated_at,
        bullets
      };
    });
  },

  async getProjectGallery(projectId: string): Promise<ProjectGallery[]> {
    const { data, error } = await (supabase as any)
      .from('project_gallery')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[projectService.getProjectGallery] Error:', error);
      return [];
    }

    return (data || []).map((raw: any) => ({
      id: raw.id,
      projectId: raw.project_id,
      title: raw.title,
      imageUrl: raw.image_url,
      thumbnailUrl: raw.thumbnail_url,
      caption: raw.caption,
      deviceType: raw.device_type,
      displayOrder: raw.display_order,
      createdAt: raw.created_at
    }));
  }
};

export default projectService;
