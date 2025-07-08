import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin"; // Import the new admin client
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';

// Define the structure of your data types
export type Contest = {
  contest_id: number;
  name: string;
  total_prize: number;
  entry_fee: number;
  max_entries: number;
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
  match: {
    team_a_name: string;
    team_b_name: string;
    start_time: string;
  } | null;
};

export type ContestType = {
  type_id: number;
  name: string;
  description: string | null;
};

export type Match = {
  match_id: number;
  team_a_name: string;
  team_b_name: string;
  start_time: string;
  status: "Upcoming" | "Live" | "Completed";
};

// Fetches all contests
export async function getContests() {
  noStore();
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("contests")
    .select(`*, match:matches(*)`)
    .order('contest_id', { ascending: false });

  if (error) {
    console.error("Database Error (getContests):", error.message);
    return [];
  }
  return data as Contest[];
}

// Fetches all matches for contest creation forms
export async function getMatches(): Promise<Match[]> {
    noStore();
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from('matches').select('*').order('start_time');

    if (error) {
        console.error('Database Error (getMatches):', error.message);
        return [];
    }
    return data;
}

// Fetches all contest types for contest creation forms
export async function getContestTypes(): Promise<ContestType[]> {
    noStore();
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from('contest_types').select('*');

    if (error) {
        console.error('Database Error (getContestTypes):', error.message);
        return [];
    }
    return data;
}

// Fetches all user profiles using the admin client to bypass RLS
export async function getUsers() {
    noStore();
    const supabaseAdmin = createAdminClient();
    // Using the admin client here
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select(`*`)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Database Error (getUsers):", error.message);
        return [];
    }
    return data;
}