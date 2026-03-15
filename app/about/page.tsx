import Link from "next/link";

export const metadata = {
  title: "About | Macedonian Diaspora Business Register"
};

export default function AboutPage() {
  return (
    <div className="py-10">
      <div className="rounded-3xl border border-brand-red/20 bg-white/75 p-7 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          About
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          The Macedonian Diaspora Business Register is a simple directory that helps people discover Macedonian-owned
          businesses around the world, and helps businesses connect with the diaspora community.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          MVP focus: keep the submission process easy, and keep the directory searchable by name, location, and
          industry.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-brand-red/20 bg-white px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-yellow/25 hover:border-brand-red/30"
          >
            Browse businesses
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-red/90"
          >
            Register a business
          </Link>
        </div>
      </div>
    </div>
  );
}

