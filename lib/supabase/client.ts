import { createClient } from "@supabase/supabase-js";

function requiredPublicEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export function supabaseBrowser() {
  const url = requiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anonKey);
}

