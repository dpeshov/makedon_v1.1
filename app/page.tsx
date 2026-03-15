import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";
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
    <div className="flex flex-col gap-6">
      <Surface className="overflow-hidden p-7 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-red">MVP directory</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)] sm:text-4xl">
              Macedonian diaspora listings, in one place.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Browse businesses, cultural clubs, and sport clubs worldwide — and register a new entry in minutes.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href="/businesses" variant="primary">
                View businesses
              </ButtonLink>
              <ButtonLink href="/cultural-clubs">Cultural clubs</ButtonLink>
              <ButtonLink href="/sport-clubs">Sport clubs</ButtonLink>
              <ButtonLink href="/register" variant="ghost">
                Register
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[28rem]">
            <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Database</p>
              <p className="mt-2 text-sm text-slate-700">
                <span className={status.ok ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
                  {status.ok ? "Connected" : "Not connected"}
                </span>
                {!status.ok ? <span className="text-slate-500"> — {status.message}</span> : null}
              </p>
              <p className="mt-2 text-xs text-slate-500">Supabase table: public.businesses</p>
            </div>
            <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick start</p>
              <p className="mt-2 text-sm text-slate-700">Create table → set env vars → browse listings.</p>
              <p className="mt-2 text-xs text-slate-500">Details in README.</p>
            </div>
          </div>
        </div>
      </Surface>

      <Surface className="p-7 sm:p-10">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Supabase setup
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-6">
            <p className="text-sm font-semibold text-slate-900">1) Create the table</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use the SQL from the project README to create <span className="font-semibold">public.businesses</span>.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-6">
            <p className="text-sm font-semibold text-slate-900">2) Add env vars</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Set <span className="font-semibold">SUPABASE_URL</span> and{" "}
              <span className="font-semibold">SUPABASE_SERVICE_ROLE_KEY</span> in <span className="font-semibold">
                .env.local
              </span>
              .
            </p>
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-6">
            <p className="text-sm font-semibold text-slate-900">3) Seed demo data (optional)</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Run <span className="font-semibold">supabase/seed.sql</span> in the Supabase SQL editor.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-6">
            <p className="text-sm font-semibold text-slate-900">4) Start browsing</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href="/businesses" variant="primary">
                Businesses
              </ButtonLink>
              <ButtonLink href="/cultural-clubs">Cultural clubs</ButtonLink>
              <ButtonLink href="/sport-clubs">Sport clubs</ButtonLink>
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Security note: the Supabase service role key must stay server-side (never use a <span className="font-semibold">
            NEXT_PUBLIC_
          </span>{" "}
          env var for it).
        </p>
      </Surface>
    </div>
  );
}

