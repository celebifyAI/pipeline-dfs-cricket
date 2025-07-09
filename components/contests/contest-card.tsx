import type { Contest } from "@/lib/data/public";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trophy, Tag, ArrowRight } from "lucide-react"

export function ContestCard({ contest }: { contest: Contest }) {
  const prizeInLakh = (contest.total_prize / 100000).toFixed(2)

  return (
    <Card className="bg-[#121212] border-gray-800 text-white flex flex-col hover:border-green-500 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{contest.name}</CardTitle>
        <CardDescription className="text-gray-400">Ends: {new Date(contest.ends_at).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Trophy className="h-4 w-4 text-green-400" />
            Total Prize
          </span>
          <span className="font-bold text-lg text-green-400">₹{prizeInLakh} Lakhs</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            Entries
          </span>
          <span>
            {contest.current_entries.toLocaleString()}/{contest.max_entries.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Tag className="h-4 w-4" />
            Entry Fee
          </span>
          <span className="font-semibold">₹{contest.entry_fee}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-black font-bold">
          Join Contest <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
