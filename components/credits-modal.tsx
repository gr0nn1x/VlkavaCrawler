"use client"

import { Button } from "./ui/button"

interface CreditsModalProps {
  onClose: () => void
}

export function CreditsModal({ onClose }: CreditsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#0a0b14] border-2 border-purple-500/30 rounded-lg w-[400px] p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-300">Credits</h2>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-1">AI DEMON</h3>
            <p className="text-gray-300">ASCII Art & Pixel Graphics</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-1">PROGRAMMING</h3>
            <p className="text-gray-300">Smurftisek</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-1">SOUND EFFECTS</h3>
            <p className="text-gray-300">Various CC0 Sources</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-1">SPECIAL THANKS</h3>
            <p className="text-gray-300">All the roguelike games that inspired this project</p>
          </div>
        </div>

        <Button onClick={onClose} className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3">
          Back to Menu
        </Button>
      </div>
    </div>
  )
}

