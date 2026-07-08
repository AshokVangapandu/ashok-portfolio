import { useAuth } from './useAuth';

export interface UseAdminResult {
  isAdmin: boolean;
  isLoading: boolean;
  userEmail: string | null;
}

/**
 * Custom hook to verify if the currently signed-in user is an admin.
 * Reusable across dashboard routers, admin-only components, and actions.
 */
export const useAdmin = (): UseAdminResult => {
  const { user, isAdmin, isLoading } = useAuth();

  return {
    isAdmin,
    isLoading,
    userEmail: user?.email || null,
  };
};
