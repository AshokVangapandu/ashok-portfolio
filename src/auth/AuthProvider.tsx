import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { authService } from './authService';
import { parseAuthError } from './errors';
import { supabase } from '../services/supabase/client';

// Initialize context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Global Authentication Context Provider.
 * Restores sessions on refresh, handles oauth loading spinners,
 * captures authentication events, and handles console logging logs on login.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prevUserIdRef = useRef<string | null>(null);
  const clearError = () => setError(null);

  // Monitor user state transitions to print verification details in browser console
  useEffect(() => {
    if (user && user.id !== prevUserIdRef.current) {
      prevUserIdRef.current = user.id;
      console.log('[Auth Verification] User authenticated:', {
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        id: user.id
      });
    } else if (!user) {
      prevUserIdRef.current = null;
    }
  }, [user]);

  const checkAdminPrivilege = async (email: string): Promise<boolean> => {
    const cached = sessionStorage.getItem(`is_admin_${email}`);
    console.log('Checking Admin Privilege for Email:', email);

    if (cached !== null) {
      console.log('[AuthProvider] Loaded admin status from session storage cache:', cached);
      return cached === 'true';
    }

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('email, role, is_active')
        .eq('email', email)
        .maybeSingle();

      console.log('Admin Query Result:', { data, error });

      if (error) {
        console.error('[AuthProvider] Supabase query failed:', error);
        throw error;
      }

      const isUserAdmin = data !== null && data.is_active === true;
      sessionStorage.setItem(`is_admin_${email}`, String(isUserAdmin));
      return isUserAdmin;
    } catch (err: any) {
      console.error('[AuthProvider] Failed to verify administrator privilege claims:', err);
      return false;
    }
  };

  useEffect(() => {
    let active = true;

    // Restore active session on mount (Step 8)
    const restoreSession = async () => {
      try {
        const currentSession = await authService.getCurrentSession();
        if (currentSession && active) {
          setSession(currentSession);
          setUser(currentSession.user);
          if (currentSession.user?.email) {
            const isUserAdmin = await checkAdminPrivilege(currentSession.user.email);
            if (active) {
              setIsAdmin(isUserAdmin);
            }
          }
        }
      } catch (err: any) {
        if (active) {
          setError(parseAuthError(err).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    // Subscribe to session state changes (Step 3)
    const subscription = authService.onAuthStateChange(async (event, currentSession) => {
      if (!active) return;
      
      console.log(`[AuthProvider] Auth state event: ${event}`);
      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);
      
      if (currentUser?.email) {
        const isUserAdmin = await checkAdminPrivilege(currentUser.email);
        if (active) {
          setIsAdmin(isUserAdmin);
        }

        if (isUserAdmin && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          const name = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Google User';
          const avatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null;
          
          try {
            await (supabase as any)
              .from('admins')
              .update({
                last_login: new Date().toISOString(),
                status: 'Active',
                full_name: name,
                avatar_url: avatar
              })
              .eq('email', currentUser.email);
            sessionStorage.removeItem(`is_admin_${currentUser.email}`);
          } catch (updateErr) {
            console.error('[AuthProvider] Failed to update admin metadata:', updateErr);
          }
        }
      } else {
        if (active) {
          setIsAdmin(false);
        }
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('is_admin_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      active = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.error) {
        setError(parseAuthError(res.error).message);
        return { error: res.error };
      }
      return { error: null };
    } catch (err: any) {
      const parsed = parseAuthError(err);
      setError(parsed.message);
      return { error: err as AuthError };
    } finally {
      // In OAuth flow, the page will redirect, but we set loading to false in case it doesn't
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('is_admin_')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      const res = await authService.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      if (res.error) {
        setError(parseAuthError(res.error).message);
        return { error: res.error };
      }
      return { error: null };
    } catch (err: any) {
      const parsed = parseAuthError(err);
      setError(parsed.message);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return { error: err as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isLoading = loading;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading,
        isAdmin,
        isAuthenticated,
        signIn,
        signOut,
        login: signIn,
        logout: signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
