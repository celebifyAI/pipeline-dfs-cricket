import { createClient } from "@supabase/supabase-js";

// This admin client uses the SERVICE_ROLE_KEY to bypass RLS.
// It should ONLY be used in server-side code where you need to perform admin-level actions.
// NEVER expose the service role key on the client-side.

// Ensure your environment variables are set up in your hosting provider (Vercel).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase URL or Service Role Key is not defined in environment variables.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); 