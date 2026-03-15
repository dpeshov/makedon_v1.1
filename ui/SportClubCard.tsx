import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

type SportClubPublic = {
  id: string;
  club_name: string;
  country: string;
  city: string;
  sport: string;
  description: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  training_schedule: string | null;
  age_groups: string | null;
  league: string | null;
};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <p className="mt-1 text-sm text-slate-600">
      <span className="font-medium text-slate-800">{label}:</span> {value}
    </p>
  );
}

export function SportClubCard({ club }: { club: SportClubPublic }) {
  return (
    <Surface className="group p-5 ring-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">{club.club_name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium text-slate-900">{club.sport}</span>
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
        <Row label="Training" value={club.training_schedule} />
        <Row label="Age groups" value={club.age_groups} />
        <Row label="League" value={club.league} />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700">{club.description}</p>
    </Surface>
  );
}
