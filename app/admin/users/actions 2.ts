"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, newRole: "admin" | "promoter" | "challenger") {
  const supabase = createClient(cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to perform this action." }
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (adminError || adminProfile?.role !== "admin") {
    return { error: "You do not have permission to change user roles." }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      is_admin: newRole === "admin" || newRole === "promoter",
    })
    .eq("id", userId)

  if (error) {
    return { error: `Database error: ${error.message}` }
  }

  revalidatePath("/admin/users")
  return { success: true }
}
