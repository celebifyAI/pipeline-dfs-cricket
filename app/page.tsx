import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, Trophy, Users, Menu } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
        <Link href="#" className="flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-green-400" />
          <span className="text-xl font-bold">PIPELINE</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Button asChild variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-green-500 hover:bg-green-600 text-black font-bold">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0A0A] border-gray-800">
              <div className="grid gap-4 p-4">
                <Link href="#" className="text-lg font-medium hover:underline underline-offset-4">
                  Features
                </Link>
                <Link href="#" className="text-lg font-medium hover:underline underline-offset-4">
                  Pricing
                </Link>
                <Link href="#" className="text-lg font-medium hover:underline underline-offset-4">
                  About
                </Link>
                <hr className="border-gray-800" />
                <Button asChild variant="outline" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-green-500 hover:bg-green-600 text-black font-bold">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 text-center bg-grid-small-white/[0.2] relative">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#0A0A0A] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="container px-4 md:px-6 z-10 relative">
            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of Fantasy Sports is Here
              </h1>
              <p className="text-lg text-gray-400 md:text-xl">
                Leverage expert insights, data-driven analysis, and a community of winners to build your next
                championship lineup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg">
                  <Link href="/auth/signup">
                    Claim Your Edge <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-gray-700 hover:bg-gray-800 text-lg"
                >
                  <Link href="#">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0A0A0A]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Win</h2>
              <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is packed with tools and features designed to give you a competitive advantage.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1 p-4 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-800 rounded-md">
                    <BarChart className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold">Data-Driven Insights</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Access advanced analytics and player performance data to make informed decisions.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-800 rounded-md">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold">Expert Lineups</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Follow and copy lineups from proven winners and top-ranked fantasy experts.
                </p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-800 rounded-md">
                    <Trophy className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold">Contest Variety</h3>
                </div>
                <p className="text-sm text-gray-400">
                  From high-stakes tournaments to casual head-to-head matches, find the perfect contest for you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">&copy; 2025 PIPELINE. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
