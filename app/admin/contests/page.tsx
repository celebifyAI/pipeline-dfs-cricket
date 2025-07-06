import { getContests } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Trash2, PlusCircle } from "lucide-react"

export default async function AdminContestsPage() {
  const contests = await getContests()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contest Management</h1>
          <p className="text-gray-400">Create, edit, and manage all contests on the platform.</p>
        </div>
        <Button asChild>
          <Link href="/admin/contests/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Contest
          </Link>
        </Button>
      </div>
      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-800/50 border-b-gray-800">
              <TableHead>Name</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Entries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contests.map((contest) => (
              <TableRow key={contest.contest_id} className="hover:bg-gray-800/50 border-b-gray-800">
                <TableCell className="font-medium">{contest.name}</TableCell>
                <TableCell>₹{contest.total_prize.toLocaleString()}</TableCell>
                <TableCell>₹{contest.entry_fee}</TableCell>
                <TableCell>
                  {contest.current_entries}/{contest.max_entries}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={contest.status === "Upcoming" ? "default" : "secondary"}
                    className={
                      contest.status === "Upcoming"
                        ? "bg-green-900/50 text-green-300 border-green-700"
                        : "bg-gray-700 text-gray-300"
                    }
                  >
                    {contest.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/contests/${contest.contest_id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
