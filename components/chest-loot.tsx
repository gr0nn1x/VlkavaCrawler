"use client"

import { useGameState } from "@/lib/game-state"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAudio } from "@/components/audio-system"
import { useEffect } from "react"

export function ChestLoot() {
  const { chestContents, closeChest, takeGoldFromChest, takeItemFromChest, player } = useGameState()
  const { playSound } = useAudio()

  useEffect(() => {
    if (chestContents.isOpen) {
      playSound("openChest")
    }
  }, [chestContents.isOpen, playSound])

  if (!chestContents.isOpen) {
    return null
  }

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-200"
      case "uncommon":
        return "text-green-400"
      case "rare":
        return "text-blue-400"
      case "epic":
        return "text-purple-400"
      case "legendary":
        return "text-orange-400"
      default:
        return "text-gray-200"
    }
  }

  // Get item type symbol
  const getItemSymbol = (type: string) => {
    switch (type) {
      case "weapon":
        return "⚔️"
      case "armor":
        return "🛡️"
      case "potion":
        return "🧪"
      case "accessory":
        return "💍"
      case "scroll":
        return "📜"
      default:
        return "📦"
    }
  }

  // Check if chest is empty
  const isChestEmpty =
    (!chestContents.contents.gold || chestContents.contents.gold <= 0) &&
    (!chestContents.contents.items || chestContents.contents.items.length === 0)

  // Handle taking gold
  const handleTakeGold = () => {
    playSound("itemPickup")
    takeGoldFromChest()
  }

  // Handle taking item
  const handleTakeItem = (item: any) => {
    playSound("itemPickup")
    takeItemFromChest(item)
  }

  // Handle opening chest

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-gray-900 p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Treasure Chest</h2>
          <button className="text-gray-400 hover:text-white" onClick={closeChest}>
            ✕
          </button>
        </div>

        <div className="mb-4">
          {isChestEmpty ? (
            <p className="text-gray-400">The chest is empty.</p>
          ) : (
            <p className="text-gray-400">You found treasure!</p>
          )}
        </div>

        {/* Gold */}
        {chestContents.contents.gold && chestContents.contents.gold > 0 && (
          <div className="mb-4 p-3 bg-gray-800 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-yellow-400 mr-2">💰</span>
                <span className="text-yellow-400">{chestContents.contents.gold} gold</span>
              </div>
              <Button size="sm" onClick={handleTakeGold}>
                Take
              </Button>
            </div>
          </div>
        )}

        {/* Items */}
        {chestContents.contents.items && chestContents.contents.items.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold mb-2">Items:</h3>
            <ScrollArea className="h-48 rounded-md border border-gray-700 p-2">
              {chestContents.contents.items.map((item) => (
                <div key={item.id} className="mb-2 p-3 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`text-lg mr-2 ${getRarityColor(item.rarity)}`}>{getItemSymbol(item.type)}</span>
                      <div>
                        <div className={`font-bold ${getRarityColor(item.rarity)}`}>{item.name}</div>
                        <div className="text-xs text-gray-400">
                          {item.type} • {item.rarity}
                          {item.attack && ` • Attack: +${item.attack}`}
                          {item.defense && ` • Defense: +${item.defense}`}
                          {item.magic && ` • Magic: +${item.magic}`}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleTakeItem(item)} disabled={player.inventory.length >= 20}>
                      Take
                    </Button>
                  </div>
                  {player.inventory.length >= 20 && <p className="text-xs text-red-400 mt-1">Inventory full</p>}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        <Button className="w-full" onClick={closeChest}>
          Close Chest
        </Button>
      </div>
    </div>
  )
}

