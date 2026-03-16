import { NextResponse } from "next/server";
import { INDUSTRIES } from "@/lib/industries";
import { cleanText, isValidEmail, normalizeUrl } from "@/lib/validators";
import { supabaseServerOptional } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServerOptional();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 500 }
      );
    }
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: "Please sign in to submit." }, { status: 401 });

    const body = await req.json();

    const company_name = cleanText(body.company_name, 120);
    const owner_name = cleanText(body.owner_name, 120);
    const country = cleanText(body.country, 80);
    const city = cleanText(body.city, 80);
    const industry = cleanText(body.industry, 80);
    const sub_industry = cleanText(body.sub_industry, 120);
    const description = cleanText(body.description, 800);

    const phone = cleanText(body.phone, 40);
    const address = cleanText(body.address, 180);
    const other_locations = cleanText(body.other_locations, 220);
    const locations_description = cleanText(body.locations_description, 400);

    const offerings = cleanText(body.offerings, 180);
    const offerings_description = cleanText(body.offerings_description, 600);

    const website = normalizeUrl(cleanText(body.website, 200));
    const email = cleanText(body.email, 180).toLowerCase();

    if (!company_name || !owner_name || !country || !city || !industry || !description || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!INDUSTRIES.includes(industry as (typeof INDUSTRIES)[number])) {
      return NextResponse.json({ error: "Please select a valid industry." }, { status: 400 });
    }

    const { error } = await supabase.from("businesses").insert({
      user_id: data.user.id,
      company_name,
      owner_name,
      country,
      city,
      industry,
      sub_industry: sub_industry || null,
      description,
      phone: phone || null,
      address: address || null,
      other_locations: other_locations || null,
      locations_description: locations_description || null,
      offerings: offerings || null,
      offerings_description: offerings_description || null,
      website: website || null,
      email,
      approval_status: "pending"
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid request.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
