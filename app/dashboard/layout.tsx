import type { ReactNode } from "react"
import Link from "next/link"
import { Home, Trophy, Swords, UserCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

// This layout provides the navigation for the Challenger (player).
export default function ChallengerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-800 bg-[#121212] p-4 md:flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-green-400" />
          <h1 className="text-2xl font-bold">PIPELINE</h1>
        </div>
        <nav className="flex-grow space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/contests"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <Swords className="h-5 w-5" />
            My Contests
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            <UserCircle className="h-5 w-5" />
            My Profile
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#121212] px-6">
          {/* Mobile Header can have a menu button if needed */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <div className="text-sm font-bold text-white">₹1,250.00</div>
              <div className="text-xs text-gray-400">Playable Balance</div>
            </div>
            <Button variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
              <Wallet className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
