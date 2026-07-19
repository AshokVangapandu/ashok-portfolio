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
      platform: item.platform,
      url: item.url
    }));
  },

  async deleteLink(id: string): Promise<boolean> {
    // Only proceed if it is a real database ID (i.e. not a temporary client-side uuid)
    if (!id || id.startsWith('temp-')) {
      return true;
    }

    const { error } = await (supabase as any)
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[socialLinksService] Error deleting social link:', error);
      throw error;
    }

    return true;
  },

  async updateLinks(links: SocialLink[]): Promise<boolean> {
    // Separate links into inserts (with temp IDs) and updates (with real IDs)
    const payload = links.map((link, idx) => {
      const isNew = !link.id || link.id.startsWith('temp-');
      const item: any = {
        platform: link.platform,
        url: link.url,
        display_order: idx + 1
      };
      if (!isNew) {
        item.id = link.id;
      }
      return item;
    });

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
