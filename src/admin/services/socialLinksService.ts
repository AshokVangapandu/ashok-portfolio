/* src/admin/services/socialLinksService.ts */
import { MOCK_SOCIAL_LINKS } from './socialLinks.mock';
import { SocialLink } from '../types/socialLinks';

export const socialLinksService = {
  async getLinks() {
    return [...MOCK_SOCIAL_LINKS];
  },

  async updateLinks(links: SocialLink[]) {
    console.log('[socialLinksService] Updated links:', links);
    return true;
  }
};

export default socialLinksService;
