import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { UserProfile } from "@/types"
import { UserManagementTable } from "@/components/admin/user-management-table"

async function getUsers(): Promise<UserProfile[]> {
  const supabase = createClient(cookies())
  const { data, error } = await supabase.from("profiles").select("*")

  if (error) {
    console.error("Error fetching user profiles:", error)
    return []
  }
  return data as UserProfile[]
}

export default async function UserManagementPage() {
  const users = await getUsers()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-gray-400">View and manage user roles across the platform.</p>
      </div>
      <UserManagementTable users={users} />
    </div>
  )
}
