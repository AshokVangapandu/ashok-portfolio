/**
 * Utility to parse and normalize UTM campaign parameters from a URL query string.
 * Supports: utm_source, utm_medium, utm_campaign, utm_content, utm_term
 * 
 * Normalizes common source brand names (e.g., 'linkedin' -> 'LinkedIn') case-insensitively.
 * If no UTM parameters exist, returns all values as null and hasUTM as false.
 * 
 * @param {string} [searchString] Optional query string (defaults to window.location.search)
 * @returns {object} Object containing parsed parameters and hasUTM flag
 */
export function resolveUTMParameters(searchString, referrerString = '') {
  // Default to window.location.search if in browser context and searchString is not provided
  let query = searchString;
  if (typeof query !== 'string') {
    if (typeof window !== 'undefined' && window.location) {
      query = window.location.search || '';
    } else {
      query = '';
    }
  }

  // Ensure query starts with ? for URLSearchParams if it's not empty and doesn't have it
  if (query && !query.startsWith('?') && !query.startsWith('#')) {
    query = '?' + query;
  }

  const params = new URLSearchParams(query);
  
  const rawSource = params.get('utm_source');
  const rawMedium = params.get('utm_medium');
  const rawCampaign = params.get('utm_campaign');
  const rawContent = params.get('utm_content');
  const rawTerm = params.get('utm_term');

  const hasUTM = !!(rawSource || rawMedium || rawCampaign || rawContent || rawTerm);
  const ref = typeof referrerString === 'string' ? referrerString.trim() : '';

  if (!hasUTM) {
    return {
      source: null,
      sourceDisplay: null,
      medium: null,
      campaign: null,
      content: null,
      term: null,
      referrer: ref,
      hasUTM: false,
      hasReferrer: !!ref,
      attributionType: 'utm'
    };
  }

  // Source brand normalization map (case-insensitive keys)
  const SOURCE_DISPLAY_MAP = {
    'linkedin': 'LinkedIn',
    'github': 'GitHub',
    'google': 'Google Search',
    'bing': 'Bing',
    'twitter': 'X (Twitter)',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'youtube': 'YouTube',
    'email': 'Email',
    'resume': 'Resume',
    'qr': 'QR Code'
  };

  let rawCleanSource = rawSource ? rawSource.trim() : '';
  let internalSource = rawCleanSource.toLowerCase();
  let displaySource = rawCleanSource;

  if (internalSource) {
    if (SOURCE_DISPLAY_MAP[internalSource]) {
      displaySource = SOURCE_DISPLAY_MAP[internalSource];
    } else {
      // For any unknown sources, make a nice presentation label
      // E.g. Capitalize the first letter if it starts with a letter
      displaySource = rawCleanSource.charAt(0).toUpperCase() + rawCleanSource.slice(1);
    }
  } else {
    internalSource = null;
    displaySource = null;
  }

  return {
    source: internalSource,
    sourceDisplay: displaySource,
    medium: rawMedium ? rawMedium.trim() : null,
    campaign: rawCampaign ? rawCampaign.trim() : null,
    content: rawContent ? rawContent.trim() : null,
    term: rawTerm ? rawTerm.trim() : null,
    referrer: ref,
    hasUTM: true,
    hasReferrer: !!ref,
    attributionType: 'utm'
  };
}
