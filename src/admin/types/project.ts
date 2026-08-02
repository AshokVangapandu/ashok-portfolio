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

/**
 * Validates whether a string is a valid UUID v4.
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Generates a valid UUID v4 client-side with a fallback for non-supported environments.
 */
export const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface ProjectFeature {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageThumbnailUrl: string | null;
  imageAlt: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  bullets?: FeatureBullet[];
}

export interface FeatureBullet {
  id: string;
  featureId: string;
  text: string;
  displayOrder: number;
  createdAt?: string;
}

export interface ProjectGallery {
  id: string;
  projectId: string;
  title: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  deviceType: 'Desktop' | 'Tablet' | 'Mobile' | 'Analytics' | 'Reports' | 'Settings' | null;
  displayOrder: number;
  createdAt?: string;
}

export interface SupabaseProjectFeature {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_thumbnail_url: string | null;
  image_alt: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseFeatureBullet {
  id: string;
  feature_id: string;
  text: string;
  display_order: number;
  created_at?: string;
}

export interface SupabaseProjectGallery {
  id: string;
  project_id: string;
  title: string | null;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  device_type: string | null;
  display_order: number;
  created_at?: string;
}

// --- Mapping Helpers ---

export const mapSupabaseToProjectFeature = (raw: SupabaseProjectFeature): ProjectFeature => {
  return {
    id: raw.id,
    projectId: raw.project_id,
    title: raw.title,
    description: raw.description,
    imageUrl: raw.image_url,
    imageThumbnailUrl: raw.image_thumbnail_url,
    imageAlt: raw.image_alt,
    displayOrder: raw.display_order,
    isActive: raw.is_active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at
  };
};

export const mapProjectFeatureToSupabase = (feature: ProjectFeature): SupabaseProjectFeature => {
  return {
    id: feature.id,
    project_id: feature.projectId,
    title: feature.title,
    description: feature.description,
    image_url: feature.imageUrl,
    image_thumbnail_url: feature.imageThumbnailUrl,
    image_alt: feature.imageAlt,
    display_order: feature.displayOrder,
    is_active: feature.isActive
  };
};

export const mapSupabaseToFeatureBullet = (raw: SupabaseFeatureBullet): FeatureBullet => {
  return {
    id: raw.id,
    featureId: raw.feature_id,
    text: raw.text,
    displayOrder: raw.display_order,
    createdAt: raw.created_at
  };
};

export const mapFeatureBulletToSupabase = (bullet: FeatureBullet): SupabaseFeatureBullet => {
  return {
    id: bullet.id,
    feature_id: bullet.featureId,
    text: bullet.text,
    display_order: bullet.displayOrder
  };
};

export const mapSupabaseToProjectGallery = (raw: SupabaseProjectGallery): ProjectGallery => {
  const allowedDeviceTypes = ['Desktop', 'Tablet', 'Mobile', 'Analytics', 'Reports', 'Settings'];
  const deviceType = (raw.device_type && allowedDeviceTypes.includes(raw.device_type))
    ? (raw.device_type as any)
    : null;

  return {
    id: raw.id,
    projectId: raw.project_id,
    title: raw.title,
    imageUrl: raw.image_url,
    thumbnailUrl: raw.thumbnail_url,
    caption: raw.caption,
    deviceType,
    displayOrder: raw.display_order,
    createdAt: raw.created_at
  };
};

export const mapProjectGalleryToSupabase = (item: ProjectGallery): SupabaseProjectGallery => {
  return {
    id: item.id,
    project_id: item.projectId,
    title: item.title,
    image_url: item.imageUrl,
    thumbnail_url: item.thumbnailUrl,
    caption: item.caption,
    device_type: item.deviceType,
    display_order: item.displayOrder
  };
};

