import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { Match, Player, Contest } from "@/types"

// Define the ContestType type
export type ContestType = {
  type_id: number
  name: string
  description: string | null
}

// This function fetches all available matches
export async function getMatches(): Promise<Match[]> {
  const supabase = createClient(cookies())
  const { data, error } = await supabase.from("matches").select("*").order("starts_at", { ascending: true })

  if (error) {
    console.error("Database Error fetching matches:", error.message)
    // Throw an error instead of returning an empty array
    throw new Error("Failed to fetch matches.")
  }
  return data
}

// This function fetches all available players
export async function getPlayers(): Promise<Player[]> {
  const supabase = createClient(cookies())
  const { data, error } = await supabase.from("players").select("*").order("initial_salary", { ascending: false })

  if (error) {
    console.error("Database Error fetching players:", error.message)
    // Throw an error instead of returning an empty array
    throw new Error("Failed to fetch players.")
  }
  return data
}

// This function fetches all available contests
export async function getContests(): Promise<Contest[]> {
  const supabase = createClient(cookies())
  const { data, error } = await supabase.from("contests").select("*").order("ends_at", { ascending: true })

  if (error) {
    console.error("Database Error fetching contests:", error.message)
    // Throw an error instead of returning an empty array
    throw new Error("Failed to fetch contests.")
  }
  return data
}

// This new function fetches your dynamic contest types
export async function getContestTypes(): Promise<ContestType[]> {
  const supabase = createClient(cookies())
  const { data, error } = await supabase.from("contest_types").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Database Error fetching contest types:", error.message)
    throw new Error("Failed to fetch contest types.")
  }
  return data
}
