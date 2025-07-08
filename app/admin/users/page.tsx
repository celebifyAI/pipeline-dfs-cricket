import { Suspense } from "react";
import { getUsers } from "@/lib/data";
import { UserList } from "@/components/admin/user-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { Profile } from "@/components/admin/user-list";
import { Skeleton } from "@/components/ui/skeleton";

async function UserTable() {
  const users = (await getUsers()) as Profile[];
  return <UserList users={users} />;
}

export default function Page() {
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button asChild>
          <Link href="/admin/users/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create User
          </Link>
        </Button>
      </div>
      <div>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <UserTable />
        </Suspense>
      </div>
    </div>
  );
} 