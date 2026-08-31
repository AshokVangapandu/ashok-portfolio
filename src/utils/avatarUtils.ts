import { User } from '@supabase/supabase-js';

/**
 * Robust helper to extract or construct a user's avatar image URL.
 * Checks user metadata (avatar_url, picture, avatar), identities data,
 * and falls back to an unavatar/gravatar lookup using the user's email if no direct image link is present.
 */
export function getUserAvatarUrl(user?: User | null, fallbackEmail?: string | null): string | null {
  if (!user && !fallbackEmail) return null;

  // 1. Inspect user.user_metadata
  if (user?.user_metadata) {
    const meta = user.user_metadata;
    if (meta.avatar_url && typeof meta.avatar_url === 'string' && meta.avatar_url.trim()) {
      return meta.avatar_url.trim();
    }
    if (meta.picture && typeof meta.picture === 'string' && meta.picture.trim()) {
      return meta.picture.trim();
    }
    if (meta.avatar && typeof meta.avatar === 'string' && meta.avatar.trim()) {
      return meta.avatar.trim();
    }
    if (meta.photoURL && typeof meta.photoURL === 'string' && meta.photoURL.trim()) {
      return meta.photoURL.trim();
    }
  }

  // 2. Inspect user.identities
  if (Array.isArray(user?.identities)) {
    for (const identity of user.identities) {
      const idData = identity?.identity_data;
      if (idData) {
        if (idData.avatar_url && typeof idData.avatar_url === 'string' && idData.avatar_url.trim()) {
          return idData.avatar_url.trim();
        }
        if (idData.picture && typeof idData.picture === 'string' && idData.picture.trim()) {
          return idData.picture.trim();
        }
        if (idData.avatar && typeof idData.avatar === 'string' && idData.avatar.trim()) {
          return idData.avatar.trim();
        }
      }
    }
  }

  // 3. Fallback: generate unavatar.io URL using email if available
  const email = user?.email || fallbackEmail;
  if (email && typeof email === 'string' && email.includes('@')) {
    const cleanEmail = email.trim().toLowerCase();
    return `https://unavatar.io/${encodeURIComponent(cleanEmail)}?fallback=false`;
  }

  return null;
}
