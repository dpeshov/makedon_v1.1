import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { Surface } from "@/ui/Surface";
import { Button, ButtonLink } from "@/ui/Button";

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

async function setApproval(id: string, next: "approved" | "rejected") {
  "use server";
  const res = await requireAdmin();
  if (!res.ok) throw new Error(res.reason === "env" ? "Supabase is not configured." : "Unauthorized");

  const patch =
    next === "approved"
      ? { approval_status: "approved", approved_at: new Date().toISOString(), approved_by: res.userId }
      : { approval_status: "rejected", approved_at: null, approved_by: res.userId };

  const { error } = await (res.supabase as any).from("cultural_clubs").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/cultural-clubs");
  revalidatePath("/cultural-clubs");
}

export default async function AdminCulturalClubsPage({
  searchParams
}: {
  searchParams: { q?: string; status?: "pending" | "approved" | "rejected" | "" };
}) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin · Cultural clubs
        </h1>
        {admin.reason === "env" ? (
          <>
            <p className="mt-3 text-slate-700">Supabase is not configured for this deployment.</p>
            <div className="mt-6">
              <ButtonLink href="/info" variant="primary">
                Setup checklist
              </ButtonLink>
            </div>
          </>
        ) : (
          <p className="mt-3 text-slate-700">You must be signed in as an admin.</p>
        )}
      </Surface>
    );
  }

  const q = (searchParams.q ?? "").trim();
  const status = (searchParams.status ?? "").trim() as "" | "pending" | "approved" | "rejected";

  const supabase = admin.supabase as any;
  let query = supabase
    .from("cultural_clubs")
    .select("id, club_name, country, city, email, created_at, approval_status, user_id")
    .order("created_at", { ascending: false })
    .limit(500);

  if (q) query = query.ilike("club_name", `%${q}%`);
  if (status) query = query.eq("approval_status", status);

  const listRes = await query;
  const rows = (listRes.data ?? []) as any[];

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
              Admin · Cultural clubs
            </h1>
            <p className="mt-2 text-sm text-slate-600">Review, approve or reject cultural club registrations.</p>
            <p className="mt-3 text-sm text-slate-600">
              Back to{" "}
              <Link className="font-semibold underline underline-offset-4" href="/admin">
                dashboard
              </Link>
              .
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-700">{rows.length} shown</div>
        </div>

        <form method="get" className="mt-6 grid gap-3 sm:grid-cols-6">
          <label className="sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">Search name</span>
            <input
              name="q"
              defaultValue={q}
              className="mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25"
              placeholder="Club name..."
            />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              name="status"
              defaultValue={status}
              className="mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <div className="sm:col-span-1 flex items-end">
            <Button type="submit" className="w-full">
              Apply
            </Button>
          </div>
        </form>
      </Surface>

      {listRes.error ? (
        <Surface className="p-5 sm:p-6">
          <p className="text-sm text-rose-800">Could not load cultural clubs: {listRes.error.message}</p>
        </Surface>
      ) : rows.length === 0 ? (
        <Surface className="p-7 sm:p-10">
          <p className="font-semibold text-slate-900">No results.</p>
          <p className="mt-2 text-sm text-slate-600">Try changing the search or status filter.</p>
        </Surface>
      ) : (
        <Surface className="p-3 sm:p-4">
          <div className="divide-y divide-slate-900/10">
            {rows.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link className="truncate font-semibold text-slate-900 underline underline-offset-4" href={`/admin/cultural-clubs/${r.id}`}>
                      {r.club_name}
                    </Link>
                    <StatusPill status={r.approval_status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {r.city}, {r.country} · {r.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : ""} · user_id:{" "}
                    <span className="font-mono">{r.user_id}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <ButtonLink href={`/admin/cultural-clubs/${r.id}`} variant="secondary" size="sm">
                    View
                  </ButtonLink>
                  <form action={setApproval.bind(null, r.id, "approved")}>
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form action={setApproval.bind(null, r.id, "rejected")}>
                    <Button type="submit" variant="secondary" size="sm">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      )}
    </div>
  );
}

