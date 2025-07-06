import { getContests } from "@/lib/data"
import { ContestCard } from "@/components/contests/contest-card"
import type { Contest } from "@/types"

// This is the Challenger's (player's) main dashboard page.
export default async function ChallengerDashboardPage() {
  // Fetch contests that are available to join.
  // In the future, this could be personalized.
  const contests: Contest[] = await getContests()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Contests</h1>
        <p className="text-gray-400 mt-1">Browse upcoming contests and join the action.</p>
      </div>

      {contests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <ContestCard key={contest.contest_id} contest={contest} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold text-white">No Contests Available</h3>
          <p className="text-gray-500 mt-2">There are currently no upcoming contests. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
