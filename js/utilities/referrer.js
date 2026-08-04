/**
 * Utility to parse and normalize browser referrer domains into standard traffic sources.
 * Supports: LinkedIn, GitHub, Google Search, Bing, DuckDuckGo, Reddit, X (Twitter), Facebook, Instagram, YouTube, Telegram.
 * 
 * @param {string} [referrerString] Optional referrer URL (defaults to document.referrer)
 * @returns {object} Object containing resolved source, raw referrer, and hasReferrer flag
 */
export function resolveReferrer(referrerString) {
  // Default to document.referrer if in browser context and referrerString is not provided
  let ref = referrerString;
  if (typeof ref !== 'string') {
    if (typeof document !== 'undefined') {
      ref = document.referrer || '';
    } else {
      ref = '';
    }
  }

  ref = ref.trim();

  if (!ref) {
    return {
      source: 'direct',
      sourceDisplay: 'Direct',
      medium: null,
      campaign: null,
      content: null,
      term: null,
      referrer: '',
      hasUTM: false,
      hasReferrer: false,
      attributionType: 'direct'
    };
  }

  let hostname = '';
  try {
    const url = new URL(ref);
    hostname = url.hostname.toLowerCase();
  } catch (e) {
    // Fallback if not a fully valid URL (e.g. just domain passed in tests)
    hostname = ref.split('/')[0].toLowerCase();
  }

  // Remove leading 'www.' if present for uniform parsing
  const cleanHost = hostname.replace(/^www\./, '');

  // Define patterns and their associated sources & mediums
  const rules = [
    {
      test: (host) => /^(?:.*\.)?linkedin\.[a-z.]+$/.test(host),
      source: 'linkedin',
      sourceDisplay: 'LinkedIn',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?github\.com$/.test(host),
      source: 'github',
      sourceDisplay: 'GitHub',
      medium: 'referral'
    },
    {
      test: (host) => /^(?:.*\.)?google\.[a-z.]+$/.test(host),
      source: 'google',
      sourceDisplay: 'Google Search',
      medium: 'organic'
    },
    {
      test: (host) => /^(?:.*\.)?bing\.com$/.test(host),
      source: 'bing',
      sourceDisplay: 'Bing',
      medium: 'organic'
    },
    {
      test: (host) => /^(?:.*\.)?duckduckgo\.com$/.test(host),
      source: 'duckduckgo',
      sourceDisplay: 'DuckDuckGo',
      medium: 'organic'
    },
    {
      test: (host) => /^(?:.*\.)?reddit\.com$/.test(host),
      source: 'reddit',
      sourceDisplay: 'Reddit',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?(?:twitter\.com|x\.com|t\.co)$/.test(host),
      source: 'twitter',
      sourceDisplay: 'X (Twitter)',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?facebook\.com$/.test(host),
      source: 'facebook',
      sourceDisplay: 'Facebook',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?instagram\.com$/.test(host),
      source: 'instagram',
      sourceDisplay: 'Instagram',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?youtube\.com$/.test(host),
      source: 'youtube',
      sourceDisplay: 'YouTube',
      medium: 'social'
    },
    {
      test: (host) => /^(?:.*\.)?t\.me$/.test(host),
      source: 'telegram',
      sourceDisplay: 'Telegram',
      medium: 'social'
    }
  ];

  for (const rule of rules) {
    if (rule.test(cleanHost)) {
      return {
        source: rule.source,
        sourceDisplay: rule.sourceDisplay,
        medium: rule.medium,
        campaign: null,
        content: null,
        term: null,
        referrer: ref,
        hasUTM: false,
        hasReferrer: true,
        attributionType: 'referrer'
      };
    }
  }

  // Fallback for any unknown non-empty host
  return {
    source: 'referral',
    sourceDisplay: `Referral (${cleanHost})`,
    medium: 'referral',
    campaign: null,
    content: null,
    term: null,
    referrer: ref,
    hasUTM: false,
    hasReferrer: true,
    attributionType: 'referrer'
  };
}
