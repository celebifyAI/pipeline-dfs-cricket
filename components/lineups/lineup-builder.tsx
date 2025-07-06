"use client"

import { useState } from "react"
import type { Match, Player } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function LineupBuilder({ matches, players }: { matches: Match[]; players: Player[] }) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)

  const selectedMatch = matches.find((m) => m.match_id.toString() === selectedMatchId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Select a Match</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedMatchId}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Choose an upcoming match..." />
            </SelectTrigger>
            <SelectContent>
              {matches
                .filter((match) => match.status === "Upcoming")
                .map((match) => (
                  <SelectItem key={match.match_id} value={match.match_id.toString()}>
                    {match.team_a_name} vs {match.team_b_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedMatch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Pool Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>2. Select Your Players</CardTitle>
              </CardHeader>
              <CardContent className="p-4 border-2 border-dashed border-gray-600 rounded-lg min-h-[400px]">
                <p className="text-gray-400 text-center">
                  The list of available players for {selectedMatch.team_a_name} vs {selectedMatch.team_b_name} will go
                  here.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Your Team Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Team</CardTitle>
              </CardHeader>
              <CardContent className="p-4 border-2 border-dashed border-gray-600 rounded-lg min-h-[400px]">
                <p className="text-gray-400 text-center">The 11 players you select will appear here.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
