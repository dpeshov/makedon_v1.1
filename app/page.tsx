import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getDatabaseStatus() {
  try {
    const supabase = supabaseAdmin();
    const res = await supabase.from("businesses").select("id").limit(1);
    if (res.error) return { ok: false, message: res.error.message };
    return { ok: true, message: "Connected" };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Not configured" };
  }
}

export default async function Home() {
  const status = await getDatabaseStatus();

  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)] sm:text-4xl">
            Macedonian Diaspora Directory
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Browse businesses, cultural clubs, and sport clubs around the world — and register new entries in a minute.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/businesses"
              className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90"
            >
              View businesses
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
            Database (Supabase)
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Status:{" "}
            <span className={status.ok ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
              {status.ok ? "Connected" : "Not connected"}
            </span>
            {!status.ok ? <span className="text-slate-500"> — {status.message}</span> : null}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-red/10 bg-brand-yellow/10 p-5">
              <p className="text-sm font-semibold text-slate-900">1) Create the table</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                In Supabase SQL editor, create the <span className="font-semibold">public.businesses</span> table (see{" "}
                <span className="font-semibold">README</span>).
              </p>
            </div>
            <div className="rounded-2xl border border-brand-red/10 bg-brand-yellow/10 p-5">
              <p className="text-sm font-semibold text-slate-900">2) Set env vars</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Add <span className="font-semibold">SUPABASE_URL</span> and{" "}
                <span className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</span> to <span className="font-semibold">
                  .env.local
                </span>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-brand-red/10 bg-brand-yellow/10 p-5">
              <p className="text-sm font-semibold text-slate-900">3) Optional demo data</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Run <span className="font-semibold">supabase/seed.sql</span> to insert demo businesses.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-red/10 bg-brand-yellow/10 p-5">
              <p className="text-sm font-semibold text-slate-900">4) Browse listings</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white" href="/businesses">
                  Businesses
                </Link>
                <Link
                  className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25"
                  href="/cultural-clubs"
                >
                  Cultural clubs
                </Link>
                <Link
                  className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25"
                  href="/sport-clubs"
                >
                  Sport clubs
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Security note: the Supabase service role key is used only on the server. Never expose it to the browser.
          </p>
        </div>
      </div>
    </div>
  );
}

