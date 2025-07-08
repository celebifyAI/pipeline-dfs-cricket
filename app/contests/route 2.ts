    // app/contests/route.ts (Corrected path based on your structure)
    import { NextResponse } from 'next/server';
    import { getContests } from "@/lib/data"; // Use your original server data fetching function

    export async function GET() {
      try {
        const contests = await getContests();
        return NextResponse.json(contests);
      } catch (error: any) {
        console.error("API Error fetching contests:", error);
        return NextResponse.json({ message: "Failed to fetch contests", error: error.message }, { status: 500 });
      }
    }
