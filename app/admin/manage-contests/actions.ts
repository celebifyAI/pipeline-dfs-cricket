'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  contest_id: z.coerce.number().optional(),
  name: z.string().min(1, 'Contest name is required.'),
  contest_type_id: z.coerce.number({ invalid_type_error: 'Please select a contest type.' }),
  match_id: z.coerce.number({ invalid_type_error: 'Please select a match.' }),
  total_prize: z.coerce.number().min(0, 'Total prize must be a positive number.'),
  entry_fee: z.coerce.number().min(0, 'Entry fee must be a positive number.'),
  max_entries: z.coerce.number().min(1, 'Max entries must be at least 1.'),
  // status: z.enum(['Upcoming', 'Live', 'Completed', 'Cancelled']),
});

const CreateContest = FormSchema.omit({ contest_id: true });
const UpdateContest = FormSchema;


export type State = {
  errors?: {
    name?: string[];
    contest_type_id?: string[];
    match_id?: string[];
    total_prize?: string[];
    entry_fee?: string[];
    max_entries?: string[];
  };
  message?: string | null;
};

export async function createContest(prevState: State, formData: FormData) {
  const validatedFields = CreateContest.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Contest.',
    };
  }

  const { name, contest_type_id, match_id, total_prize, entry_fee, max_entries } = validatedFields.data;
  const supabase = createClient(cookies());

  const { error } = await supabase.from('contests').insert({
    name,
    type_id: contest_type_id,
    match_id,
    total_prize,
    entry_fee,
    max_entries,
    status: 'Upcoming', // Default status
  });

  if (error) {
    return {
      message: `Database Error: Failed to Create Contest. ${error.message}`,
    };
  }

  revalidatePath('/admin/manage-contests');
  redirect('/admin/manage-contests');
}

export async function updateContest(prevState: State, formData: FormData) {
    const validatedFields = UpdateContest.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Contest.',
        };
    }

    const { contest_id, ...dataToUpdate } = validatedFields.data;
    
    if (contest_id === undefined) {
        return { message: "Contest ID is missing. Cannot update."}
    }

    const supabase = createClient(cookies());

    const { error } = await supabase
        .from('contests')
        .update({
            name: dataToUpdate.name,
            type_id: dataToUpdate.contest_type_id,
            match_id: dataToUpdate.match_id,
            total_prize: dataToUpdate.total_prize,
            entry_fee: dataToUpdate.entry_fee,
            max_entries: dataToUpdate.max_entries,
        })
        .eq('contest_id', contest_id);

    if (error) {
        return {
            message: `Database Error: Failed to Update Contest. ${error.message}`,
        };
    }

    revalidatePath('/admin/manage-contests');
    redirect('/admin/manage-contests');
}

export async function deleteContest(formData: FormData) {
  const id = formData.get('contest_id')?.toString();
  if (!id) {
    return { message: 'Contest ID not found.' };
  }
  
  const supabase = createClient(cookies());
  const { error } = await supabase.from('contests').delete().match({ contest_id: id });

  if (error) {
    return {
      message: `Database Error: Failed to Delete Contest. ${error.message}`
    }
  }
  revalidatePath('/admin/manage-contests');
}