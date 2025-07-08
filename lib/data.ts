// --- START: COPY THIS CODE for lib/data.ts ---

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from 'next/cache';

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

// --- END: COPY THIS CODE ---