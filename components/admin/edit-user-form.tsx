"use client"

import { useActionState } from "react"
import { updateUser } from "@/app/admin/actions" // Corrected path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Profile } from "@/components/admin/user-list" // Reuse the Profile type
import { toast } from "sonner"
import { useEffect } from "react"

export default function EditUserForm({ user }: { user: Profile }) {
  const [state, action, isPending] = useActionState(updateUser, null)

  useEffect(() => {
    if (state?.message && state.message.includes("success")) {
      toast.success(state.message)
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" defaultValue={user.full_name || ""} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email || ""} disabled />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user.role || "challenger"}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="challenger">Challenger</SelectItem>
                <SelectItem value="promoter">Promoter</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 