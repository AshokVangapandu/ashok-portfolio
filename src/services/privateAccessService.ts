/* src/services/privateAccessService.ts */
import { supabase } from './supabase/client';

const SESSION_KEY = 'portfolio_private_session';

export interface PrivateSession {
  email: string;
  token: string;
  verifiedAt: string;
}

export interface AccessVerificationResult {
  success: boolean;
  message?: string;
}

export const privateAccessService = {
  hasValidSession(): boolean {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }

    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;

      const parsed: PrivateSession = JSON.parse(raw);
      return Boolean(parsed && parsed.email && parsed.token);
    } catch (err) {
      console.warn('[privateAccessService] Error reading session:', err);
      return false;
    }
  },

  getSession(): PrivateSession | null {
    if (!this.hasValidSession()) return null;
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  async verifyAccess(email: string): Promise<AccessVerificationResult> {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }

    try {
      const { data: hasAccess, error } = await (supabase as any)
        .rpc('verify_private_access', { p_email: cleanEmail });

      if (error) {
        console.error('[privateAccessService] Database lookup error:', error);
        return {
          success: false,
          message: 'Unable to verify access at this time. Please try again later.'
        };
      }

      if (hasAccess === true) {
        // Store session in sessionStorage
        const session: PrivateSession = {
          email: cleanEmail,
          token: btoa(`${cleanEmail}:${Date.now()}`),
          verifiedAt: new Date().toISOString()
        };

        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }

        return { success: true };
      }

      // Generic unauthorized message (does not leak email existence)
      return {
        success: false,
        message: "This email isn't authorized to access this portfolio. If you believe this is a mistake, please request access."
      };
    } catch (err: any) {
      console.error('[privateAccessService] Unexpected verification error:', err);
      return {
        success: false,
        message: 'An unexpected error occurred while verifying access. Please try again.'
      };
    }
  },

  clearSession(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }
};

export default privateAccessService;
