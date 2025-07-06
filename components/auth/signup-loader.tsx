import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrophyIcon, Loader2 } from "lucide-react"

export default function SignupLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrophyIcon className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">PIPELINE</h1>
          </div>
          <Skeleton className="h-7 w-48 mx-auto bg-gray-700" />
          <Skeleton className="h-5 w-full max-w-xs mx-auto mt-2 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <Skeleton className="h-12 w-full bg-purple-800" />
          <div className="flex items-center justify-center pt-4">
            <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
            <p className="ml-2 text-gray-400">Loading Form...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
