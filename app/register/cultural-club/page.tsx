import Link from "next/link";
import { RegisterForm } from "@/ui/RegisterForm";

export const metadata = {
  title: "Register Cultural Club | Macedonian Diaspora Business Register"
};

export default function RegisterCulturalClubPage() {
  return (
    <div className="py-10">
      <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a cultural club
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your cultural club or association to the public directory.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Prefer browsing first?{" "}
          <Link href="/cultural-clubs" className="font-medium underline underline-offset-4">
            View cultural clubs
          </Link>
          .
        </p>
      </div>

      <RegisterForm kind="cultural-club" />
    </div>
  );
}

