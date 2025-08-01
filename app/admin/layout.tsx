// --- START: COPY THIS CODE for app/admin/layout.tsx ---

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sidebar from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If no user is logged in, redirect to the login page
    return redirect("/auth/login");
  }

  // Check for the user's role in the app_metadata.
  const userRole = user.app_metadata?.role;

  if (userRole !== "admin") {
    // If the user is not an admin,
    // redirect them to the main dashboard.
    return redirect("/dashboard");
  }

  // If the user is an admin, show the admin layout with a sidebar.
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-900 text-white">
        {children}
      </main>
    </div>
  );
}

// --- END: COPY THIS CODE ---