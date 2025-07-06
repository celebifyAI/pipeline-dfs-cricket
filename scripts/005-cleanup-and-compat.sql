-- This script cleans up tables from previous attempts and ensures compatibility.

-- Drop the tables that were created for the Supabase Auth system.
-- It's safe to run this even if the tables don't exist.
DROP TABLE IF EXISTS public.referrals;
DROP TABLE IF EXISTS public.wallets;
DROP TABLE IF EXISTS public.profiles;

-- The 'campaigns' table is okay to keep, but let's ensure it has the UNIQUE constraint.
ALTER TABLE public.campaigns
ADD CONSTRAINT campaigns_name_unique UNIQUE (name);
