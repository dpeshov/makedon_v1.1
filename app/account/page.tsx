import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Surface } from "@/ui/Surface";
import { ButtonLink } from "@/ui/Button";

export const dynamic = "force-dynamic";

async function getProfile() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { user: null, profile: null };

  const profileRes = await supabase.from("profiles").select("id, display_name, role").eq("id", user.id).maybeSingle();
  let profile = profileRes.data ?? null;
  if (!profile) {
    const insertRes = await supabase
      .from("profiles")
      .insert({ id: user.id, display_name: user.email?.split("@")[0] ?? null })
      .select("id, display_name, role")
      .maybeSingle();
    profile = insertRes.data ?? null;
  }
  return { user, profile };
}

export default async function AccountPage() {
  let user: Awaited<ReturnType<typeof getProfile>>["user"] = null;
  let profile: Awaited<ReturnType<typeof getProfile>>["profile"] = null;
  let envError: string | null = null;

  try {
    const res = await getProfile();
    user = res.user;
    profile = res.profile;
  } catch (err) {
    envError = err instanceof Error ? err.message : "Could not connect to Supabase.";
  }

  if (envError) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Account
        </h1>
        <p className="mt-3 text-slate-700">Supabase is not configured for this deployment.</p>
        <p className="mt-2 text-sm text-slate-600">
          Missing env vars: <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
          <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
        </p>
        <p className="mt-2 text-xs text-slate-500">{envError}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/info" variant="primary">
            Setup checklist
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
        </div>
      </Surface>
    );
  }

  if (!user) {
    return (
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Account
        </h1>
        <p className="mt-3 text-slate-700">You are not signed in.</p>
        <div className="mt-6">
          <ButtonLink href="/login" variant="primary">
            Sign in
          </ButtonLink>
        </div>
      </Surface>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Surface className="p-7 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 [font-family:var(--font-heading)]">
          Account
        </h1>
        <p className="mt-3 text-sm text-slate-600">Signed in as</p>
        <p className="mt-1 font-semibold text-slate-900">{user.email}</p>
        <p className="mt-2 text-sm text-slate-600">
          Role: <span className="font-semibold text-slate-900">{profile?.role ?? "user"}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/account/submissions" variant="primary">
            My submissions
          </ButtonLink>
          {profile?.role === "admin" ? (
            <ButtonLink href="/admin" variant="secondary">
              Admin approvals
            </ButtonLink>
          ) : null}
          <Link className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 underline underline-offset-4" href="/logout">
            Sign out
          </Link>
        </div>
      </Surface>
    </div>
  );
}
