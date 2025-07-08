"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const ContestSchema = z.object({
  name: z.string().min(5, "Contest name must be at least 5 characters"),
  match_id: z.coerce.number().min(1, "Please select a match"),
  contest_type_id: z.coerce.number().min(1, "Please select a contest type"),
  total_prize: z.coerce.number().min(0, "Total prize must be a positive number"),
  entry_fee: z.coerce.number().min(0, "Entry fee must be a positive number"),
  max_entries: z.coerce.number().min(2, "Maximum entries must be at least 2"),
  ends_at: z.string().min(1, "Please set an end date"),
  banner: z
    .instanceof(File)
    .refine((file) => file.size > 0, "A banner image is required.")
    .refine((file) => file.size < 4 * 1024 * 1024, "Image must be less than 4MB.")
    .refine((file) => file.type.startsWith("image/"), "Only image files are accepted."),
})

export async function createContest(prevState: any, formData: FormData) {
  const validatedFields = ContestSchema.safeParse({
    name: formData.get("name"),
    match_id: formData.get("match_id"),
    contest_type_id: formData.get("contest_type_id"),
    total_prize: formData.get("total_prize"),
    entry_fee: formData.get("entry_fee"),
    max_entries: formData.get("max_entries"),
    ends_at: formData.get("ends_at"),
    banner: formData.get("banner"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { banner, ...contestData } = validatedFields.data
  const supabase = createClient(cookies())

  try {
    // 1. Upload banner image to Vercel Blob
    const blob = await put(banner.name, banner, {
      access: "public",
    })

    // 2. Insert the contest into the database
    const { data: newContest, error: contestError } = await supabase
      .from("contests")
      .insert({
        ...contestData,
        status: "Upcoming", // Default status
      })
      .select()
      .single()

    if (contestError) {
      throw new Error(`Failed to create contest: ${contestError.message}`)
    }

    // 3. Insert the media record linked to the new contest
    const { error: mediaError } = await supabase.from("contest_media").insert({
      contest_id: newContest.contest_id,
      media_type: "image",
      media_url: blob.url,
      alt_text: `${newContest.name} banner`,
      is_primary: true,
    })

    if (mediaError) {
      // Here you might want to delete the contest and blob if this fails
      throw new Error(`Failed to save contest media: ${mediaError.message}`)
    }
  } catch (error: any) {
    return {
      message: error.message,
    }
  }

  // 4. Revalidate the path and redirect
  revalidatePath("/admin/contests")
  redirect("/admin/contests")
}
