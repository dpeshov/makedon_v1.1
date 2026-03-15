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

1. Start the dev server:
   - `npm run dev`
2. In another PowerShell window, run the submission smoke test (submits 5 entries to each API):
   - `powershell -ExecutionPolicy Bypass -File scripts/smoke-submit.ps1`

## Supabase Setup

1. Create a Supabase project.
2. Create the required tables (SQL editor):
   - Run `supabase/schema.sql` (creates `public.businesses`, `public.cultural_clubs`, `public.sport_clubs`).

3. Get environment variables:
   - Supabase Dashboard -> Project Settings -> API
   - Copy the `URL` and the `service_role` key
4. Set local env vars in `.env.local`:
   - `SUPABASE_URL=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`

Optional demo data:

- Run `supabase/seed.sql` in the Supabase SQL editor to insert 10 demo businesses.

Security note:

- This MVP uses the Supabase `service_role` key only on the server (Next.js server components + API route). Do not expose it to the browser (never use `NEXT_PUBLIC_` for the service role key).
- The public directory page intentionally does not show `email` or `owner_name`.

## Pages

- `/` Home: setup + database status.
- `/businesses` Businesses: search/filter the business directory.
- `/cultural-clubs` Cultural clubs listing.
- `/sport-clubs` Sport clubs listing.
- `/register` Register: pick what to register.
- `/register/business` Register business.
- `/register/cultural-club` Register cultural club.
- `/register/sport-club` Register sport club.
- `/about` About: short project explanation.

## Deploy To Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Set environment variables in Vercel (Project Settings -> Environment Variables):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.
