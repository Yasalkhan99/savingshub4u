-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to create the stores table.
-- Then in Vercel (or your host) set Environment Variables:
--   NEXT_PUBLIC_SUPABASE_URL = your project URL
--   SUPABASE_SERVICE_ROLE_KEY = your service_role key (Project Settings → API)

create table if not exists public.stores (
  id text primary key,
  data jsonb not null
);
