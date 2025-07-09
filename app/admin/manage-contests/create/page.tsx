import { getMatches, getContestTypes } from "@/lib/data/public";
import { ContestForm } from "@/components/admin/contest-form";
import type { Match, ContestType } from "@/lib/data/public";

export default async function CreateContestPage() {
  const [{ data: matches, error: matchesError }, { data: contestTypes, error: contestTypesError }] = await Promise.all([
    getMatches(),
    getContestTypes(),
  ]);

  if (matchesError || contestTypesError) {
    return <p className="text-red-500">{matchesError || contestTypesError}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Contest</h1>
      <ContestForm matches={matches || []} contestTypes={contestTypes || []} />
    </div>
  );
}
