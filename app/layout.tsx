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
        <header className="border-b border-brand-red/20 bg-white/70 backdrop-blur">
          <Container>
            <div className="flex items-center justify-between py-4">
              <Link
                href="/"
                className="text-base font-semibold tracking-tight text-brand-red [font-family:var(--font-heading)]"
              >
                Macedonian Diaspora Business Register
              </Link>
              <Nav />
            </div>
          </Container>
        </header>

        <main>
          <Container>{children}</Container>
        </main>

        <footer className="mt-16 border-t border-brand-red/20 bg-white/70">
          <Container>
            <div className="py-8 text-sm text-slate-700">
              Built as an MVP to connect Macedonian diaspora businesses worldwide.
            </div>
          </Container>
        </footer>
      </body>
    </html>
  );
}



