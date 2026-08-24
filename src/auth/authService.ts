import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabase/client';

export const authService = {
  /**
   * Starts the Google OAuth sign-in flow.
   * Redirects the user to Google login, and returns back to the host page origin.
   */
  async signInWithGoogle(): Promise<{ data: any; error: AuthError | null }> {
    const redirectTo = window.location.origin + window.location.pathname;
    const baseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://xpuhbtsgwhgbcvmwzlyd.supabase.co';
    const fallbackUrl = `${baseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

    try {
      console.log('[authService] Initiating Google OAuth with redirectTo:', redirectTo);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true
        },
      });

      if (error) {
        console.error('[authService] Google OAuth SDK returned error:', error);
      }

      const targetUrl = data?.url || fallbackUrl;
      console.log('[authService] Navigating browser to Google OAuth URL:', targetUrl);
      window.location.href = targetUrl;
      return { data, error: null };
    } catch (err: any) {
      console.error('[authService] Exception during Google OAuth, using direct endpoint redirect:', err);
      window.location.href = fallbackUrl;
      return { data: null, error: null };
    }
  },

  /**
   * Logs out the current user session from Supabase.
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err: any) {
      return { error: err as AuthError };
    }
  },

  /**
   * Retrieves the current user's authenticated details.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return null;
      }
      return user;
    } catch (err) {
      console.error('[authService] Error fetching user profile:', err);
      return null;
    }
  },

  /**
   * Retrieves the current active user session.
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        return null;
      }
      return session;
    } catch (err) {
      console.error('[authService] Error fetching session token:', err);
      return null;
    }
  },

  /**
   * Subscribes to changes in authentication states (login, logout, token refresh).
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  /**
   * Queries admin role mapping.
   * Disabled in Phase 2 as per requirements.
   */
  async checkAdmin(_userId: string): Promise<boolean> {
    // Disabled in Phase 2
    return false;
  }
};
