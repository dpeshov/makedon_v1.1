import { ButtonLink } from "@/ui/Button";
import { Surface } from "@/ui/Surface";

export const metadata = {
  title: "About | Macedonian Diaspora Business Register"
};

export default function AboutPage() {
  return (
    <Surface className="p-7 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">About</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
        The Macedonian Diaspora Register is a simple directory that helps people discover diaspora-led businesses and
        community clubs around the world.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        MVP focus: keep submissions easy, and keep the directory searchable by name and location.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <ButtonLink href="/businesses">Browse businesses</ButtonLink>
        <ButtonLink href="/register" variant="primary">
          Register
        </ButtonLink>
      </div>
    </Surface>
  );
}

