"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import type { User } from "@/types/user" // Import User type

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

export async function signupUser(state: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient(cookies())

  // 1. Validate form data
  const validatedFields = SignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    countryCode: formData.get("countryCode"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { fullName, email, mobile, countryCode, password } = validatedFields.data
  const fullMobile = `${countryCode}${mobile}`

  try {
    // 2. Check if email or mobile already exists in your public.users table
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email, phone")
      .or(`email.eq.${email},phone.eq.${fullMobile}`)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking for existing user:", checkError)
      return { message: "Database error. Please try again." }
    }

    if (existingUser) {
      if (existingUser.email === email) {
        return { errors: { email: ["Email already registered"] } }
      }
      if (existingUser.phone === fullMobile) {
        return { errors: { mobile: ["Mobile number already registered"] } }
      }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Insert the new user into your public.users table
    const { error: insertError } = await supabase.from("users").insert({
      name: fullName, // Your schema has 'name', not 'full_name'
      email: email,
      phone: fullMobile,
      password_hash: hashedPassword,
      // Other fields like 'wallet_balance' have defaults in your schema
    })

    if (insertError) {
      console.error("User creation error:", insertError)
      return { message: "Failed to create account. Please try again." }
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { message: "An unexpected error occurred. Please try again." }
  }

  // 5. Redirect to a login page or dashboard after successful signup
  redirect("/auth/login") // Redirecting to login is safer after custom signup
}

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function loginUser(prevState: any, formData: FormData) {
  // 1. Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const supabase = createClient(cookies())

  let user: User | null = null // Declare user variable

  try {
    // 2. Find the user in the database
    const { data: userData, error: findError } = await supabase.from("users").select("*").eq("email", email).single()

    if (findError || !userData) {
      return { message: "No account found with this email." }
    }

    user = userData // Assign user data to user variable

    // 3. Compare the provided password with the stored hash
    const passwordsMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordsMatch) {
      return { message: "Invalid credentials. Please check your password." }
    }

    // 4. Create a session (e.g., using a JWT cookie)
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
    const jwt = await new SignJWT({
      userId: user.user_id,
      email: user.email,
      isAdmin: user.is_admin,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Session expires in 24 hours
      .sign(secret)

    cookies().set("session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  } catch (error) {
    console.error("Login error:", error)
    return { message: "An unexpected server error occurred." }
  }

  // 5. Redirect based on user role
  if (user.is_admin) {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}

const SignupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    mobile: z.string().min(7, "Invalid mobile number"),
    countryCode: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    confirmPassword: z.string(),
    referralCode: z.string().optional(), // We'll ignore this for now as referral system is not compatible
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
