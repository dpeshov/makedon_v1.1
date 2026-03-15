import { Surface } from "@/ui/Surface";
import { ButtonLink } from "@/ui/Button";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getTableStatus(table: "businesses" | "cultural_clubs" | "sport_clubs") {
  try {
    const supabase = await supabaseServer();
    const res = await supabase.from(table).select("id").limit(1);
    if (res.error) return { ok: false, message: res.error.message };
    return { ok: true, message: "OK" };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Not configured" };
  }
}

function hasEnv(name: string) {
  return Boolean(process.env[name]);
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-emerald-700 font-semibold">✓</span>
  ) : (
    <span className="text-rose-700 font-semibold">✕</span>
  );
}

export default async function InfoPage() {
  const envOk = hasEnv("NEXT_PUBLIC_SUPABASE_URL") && hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const [businesses, culturalClubs, sportClubs] = await Promise.all([
    getTableStatus("businesses"),
    getTableStatus("cultural_clubs"),
    getTableStatus("sport_clubs")
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">Info</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          How this website works, how the database is structured, and how to configure admin approvals.
        </p>
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Supabase checklist</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-3">
            <span>Env: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`</span>
            <Check ok={envOk} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Table: `public.businesses`</span>
            <Check ok={businesses.ok} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Table: `public.cultural_clubs`</span>
            <Check ok={culturalClubs.ok} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Table: `public.sport_clubs`</span>
            <Check ok={sportClubs.ok} />
          </div>
        </div>

        {envOk && businesses.ok && culturalClubs.ok && sportClubs.ok ? (
          <p className="mt-4 text-sm text-emerald-700 font-semibold">All good.</p>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-900/10 bg-white/60 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">What’s missing</p>
            {!envOk ? <p className="mt-1">Add the public env vars to `.env.local` and redeploy (if on Vercel).</p> : null}
            {!businesses.ok || !culturalClubs.ok || !sportClubs.ok ? (
              <p className="mt-1">Run `supabase/schema.sql` then `supabase/auth.sql` in the Supabase SQL editor.</p>
            ) : null}
          </div>
        )}
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">How approvals work</h2>
        <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-slate-700">
          <li>Users must sign in to submit.</li>
          <li>New submissions are stored with `approval_status = 'pending'`.</li>
          <li>Only approved rows are visible on public listing pages.</li>
          <li>Admins can approve/reject from `/admin`.</li>
        </ul>
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Make yourself admin</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          1) Create an account in `/login`. 2) After your first login, a row is created in `public.profiles`. 3) In
          Supabase Table Editor, set your `profiles.role` to `admin`.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/login" variant="primary">
            Sign in / Sign up
          </ButtonLink>
          <ButtonLink href="/account">Account</ButtonLink>
        </div>
      </Surface>
    </div>
  );
}
