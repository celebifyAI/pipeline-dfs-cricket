import { getMatches, getContestTypes } from "@/lib/data"
import { ContestForm } from "@/components/admin/contest-form"

export default async function CreateContestPage() {
  // Fetch the necessary data for the form dropdowns
  const [matches, contestTypes] = await Promise.all([getMatches(), getContestTypes()])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a New Contest</h1>
        <p className="text-gray-400">Fill out the details below to launch a new contest.</p>
      </div>
      <ContestForm matches={matches} contestTypes={contestTypes} />
    </div>
  )
}
