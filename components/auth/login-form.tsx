"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrophyIcon, Loader2, KeyRound, AtSign } from "lucide-react"
import { loginUser } from "@/app/actions/auth"

export default function LoginForm() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(loginUser, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrophyIcon className="h-8 w-8 text-green-400" />
            <h1 className="text-2xl font-bold text-white">PIPELINE</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-green-400">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">Sign in to access your dashboard and contests.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <div className="relative mt-1">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {state?.errors?.email && <p className="text-sm text-red-400 mt-1">{state.errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              {state?.errors?.password && <p className="text-sm text-red-400 mt-1">{state.errors.password[0]}</p>}
            </div>

            {/* Server Error Message */}
            {state?.message && (
              <div className="bg-red-900/50 border border-red-700 rounded-md p-3 text-center">
                <p className="text-sm text-red-300">{state.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-black">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/signup")}
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
