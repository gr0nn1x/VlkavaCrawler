"use client"

import { SoundGenerator } from "@/components/sound-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music } from "lucide-react"
import Link from "next/link"

export default function SoundStudio() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2 text-center">Vlkava Dungeons Sound Studio</h1>
      <p className="text-center mb-8">Create and download 8-bit sound effects for the game</p>

      <Tabs defaultValue="setup" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="generator">Sound Generator</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Audio Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Step 1: Create Audio Directory</h2>
                <p className="mb-2">
                  Create an <code>audio</code> folder inside your <code>public</code> directory:
                </p>
                <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">public/audio/</pre>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Step 2: Add Required Audio Files</h2>
                <p className="mb-2">Add the following MP3 files to your audio directory:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>
                    <code>background-music.mp3</code> - Main game exploration music
                  </li>
                  <li>
                    <code>battle-music.mp3</code> - Combat music
                  </li>
                  <li>
                    <code>levelUp.mp3</code> - Played when the player levels up
                  </li>
                  <li>
                    <code>attack.mp3</code> - Played when attacking an enemy
                  </li>
                  <li>
                    <code>spell.mp3</code> - Played when casting a spell
                  </li>
                  <li>
                    <code>flee.mp3</code> - Played when attempting to flee from combat
                  </li>
                  <li>
                    <code>openChest.mp3</code> - Played when opening a chest
                  </li>
                  <li>
                    <code>itemPickup.mp3</code> - Played when picking up an item
                  </li>
                  <li>
                    <code>itemEquip.mp3</code> - Played when equipping an item
                  </li>
                  <li>
                    <code>enemyDefeat.mp3</code> - Played when defeating an enemy
                  </li>
                  <li>
                    <code>buttonClick.mp3</code> - Played when clicking buttons
                  </li>
                  <li>
                    <code>damage.mp3</code> - Played when taking damage
                  </li>
                </ul>
                <p>You can use the Sound Generator tab to create these files.</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Step 3: Verify File Structure</h2>
                <p className="mb-2">Your file structure should look like this:</p>
                <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto">
                  public/audio/background-music.mp3{"\n"}
                  public/audio/battle-music.mp3{"\n"}
                  public/audio/levelUp.mp3{"\n"}
                  public/audio/attack.mp3{"\n"}
                  public/audio/spell.mp3{"\n"}
                  public/audio/flee.mp3{"\n"}
                  public/audio/openChest.mp3{"\n"}
                  public/audio/itemPickup.mp3{"\n"}
                  public/audio/itemEquip.mp3{"\n"}
                  public/audio/enemyDefeat.mp3{"\n"}
                  public/audio/buttonClick.mp3{"\n"}
                  public/audio/damage.mp3
                </pre>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Step 4: Restart Your Application</h2>
                <p>After adding the audio files, restart your application to enable audio.</p>
                <div className="flex justify-center mt-4">
                  <Link href="/">
                    <Button>Return to Game</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator">
          <SoundGenerator />
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Audio Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Common Issues</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Audio files not found:</strong> Make sure all audio files are in the correct location (
                    <code>public/audio/</code>) and have the exact filenames listed in the setup guide.
                  </li>
                  <li>
                    <strong>MIME type errors:</strong> Ensure your audio files are valid MP3 files. Some browsers are
                    strict about audio formats.
                  </li>
                  <li>
                    <strong>Audio not playing on first click:</strong> Most browsers require a user interaction before
                    playing audio. Click anywhere on the page first.
                  </li>
                  <li>
                    <strong>Audio not working in production:</strong> When deploying to Vercel or other platforms, make
                    sure the audio files are included in your deployment.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Testing Your Audio Setup</h3>
                <p className="mb-2">
                  You can test if your audio files are accessible by trying to open them directly in your browser:
                </p>
                <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto mb-4">
                  http://localhost:3000/audio/buttonClick.mp3
                </pre>
                <p>If the audio file plays in your browser, it should work in the game.</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Alternative Audio Sources</h3>
                <p className="mb-2">
                  If you don't want to create your own audio files, you can find free 8-bit sound effects at:
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <a
                      href="https://freesound.org/browse/tags/8-bit/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Freesound.org (8-bit tag)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://opengameart.org/art-search-advanced?keys=8-bit&field_art_type_tid%5B%5D=13"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      OpenGameArt.org (8-bit sounds)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Still Having Issues?</h3>
                <p>If you're still experiencing audio problems:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Check your browser console for specific error messages</li>
                  <li>Try a different browser to rule out browser-specific issues</li>
                  <li>Make sure your browser's audio is not muted</li>
                  <li>Try generating new audio files using the Sound Generator</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

