"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, Check, Music, Play, Square } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

// Define oscillator types
type OscillatorType = "square" | "sawtooth" | "triangle" | "sine"

// Define sound presets
const SOUND_PRESETS = {
  levelUp: {
    notes: ["C4", "E4", "G4", "C5"],
    durations: [0.1, 0.1, 0.1, 0.3],
    oscillatorType: "square" as OscillatorType,
    volume: 0.5,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.2,
  },
  attack: {
    notes: ["C4", "G3"],
    durations: [0.05, 0.1],
    oscillatorType: "square" as OscillatorType,
    volume: 0.4,
    attack: 0.01,
    decay: 0.05,
    sustain: 0.2,
    release: 0.1,
  },
  spell: {
    notes: ["E4", "G4", "B4", "E5"],
    durations: [0.05, 0.05, 0.05, 0.2],
    oscillatorType: "sine" as OscillatorType,
    volume: 0.4,
    attack: 0.02,
    decay: 0.1,
    sustain: 0.3,
    release: 0.3,
  },
  openChest: {
    notes: ["C4", "E4", "G4", "C5"],
    durations: [0.05, 0.05, 0.05, 0.2],
    oscillatorType: "square" as OscillatorType,
    volume: 0.4,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.2,
  },
  itemPickup: {
    notes: ["E5", "G5"],
    durations: [0.05, 0.1],
    oscillatorType: "square" as OscillatorType,
    volume: 0.3,
    attack: 0.01,
    decay: 0.05,
    sustain: 0.2,
    release: 0.1,
  },
  enemyDefeat: {
    notes: ["G4", "C5", "E5", "G5"],
    durations: [0.1, 0.1, 0.1, 0.3],
    oscillatorType: "square" as OscillatorType,
    volume: 0.5,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.3,
  },
  damage: {
    notes: ["A3", "E3"],
    durations: [0.05, 0.1],
    oscillatorType: "sawtooth" as OscillatorType,
    volume: 0.4,
    attack: 0.01,
    decay: 0.05,
    sustain: 0.1,
    release: 0.1,
  },
  buttonClick: {
    notes: ["C5"],
    durations: [0.05],
    oscillatorType: "square" as OscillatorType,
    volume: 0.2,
    attack: 0.01,
    decay: 0.01,
    sustain: 0.1,
    release: 0.05,
  },
  flee: {
    notes: ["E5", "C5", "G4", "C4"],
    durations: [0.05, 0.05, 0.05, 0.2],
    oscillatorType: "square" as OscillatorType,
    volume: 0.4,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2,
  },
  itemEquip: {
    notes: ["C4", "G4", "C5"],
    durations: [0.05, 0.05, 0.15],
    oscillatorType: "square" as OscillatorType,
    volume: 0.3,
    attack: 0.01,
    decay: 0.05,
    sustain: 0.2,
    release: 0.1,
  },
  // Background music is a simple looping pattern
  "background-music": {
    notes: ["C4", "E4", "G4", "E4", "C4", "E4", "G4", "E4", "A3", "C4", "E4", "C4", "F3", "A3", "C4", "A3"],
    durations: Array(16).fill(0.25),
    oscillatorType: "square" as OscillatorType,
    volume: 0.3,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1,
  },
  // Battle music is more intense
  "battle-music": {
    notes: ["C4", "C4", "G3", "G3", "A3", "A3", "E3", "E3", "F3", "F3", "C3", "C3", "F3", "G3", "C4", "C4"],
    durations: Array(16).fill(0.15),
    oscillatorType: "sawtooth" as OscillatorType,
    volume: 0.4,
    attack: 0.01,
    decay: 0.05,
    sustain: 0.3,
    release: 0.05,
  },
}

// Define note frequencies
const NOTES: Record<string, number> = {
  C3: 130.81,
  "C#3": 138.59,
  D3: 146.83,
  "D#3": 155.56,
  E3: 164.81,
  F3: 174.61,
  "F#3": 185.0,
  G3: 196.0,
  "G#3": 207.65,
  A3: 220.0,
  "A#3": 233.08,
  B3: 246.94,
  C4: 261.63,
  "C#4": 277.18,
  D4: 293.66,
  "D#4": 311.13,
  E4: 329.63,
  F4: 349.23,
  "F#4": 369.99,
  G4: 392.0,
  "G#4": 415.3,
  A4: 440.0,
  "A#4": 466.16,
  B4: 493.88,
  C5: 523.25,
  "C#5": 554.37,
  D5: 587.33,
  "D#5": 622.25,
  E5: 659.25,
  F5: 698.46,
  "F#5": 739.99,
  G5: 783.99,
  "G#5": 830.61,
  A5: 880.0,
  "A#5": 932.33,
  B5: 987.77,
}

