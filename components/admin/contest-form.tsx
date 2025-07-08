// components/admin/contest-form.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Renamed and moved the actions file to the new folder
import { createContest, updateContest } from '@/app/admin/manage-contests/actions' // <-- FIXED IMPORT PATH
import type { ContestType } from '@/lib/data' // Assuming ContestType is still from lib/data

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Contest name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  total_prize: z.coerce.number().min(1, { message: 'Prize must be at least 1.' }),
  entry_fee: z.coerce.number().min(0, { message: 'Entry fee cannot be negative.' }),
  max_entries: z.coerce.number().min(1, { message: 'Max entries must be at least 1.' }),
  ends_at: z.date({
    required_error: 'An end date is required.',
  }),
  contest_type_id: z.coerce.number().min(1, { message: 'Contest type is required.' }),
})

type ContestFormProps = {
  initialData?: any // TODO: Replace 'any' with a proper Contest type
  contestTypes: ContestType[]
}

export function ContestForm({ initialData, contestTypes }: ContestFormProps) {
  const isEditMode = !!initialData?.contest_id

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      total_prize: initialData?.total_prize || 0,
      entry_fee: initialData?.entry_fee || 0,
      max_entries: initialData?.max_entries || 0,
      ends_at: initialData?.ends_at ? new Date(initialData.ends_at) : undefined,
      contest_type_id: initialData?.contest_type_id || undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let result
      if (isEditMode) {
        result = await updateContest(initialData.contest_id, values)
        toast.success('Contest updated successfully!')
      } else {
        result = await createContest(values)
        toast.success('Contest created successfully!')
        form.reset() // Clear form after successful creation
      }
      console.log('Operation Result:', result) // Log for debugging
    } catch (error: any) {
      console.error('Error submitting form:', error)
      toast.error(`Error: ${error.message || 'An unexpected error occurred.'}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Contest" {...field} />
              </FormControl>
              <FormDescription>This is the name of your fantasy contest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the contest" {...field} />
              </FormControl>
              <FormDescription>Optional: provide more details about the contest.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_prize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Prize (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
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
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_entries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Entries</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contest_type_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Contest Type</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? contestTypes.find(
                            (type) => type.type_id === field.value,
                          )?.name
                          : 'Select contest type'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search type..." />
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {contestTypes.map((type) => (
                            <CommandItem
                              value={type.name}
                              key={type.type_id}
                              onSelect={() => {
                                form.setValue('contest_type_id', type.type_id)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  type.type_id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {type.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Choose the type of contest (e.g., Head-to-Head, Mega Contest).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ends_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()} // Disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Set the date when this contest will no longer accept entries.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{isEditMode ? 'Update Contest' : 'Create Contest'}</Button>
      </form>
    </Form>
  )
}
