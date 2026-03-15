import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

type CulturalClubPublic = {
  id: string;
  club_name: string;
  country: string;
  city: string;
  description: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  focus_areas: string | null;
  activities: string | null;
};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <p className="mt-1 text-sm text-slate-600">
      <span className="font-medium text-slate-800">{label}:</span> {value}
    </p>
  );
}

export function CulturalClubCard({ club }: { club: CulturalClubPublic }) {
  return (
    <Surface className="group p-5 ring-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">{club.club_name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium text-slate-900">Cultural club</span>
            <span className="mx-2 text-slate-300">•</span>
            <span>
              {club.city}, {club.country}
            </span>
          </p>
        </div>

        {club.website ? (
          <ButtonLink href={club.website} target="_blank" rel="noreferrer" variant="secondary" size="sm" className="shrink-0">
            Website
          </ButtonLink>
        ) : null}
      </div>

      <div className="mt-3">
        <Row label="Address" value={club.address} />
        <Row label="Phone" value={club.phone} />
        <Row label="Focus" value={club.focus_areas} />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">{club.description}</p>

      {club.activities ? (
        <div className="mt-4 rounded-2xl border border-slate-900/10 bg-white/50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Activities</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{club.activities}</p>
        </div>
      ) : null}
    </Surface>
  );
}
