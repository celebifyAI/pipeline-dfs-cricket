import { getUserById } from "@/lib/data/admin";
import { notFound } from "next/navigation"
import EditUserForm from "@/components/admin/edit-user-form"

export default async function Page({ params }: { params: { userId: string } }) {
  const id = params.userId
  const { data: user, error } = await getUserById(id)

  if (error || !user) {
    notFound()
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <EditUserForm user={user} />
    </div>
  )
} 