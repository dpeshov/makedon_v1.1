import Link from "next/link";

function formatBuildDate(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-yellow/25 hover:text-slate-900"
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const buildDate = formatBuildDate(process.env.NEXT_PUBLIC_BUILD_DATE);
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const showMeta = Boolean(version || buildDate);

  return (
    <nav className="flex items-center gap-3">
      {showMeta ? (
        <div
          className="flex items-center gap-2 text-xs font-semibold text-slate-500"
          title={buildSha ? `Build: ${buildSha}` : undefined}
        >
          <span className="sm:hidden">{buildDate || (version ? `v${version}` : "")}</span>
          <span className="hidden sm:inline">
            {version ? `v${version}` : ""}
            {version && buildDate ? " | " : ""}
            {buildDate || ""}
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-1">
        <NavLink href="/" label="Home" />
        <NavLink href="/register" label="Register" />
        <NavLink href="/about" label="About" />
      </div>
    </nav>
  );
}
