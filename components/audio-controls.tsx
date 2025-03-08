"use client"

import { useState } from "react"
import { useAudio } from "./audio-system"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume, VolumeX, Volume1, Volume2, HelpCircle, Download } from "lucide-react"
import Link from "next/link"

export function AudioControls() {
  const { toggleMusic, isMusicPlaying, setVolume, volume, playSound, audioAvailable } = useAudio()
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showHelpTooltip, setShowHelpTooltip] = useState(false)

  // If audio is not available, show a help button
  if (!audioAvailable) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <div
          className={`bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm max-w-xs transition-opacity ${showHelpTooltip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <p className="mb-2">Audio files are missing. To enable audio:</p>
          <ol className="list-decimal pl-4 mb-2 space-y-1">
            <li>
              Create an <code>/audio</code> folder in your <code>public</code> directory
            </li>
            <li>Add MP3 files for game sounds</li>
            <li>Visit the Audio Generator to create the files</li>
          </ol>
          <div className="flex flex-col gap-2 mt-3">
            <Link href="/generate-audio-files" className="text-center">
              <Button size="sm" className="w-full flex items-center gap-1">
                <Download className="h-3 w-3" />
                Generate Audio Files
              </Button>
            </Link>
            <Link
              href="/sound-studio"
              target="_blank"
              className="text-blue-400 hover:underline block text-center text-xs"
            >
              Sound Studio Guide
            </Link>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHelpTooltip(!showHelpTooltip)}
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 relative"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    )
  }

  const handleToggleMusic = () => {
    // Try to play a sound first
    playSound("buttonClick")

    // Toggle music after a small delay
    setTimeout(() => {
      toggleMusic()
    }, 100)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.4) return <Volume className="h-4 w-4" />
    if (volume < 0.7) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {!audioAvailable ? (
        <div
          className={`bg-gray-800 p-3 rounded-lg border border-gray-700 text-sm max-w-xs transition-opacity ${showHelpTooltip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <p className="mb-2">Audio files are missing. To enable audio:</p>
          <ol className="list-decimal pl-4 mb-2 space-y-1">
            <li>
              Create an <code>/audio</code> folder in your <code>public</code> directory
            </li>
            <li>Add MP3 files for game sounds</li>
            <li>Visit the Audio Generator to create the files</li>
          </ol>
          <div className="flex flex-col gap-2 mt-3">
            <Link href="/generate-audio-files" className="text-center">
              <Button size="sm" className="w-full flex items-center gap-1">
                <Download className="h-3 w-3" />
                Generate Audio Files
              </Button>
            </Link>
            <Link
              href="/sound-studio"
              target="_blank"
              className="text-blue-400 hover:underline block text-center text-xs"
            >
              Sound Studio Guide
            </Link>
          </div>
        </div>
      ) : (
        showVolumeSlider && (
          <div className="bg-gray-800 p-2 rounded-lg flex items-center gap-2 border border-gray-700">
            <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
          </div>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setShowVolumeSlider(!showVolumeSlider)
          playSound("buttonClick")
        }}
        className="bg-gray-800 border-purple-700 hover:bg-gray-700"
      >
        {getVolumeIcon()}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleMusic}
        className="bg-gray-800 border-purple-700 hover:bg-gray-700"
      >
        {isMusicPlaying ? <span className="text-xs">♪ ON</span> : <span className="text-xs">♪ OFF</span>}
      </Button>
    </div>
  )
}

