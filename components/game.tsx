"use client"

import { useState, useEffect } from "react"
import GameMap from "./game-map"
import Combat from "./combat"
import Minimap from "./minimap"
import Inventory from "./inventory"
import Shop from "./shop"
import { useGameState } from "@/lib/game-state"

export default function Game() {
  const {
    player,
    currentMap,
    enemies,
    inCombat,
    activeEnemy,
    inventory,
    gold,
    setInCombat,
    setActiveEnemy,
    movePlayer,
    addToInventory,
    removeFromInventory,
    addGold,
    equipItem,
    useItem,
  } = useGameState()

  const [showShop, setShowShop] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inCombat || showShop) return

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
        case "i":
          // Toggle inventory
          break
        case "s":
          setShowShop((prev) => !prev)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [inCombat, showShop, movePlayer])

  // Check for enemy encounters
  useEffect(() => {
    if (!inCombat) {
      const enemy = enemies.find((e) => e.x === player.x && e.y === player.y && e.health > 0)
      if (enemy) {
        setInCombat(true)
        setActiveEnemy(enemy)
      }
    }
  }, [player.x, player.y, enemies, inCombat, setInCombat, setActiveEnemy])

  return (
    <div className="w-full max-w-6xl h-[80vh] bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 text-white font-mono">
      <div className="grid grid-cols-2 grid-rows-2 h-full">
        {/* Top Left: Combat */}
        <div className="border-r-2 border-b-2 border-gray-700 p-2 overflow-hidden">
          {inCombat && activeEnemy ? (
            <Combat player={player} enemy={activeEnemy} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-green-400">Explore the dungeon...</p>
            </div>
          )}
        </div>

        {/* Top Right: Game Map */}
        <div className="border-b-2 border-gray-700 p-2 overflow-hidden">
          <GameMap map={currentMap} player={player} enemies={enemies} />
        </div>

        {/* Bottom Left: Inventory */}
        <div className="border-r-2 border-gray-700 p-2 overflow-hidden">
          {showShop ? (
            <Shop
              gold={gold}
              addToInventory={addToInventory}
              removeGold={(amount) => addGold(-amount)}
              closeShop={() => setShowShop(false)}
            />
          ) : (
            <Inventory
              items={inventory}
              gold={gold}
              equipItem={equipItem}
              useItem={useItem}
              removeItem={removeFromInventory}
            />
          )}
        </div>

        {/* Bottom Right: Minimap */}
        <div className="p-2 overflow-hidden">
          <Minimap map={currentMap} playerPosition={{ x: player.x, y: player.y }} />
          <div className="mt-2 flex justify-between">
            <button
              className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => setShowShop((prev) => !prev)}
            >
              {showShop ? "Close Shop" : "Open Shop"}
            </button>
            <div className="text-yellow-400">Gold: {gold}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

