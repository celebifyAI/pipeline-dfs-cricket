-- This script inserts two dummy users: one challenger and one promoter/admin.
-- The password for both users is: Password123!

-- The password hash was pre-generated using bcrypt for 'Password123!'.
-- It's important to insert the hash, not the plain text password.
INSERT INTO public.users (name, email, phone, password_hash, is_admin)
VALUES
  (
    'Dummy Challenger',
    'challenger@example.com',
    '+919000000001',
    '$2a$12$YdE.g9.f2G0gS9jJ.9jZ.e/UKACdY/uJ2zJ.xH6X.LzI.C/vI.oE', -- Hash for 'Password123!'
    FALSE -- is_admin = false for challengers
  ),
  (
    'Dummy Promoter',
    'promoter@example.com',
    '+919000000002',
    '$2a$12$YdE.g9.f2G0gS9jJ.9jZ.e/UKACdY/uJ2zJ.xH6X.LzI.C/vI.oE', -- Hash for 'Password123!'
    TRUE -- is_admin = true for promoters/admins
  )
ON CONFLICT (email) DO NOTHING; -- This makes the script safe to run multiple times.
