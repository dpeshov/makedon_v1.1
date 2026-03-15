import Link from "next/link";

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
  return (
    <nav className="flex items-center gap-1">
      <NavLink href="/" label="Home" />
      <NavLink href="/register" label="Register" />
      <NavLink href="/about" label="About" />
    </nav>
  );
}

