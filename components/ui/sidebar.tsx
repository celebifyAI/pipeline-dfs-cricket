// --- START: COPY THIS CODE for components/ui/sidebar.tsx ---

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trophy, Users, BarChart } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart },
  { href: "/admin/contests", label: "Contests", icon: Trophy },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <Trophy className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold">PIPELINE Admin</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}

// --- END: COPY THIS CODE ---