/* src/types/Product.ts */

export interface Product {
  id: string;
  title: string;
  description: string;
  type: string;        // e.g., "Pluggable Widget", "Figma Plugin", "AI Tool"
  version: string;
  category: string;    // e.g., "Widgets", "Plugins", "Developer Tools", "AI Tools"
  coverImage: string;
  previewImage: string;
  technologies: string[];
  rating: number;
  downloads: string | number;
  views: string | number;
  updatedAt: string;
  marketplaceUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  comingSoon?: boolean;
  features?: string[];
  problemSolved?: string;
}
