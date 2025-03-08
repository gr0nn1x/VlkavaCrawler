"use client"

import { useState, useEffect } from "react"
import { useGameState } from "@/lib/game-state"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sword, Shield, Wand, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAudio } from "@/components/audio-system"
import type { Item } from "@/lib/types"

export function Combat() {
  const {
    player,
    activeEnemy,
    setInCombat,
    setActiveEnemy,
    damagePlayer,
    damageEnemy,
    addGold,
    addExperience,
    addToInventory,
    enemies,
    gameState,
    setEnemies,
    useItem,
  } = useGameState()

  const { playSound, startBattleMusic, startBackgroundMusic, audioAvailable } = useAudio()

  // Start battle music when combat begins
  useEffect(() => {
    if (audioAvailable) {
      startBattleMusic()

      // Return to background music when combat ends
      return () => {
        startBackgroundMusic()
      }
    }
  }, [startBattleMusic, startBackgroundMusic, audioAvailable])

  const [combatLog, setCombatLog] = useState<string[]>([`You encounter a ${activeEnemy?.name}!`])
  const [playerTurn, setPlayerTurn] = useState(true)
  const [showSpells, setShowSpells] = useState(false)
  const [currentEnemyHealth, setCurrentEnemyHealth] = useState(activeEnemy?.health || 0)
  const [currentEnemyMaxHealth, setCurrentEnemyMaxHealth] = useState(activeEnemy?.maxHealth || 0)
  const [showShopkeeperConfirm, setShowShopkeeperConfirm] = useState(false)
  // Add state for enemy stun
  const [enemyStunned, setEnemyStunned] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [potionToUse, setPotionToUse] = useState<Item | null>(null)
  const [usingPotion, setUsingPotion] = useState(false)
  const [potionEffectApplied, setPotionEffectApplied] = useState(false)
  const [potionUsed, setPotionUsed] = useState(false)

  // Get environment theme based on dungeon level
  const getThemeColors = () => {
    const level = gameState.dungeonLevel
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

  // Initialize enemy health state when combat starts
  useEffect(() => {
    if (activeEnemy) {
      setCurrentEnemyHealth(activeEnemy.health)
      setCurrentEnemyMaxHealth(activeEnemy.maxHealth)
    }
  }, [activeEnemy])

  // Handle player attack with critical hit chance
  const handleAttack = () => {
    if (!activeEnemy || !playerTurn || currentEnemyHealth <= 0) return

    // Play attack sound
    if (audioAvailable) {
      playSound("attack")
    }

    // Check for critical hit
    const isCritical = Math.random() * 100 < player.criticalHit

    // Calculate base damage - ensure it's at least 1
    let damage = Math.max(1, player.attack - Math.floor(activeEnemy.defense / 2))

    // Apply critical hit multiplier if applicable
    if (isCritical) {
      damage = Math.floor(damage * 2) // 200% damage on critical hit
    }

    // Update local enemy health state immediately for UI
    const newHealth = Math.max(0, currentEnemyHealth - damage)
    setCurrentEnemyHealth(newHealth)

    // Apply damage to the enemy in game state
    damageEnemy(activeEnemy.id, damage)

    // Add to combat log with critical hit message if applicable
    if (isCritical) {
      setCombatLog((prev) => [`CRITICAL HIT! You attack the ${activeEnemy.name} for ${damage} damage!`, ...prev])
    } else {
      setCombatLog((prev) => [`You attack the ${activeEnemy.name} for ${damage} damage!`, ...prev])
    }

    // Special messages for shopkeeper and wizard fights
    if (activeEnemy.isShopkeeper) {
      setCombatLog((prev) => [`The shopkeeper is enraged by your attack!`, ...prev])
    }

    if (activeEnemy.isWizard) {
      setCombatLog((prev) => [`The archmage summons powerful magic against you!`, ...prev])
    }

    // Check if enemy is defeated
    if (newHealth <= 0) {
      handleEnemyDefeated()
    } else {
      // Enemy's turn
      setPlayerTurn(false)
      setTimeout(handleEnemyTurn, 1000)
    }
  }

  const handleEnemyTurn = () => {
    if (!activeEnemy) return

    // Check if enemy is stunned
    if (enemyStunned) {
      setCombatLog((prev) => [`The ${activeEnemy.name} is stunned and cannot attack!`, ...prev])
      setEnemyStunned(false) // Remove stun after this turn
      setPlayerTurn(true) // Back to player's turn
      return
    }

    // Check for dodge - player has a chance to evade the attack based on dodge stat
    const cappedDodge = Math.min(player.dodge, 80) // Cap dodge at 80%
    const dodgeRoll = Math.random() * 100
    if (dodgeRoll < cappedDodge) {
      // Player successfully dodged the attack
      setCombatLog((prev) => [`You dodged the ${activeEnemy.name}'s attack! (${cappedDodge}% chance)`, ...prev])

      // Play dodge sound if available
      if (audioAvailable) {
        playSound("flee") // Using flee sound for dodge
      }

      // Player's turn
      setPlayerTurn(true)
      return
    }

    // Calculate damage with armor nerf
    // Reduce the effectiveness of defense by applying a diminishing returns formula
    const defenseEffectiveness = Math.min(0.75, player.defense / (player.defense + 20)) // Caps at 75% damage reduction
    const baseDamage = activeEnemy.attack
    const damage = Math.max(1, Math.floor(baseDamage * (1 - defenseEffectiveness)))

    // Play damage sound
    if (audioAvailable) {
      playSound("damage")
    }

    // Apply damage
    damagePlayer(damage)

    // Add to combat log
    setCombatLog((prev) => [`The ${activeEnemy.name} attacks you for ${damage} damage!`, ...prev])

    // Check if player is defeated
    if (player.health - damage <= 0) {
      handlePlayerDefeated()
    } else {
      // Player's turn
      setPlayerTurn(true)
    }
  }

  // Handle using a potion during combat
  useEffect(() => {
    if (usingPotion && potionToUse) {
      // Use the potion
      const success = useItem(potionToUse)

      if (success) {
        // Play sound
        if (audioAvailable) {
          playSound("itemPickup")
        }

        // Add to combat log
        if (potionToUse.health) {
          setCombatLog((prev) => [`You used ${potionToUse.name} and restored ${potionToUse.health} health!`, ...prev])
        }
        if (potionToUse.mana) {
          setCombatLog((prev) => [`You used ${potionToUse.name} and restored ${potionToUse.mana} mana!`, ...prev])
        }
        setPotionUsed(true)
      } else {
        setPotionUsed(false)
      }

      // Hide inventory after using a potion
      setShowInventory(false)
      setPotionToUse(null)
      setUsingPotion(false)
    }
  }, [usingPotion, potionToUse, useItem, audioAvailable, playSound, setShowInventory, setPotionToUse, setCombatLog])

  useEffect(() => {
    if (potionUsed) {
      setPotionEffectApplied(true)
      setPotionUsed(false)
    }
  }, [potionUsed])

  // Reset potionEffectApplied when a new potion is selected
  useEffect(() => {
    setPotionEffectApplied(false)
  }, [potionToUse])

  // Handle enemy defeated
  const handleEnemyDefeated = () => {
    if (!activeEnemy) return

    // Play enemy defeat sound
    if (audioAvailable) {
      playSound("enemyDefeat")
    }

    // Add to combat log
    setCombatLog((prev) => [`You defeated the ${activeEnemy.name}!`, ...prev])

    // Calculate gold with luck bonus (each point of luck adds 1% more gold)
    const luckBonus = 1 + player.luck / 100
    const goldAmount = Math.floor(activeEnemy.goldValue * luckBonus)

    // Add gold and experience
    addGold(goldAmount)
    addExperience(activeEnemy.expValue)

    setCombatLog((prev) => [`You gained ${goldAmount} gold and ${activeEnemy.expValue} experience!`, ...prev])

    // Add loot if any
    if (activeEnemy.loot && activeEnemy.loot.length > 0) {
      activeEnemy.loot.forEach((item) => {
        const added = addToInventory(item)
        if (added) {
          if (audioAvailable) {
            playSound("itemPickup")
          }
          setCombatLog((prev) => [`You found ${item.name}!`, ...prev])
        } else {
          setCombatLog((prev) => [`You found ${item.name}, but your inventory is full!`, ...prev])
        }
      })
    }

    // End combat after a delay
    setTimeout(() => {
      setInCombat(false)
      setActiveEnemy(null)
    }, 2000)
  }

  // Handle player defeated
  const handlePlayerDefeated = () => {
    // Add to combat log
    setCombatLog((prev) => [`You were defeated by the ${activeEnemy?.name}!`, ...prev])

    // End combat after a delay
    setTimeout(() => {
      setInCombat(false)
      setActiveEnemy(null)
    }, 2000)
  }

  // Handle spell cast
  const handleCastSpell = (spellId: string) => {
    if (!activeEnemy || !playerTurn) return

    // Play spell sound
    if (audioAvailable) {
      playSound("spell")
    }

    const spell = player.knownSpells.find((s) => s.id === spellId)
    if (!spell) return

    // Check if player has enough mana
    if (player.mana < spell.manaCost) {
      setCombatLog((prev) => [`Not enough mana to cast ${spell.name}!`, ...prev])
      return
    }

    // Calculate damage
    let damage = 0
    if (spell.damage) {
      damage = spell.damage + Math.floor(player.magic * 0.5)
    }

    // Check for stun effect
    if (spell.effect && spell.effect.includes("Stuns enemy")) {
      setEnemyStunned(true)
      setCombatLog((prev) => [`${activeEnemy.name} is stunned!`, ...prev])
    }

    // Update local enemy health state immediately for UI
    if (damage > 0) {
      const newHealth = Math.max(0, currentEnemyHealth - damage)
      setCurrentEnemyHealth(newHealth)

      // Apply spell effects
      damageEnemy(activeEnemy.id, damage)
      setCombatLog((prev) => [`You cast ${spell.name} for ${damage} damage!`, ...prev])

      // Check if enemy is defeated
      if (newHealth <= 0) {
        handleEnemyDefeated()
        setShowSpells(false)
        return
      }
    } else {
      setCombatLog((prev) => [`You cast ${spell.name}!`, ...prev])
    }

    // Deduct mana
    player.mana -= spell.manaCost

    // Enemy's turn
    setPlayerTurn(false)
    setTimeout(handleEnemyTurn, 1000)

    // Hide spell list
    setShowSpells(false)
  }

  // Handle flee
  const handleFlee = () => {
    // Play flee sound
    if (audioAvailable) {
      playSound("flee")
    }

    // 50% chance to flee
    if (Math.random() > 0.5) {
      setCombatLog((prev) => [`You successfully fled from the ${activeEnemy?.name}!`, ...prev])

      // End combat with a longer delay to allow the message to be seen
      setTimeout(() => {
        setInCombat(false)
        setActiveEnemy(null)
      }, 1000)
    } else {
      setCombatLog((prev) => [`You failed to flee!`, ...prev])

      // Enemy's turn
      setPlayerTurn(false)
      setTimeout(handleEnemyTurn, 1000)
    }
  }

  // Get enemy emoji based on race
  const getEnemyEmoji = () => {
    if (!activeEnemy) return "👾"

    if (activeEnemy.isBoss) return "👹"

    switch (activeEnemy.race) {
      case "dragon":
        return "🐉"
      case "skeleton":
        return "💀"
      case "human":
        return "👤"
      case "elf":
        return "🧝"
      case "dwarf":
        return "🧔"
      case "halfling":
        return "🧒"
      case "mimic":
        return "📦"
      case "undead":
        return "🧟"
      case "boss":
        return "👹"
      default:
        return "👾"
    }
  }

  if (!activeEnemy) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className={`w-full max-w-4xl ${theme.bg} border-gray-700`}>
        <CardHeader>
          <CardTitle className={`text-xl ${theme.text}`}>Combat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player */}
            <div className={`${theme.accent} p-3 rounded-md`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{getPlayerEmoji(player.class)}</div>
                <h3 className="font-bold">{player.name}</h3>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>
                    {player.health}/{player.maxHealth}
                  </span>
                </div>
                <Progress value={(player.health / player.maxHealth) * 100} className="h-2 bg-gray-700" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mana</span>
                  <span>
                    {player.mana}/{player.maxMana}
                  </span>
                </div>
                <Progress value={(player.mana / player.maxMana) * 100} className="h-2 bg-gray-700" />
              </div>
            </div>

            {/* Enemy */}
            <div className={`${theme.accent} p-3 rounded-md`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{getEnemyEmoji()}</div>
                <h3 className="font-bold">
                  {activeEnemy.name} (Level {activeEnemy.level})
                  {enemyStunned && <span className="ml-2 text-yellow-400">[Stunned]</span>}
                </h3>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>
                    {currentEnemyHealth}/{currentEnemyMaxHealth}
                  </span>
                </div>
                <Progress value={(currentEnemyHealth / currentEnemyMaxHealth) * 100} className="h-2 bg-gray-700" />
              </div>

              <div className="text-sm mt-2">
                <p>Attack: {activeEnemy.attack}</p>
                <p>Defense: {activeEnemy.defense}</p>
              </div>
            </div>
          </div>

          {/* Combat Log - Fixed height, no scrolling, newest messages at top */}
          <div className={`mt-3 ${theme.accent} p-2 rounded-md h-40 overflow-hidden`}>
            {combatLog.slice(0, 8).map((log, index) => (
              <p key={index} className="text-sm mb-1">
                {log}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={handleAttack}
              disabled={!playerTurn || currentEnemyHealth <= 0}
              className={`${theme.button} flex items-center gap-2`}
            >
              <Sword className="w-4 h-4" />
              Attack
            </Button>

            <Button
              onClick={() => setShowSpells(!showSpells)}
              disabled={!playerTurn || player.knownSpells.length === 0}
              className={`${theme.button} flex items-center gap-2`}
            >
              <Wand className="w-4 h-4" />
              Spells
            </Button>

            <Button
              onClick={() => setShowInventory(!showInventory)}
              disabled={!playerTurn}
              className={`${theme.button} flex items-center gap-2`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M3 6h18"></path>
                <path d="M3 12h18"></path>
                <path d="M3 18h18"></path>
              </svg>
              Items
            </Button>

            <Button
              onClick={handleFlee}
              disabled={!playerTurn}
              variant="outline"
              className="flex items-center gap-2 text-black bg-white hover:bg-gray-200"
            >
              <Shield className="w-4 h-4" />
              Flee
            </Button>
          </div>

          {/* Spell List */}
          {showSpells && (
            <div className={`mt-2 ${theme.accent} p-2 rounded-md`}>
              <h4 className="text-sm font-bold mb-2">Select a spell:</h4>
              <div className="grid grid-cols-2 gap-2">
                {player.knownSpells.map((spell) => (
                  <Button
                    key={spell.id}
                    size="sm"
                    onClick={() => handleCastSpell(spell.id)}
                    disabled={player.mana < spell.manaCost}
                    className={`${theme.button} text-xs justify-start flex items-center gap-1`}
                  >
                    <Flame className="w-3 h-3" />
                    {spell.name} ({spell.manaCost} MP)
                    {spell.effect && spell.effect.includes("Stuns") && <span className="ml-1 text-yellow-300">⚡</span>}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory List */}
          {showInventory && (
            <div className={`mt-2 ${theme.accent} p-2 rounded-md`}>
              <h4 className="text-sm font-bold mb-2">Select an item to use:</h4>
              <div className="grid grid-cols-2 gap-2">
                {player.inventory
                  .filter((item) => item.type === "potion")
                  .map((item) => (
                    <Button
                      key={item.id}
                      size="sm"
                      onClick={() => {
                        setPotionToUse(item)
                        setUsingPotion(true)
                      }}
                      className={`${theme.button} text-xs justify-start flex items-center gap-1`}
                    >
                      <span className="text-green-400">🧪</span>
                      {item.name}
                      {item.health && <span className="ml-1 text-green-300">+{item.health} HP</span>}
                      {item.mana && <span className="ml-1 text-blue-300">+{item.mana} MP</span>}
                    </Button>
                  ))}
              </div>
              {player.inventory.filter((item) => item.type === "potion").length === 0 && (
                <p className="text-xs text-gray-400">No potions in inventory</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
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

