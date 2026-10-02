import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tubnwdidtqovuunwzvkw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ljpESmJLs9bXplcrxF6PZg_phNDg1uh';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export function createClient() {
  return isSupabaseConfigured ? createBrowserClient(supabaseUrl!, supabaseKey!) : null;
}
