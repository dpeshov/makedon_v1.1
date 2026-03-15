import Link from "next/link";
import { Surface } from "@/ui/Surface";
import { RegisterForm } from "@/ui/RegisterForm";
import { supabaseServer } from "@/lib/supabase/server";
import { ButtonLink } from "@/ui/Button";

export const metadata = {
  title: "Register Business | Macedonian Diaspora Business Register"
};

export default async function RegisterBusinessPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a business
        </h1>
        <p className="mt-3 text-slate-700">Please sign in to submit and later edit your listing.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/login" variant="primary">
            Sign in
          </ButtonLink>
          <ButtonLink href="/businesses">View businesses</ButtonLink>
        </div>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a business
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your business to the public directory. Submissions are reviewed by an admin before they appear publicly.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Prefer browsing first?{" "}
          <Link href="/businesses" className="font-medium underline underline-offset-4">
            View businesses
          </Link>
          .
        </p>
      </Surface>

      <RegisterForm kind="business" />
    </div>
  );
}
