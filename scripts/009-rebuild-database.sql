-- =================================================================
-- MASTER DATABASE REBUILD SCRIPT
-- Version: 1.0
-- WARNING: This script will delete and recreate all gameplay-related tables.
-- Run this script to reset the database to a clean, known state.
-- =================================================================

-- STEP 1: DROP ALL EXISTING TABLES in reverse order of dependency
-- This ensures a clean slate and avoids dependency errors.
DROP TABLE IF EXISTS public.user_contest_entries CASCADE;
DROP TABLE IF EXISTS public.lineup_players CASCADE;
DROP TABLE IF EXISTS public.lineups CASCADE;
DROP TABLE IF EXISTS public.contest_media CASCADE;
DROP TABLE IF EXISTS public.contests CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
-- We are not dropping public.users as it contains login information.

-- STEP 2: CREATE ALL TABLES

-- `matches` table
CREATE TABLE public.matches (
  match_id SERIAL PRIMARY KEY,
  team_a_name VARCHAR(100) NOT NULL,
  team_b_name VARCHAR(100) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  venue VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Upcoming'
);

-- `players` table
CREATE TABLE public.players (
  player_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  team_name VARCHAR(100),
  photo_url TEXT,
  initial_salary INT NOT NULL DEFAULT 100000
);

-- `contests` table (Recreated from our previous work)
CREATE TABLE public.contests (
    contest_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    match_id INT REFERENCES public.matches(match_id),
    total_prize INT NOT NULL,
    entry_fee INT NOT NULL,
    max_entries INT NOT NULL,
    current_entries INT DEFAULT 0,
    created_by INT REFERENCES public.users(user_id),
    ends_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) DEFAULT 'Upcoming'
);

-- `contest_media` table
CREATE TABLE public.contest_media (
    media_id SERIAL PRIMARY KEY,
    contest_id INT NOT NULL REFERENCES public.contests(contest_id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image',
    media_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- `lineups` table
CREATE TABLE public.lineups (
  lineup_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  match_id INT NOT NULL REFERENCES public.matches(match_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- `lineup_players` (Join Table)
CREATE TABLE public.lineup_players (
  lineup_id INT NOT NULL REFERENCES public.lineups(lineup_id) ON DELETE CASCADE,
  player_id INT NOT NULL REFERENCES public.players(player_id) ON DELETE CASCADE,
  lineup_role VARCHAR(50) NOT NULL DEFAULT 'Player',
  PRIMARY KEY (lineup_id, player_id)
);

-- `user_contest_entries` (Join Table)
CREATE TABLE public.user_contest_entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    contest_id INT NOT NULL REFERENCES public.contests(contest_id) ON DELETE CASCADE,
    lineup_id INT NOT NULL REFERENCES public.lineups(lineup_id) ON DELETE CASCADE,
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    points INT,
    rank INT,
    UNIQUE(user_id, contest_id, lineup_id) -- A user can't enter the same lineup into the same contest twice
);


-- STEP 3: SEED ALL DUMMY DATA

-- Seed Matches
INSERT INTO public.matches (match_id, team_a_name, team_b_name, starts_at, venue, status)
VALUES
  (1, 'India', 'Australia', NOW() + INTERVAL '2 day', 'Melbourne Cricket Ground', 'Upcoming'),
  (2, 'England', 'South Africa', NOW() + INTERVAL '3 day', 'Lord''s Cricket Ground', 'Upcoming');

-- Seed Players
INSERT INTO public.players (name, role, team_name, photo_url, initial_salary)
VALUES
  ('Virat Kohli', 'Batsman', 'India', NULL, 1100000),
  ('Rohit Sharma', 'Batsman', 'India', NULL, 1050000),
  ('Jasprit Bumrah', 'Bowler', 'India', NULL, 1000000),
  ('Rishabh Pant', 'Wicketkeeper', 'India', NULL, 950000),
  ('Pat Cummins', 'Bowler', 'Australia', NULL, 1080000),
  ('Steve Smith', 'Batsman', 'Australia', NULL, 1020000),
  ('Jos Buttler', 'Wicketkeeper', 'England', NULL, 1090000),
  ('Ben Stokes', 'All-Rounder', 'England', NULL, 1050000),
  ('Quinton de Kock', 'Wicketkeeper', 'South Africa', NULL, 1070000),
  ('Kagiso Rabada', 'Bowler', 'South Africa', NULL, 1010000);

-- Seed a dummy contest
INSERT INTO public.contests (contest_id, name, match_id, total_prize, entry_fee, max_entries, ends_at, status)
VALUES
  (1, 'Weekend Mega Bash - IND vs AUS', 1, 500000, 49, 10000, NOW() + INTERVAL '1 day', 'Upcoming');

-- Reset sequences to avoid conflicts with manual ID numbers
SELECT setval('public.matches_match_id_seq', (SELECT MAX(match_id) FROM public.matches));
SELECT setval('public.contests_contest_id_seq', (SELECT MAX(contest_id) FROM public.contests));

-- End of script
