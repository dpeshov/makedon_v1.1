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

## Supabase Setup

1. Create a Supabase project.
2. Create the `businesses` table (SQL editor):

```sql
create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  owner_name text not null,
  country text not null,
  city text not null,
  industry text not null,
  sub_industry text,
  description text not null,
  phone text,
  address text,
  other_locations text,
  locations_description text,
  offerings text,
  offerings_description text,
  website text,
  email text not null,
  created_at timestamptz not null default now()
);

create index if not exists businesses_company_name_idx on public.businesses (company_name);
create index if not exists businesses_country_idx on public.businesses (country);
create index if not exists businesses_city_idx on public.businesses (city);
create index if not exists businesses_industry_idx on public.businesses (industry);
```

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

- `/` Home: search by company name and filter by country/city/industry.
- `/register` Register: submits a business to Supabase.
- `/about` About: short project explanation.

## Deploy To Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Set environment variables in Vercel (Project Settings -> Environment Variables):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy.
