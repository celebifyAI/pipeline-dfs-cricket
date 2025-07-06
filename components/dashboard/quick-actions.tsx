import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Grid3x3, List, BarChart, PlusSquare } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-gray-900 border-gray-600 hover:bg-gray-700 text-white"
          asChild
        >
          <Link href="/contests">
            <Grid3x3 className="h-4 w-4" />
            Browse All Contests
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-gray-900 border-gray-600 hover:bg-gray-700 text-white"
          asChild
        >
          <Link href="/my-contests">
            <List className="h-4 w-4" />
            My Joined Contests
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-gray-900 border-gray-600 hover:bg-gray-700 text-white"
          asChild
        >
          <Link href="/leaderboards">
            <BarChart className="h-4 w-4" />
            Check Leaderboards
          </Link>
        </Button>
        {/* This is the new link to the lineup creator */}
        <Button
          variant="outline"
          className="w-full justify-start gap-3 bg-purple-900/50 border-purple-700 hover:bg-purple-800/70 text-purple-300"
          asChild
        >
          <Link href="/lineups/create">
            <PlusSquare className="h-4 w-4" />
            Create New Lineup
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
