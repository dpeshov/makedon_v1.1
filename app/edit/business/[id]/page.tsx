"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { INDUSTRIES } from "@/lib/industries";
import { Surface } from "@/ui/Surface";
import { Button } from "@/ui/Button";

type BusinessRow = {
  id: string;
  company_name: string;
  owner_name: string;
  country: string;
  city: string;
  industry: string;
  sub_industry: string | null;
  description: string;
  phone: string | null;
  address: string | null;
  other_locations: string | null;
  locations_description: string | null;
  offerings: string | null;
  offerings_description: string | null;
  website: string | null;
  email: string;
  approval_status: string;
};

function inputClassName() {
  return "mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25";
}

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const supabase = useMemo(() => supabaseBrowser(), []);

  const [row, setRow] = useState<BusinessRow | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError(null);
      if (!supabase) {
        setError("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");
        return;
      }
      const res = await supabase
        .from("businesses")
        .select(
          "id, company_name, owner_name, country, city, industry, sub_industry, description, phone, address, other_locations, locations_description, offerings, offerings_description, website, email, approval_status"
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
    if (!supabase) {
      setError("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await supabase
        .from("businesses")
        .update({
          company_name: row.company_name,
          owner_name: row.owner_name,
          country: row.country,
          city: row.city,
          industry: row.industry,
          sub_industry: row.sub_industry || null,
          description: row.description,
          phone: row.phone || null,
          address: row.address || null,
          other_locations: row.other_locations || null,
          locations_description: row.locations_description || null,
          offerings: row.offerings || null,
          offerings_description: row.offerings_description || null,
          website: row.website || null,
          email: row.email
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
        <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit business</h1>
        <p className="mt-3 text-sm text-slate-600">{error ?? "Loading..."}</p>
      </Surface>
    );
  }

  if (row.approval_status !== "pending") {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit business</h1>
        <p className="mt-3 text-sm text-slate-700">Only pending submissions can be edited.</p>
      </Surface>
    );
  }

  return (
    <Surface className="p-5 sm:p-6">
      <h1 className="text-2xl font-semibold text-slate-900 [font-family:var(--font-heading)]">Edit business</h1>
      <p className="mt-2 text-sm text-slate-600">Edits are allowed while the submission is pending review.</p>

      <form onSubmit={onSave} className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Company name
            <input className={inputClassName()} value={row.company_name} onChange={(e) => setRow({ ...row, company_name: e.target.value })} required />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Owner name
            <input className={inputClassName()} value={row.owner_name} onChange={(e) => setRow({ ...row, owner_name: e.target.value })} required />
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
            Industry
            <select className={inputClassName()} value={row.industry} onChange={(e) => setRow({ ...row, industry: e.target.value })} required>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Sub-industry (optional)
            <input className={inputClassName()} value={row.sub_industry ?? ""} onChange={(e) => setRow({ ...row, sub_industry: e.target.value })} />
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
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Short description
            <textarea className={`${inputClassName()} min-h-28 resize-y`} value={row.description} onChange={(e) => setRow({ ...row, description: e.target.value })} required />
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
