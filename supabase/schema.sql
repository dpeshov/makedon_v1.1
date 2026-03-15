-- Schema for Macedonian Diaspora Register (MVP)
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Businesses
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

-- Cultural clubs (separate table for future custom fields)
create table if not exists public.cultural_clubs (
  id uuid primary key default gen_random_uuid(),
  club_name text not null,
  contact_name text not null,
  country text not null,
  city text not null,
  description text not null,
  phone text,
  address text,
  website text,
  email text not null,
  focus_areas text,
  activities text,
  facebook text,
  instagram text,
  created_at timestamptz not null default now()
);

create index if not exists cultural_clubs_club_name_idx on public.cultural_clubs (club_name);
create index if not exists cultural_clubs_country_idx on public.cultural_clubs (country);
create index if not exists cultural_clubs_city_idx on public.cultural_clubs (city);

-- Sport clubs (separate table for future custom fields)
create table if not exists public.sport_clubs (
  id uuid primary key default gen_random_uuid(),
  club_name text not null,
  contact_name text not null,
  country text not null,
  city text not null,
  sport text not null,
  description text not null,
  phone text,
  address text,
  website text,
  email text not null,
  training_schedule text,
  age_groups text,
  league text,
  facebook text,
  instagram text,
  created_at timestamptz not null default now()
);

create index if not exists sport_clubs_club_name_idx on public.sport_clubs (club_name);
create index if not exists sport_clubs_country_idx on public.sport_clubs (country);
create index if not exists sport_clubs_city_idx on public.sport_clubs (city);
create index if not exists sport_clubs_sport_idx on public.sport_clubs (sport);
