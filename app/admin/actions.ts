"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import type { ContestMedia } from "@/types" // Assuming your types.ts is in the root or a shared lib folder

const getSupabaseClient = () => createClient(cookies())

export async function getContestMedia(contestId: number): Promise<ContestMedia[]> {
  console.log(`[getContestMedia] Fetching media for contest ${contestId}`)
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("contest_media")
    .select("*")
    .eq("contest_id", contestId)
    .order("is_primary", { ascending: false }) // Show primary first
    .order("uploaded_at", { ascending: false })

  if (error) {
    console.error(`[getContestMedia] Error fetching contest media for contest ${contestId}:`, error)
    return []
  }
  console.log(`[getContestMedia] Fetched ${data.length} media items for contest ${contestId}`)
  return data as ContestMedia[]
}

export async function uploadContestMedia(
  contestId: number,
  formData: FormData,
): Promise<{ success: boolean; error?: string; newMedia?: ContestMedia }> {
  const supabase = getSupabaseClient()
  const file = formData.get("file") as File
  const altText = (formData.get("alt_text") as string) || file.name

  console.log(`[uploadContestMedia] Received request for contest ${contestId}, file: ${file?.name}, alt: ${altText}`)

  if (!file) {
    console.error("[uploadContestMedia] No file provided.")
    return { success: false, error: "No file provided." }
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[uploadContestMedia] CRITICAL: BLOB_READ_WRITE_TOKEN is not set.")
    return { success: false, error: "File storage configuration error on server. Please contact support." }
  }
  console.log(`[uploadContestMedia] Attempting to upload ${file.name} to Vercel Blob.`)

  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    console.log(`[uploadContestMedia] File uploaded to Blob: ${blob.url}`)

    const mediaToInsert = {
      contest_id: contestId,
      media_type: file.type.startsWith("image/") ? "image" : "video", // Basic type detection
      media_url: blob.url,
      thumbnail_url: file.type.startsWith("image/") ? blob.url : null, // Placeholder, consider generating video thumbnails
      file_name: file.name,
      file_size: file.size,
      alt_text: altText,
      is_primary: false, // New uploads are not primary by default
    }
    console.log("[uploadContestMedia] Attempting to insert into DB:", mediaToInsert)

    const { data: newMediaData, error: dbError } = await supabase
      .from("contest_media")
      .insert(mediaToInsert)
      .select()
      .single()

    if (dbError) {
      console.error("[uploadContestMedia] DB Error saving media metadata:", dbError)
      // Attempt to clean up orphaned blob
      try {
        await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN })
        console.log(`[uploadContestMedia] Orphaned blob ${blob.url} deleted due to DB error.`)
      } catch (cleanupError) {
        console.error(`[uploadContestMedia] Failed to cleanup orphaned blob ${blob.url}:`, cleanupError)
      }
      return { success: false, error: `Failed to save media metadata: ${dbError.message}` }
    }

    if (!newMediaData) {
      console.error("[uploadContestMedia] DB insert succeeded but no data returned.")
      // This case might also warrant blob cleanup if an empty insert is considered an error
      return { success: false, error: "Failed to save media: no data returned from DB." }
    }

    console.log("[uploadContestMedia] Media metadata saved to DB:", newMediaData)
    // The revalidatePath call is temporarily removed for testing form submission behavior.
    // revalidatePath(`/admin/contests/${contestId}/edit`) // Or the path where media is displayed
    // revalidatePath(`/admin/contests`) // If media affects contest list
    return { success: true, newMedia: newMediaData as ContestMedia }
  } catch (error: any) {
    console.error("[uploadContestMedia] General error during file upload process:", error)
    // Check if blob was created and needs cleanup if error happened after put()
    // This part is tricky as 'blob' might be undefined if put() itself failed.
    return { success: false, error: error.message || "File upload process failed due to an unexpected error." }
  }
}

