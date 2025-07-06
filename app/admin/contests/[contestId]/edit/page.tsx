import ContestMediaManager from "@/components/admin/contest-media-manager"
import { notFound } from "next/navigation"

// This page will show the form to edit a contest and manage its media.
// It gets the contest ID from the URL.
export default function EditContestPage({ params }: { params: { contestId: string } }) {
  // The contestId from the URL will be a string, so we convert it to a number.
  const contestId = Number.parseInt(params.contestId, 10)

  // If the contestId is not a valid number (e.g., from a bad URL), show a "Not Found" page.
  if (isNaN(contestId)) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Contest #{contestId}</h1>

      {/* We will add the contest editing form here later. */}
      <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg">
        <p className="text-gray-400 text-center">Contest Edit Form will go here.</p>
      </div>

      {/* This is the media manager component we've been working on. */}
      <ContestMediaManager contestId={contestId} />
    </div>
  )
}
