import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function optionalEnv(name: string): string | null {
  return process.env[name] ?? null;
}

function createClientForCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, url: string, anonKey: string) {
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // In Server Components, Next may prevent setting cookies. Proxy handles session refresh.
        }
      }
    }
  });
}

export async function supabaseServer() {
  // Next.js 16 types `cookies()` as async in many contexts, while older versions are sync.
  // `await` works for both and prevents "Promise cookieStore" type errors.
  const cookieStore = await cookies();
  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClientForCookies(cookieStore, url, anonKey);
}

// Use this in pages that should show a friendly setup message instead of crashing
// when Supabase env vars are not configured (common on first Vercel deploy).
export async function supabaseServerOptional() {
  const cookieStore = await cookies();
  const url = optionalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = optionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) return null;

  return createClientForCookies(cookieStore, url, anonKey);
}
