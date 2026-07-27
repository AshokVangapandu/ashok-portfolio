/* src/admin/services/socialLinksService.ts */
import { supabase } from '../../services/supabase/client';
import { SocialLink } from '../types/socialLinks';

export const socialLinksService = {
  async getLinks(): Promise<SocialLink[]> {
    const { data, error } = await (supabase as any)
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[socialLinksService] Error loading social links:', error);
      throw error;
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      platform: item.platform.toLowerCase(), // Ensure key is lowercase
      url: item.url
    }));
  },

  async updateLinks(links: SocialLink[]): Promise<boolean> {
    // Upsert using the unique 'platform' key, omitting 'id' to prevent primary key constraint conflicts
    const payload = links.map((link, idx) => ({
      platform: link.platform.toLowerCase(),
      url: link.url,
      display_order: idx + 1
    }));

    const { error } = await (supabase as any)
      .from('social_links')
      .upsert(payload, { onConflict: 'platform' });

    if (error) {
      console.error('[socialLinksService] Error upserting social links:', error);
      throw error;
    }

    return true;
  }
};

export default socialLinksService;
