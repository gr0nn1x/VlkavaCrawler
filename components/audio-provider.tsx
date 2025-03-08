"use client"

import type React from "react"
import { createContext, useState, useEffect, useRef } from "react"

// Define the audio context type
interface AudioContextType {
  playSound: (soundType: string) => void
  toggleMusic: () => void
  isMusicPlaying: boolean
  setVolume: (volume: number) => void
  volume: number
  startBattleMusic: () => void
  startBackgroundMusic: () => void
  audioAvailable: boolean
}

// Create context
const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioAvailable, setAudioAvailable] = useState(false)

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const battleMusicRef = useRef<HTMLAudioElement | null>(null)

  const playSound = (soundType: string) => {
    console.log(`Playing sound: ${soundType}`)
  }

  const toggleMusic = () => {
    setIsMusicPlaying((prev) => !prev)
  }

  // Update the startBackgroundMusic function
  const startBackgroundMusic = () => {
    if (!isMusicPlaying) return

    console.log("Starting background music")

    // Stop battle music if playing
    if (battleMusicRef.current) {
      battleMusicRef.current.pause()
    }

    // Try to play background music if available
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play().catch((err) => {
        console.warn("Error playing background music:", err)
      })
    }
  }

  // Update the startBattleMusic function
  const startBattleMusic = () => {
    if (!isMusicPlaying) return

    console.log("Starting battle music")

    // Stop background music if playing
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
    }

    // Try to play battle music if available
    if (battleMusicRef.current) {
      battleMusicRef.current.play().catch((err) => {
        console.warn("Error playing battle music:", err)
      })
    }
  }

  useEffect(() => {
    setAudioAvailable(true)
  }, [])

  return (
    <AudioContext.Provider
      value={{
        playSound,
        toggleMusic,
        isMusicPlaying,
        setVolume,
        volume,
        startBattleMusic,
        startBackgroundMusic,
        audioAvailable,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

