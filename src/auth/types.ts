import { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * Interface representing an administrative user registry entry.
 */
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  role: 'admin' | 'super_admin';
}

/**
 * AuthContext state definition.
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  login: () => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  error: string | null;
  clearError: () => void;
}
