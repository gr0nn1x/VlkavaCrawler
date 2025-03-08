"use client"

import { useGameState } from "@/lib/game-state"
import { Button } from "@/components/ui/button"

interface GameOverProps {
  onReturnToMainMenu?: () => void
}

export function GameOver({ onReturnToMainMenu }: GameOverProps) {
  const { restartGame, player, gameState } = useGameState()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border-2 border-red-600">
        <h2 className="text-3xl font-bold mb-4 text-red-500 text-center">Game Over</h2>

        <div className="mb-6 text-center">
          <p className="text-lg mb-2">Your adventure has come to an end...</p>
          <p className="text-gray-400 mb-4">
            {player.name} the {player.class} reached dungeon level {gameState.dungeonLevel}
          </p>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-4">
            <div>Level: {player.level}</div>
            <div>Gold: {player.gold}</div>
            <div>Attack: {player.attack}</div>
            <div>Defense: {player.defense}</div>
            <div>Magic: {player.magic}</div>
            <div>Stealth: {player.dodge}</div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              restartGame()
              if (onReturnToMainMenu) onReturnToMainMenu()

              // Dispatch a custom event with the player's score
              if (typeof window !== "undefined") {
                const score = player.level * 100 + player.experience
                const gameOverEvent = new CustomEvent("gameOver", {
                  detail: { score },
                })
                window.dispatchEvent(gameOverEvent)
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            Start New Game
          </Button>
        </div>
      </div>
    </div>
  )
}

