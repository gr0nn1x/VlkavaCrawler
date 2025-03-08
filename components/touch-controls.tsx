"use client"

import { useCallback, useState } from "react"
import { useGameState } from "@/lib/game-state"
import { cn } from "@/lib/utils"

export function TouchControls() {
  const { movePlayer, inCombat, gameOver, chestContents, showShop } = useGameState()
  const [activeButton, setActiveButton] = useState<string | null>(null)

  // Check if movement is disabled
  const isDisabled = inCombat || gameOver || chestContents.isOpen || showShop

  // Handle direction button clicks with visual feedback
  const handleMove = useCallback(
    (direction: string, dx: number, dy: number) => {
      if (isDisabled) return

      // Visual feedback
      setActiveButton(direction)
      setTimeout(() => setActiveButton(null), 150)

      movePlayer(dx, dy)
    },
    [movePlayer, isDisabled],
  )

  const buttonClass =
    "w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg transition-all duration-150 transform"
  const defaultButton = "bg-gray-700 hover:bg-gray-600 text-blue-300"
  const activeButtonClass = "bg-gray-500 text-blue-200 scale-95"
  const disabledButton = "opacity-50 cursor-not-allowed"

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 min-w-[150px]">
      <h3 className="text-sm font-bold mb-4 text-center">Movement</h3>
      <div className="grid grid-cols-3 gap-1 mx-auto -ml-0 min-w-[100px]">
        {/* Top row */}
        <div />
        <button
          className={cn(
            buttonClass,
            activeButton === "up" ? activeButtonClass : defaultButton,
            isDisabled && disabledButton,
          )}
          onClick={() => handleMove("up", 0, -1)}
          disabled={isDisabled}
          aria-label="Move up"
        >
          ▲
        </button>
        <div />

        {/* Middle row */}
        <button
          className={cn(
            buttonClass,
            activeButton === "left" ? activeButtonClass : defaultButton,
            isDisabled && disabledButton,
          )}
          onClick={() => handleMove("left", -1, 0)}
          disabled={isDisabled}
          aria-label="Move left"
        >
          ◄
        </button>

        <div
          className={cn(
            "w-0 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl font-bold",
            isDisabled ? "opacity-50" : "opacity-100",
          )}
        ></div>

        <button
          className={cn(
            buttonClass,
            activeButton === "right" ? activeButtonClass : defaultButton,
            isDisabled && disabledButton,
          )}
          onClick={() => handleMove("right", 1, 0)}
          disabled={isDisabled}
          aria-label="Move right"
        >
          ►
        </button>

        {/* Bottom row */}
        <div />
        <button
          className={cn(
            buttonClass,
            activeButton === "down" ? activeButtonClass : defaultButton,
            isDisabled && disabledButton,
          )}
          onClick={() => handleMove("down", 0, 1)}
          disabled={isDisabled}
          aria-label="Move down"
        >
          ▼
        </button>
        <div />
      </div>
    </div>
  )
}

