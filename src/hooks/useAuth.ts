import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { AuthContextType } from '../auth/types';

/**
 * Custom hook to consume the global AuthContext.
 * Throws an error if used outside an AuthProvider wrapper.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
