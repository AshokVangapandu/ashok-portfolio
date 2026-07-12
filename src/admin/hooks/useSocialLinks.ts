/* src/admin/hooks/useSocialLinks.ts */
import { useState, useEffect, useCallback } from 'react';
import { socialLinksService } from '../services/socialLinksService';
import { SocialLink } from '../types/socialLinks';

export const useSocialLinks = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLinks, setInitialLinks] = useState<SocialLink[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await socialLinksService.getLinks();
      setInitialLinks(data);
      setLinks(data.map((item) => ({ ...item })));
    } catch (err) {
      console.error('[useSocialLinks] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const updateLinkUrl = (id: string, url: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url } : item))
    );
  };

  // Check if any link URL differs from initial values
  const isDirty =
    initialLinks.length === links.length && initialLinks.length > 0
      ? links.some((link, idx) => link.url !== initialLinks[idx].url)
      : false;

  const handleSave = async () => {
    setLoading(true);
    try {
      await socialLinksService.updateLinks(links);
      setInitialLinks(links.map((item) => ({ ...item })));
    } catch (err) {
      console.error('[useSocialLinks] Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setLinks(initialLinks.map((item) => ({ ...item })));
  };

  return {
    loading,
    links,
    updateLinkUrl,
    isDirty,
    handleSave,
    handleDiscard,
    refresh: fetchLinks
  };
};

export default useSocialLinks;
