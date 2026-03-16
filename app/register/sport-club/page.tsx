import Link from "next/link";
import { Surface } from "@/ui/Surface";
import { RegisterForm } from "@/ui/RegisterForm";
import { supabaseServerOptional } from "@/lib/supabase/server";
import { ButtonLink } from "@/ui/Button";

export const metadata = {
  title: "Register Sport Club | Macedonian Diaspora Business Register"
};

export default async function RegisterSportClubPage() {
  const supabase = await supabaseServerOptional();
  if (!supabase) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a sport club
        </h1>
        <p className="mt-3 text-slate-700">Supabase is not configured for this deployment.</p>
        <p className="mt-2 text-sm text-slate-600">
          Missing env vars: <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
          <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/info" variant="primary">
            Setup checklist
          </ButtonLink>
          <ButtonLink href="/sport-clubs" variant="secondary">
            View sport clubs
          </ButtonLink>
        </div>
      </Surface>
    );
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a sport club
        </h1>
        <p className="mt-3 text-slate-700">Please sign in to submit and later edit your listing.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/login" variant="primary">
            Sign in
          </ButtonLink>
          <ButtonLink href="/sport-clubs">View sport clubs</ButtonLink>
        </div>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a sport club
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your sport club to the public directory. Submissions are reviewed by an admin before they appear publicly.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Prefer browsing first?{" "}
          <Link href="/sport-clubs" className="font-medium underline underline-offset-4">
            View sport clubs
          </Link>
          .
        </p>
      </Surface>

      <RegisterForm kind="sport-club" />
    </div>
  );
}
