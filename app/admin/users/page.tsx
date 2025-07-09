import { getUsers } from "@/lib/data/admin";
import { UserList } from "@/components/admin/user-list";
import type { User } from "@/lib/data/admin";

export default async function AdminUsersPage() {
    // We are fetching the users on the server side to ensure
    // the data is ready when the page is rendered.
    // The admin client is used to bypass RLS.
    const { data: users, error } = await getUsers();

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="mt-4">
                <UserList users={users || []} />
            </div>
        </div>
    );
} 