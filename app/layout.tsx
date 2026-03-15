import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Container } from "@/ui/Container";
import { Nav } from "@/ui/Nav";

const heading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Macedonian Diaspora Business Register",
  description: "A public directory of Macedonian businesses around the world."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-dvh font-sans [font-family:var(--font-body)]">
        <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-white/65 backdrop-blur supports-[backdrop-filter]:bg-white/55">
          <Container>
            <div className="relative flex items-center justify-between py-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-2xl bg-brand-red text-white shadow-sm">
                  <span className="text-sm font-bold leading-none">M</span>
                </span>
                <span className="hidden sm:inline">Macedonian Diaspora Register</span>
                <span className="sm:hidden">Diaspora Register</span>
              </Link>
              <Nav />
            </div>
          </Container>
        </header>

        <main className="pb-10 pt-6 sm:pt-10">
          <Container>{children}</Container>
        </main>

        <footer className="mt-12 border-t border-slate-900/10 bg-white/55 backdrop-blur supports-[backdrop-filter]:bg-white/45">
          <Container>
            <div className="flex flex-col gap-2 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Built as an MVP to connect Macedonian diaspora communities worldwide.</p>
              <p className="text-xs text-slate-500">Businesses • Cultural clubs • Sport clubs</p>
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}



