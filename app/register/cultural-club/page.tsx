import Link from "next/link";
import { Surface } from "@/ui/Surface";
import { RegisterForm } from "@/ui/RegisterForm";
import { supabaseServer } from "@/lib/supabase/server";
import { ButtonLink } from "@/ui/Button";

export const metadata = {
  title: "Register Cultural Club | Macedonian Diaspora Business Register"
};

export default async function RegisterCulturalClubPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a cultural club
        </h1>
        <p className="mt-3 text-slate-700">Please sign in to submit and later edit your listing.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/login" variant="primary">
            Sign in
          </ButtonLink>
          <ButtonLink href="/cultural-clubs">View cultural clubs</ButtonLink>
        </div>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a cultural club
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your cultural club or association to the public directory. Submissions are reviewed by an admin before
          they appear publicly.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Prefer browsing first?{" "}
          <Link href="/cultural-clubs" className="font-medium underline underline-offset-4">
            View cultural clubs
          </Link>
          .
        </p>
      </Surface>

      <RegisterForm kind="cultural-club" />
    </div>
  );
}

