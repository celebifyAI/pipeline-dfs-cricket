'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { createContest, updateContest, type State } from '@/app/admin/manage-contests/actions'
import type { Match, ContestType } from '@/lib/data'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// This schema must match the one in your server action
const FormSchema = z.object({
  name: z.string().min(1, 'Contest name is required.'),
  contest_type_id: z.coerce.number({ invalid_type_error: 'Please select a contest type.' }),
  match_id: z.coerce.number({ invalid_type_error: 'Please select a match.' }),
  total_prize: z.coerce.number().min(0, 'Total prize must be a positive number.'),
  entry_fee: z.coerce.number().min(0, 'Entry fee must be a positive number.'),
  max_entries: z.coerce.number().min(1, 'Max entries must be at least 1.'),
})

type ContestFormProps = {
  contest?: any // In edit mode, we'll pass the contest data here
  matches: Match[]
  contestTypes: ContestType[]
}

export function ContestForm({ contest, matches, contestTypes }: ContestFormProps) {
  const router = useRouter()
  const isEditMode = !!contest?.contest_id

  // Determine which action to use
  const action = isEditMode ? updateContest : createContest

  // useActionState handles form state, pending status, and server responses
  const [state, formAction, isPending] = useActionState<State, FormData>(action, null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: contest?.name || '',
      contest_type_id: contest?.type_id || undefined,
      match_id: contest?.match_id || undefined,
      total_prize: contest?.total_prize || 0,
      entry_fee: contest?.entry_fee || 0,
      max_entries: contest?.max_entries || 1,
    },
  })

  // This effect listens for a successful response from the server action
  useEffect(() => {
    if (state?.message && !state.errors) {
      toast.success(state.message)
      router.push('/admin/manage-contests') // Redirect on success
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Contest' : 'Create Contest'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hidden input for contest_id in edit mode */}
            {isEditMode && <input type="hidden" name="contest_id" value={contest.contest_id} />}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Grand League" {...field} />
                  </FormControl>
                  <FormMessage>{state?.errors?.name?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="match_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a match" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {matches.map((match) => (
                          <SelectItem key={match.match_id} value={String(match.match_id)}>
                            {match.team_a_name} vs {match.team_b_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{state?.errors?.match_id?.[0]}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contest_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contest Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contest type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contestTypes.map((type) => (
                          <SelectItem key={type.type_id} value={String(type.type_id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{state?.errors?.contest_type_id?.[0]}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="total_prize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Prize (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.total_prize?.[0]}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entry_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.entry_fee?.[0]}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_entries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Entries</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage>{state?.errors?.max_entries?.[0]}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Saving Changes...' : 'Creating Contest...'}
                </>
              ) : (
                isEditMode ? 'Save Changes' : 'Create Contest'
              )}
            </Button>
            
            {/* Server message display */}
            {state?.message && !state.errors && (
               <p className="text-sm font-medium text-green-500">{state.message}</p>
            )}
             {state?.message && state.errors && (
               <p className="text-sm font-medium text-destructive">{state.message}</p>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
