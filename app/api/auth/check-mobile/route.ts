import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { mobile, countryCode } = await request.json()

    if (!mobile || !countryCode) {
      return NextResponse.json({ available: false, error: "Mobile and country code required" }, { status: 400 })
    }

    const fullMobile = `${countryCode}${mobile}`
    const supabase = createClient(cookies())

    // Check your public.users table
    const { data, error } = await supabase.from("users").select("user_id").eq("phone", fullMobile).single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found.
      console.error("Mobile check DB error:", error)
      return NextResponse.json({ available: false, error: "Server error" }, { status: 500 })
    }

    if (data) {
      // Mobile exists
      return NextResponse.json({ available: false })
    }

    // Mobile is available
    return NextResponse.json({ available: true })
  } catch (error) {
    console.error("Mobile check error:", error)
    return NextResponse.json({ available: false, error: "Server error" }, { status: 500 })
  }
}