interface SoundPreset {
  notes: string[]
  durations: number[]
  oscillatorType: OscillatorType
  volume: number
  attack: number
  decay: number
  sustain: number
  release: number
}

export default function GenerateAudioFiles() {
  const [progress, setProgress] = useState(0)
  const [currentSound, setCurrentSound] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSounds, setCompletedSounds] = useState<string[]>([])
  const [audioBlobs, setAudioBlobs] = useState<Record<string, Blob>>({})
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    const handleInteraction = () => {
      initAudio()
      document.removeEventListener("click", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
    }
  }, [])

  // Generate a single sound and return it as a blob
  const generateSound = async (name: string, preset: SoundPreset): Promise<Blob> => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const offlineCtx = new OfflineAudioContext(
      1, // channels
      44100 * (preset.durations.reduce((sum, duration) => sum + duration, 0) + preset.release), // samples
      44100, // sample rate
    )

    let startTime = 0

    for (let i = 0; i < preset.notes.length; i++) {
      const oscillator = offlineCtx.createOscillator()
      const gainNode = offlineCtx.createGain()

      oscillator.type = preset.oscillatorType
      oscillator.frequency.value = NOTES[preset.notes[i]] || 440

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(offlineCtx.destination)

      // Set envelope
      const noteStart = startTime
      const noteEnd = noteStart + preset.durations[i]

      // Attack
      gainNode.gain.setValueAtTime(0, noteStart)
      gainNode.gain.linearRampToValueAtTime(preset.volume, noteStart + preset.attack)

      // Decay and sustain
      gainNode.gain.linearRampToValueAtTime(preset.volume * preset.sustain, noteStart + preset.attack + preset.decay)

      // Release
      gainNode.gain.linearRampToValueAtTime(0, noteEnd + preset.release)

      // Schedule oscillator
      oscillator.start(noteStart)
      oscillator.stop(noteEnd + preset.release)

      startTime = noteEnd
    }

    // Render audio
    const renderedBuffer = await offlineCtx.startRendering()

    // Convert to WAV
    const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length)
    return wavBlob
  }

  // Convert AudioBuffer to WAV Blob
  function bufferToWave(abuffer: AudioBuffer, len: number) {
    const numOfChan = abuffer.numberOfChannels
    const length = len * numOfChan * 2 + 44
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)
    let offset = 0
    const channels = []
    let i, sample

    // Write WAVE header
    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8) // file length - 8
    setUint32(0x45564157) // "WAVE"

    setUint32(0x20746d66) // "fmt " chunk
    setUint32(16) // length = 16
    setUint16(1) // PCM (uncompressed)
    setUint16(numOfChan)
    setUint32(abuffer.sampleRate)
    setUint32(abuffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
    setUint16(numOfChan * 2) // block-align
    setUint16(16) // 16-bit

    setUint32(0x61746164) // "data" chunk
    setUint32(length - offset - 4) // chunk length

    // Write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i))
    }

    while (offset < length) {
      for (i = 0; i < numOfChan; i++) {
        // Clamp the value to the 16-bit range
        sample = Math.max(-1, Math.min(1, channels[i][offset / (numOfChan * 2)]))
        // Convert to 16-bit signed integer
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(offset, sample, true)
        offset += 2
      }
    }

    function setUint16(data: number) {
      view.setUint16(offset, data, true)
      offset += 2
    }

    function setUint32(data: number) {
      view.setUint32(offset, data, true)
      offset += 4
    }

    return new Blob([buffer], { type: "audio/wav" })
  }

  // Play a sound for preview
  const playSound = async (name: string) => {
    if (isPlaying) return
    setIsPlaying(true)

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const preset = SOUND_PRESETS[name as keyof typeof SOUND_PRESETS]
    if (!preset) return

    const ctx = audioContextRef.current
    let startTime = ctx.currentTime

    for (let i = 0; i < preset.notes.length; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = preset.oscillatorType
      oscillator.frequency.value = NOTES[preset.notes[i]] || 440

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Set envelope
      const noteStart = startTime
      const noteEnd = noteStart + preset.durations[i]

      // Attack
      gainNode.gain.setValueAtTime(0, noteStart)
      gainNode.gain.linearRampToValueAtTime(preset.volume, noteStart + preset.attack)

      // Decay and sustain
      gainNode.gain.linearRampToValueAtTime(preset.volume * preset.sustain, noteStart + preset.attack + preset.decay)

      // Release
      gainNode.gain.linearRampToValueAtTime(0, noteEnd + preset.release)

      // Schedule oscillator
      oscillator.start(noteStart)
      oscillator.stop(noteEnd + preset.release)

      startTime = noteEnd
    }

    // Calculate total duration
    const totalDuration = preset.durations.reduce((sum, duration) => sum + duration, 0) + preset.release

    // Reset playing state after sound completes
    setTimeout(() => {
      setIsPlaying(false)
    }, totalDuration * 1000)
  }

  // Generate all sounds
  const generateAllSounds = async () => {
    setIsGenerating(true)
    setProgress(0)
    setCompletedSounds([])
    const blobs: Record<string, Blob> = {}

    const soundNames = Object.keys(SOUND_PRESETS)
    const totalSounds = soundNames.length

    for (let i = 0; i < totalSounds; i++) {
      const soundName = soundNames[i]
      setCurrentSound(soundName)
      setProgress(((i + 0.5) / totalSounds) * 100)

      try {
        const preset = SOUND_PRESETS[soundName as keyof typeof SOUND_PRESETS]
        const blob = await generateSound(soundName, preset)
        blobs[soundName] = blob
        setCompletedSounds((prev) => [...prev, soundName])
      } catch (error) {
        console.error(`Error generating ${soundName}:`, error)
      }

      setProgress(((i + 1) / totalSounds) * 100)
    }

    setAudioBlobs(blobs)
    setIsGenerating(false)
    setCurrentSound("")
  }

  // Download all sounds as a zip file
  const downloadAllSounds = async () => {
    const zip = new JSZip()

    // Add each sound to the zip
    Object.entries(audioBlobs).forEach(([name, blob]) => {
      zip.file(`${name}.mp3`, blob)
    })

    // Add README file
    zip.file(
      "README.md",
      `# Audio Files for Vlkava Dungeons

This directory contains 8-bit style audio files for the game.

## How to Use
1. Extract all files to your project's \`public/audio/\` directory
2. Restart your application to enable audio

## Files Included
- background-music.mp3: Main game exploration music
- battle-music.mp3: Combat music
- levelUp.mp3: Played when the player levels up
- attack.mp3: Played when attacking an enemy
- spell.mp3: Played when casting a spell
- flee.mp3: Played when attempting to flee from combat
- openChest.mp3: Played when opening a chest
- itemPickup.mp3: Played when picking up an item
- itemEquip.mp3: Played when equipping an item
- enemyDefeat.mp3: Played when defeating an enemy
- buttonClick.mp3: Played when clicking buttons
- damage.mp3: Played when taking damage

Generated with the Vlkava Dungeons Sound Generator.
`,
    )

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "vlkava-dungeons-audio.zip")
  }

  // Download a single sound
  const downloadSound = (name: string) => {
    if (audioBlobs[name]) {
      saveAs(audioBlobs[name], `${name}.mp3`)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2 text-center">Vlkava Dungeons Audio Generator</h1>
      <p className="text-center mb-8">Generate all required audio files for the game</p>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Audio File Generator
          </CardTitle>
          <CardDescription>
            This tool will generate all the required audio files for Vlkava Dungeons. Click the button below to start.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isGenerating && progress === 0 && (
            <Button onClick={generateAllSounds} className="w-full">
              Generate All Audio Files
            </Button>
          )}

          {(isGenerating || progress > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isGenerating ? `Generating ${currentSound}...` : "Generation complete!"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {completedSounds.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Generated Audio Files</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(SOUND_PRESETS).map((name) => (
                  <div
                    key={name}
                    className={`p-2 rounded-md border flex justify-between items-center ${
                      completedSounds.includes(name) ? "border-green-500 bg-green-950" : "border-gray-700 bg-gray-800"
                    }`}
                  >
                    <span className="text-sm">{name}.mp3</span>
                    <div className="flex gap-1">
                      {completedSounds.includes(name) && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => playSound(name)}
                            disabled={isPlaying}
                          >
                            {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => downloadSound(name)}>
                            <Download className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      {completedSounds.includes(name) && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {completedSounds.length > 0 && (
          <CardFooter>
            <Button onClick={downloadAllSounds} className="w-full flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All as ZIP
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="mt-8 max-w-3xl mx-auto bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Installation Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Click the "Generate All Audio Files" button above</li>
          <li>Wait for all files to be generated (this may take a moment)</li>
          <li>Click "Download All as ZIP" to download all audio files</li>
          <li>
            Extract the ZIP file contents to your project's <code>public/audio/</code> directory
          </li>
          <li>Restart your application to enable audio</li>
        </ol>
        <p className="mt-4 text-sm text-gray-300">
          Note: You can also download individual files by clicking the download icon next to each file.
        </p>
      </div>
    </div>
  )
}

