import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';

export function createBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hrflowx-demo.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

  return createSSRBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Alias export for flexibility
export const createClient = createBrowserClient;
