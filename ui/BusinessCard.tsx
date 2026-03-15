import Link from "next/link";

type BusinessPublic = {
  id: string;
  company_name: string;
  industry: string;
  sub_industry: string | null;
  country: string;
  city: string;
  address: string | null;
  phone: string | null;
  other_locations: string | null;
  locations_description: string | null;
  description: string;
  offerings: string | null;
  offerings_description: string | null;
  website: string | null;
};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <p className="mt-1 text-sm text-slate-700">
      <span className="font-medium text-slate-800">{label}:</span> {value}
    </p>
  );
}

export function BusinessCard({ business }: { business: BusinessPublic }) {
  return (
    <article className="rounded-2xl border border-brand-red/20 bg-white/75 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">{business.company_name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium text-slate-800">{business.industry}</span>
            {business.sub_industry ? <span className="text-slate-500"> ({business.sub_industry})</span> : null}
            <span className="px-2 text-slate-300">•</span>
            <span>
              {business.city}, {business.country}
            </span>
          </p>
        </div>

        {business.website ? (
          <Link
            href={business.website}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-brand-red/20 bg-white px-3 py-1.5 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
          >
            Website
          </Link>
        ) : null}
      </div>

      <div className="mt-3">
        <Row label="Address" value={business.address} />
        <Row label="Phone" value={business.phone} />
        <Row label="Other locations" value={business.other_locations} />
        <Row label="Locations" value={business.locations_description} />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">{business.description}</p>

      {business.offerings ? (
        <div className="mt-3 rounded-xl border border-brand-red/10 bg-brand-yellow/10 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Products / services</p>
          <p className="mt-1 text-sm text-slate-700">{business.offerings}</p>
          {business.offerings_description ? (
            <p className="mt-2 text-sm leading-6 text-slate-700">{business.offerings_description}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
