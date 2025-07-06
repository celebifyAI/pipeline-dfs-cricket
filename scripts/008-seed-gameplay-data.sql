-- This script seeds the database with dummy data for matches and players.
-- It's safe to run this multiple times, as ON CONFLICT DO NOTHING will prevent duplicates.

-- Seed Matches
INSERT INTO public.matches (match_id, team_a_name, team_b_name, starts_at, venue, status)
VALUES
  (1, 'India', 'Australia', NOW() + INTERVAL '2 day', 'Melbourne Cricket Ground', 'Upcoming'),
  (2, 'England', 'South Africa', NOW() + INTERVAL '3 day', 'Lord''s Cricket Ground', 'Upcoming'),
  (3, 'New Zealand', 'Pakistan', NOW() - INTERVAL '1 day', 'Eden Park', 'Completed')
ON CONFLICT (match_id) DO NOTHING;


-- Seed Players for India
INSERT INTO public.players (name, role, team_name, photo_url, initial_salary)
VALUES
  ('Virat Kohli', 'Batsman', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=VK', 1100000),
  ('Rohit Sharma', 'Batsman', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=RS', 1050000),
  ('Jasprit Bumrah', 'Bowler', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=JB', 1000000),
  ('Rishabh Pant', 'Wicketkeeper', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=RP', 950000),
  ('Hardik Pandya', 'All-Rounder', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=HP', 980000),
  ('Suryakumar Yadav', 'Batsman', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=SKY', 920000),
  ('Mohammed Siraj', 'Bowler', 'India', 'https://via.placeholder.com/150/0000FF/FFFFFF?text=MS', 880000)
ON CONFLICT (name) DO NOTHING;

-- Seed Players for Australia
INSERT INTO public.players (name, role, team_name, photo_url, initial_salary)
VALUES
  ('Pat Cummins', 'Bowler', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=PC', 1080000),
  ('Steve Smith', 'Batsman', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=SS', 1020000),
  ('David Warner', 'Batsman', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=DW', 1000000),
  ('Mitchell Starc', 'Bowler', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=MS', 980000),
  ('Glenn Maxwell', 'All-Rounder', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=GM', 960000),
  ('Travis Head', 'Batsman', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=TH', 940000),
  ('Alex Carey', 'Wicketkeeper', 'Australia', 'https://via.placeholder.com/150/FFD700/000000?text=AC', 850000)
ON CONFLICT (name) DO NOTHING;

-- Seed Players for England
INSERT INTO public.players (name, role, team_name, photo_url, initial_salary)
VALUES
  ('Jos Buttler', 'Wicketkeeper', 'England', 'https://via.placeholder.com/150/FFFFFF/FF0000?text=JB', 1090000),
  ('Ben Stokes', 'All-Rounder', 'England', 'https://via.placeholder.com/150/FFFFFF/FF0000?text=BS', 1050000),
  ('Jofra Archer', 'Bowler', 'England', 'https://via.placeholder.com/150/FFFFFF/FF0000?text=JA', 990000),
  ('Jonny Bairstow', 'Batsman', 'England', 'https://via.placeholder.com/150/FFFFFF/FF0000?text=JB', 930000)
ON CONFLICT (name) DO NOTHING;

-- Seed Players for South Africa
INSERT INTO public.players (name, role, team_name, photo_url, initial_salary)
VALUES
  ('Quinton de Kock', 'Wicketkeeper', 'South Africa', 'https://via.placeholder.com/150/008000/FFFFFF?text=QDK', 1070000),
  ('Kagiso Rabada', 'Bowler', 'South Africa', 'https://via.placeholder.com/150/008000/FFFFFF?text=KR', 1010000),
  ('Aiden Markram', 'Batsman', 'South Africa', 'https://via.placeholder.com/150/008000/FFFFFF?text=AM', 950000),
  ('Heinrich Klaasen', 'Batsman', 'South Africa', 'https://via.placeholder.com/150/008000/FFFFFF?text=HK', 970000)
ON CONFLICT (name) DO NOTHING;

-- Reset the sequence for match_id to avoid issues with manual inserts if needed
SELECT setval('public.matches_match_id_seq', (SELECT MAX(match_id) FROM public.matches));
