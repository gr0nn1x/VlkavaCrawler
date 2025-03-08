"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

// Define the types for your game state
interface Spell {
  id: string
  name: string
  description: string
  damage: number
  manaCost: number
  classRestriction?: string[]
}

interface Item {
  id: string
  name: string
  description: string
  type: "weapon" | "armor" | "potion"
  attack?: number
  defense?: number
  healing?: number
}

interface Character {
  x: number
  y: number
  health: number
  maxHealth: number
  attack: number
  defense: number
  gold: number
  level: number
  experience: number
  experienceToNextLevel: number
  class: string
  knownSpells: Spell[]
  inventory: Item[]
}

interface Enemy {
  id: string
  x: number
  y: number
  health: number
  attack: number
  defense: number
  goldValue: number
  isWizard?: boolean
  spellLoot?: Spell[]
}

interface ChestContents {
  x: number
  y: number
  contents: {
    gold: number
    items: Item[]
  }
  isOpen: boolean
}

interface GameState {
  player: Character
  enemies: Enemy[]
  chests: ChestContents[]
  addGold: (amount: number) => void
  movePlayer: (x: number, y: number) => void
  damageEnemy: (enemyId: string, amount: number) => void
  healPlayer: (amount: number) => void
  levelUp: () => void
  learnSpell: (spell: Spell) => void
  addItemToInventory: (item: Item) => void
  removeItemFromInventory: (itemId: string) => void
  removeEnemy: (enemyId: string) => void
  chestContents: ChestContents | null
  setChestContents: React.Dispatch<React.SetStateAction<ChestContents | null>>
  wizardDefeated: boolean
  setWizardDefeated: React.Dispatch<React.SetStateAction<boolean>>
}

// Create the context
const GameStateContext = createContext<GameState | undefined>(undefined)

// Create a provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Character>({
    x: 0,
    y: 0,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    gold: 0,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    class: "Warrior",
    knownSpells: [],
    inventory: [],
  })

  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: "goblin1", x: 5, y: 5, health: 30, attack: 5, defense: 2, goldValue: 10 },
    { id: "orc1", x: 10, y: 10, health: 50, attack: 8, defense: 4, goldValue: 20 },
    {
      id: "wizard1",
      x: 15,
      y: 15,
      health: 75,
      attack: 12,
      defense: 6,
      goldValue: 50,
      isWizard: true,
      spellLoot: [
        { id: "fireball", name: "Fireball", description: "A ball of fire", damage: 20, manaCost: 10 },
        {
          id: "icebolt",
          name: "Ice Bolt",
          description: "A bolt of ice",
          damage: 15,
          manaCost: 8,
          classRestriction: ["Mage"],
        },
      ],
    },
  ])

  const [chests, setChests] = useState<ChestContents[]>([])
  const [chestContents, setChestContents] = useState<ChestContents | null>(null)

  // Add a new state variable to track if the wizard has been defeated
  const [wizardDefeated, setWizardDefeated] = useState(false)

  const addGold = useCallback((amount: number) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, gold: prevPlayer.gold + amount }))
  }, [])

  const movePlayer = useCallback((x: number, y: number) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, x, y }))
  }, [])

  const damageEnemy = useCallback(
    (enemyId: string, amount: number) => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          if (enemy.id === enemyId) {
            const newHealth = enemy.health - amount
            return { ...enemy, health: newHealth }
          }
          return enemy
        }),
      )

      setEnemies((prevEnemies) => {
        const enemy = prevEnemies.find((e) => e.id === enemyId)
        if (enemy && enemy.health - amount <= 0) {
          // Special handling for wizard
          if (enemy.isWizard && enemy.health - amount <= 0) {
            // Wizard is defeated
            setWizardDefeated(true)

            // Create a chest at the player's position with gold
            setChestContents({
              x: player.x,
              y: player.y,
              contents: {
                gold: enemy.goldValue,
                items: [], // No physical items
              },
              isOpen: false,
            })

            // Teach the player all the wizard's spells that are appropriate for their class
            if (enemy.spellLoot) {
              enemy.spellLoot.forEach((spell) => {
                if (!spell.classRestriction || spell.classRestriction.includes(player.class)) {
                  if (!player.knownSpells.some((s) => s.id === spell.id)) {
                    learnSpell(spell)
                  }
                }
              })
            }

            // Show a message
            console.log("You've defeated the wizard! You've learned new spells!")
          }

          return prevEnemies.filter((enemy) => enemy.id !== enemyId)
        }
        return prevEnemies
      })
    },
    [player, setWizardDefeated, setChestContents, learnSpell],
  )

  const healPlayer = useCallback((amount: number) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, health: Math.min(prevPlayer.health + amount, prevPlayer.maxHealth) }))
  }, [])

  const levelUp = useCallback(() => {
    setPlayer((prevPlayer) => {
      const newLevel = prevPlayer.level + 1
      const newMaxHealth = prevPlayer.maxHealth + 20
      const newAttack = prevPlayer.attack + 5
      const newDefense = prevPlayer.defense + 2
      const newExperienceToNextLevel = prevPlayer.experienceToNextLevel * 2

      return {
        ...prevPlayer,
        level: newLevel,
        maxHealth: newMaxHealth,
        health: newMaxHealth, // Fully heal on level up
        attack: newAttack,
        defense: newDefense,
        experience: 0,
        experienceToNextLevel: newExperienceToNextLevel,
      }
    })
  }, [])

  const learnSpell = useCallback((spell: Spell) => {
    setPlayer((prevPlayer) => {
      if (prevPlayer.knownSpells.some((s) => s.id === spell.id)) {
        return prevPlayer // Don't learn the same spell twice
      }
      return { ...prevPlayer, knownSpells: [...prevPlayer.knownSpells, spell] }
    })
  }, [])

  const addItemToInventory = useCallback((item: Item) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, inventory: [...prevPlayer.inventory, item] }))
  }, [])

  const removeItemFromInventory = useCallback((itemId: string) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, inventory: prevPlayer.inventory.filter((item) => item.id !== itemId) }))
  }, [])

  const removeEnemy = useCallback((enemyId: string) => {
    setEnemies((prevEnemies) => prevEnemies.filter((enemy) => enemy.id !== enemyId))
  }, [])

  const value: GameState = {
    player,
    enemies,
    chests,
    addGold,
    movePlayer,
    damageEnemy,
    healPlayer,
    levelUp,
    learnSpell,
    addItemToInventory,
    removeItemFromInventory,
    removeEnemy,
    chestContents,
    setChestContents,
    wizardDefeated,
    setWizardDefeated,
  }

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
}

// Create a custom hook to use the context
export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider")
  }
  return context
}

