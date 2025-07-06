"use client"

import type React from "react"

import { useActionState, useState } from "react"
import type { Match, ContestType } from "@/lib/data"
import { createContest } from "@/app/admin/contests/actions"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"

export function ContestForm({ matches, contestTypes }: { matches: Match[]; contestTypes: ContestType[] }) {
  const [state, action, isPending] = useActionState(createContest, undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <form action={action}>
      <Card className="bg-[#121212] border-gray-800">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Contest Name</Label>
              <Input id="name" name="name" placeholder="e.g., Weekend Mega Bash" className="mt-1" />
              {state?.errors?.name && <p className="text-sm text-red-400 mt-1">{state.errors.name[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="match_id">Match</Label>
                <Select name="match_id">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                  <SelectContent>
                    {matches
                      .filter((m) => m.status === "Upcoming")
                      .map((match) => (
                        <SelectItem key={match.match_id} value={String(match.match_id)}>
                          {match.team_a_name} vs {match.team_b_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {state?.errors?.match_id && <p className="text-sm text-red-400 mt-1">{state.errors.match_id[0]}</p>}
              </div>
              <div>
                <Label htmlFor="contest_type_id">Contest Type</Label>
                <Select name="contest_type_id">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contestTypes.map((type) => (
                      <SelectItem key={type.type_id} value={String(type.type_id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.errors?.contest_type_id && (
                  <p className="text-sm text-red-400 mt-1">{state.errors.contest_type_id[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_prize">Total Prize (₹)</Label>
                <Input id="total_prize" name="total_prize" type="number" placeholder="50000" className="mt-1" />
                {state?.errors?.total_prize && (
                  <p className="text-sm text-red-400 mt-1">{state.errors.total_prize[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="entry_fee">Entry Fee (₹)</Label>
                <Input id="entry_fee" name="entry_fee" type="number" placeholder="49" className="mt-1" />
                {state?.errors?.entry_fee && <p className="text-sm text-red-400 mt-1">{state.errors.entry_fee[0]}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_entries">Max Entries</Label>
                <Input id="max_entries" name="max_entries" type="number" placeholder="1000" className="mt-1" />
                {state?.errors?.max_entries && (
                  <p className="text-sm text-red-400 mt-1">{state.errors.max_entries[0]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="ends_at">Ends At</Label>
                <Input id="ends_at" name="ends_at" type="datetime-local" className="mt-1" />
                {state?.errors?.ends_at && <p className="text-sm text-red-400 mt-1">{state.errors.ends_at[0]}</p>}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <Label htmlFor="banner">Contest Banner</Label>
            <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-700 px-6 py-10">
              <div className="text-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Banner preview"
                    width={400}
                    height={200}
                    className="mx-auto h-32 w-auto object-contain"
                  />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                  <label
                    htmlFor="banner"
                    className="relative cursor-pointer rounded-md font-semibold text-green-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-green-300"
                  >
                    <span>Upload a file</span>
                    <Input id="banner" name="banner" type="file" className="sr-only" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 4MB</p>
              </div>
            </div>
            {state?.errors?.banner && <p className="text-sm text-red-400 mt-1">{state.errors.banner[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-800/50 px-6 py-4">
          <div className="w-full flex justify-end">
            <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700 text-black">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Contest...
                </>
              ) : (
                "Create Contest"
              )}
            </Button>
          </div>
          {state?.message && <p className="text-sm text-red-400 mt-2">{state.message}</p>}
        </CardFooter>
      </Card>
    </form>
  )
}
