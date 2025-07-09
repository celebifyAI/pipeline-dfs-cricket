"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { z } from "zod"

const UserSchema = z.object({
  userId: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  role: z.enum(["admin", "challenger", "promoter", "vip"]),
})

export async function updateUser(state: any, formData: FormData) {
  const supabase = createAdminClient()
  const validatedFields = UserSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data. Failed to update user.",
    }
  }

  const { userId, fullName, role } = validatedFields.data

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { full_name: fullName },
    app_metadata: { role: role },
  })

  if (error) {
    console.error("Error updating user:", error)
    return { message: "Error: " + error.message }
  }

  revalidatePath("/admin/users")
  return { message: "User updated successfully." }
}

export async function deleteUser(userId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error("Error deleting user:", error)
    return { message: "Error: " + error.message }
  }

  revalidatePath("/admin/users")
  return { message: "User deleted successfully." }
}
