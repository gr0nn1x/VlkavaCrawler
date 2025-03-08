"use client"

import { useEffect } from "react"
import { useAudio } from "./audio-system"

export function AudioPlayer() {
  const { toggleMusic, isMusicPlaying } = useAudio()

  // Initialize audio on component mount
  useEffect(() => {
    // We don't need to do anything here anymore
    // The AudioProvider handles initialization
  }, [])

  return null // This component doesn't render anything visible
}

