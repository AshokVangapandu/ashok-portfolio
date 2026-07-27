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
      const REQUIRED_PLATFORMS = ['linkedin', 'github', 'behance', 'email', 'whatsapp', 'instagram'];
      const data = await socialLinksService.getLinks();
      
      // Enforce that exactly the 6 required platforms exist in hook state, initializing missing ones.
      const mappedData: SocialLink[] = REQUIRED_PLATFORMS.map((platform) => {
        const found = data.find((item) => item.platform.toLowerCase() === platform);
        return found || {
          id: `temp-${platform}`,
          platform: platform,
          url: ''
        };
      });

      setInitialLinks(mappedData);
      setLinks(mappedData.map((item) => ({ ...item })));
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

  // Check if any URLs differ from their initial database values
  const isDirty =
    initialLinks.length !== links.length ||
    links.some((link, idx) => {
      const init = initialLinks[idx];
      return !init || link.url !== init.url;
    });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

    const isValidUrl = (urlStr: string): boolean => {
      try {
        const hasProtocol = /^https?:\/\//i.test(urlStr);
        new URL(hasProtocol ? urlStr : `https://${urlStr}`);
        return true;
      } catch {
        return false;
      }
    };

    for (const link of links) {
      const trimmedUrl = link.url ? link.url.trim() : '';
      if (!trimmedUrl) {
        // Empty is allowed, it will just disable/hide it on the public portfolio
        continue;
      }

      if (link.platform === 'email') {
        const cleanEmail = trimmedUrl.startsWith('mailto:') ? trimmedUrl.substring(7) : trimmedUrl;
        if (!emailPattern.test(cleanEmail) && !isValidUrl(trimmedUrl)) {
          setError(`Invalid format for Email: "${trimmedUrl}". Must be a valid email or URL.`);
          setLoading(false);
          return;
        }
      } else if (!isValidUrl(trimmedUrl)) {
        setError(`Invalid URL format for ${link.platform}: "${trimmedUrl}".`);
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
