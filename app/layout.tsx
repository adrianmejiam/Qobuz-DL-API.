import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Qobuz-DL API - A simple API for Qobuz",
  description:
    "A simple API for searching and downloading music from Qobuz, highly inspired by https://github.com/QobuzDL/Qobuz-DL",
  keywords: ["Qobuz-DL API", "music", "downloader", "hi-res", "qobuz", "flac", "api"],
  generator: "DAB",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}

import "./globals.css"



import './globals.css'