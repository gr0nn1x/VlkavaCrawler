"use client"

import { useCallback, useMemo, useState, useEffect } from "react"
import { useGameState } from "@/lib/game-state"

interface Theme {
  wall: string
  floor: string
}

interface Player {
  x: number
  y: number
  class: string
}

interface Enemy {
  x: number
  y: number
  health: number
  isBoss?: boolean
  race?: string
}

interface GetTileDisplayProps {
  player: Player
  enemies: Enemy[]
  theme: Theme
}

const useGetTileDisplay = ({ player, enemies, theme }: GetTileDisplayProps) => {
  const getTileDisplay = useCallback(
    (type: string, x: number, y: number) => {
      // Check if player is at this position
      if (player.x === x && player.y === y) {
        // Return class-specific emoji
        return {
          char: getPlayerEmoji(player.class),
          color: "text-yellow-400",
        }
      }

      // Check if there's an enemy at this position
      const enemyAtPosition = enemies.find((e) => e.x === x && e.y === y && e.health > 0)
      if (enemyAtPosition) {
        if (enemyAtPosition.isBoss) {
          return {
            char: "Ω",
            color: "text-red-600",
          }
        }

        // Different enemy types
        if (enemyAtPosition.race === "dragon") return { char: "D", color: "text-red-500" }
        if (enemyAtPosition.race === "skeleton") return { char: "S", color: "text-gray-400" }
        if (enemyAtPosition.race === "undead") return { char: "U", color: "text-purple-400" }
        if (enemyAtPosition.race === "mimic") return { char: "M", color: "text-yellow-500" }

        return {
          char: "E",
          color: "text-red-500",
        }
      }

      // Otherwise, return tile
      switch (type) {
        case "wall":
          return { char: "#", color: theme.wall }
        case "floor":
          return { char: "·", color: theme.floor }
        case "door":
          return { char: "+", color: "text-yellow-600" }
        case "chest":
          return { char: "=", color: "text-yellow-500" }
        case "shop":
          return { char: "$", color: "text-green-500" }
        case "wizard":
          return { char: "W", color: "text-purple-500" }
        case "shrine":
          return {
            char: type === "shrine" && x === 1 && y === 1 ? "✓" : "†",
            color: type === "shrine" && x === 1 && y === 1 ? "text-gray-400" : "text-cyan-400",
          }
        case "stairs":
          return { char: ">", color: "text-blue-400" }
        case "boss":
          return { char: "B", color: "text-red-600" }
        case "portal":
          return { char: "O", color: "text-purple-500" }
        default:
          return { char: " ", color: "bg-black" }
      }
    },
    [enemies, player.x, player.y, player.class, theme],
  )

  return getTileDisplay
}

// Helper function to get player emoji based on class
function getPlayerEmoji(playerClass: string): string {
  switch (playerClass) {
    case "warrior":
      return "⚔️"
    case "mage":
      return "🧙"
    case "tank":
      return "🛡️"
    default:
      return "🧙"
  }
}

// Add walking animation to the GameMap component
export function GameMap() {
  const { player, enemies, currentMap, gameState, movePlayer } = useGameState()
  const [playerAnimation, setPlayerAnimation] = useState({
    isMoving: false,
    direction: { x: 0, y: 0 },
  })

  // Add keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1)
          break
        case "ArrowDown":
          movePlayer(0, 1)
          break
        case "ArrowLeft":
          movePlayer(-1, 0)
          break
        case "ArrowRight":
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [movePlayer])

  // Animation effect
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (playerAnimation.isMoving) {
      timeout = setTimeout(() => {
        setPlayerAnimation({ isMoving: false, direction: { x: 0, y: 0 } })
      }, 150) // Animation duration
    }
    return () => clearTimeout(timeout)
  }, [playerAnimation])

  // Update animation state when player moves
  useEffect(() => {
    setPlayerAnimation({ isMoving: true, direction: { x: player.x, y: player.y } })
  }, [player.x, player.y])

  // Get environment theme based on dungeon level
  const getEnvironmentTheme = useCallback(() => {
    const level = gameState.dungeonLevel
    // Cycle through themes: forest (green), desert (yellow), cave (dark)
    switch (level % 3) {
      case 1:
        return {
          wall: "text-green-950",
          floor: "text-green-700",
        }
      case 2:
        return {
          wall: "text-yellow-900",
          floor: "text-yellow-700",
        }
      case 0:
        return {
          wall: "text-slate-950",
          floor: "text-slate-700",
        }
      default:
        return {
          wall: "text-gray-900",
          floor: "text-gray-700",
        }
    }
  }, [gameState.dungeonLevel])

  const theme = useMemo(() => getEnvironmentTheme(), [getEnvironmentTheme])

  // Use the hook to get tile display
  const getTileDisplay = useGetTileDisplay({ player, enemies, theme })

  // Calculate viewport - increased size for a bigger map
  const VIEWPORT_WIDTH = 19
  const VIEWPORT_HEIGHT = 19

  const viewportStartX = Math.max(0, player.x - Math.floor(VIEWPORT_WIDTH / 2))
  const viewportStartY = Math.max(0, player.y - Math.floor(VIEWPORT_HEIGHT / 2))

  // Create the map grid
  const mapGrid = useMemo(() => {
    const rows = []

    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
      const mapY = viewportStartY + y
      if (mapY < 0 || mapY >= currentMap.length) continue

      const cells = []
      for (let x = 0; x < VIEWPORT_WIDTH; x++) {
        const mapX = viewportStartX + x
        if (mapX < 0 || mapX >= currentMap[0].length) continue

        const tile = currentMap[mapY][mapX]
        if (!tile) continue

        // Only show tiles that are explored
        if (!tile.explored) {
          cells.push(
            <div key={`${x}-${y}`} className="w-6 h-6 flex items-center justify-center bg-black">
              <span className="text-black">?</span>
            </div>,
          )
          continue
        }

        const { char, color } = getTileDisplay(tile.type, mapX, mapY)
        cells.push(
          <div key={`${x}-${y}`} className="w-6 h-6 flex items-center justify-center">
            <span className={`text-lg ${color}`}>{char}</span>
          </div>,
        )
      }

      rows.push(
        <div key={`row-${y}`} className="flex flex-row">
          {cells}
        </div>,
      )
    }

    return rows
  }, [currentMap, player.x, player.y, viewportStartX, viewportStartY, getTileDisplay])

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
      <h2 className="text-xl font-bold mb-2">Dungeon Level {gameState.dungeonLevel}</h2>
      <div className="bg-black p-2 rounded-md flex items-center justify-center">
        <div className="flex flex-col">{mapGrid}</div>
      </div>
    </div>
  )
}

export default GameMap

