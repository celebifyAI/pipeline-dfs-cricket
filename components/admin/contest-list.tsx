import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"

// Define a type for a single contest. You might need to adjust this to match your actual data structure.
type Contest = {
  id: number
  name: string
  type: string // e.g., 'EPP', 'H2H'
  match: string // e.g., 'India vs Australia'
  entries: number
  max_entries: number
  fee: number
  prize: number
}

// Dummy data for demonstration purposes. In your real app, this would come from a prop.
const dummyContests: Contest[] = [
  {
    id: 1,
    name: "Mega Contest - IND vs AUS",
    type: "EPP",
    match: "India vs Australia",
    entries: 0,
    max_entries: 1000,
    fee: 49,
    prize: 50000,
  },
  {
    id: 2,
    name: "Head to Head Battle",
    type: "H2H",
    match: "India vs Australia",
    entries: 0,
    max_entries: 2,
    fee: 100,
    prize: 180,
  },
  {
    id: 3,
    name: "IPL Final Showdown",
    type: "EPP",
    match: "Mumbai Indians vs Chennai Super...",
    entries: 0,
    max_entries: 500,
    fee: 50,
    prize: 25000,
  },
  {
    id: 4,
    name: "Winner Takes All",
    type: "WTA",
    match: "India vs Australia",
    entries: 0,
    max_entries: 50,
    fee: 250,
    prize: 10000,
  },
  {
    id: 5,
    name: "Top 3 Winners Only",
    type: "Top3",
    match: "England vs South Africa",
    entries: 0,
    max_entries: 100,
    fee: 150,
    prize: 5000,
  },
]

export function ContestList({ contests = dummyContests }: { contests: Contest[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <Card key={contest.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{contest.name}</CardTitle>
            <CardDescription>
              {contest.type} - {contest.match}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Entries</span>
              <span>
                {contest.entries}/{contest.max_entries}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Fee</span>
              <span>₹{contest.fee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Prize</span>
              <span className="font-bold text-purple-400">₹{contest.prize.toLocaleString("en-IN")}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/admin/contests/${contest.id}/edit`}>
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
