import { createAdminClient } from "@/lib/supabase/admin";
import { unstable_noStore as noStore } from 'next/cache';

export type User = {
  id: string;
  email?: string;
  phone?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  full_name?: string;
  avatar_url?: string;
};

// Fetches all user profiles using the admin client to bypass RLS
export async function getUsers(): Promise<{ data: User[] | null, error: string | null }> {
    noStore();
    const supabaseAdmin = createAdminClient();
    // Using the admin client here, we query the new users_view
    const { data, error } = await supabaseAdmin
        .from("users_view")
        .select(`*`);

    if (error) {
        console.error("Database Error (getUsers):", error.message);
        return { data: null, error: "Failed to fetch users." };
    }
    return { data: data as User[], error: null };
}

// Fetches a single user by their ID
export async function getUserById(userId: string): Promise<{ data: User | null, error: string | null }> {
    noStore();
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
        .from("users_view")
        .select(`*`)
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Database Error (getUserById):", error.message);
        return { data: null, error: "Failed to fetch user." };
    }
    return { data: data as User, error: null };
} 