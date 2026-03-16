import { supabaseServerOptional } from "@/lib/supabase/server";

export type RequireAdminResult =
  | { ok: true; supabase: Awaited<ReturnType<typeof supabaseServerOptional>>; userId: string }
  | { ok: false; reason: "env" | "unauthorized" };

export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await supabaseServerOptional();
  if (!supabase) return { ok: false, reason: "env" };

  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, reason: "unauthorized" };

  const profileRes = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (profileRes.data?.role !== "admin") return { ok: false, reason: "unauthorized" };

  return { ok: true, supabase, userId: data.user.id };
}

