-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- This script creates the necessary rules to allow your app to
-- read data from the public tables.
-- =================================================================

-- 1. Enable RLS and create a read-access policy for the `players` table.
-- This allows anyone to view the list of players.
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to players" ON public.players;

CREATE POLICY "Allow public read access to players"
ON public.players
FOR SELECT
USING (true);


-- 2. Enable RLS and create a read-access policy for the `matches` table.
-- This allows anyone to view the list of matches.
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to matches" ON public.matches;

CREATE POLICY "Allow public read access to matches"
ON public.matches
FOR SELECT
USING (true);


-- 3. Enable RLS and create a read-access policy for the `contests` table.
-- This allows anyone to view the list of contests.
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to contests" ON public.contests;

CREATE POLICY "Allow public read access to contests"
ON public.contests
FOR SELECT
USING (true);
