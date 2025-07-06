"use client"

import type React from "react"
import { useState, useEffect, useOptimistic, useTransition } from "react"
import Image from "next/image"
import { getContestMedia, uploadContestMedia, deleteContestMedia, setPrimaryContestMedia } from "@/app/admin/actions"
import type { ContestMedia } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Trash2, Star, Loader2, AlertCircle } from "lucide-react"

export default function ContestMediaManager({ contestId }: { contestId: number }) {
  const [media, setMedia] = useState<ContestMedia[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, startUploading] = useTransition()

  // Optimistic state for a smoother UI
  const [optimisticMedia, setOptimisticMedia] = useOptimistic(
    media,
    (state, { action, item }: { action: "add" | "delete"; item: ContestMedia | number }) => {
      switch (action) {
        case "add":
          return [...state, item as ContestMedia]
        case "delete":
          return state.filter((m) => m.media_id !== item)
        default:
          return state
      }
    },
  )

  useEffect(() => {
    async function fetchMedia() {
      setIsLoading(true)
      try {
        const fetchedMedia = await getContestMedia(contestId)
        setMedia(fetchedMedia)
      } catch (e) {
        setError("Failed to load media. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMedia()
  }, [contestId])

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const file = formData.get("file") as File

    if (!file || file.size === 0) {
      setError("Please select a file to upload.")
      return
    }

    setError(null)

    startUploading(async () => {
      // We can't create a full optimistic item without the URL,
      // but we could show a placeholder if we wanted.
      const result = await uploadContestMedia(contestId, formData)
      if (result.success && result.newMedia) {
        setMedia((prev) => [result.newMedia!, ...prev])
        ;(event.target as HTMLFormElement).reset()
      } else {
        setError(result.error || "An unknown error occurred during upload.")
      }
    })
  }

  const handleDelete = async (mediaId: number, mediaUrl: string) => {
    setOptimisticMedia({ action: "delete", item: mediaId })
    const result = await deleteContestMedia(mediaId, mediaUrl, contestId)
    if (!result.success) {
      setError(result.error || "Failed to delete media.")
      // Revert optimistic update by refetching
      const fetchedMedia = await getContestMedia(contestId)
      setMedia(fetchedMedia)
    } else {
      setMedia((prev) => prev.filter((m) => m.media_id !== mediaId))
    }
  }

  const handleSetPrimary = async (mediaId: number) => {
    // Optimistically update the UI
    const newOptimisticMedia = media.map((m) => ({
      ...m,
      is_primary: m.media_id === mediaId,
    }))
    setMedia(newOptimisticMedia)

    const result = await setPrimaryContestMedia(contestId, mediaId)
    if (!result.success) {
      setError(result.error || "Failed to set primary media.")
      // Revert on failure
      const fetchedMedia = await getContestMedia(contestId)
      setMedia(fetchedMedia)
    }
  }

  return (
    <Card className="bg-[#121212] border-gray-800">
      <CardHeader>
        <CardTitle>Contest Media Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Form */}
        <form onSubmit={handleFileUpload} className="space-y-4 p-4 border border-gray-700 rounded-lg">
          <div>
            <Label htmlFor="file-upload">Upload New Media</Label>
            <Input id="file-upload" name="file" type="file" accept="image/*,video/*" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="alt_text">Alternative Text (for accessibility)</Label>
            <Input id="alt_text" name="alt_text" placeholder="e.g., Virat Kohli hitting a six" className="mt-1" />
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload Media
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-700 bg-red-900/50 p-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {/* Media Gallery */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Gallery</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : optimisticMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {optimisticMedia.map((item) => (
                <div
                  key={item.media_id}
                  className={`relative group border-2 rounded-lg overflow-hidden ${
                    item.is_primary ? "border-green-500" : "border-gray-700"
                  }`}
                >
                  <Image
                    src={item.media_url || "/placeholder.svg"}
                    alt={item.alt_text || "Contest media"}
                    width={200}
                    height={200}
                    className="object-cover w-full h-32"
                  />
                  {item.is_primary && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white p-1 rounded-full">
                      <Star className="h-3 w-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <p className="text-xs text-white text-center truncate w-full" title={item.file_name}>
                      {item.file_name}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetPrimary(item.media_id)}
                        disabled={item.is_primary}
                        className="text-xs"
                      >
                        <Star className="mr-1 h-3 w-3" /> Set Primary
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.media_id, item.media_url)}
                        className="text-xs"
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No media has been uploaded for this contest yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
