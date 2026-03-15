import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function hasEnv(name: string) {
  return Boolean(process.env[name]);
}

async function getTableStatus(table: "businesses" | "cultural_clubs" | "sport_clubs") {
  try {
    const supabase = supabaseAdmin();
    const res = await supabase.from(table).select("id").limit(1);
    if (res.error) return { ok: false, message: res.error.message };
    return { ok: true, message: "OK" };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Not configured" };
  }
}

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-600/20">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.01 7.06a1 1 0 0 1-1.42.003L3.29 8.82a1 1 0 1 1 1.42-1.4l3.264 3.31 6.3-6.35a1 1 0 0 1 1.43-.09z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  ) : (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500/15 text-rose-700 ring-1 ring-rose-600/20">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 0 1 1.06 0L10 7.94l2.66-2.72a.75.75 0 1 1 1.08 1.04L11.08 9l2.66 2.74a.75.75 0 1 1-1.08 1.04L10 10.06l-2.66 2.72a.75.75 0 1 1-1.08-1.04L8.92 9 6.28 6.26a.75.75 0 0 1 0-1.04z" />
      </svg>
    </span>
  );
}

export default async function Home() {
  const [businesses, culturalClubs, sportClubs] = await Promise.all([
    getTableStatus("businesses"),
    getTableStatus("cultural_clubs"),
    getTableStatus("sport_clubs")
  ]);

  const allOk = businesses.ok && culturalClubs.ok && sportClubs.ok;
  const envOk = hasEnv("SUPABASE_URL") && hasEnv("SUPABASE_SERVICE_ROLE_KEY");

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
              <div className="mt-3 grid gap-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <StatusIcon ok={envOk} />
                    <div>
                      <p className="font-semibold text-slate-900">Environment variables</p>
                      <p className="text-xs leading-5 text-slate-500">SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY</p>
                    </div>
                  </div>
                  <span className={envOk ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                    {envOk ? "OK" : "Missing"}
                  </span>
                </div>

                {[
                  { label: "Businesses table", value: businesses, table: "public.businesses" },
                  { label: "Cultural clubs table", value: culturalClubs, table: "public.cultural_clubs" },
                  { label: "Sport clubs table", value: sportClubs, table: "public.sport_clubs" }
                ].map((row) => (
                  <div key={row.table} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <StatusIcon ok={row.value.ok} />
                      <div>
                        <p className="font-semibold text-slate-900">{row.label}</p>
                        <p className="text-xs leading-5 text-slate-500">{row.table}</p>
                      </div>
                    </div>
                    <span className={row.value.ok ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                      {row.value.ok ? "OK" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>

              {!envOk || !allOk ? (
                <div className="mt-4 rounded-2xl border border-slate-900/10 bg-white/60 px-4 py-3 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">What to do</p>
                  {!envOk ? <p className="mt-1">Add env vars in `.env.local` (see README).</p> : null}
                  {!allOk ? (
                    <p className="mt-1">
                      Run <span className="font-semibold">supabase/schema.sql</span> in the Supabase SQL editor.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">Supabase setup looks good.</p>
              )}
            </div>
            <div className="rounded-3xl border border-slate-900/10 bg-white/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick start</p>
              <p className="mt-2 text-sm text-slate-700">Create tables → set env vars → browse listings.</p>
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
            <p className="text-sm font-semibold text-slate-900">1) Create the tables</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Run <span className="font-semibold">supabase/schema.sql</span> in the Supabase SQL editor to create{" "}
              <span className="font-semibold">public.businesses</span>, <span className="font-semibold">public.cultural_clubs</span>,
              and <span className="font-semibold">public.sport_clubs</span>.
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
              Run <span className="font-semibold">supabase/seed.sql</span> in the Supabase SQL editor (businesses only).
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
          Security note: the Supabase service role key must stay server-side (never use a{" "}
          <span className="font-semibold">NEXT_PUBLIC_</span> env var for it).
        </p>
      </Surface>
    </div>
  );
}
