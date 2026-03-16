import { NextResponse } from "next/server";
import { supabaseServerOptional } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await supabaseServerOptional();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url));
}
