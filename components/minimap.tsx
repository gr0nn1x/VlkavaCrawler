"use client"

import { useCallback, useMemo } from "react"
import { useGameState } from "@/lib/game-state"

export function Minimap() {
  const { currentMap, player, gameState } = useGameState()

  // Get environment theme based on dungeon level
  const getEnvironmentTheme = useCallback(() => {
    const level = gameState.dungeonLevel
    switch (level % 3) {
      case 1:
        return {
          floor: "bg-green-800",
          wall: "bg-green-950",
          player: "bg-green-300",
          door: "bg-yellow-600",
          chest: "bg-yellow-400",
          shop: "bg-blue-500",
          wizard: "bg-purple-500",
          shrine: "bg-cyan-400",
          boss: "bg-red-600",
          portal: "bg-purple-300",
        }
      case 2:
        return {
          floor: "bg-yellow-700",
          wall: "bg-yellow-900",
          player: "bg-yellow-300",
          door: "bg-orange-600",
          chest: "bg-orange-400",
          shop: "bg-blue-500",
          wizard: "bg-purple-500",
          shrine: "bg-cyan-400",
          boss: "bg-red-600",
          portal: "bg-purple-300",
        }
      case 0:
        return {
          floor: "bg-slate-800",
          wall: "bg-slate-950",
          player: "bg-blue-300",
          door: "bg-slate-600",
          chest: "bg-yellow-400",
          shop: "bg-blue-500",
          wizard: "bg-purple-500",
          shrine: "bg-cyan-400",
          boss: "bg-red-600",
          portal: "bg-purple-300",
        }
      default:
        return {
          floor: "bg-gray-800",
          wall: "bg-gray-950",
          player: "bg-yellow-400",
          door: "bg-yellow-700",
          chest: "bg-yellow-500",
          shop: "bg-green-500",
          wizard: "bg-purple-500",
          shrine: "bg-cyan-400",
          boss: "bg-red-600",
          portal: "bg-purple-300",
        }
    }
  }, [gameState.dungeonLevel])

  const theme = useMemo(() => getEnvironmentTheme(), [getEnvironmentTheme])

  // Calculate minimap size
  const MINIMAP_SIZE = 25

  // Memoize the minimap calculations and rendering
  const minimapContent = useMemo(() => {
    const halfSize = Math.floor(MINIMAP_SIZE / 2)

    // Ensure we have a valid map
    if (!currentMap || !currentMap.length || !currentMap[0]) {
      return []
    }

    const startX = Math.max(0, player.x - halfSize)
    const startY = Math.max(0, player.y - halfSize)
    const endX = Math.min(startX + MINIMAP_SIZE, currentMap[0].length)
    const endY = Math.min(startY + MINIMAP_SIZE, currentMap.length)

    const rows = []

    for (let y = startY; y < endY; y++) {
      const cells = []
      for (let x = startX; x < endX; x++) {
        const tile = currentMap[y]?.[x]

        if (!tile || !tile.explored) {
          cells.push(<div key={`${x}-${y}`} className="bg-black w-1 h-1" />)
          continue
        }

        // Player position
        if (player.x === x && player.y === y) {
          cells.push(<div key={`${x}-${y}`} className={`${theme.player} w-1 h-1`} />)
          continue
        }

        // Tile types - ensure all types are handled
        let tileClass = theme.floor // Default to floor

        if (tile.type === "wall") tileClass = theme.wall
        else if (tile.type === "floor") tileClass = theme.floor
        else if (tile.type === "door") tileClass = theme.door
        else if (tile.type === "chest") tileClass = theme.chest
        else if (tile.type === "shop") tileClass = theme.shop
        else if (tile.type === "wizard") tileClass = theme.wizard
        else if (tile.type === "shrine") tileClass = theme.shrine
        else if (tile.type === "boss") tileClass = theme.boss
        else if (tile.type === "portal") tileClass = theme.portal

        cells.push(<div key={`${x}-${y}`} className={`${tileClass} w-1 h-1`} />)
      }

      rows.push(
        <div key={`row-${y}`} className="flex">
          {cells}
        </div>,
      )
    }

    return rows
  }, [currentMap, player.x, player.y, theme])

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
      <h3 className="text-sm font-bold mb-1">Minimap (Level {gameState.dungeonLevel})</h3>
      <div className="grid grid-cols-1 gap-1">
        <div className="bg-black p-1 rounded-md w-full h-32 overflow-hidden">
          {minimapContent.length > 0 ? (
            <div className="flex flex-col gap-0">{minimapContent}</div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Map loading...</div>
          )}
        </div>
      </div>
    </div>
  )
}

