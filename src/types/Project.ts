/* src/types/Project.ts */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;    // e.g., "Enterprise", "Healthcare", "AI", "Mobile"
  client: string;
  role: string;
  timeline: string;
  platform: string;
  users: string;
  status: string;
  businessValue: string;
  technologies: string[];
  coverImage: string;
  images: string[];
  problemSolved: string;
  solution?: string;
  fullDescription?: string;
  features: string[];
  impactMetrics: {
    kpi: string;
    label: string;
  }[];
  layoutType?: 'large' | 'medium' | 'compact'; // Magazine layout sizing
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  featuresList?: ProjectFeature[];
  gallery?: ProjectGallery[];
}

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

