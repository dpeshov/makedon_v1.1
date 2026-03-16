import { NextResponse } from "next/server";
import { supabaseServerOptional } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  if (!value) return "/account";
  if (!value.startsWith("/")) return "/account";
  return value;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = safeNext(url.searchParams.get("next"));

  const supabase = await supabaseServerOptional();
  if (!supabase) {
    return NextResponse.redirect(new URL(`/info?missing=supabase`, url.origin));
  }

  const errorDescription = url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (errorDescription) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorDescription)}`, url.origin));
  }

  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as
    | "signup"
    | "invite"
    | "magiclink"
    | "recovery"
    | "email_change"
    | null;

  if (code) {
    const res = await supabase.auth.exchangeCodeForSession(code);
    if (res.error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(res.error.message)}`, url.origin));
    }
    return NextResponse.redirect(new URL(next, url.origin));
  }

  if (token_hash && type) {
    const res = await supabase.auth.verifyOtp({ token_hash, type });
    if (res.error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(res.error.message)}`, url.origin));
    }
    return NextResponse.redirect(new URL(next, url.origin));
  }

  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Invalid callback URL.")}`, url.origin));
}

