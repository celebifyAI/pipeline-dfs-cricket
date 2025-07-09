import { getContests } from "@/lib/data/public";
import { ContestCard } from "@/components/contests/contest-card";
import type { Contest } from "@/lib/data/public";

export default async function DashboardPage() {
  const { data: contests, error } = await getContests();

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Contests</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests && contests.map((contest) => (
          <ContestCard key={contest.contest_id} contest={contest} />
        ))}
      </div>
    </div>
  );
}
