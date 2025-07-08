// Temporary file to bypass Supabase for debugging purposes
import type { Contest } from "@/types"

export async function getContests(): Promise<Contest[]> {
  console.log("Using temporary getContests function to bypass Supabase.");
  // Return a hardcoded empty array or some dummy data
  return [];
  // Or, if you want to see some data on the page:
  /*
  return [
    {
      contest_id: 9001,
      name: "Dummy Contest 1",
      match_id: null,
      total_prize: 5000,
      entry_fee: 25,
      max_entries: 50,
      current_entries: 10,
      created_by: null,
      ends_at: "2025-01-01T00:00:00Z",
      status: "Upcoming"
    },
    {
      contest_id: 9002,
      name: "Dummy Contest 2",
      match_id: null,
      total_prize: 7500,
      entry_fee: 35,
      max_entries: 75,
      current_entries: 20,
      created_by: null,
      ends_at: "2025-01-05T00:00:00Z",
      status: "Upcoming"
    }
  ];
  */
}
