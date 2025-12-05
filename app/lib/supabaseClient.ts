 import { createClient } from '@supabase/supabase-js';

let supabase: any;

export function getSupabaseBrowserClient() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url) throw new Error('SUPABASE_URL is not set in the environment.');
    if (!anon) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in the environment.');

    supabase = createClient(url, anon);
  }
  return supabase;
}
