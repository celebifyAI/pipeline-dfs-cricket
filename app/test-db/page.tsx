import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// This is a special diagnostic page to test the database connection.
export default async function TestDbPage() {
  let message
  let isError = false
  let details = ""

  try {
    const supabase = createClient(cookies())
    // We perform the simplest possible query: counting users.
    const { count, error } = await supabase.from("users").select("*", { count: "exact", head: true })

    if (error) {
      // If the query itself returns an error from Supabase
      throw new Error(error.message)
    }

    isError = false
    message = "SUCCESS: Application connected to the database."
    details = `Found ${count} user(s) in the 'users' table.`
  } catch (e: any) {
    // If the connection or query fails at a network level
    isError = true
    message = "ERROR: Application FAILED to connect to the database."
    details = `The error was: ${e.message}`
  }

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "2rem",
        backgroundColor: "#111",
        color: "#eee",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2rem", borderBottom: "1px solid #555", paddingBottom: "1rem" }}>
        Database Connection Test
      </h1>
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          border: `1px solid ${isError ? "#900" : "#090"}`,
          backgroundColor: isError ? "#300" : "#030",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: isError ? "#f88" : "#8f8", margin: 0 }}>{message}</p>
        <pre style={{ marginTop: "1rem", color: "#ccc", whiteSpace: "pre-wrap" }}>{details}</pre>
      </div>
    </div>
  )
}
