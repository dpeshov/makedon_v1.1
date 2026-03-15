import Link from "next/link";
import { Surface } from "@/ui/Surface";
import { RegisterForm } from "@/ui/RegisterForm";

export const metadata = {
  title: "Register Business | Macedonian Diaspora Business Register"
};

export default function RegisterBusinessPage() {
  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Register a business
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
          Add your business to the public directory. This is version 1 (MVP), so we keep it simple.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Prefer browsing first?{" "}
          <Link href="/businesses" className="font-medium underline underline-offset-4">
            View businesses
          </Link>
          .
        </p>
      </Surface>

      <RegisterForm kind="business" />
    </div>
  );
}

