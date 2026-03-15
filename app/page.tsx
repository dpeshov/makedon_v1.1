import { Surface } from "@/ui/Surface";
import { ButtonLink } from "@/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Surface className="relative overflow-hidden p-7 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-brand-yellow/20" />
        <div className="relative">
          <p className="text-sm font-semibold text-brand-red">2026-ready MVP</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)] sm:text-5xl">
            Find Macedonian diaspora businesses and clubs.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
            Browse curated listings by segment, or register your own. Submissions are reviewed by an admin before they
            appear publicly.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border-2 border-slate-900/10 bg-white/60 p-5">
              <p className="text-sm font-semibold text-slate-900">Businesses</p>
              <p className="mt-1 text-sm text-slate-600">Companies and services for the diaspora.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/businesses" variant="primary">
                  View
                </ButtonLink>
                <ButtonLink href="/register/business">Register</ButtonLink>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-slate-900/10 bg-white/60 p-5">
              <p className="text-sm font-semibold text-slate-900">Cultural clubs</p>
              <p className="mt-1 text-sm text-slate-600">Associations, folklore, language, events.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/cultural-clubs" variant="primary">
                  View
                </ButtonLink>
                <ButtonLink href="/register/cultural-club">Register</ButtonLink>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-slate-900/10 bg-white/60 p-5">
              <p className="text-sm font-semibold text-slate-900">Sport clubs</p>
              <p className="mt-1 text-sm text-slate-600">Teams, trainings, leagues, communities.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/sport-clubs" variant="primary">
                  View
                </ButtonLink>
                <ButtonLink href="/register/sport-club">Register</ButtonLink>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/login" variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink href="/account" variant="ghost">
              Account
            </ButtonLink>
            <ButtonLink href="/info" variant="ghost">
              Info
            </ButtonLink>
          </div>
        </div>
      </Surface>
    </div>
  );
}

