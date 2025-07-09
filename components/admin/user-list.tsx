'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, UserPlus, Trash2 } from "lucide-react"
import { deleteUser } from "@/app/admin/actions" // Assuming correct path
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import type { User } from "@/lib/data/admin";

export type { User as Profile }; // Keep Profile for compatibility if needed elsewhere, but internally use User

// A more robust and visually appealing UserList component
export function UserList({ users }: { users: User[] }) {
  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'promoter':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Handle the empty state
  if (!users || users.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
            <div className="mx-auto bg-gray-800 rounded-full p-3 w-fit">
                <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
          <CardTitle className="mt-4">No Users Found</CardTitle>
          <CardDescription>
            It looks like there are no users on the platform yet. <br />
            Get started by creating the first user account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/users/create">Create a New User</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Display the table if there are users
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>A list of all users on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                    {user.role || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/users/${user.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the user account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={async () => {
                            const result = await deleteUser(user.id)
                            if (result?.message.includes("success")) {
                                toast.success("User deleted successfully.")
                            } else {
                                toast.error("Failed to delete user.")
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 