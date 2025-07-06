-- This script adds support for dynamic contest types, managed by the Admin.

-- 1. Create the new table to hold contest type definitions.
CREATE TABLE IF NOT EXISTS public.contest_types (
    type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add a foreign key column to the `contests` table.
-- We use "ADD COLUMN IF NOT EXISTS" for safety in re-running scripts.
ALTER TABLE public.contests
ADD COLUMN IF NOT EXISTS contest_type_id INT REFERENCES public.contest_types(type_id);

-- 3. Seed the table with some initial, common contest types.
INSERT INTO public.contest_types (name, description)
VALUES
    ('H2H', 'Head-to-Head: A one-on-one battle for the entire prize.'),
    ('Top 50%', 'A 50/50 contest where the top half of the entrants win.'),
    ('Mega Contest', 'Large field contest with a tiered prize structure.'),
    ('Winner Takes All', 'Multiple entrants, but only the rank 1 winner gets a prize.')
ON CONFLICT (name) DO NOTHING;

-- Set the sequence to the max value to avoid conflicts
SELECT setval('public.contest_types_type_id_seq', (SELECT MAX(type_id) FROM public.contest_types));
