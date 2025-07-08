// --- START: COPY THIS CODE for app/admin/contests/page.tsx ---

import { getContests } from "@/lib/data";
import { ContestList } from "@/components/admin/contest-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminContestsPage() {
  const contests = await getContests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Contests</h1>
        <Button asChild>
          <Link href="/admin/contests/create">Create New Contest</Link>
        </Button>
      </div>
      
      {/* The ContestList component will display the contests in a table */}
      <ContestList contests={contests} />
    </div>
  );
}

// --- END: COPY THIS CODE ---