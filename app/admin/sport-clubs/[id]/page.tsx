import Link from "next/link";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { Surface } from "@/ui/Surface";
import { Button, ButtonLink } from "@/ui/Button";

export const dynamic = "force-dynamic";

async function setApproval(id: string, next: "approved" | "rejected") {
  "use server";
  const res = await requireAdmin();
  if (!res.ok) throw new Error(res.reason === "env" ? "Supabase is not configured." : "Unauthorized");

  const patch =
    next === "approved"
      ? { approval_status: "approved", approved_at: new Date().toISOString(), approved_by: res.userId }
      : { approval_status: "rejected", approved_at: null, approved_by: res.userId };

  const { error } = await (res.supabase as any).from("sport_clubs").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/sport-clubs");
  revalidatePath(`/admin/sport-clubs/${id}`);
  revalidatePath("/sport-clubs");
}

function Field({ label, value }: { label: string; value: any }) {
  const display = value === null || value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="rounded-2xl border border-slate-900/10 bg-white/55 px-4 py-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-900">{display}</div>
    </div>
  );
}

export default async function AdminSportClubDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin · Sport club
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

  const supabase = admin.supabase as any;
  const res = await supabase
    .from("sport_clubs")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  const row = res.data as any;

  if (res.error) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin · Sport club
        </h1>
        <p className="mt-3 text-rose-800">Could not load: {res.error.message}</p>
      </Surface>
    );
  }

  if (!row) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Admin · Sport club
        </h1>
        <p className="mt-3 text-slate-700">Not found.</p>
        <div className="mt-6">
          <ButtonLink href="/admin/sport-clubs" variant="secondary">
            Back
          </ButtonLink>
        </div>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
              {row.club_name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Back to{" "}
              <Link className="font-semibold underline underline-offset-4" href="/admin/sport-clubs">
                sport clubs
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <form action={setApproval.bind(null, row.id, "approved")}>
              <Button type="submit">Approve</Button>
            </form>
            <form action={setApproval.bind(null, row.id, "rejected")}>
              <Button type="submit" variant="secondary">
                Reject
              </Button>
            </form>
          </div>
        </div>
      </Surface>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Status" value={row.approval_status} />
        <Field label="Submitted" value={row.created_at ? new Date(row.created_at).toLocaleString() : null} />
        <Field label="User ID" value={row.user_id} />
        <Field label="Email" value={row.email} />
        <Field label="Contact name" value={row.contact_name} />
        <Field label="Sport" value={row.sport} />
        <Field label="Country" value={row.country} />
        <Field label="City" value={row.city} />
        <Field label="Address" value={row.address} />
        <Field label="Phone" value={row.phone} />
        <Field label="Website" value={row.website} />
        <Field label="Training schedule" value={row.training_schedule} />
        <Field label="Age groups" value={row.age_groups} />
        <Field label="League" value={row.league} />
        <Field label="Facebook" value={row.facebook} />
        <Field label="Instagram" value={row.instagram} />
      </div>

      <Surface className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{row.description ?? "—"}</p>
      </Surface>
    </div>
  );
}

