import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ available: false, error: "Email required" }, { status: 400 })
    }

    const supabase = createClient(cookies())

    // Check your public.users table
    const { data, error } = await supabase.from("users").select("user_id").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is what we want.
      // Any other error is a real problem.
      console.error("Email check DB error:", error)
      return NextResponse.json({ available: false, error: "Server error" }, { status: 500 })
    }

    if (data) {
      // Email exists
      return NextResponse.json({ available: false })
    }

    // Email is available
    return NextResponse.json({ available: true })
  } catch (error) {
    console.error("Email check error:", error)
    return NextResponse.json({ available: false, error: "Server error" }, { status: 500 })
  }
}
