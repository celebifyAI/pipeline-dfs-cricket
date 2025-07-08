import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-center">
        <CardHeader>
          <div className="mx-auto bg-green-900/50 rounded-full p-3 w-fit">
            <MailCheck className="h-10 w-10 text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold text-white">Confirm Your Email</CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            We've sent a confirmation link to your email address. Please click the link in the email to complete your
            signup and log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">If you don't see the email, please check your spam folder.</p>
        </CardContent>
      </Card>
    </div>
  )
}
