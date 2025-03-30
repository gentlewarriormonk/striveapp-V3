import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Get Supabase URL and Anon Key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if the environment variables are set
  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  // Create and return the Supabase client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
} 