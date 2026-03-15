import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { Surface } from "@/ui/Surface";
import { Button } from "@/ui/Button";

export const dynamic = "force-dynamic";

type Table = "businesses" | "cultural_clubs" | "sport_clubs";

async function requireAdmin() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { supabase, user: null, isAdmin: false };

  const profileRes = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  return { supabase, user: data.user, isAdmin: profileRes.data?.role === "admin" };
}

async function loadPending() {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { allowed: false as const, pending: null as any };

  const [businesses, cultural, sport] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, company_name, country, city, created_at, approval_status")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("cultural_clubs")
      .select("id, club_name, country, city, created_at, approval_status")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("sport_clubs")
      .select("id, club_name, sport, country, city, created_at, approval_status")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })
      .limit(200)
  ]);

  return {
    allowed: true as const,
    pending: {
      businesses: businesses.data ?? [],
      cultural: cultural.data ?? [],
      sport: sport.data ?? []
    }
  };
}

async function setApproval(table: Table, id: string, next: "approved" | "rejected") {
  "use server";
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) throw new Error("Unauthorized");

  const patch =
    next === "approved"
      ? { approval_status: "approved", approved_at: new Date().toISOString(), approved_by: user.id }
      : { approval_status: "rejected", approved_at: null, approved_by: user.id };

  const res = await supabase.from(table).update(patch).eq("id", id);
  if (res.error) throw new Error(res.error.message);

  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/cultural-clubs");
  revalidatePath("/sport-clubs");
}

function RowActions({ table, id }: { table: Table; id: string }) {
  return (
    <div className="flex gap-2">
      <form action={setApproval.bind(null, table, id, "approved")}>
        <Button type="submit" size="sm">
          Approve
        </Button>
      </form>
      <form action={setApproval.bind(null, table, id, "rejected")}>
        <Button type="submit" variant="secondary" size="sm">
          Reject
        </Button>
      </form>
    </div>
  );
}

export default async function AdminPage() {
  const res = await loadPending();
  if (!res.allowed) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin approvals
        </h1>
        <p className="mt-3 text-slate-700">You must be signed in as an admin to view this page.</p>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin approvals
        </h1>
        <p className="mt-2 text-sm text-slate-600">Approve or reject pending submissions.</p>
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Businesses</h2>
        {res.pending.businesses.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No pending businesses.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {res.pending.businesses.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{b.company_name}</p>
                  <p className="text-sm text-slate-600">
                    {b.city}, {b.country}
                  </p>
                </div>
                <RowActions table="businesses" id={b.id} />
              </div>
            ))}
          </div>
        )}
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Cultural clubs</h2>
        {res.pending.cultural.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No pending cultural clubs.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {res.pending.cultural.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{c.club_name}</p>
                  <p className="text-sm text-slate-600">
                    {c.city}, {c.country}
                  </p>
                </div>
                <RowActions table="cultural_clubs" id={c.id} />
              </div>
            ))}
          </div>
        )}
      </Surface>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Sport clubs</h2>
        {res.pending.sport.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No pending sport clubs.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {res.pending.sport.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{s.club_name}</p>
                  <p className="text-sm text-slate-600">
                    {s.sport ? `${s.sport} • ` : ""}
                    {s.city}, {s.country}
                  </p>
                </div>
                <RowActions table="sport_clubs" id={s.id} />
              </div>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}

