import type { ReactNode } from "react"
import Link from "next/link"
import { Trophy, Users, Settings, LayoutDashboard } from "lucide-react"

// This layout provides the navigation for the Promoter (admin).
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] text-white">
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-800 bg-[#121212] p-4 md:flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold">PIPELINE</h1>
        </div>
        <nav className="flex-grow space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/contests"
            className="flex items-center gap-3 rounded-lg bg-gray-800 px-3 py-2 text-white" // Active link style
          >
            <Trophy className="h-5 w-5" />
            Contests
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#121212] px-6">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <div className="flex items-center gap-4">
            {/* You can add a user menu here for the admin */}
            <p>Welcome, Admin</p>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
