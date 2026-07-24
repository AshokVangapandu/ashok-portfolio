// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || import.meta.env.VITE_SUPABASE_URL || (typeof window !== 'undefined' && (window as any).APP_CONFIG?.SUPABASE_URL) || '';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof window !== 'undefined' && (window as any).APP_CONFIG?.SUPABASE_ANON_KEY) || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