export async function deleteContestMedia(
  mediaId: number,
  mediaUrl: string,
  contestId: number, // Added contestId for revalidation path
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  console.log(`[deleteContestMedia] Attempting to delete media ${mediaId} (URL: ${mediaUrl}) for contest ${contestId}`)

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[deleteContestMedia] CRITICAL: BLOB_READ_WRITE_TOKEN is not set.")
    return { success: false, error: "File storage configuration error on server." }
  }

  try {
    // First, delete the record from Supabase
    const { error: dbError } = await supabase.from("contest_media").delete().eq("media_id", mediaId)

    if (dbError) {
      console.error(`[deleteContestMedia] DB Error deleting media record ${mediaId}:`, dbError)
      return { success: false, error: `Failed to delete media record: ${dbError.message}` }
    }
    console.log(`[deleteContestMedia] Media record ${mediaId} deleted from DB.`)

    // Then, delete the file from Vercel Blob storage
    await del(mediaUrl, { token: process.env.BLOB_READ_WRITE_TOKEN })
    console.log(`[deleteContestMedia] Blob ${mediaUrl} deleted from Vercel Blob storage.`)

    revalidatePath(`/admin/contests/${contestId}/edit`) // Revalidate the edit page
    // revalidatePath(`/admin/contests`) // And potentially the contest list
    return { success: true }
  } catch (error: any) {
    console.error(`[deleteContestMedia] General error deleting media ${mediaId}:`, error)
    return { success: false, error: error.message || "Media deletion failed." }
  }
}

export async function setPrimaryContestMedia(
  contestId: number,
  mediaIdToSetPrimary: number,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient()
  console.log(`[setPrimaryContestMedia] Setting media ${mediaIdToSetPrimary} as primary for contest ${contestId}`)

  // Transaction to first set all media for this contest to is_primary = false,
  // then set the selected one to is_primary = true.
  // Supabase Edge Functions or pg_net + HTTP calls would be needed for true transactions
  // across multiple await calls if not using raw SQL.
  // Simpler approach: Update all to false, then update one to true.

  // Step 1: Set all media for this contest_id to is_primary = false
  const { error: unsetError } = await supabase
    .from("contest_media")
    .update({ is_primary: false })
    .eq("contest_id", contestId)

  if (unsetError) {
    console.error(
      `[setPrimaryContestMedia] DB Error unsetting other primary media for contest ${contestId}:`,
      unsetError,
    )
    return { success: false, error: `Failed to unset other primary media: ${unsetError.message}` }
  }
  console.log(`[setPrimaryContestMedia] Unset other primary media for contest ${contestId}.`)

  // Step 2: Set the selected media_id to is_primary = true
  const { error: setError } = await supabase
    .from("contest_media")
    .update({ is_primary: true })
    .eq("media_id", mediaIdToSetPrimary)
    .eq("contest_id", contestId) // Ensure we only update for the correct contest

  if (setError) {
    console.error(
      `[setPrimaryContestMedia] DB Error setting primary media ${mediaIdToSetPrimary} for contest ${contestId}:`,
      setError,
    )
    // Potentially try to revert the unsetting if this fails? Complex.
    return { success: false, error: `Failed to set primary media: ${setError.message}` }
  }

  console.log(`[setPrimaryContestMedia] Media ${mediaIdToSetPrimary} set as primary for contest ${contestId}.`)
  revalidatePath(`/admin/contests/${contestId}/edit`)
  // revalidatePath(`/admin/contests`)
  return { success: true }
}

// Ensure your types.ts file (e.g., in root or lib/) has ContestMedia defined:
// export type ContestMedia = {
//   media_id: number;
//   contest_id: number;
//   media_type: "image" | "video";
//   media_url: string;
//   thumbnail_url?: string | null;
//   file_name: string;
//   file_size?: number;
//   alt_text?: string;
//   is_primary: boolean;
//   uploaded_at: string; // Or Date
//   // Add any other fields like dimensions, duration for video, etc.
// };
