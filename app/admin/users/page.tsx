import { getUsers } from "@/lib/data";
import { UserList } from "@/components/admin/user-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// This type assertion tells TypeScript what kind of data to expect
import type { Profile } from "@/components/admin/user-list";

export default async function Page() {
  const users = (await getUsers()) as Profile[];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button asChild>
          <Link href="/admin/users/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create User
          </Link>
        </Button>
      </div>
      <div className="mt-4">
        {/* We will build the UserList component next */}
        <UserList users={users} />
      </div>
    </div>
  );
} 