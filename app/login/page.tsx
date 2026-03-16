"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = supabaseBrowser();
      if (!supabase) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");

      if (mode === "signup") {
        const res = await supabase.auth.signUp({ email, password });
        if (res.error) throw res.error;
      } else {
        const res = await supabase.auth.signInWithPassword({ email, password });
        if (res.error) throw res.error;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Surface className="mx-auto max-w-md p-7 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
        {mode === "signup" ? "Create account" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {mode === "signup"
          ? "Create an account to register listings and edit your submissions."
          : "Sign in to register listings and manage your submissions."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        {mode === "signup" ? (
          <button type="button" className="font-semibold underline underline-offset-4" onClick={() => setMode("signin")}>
            Already have an account? Sign in
          </button>
        ) : (
          <button type="button" className="font-semibold underline underline-offset-4" onClick={() => setMode("signup")}>
            New here? Create an account
          </button>
        )}
      </div>
    </Surface>
  );
}
