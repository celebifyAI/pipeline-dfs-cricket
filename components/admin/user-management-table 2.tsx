"use client"

import type { UserProfile } from "@/types"
import { useState, useTransition } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateUserRole } from "@/app/admin/users/actions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"

// A single, self-contained card for one user
function UserCard({ user }: { user: UserProfile }) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // FIX #1: State for the *current* role and the *selected* role are now separate.
  const [currentRole, setCurrentRole] = useState<UserProfile["role"]>(user.role)
  const [selectedRole, setSelectedRole] = useState<UserProfile["role"]>(user.role)

  const hasChanged = selectedRole !== currentRole

  const userInitials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "NA"

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUserRole(user.id, selectedRole)
      if (result?.error) {
        toast({
          title: "Error updating role",
          description: result.error,
          variant: "destructive",
        })
        setSelectedRole(currentRole) // Revert dropdown on failure
      } else {
        // FIX #1 (continued): On success, update the current role state.
        // This will cause the badge to re-render with the new role.
        setCurrentRole(selectedRole)
        toast({
          title: "Role Updated",
          description: `Set ${user.full_name}'s role to ${selectedRole}.`,
        })
      }
    })
  }

  const getRoleBadgeVariant = (role: UserProfile["role"]) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "promoter":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="bg-[#121212] border-gray-800 text-white flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-gray-700 text-gray-300">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user.full_name}</CardTitle>
            {/* This badge now uses the 'currentRole' state, so it will update on save */}
            <Badge variant={getRoleBadgeVariant(currentRole)} className="mt-1 transition-colors">
              {currentRole}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-400">User ID: {user.id.substring(0, 8)}...</p>
      </CardContent>
      <CardFooter className="bg-gray-800/50 flex items-center justify-between p-4">
        <Select
          value={selectedRole}
          onValueChange={(newRole) => setSelectedRole(newRole as UserProfile["role"])}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="challenger">Challenger</SelectItem>
            <SelectItem value="promoter">Promoter</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {/* FIX #2: A better save button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanged || isPending}
          className="bg-green-600 hover:bg-green-700 text-black w-[100px]"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

// The main component that lays out the grid of cards
export function UserList({ users }: { users: UserProfile[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
