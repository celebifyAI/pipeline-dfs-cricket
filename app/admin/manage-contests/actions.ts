'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  contest_id: z.coerce.number().optional(),
  name: z.string().min(1, "Contest name is required."),
  match_id: z.coerce.number({ required_error: "Please select a match." }),
  total_prize: z.coerce.number().min(0, "Total prize cannot be negative."),
  entry_fee: z.coerce.number().min(0, "Entry fee cannot be negative."),
  max_entries: z.coerce.number().positive("Max entries must be a positive number."),
  ends_at: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future.",
  }),
});

export type State = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
} | null;

const CreateContest = FormSchema.omit({ contest_id: true });
const UpdateContest = FormSchema;


export async function createContest(prevState: State, formData: FormData): Promise<State> {
    const supabase = createClient(cookies());
    
    const validatedFields = CreateContest.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Contest.',
      };
    }

    const { name, match_id, total_prize, entry_fee, max_entries, ends_at } = validatedFields.data;
    
    const { error } = await supabase
        .from('contests')
        .insert([{ name, match_id, total_prize, entry_fee, max_entries, ends_at }]);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/manage-contests');
    redirect('/admin/manage-contests');
}

export async function updateContest(prevState: State, formData: FormData): Promise<State> {
    const supabase = createClient(cookies());
    const validatedFields = UpdateContest.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Update Contest.',
        };
    }
    
    const { contest_id, name, match_id, total_prize, entry_fee, max_entries, ends_at } = validatedFields.data;

    const { error } = await supabase
        .from('contests')
        .update({ name, match_id, total_prize, entry_fee, max_entries, ends_at })
        .eq('contest_id', contest_id as number);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/manage-contests');
    redirect('/admin/manage-contests');
}

export async function deleteContest(formData: FormData) {
    const supabase = createClient(cookies());
    const contest_id = formData.get('contest_id');

    const { error } = await supabase
        .from('contests')
        .delete()
        .eq('contest_id', contest_id as string);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/manage-contests');
    return { success: true };
}