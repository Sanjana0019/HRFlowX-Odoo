import { createClient } from "@supabase/supabase-js";

// Supabase client instance using environment variables if provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hrflowx-hrms-demo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy")
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
