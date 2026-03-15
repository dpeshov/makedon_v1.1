"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/ui/Button";

function formatBuildStamp(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const iso = parsed.toISOString(); // UTC
  const stamp = iso.slice(0, 16).replace("T", " ");
  return `${stamp} UTC`;
}

type NavItem = { href: string; label: string; match?: "exact" | "prefix" };

function isActive(pathname: string, item: NavItem) {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
    </svg>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-2 text-sm font-semibold transition",
        active ? "bg-brand-yellow/35 text-slate-900" : "text-slate-700 hover:bg-brand-yellow/20 hover:text-slate-900"
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  const items = useMemo<NavItem[]>(
    () => [
      { href: "/", label: "Home", match: "exact" },
      { href: "/businesses", label: "Businesses" },
      { href: "/cultural-clubs", label: "Cultural clubs" },
      { href: "/sport-clubs", label: "Sport clubs" },
      { href: "/register", label: "Register" },
      { href: "/info", label: "Info" },
      { href: "/account", label: "Account" }
    ],
    []
  );

  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const buildStamp = formatBuildStamp(process.env.NEXT_PUBLIC_BUILD_DATE);
  const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA;
  const showMeta = Boolean(version || buildStamp);

  return (
    <nav className="flex items-center gap-3">
      {showMeta ? (
        <div
          className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex"
          title={buildSha ? `Build: ${buildSha}` : undefined}
        >
          <span className="rounded-full border border-slate-900/10 bg-white/50 px-2 py-1">
            {version ? `v${version}` : "dev"}
          </span>
          {buildStamp ? <span className="text-slate-400">{buildStamp}</span> : null}
        </div>
      ) : null}

      <div className="hidden items-center gap-1 rounded-full border border-slate-900/10 bg-white/45 p-1 backdrop-blur sm:flex">
        {items.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} active={isActive(pathname, item)} />
        ))}
      </div>

      <div className="sm:hidden">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <MenuIcon open={open} />
        </Button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="absolute left-4 right-4 top-16 z-50 rounded-3xl border border-slate-900/10 bg-white/90 p-2 shadow-lg backdrop-blur"
        >
          {items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "block rounded-2xl px-4 py-3 text-sm font-semibold",
                  active ? "bg-brand-yellow/35 text-slate-900" : "text-slate-800 hover:bg-brand-yellow/20"
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
