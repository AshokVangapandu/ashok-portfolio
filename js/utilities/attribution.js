import { resolveUTMParameters } from './utm.js';
import { resolveReferrer } from './referrer.js';

/**
 * Resolves the traffic source attribution using priority rules:
 * 1. UTM parameters (if present)
 * 2. Referrer detection (if present)
 * 3. Direct access (fallback)
 * 
 * @param {string} [referrerString] Optional referrer URL (defaults to document.referrer)
 * @param {string} [searchString] Optional query string (defaults to window.location.search)
 * @returns {object} Normalized attribution object containing source, medium, campaign, content, term, referrer, and flags.
 */
export function resolveTrafficSource(referrerString, searchString) {
  // 1. Resolve UTM Parameters first
  const utm = resolveUTMParameters(searchString, referrerString);
  if (utm.hasUTM) {
    return utm;
  }

  // 2. Resolve Referrer second
  const referrer = resolveReferrer(referrerString);
  if (referrer.hasReferrer) {
    return referrer;
  }

  // 3. Fallback to Direct
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
