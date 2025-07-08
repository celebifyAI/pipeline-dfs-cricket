import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import type { Contest } from "@/lib/data" // Import the correct Contest type

export function ContestList({ contests }: { contests: Contest[] }) {
  if (!contests || contests.length === 0) {
    return <p className="text-gray-400">No contests found.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <Card key={contest.contest_id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{contest.name}</CardTitle>
            <CardDescription>
              {contest.match ? `${contest.match.team_a_name} vs ${contest.match.team_b_name}` : "Match not set"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Entries</span>
              <span>
                0/{contest.max_entries}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Fee</span>
              <span>₹{contest.entry_fee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Prize</span>
              <span className="font-bold text-purple-400">₹{contest.total_prize.toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/manage-contests/${contest.contest_id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
