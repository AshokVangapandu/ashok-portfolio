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
  features: string[];
  impactMetrics: {
    kpi: string;
    label: string;
  }[];
  layoutType?: 'large' | 'medium' | 'compact'; // Magazine layout sizing
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
}
