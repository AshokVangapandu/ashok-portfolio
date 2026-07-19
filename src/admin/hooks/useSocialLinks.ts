/* src/admin/hooks/useSocialLinks.ts */
import { useState, useEffect, useCallback } from 'react';
import { socialLinksService } from '../services/socialLinksService';
import { SocialLink } from '../types/socialLinks';

export const useSocialLinks = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLinks, setInitialLinks] = useState<SocialLink[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await socialLinksService.getLinks();
      setInitialLinks(data);
      setLinks(data.map((item) => ({ ...item })));
    } catch (err) {
      console.error('[useSocialLinks] Fetch error:', err);
      setError('Failed to load social links from database.');
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

  const addLink = (platform: string, url: string) => {
    setError(null);
    // Check duplicate platform locally
    if (links.some((l) => l.platform.toLowerCase() === platform.toLowerCase())) {
      setError(`Platform "${platform}" has already been added.`);
      return false;
    }

    const newLink: SocialLink = {
      id: `temp-${Date.now()}`,
      platform,
      url
    };
    setLinks((prev) => [...prev, newLink]);
    return true;
  };

  const editLink = (id: string, platform: string, url: string) => {
    setError(null);
    // Check duplicate platform locally (excluding itself)
    if (links.some((l) => l.id !== id && l.platform.toLowerCase() === platform.toLowerCase())) {
      setError(`Another link already exists for platform "${platform}".`);
      return false;
    }

    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, platform, url } : item))
    );
    return true;
  };

  const deleteLink = async (id: string) => {
    setError(null);
    if (!window.confirm('Are you sure you want to delete this social link? This action cannot be undone.')) {
      return false;
    }

    setLoading(true);
    try {
      await socialLinksService.deleteLink(id);
      // Remove from states
      setInitialLinks((prev) => prev.filter((item) => item.id !== id));
      setLinks((prev) => prev.filter((item) => item.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return true;
    } catch (err) {
      console.error('[useSocialLinks] Delete error:', err);
      setError('Failed to delete social link from database.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if any links differ from initial values (length or values)
  const isDirty =
    initialLinks.length !== links.length ||
    links.some((link, idx) => {
      const init = initialLinks[idx];
      return !init || link.platform !== init.platform || link.url !== init.url;
    });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    for (const link of links) {
      if (!link.url || !link.url.trim()) {
        setError(`URL for ${link.platform} cannot be empty.`);
        setLoading(false);
        return;
      }
      if (!urlPattern.test(link.url)) {
        setError(`Invalid URL format for ${link.platform}: "${link.url}".`);
        setLoading(false);
        return;
      }
    }

    try {
      await socialLinksService.updateLinks(links);
      await fetchLinks(); // reload from database to sync IDs
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('[useSocialLinks] Save error:', err);
      setError('Failed to save changes to database.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setError(null);
    setLinks(initialLinks.map((item) => ({ ...item })));
  };

  return {
    loading,
    links,
    updateLinkUrl,
    addLink,
    editLink,
    deleteLink,
    isDirty,
    handleSave,
    handleDiscard,
    error,
    setError,
    success,
    setSuccess,
    refresh: fetchLinks
  };
};

export default useSocialLinks;
