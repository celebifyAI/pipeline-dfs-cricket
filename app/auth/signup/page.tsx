import SignupForm from "@/components/auth/signup-form"
import SignupLoader from "@/components/auth/signup-loader"
import { Suspense } from "react"

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoader />}>
      <SignupForm />
    </Suspense>
  )
}
