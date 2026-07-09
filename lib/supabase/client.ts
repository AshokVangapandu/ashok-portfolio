// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txoszrnjkrlbjzpjisvp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
