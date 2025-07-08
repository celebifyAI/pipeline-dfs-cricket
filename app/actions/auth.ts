"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export type FormState =
  | {
      errors?: {
        fullName?: string[]
        email?: string[]
        mobile?: string[]
        password?: string[]
        confirmPassword?: string[]
      }
      message?: string
    }
  | undefined

// Use Supabase Auth for signup
export async function signupUser(state: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient(cookies())

  const validatedFields = SignupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign Up.",
    }
  }

  const { fullName, email, mobile, countryCode, password } = validatedFields.data
  const fullMobile = `+${countryCode}${mobile}`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: fullMobile,
        // Add other metadata here if needed
      },
    },
  })

  if (error) {
    console.error("Supabase Signup Error:", error)
    return {
      message: error.message,
    }
  }
  
  revalidatePath("/")
  redirect("/auth/login?message=Signup successful! Please check your email to confirm.")
}

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

// Use Supabase Auth for login
export async function loginUser(prevState: any, formData: FormData) {
  const supabase = createClient(cookies())
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Log In.",
    }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Supabase Login Error:", error)
    return {
      message: error.message, 
    }
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Check your custom 'profiles' table or user metadata for admin status
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user?.id)
    .single();

  // Redirect based on role
  if (userProfile?.is_admin) {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}

const SignupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email format."),
    mobile: z.string().min(7, "Invalid mobile number."),
    countryCode: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export async function getUserProfile() {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
