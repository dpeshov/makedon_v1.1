"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/industries";
import { Button } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

type RegisterKind = "business" | "cultural-club" | "sport-club";

type BusinessState = {
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

type CulturalClubState = {
  club_name: string;
  contact_name: string;
  country: string;
  city: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  email: string;
  focus_areas: string;
  activities: string;
  facebook: string;
  instagram: string;
};

type SportClubState = {
  club_name: string;
  contact_name: string;
  country: string;
  city: string;
  sport: string;
  description: string;
  phone: string;
  address: string;
  website: string;
  email: string;
  training_schedule: string;
  age_groups: string;
  league: string;
  facebook: string;
  instagram: string;
};

function inputClassName() {
  return "mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-brand-yellow/60 focus:ring-4 focus:ring-brand-yellow/25";
}

function labelClassName() {
  return "text-sm font-medium text-slate-700";
}

function BusinessForm() {
  const router = useRouter();
  const [state, setState] = useState<BusinessState>({
    company_name: "",
    owner_name: "",
    country: "",
    city: "",
    industry: INDUSTRIES[0] ?? "Other",
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
  });

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

      router.push(`/businesses?registered=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Surface className="p-5 sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName()}>
              Company name
              <input
                className={inputClassName()}
                value={state.company_name}
                onChange={(e) => setState((s) => ({ ...s, company_name: e.target.value }))}
                placeholder="Example: Balkan Bites"
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
          <div>
            <label className={labelClassName()}>
              Sub-industry (optional)
              <input
                className={inputClassName()}
                value={state.sub_industry}
                onChange={(e) => setState((s) => ({ ...s, sub_industry: e.target.value }))}
                placeholder="Example: Bakery, IT Consulting"
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
            {pending ? "Submitting..." : "Submit business"}
          </Button>
          <p className="text-xs leading-5 text-slate-500 sm:max-w-lg">
            Email and owner name are stored for contact, but they are not shown publicly in this MVP.
          </p>
        </div>
      </form>
    </Surface>
  );
}

function CulturalClubForm() {
  const router = useRouter();
  const [state, setState] = useState<CulturalClubState>({
    club_name: "",
    contact_name: "",
    country: "",
    city: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    email: "",
    focus_areas: "",
    activities: "",
    facebook: "",
    instagram: ""
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      state.club_name.trim() &&
      state.contact_name.trim() &&
      state.country.trim() &&
      state.city.trim() &&
      state.description.trim() &&
      state.email.trim()
    );
  }, [state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/cultural-clubs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state)
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      router.push(`/cultural-clubs?registered=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Surface className="p-5 sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName()}>
              Club name
              <input
                className={inputClassName()}
                value={state.club_name}
                onChange={(e) => setState((s) => ({ ...s, club_name: e.target.value }))}
                placeholder="Example: Macedonian Cultural Association"
                required
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Contact name
              <input
                className={inputClassName()}
                value={state.contact_name}
                onChange={(e) => setState((s) => ({ ...s, contact_name: e.target.value }))}
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

          <div>
            <label className={labelClassName()}>
              Phone (optional)
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
                placeholder="name@club.com"
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
              placeholder="What is your club about?"
              required
            />
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName()}>
              Focus areas (optional)
              <input
                className={inputClassName()}
                value={state.focus_areas}
                onChange={(e) => setState((s) => ({ ...s, focus_areas: e.target.value }))}
                placeholder="Example: Folklore, language, events"
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Activities (optional)
              <input
                className={inputClassName()}
                value={state.activities}
                onChange={(e) => setState((s) => ({ ...s, activities: e.target.value }))}
                placeholder="Example: Weekly rehearsals, concerts, workshops"
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Facebook (optional)
              <input
                className={inputClassName()}
                value={state.facebook}
                onChange={(e) => setState((s) => ({ ...s, facebook: e.target.value }))}
                placeholder="facebook.com/..."
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Instagram (optional)
              <input
                className={inputClassName()}
                value={state.instagram}
                onChange={(e) => setState((s) => ({ ...s, instagram: e.target.value }))}
                placeholder="instagram.com/..."
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={!canSubmit || pending}>
            {pending ? "Submitting..." : "Submit cultural club"}
          </Button>
          <p className="text-xs leading-5 text-slate-500 sm:max-w-lg">
            Email and contact name are stored for contact, but they are not shown publicly in this MVP.
          </p>
        </div>
      </form>
    </Surface>
  );
}

