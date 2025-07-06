import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: "PIPELINE",
  description: "The next generation fantasy sports platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <body className="bg-[#0A0A0A] text-gray-100">{children}</body>
    </html>
  )
}
