"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/lib/game-state"
import { Button } from "./ui/button"
import { Codex } from "./codex"
import { Book } from "lucide-react"
import { AudioControls } from "./audio-controls"
import { CreditsModal } from "./credits-modal"

interface MainMenuProps {
  onStartGame: () => void
  onSkillTree?: () => void
  maxScore?: number
  skillPoints?: number
}

export default function MainMenu({ onStartGame, onSkillTree, maxScore = 0, skillPoints = 0 }: MainMenuProps) {
  const { handleClassSelection, restartGame, showCodex, setShowCodex } = useGameState()
  const [highScore, setHighScore] = useState(maxScore)
  const [availableSkillPoints, setAvailableSkillPoints] = useState(skillPoints)
  const [showCredits, setShowCredits] = useState(false)

  // Load high score and skill points from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("highScore")
      if (savedHighScore) {
        setHighScore(Number.parseInt(savedHighScore))
      }

      const savedSkillPoints = localStorage.getItem("availableSkillPoints")
      if (savedSkillPoints) {
        setAvailableSkillPoints(Number.parseInt(savedSkillPoints))
      }
    }
  }, [])

  // Update state when props change
  useEffect(() => {
    if (maxScore > 0) {
      setHighScore(maxScore)
    }
    if (skillPoints > 0) {
      setAvailableSkillPoints(skillPoints)
    }
  }, [maxScore, skillPoints])

  const handlePlay = () => {
    // First restart the game state
    restartGame()
    // Then immediately transition to the game screen
    onStartGame()
  }

  const handleViewCodex = () => {
    setShowCodex(true)
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div className="w-full max-w-md text-center mx-auto">
        {/* ASCII Art Logo for VLKAVA - centered */}
        <div className="flex justify-center mb-2">
          <pre className="text-purple-400 font-mono text-xs sm:text-sm md:text-base leading-tight inline-block text-center">
            {`
██╗   ██╗██╗     ██╗  ██╗ █████╗ ██╗   ██╗ █████╗ 
██║   ██║██║     ██║ ██╔╝██╔══██╗██║   ██║██╔══██╗
██║   ██║██║     █████╔╝ ███████║██║   ██║███████║
╚██╗ ██╔╝██║     ██╔═██╗ ██╔══██║╚██╗ ██╔╝██╔══██║
 ╚████╔╝ ███████╗██║  ██╗██║  ██║ ╚████╔╝ ██║  ██║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝
`}
          </pre>
        </div>

        {/* ASCII Art Logo for DUNGEONS - centered */}
        <div className="flex justify-center mb-8">
          <pre className="text-purple-400 font-mono text-xs sm:text-sm md:text-base leading-tight inline-block text-center">
            {`
██████╗ ██╗   ██╗███╗   ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗███████╗
██╔══██╗██║   ██║████╗  ██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║██╔════╝
██║  ██║██║   ██║██╔██╗ ██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║███████╗
██║  ██║██║   ██║██║╚██╗██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║╚════██║
██████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████╗╚██████╔╝██║ ╚████║███████║
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
`}
          </pre>
        </div>

        <div className="mb-8 space-y-1">
          <p className="text-blue-300 font-mono">HIGH SCORE: {highScore}</p>
          {availableSkillPoints > 0 && (
            <p className="text-purple-300 font-mono">SKILL POINTS: {availableSkillPoints}</p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handlePlay}
            className="w-full py-4 text-lg bg-purple-700 hover:bg-purple-600 border-2 border-purple-500 font-mono"
          >
            PLAY
          </Button>

          {/* Always render the skill tree button, regardless of whether onSkillTree is provided */}
          <Button
            onClick={onSkillTree}
            className="w-full py-4 text-lg bg-white hover:bg-gray-200 text-purple-800 border-2 border-purple-300 font-mono"
            disabled={!onSkillTree}
          >
            SKILL TREE
          </Button>

          <Button
            onClick={() => setShowCredits(true)}
            className="w-full py-4 text-lg bg-white hover:bg-gray-200 text-purple-800 border-2 border-purple-300 font-mono"
          >
            CREDITS
          </Button>
        </div>
      </div>

      {/* Codex button in bottom left */}
      <div className="fixed bottom-4 left-4">
        <Button onClick={handleViewCodex} className="bg-purple-800 hover:bg-purple-700 border-2 border-purple-500">
          <Book className="mr-2 h-4 w-4" />
          CODEX
        </Button>
      </div>

      {showCodex && <Codex />}
      {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}

      {/* Audio Controls */}
      <div className="fixed bottom-4 right-4">
        <AudioControls />
      </div>
    </div>
  )
}

