import { createBrowserClient } from './supabase/client';

// Helper to check if Supabase environment variables are properly configured
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    Boolean(url) &&
    Boolean(key) &&
    !url?.includes("your-project") &&
    !url?.includes("dummy") &&
    !key?.includes("dummy") &&
    !key?.includes("your-anon-key")
  );
};

// Singleton browser client instance
export const supabase = createBrowserClient();

// Re-export browser creator for client-side usage
export { createBrowserClient } from './supabase/client';
