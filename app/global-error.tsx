"use client";

import { useEffect } from "react";
import { Button } from "@/ui/Button";

export default function GlobalError({
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

  return (
    <html>
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
          <div className="w-full rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
            <h1 className="text-3xl font-semibold tracking-tight [font-family:var(--font-heading)]">
              Something went wrong
            </h1>
            <p className="mt-3 text-slate-200">A server-side exception occurred.</p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="text-sm font-semibold text-slate-100">Details</div>
              <div className="mt-1 break-words font-mono text-xs text-slate-200">{message}</div>
              {error?.digest ? <div className="mt-2 text-xs text-slate-300">Digest: {error.digest}</div> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={reset}>
                Try again
              </Button>
              <a className="rounded-full px-4 py-2 text-sm font-semibold text-slate-100 underline underline-offset-4" href="/info">
                Setup checklist
              </a>
              <a className="rounded-full px-4 py-2 text-sm font-semibold text-slate-100 underline underline-offset-4" href="/">
                Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

