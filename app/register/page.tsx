import Link from "next/link";
import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

export const metadata = {
  title: "Register | Macedonian Diaspora Business Register"
};

export default function RegisterIndexPage() {
  return (
    <Surface className="p-7 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
        Register
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
        Choose what you want to register. This MVP stores everything in one Supabase table and shows it in separate
        listings.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ButtonLink href="/register/business" variant="primary">
          Register business
        </ButtonLink>
        <ButtonLink href="/register/cultural-club">Register cultural club</ButtonLink>
        <ButtonLink href="/register/sport-club">Register sport club</ButtonLink>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Want to browse first?{" "}
        <Link href="/businesses" className="font-medium underline underline-offset-4">
          View businesses
        </Link>
        .
      </p>
    </Surface>
  );
}

