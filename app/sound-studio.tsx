"use client"

import { SoundGenerator } from "@/components/sound-generator"

export default function SoundStudio() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Vlkava Dungeons Sound Studio</h1>
      <p className="text-center mb-8">Create and download 8-bit sound effects for the game</p>
      <SoundGenerator />

      <div className="mt-8 p-4 bg-gray-800 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Audio Files Setup</h2>
        <p className="mb-4">
          To enable audio in the game, you need to create the following audio files in the <code>/public/audio/</code>{" "}
          directory:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
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

        <h3 className="text-lg font-bold mb-2">Troubleshooting Audio Issues</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Make sure all audio files are in MP3 format</li>
          <li>Audio files should be small (under 1MB each) for better performance</li>
          <li>
            If using a local development server, ensure it's configured to serve MP3 files with the correct MIME type
            (audio/mpeg)
          </li>
          <li>Some browsers require user interaction before playing audio - click anywhere on the page first</li>
          <li>If deploying to Vercel, make sure the audio files are in the public directory</li>
        </ul>

        <p>
          You can use the Sound Generator above to create these audio files, or use your own 8-bit style audio files.
        </p>
      </div>
    </div>
  )
}

