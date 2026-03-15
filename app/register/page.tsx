import Link from "next/link";

export const metadata = {
  title: "Register | Macedonian Diaspora Business Register"
};

export default function RegisterIndexPage() {
  return (
    <div className="py-10">
      <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Choose what you want to register. This MVP keeps all entries in one database table and shows them in separate
          listings.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/register/business"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90"
          >
            Register business
          </Link>
          <Link
            href="/register/cultural-club"
            className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
          >
            Register cultural club
          </Link>
          <Link
            href="/register/sport-club"
            className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
          >
            Register sport club
          </Link>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Want to browse first?{" "}
          <Link href="/businesses" className="font-medium underline underline-offset-4">
            View businesses
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

