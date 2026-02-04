-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) to create the coupons table.
-- Same project as stores. Use with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

-- Coupons table: one row per coupon, linked to store via slug/name in data
create table if not exists public.coupons (
  id text primary key,
  data jsonb not null
);

-- After creating the table, run migration from Admin: Coupons → "Migrate to coupons table"
-- (or POST /api/coupons/migrate) to move existing coupon rows from stores table into this table.
