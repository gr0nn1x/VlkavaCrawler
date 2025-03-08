"use client"

import { CardFooter } from "@/components/ui/card"

import { useGameState } from "@/lib/game-state"
import type { Spell } from "@/lib/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { mageSpells, tankSpells, warriorSpells } from "@/lib/spells"
import { useState } from "react"

export function WizardShop() {
  const { player, learnSpell, addGold, setShowWizardShop, setInCombat, setActiveEnemy, damagePlayer } = useGameState()
  const [showFightConfirm, setShowFightConfirm] = useState(false)

  const handleBuySpell = (spell: Spell) => {
    if (player.gold >= (spell.price || 0)) {
      const learned = learnSpell(spell)
      if (learned) {
        addGold(-(spell.price || 0))
      }
    }
  }

  const handleFightWizard = () => {
    setShowFightConfirm(true)
  }

  const confirmFightWizard = () => {
    // Close the shop
    setShowWizardShop(false)
    // Initiate combat with wizard
    const wizardEnemy = generateWizardEnemy()
    setActiveEnemy(wizardEnemy)
    setInCombat(true)

    // Add a message
    damagePlayer(0) // This is just to trigger a message without actually damaging the player

    // Hide confirmation
    setShowFightConfirm(false)
  }

  // Helper function to generate a wizard enemy
  const generateWizardEnemy = () => {
    // Create a wizard that's as strong as a boss 2 levels higher
    const bossLevel = player.level + 2

    // Get all spells for loot
    const allSpells = [...mageSpells, ...warriorSpells, ...tankSpells]
    const shopSpells = allSpells.filter((spell) => spell.price && spell.price > 0)

    return {
      id: 888888, // Special ID for wizard
      name: "Archmage",
      race: "human" as const,
      symbol: "W",
      level: bossLevel,
      health: 80 + bossLevel * 15,
      maxHealth: 80 + bossLevel * 15,
      attack: 8 + bossLevel * 1,
      defense: 6 + bossLevel * 1,
      magic: 20 + bossLevel * 3,
      dodge: 12 + bossLevel,
      x: 0,
      y: 0,
      goldValue: 600 + bossLevel * 120,
      expValue: 350 + bossLevel * 60,
      isWizard: true, // Special flag to identify wizard
      spellLoot: shopSpells, // The wizard drops all shop spells
      isBoss: true, // Treat as a boss for combat purposes
    }
  }

  // Get spells available for purchase
  const getShopSpells = () => {
    const allSpells = [...mageSpells, ...warriorSpells, ...tankSpells]
    return allSpells.filter(
      (spell) =>
        spell.price &&
        (!spell.classRestriction || spell.classRestriction.includes(player.class)) &&
        (!spell.levelRequirement || spell.levelRequirement <= player.level),
    )
  }

  const shopSpells = getShopSpells()

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
        <CardTitle className="flex justify-between items-center text-purple-300">
          <span>Wizard&apos;s Spell Shop</span>
          <span className="text-yellow-500">{player.gold} Gold</span>
        </CardTitle>
        <CardDescription className="text-blue-300">Learn powerful spells to enhance your abilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shopSpells.map((spell) => (
            <div
              key={spell.id}
              className={`${theme.accent} p-3 rounded-lg border border-purple-700 flex flex-col justify-between h-auto min-h-[160px]`}
            >
              <div>
                <span className="font-medium text-purple-300">{spell.name}</span>
                <div className="text-xs text-gray-300 mt-1">{spell.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-white bg-blue-900">
                    Mana: {spell.manaCost}
                  </Badge>
                  {spell.damage && (
                    <Badge variant="outline" className="text-white bg-red-900">
                      DMG: {spell.damage}
                    </Badge>
                  )}
                  {spell.healing && (
                    <Badge variant="outline" className="text-white bg-green-900">
                      HEAL: {spell.healing}
                    </Badge>
                  )}
                  {spell.effect && (
                    <Badge variant="outline" className="text-white bg-purple-900">
                      Effect: {spell.effect}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant={player.gold >= (spell.price || 0) ? "default" : "outline"}
                disabled={player.gold < (spell.price || 0) || player.knownSpells.some((s) => s.id === spell.id)}
                onClick={() => handleBuySpell(spell)}
                className="mt-2 w-full bg-purple-700 hover:bg-purple-600"
              >
                {player.knownSpells.some((s) => s.id === spell.id) ? "Learned" : `${spell.price} Gold`}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setShowWizardShop(false)}
          className="text-black bg-white hover:bg-gray-200"
        >
          Close
        </Button>
        <Button variant="destructive" onClick={handleFightWizard}>
          Fight Wizard
        </Button>
      </CardFooter>

      {/* Wizard fight confirmation modal */}
      {showFightConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Fight Wizard?</h3>
            <p className="mb-6 text-gray-200">
              Are you sure you want to fight the wizard? This will be a very difficult battle!
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFightConfirm(false)}
                className="text-black bg-white hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmFightWizard}>
                Fight
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

