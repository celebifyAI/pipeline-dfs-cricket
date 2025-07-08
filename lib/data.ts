// --- START: COPY THIS CODE for lib/data.ts ---

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';

// Define the structure of your data types
// This helps prevent errors and makes your code easier to work with.

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

// This function fetches all contests from the database.
export async function getContests() {
  // noStore() prevents the result from being cached.
  // This is useful for data that changes often.
  noStore();
  
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("contests")
    .select(`
      contest_id,
      name,
      total_prize,
      entry_fee,
      max_entries,
      status,
      match:matches (
        team_a_name,
        team_b_name,
        start_time
      )
    `)
    .order('contest_id', { ascending: false });

  if (error) {
    console.error("Database Error:", error.message);
    // Instead of crashing, we'll return an empty array.
    // The page can then display a "no contests found" message.
    return [];
  }

  return data as Contest[];
}

// --- END: COPY THIS CODE ---