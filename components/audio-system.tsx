"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"

// Define the audio context type
interface AudioContextType {
  playSound: (soundType: SoundType) => void
  toggleMusic: () => void
  isMusicPlaying: boolean
  setVolume: (volume: number) => void
  volume: number
  startBattleMusic: () => void
  startBackgroundMusic: () => void
  audioAvailable: boolean
}

// Define sound types
export type SoundType =
  | "levelUp"
  | "attack"
  | "spell"
  | "flee"
  | "openChest"
  | "itemPickup"
  | "itemEquip"
  | "enemyDefeat"
  | "buttonClick"
  | "damage"

// Create context
const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isInitialized, setIsInitialized] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(false) // Start with audio unavailable

  // Track which audio files are available
  const availableAudioFiles = useRef<Set<string>>(new Set())

  // Audio elements refs - don't create them until needed
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const battleMusicRef = useRef<HTMLAudioElement | null>(null)
  const soundEffectsRef = useRef<Record<string, HTMLAudioElement>>({})

  // Initialize audio system
  useEffect(() => {
    if (isInitialized) return

    // Check if a single audio file exists to determine if audio is available
    const checkAudioFile = async (filename: string): Promise<boolean> => {
      try {
        const response = await fetch(`/audio/${filename}`, { method: "HEAD" })
        return response.ok
      } catch (error) {
        console.warn(`Audio file ${filename} check failed:`, error)
        return false
      }
    }

    // Check for the existence of buttonClick.mp3 as a test
    const init = async () => {
      try {
        const hasButtonClick = await checkAudioFile("buttonClick.mp3")

        if (hasButtonClick) {
          console.log("Audio files appear to be available")
          setAudioAvailable(true)
          availableAudioFiles.current.add("buttonClick")
        } else {
          console.warn("Audio files are not available - running in silent mode")
          setAudioAvailable(false)
        }
      } catch (error) {
        console.warn("Error checking audio availability:", error)
        setAudioAvailable(false)
      }

      setIsInitialized(true)
    }

    init()

    // Cleanup function
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
        backgroundMusicRef.current = null
      }

      if (battleMusicRef.current) {
        battleMusicRef.current.pause()
        battleMusicRef.current = null
      }

      Object.values(soundEffectsRef.current).forEach((audio) => {
        audio.pause()
      })
      soundEffectsRef.current = {}
    }
  }, [])

  // Play sound effect with robust error handling
  const playSound = (soundType: SoundType) => {
    if (!isInitialized) return

    // If we already know this sound isn't available, don't try to play it
    if (!audioAvailable || !availableAudioFiles.current.has(soundType)) {
      // Check if we should try to load this sound
      if (audioAvailable) {
        // Try to load the sound file
        const audio = new Audio(`/audio/${soundType}.mp3`)

        audio.addEventListener("canplaythrough", () => {
          // Sound is available, add it to our available sounds
          availableAudioFiles.current.add(soundType)
          soundEffectsRef.current[soundType] = audio

          // Play the sound
          audio.volume = volume
          audio.play().catch((err) => {
            console.warn(`Error playing ${soundType}:`, err)
          })
        })

        audio.addEventListener("error", () => {
          console.warn(`Error loading sound ${soundType}: The media resource was not suitable.`)
        })
      }
      return
    }

    try {
      // Use existing audio element if available
      let audio = soundEffectsRef.current[soundType]

      if (!audio) {
        // Create new audio element
        audio = new Audio(`/audio/${soundType}.mp3`)
        audio.volume = volume
        soundEffectsRef.current[soundType] = audio
      }

      // Reset to beginning if already playing
      audio.currentTime = 0

      // Play with error handling
      audio.play().catch((err) => {
        console.warn(`Error playing ${soundType}:`, err)

        // If there's an error playing, remove from available sounds
        availableAudioFiles.current.delete(soundType)
      })
    } catch (error) {
      console.warn(`Error playing sound ${soundType}:`, error)
    }
  }

  // Toggle music with robust error handling
  const toggleMusic = () => {
    if (!isInitialized) return

    if (isMusicPlaying) {
      // Turn music OFF
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
      if (battleMusicRef.current) {
        battleMusicRef.current.pause()
      }
      setIsMusicPlaying(false)
    } else {
      // Turn music ON - check if we have background music
      if (!backgroundMusicRef.current && audioAvailable) {
        // Try to create and load background music
        const audio = new Audio("/audio/background-music.mp3")

        audio.addEventListener("canplaythrough", () => {
          // Music is available
          backgroundMusicRef.current = audio
          audio.loop = true
          audio.volume = volume

          // Play the music
          audio
            .play()
            .then(() => {
              setIsMusicPlaying(true)
            })
            .catch((err) => {
              console.warn("Error playing music:", err)
            })
        })

        audio.addEventListener("error", () => {
          console.warn("Error loading background music: The media resource was not suitable.")
        })
      } else if (backgroundMusicRef.current) {
        // We already have a background music element, try to play it
        backgroundMusicRef.current
          .play()
          .then(() => {
            setIsMusicPlaying(true)
          })
          .catch((err) => {
            console.warn("Error playing music:", err)
          })
      }
    }
  }

  // Start background music with robust error handling
  const startBackgroundMusic = () => {
    if (!isInitialized || !isMusicPlaying) return

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

  // Start battle music with robust error handling
  const startBattleMusic = () => {
    if (!isInitialized || !isMusicPlaying) return

    // Stop background music if playing
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
    }

    // Check if we have battle music
    if (!battleMusicRef.current && audioAvailable) {
      // Try to create and load battle music
      const audio = new Audio("/audio/battle-music.mp3")

      audio.addEventListener("canplaythrough", () => {
        // Music is available
        battleMusicRef.current = audio
        audio.loop = true
        audio.volume = volume

        // Play the music
        audio.play().catch((err) => {
          console.warn("Error playing battle music:", err)
        })
      })

      audio.addEventListener("error", () => {
        console.warn("Error loading battle music: The media resource was not suitable.")
      })
    } else if (battleMusicRef.current) {
      // We already have a battle music element, try to play it
      battleMusicRef.current.play().catch((err) => {
        console.warn("Error playing battle music:", err)
      })
    }
  }

  // Update volume when it changes
  useEffect(() => {
    if (!isInitialized) return

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume
    }

    if (battleMusicRef.current) {
      battleMusicRef.current.volume = volume
    }

    Object.values(soundEffectsRef.current).forEach((audio) => {
      audio.volume = volume
    })
  }, [volume, isInitialized])

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

// Custom hook to use audio
export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

