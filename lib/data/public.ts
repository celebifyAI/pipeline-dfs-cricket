import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';

// Define the structure of your data types
export type Contest = {
  contest_id: number;
  name: string;
  match_id: number | null;
  total_prize: number;
  entry_fee: number;
  max_entries: number;
  current_entries: number;
  created_by: number | null;
  ends_at: string;
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
  match: {
    team_a_name: string;
    team_b_name: string;
    starts_at: string;
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
  starts_at: string;
  status: "Upcoming" | "Live" | "Completed";
};

// Fetches all contests
export async function getContests(): Promise<{ data: Contest[] | null, error: string | null }> {
  noStore();
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("contests")
    .select(`*, match:matches(*)`)
    .order('contest_id', { ascending: false });

  if (error) {
    console.error("Database Error (getContests):", error.message);
    return { data: null, error: "Failed to fetch contests." };
  }
  return { data, error: null };
}

// Fetches all matches for contest creation forms
export async function getMatches(): Promise<{ data: Match[] | null, error: string | null }> {
    noStore();
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from('matches').select('*').order('starts_at');

    if (error) {
        console.error('Database Error (getMatches):', error.message);
        return { data: null, error: "Failed to fetch matches." };
    }
    return { data, error: null };
}

// Fetches all contest types for contest creation forms
export async function getContestTypes(): Promise<{ data: ContestType[] | null, error: string | null }> {
    noStore();
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from('contest_types').select('*');

    if (error) {
        console.error('Database Error (getContestTypes):', error.message);
        return { data: null, error: "Failed to fetch contest types." };
    }
    return { data, error: null };
} 