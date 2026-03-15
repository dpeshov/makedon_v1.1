# Macedonian Diaspora Business Register (MVP)

A very simple public directory of Macedonian diaspora businesses around the world. Businesses can register themselves and appear in a searchable list.

## Tech

- Next.js (App Router)
- Supabase (Postgres)
- Tailwind CSS
- Deployable on Vercel

## Local Development

Prerequisites:

- Node.js 20+ (recommended)

Steps:

1. Install dependencies:
   - `npm install`
2. Create env file:
   - copy `.env.example` to `.env.local`
3. Start dev server:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Smoke Test (Submit Forms)

1. Make sure you have created a Supabase user (via `/login`) and that `.env.local` has the Supabase public keys.
2. Run the smoke test (inserts 5 pending rows into each table via Supabase REST + RLS):
   - `powershell -ExecutionPolicy Bypass -File scripts/smoke-submit.ps1`

## Supabase Setup

1. Create a Supabase project.
2. Create the required tables (SQL editor):
   - Run `supabase/schema.sql` (creates `public.businesses`, `public.cultural_clubs`, `public.sport_clubs`).
   - Then run `supabase/auth.sql` (adds `profiles`, approval fields, and RLS policies).

3. Enable Auth:
   - Supabase Dashboard -> Authentication -> Providers -> Email (enable)

4. Get environment variables:
   - Supabase Dashboard -> Project Settings -> API
   - Copy the `URL` and the `anon` key
5. Set local env vars in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

Optional demo data:

- Run `supabase/seed.sql` in the Supabase SQL editor to insert 10 demo businesses.

Security note:

- This MVP uses Supabase Auth + RLS. Do not expose the service role key to the browser.
- Public listing pages intentionally do not show email/contact names.

## Pages

- `/` Home: entry points for segments.
- `/businesses` Businesses: search/filter the business directory.
- `/cultural-clubs` Cultural clubs listing.
- `/sport-clubs` Sport clubs listing.
- `/register` Register: pick what to register.
- `/register/business` Register business.
- `/register/cultural-club` Register cultural club.
- `/register/sport-club` Register sport club.
- `/login` Sign in / sign up.
- `/account` Account (and admin link if role=admin).
- `/account/submissions` Your submissions + edit links (pending only).
- `/admin` Admin approval dashboard.
- `/info` Setup + how it works.
- `/about` About: short project explanation.

## Deploy To Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Set environment variables in Vercel (Project Settings -> Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
