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
      platform: item.platform, // Keep database case to allow cleanup and mapping checks
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
  },

  async cleanUpDatabase(currentLinks: SocialLink[]): Promise<void> {
    const REQUIRED_PLATFORMS = ['linkedin', 'github', 'behance', 'email', 'whatsapp', 'instagram'];
    
    // Group links by lowercase platform name
    const grouped: Record<string, SocialLink[]> = {};
    currentLinks.forEach((link) => {
      const key = link.platform.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(link);
    });

    const toDeleteIds: string[] = [];
    const toUpdate: { id: string; platform: string; url: string }[] = [];

    // Identify unsupported platforms for deletion
    currentLinks.forEach((link) => {
      const key = link.platform.toLowerCase();
      if (!REQUIRED_PLATFORMS.includes(key)) {
        if (link.id && !link.id.startsWith('temp-')) {
          toDeleteIds.push(link.id);
        }
      }
    });

    // Identify duplicates and case-mismatch fixes
    for (const platform of REQUIRED_PLATFORMS) {
      const group = grouped[platform] || [];
      if (group.length === 0) continue;

      const lowercaseLink = group.find((l) => l.platform === platform);
      const capitalizedLinks = group.filter((l) => l.platform !== platform);

      if (lowercaseLink) {
        // If a lowercase one exists:
        // 1. If lowercase is empty but capitalized has a URL, update the lowercase one
        const hasUrlCapitalized = capitalizedLinks.find((l) => l.url && l.url.trim());
        if (!lowercaseLink.url && hasUrlCapitalized) {
          lowercaseLink.url = hasUrlCapitalized.url;
          toUpdate.push({
            id: lowercaseLink.id,
            platform: platform,
            url: hasUrlCapitalized.url
          });
        }
        // 2. Delete all capitalized ones
        capitalizedLinks.forEach((l) => {
          if (l.id && !l.id.startsWith('temp-')) {
            toDeleteIds.push(l.id);
          }
        });
      } else {
        // If no lowercase one exists, update the first capitalized one to lowercase and delete others
        const primary = capitalizedLinks[0];
        toUpdate.push({
          id: primary.id,
          platform: platform,
          url: primary.url
        });
        
        capitalizedLinks.slice(1).forEach((l) => {
          if (l.id && !l.id.startsWith('temp-')) {
            toDeleteIds.push(l.id);
          }
        });
      }
    }

    // Ensure all existing links have correct protocol prefixes
    currentLinks.forEach((link) => {
      const key = link.platform.toLowerCase();
      if (key !== 'email' && link.url && link.url.trim() && !/^https?:\/\//i.test(link.url.trim())) {
        const cleanedUrl = `https://${link.url.trim()}`;
        const existingUpdate = toUpdate.find((u) => u.id === link.id);
        if (existingUpdate) {
          existingUpdate.url = cleanedUrl;
        } else if (link.id && !link.id.startsWith('temp-')) {
          toUpdate.push({
            id: link.id,
            platform: link.platform.toLowerCase(),
            url: cleanedUrl
          });
        }
      }
    });

    // Execute updates
    for (const item of toUpdate) {
      await (supabase as any)
        .from('social_links')
        .update({ platform: item.platform, url: item.url })
        .eq('id', item.id);
    }

    // Execute deletions
    if (toDeleteIds.length > 0) {
      await (supabase as any)
        .from('social_links')
        .delete()
        .in('id', toDeleteIds);
    }
  }
};

export default socialLinksService;
