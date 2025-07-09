"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, TrophyIcon } from "lucide-react"
import { signupUser } from "@/app/actions/auth"
import { useActionState } from "react"

// Country codes for international mobile support
const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
]

interface ValidationState {
  email: { isValid: boolean; message: string; isChecking: boolean }
  mobile: { isValid: boolean; message: string; isChecking: boolean }
  password: { isValid: boolean; message: string }
  confirmPassword: { isValid: boolean; message: string }
}

export default function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, action, isPending] = useActionState(signupUser, undefined)

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    password: "",
    confirmPassword: "",
    referralCode: searchParams.get("ref") || "", // Auto-populate from URL
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Real-time validation state
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: "", isChecking: false },
    mobile: { isValid: false, message: "", isChecking: false },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
  })

  // Real-time email validation
  useEffect(() => {
    const validateEmail = async () => {
      if (!formData.email) {
        setValidation((prev) => ({
          ...prev,
          email: { isValid: false, message: "", isChecking: false },
        }))
        return
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setValidation((prev) => ({
          ...prev,
          email: { isValid: false, message: "Invalid email format", isChecking: false },
        }))
        return
      }

      // Check uniqueness
      setValidation((prev) => ({
        ...prev,
        email: { ...prev.email, isChecking: true },
      }))

      try {
        const response = await fetch("/api/auth/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        })
        const result = await response.json()

        setValidation((prev) => ({
          ...prev,
          email: {
            isValid: result.available,
            message: result.available ? "Email available" : "Email already registered",
            isChecking: false,
          },
        }))
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          email: { isValid: false, message: "Error checking email", isChecking: false },
        }))
      }
    }

    const debounceTimer = setTimeout(validateEmail, 500)
    return () => clearTimeout(debounceTimer)
  }, [formData.email])

  // Real-time mobile validation
  useEffect(() => {
    const validateMobile = async () => {
      if (!formData.mobile) {
        setValidation((prev) => ({
          ...prev,
          mobile: { isValid: false, message: "", isChecking: false },
        }))
        return
      }

      // Mobile format validation based on country code
      const mobileRegex =
        formData.countryCode === "+91"
          ? /^[6-9]\d{9}$/ // Indian mobile format
          : /^\d{7,15}$/ // International format

      if (!mobileRegex.test(formData.mobile)) {
        setValidation((prev) => ({
          ...prev,
          mobile: { isValid: false, message: "Invalid mobile format", isChecking: false },
        }))
        return
      }

      // Check uniqueness
      setValidation((prev) => ({
        ...prev,
        mobile: { ...prev.mobile, isChecking: true },
      }))

      try {
        const response = await fetch("/api/auth/check-mobile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: formData.mobile,
            countryCode: formData.countryCode,
          }),
        })
        const result = await response.json()

        setValidation((prev) => ({
          ...prev,
          mobile: {
            isValid: result.available,
            message: result.available ? "Mobile available" : "Mobile already registered",
            isChecking: false,
          },
        }))
      } catch (error) {
        setValidation((prev) => ({
          ...prev,
          mobile: { isValid: false, message: "Error checking mobile", isChecking: false },
        }))
      }
    }

    const debounceTimer = setTimeout(validateMobile, 500)
    return () => clearTimeout(debounceTimer)
  }, [formData.mobile, formData.countryCode])

  // Password validation
  useEffect(() => {
    if (!formData.password) {
      setValidation((prev) => ({
        ...prev,
        password: { isValid: false, message: "" },
      }))
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const isValid = passwordRegex.test(formData.password)

    setValidation((prev) => ({
      ...prev,
      password: {
        isValid,
        message: isValid
          ? "Strong password"
          : "Password must be 8+ chars with uppercase, lowercase, number & special character",
      },
    }))
  }, [formData.password])

  // Confirm password validation
  useEffect(() => {
    if (!formData.confirmPassword) {
      setValidation((prev) => ({
        ...prev,
        confirmPassword: { isValid: false, message: "" },
      }))
      return
    }

    const isValid = formData.password === formData.confirmPassword
    setValidation((prev) => ({
      ...prev,
      confirmPassword: {
        isValid,
        message: isValid ? "Passwords match" : "Passwords do not match",
      },
    }))
  }, [formData.password, formData.confirmPassword])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = () => {
    return (
      formData.fullName.trim().length >= 2 &&
      validation.email.isValid &&
      validation.mobile.isValid &&
      validation.password.isValid &&
      validation.confirmPassword.isValid
    )
  }

  const ValidationIcon = ({ field }: { field: keyof ValidationState }) => {
    const fieldValidation = validation[field]
    if ("isChecking" in fieldValidation && fieldValidation.isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
    }
    if (fieldValidation.message) {
      return fieldValidation.isValid ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <TrophyIcon className="mx-auto h-12 w-12 text-yellow-400" />
          <CardTitle className="text-2xl font-bold text-white">Create Your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join the elite circle of fantasy cricket enthusiasts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Role Selector */}
            <div>
              <Label htmlFor="role" className="text-gray-300">Your Role</Label>
              <Select
                name="role"
                required
                defaultValue="challenger" // Set default value
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenger">Challenger (I want to play)</SelectItem>
                  <SelectItem value="promoter">Promoter (I want to create contests)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email Address *
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <ValidationIcon field="email" />
                </div>
              </div>
              {validation.email.message && (
                <p className={`text-sm mt-1 ${validation.email.isValid ? "text-green-400" : "text-red-400"}`}>
                  {validation.email.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <Label htmlFor="mobile" className="text-gray-300">
                Mobile Number *
              </Label>
              <div className="flex mt-1 space-x-2">
                <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-600">
                        {country.flag} {country.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter mobile number"
                    className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <ValidationIcon field="mobile" />
                  </div>
                </div>
              </div>
              {validation.mobile.message && (
                <p className={`text-sm mt-1 ${validation.mobile.isValid ? "text-green-400" : "text-red-400"}`}>
                  {validation.mobile.message}
                </p>
              )}
              {/* Hidden field for form submission */}
              <input type="hidden" name="countryCode" value={formData.countryCode} />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  className="mt-1 pr-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <ValidationIcon field="password" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {validation.password.message && (
                <p className={`text-sm mt-1 ${validation.password.isValid ? "text-green-400" : "text-red-400"}`}>
                  {validation.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-1 pr-20 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  <ValidationIcon field="confirmPassword" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {validation.confirmPassword.message && (
                <p className={`text-sm mt-1 ${validation.confirmPassword.isValid ? "text-green-400" : "text-red-400"}`}>
                  {validation.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Referral Code */}
            <div>
              <Label htmlFor="referralCode" className="text-gray-300">
                Referral Code (Optional)
              </Label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={(e) => handleInputChange("referralCode", e.target.value.toUpperCase())}
                placeholder="Enter referral code if you have one"
                className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              {formData.referralCode && (
                <p className="text-sm text-purple-400 mt-1">Referral code applied: {formData.referralCode}</p>
              )}
            </div>

            {/* Error Messages */}
            {state?.errors && (
              <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
                <div className="text-sm text-red-300">
                  {Object.entries(state.errors).map(([field, messages]) => (
                    <div key={field}>
                      <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(", ") : messages}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {state?.message && (
              <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
                <p className="text-sm text-red-300">{state.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid() || isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Join PIPELINE"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/login")} // This line is already correct, just confirming.
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
