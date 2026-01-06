import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata:  Metadata = {
  title:  "FocusFlow - AI Learning Companion",
  description: "AI-powered focus tracking for better learning",
}

export default function RootLayout({
  children,
}: {
  children: React. ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`font-sans antialiased ${inter.className}`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}