import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Surface } from "@/ui/Surface";
import { ButtonLink } from "@/ui/Button";

export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "approved"
      ? "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20"
      : status === "rejected"
        ? "bg-rose-500/15 text-rose-700 ring-rose-600/20"
        : "bg-amber-500/15 text-amber-800 ring-amber-700/20";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${cls}`}>{status}</span>;
}

export default async function SubmissionsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          My submissions
        </h1>
        <p className="mt-3 text-slate-700">Please sign in to view your submissions.</p>
        <div className="mt-6">
          <ButtonLink href="/login" variant="primary">
            Sign in
          </ButtonLink>
        </div>
      </Surface>
    );
  }

  const userId = data.user.id;
  const [biz, cultural, sport] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, company_name, approval_status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("cultural_clubs")
      .select("id, club_name, approval_status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("sport_clubs")
      .select("id, club_name, approval_status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200)
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          My submissions
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          You can edit submissions while they are <span className="font-semibold">pending</span>.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Back to{" "}
          <Link href="/account" className="font-semibold underline underline-offset-4">
            account
          </Link>
          .
        </p>
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Businesses</h2>
        {(biz.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {(biz.data ?? []).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{b.company_name}</p>
                  <p className="mt-1">
                    <StatusPill status={b.approval_status} />
                  </p>
                </div>
                {b.approval_status === "pending" ? (
                  <ButtonLink href={`/edit/business/${b.id}`} variant="secondary" size="sm">
                    Edit
                  </ButtonLink>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Cultural clubs</h2>
        {(cultural.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {(cultural.data ?? []).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{c.club_name}</p>
                  <p className="mt-1">
                    <StatusPill status={c.approval_status} />
                  </p>
                </div>
                {c.approval_status === "pending" ? (
                  <ButtonLink href={`/edit/cultural-club/${c.id}`} variant="secondary" size="sm">
                    Edit
                  </ButtonLink>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Sport clubs</h2>
        {(sport.data ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {(sport.data ?? []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{s.club_name}</p>
                  <p className="mt-1">
                    <StatusPill status={s.approval_status} />
                  </p>
                </div>
                {s.approval_status === "pending" ? (
                  <ButtonLink href={`/edit/sport-club/${s.id}`} variant="secondary" size="sm">
                    Edit
                  </ButtonLink>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}

