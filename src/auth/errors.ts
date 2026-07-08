/**
 * Auth Error Codes for structured categorisation.
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',
  ACCESS_DENIED_NON_ADMIN = 'ACCESS_DENIED_NON_ADMIN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Standardised Auth Error structure.
 */
export interface AppAuthError {
  code: AuthErrorCode;
  message: string;
  originalError?: any;
}

/**
 * Translates Supabase/Postgres errors or generic JS errors into user-friendly messages and error codes.
 */
export function parseAuthError(error: any): AppAuthError {
  if (!error) {
    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: 'An unknown authentication error occurred.',
    };
  }

  // Handle case where error is already an AppAuthError
  if (typeof error === 'object' && 'code' in error && 'message' in error) {
    return error as AppAuthError;
  }

  const message = error.message || String(error);
  const status = error.status;

  // Pattern match common Supabase auth messages
  if (message.includes('Invalid login credentials') || message.includes('invalid_grant')) {
    return {
      code: AuthErrorCode.INVALID_CREDENTIALS,
      message: 'Invalid email or password. Please verify your credentials and try again.',
      originalError: error,
    };
  }

  if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
    return {
      code: AuthErrorCode.EMAIL_NOT_CONFIRMED,
      message: 'Your email address has not been confirmed yet. Please check your inbox.',
      originalError: error,
    };
  }

  if (message.includes('User not found') || message.includes('user_not_found')) {
    return {
      code: AuthErrorCode.USER_NOT_FOUND,
      message: 'No account was found matching this email address.',
      originalError: error,
    };
  }

  if (message.includes('JWT') || message.includes('token') || message.includes('session')) {
    return {
      code: AuthErrorCode.SESSION_EXPIRED,
      message: 'Your session has expired. Please sign in again.',
      originalError: error,
    };
  }

  if (message.includes('Failed to fetch') || message.includes('network') || status === 0) {
    return {
      code: AuthErrorCode.NETWORK_ERROR,
      message: 'Network connection lost. Please check your internet and try again.',
      originalError: error,
    };
  }

  return {
    code: AuthErrorCode.UNKNOWN_ERROR,
    message: message || 'An unexpected authentication error occurred.',
    originalError: error,
  };
}

/**
 * Centrally triggers notifications for authentication errors without using raw browser alerts.
 * Utilises the portfolio's custom window-scoped glassmorphism toast notify system if active.
 */
export function notifyAuthError(error: any, customTitle = 'Authentication Error'): void {
  const parsed = parseAuthError(error);
  console.error(`[AuthError] [${parsed.code}]:`, parsed.originalError || parsed.message);

  // Safely trigger the portfolio's premium glassmorphism toast notify
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast('error', customTitle, parsed.message, 6000);
  } else {
    // Fallback logging in console
    console.warn('[Toast Fallback]', customTitle, parsed.message);
  }
}

/**
 * Triggers a success notification.
 */
export function notifyAuthSuccess(message: string, title = 'Success'): void {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast('success', title, message, 4000);
  } else {
    console.info('[Toast Fallback]', title, message);
  }
}
