"use client"

import { CardFooter } from "@/components/ui/card"

import { useGameState } from "@/lib/game-state"
import type { Item } from "@/lib/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { shopItems } from "@/lib/items"
import { useState } from "react"

export function Shop() {
  const {
    player,
    addToInventory,
    addGold,
    setShowShop,
    setInCombat,
    setActiveEnemy,
    sellItem,
    damagePlayer,
    levelShopInventory,
    gameState,
  } = useGameState()

  // State for shopkeeper fight confirmation
  const [showFightConfirm, setShowFightConfirm] = useState(false)

  // Get items for the current dungeon level
  const currentLevelItems = levelShopInventory.get(gameState.dungeonLevel) || shopItems

  const handleBuyItem = (item: Item) => {
    if (player.gold >= item.value) {
      const added = addToInventory(item)
      if (added) {
        addGold(-item.value)
      }
    }
  }

  const handleSellItem = (item: Item) => {
    // Sell for 70% of the value
    const sellValue = Math.floor(item.value * 0.7)
    sellItem(item)
    addGold(sellValue)
  }

  const handleFightShopkeeper = () => {
    setShowFightConfirm(true)
  }

  const confirmFightShopkeeper = () => {
    // Close the shop
    setShowShop(false)
    // Initiate combat with shopkeeper
    const shopkeeperEnemy = generateShopkeeperEnemy()
    setActiveEnemy(shopkeeperEnemy)
    setInCombat(true)

    // Add a message
    damagePlayer(0) // This is just to trigger a message without actually damaging the player

    // Hide confirmation
    setShowFightConfirm(false)
  }

  // Helper function to generate a shopkeeper enemy
  const generateShopkeeperEnemy = () => {
    // Create a shopkeeper that's as strong as a boss 2 levels higher
    const bossLevel = player.level + 2

    return {
      id: 999999, // Special ID for shopkeeper
      name: "Angry Shopkeeper",
      race: "human" as const,
      symbol: "S",
      level: bossLevel,
      health: 100 + bossLevel * 20,
      maxHealth: 100 + bossLevel * 20,
      attack: 15 + bossLevel * 3,
      defense: 10 + bossLevel * 2,
      magic: 8 + bossLevel * 2,
      dodge: 10 + bossLevel,
      x: 0,
      y: 0,
      goldValue: 500 + bossLevel * 100,
      expValue: 300 + bossLevel * 50,
      isShopkeeper: true, // Special flag to identify shopkeeper
      loot: [...shopItems], // The shopkeeper drops all shop items
      isBoss: true, // Treat as a boss for combat purposes
    }
  }

  // Filter items by class restriction
  const availableItems = currentLevelItems.filter(
    (item) => !item.classRestriction || item.classRestriction.includes(player.class),
  )

  // Get environment theme based on dungeon level
  const getThemeColors = () => {
    const level = player.level
    // Cycle through themes: forest (green), desert (yellow), cave (dark)
    switch (level % 3) {
      case 1:
        return {
          bg: "bg-green-950",
          accent: "bg-green-800",
          button: "bg-green-700 hover:bg-green-600",
          text: "text-green-100",
        }
      case 2:
        return {
          bg: "bg-yellow-900",
          accent: "bg-yellow-800",
          button: "bg-yellow-700 hover:bg-yellow-600",
          text: "text-yellow-100",
        }
      case 0:
        return {
          bg: "bg-slate-950",
          accent: "bg-slate-800",
          button: "bg-blue-900 hover:bg-blue-800",
          text: "text-blue-100",
        }
      default:
        return {
          bg: "bg-gray-900",
          accent: "bg-gray-800",
          button: "bg-gray-700 hover:bg-gray-600",
          text: "text-gray-100",
        }
    }
  }

  const theme = getThemeColors()

  return (
    <Card className={`w-full h-full ${theme.bg} border-gray-700`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Shop</span>
          <span className="text-yellow-500">{player.gold} Gold</span>
        </CardTitle>
        <CardDescription className="text-gray-300">Buy and sell items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-white">Available Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className={`${theme.accent} p-3 rounded-lg border border-gray-700 flex flex-col justify-between h-40`}
                >
                  <div>
                    <span className="font-medium text-white">{item.name}</span>
                    <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.attack && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          ATK +{item.attack}
                        </Badge>
                      )}
                      {item.defense && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          DEF +{item.defense}
                        </Badge>
                      )}
                      {item.magic && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          MAG +{item.magic}
                        </Badge>
                      )}
                      {item.dodge && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          DODGE +{item.dodge}
                        </Badge>
                      )}
                      {item.health && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          HP +{item.health}
                        </Badge>
                      )}
                      {item.mana && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          MP +{item.mana}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={player.gold >= item.value ? "default" : "outline"}
                    disabled={player.gold < item.value}
                    onClick={() => handleBuyItem(item)}
                    className="mt-2 w-full"
                  >
                    {item.value} Gold
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">Your Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {player.inventory.map((item) => (
                <div
                  key={item.id}
                  className={`${theme.accent} p-3 rounded-lg border border-gray-700 flex flex-col justify-between h-40`}
                >
                  <div>
                    <span className="font-medium text-white">{item.name}</span>
                    <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.attack && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          ATK +{item.attack}
                        </Badge>
                      )}
                      {item.defense && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          DEF +{item.defense}
                        </Badge>
                      )}
                      {item.magic && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          MAG +{item.magic}
                        </Badge>
                      )}
                      {item.dodge && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          DODGE +{item.dodge}
                        </Badge>
                      )}
                      {item.health && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          HP +{item.health}
                        </Badge>
                      )}
                      {item.mana && (
                        <Badge variant="outline" className="text-white bg-gray-800">
                          MP +{item.mana}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSellItem(item)}
                    className="mt-2 w-full text-black bg-white hover:bg-gray-200"
                  >
                    Sell ({Math.floor(item.value * 0.7)} Gold)
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowShop(false)} className="text-black bg-white hover:bg-gray-200">
          Close
        </Button>
        <Button variant="destructive" onClick={handleFightShopkeeper}>
          Fight Shopkeeper
        </Button>
      </CardFooter>

      {/* Shopkeeper fight confirmation modal */}
      {showFightConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Fight Shopkeeper?</h3>
            <p className="mb-6 text-gray-200">
              Are you sure you want to fight the shopkeeper? This will be a very difficult battle!
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFightConfirm(false)}
                className="text-black bg-white hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmFightShopkeeper}>
                Fight
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

