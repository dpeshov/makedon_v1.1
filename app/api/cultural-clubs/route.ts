import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cleanText, isValidEmail, normalizeUrl } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const club_name = cleanText(body.club_name, 140);
    const contact_name = cleanText(body.contact_name, 120);
    const country = cleanText(body.country, 80);
    const city = cleanText(body.city, 80);
    const description = cleanText(body.description, 900);

    const phone = cleanText(body.phone, 40);
    const address = cleanText(body.address, 180);
    const website = normalizeUrl(cleanText(body.website, 200));
    const email = cleanText(body.email, 180).toLowerCase();

    const focus_areas = cleanText(body.focus_areas, 400);
    const activities = cleanText(body.activities, 600);
    const facebook = normalizeUrl(cleanText(body.facebook, 200));
    const instagram = normalizeUrl(cleanText(body.instagram, 200));

    if (!club_name || !contact_name || !country || !city || !description || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = supabaseAdmin();
    const { error } = await supabase.from("cultural_clubs").insert({
      club_name,
      contact_name,
      country,
      city,
      description,
      phone: phone || null,
      address: address || null,
      website: website || null,
      email,
      focus_areas: focus_areas || null,
      activities: activities || null,
      facebook: facebook || null,
      instagram: instagram || null
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

