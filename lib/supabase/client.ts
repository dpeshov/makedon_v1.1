import { createClient } from "@supabase/supabase-js";

export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Avoid throwing during prerender/build. Call sites should handle null.
  if (!url || !anonKey) return null;

  return createClient(url, anonKey);
}

