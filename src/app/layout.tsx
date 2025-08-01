import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Happy Girlfriend's Day Link Generator",
  description: "Create personalized greeting links for Girlfriend's Day",
  keywords: "girlfriend day, personalized greeting, romantic, love",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId='G-SBCYMJB7H3' />
    </html>
  )
}
