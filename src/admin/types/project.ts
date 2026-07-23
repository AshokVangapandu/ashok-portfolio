/* src/admin/types/project.ts */

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  role: string;
  timeline: string;
  platform: string;
  users: string;
  status: 'draft' | 'published';
  businessValue: string;
  technologies: string[];
  coverImageUrl: string | null;
  images: string[];
  problemSolved: string;
  solution: string;
  fullDescription: string;
  features: string[];
  impactMetrics: {
    kpi: string;
    label: string;
  }[];
  layoutType: 'large' | 'medium' | 'compact';
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  updatedAt: string;
  isFeatured: boolean;
}

export interface SupabaseProject {
  id: string;
  title: string;
  description: string | null;
  category: string;
  client: string | null;
  role: string | null;
  timeline: string | null;
  platform: string | null;
  users: string | null;
  status: string;
  business_value: string | null;
  technologies: string[] | null;
  cover_image_url: string | null;
  images: string[] | null;
  problem_solved: string | null;
  solution: string | null;
  full_description: string | null;
  features: string[] | null;
  impact_metrics: any | null;
  layout_type: string | null;
  demo_url: string | null;
  github_url: string | null;
  docs_url: string | null;
  updated_at: string | null;
  is_featured: boolean | null;
  created_at?: string;
}

export const mapSupabaseToAdminProject = (raw: SupabaseProject): AdminProject => {
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
    status: (raw.status?.toLowerCase() === 'published') ? 'published' : 'draft',
    businessValue: raw.business_value || '',
    technologies: raw.technologies || [],
    coverImageUrl: raw.cover_image_url,
    images: raw.images || [],
    problemSolved: raw.problem_solved || '',
    solution: raw.solution || '',
    fullDescription: raw.full_description || '',
    features: raw.features || [],
    impactMetrics: Array.isArray(raw.impact_metrics) ? raw.impact_metrics : [],
    layoutType: (raw.layout_type as any) || 'medium',
    demoUrl: raw.demo_url || undefined,
    githubUrl: raw.github_url || undefined,
    docsUrl: raw.docs_url || undefined,
    updatedAt: raw.updated_at || raw.created_at || new Date().toISOString(),
    isFeatured: raw.is_featured || false
  };
};
