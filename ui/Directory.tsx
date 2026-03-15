import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { INDUSTRIES } from "@/lib/industries";
import { DEMO_BUSINESSES } from "@/lib/demoBusinesses";
import { BusinessCard } from "@/ui/BusinessCard";

type SearchParams = {
  q?: string;
  country?: string;
  city?: string;
  industry?: string;
  registered?: string;
};

type DirectoryProps = {
  title: string;
  description: string;
  basePath: string;
  registerHref?: string;
  allowDemoFallback?: boolean;
  industry?: {
    picker?: boolean;
    fixedIndustry?: string;
    excludeIndustries?: string[];
  };
  searchParams: SearchParams;
};

function inputClassName() {
  return "mt-1 w-full rounded-xl border border-brand-red/20 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/30";
}

export async function Directory({
  title,
  description,
  basePath,
  registerHref = "/register",
  allowDemoFallback = false,
  industry,
  searchParams
}: DirectoryProps) {
  const q = (searchParams.q ?? "").trim();
  const country = (searchParams.country ?? "").trim();
  const city = (searchParams.city ?? "").trim();
  const selectedIndustry = (searchParams.industry ?? "").trim();

  const showIndustryPicker = Boolean(industry?.picker && !industry?.fixedIndustry);
  const hasUserFilters = Boolean(q || country || city || (showIndustryPicker && selectedIndustry));

  let businesses: any[] = [];
  let error: { message: string } | null = null;

  try {
    const supabase = supabaseAdmin();
    let query = supabase
      .from("businesses")
      .select(
        "id, company_name, industry, sub_industry, country, city, address, phone, other_locations, locations_description, description, offerings, offerings_description, website, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (industry?.fixedIndustry) query = query.eq("industry", industry.fixedIndustry);
    if (industry?.excludeIndustries && industry.excludeIndustries.length > 0) {
      const list = industry.excludeIndustries.map((v) => `"${v.replaceAll('"', '\\"')}"`).join(",");
      query = query.not("industry", "in", `(${list})`);
    }

    if (q) query = query.ilike("company_name", `%${q}%`);
    if (country) query = query.ilike("country", `%${country}%`);
    if (city) query = query.ilike("city", `%${city}%`);
    if (showIndustryPicker && selectedIndustry) query = query.eq("industry", selectedIndustry);

    const res = await query;
    businesses = res.data ?? [];
    error = res.error ? { message: res.error.message } : null;
  } catch (err) {
    error = { message: err instanceof Error ? err.message : "Could not connect to Supabase." };
  }

  const showingDemo = allowDemoFallback && !hasUserFilters && (Boolean(error) || businesses.length === 0);
  const list = showingDemo ? DEMO_BUSINESSES : businesses;

  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={registerHref}
              className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90"
            >
              Register
            </Link>
            <Link
              href="/"
              className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
            >
              Home
            </Link>
          </div>
        </div>

        {searchParams.registered ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            Thanks for registering. Your entry should now appear in the directory.
          </div>
        ) : null}

        {showingDemo ? (
          <div className="rounded-2xl border border-brand-red/20 bg-brand-yellow/15 px-5 py-4 text-sm text-slate-900">
            <p className="font-semibold">Showing demo businesses</p>
            <p className="mt-1 text-slate-700">
              {error
                ? `Supabase is not loading yet: ${error.message}`
                : "Your database is empty. Add your first business or run the seed SQL to replace the demo list."}
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
            Could not load entries from Supabase: {error.message}
          </div>
        ) : null}

        <form
          method="get"
          className="rounded-2xl border border-brand-red/20 bg-white/75 p-5 shadow-sm backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Search name
                <input name="q" defaultValue={q} className={inputClassName()} placeholder="Search..." />
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Country
                <input name="country" defaultValue={country} className={inputClassName()} placeholder="Any" />
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                City
                <input name="city" defaultValue={city} className={inputClassName()} placeholder="Any" />
              </label>
            </div>

            {showIndustryPicker ? (
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Industry
                  <select name="industry" defaultValue={selectedIndustry} className={inputClassName()}>
                    <option value="">Any</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <div className="sm:col-span-2" />
            )}

            <div className="flex items-end gap-2 sm:col-span-2 sm:justify-end">
              <button
                type="submit"
                className="w-full rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90 sm:w-auto"
              >
                Apply
              </button>
              <Link
                href={basePath}
                className="w-full rounded-full border border-brand-red/20 bg-white px-4 py-2 text-center text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30 sm:w-auto"
              >
                Reset
              </Link>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Results</h2>
          <p className="text-sm text-slate-700">{showingDemo ? `${list.length} demo` : `${list.length} shown`}</p>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-brand-red/20 bg-white/75 p-8 text-slate-700 shadow-sm backdrop-blur">
            <p className="font-medium">No results yet.</p>
            <p className="mt-2 text-sm text-slate-600">
              Try adjusting filters, or{" "}
              <Link className="underline" href={registerHref}>
                register the first one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
