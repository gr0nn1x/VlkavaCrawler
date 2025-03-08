import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GameStateProvider } from "@/lib/game-state"
import { AudioProvider } from "@/components/audio-system"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vlkava Dungeons",
  description: "A colorful ASCII-style RPG game",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AudioProvider>
          <GameStateProvider>{children}</GameStateProvider>
        </AudioProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"



import './globals.css'