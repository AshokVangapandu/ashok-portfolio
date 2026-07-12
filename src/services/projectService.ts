/* src/services/projectService.ts */
import projectsData from '../data/projects.json';
import { Project } from '../types/Project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    // Return all projects (casting due to JSON import types)
    return projectsData as Project[];
  },

  async getFeaturedProject(): Promise<Project | null> {
    const projects = await this.getProjects();
    // Return the first project marked as 'large' layout or first project
    return projects.find(p => p.layoutType === 'large') || projects[0] || null;
  }
};

export default projectService;
