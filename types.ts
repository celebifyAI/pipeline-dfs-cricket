// Defines the structure for a single player
export type Player = {
  player_id: number
  name: string
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicketkeeper"
  team_name: string
  photo_url: string | null
  initial_salary: number
}

// Defines the structure for a single match
export type Match = {
  match_id: number
  team_a_name: string
  team_b_name: string
  starts_at: string
  venue: string | null
  status: "Upcoming" | "Live" | "Completed"
}

// Defines the structure for a single contest
export type Contest = {
  contest_id: number
  name: string
  match_id: number | null
  total_prize: number
  entry_fee: number
  max_entries: number
  current_entries: number
  created_by: number | null
  ends_at: string
  status: "Upcoming" | "Live" | "Completed"
}

// Defines the structure for contest media (images/videos)
export type ContestMedia = {
  media_id: number
  contest_id: number
  media_type: "image" | "video"
  media_url: string
  thumbnail_url?: string | null
  file_name: string
  file_size?: number
  alt_text?: string
  is_primary: boolean
  uploaded_at: string
}
