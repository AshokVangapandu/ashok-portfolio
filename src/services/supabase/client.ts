import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../lib/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are missing. ' +
    'Please configure them in your .env file.'
  );
}

// Reusable, single-instance Supabase Client
export const supabase = createClient<Database>(
  supabaseUrl || 'https://txoszrnjkrlbjzpjisvp.supabase.co',
  supabaseAnonKey || 'sb_publishable_DS3aReX7DKPTUeFrfndvAQ_4p7QTYfB'
);
