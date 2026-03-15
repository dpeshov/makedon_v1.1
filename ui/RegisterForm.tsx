"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/industries";
import { Button } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

type RegisterKind = "business" | "cultural-club" | "sport-club";

type FormState = {
  company_name: string;
  owner_name: string;
  country: string;
  city: string;
  industry: string;
  sub_industry: string;
  description: string;
  phone: string;
  address: string;
  other_locations: string;
  locations_description: string;
  offerings: string;
  offerings_description: string;
  website: string;
  email: string;
};

function kindConfig(kind: RegisterKind) {
  if (kind === "cultural-club") {
    return {
      title: "cultural club",
      fixedIndustry: "Cultural Club",
      redirectTo: "/cultural-clubs",
      nameLabel: "Club name",
      namePlaceholder: "Example: Macedonian Cultural Association"
    };
  }
  if (kind === "sport-club") {
    return {
      title: "sport club",
      fixedIndustry: "Sport Club",
      redirectTo: "/sport-clubs",
      nameLabel: "Club name",
      namePlaceholder: "Example: Macedonian Sports Club"
    };
  }
  return {
    title: "business",
    fixedIndustry: null,
    redirectTo: "/businesses",
    nameLabel: "Company name",
    namePlaceholder: "Example: Balkan Bites"
  };
}

function emptyStateFor(kind: RegisterKind): FormState {
  const cfg = kindConfig(kind);
  return {
    company_name: "",
    owner_name: "",
    country: "",
    city: "",
    industry: cfg.fixedIndustry ?? (INDUSTRIES[0] ?? "Other"),
    sub_industry: "",
    description: "",
    phone: "",
    address: "",
    other_locations: "",
    locations_description: "",
    offerings: "",
    offerings_description: "",
    website: "",
    email: ""
  };
}

export function RegisterForm({ kind = "business" }: { kind?: RegisterKind }) {
  const router = useRouter();
  const cfg = kindConfig(kind);
  const [state, setState] = useState<FormState>(() => emptyStateFor(kind));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      state.company_name.trim() &&
      state.owner_name.trim() &&
      state.country.trim() &&
      state.city.trim() &&
      state.industry.trim() &&
      state.description.trim() &&
      state.email.trim()
    );
  }, [state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state)
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setState(emptyStateFor(kind));
      router.push(`${cfg.redirectTo}?registered=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  function inputClassName() {
    return "mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25";
  }

  function labelClassName() {
    return "text-sm font-medium text-slate-700";
  }

  return (
    <Surface className="p-5 sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName()}>
            {cfg.nameLabel}
            <input
              className={inputClassName()}
              value={state.company_name}
              onChange={(e) => setState((s) => ({ ...s, company_name: e.target.value }))}
              placeholder={cfg.namePlaceholder}
              required
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            Owner name
            <input
              className={inputClassName()}
              value={state.owner_name}
              onChange={(e) => setState((s) => ({ ...s, owner_name: e.target.value }))}
              placeholder="Example: Aleksandar"
              required
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            Country
            <input
              className={inputClassName()}
              value={state.country}
              onChange={(e) => setState((s) => ({ ...s, country: e.target.value }))}
              placeholder="Example: Germany"
              required
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            City
            <input
              className={inputClassName()}
              value={state.city}
              onChange={(e) => setState((s) => ({ ...s, city: e.target.value }))}
              placeholder="Example: Berlin"
              required
            />
          </label>
        </div>

        {cfg.fixedIndustry ? (
          <input type="hidden" value={state.industry} name="industry" />
        ) : (
          <div>
            <label className={labelClassName()}>
              Industry
              <select
                className={inputClassName()}
                value={state.industry}
                onChange={(e) => setState((s) => ({ ...s, industry: e.target.value }))}
                required
              >
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div>
          <label className={labelClassName()}>
            {cfg.fixedIndustry ? "Type / focus (optional)" : "Sub-industry (optional)"}
            <input
              className={inputClassName()}
              value={state.sub_industry}
              onChange={(e) => setState((s) => ({ ...s, sub_industry: e.target.value }))}
              placeholder={cfg.fixedIndustry ? "Example: Folklore, language school" : "Example: Bakery, IT Consulting"}
            />
          </label>
        </div>

        <div>
          <label className={labelClassName()}>
            Contact phone number (optional)
            <input
              className={inputClassName()}
              value={state.phone}
              onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
              placeholder="+49 30 123 456"
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            Address (optional)
            <input
              className={inputClassName()}
              value={state.address}
              onChange={(e) => setState((s) => ({ ...s, address: e.target.value }))}
              placeholder="Street, number, ZIP"
            />
          </label>
        </div>

        <div>
          <label className={labelClassName()}>
            Website (optional)
            <input
              className={inputClassName()}
              value={state.website}
              onChange={(e) => setState((s) => ({ ...s, website: e.target.value }))}
              placeholder="example.com"
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            Email contact
            <input
              className={inputClassName()}
              value={state.email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              placeholder="name@company.com"
              required
            />
          </label>
        </div>
        </div>

        <div className="mt-5">
        <label className={labelClassName()}>
          Short description
          <textarea
            className={`${inputClassName()} min-h-28 resize-y`}
            value={state.description}
            onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
            placeholder="What do you do? Who do you serve?"
            required
          />
        </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClassName()}>
            Other location(s) (optional)
            <input
              className={inputClassName()}
              value={state.other_locations}
              onChange={(e) => setState((s) => ({ ...s, other_locations: e.target.value }))}
              placeholder="Example: Munich; Hamburg"
            />
          </label>
        </div>
        <div>
          <label className={labelClassName()}>
            Locations description (optional)
            <input
              className={inputClassName()}
              value={state.locations_description}
              onChange={(e) => setState((s) => ({ ...s, locations_description: e.target.value }))}
              placeholder="Example: Delivery across Germany"
            />
          </label>
        </div>
        </div>

        <div className="mt-5">
        <label className={labelClassName()}>
          Products / services (optional)
          <input
            className={inputClassName()}
            value={state.offerings}
            onChange={(e) => setState((s) => ({ ...s, offerings: e.target.value }))}
            placeholder="Example: Catering, web development, accounting"
          />
        </label>
        </div>

        <div className="mt-5">
        <label className={labelClassName()}>
          Products / services description (optional)
          <textarea
            className={`${inputClassName()} min-h-24 resize-y`}
            value={state.offerings_description}
            onChange={(e) => setState((s) => ({ ...s, offerings_description: e.target.value }))}
            placeholder="A bit more detail about your main products or services."
          />
        </label>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={!canSubmit || pending}>
            {pending ? "Submitting..." : `Submit ${cfg.title}`}
          </Button>
          <p className="text-xs leading-5 text-slate-500 sm:max-w-lg">
            Email and owner/contact name are stored for contact, but they are not shown publicly in this MVP.
          </p>
        </div>
      </form>
    </Surface>
  );
}
