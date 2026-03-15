import Link from "next/link";
import { Surface } from "@/ui/Surface";
import { RegisterForm } from "@/ui/RegisterForm";

export const metadata = {
  title: "Register Sport Club | Macedonian Diaspora Business Register"
};

export default function RegisterSportClubPage() {
  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a sport club
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your sport club to the public directory.
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

