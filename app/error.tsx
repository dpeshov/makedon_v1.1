"use client";

import { useEffect } from "react";
import { Button } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  const message = error?.message ?? "Unknown error";
  const looksLikeSupabaseEnv =
    message.includes("Missing env var: NEXT_PUBLIC_SUPABASE_URL") ||
    message.includes("Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    message.includes("NEXT_PUBLIC_SUPABASE_URL") ||
    message.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return (
    <Surface className="mx-auto max-w-2xl p-7 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
        Application error
      </h1>

      {looksLikeSupabaseEnv ? (
        <>
          <p className="mt-3 text-slate-700">Supabase environment variables are missing for this deployment.</p>
          <p className="mt-2 text-sm text-slate-600">
            Set <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
            <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> in Vercel, then redeploy.
          </p>
        </>
      ) : (
        <p className="mt-3 text-slate-700">A server-side exception occurred while loading this page.</p>
      )}

      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
        <div className="font-semibold">Details</div>
        <div className="mt-1 break-words font-mono text-xs">{message}</div>
        {error?.digest ? <div className="mt-2 text-xs text-rose-800">Digest: {error.digest}</div> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <a className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 underline underline-offset-4" href="/info">
          Setup checklist
        </a>
        <a className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 underline underline-offset-4" href="/">
          Home
        </a>
      </div>
    </Surface>
  );
}

