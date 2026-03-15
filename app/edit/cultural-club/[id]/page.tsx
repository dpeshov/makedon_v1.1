"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Surface } from "@/ui/Surface";
import { Button } from "@/ui/Button";

type Row = {
  id: string;
  club_name: string;
  contact_name: string;
  country: string;
  city: string;
  description: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  email: string;
  focus_areas: string | null;
  activities: string | null;
  facebook: string | null;
  instagram: string | null;
  approval_status: string;
};

function inputClassName() {
  return "mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25";
}

export default function EditCulturalClubPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [row, setRow] = useState<Row | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      const res = await supabase
        .from("cultural_clubs")
        .select(
          "id, club_name, contact_name, country, city, description, phone, address, website, email, focus_areas, activities, facebook, instagram, approval_status"
        )
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (res.error) setError(res.error.message);
      setRow(res.data as any);
    }
    if (id) run();
    return () => {
      cancelled = true;
    };
  }, [id, supabase]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!row) return;
    setPending(true);
    setError(null);
    try {
      const res = await supabase
        .from("cultural_clubs")
        .update({
          club_name: row.club_name,
          contact_name: row.contact_name,
          country: row.country,
          city: row.city,
          description: row.description,
          phone: row.phone || null,
          address: row.address || null,
          website: row.website || null,
          email: row.email,
          focus_areas: row.focus_areas || null,
          activities: row.activities || null,
          facebook: row.facebook || null,
          instagram: row.instagram || null
        })
        .eq("id", row.id);
      if (res.error) throw res.error;
      router.push("/account/submissions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setPending(false);
    }
  }

  if (!row) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit cultural club</h1>
        <p className="mt-3 text-sm text-slate-600">{error ?? "Loading..."}</p>
      </Surface>
    );
  }

  if (row.approval_status !== "pending") {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit cultural club</h1>
        <p className="mt-3 text-sm text-slate-700">Only pending submissions can be edited.</p>
      </Surface>
    );
  }

  return (
    <Surface className="p-5 sm:p-6">
      <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit cultural club</h1>
      <p className="mt-2 text-sm text-slate-600">Edits are allowed while the submission is pending review.</p>

      <form onSubmit={onSave} className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Club name
            <input className={inputClassName()} value={row.club_name} onChange={(e) => setRow({ ...row, club_name: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Contact name
            <input className={inputClassName()} value={row.contact_name} onChange={(e) => setRow({ ...row, contact_name: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Country
            <input className={inputClassName()} value={row.country} onChange={(e) => setRow({ ...row, country: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            City
            <input className={inputClassName()} value={row.city} onChange={(e) => setRow({ ...row, city: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Phone (optional)
            <input className={inputClassName()} value={row.phone ?? ""} onChange={(e) => setRow({ ...row, phone: e.target.value })} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Address (optional)
            <input className={inputClassName()} value={row.address ?? ""} onChange={(e) => setRow({ ...row, address: e.target.value })} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Website (optional)
            <input className={inputClassName()} value={row.website ?? ""} onChange={(e) => setRow({ ...row, website: e.target.value })} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Email contact
            <input className={inputClassName()} value={row.email} onChange={(e) => setRow({ ...row, email: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Focus areas (optional)
            <input className={inputClassName()} value={row.focus_areas ?? ""} onChange={(e) => setRow({ ...row, focus_areas: e.target.value })} />
          </label>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Short description
            <textarea className={`${inputClassName()} min-h-28 resize-y`} value={row.description} onChange={(e) => setRow({ ...row, description: e.target.value })} required />
          </label>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Activities (optional)
            <textarea className={`${inputClassName()} min-h-24 resize-y`} value={row.activities ?? ""} onChange={(e) => setRow({ ...row, activities: e.target.value })} />
          </label>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
          <button type="button" className="text-sm font-semibold text-slate-700 underline underline-offset-4" onClick={() => router.push("/account/submissions")}>
            Cancel
          </button>
        </div>
      </form>
    </Surface>
  );
}