function SportClubForm() {
  const router = useRouter();
  const [state, setState] = useState<SportClubState>({
    club_name: "",
    contact_name: "",
    country: "",
    city: "",
    sport: "",
    description: "",
    phone: "",
    address: "",
    website: "",
    email: "",
    training_schedule: "",
    age_groups: "",
    league: "",
    facebook: "",
    instagram: ""
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      state.club_name.trim() &&
      state.contact_name.trim() &&
      state.country.trim() &&
      state.city.trim() &&
      state.sport.trim() &&
      state.description.trim() &&
      state.email.trim()
    );
  }, [state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/sport-clubs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(state)
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      router.push(`/sport-clubs?registered=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Surface className="p-5 sm:p-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName()}>
              Club name
              <input
                className={inputClassName()}
                value={state.club_name}
                onChange={(e) => setState((s) => ({ ...s, club_name: e.target.value }))}
                placeholder="Example: Macedonian Sports Club"
                required
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Contact name
              <input
                className={inputClassName()}
                value={state.contact_name}
                onChange={(e) => setState((s) => ({ ...s, contact_name: e.target.value }))}
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
          <div>
            <label className={labelClassName()}>
              Sport
              <input
                className={inputClassName()}
                value={state.sport}
                onChange={(e) => setState((s) => ({ ...s, sport: e.target.value }))}
                placeholder="Example: Football, Basketball"
                required
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
              Phone (optional)
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
              Email contact
              <input
                className={inputClassName()}
                value={state.email}
                onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                placeholder="name@club.com"
                required
              />
            </label>
          </div>
          <div className="sm:col-span-2">
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
        </div>

        <div className="mt-5">
          <label className={labelClassName()}>
            Short description
            <textarea
              className={`${inputClassName()} min-h-28 resize-y`}
              value={state.description}
              onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
              placeholder="What is your club about?"
              required
            />
          </label>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClassName()}>
              Training schedule (optional)
              <input
                className={inputClassName()}
                value={state.training_schedule}
                onChange={(e) => setState((s) => ({ ...s, training_schedule: e.target.value }))}
                placeholder="Example: Tue/Thu 19:00"
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Age groups (optional)
              <input
                className={inputClassName()}
                value={state.age_groups}
                onChange={(e) => setState((s) => ({ ...s, age_groups: e.target.value }))}
                placeholder="Example: U12, U16, adults"
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              League (optional)
              <input
                className={inputClassName()}
                value={state.league}
                onChange={(e) => setState((s) => ({ ...s, league: e.target.value }))}
                placeholder="Example: Regional league"
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Facebook (optional)
              <input
                className={inputClassName()}
                value={state.facebook}
                onChange={(e) => setState((s) => ({ ...s, facebook: e.target.value }))}
                placeholder="facebook.com/..."
              />
            </label>
          </div>
          <div>
            <label className={labelClassName()}>
              Instagram (optional)
              <input
                className={inputClassName()}
                value={state.instagram}
                onChange={(e) => setState((s) => ({ ...s, instagram: e.target.value }))}
                placeholder="instagram.com/..."
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={!canSubmit || pending}>
            {pending ? "Submitting..." : "Submit sport club"}
          </Button>
          <p className="text-xs leading-5 text-slate-500 sm:max-w-lg">
            Email and contact name are stored for contact, but they are not shown publicly in this MVP.
          </p>
        </div>
      </form>
    </Surface>
  );
}

export function RegisterForm({ kind = "business" }: { kind?: RegisterKind }) {
  if (kind === "cultural-club") return <CulturalClubForm />;
  if (kind === "sport-club") return <SportClubForm />;
  return <BusinessForm />;
}

