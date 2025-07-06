-- Drop tables using CASCADE to automatically remove dependent objects (like foreign keys).
-- This is much safer and more robust. We drop in reverse order of creation.
DROP TABLE IF EXISTS public.lineup_players CASCADE;
DROP TABLE IF EXISTS public.lineups CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;

-- This script creates the core tables needed for lineup creation.

-- 1. `matches` table: Stores information about each cricket match.
CREATE TABLE public.matches (
  match_id SERIAL PRIMARY KEY,
  team_a_name VARCHAR(100) NOT NULL,
  team_b_name VARCHAR(100) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  venue VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Upcoming' -- e.g., Upcoming, Live, Completed
);

-- 2. `players` table: Stores a central list of all players available in the platform.
CREATE TABLE public.players (
  player_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE, -- <<< THIS IS THE FIX: ADDED UNIQUE
  role VARCHAR(50) NOT NULL, -- e.g., Batsman, Bowler, All-Rounder, Wicketkeeper
  team_name VARCHAR(100),
  photo_url TEXT,
  initial_salary INT NOT NULL DEFAULT 100000 -- Base salary for a player
);

-- 3. `lineups` table: Stores the lineups created by users.
CREATE TABLE public.lineups (
  lineup_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  match_id INT NOT NULL REFERENCES public.matches(match_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE -- Promoter can make it public
);

-- 4. `lineup_players` (Join Table): Connects players to a specific lineup.
CREATE TABLE public.lineup_players (
  lineup_id INT NOT NULL REFERENCES public.lineups(lineup_id) ON DELETE CASCADE,
  player_id INT NOT NULL REFERENCES public.players(player_id) ON DELETE CASCADE,
  lineup_role VARCHAR(50) NOT NULL DEFAULT 'Player', -- Player, Captain, Vice-Captain
  PRIMARY KEY (lineup_id, player_id) -- Ensures a player can only be in a lineup once
);

-- Add comments for clarity
COMMENT ON COLUMN public.lineup_players.lineup_role IS 'Role within the lineup, e.g., Player, Captain, Vice-Captain.';
