/* src/admin/types/toolsProducts.ts */

export interface ProductCapability {
  id?: string;
  productId?: string;
  title: string;
  description: string | null;
  icon: string | null;
  displayOrder?: number;
}

export interface ToolsProduct {
  id: string;
  title: string;
  description: string;
  type: 'Widget' | 'Action' | 'Template' | 'Plugin' | 'Tool';
  version: string;
  category: string;
  coverImageUrl: string | null;
  previewImageUrl: string | null;
  rating: number;
  downloads: number;
  views: number;
  updatedAt: string;
  marketplaceUrl: string | null;
  githubUrl: string | null;
  docsUrl: string | null;
  demoUrl: string | null;
  isFeatured: boolean;
  isComingSoon: boolean;
  problemSolved: string | null;
  status: 'draft' | 'published';
  capabilities: ProductCapability[];
  technologies: string[];
  features: string[]; // Keep for backward-compatibility (maps to capabilities titles)
}

export interface SupabaseToolsProduct {
  id: string;
  title: string;
  description: string | null;
  type: string;
  version: string;
  category: string;
  cover_image_url: string | null;
  preview_image_url: string | null;
  rating: number | null;
  downloads: number | null;
  views: number | null;
  updated_at: string | null;
  marketplace_url: string | null;
  github_url: string | null;
  docs_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  is_coming_soon: boolean;
  problem_solved: string | null;
  status: string;
  created_at?: string;
  product_capabilities?: any[]; // relation payload
  product_technologies?: any[]; // relation payload
}

export const mapSupabaseToToolsProduct = (raw: SupabaseToolsProduct): ToolsProduct => {
  const capabilities: ProductCapability[] = (raw.product_capabilities || []).map((c: any) => ({
    id: c.id,
    productId: c.product_id,
    title: c.title,
    description: c.description,
    icon: c.icon,
    displayOrder: c.display_order
  }));

  const technologies: string[] = (raw.product_technologies || []).map((t: any) => t.name);

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description || '',
    type: (raw.type as any) || 'Widget',
    version: raw.version || '1.0.0',
    category: raw.category || 'General',
    coverImageUrl: raw.cover_image_url,
    previewImageUrl: raw.preview_image_url,
    rating: raw.rating || 0,
    downloads: raw.downloads || 0,
    views: raw.views || 0,
    updatedAt: raw.updated_at || raw.created_at || new Date().toISOString(),
    marketplaceUrl: raw.marketplace_url,
    githubUrl: raw.github_url,
    docsUrl: raw.docs_url,
    demoUrl: raw.demo_url,
    isFeatured: raw.is_featured || false,
    isComingSoon: raw.is_coming_soon || false,
    problemSolved: raw.problem_solved,
    status: (raw.status?.toLowerCase() === 'published') ? 'published' : 'draft',
    capabilities,
    technologies,
    features: capabilities.map(c => c.title)
  };
};
