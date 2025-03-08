"use client"

import { useState, useEffect, useCallback } from "react"
import { useGameState } from "@/lib/game-state"
import type { Item } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Inventory() {
  const { player, equipItem, useItem, removeFromInventory } = useGameState()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [itemToUse, setItemToUse] = useState<Item | null>(null)
  const [equipSuccess, setEquipSuccess] = useState<boolean | null>(null)

  // Handle item selection
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item)
    setEquipSuccess(null) // Reset equip status when selecting a new item
  }

  // Handle item use
  const handleUseItem = () => {
    if (selectedItem) {
      setItemToUse(selectedItem)
      setSelectedItem(null)
    }
  }

  // Handle item equip
  const handleEquipItem = () => {
    if (selectedItem) {
      const success = equipItem(selectedItem)
      setEquipSuccess(success)
      if (success) {
        // Keep the item selected but update the UI to show it's equipped
        setSelectedItem({ ...selectedItem })
      }
    }
  }

  // Handle item drop
  const handleDropItem = () => {
    if (selectedItem) {
      removeFromInventory(selectedItem)
      setSelectedItem(null)
    }
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

  // Generate item description
  const getItemDescription = (item: Item) => {
    let description = item.description || ""

    if (item.attack)
      description += `
Attack: +${item.attack}`
    if (item.defense)
      description += `
Defense: +${item.defense}`
    if (item.magic)
      description += `
Magic: +${item.magic}`
    if (item.dodge)
      description += `
Dodge: +${item.dodge}%`
    if (item.health)
      description += `
Health: +${item.health}`
    if (item.mana)
      description += `
Mana: +${item.mana}`
    if (item.criticalHit)
      description += `
Critical Hit: +${item.criticalHit}%`
    if (item.luck)
      description += `
Luck: +${item.luck}%`

    if (item.levelRequirement) {
      description += `
Required Level: ${item.levelRequirement}`
    }

    if (item.classRestriction && item.classRestriction.length > 0) {
      description += `
Classes: ${item.classRestriction.join(", ")}`
    }

    return description
  }

  // Check if item can be equipped
  const canEquip = (item: Item) => {
    return (
      (item.type === "weapon" || item.type === "armor" || item.type === "accessory") &&
      (!item.classRestriction || item.classRestriction.includes(player.class)) &&
      (!item.levelRequirement || player.level >= item.levelRequirement)
    )
  }

  // Check if item can be used
  const canUse = (item: Item) => {
    return item.type === "potion" || item.type === "scroll"
  }

  // Check if item is currently equipped
  const isEquipped = (item: Item) => {
    return (
      (item.type === "weapon" && player.equipment.weapon?.id === item.id) ||
      (item.type === "armor" && player.equipment.armor?.id === item.id) ||
      (item.type === "accessory" && player.equipment.accessory?.id === item.id)
    )
  }

  // Process item use
  const processItemUse = useCallback(() => {
    if (itemToUse) {
      useItem(itemToUse)
      setItemToUse(null)
    }
  }, [itemToUse, useItem])

  useEffect(() => {
    if (itemToUse) {
      processItemUse()
    }
  }, [processItemUse, itemToUse])

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 w-full">
      <h2 className="text-xl font-bold mb-2 text-white">Inventory ({player.inventory.length}/20)</h2>

      {/* Equipment Section */}
      <div className="mb-4 p-3 bg-gray-800 rounded-md">
        <h3 className="text-sm font-bold mb-2">Equipment</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Weapon</span>
            {player.equipment.weapon ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded border border-blue-400 bg-gray-700"
                      onClick={() => handleSelectItem(player.equipment.weapon!)}
                    >
                      <span className={`text-lg ${getRarityColor(player.equipment.weapon.rarity)}`}>⚔️</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <div className="max-w-xs">
                      <p className={`font-bold ${getRarityColor(player.equipment.weapon.rarity)}`}>
                        {player.equipment.weapon.name}
                      </p>
                      <p className="text-xs mt-1 whitespace-pre-line">{getItemDescription(player.equipment.weapon)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-10 h-10 rounded border border-gray-700 bg-gray-800 opacity-50 flex items-center justify-center">
                <span className="text-gray-500">⚔️</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Armor</span>
            {player.equipment.armor ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded border border-blue-400 bg-gray-700"
                      onClick={() => handleSelectItem(player.equipment.armor!)}
                    >
                      <span className={`text-lg ${getRarityColor(player.equipment.armor.rarity)}`}>🛡️</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <div className="max-w-xs">
                      <p className={`font-bold ${getRarityColor(player.equipment.armor.rarity)}`}>
                        {player.equipment.armor.name}
                      </p>
                      <p className="text-xs mt-1 whitespace-pre-line">{getItemDescription(player.equipment.armor)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-10 h-10 rounded border border-gray-700 bg-gray-800 opacity-50 flex items-center justify-center">
                <span className="text-gray-500">🛡️</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs mb-1">Accessory</span>
            {player.equipment.accessory ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded border border-blue-400 bg-gray-700"
                      onClick={() => handleSelectItem(player.equipment.accessory!)}
                    >
                      <span className={`text-lg ${getRarityColor(player.equipment.accessory.rarity)}`}>💍</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <div className="max-w-xs">
                      <p className={`font-bold ${getRarityColor(player.equipment.accessory.rarity)}`}>
                        {player.equipment.accessory.name}
                      </p>
                      <p className="text-xs mt-1 whitespace-pre-line">
                        {getItemDescription(player.equipment.accessory)}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-10 h-10 rounded border border-gray-700 bg-gray-800 opacity-50 flex items-center justify-center">
                <span className="text-gray-500">💍</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ScrollArea className="h-40 rounded-md border border-gray-700 p-2">
          <div className="grid grid-cols-5 gap-2">
            {player.inventory.map((item) => (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded border ${
                        selectedItem?.id === item.id
                          ? "border-yellow-400 bg-gray-700"
                          : isEquipped(item)
                            ? "border-blue-400 bg-gray-700"
                            : "border-gray-600 bg-gray-800"
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <span className={`text-lg ${getRarityColor(item.rarity)}`}>{getItemSymbol(item.type)}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
                    <div className="max-w-xs">
                      <p className={`font-bold ${getRarityColor(item.rarity)}`}>
                        {item.name} {isEquipped(item) && "(Equipped)"}
                      </p>
                      <p className="text-xs text-gray-300">
                        {item.type} • {item.rarity}
                      </p>
                      <p className="text-xs mt-1 whitespace-pre-line">{getItemDescription(item)}</p>
                      <p className="text-xs text-gray-400 mt-1">Value: {item.value} gold</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 20 - player.inventory.length) }).map((_, index) => (
              <div key={`empty-${index}`} className="w-10 h-10 rounded border border-gray-700 bg-gray-800 opacity-50" />
            ))}
          </div>
        </ScrollArea>

        {selectedItem && (
          <div className="bg-gray-800 rounded-md p-3 border border-gray-700">
            <h3 className={`font-bold ${getRarityColor(selectedItem.rarity)}`}>
              {selectedItem.name} {isEquipped(selectedItem) && "(Equipped)"}
            </h3>
            <p className="text-sm text-gray-300">
              {selectedItem.type} • {selectedItem.rarity}
            </p>
            <p className="text-sm mt-1 whitespace-pre-line">{getItemDescription(selectedItem)}</p>

            {equipSuccess === false && <p className="text-sm text-red-400 mt-1">Cannot equip this item!</p>}

            <div className="flex gap-2 mt-3">
              {canEquip(selectedItem) && !isEquipped(selectedItem) && (
                <Button size="sm" onClick={handleEquipItem}>
                  Equip
                </Button>
              )}
              {isEquipped(selectedItem) && (
                <Button size="sm" variant="secondary" disabled>
                  Equipped
                </Button>
              )}
              {canUse(selectedItem) && (
                <Button size="sm" onClick={handleUseItem}>
                  Use
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={handleDropItem}>
                Drop
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

