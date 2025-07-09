-- scripts/013-add-user-roles.sql

-- Step 1: Add a 'role' text field to the app_metadata in auth.users
-- We are not setting a default value here, as we will handle that with a trigger.
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT;


-- Step 2: Create a trigger function to set a default role for new users.
-- This function will be called whenever a new user is inserted into auth.users.
CREATE OR REPLACE FUNCTION public.set_default_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the role to 'challenger' for the new user.
  -- We access the new user record using the NEW variable.
  NEW.raw_app_meta_data = NEW.raw_app_meta_data || '{"role": "challenger"}';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Step 3: Create a trigger that executes the function on new user creation.
-- This trigger will fire BEFORE a new user is inserted into the table.
CREATE TRIGGER on_new_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_default_user_role();


-- Step 4: Create a function for admins to update user roles.
-- This function can be called via RPC from the admin client.
-- It takes a user_id and a new_role as arguments.
CREATE OR REPLACE FUNCTION public.update_user_role(
  user_id_to_update UUID,
  new_role TEXT
)
RETURNS TEXT AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- First, check if the currently authenticated user is an admin.
  -- We get the role from the JWT token's app_metadata.
  SELECT current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role'
  INTO current_user_role;

  -- If the user is not an admin, raise an exception.
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can update user roles.';
  END IF;

  -- If the user is an admin, update the target user's role.
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', new_role)
  WHERE id = user_id_to_update;

  RETURN 'Role updated successfully for user ' || user_id_to_update;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 