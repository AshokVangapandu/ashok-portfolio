import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../lib/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof window !== 'undefined' && (window as any).APP_CONFIG?.SUPABASE_URL) || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof window !== 'undefined' && (window as any).APP_CONFIG?.SUPABASE_ANON_KEY) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are missing. ' +
    'Please configure them in your .env file.'
  );
  throw new Error('Supabase client credentials are not configured.');
}

// Reusable, single-instance Supabase Client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
