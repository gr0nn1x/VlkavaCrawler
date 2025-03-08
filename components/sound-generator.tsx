"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Download, Play, Square } from "lucide-react"

// Define oscillator types
type OscillatorType = "square" | "sawtooth" | "triangle" | "sine"

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

// Define sound presets
const PRESETS = {
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
}

export function SoundGenerator() {
  // State for sound parameters
  const [notes, setNotes] = useState<string[]>(["C4", "E4", "G4", "C5"])
  const [durations, setDurations] = useState<number[]>([0.1, 0.1, 0.1, 0.3])
  const [oscillatorType, setOscillatorType] = useState<OscillatorType>("square")
  const [volume, setVolume] = useState(0.5)
  const [attack, setAttack] = useState(0.01)
  const [decay, setDecay] = useState(0.1)
  const [sustain, setSustain] = useState(0.5)
  const [release, setRelease] = useState(0.2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState("levelUp")

  // Audio context ref
  const audioContextRef = useRef<AudioContext | null>(null)
  const isInitializedRef = useRef(false)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!isInitializedRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        isInitializedRef.current = true
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

  // Load preset
  const loadPreset = (presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS]
    if (preset) {
      setNotes(preset.notes)
      setDurations(preset.durations)
      setOscillatorType(preset.oscillatorType)
      setVolume(preset.volume)
      setAttack(preset.attack)
      setDecay(preset.decay)
      setSustain(preset.sustain)
      setRelease(preset.release)
      setSelectedPreset(presetName)
    }
  }

  // Play sound
  const playSound = async () => {
    if (!audioContextRef.current || isPlaying) return

    setIsPlaying(true)

    const ctx = audioContextRef.current
    let startTime = ctx.currentTime

    for (let i = 0; i < notes.length; i++) {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = oscillatorType
      oscillator.frequency.value = NOTES[notes[i]] || 440

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Set envelope
      const noteStart = startTime
      const noteEnd = noteStart + durations[i]

      // Attack
      gainNode.gain.setValueAtTime(0, noteStart)
      gainNode.gain.linearRampToValueAtTime(volume, noteStart + attack)

      // Decay and sustain
      gainNode.gain.linearRampToValueAtTime(volume * sustain, noteStart + attack + decay)

      // Release
      gainNode.gain.linearRampToValueAtTime(0, noteEnd + release)

      // Schedule oscillator
      oscillator.start(noteStart)
      oscillator.stop(noteEnd + release)

      startTime = noteEnd
    }

    // Calculate total duration
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0) + release

    // Reset playing state after sound completes
    setTimeout(() => {
      setIsPlaying(false)
    }, totalDuration * 1000)
  }

  // Download sound as WAV
  const downloadSound = async () => {
    if (!audioContextRef.current) return

    const offlineCtx = new OfflineAudioContext(
      1, // channels
      44100 * (durations.reduce((sum, duration) => sum + duration, 0) + release), // samples
      44100, // sample rate
    )

    let startTime = 0

    for (let i = 0; i < notes.length; i++) {
      const oscillator = offlineCtx.createOscillator()
      const gainNode = offlineCtx.createGain()

      oscillator.type = oscillatorType
      oscillator.frequency.value = NOTES[notes[i]] || 440

      // Connect nodes
      oscillator.connect(gainNode)
      gainNode.connect(offlineCtx.destination)

      // Set envelope
      const noteStart = startTime
      const noteEnd = noteStart + durations[i]

      // Attack
      gainNode.gain.setValueAtTime(0, noteStart)
      gainNode.gain.linearRampToValueAtTime(volume, noteStart + attack)

      // Decay and sustain
      gainNode.gain.linearRampToValueAtTime(volume * sustain, noteStart + attack + decay)

      // Release
      gainNode.gain.linearRampToValueAtTime(0, noteEnd + release)

      // Schedule oscillator
      oscillator.start(noteStart)
      oscillator.stop(noteEnd + release)

      startTime = noteEnd
    }

    // Render audio
    const renderedBuffer = await offlineCtx.startRendering()

    // Convert to WAV
    const wavBlob = bufferToWave(renderedBuffer, renderedBuffer.length)

    // Create download link
    const url = URL.createObjectURL(wavBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedPreset}.wav`
    a.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }

  // Convert AudioBuffer to WAV Blob
  function bufferToWave(abuffer: AudioBuffer, len: number) {
    const numOfChan = abuffer.numberOfChannels
    const length = len * numOfChan * 2 + 44
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)
    const channels = []
    let i, sample
    let offset = 0

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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>8-Bit Sound Generator</CardTitle>
        <CardDescription>Create retro game sounds for Vlkava Dungeons</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {Object.keys(PRESETS).map((preset) => (
                <Button
                  key={preset}
                  variant={selectedPreset === preset ? "default" : "outline"}
                  onClick={() => loadPreset(preset)}
                  className="w-full"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Oscillator Type</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {["square", "sawtooth", "triangle", "sine"].map((type) => (
                    <Button
                      key={type}
                      variant={oscillatorType === type ? "default" : "outline"}
                      onClick={() => setOscillatorType(type as OscillatorType)}
                      className="w-full"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Volume: {volume.toFixed(2)}</Label>
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setVolume(value[0])}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Attack: {attack.toFixed(2)}s</Label>
                  <Slider
                    value={[attack]}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    onValueChange={(value) => setAttack(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Decay: {decay.toFixed(2)}s</Label>
                  <Slider
                    value={[decay]}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    onValueChange={(value) => setDecay(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Sustain: {sustain.toFixed(2)}</Label>
                  <Slider
                    value={[sustain]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => setSustain(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Release: {release.toFixed(2)}s</Label>
                  <Slider
                    value={[release]}
                    min={0.01}
                    max={1}
                    step={0.01}
                    onValueChange={(value) => setRelease(value[0])}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Notes (comma separated)</Label>
                <input
                  type="text"
                  value={notes.join(", ")}
                  onChange={(e) => setNotes(e.target.value.split(",").map((n) => n.trim()))}
                  className="w-full p-2 mt-2 border rounded"
                />
              </div>

              <div>
                <Label>Durations (comma separated, in seconds)</Label>
                <input
                  type="text"
                  value={durations.join(", ")}
                  onChange={(e) => {
                    const values = e.target.value.split(",").map((n) => Number.parseFloat(n.trim()))
                    setDurations(values.filter((n) => !isNaN(n)))
                  }}
                  className="w-full p-2 mt-2 border rounded"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={playSound} disabled={isPlaying} className="flex items-center gap-2">
          {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Playing..." : "Play Sound"}
        </Button>

        <Button variant="outline" onClick={downloadSound} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download WAV
        </Button>
      </CardFooter>
    </Card>
  )
}

