import { getContests } from "@/lib/data"
import { ContestList } from "@/components/admin/contest-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function Page() {
  const contests = await getContests()

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Contests</h1>
        <Button asChild>
          <Link href="/admin/manage-contests/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Contest
          </Link>
        </Button>
      </div>
      <div className="mt-4">
        <ContestList contests={contests} />
      </div>
    </div>
  )
}
