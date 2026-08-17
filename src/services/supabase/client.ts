import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../../lib/supabase/types';

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (_) {}
  if (typeof window !== 'undefined' && (window as any).APP_CONFIG && (window as any).APP_CONFIG[key.replace('VITE_SUPABASE_', 'SUPABASE_')]) {
    return (window as any).APP_CONFIG[key.replace('VITE_SUPABASE_', 'SUPABASE_')];
  }
  if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process?.env && (globalThis as any).process.env[key]) {
    return (globalThis as any).process.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

const isValidSupabaseConfig = (url: string, key: string): boolean => {
  if (!url || !key) return false;
  if (url.startsWith('%VITE_') || url.includes('%') || key.startsWith('%VITE_') || key.includes('%')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const createDummyClient = (): any => {
  const dummyPromise = Promise.resolve({ data: null, error: new Error('Supabase Client not configured.') });

  const chainableHandler = {
    get(target: any, prop: string | symbol): any {
      if (prop === 'then') {
        return (onfulfilled: any) => {
          return Promise.resolve({ data: null, error: null }).then(onfulfilled);
        };
      }
      
      if (prop === 'auth') {
        return new Proxy({}, {
          get(_, authProp) {
            if (authProp === 'onAuthStateChange') {
              return () => ({ data: { subscription: { unsubscribe: () => {} } } });
            }
            if (authProp === 'getSession') {
              return () => Promise.resolve({ data: { session: null }, error: null });
            }
            if (authProp === 'getUser') {
              return () => Promise.resolve({ data: { user: null }, error: null });
            }
            return () => dummyPromise;
          }
        });
      }

      return () => new Proxy({}, chainableHandler);
    }
  };

  return new Proxy({}, chainableHandler);
};

let clientInstance: SupabaseClient<Database>;

if (isValidSupabaseConfig(supabaseUrl, supabaseAnonKey)) {
  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '[Portfolio]\n\nSupabase disabled.\n\nReason:\nInvalid configuration.\n\nThe website will continue running with fallback behaviour.'
  );
  clientInstance = createDummyClient() as SupabaseClient<Database>;
}

export const supabase = clientInstance;
