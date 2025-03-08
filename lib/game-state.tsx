"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useCallback, useMemo, useRef } from "react"
import type { Player, Enemy, Item, MapTile, Spell, CharacterClass, GameState } from "./types"
import { generateDungeon } from "./generators"
import { getSpellsForLevel } from "./spells"
import { v4 as uuidv4 } from "uuid"
import { potions, getAllWeapons, getAllArmor, getAllAccessories } from "./items"
import { getBossLoot } from "./boss-loot"
import { shopItems } from "./shop-items"
import {
  type CodexEntry,
  generateAllCodexEntries,
  markItemDiscovered,
  markEnemyTypeDiscovered,
  markLocationDiscovered,
  markSpellDiscovered,
} from "./codex-data"
import { loadGameData } from "./local-storage"

// Add this function near the top of the file, outside of the GameStateProvider component
const playLevelUpSound = () => {
  // We'll use the audio system instead of direct audio element creation
  if (typeof window !== "undefined") {
    // This will be handled by the audio system
    const event = new CustomEvent("levelUp")
    document.dispatchEvent(event)
  }
}

interface GameStateContextType {
  player: Player
  currentMap: MapTile[][]
  enemies: Enemy[]
  inCombat: boolean
  activeEnemy: Enemy | null
  gameState: GameState
  chestContents: {
    x: number
    y: number
    contents: {
      gold?: number
      items?: Item[]
    }
    isOpen: boolean
  }
  showShop: boolean
  showWizardShop: boolean
  bossDefeated: boolean
  gameOver: boolean
  restartGame: () => void
  showClassSelection: boolean
  handleClassSelection: (selectedClass: CharacterClass) => void
  levelShopInventory: Map<number, Item[]>
  applyPermanentUpgrades: (upgrades: {
    health: number
    attack: number
    defense: number
    magic: number
    dodge: number
    mana: number
    criticalHit: number
    luck: number
  }) => void

  movePlayer: (dx: number, dy: number) => void
  damagePlayer: (amount: number) => void
  damageEnemy: (id: number, amount: number) => void
  setInCombat: (inCombat: boolean) => void
  setActiveEnemy: (enemy: Enemy | null) => void
  addToInventory: (item: Item) => boolean
  removeFromInventory: (item: Item) => void
  equipItem: (item: Item) => boolean
  useItem: (item: Item) => boolean
  addGold: (amount: number) => void
  addExperience: (amount: number) => void
  learnSpell: (spell: Spell) => boolean
  castSpell: (spell: Spell, targetId?: number) => boolean
  increaseAttribute: (
    attribute: "health" | "attack" | "defense" | "magic" | "dodge" | "mana" | "criticalHit" | "luck",
  ) => boolean
  goToNextLevel: () => void
  closeChest: () => void
  takeGoldFromChest: () => void
  takeItemFromChest: (item: Item) => void
  setShowShop: (show: boolean) => void
  setShowWizardShop: (show: boolean) => void
  sellItem: (item: Item) => void

  // Add codex-related properties
  codexEntries: CodexEntry[]
  showCodex: boolean
  setShowCodex: (show: boolean) => void
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined)

const VIEWPORT_WIDTH = 15
const VIEWPORT_HEIGHT = 15

// Throttle function with leading edge execution
const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout
  let lastRan: number
  return function (this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan),
      )
    }
  }
}

// Batch update function for map changes
const batchUpdateMap = (updates: { x: number; y: number; tile: MapTile }[], currentMap: MapTile[][]): MapTile[][] => {
  const newMap = [...currentMap]
  const modifiedRows = new Set<number>()

  updates.forEach(({ x, y, tile }) => {
    if (!modifiedRows.has(y)) {
      newMap[y] = [...newMap[y]]
      modifiedRows.add(y)
    }
    newMap[y][x] = tile
  })

  return newMap
}

// Optimize visible tiles calculation
const calculateVisibleTiles = (
  playerX: number,
  playerY: number,
  viewDistance: number,
  mapWidth: number,
  mapHeight: number,
): Set<string> => {
  const visibleTiles = new Set<string>()
  const viewDistanceSquared = viewDistance * viewDistance

  const minX = Math.max(0, playerX - viewDistance)
  const maxX = Math.min(mapWidth - 1, playerX + viewDistance)
  const minY = Math.max(0, playerY - viewDistance)
  const maxY = Math.min(mapHeight - 1, playerY + viewDistance)

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - playerX
      const dy = y - playerY
      if (dx * dx + dy * dy <= viewDistanceSquared) {
        visibleTiles.add(`${x},${y}`)
      }
    }
  }

  return visibleTiles
}

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  // Initialize player class
  const [playerClass, setPlayerClass] = useState<CharacterClass>("warrior")

  // Add a new state for class selection
  const [showClassSelection, setShowClassSelection] = useState(true)

  // Initialize dungeon level
  const [dungeonLevel, setDungeonLevel] = useState(1)

  // Generate initial dungeon
  const [dungeonData, setDungeonData] = useState(() => generateDungeon(40, 30, dungeonLevel))

  // Initialize map
  const [currentMap, setCurrentMap] = useState<MapTile[][]>(dungeonData.map)

  // Initialize enemies
  const [enemies, setEnemies] = useState<Enemy[]>(dungeonData.enemies)

  // Add game over state
  const [gameOver, setGameOver] = useState(false)

  // Initialize codex entries
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>(() => {
    // Try to load from localStorage
    if (typeof window !== "undefined") {
      const savedCodex = localStorage.getItem("codexEntries")
      if (savedCodex) {
        try {
          return JSON.parse(savedCodex)
        } catch (e) {
          console.error("Failed to parse saved codex entries", e)
        }
      }
    }
    return generateAllCodexEntries()
  })

  // Add codex visibility state
  const [showCodex, setShowCodex] = useState(false)

  // Save codex entries to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("codexEntries", JSON.stringify(codexEntries))
    }
  }, [codexEntries])

  // Initialize player with base stats
  const [player, setPlayer] = useState<Player>({
    name: "Hero",
    class: playerClass,
    level: 1,
    experience: 0,
    health: 50,
    maxHealth: 50,
    mana: 30,
    maxMana: 30,
    attack: 5,
    defense: 3,
    magic: 2,
    dodge: 1, // Changed from stealth to dodge
    criticalHit: 5, // 5% base critical hit chance
    luck: 5, // 5% base luck
    baseAttack: 5,
    baseDefense: 3,
    baseMagic: 2,
    baseDodge: 1, // Changed from baseStealth to baseDodge
    baseCriticalHit: 5,
    baseLuck: 5,
    x: dungeonData.playerStart.x,
    y: dungeonData.playerStart.y,
    inventory: [
      {
        id: uuidv4(),
        name: "Health Potion",
        type: "potion",
        value: 10,
        rarity: "common",
        health: 20,
        description: "Restores 20 health points",
      },
      {
        id: uuidv4(),
        name: "Leather Armor",
        type: "armor",
        value: 25,
        rarity: "common",
        defense: 3,
        description: "Basic leather armor that provides minimal protection",
      },
      {
        id: uuidv4(),
        name: "Iron Sword",
        type: "weapon",
        value: 25,
        rarity: "common",
        attack: 3,
        description: "A basic iron sword",
      },
    ],
    gold: 50,
    skillPoints: 0,
    knownSpells: getSpellsForLevel(playerClass, 1),
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
    },
  })

  // Combat state
  const [inCombat, setInCombat] = useState(false)
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null)

  // Camera and viewport state
  const [gameState, setGameState] = useState<GameState>({
    dungeonLevel: 1,
    playerPosition: { x: dungeonData.playerStart.x, y: dungeonData.playerStart.y },
    cameraPosition: { x: dungeonData.playerStart.x, y: dungeonData.playerStart.y },
    visibleTiles: new Set<string>(),
  })

  // Add chest contents state
  const [chestContents, setChestContents] = useState<{
    x: number
    y: number
    contents: {
      gold?: number
      items?: Item[]
    }
    isOpen: boolean
  }>({
    x: 0,
    y: 0,
    contents: {},
    isOpen: false,
  })

  // Add a map to store chest contents by position
  const [chestContentsMap, setChestContentsMap] = useState<
    Map<
      string,
      {
        gold?: number
        items?: Item[]
      }
    >
  >(new Map())

  // Add state to store level-specific shop inventory
  const [levelShopInventory, setLevelShopInventory] = useState<Map<number, Item[]>>(new Map())

  // Add a new state to track used shrines
  const [usedShrines, setUsedShrines] = useState<Set<string>>(new Set())

  // Add function to apply permanent upgrades
  const applyPermanentUpgrades = useCallback(
    (upgrades: {
      health: number
      attack: number
      defense: number
      magic: number
      dodge: number
      mana: number
      criticalHit: number
      luck: number
    }) => {
      setPlayer((prev) => {
        // Calculate bonuses
        const healthBonus = upgrades.health * 10
        const attackBonus = upgrades.attack
        const defenseBonus = upgrades.defense
        const magicBonus = upgrades.magic
        const dodgeBonus = upgrades.dodge
        const manaBonus = upgrades.mana * 10
        const criticalHitBonus = upgrades.criticalHit * 2
        const luckBonus = upgrades.luck * 2

        // Create new player with updated stats
        return {
          ...prev,
          maxHealth: prev.maxHealth + healthBonus,
          health: Math.min(prev.health + healthBonus, prev.maxHealth + healthBonus),
          baseAttack: (prev.baseAttack || prev.attack) + attackBonus,
          attack: prev.attack + attackBonus,
          baseDefense: (prev.baseDefense || prev.defense) + defenseBonus,
          defense: prev.defense + defenseBonus,
          baseMagic: (prev.baseMagic || prev.magic) + magicBonus,
          magic: prev.magic + magicBonus,
          baseDodge: (prev.baseDodge || prev.dodge) + dodgeBonus,
          dodge: prev.dodge + dodgeBonus,
          maxMana: prev.maxMana + manaBonus,
          mana: Math.min(prev.mana + manaBonus, prev.maxMana + manaBonus),
          baseCriticalHit: (prev.baseCriticalHit || prev.criticalHit) + criticalHitBonus,
          criticalHit: prev.criticalHit + criticalHitBonus,
          baseLuck: (prev.baseLuck || prev.luck) + luckBonus,
        }
      })
    },
    [],
  )

  // Add function to take gold from chest
  const addGold = useCallback((amount: number) => {
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + amount,
    }))
  }, [])

  // Also need to declare goToNextLevel before movePlayer
  const goToNextLevel = useCallback(() => {
    // Increase dungeon level
    const newDungeonLevel = dungeonLevel + 1
    setDungeonLevel(newDungeonLevel)

    // Calculate new dungeon size based on level
    const baseSize = 40
    const sizeIncrease = 5 * Math.min(5, newDungeonLevel - 1) // Cap size increase at level 6
    const newSize = baseSize + sizeIncrease

    // Generate new dungeon
    const newDungeonData = generateDungeon(newSize, newSize, newDungeonLevel)
    setDungeonData(newDungeonData)

    // Update map and enemies
    setCurrentMap(newDungeonData.map)
    setEnemies(newDungeonData.enemies)

    // Move player to start position
    setPlayer((prev) => ({
      ...prev,
      x: newDungeonData.playerStart.x,
      y: newDungeonData.playerStart.y,
    }))

    // Update game state
    setGameState((prev) => ({
      ...prev,
      dungeonLevel: newDungeonLevel,
      playerPosition: { x: newDungeonData.playerStart.x, y: newDungeonData.playerStart.y },
      cameraPosition: { x: newDungeonData.playerStart.x, y: newDungeonData.playerStart.y },
      visibleTiles: new Set<string>(),
    }))

    // End combat if in combat
    setInCombat(false)
    setActiveEnemy(null)

    // Close chest if open
    if (chestContents.isOpen) {
      setChestContents((prev) => ({
        ...prev,
        isOpen: false,
      }))
    }

    // Reset boss defeated state for the new level
    setBossDefeated(false)

    // Reset used shrines for the new level
    setUsedShrines(new Set())
  }, [dungeonLevel, chestContents.isOpen])

  // Handle opening a chest - moved up to avoid circular dependency
  const handleChest = useCallback(
    (x: number, y: number) => {
      // Mark chest location as discovered in codex
      setCodexEntries((prevEntries) => markLocationDiscovered(prevEntries, "chest"))

      const positionKey = `${x},${y}`

      // Check if we already have contents for this chest
      if (chestContentsMap.has(positionKey)) {
        // Use existing chest contents
        const existingContents = chestContentsMap.get(positionKey)
        setChestContents({
          x,
          y,
          contents: existingContents || {},
          isOpen: true,
        })
        return
      }

      // Generate random loot for a new chest
      const lootTypes = ["gold", "item", "gold"]
      const lootType = lootTypes[Math.floor(Math.random() * lootTypes.length)]

      const chestContents: {
        gold?: number
        items?: Item[]
      } = {}

      if (lootType === "gold") {
        const goldAmount = 10 + Math.floor(Math.random() * 20) * dungeonLevel
        chestContents.gold = goldAmount
      } else {
        // Generate 1-3 random items based on dungeon level
        const itemCount = 1 + Math.floor(Math.random() * 3)
        const possibleItems: Item[] = []

        // Add potions
        possibleItems.push(...potions.slice(0, Math.min(potions.length, 5)))

        // Add weapons based on dungeon level
        if (dungeonLevel >= 1) {
          const availableWeapons = getAllWeapons().filter(
            (item) => !item.levelRequirement || item.levelRequirement <= dungeonLevel + 2,
          )
          possibleItems.push(...availableWeapons.slice(0, Math.min(availableWeapons.length, 5)))
        }

        // Add armor based on dungeon level
        if (dungeonLevel >= 1) {
          const availableArmor = getAllArmor().filter(
            (item) => !item.levelRequirement || item.levelRequirement <= dungeonLevel + 2,
          )
          possibleItems.push(...availableArmor.slice(0, Math.min(availableArmor.length, 5)))
        }

        // Add accessories based on dungeon level
        if (dungeonLevel >= 2) {
          const availableAccessories = getAllAccessories().filter(
            (item) => !item.levelRequirement || item.levelRequirement <= dungeonLevel + 2,
          )
          possibleItems.push(...availableAccessories.slice(0, Math.min(availableAccessories.length, 5)))
        }

        // Select random items
        const chestItems: Item[] = []
        for (let i = 0; i < itemCount; i++) {
          if (possibleItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleItems.length)
            const selectedItem = {
              ...possibleItems[randomIndex],
              id: uuidv4(), // Ensure unique ID
            }
            chestItems.push(selectedItem)
            // Remove the item to avoid duplicates
            possibleItems.splice(randomIndex, 1)
          }
        }

        chestContents.items = chestItems
      }

      // Store the chest contents in the map
      setChestContentsMap((prev) => {
        const newMap = new Map(prev)
        newMap.set(positionKey, chestContents)
        return newMap
      })

      // Set chest contents in state
      setChestContents({
        x,
        y,
        contents: chestContents,
        isOpen: true,
      })
    },
    [chestContentsMap, dungeonLevel],
  )

  // Use these optimizations in the updateVisibleTiles function
  const updateVisibleTiles = useCallback(() => {
    const viewDistance = 5
    const visibleTiles = calculateVisibleTiles(
      player.x,
      player.y,
      viewDistance,
      currentMap[0].length,
      currentMap.length,
    )

    const tilesToUpdate: { x: number; y: number; tile: MapTile }[] = []

    visibleTiles.forEach((pos) => {
      const [x, y] = pos.split(",").map(Number)
      if (!currentMap[y][x].explored) {
        // Mark this location type as discovered in the codex
        setCodexEntries((prevEntries) => markLocationDiscovered(prevEntries, currentMap[y][x].type))

        tilesToUpdate.push({
          x,
          y,
          tile: { ...currentMap[y][x], explored: true },
        })
      }
    })

    if (tilesToUpdate.length > 0) {
      setCurrentMap((prevMap) => batchUpdateMap(tilesToUpdate, prevMap))
    }

    setGameState((prev) => ({
      ...prev,
      visibleTiles,
      playerPosition: { x: player.x, y: player.y },
    }))
  }, [player.x, player.y, currentMap])

  // Create a throttled version of updateVisibleTiles
  const throttledUpdateVisibleTiles = useCallback(throttle(updateVisibleTiles, 100), [updateVisibleTiles])

  // Update visible tiles when player moves
  useEffect(() => {
    throttledUpdateVisibleTiles()
  }, [player.x, player.y, throttledUpdateVisibleTiles])

  // Update camera position to follow player - optimized
  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      cameraPosition: {
        x: Math.max(
          Math.min(player.x, currentMap[0].length - Math.floor(VIEWPORT_WIDTH / 2)),
          Math.floor(VIEWPORT_WIDTH / 2),
        ),
        y: Math.max(
          Math.min(player.y, currentMap.length - Math.floor(VIEWPORT_HEIGHT / 2)),
          Math.floor(VIEWPORT_HEIGHT / 2),
        ),
      },
    }))
  }, [player.x, player.y, currentMap])

  // Add a function to cap dodge at 80% when calculating player stats

  // Find the calculatePlayerStats function and modify it to cap dodge at 80%
  // Look for something like:
  // Modify it to cap dodge at 80%:
  const calculatePlayerStats = useCallback((playerState: Player) => {
    const baseAttack = playerState.baseAttack || playerState.attack
    const baseDefense = playerState.baseDefense || playerState.defense
    const baseMagic = playerState.baseMagic || playerState.magic
    const baseDodge = playerState.baseDodge || playerState.dodge
    const baseCriticalHit = playerState.baseCriticalHit || playerState.criticalHit
    const baseLuck = playerState.baseLuck || playerState.luck

    let totalAttack = baseAttack
    let totalDefense = baseDefense
    let totalMagic = baseMagic
    let totalDodge = baseDodge
    let totalCriticalHit = baseCriticalHit
    let totalLuck = baseLuck

    // Add weapon bonuses
    if (playerState.equipment.weapon) {
      totalAttack += playerState.equipment.weapon.attack || 0
      totalDefense += playerState.equipment.weapon.defense || 0
      totalMagic += playerState.equipment.weapon.magic || 0
      totalDodge += playerState.equipment.weapon.dodge || 0
      totalCriticalHit += playerState.equipment.weapon.criticalHit || 0
      totalLuck += playerState.equipment.weapon.luck || 0
    }

    // Add armor bonuses
    if (playerState.equipment.armor) {
      totalAttack += playerState.equipment.armor.attack || 0
      totalDefense += playerState.equipment.armor.defense || 0
      totalMagic += playerState.equipment.armor.magic || 0
      totalDodge += playerState.equipment.armor.dodge || 0
      totalCriticalHit += playerState.equipment.armor.criticalHit || 0
      totalLuck += playerState.equipment.armor.luck || 0
    }

    // Add accessory bonuses
    if (playerState.equipment.accessory) {
      totalAttack += playerState.equipment.accessory.attack || 0
      totalDefense += playerState.equipment.accessory.defense || 0
      totalMagic += playerState.equipment.accessory.magic || 0
      totalDodge += playerState.equipment.accessory.dodge || 0
      totalCriticalHit += playerState.equipment.accessory.criticalHit || 0
      totalLuck += playerState.equipment.accessory.luck || 0
    }

    // Cap dodge at 80%
    totalDodge = Math.min(totalDodge, 80)

    return {
      attack: totalAttack,
      defense: totalDefense,
      magic: totalMagic,
      dodge: totalDodge,
      criticalHit: totalCriticalHit,
      luck: totalLuck,
    }
  }, [])

  // Use a ref to track equipment changes to avoid infinite loops
  const prevEquipmentRef = useRef(player.equipment)

  // Apply equipment stats to player for combat
  useEffect(() => {
    // Check if equipment has changed to avoid unnecessary updates
    const equipmentChanged =
      prevEquipmentRef.current.weapon?.id !== player.equipment.weapon?.id ||
      prevEquipmentRef.current.armor?.id !== player.equipment.armor?.id ||
      prevEquipmentRef.current.accessory?.id !== player.equipment.accessory?.id

    if (equipmentChanged) {
      const stats = calculatePlayerStats(player)

      setPlayer((prev) => ({
        ...prev,
        attack: stats.attack,
        defense: stats.defense,
        magic: stats.magic,
        dodge: stats.dodge,
        criticalHit: stats.criticalHit,
        luck: stats.luck,
      }))

      // Update the ref
      prevEquipmentRef.current = player.equipment
    }
  }, [player, player.equipment, calculatePlayerStats])

  // Damage player
  const damagePlayer = useCallback(
    (amount: number) => {
      setPlayer((prev) => {
        const newHealth = Math.max(0, prev.health - amount)

        // Check if player died
        if (newHealth <= 0 && !gameOver) {
          setGameOver(true)
        }

        return {
          ...prev,
          health: newHealth,
        }
      })
    },
    [gameOver],
  )

  // Add boss defeated state
  const [bossDefeated, setBossDefeated] = useState(false)

  // Add shop visibility state
  const [showShop, setShowShop] = useState(false)

  // Add wizard shop visibility state
  const [showWizardShop, setShowWizardShop] = useState(false)

  // Add handling for new tile types in the movePlayer function
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (inCombat || gameOver) return // Can't move during combat or game over

      const newX = player.x + dx
      const newY = player.y + dy

      // Check if the new position is valid
      if (newX >= 0 && newX < currentMap[0].length && newY >= 0 && newY < currentMap.length) {
        const tileType = currentMap[newY][newX].type

        // Mark this location type as discovered in the codex
        setCodexEntries((prevEntries) => markLocationDiscovered(prevEntries, tileType))

        if (
          tileType === "floor" ||
          tileType === "door" ||
          tileType === "chest" ||
          tileType === "shop" ||
          tileType === "wizard" ||
          tileType === "shrine" ||
          tileType === "boss" ||
          tileType === "portal"
        ) {
          // Check for enemy at the new position - FIXED: was checking (newX, newX) instead of (newX, newY)
          const enemyAtPosition = enemies.find((e) => e.x === newX && e.y === newY && e.health > 0)

          if (enemyAtPosition) {
            // Mark this enemy type as discovered in the codex
            setCodexEntries((prevEntries) => markEnemyTypeDiscovered(prevEntries, enemyAtPosition.race))

            // Start combat
            setInCombat(true)
            setActiveEnemy(enemyAtPosition)
          } else {
            // Move player
            setPlayer((prev) => ({ ...prev, x: newX, y: newY }))

            // Handle special tiles
            if (tileType === "chest") {
              handleChest(newX, newY)
            } else if (tileType === "shop") {
              // Check if we already have shop inventory for this level
              if (!levelShopInventory.has(dungeonLevel)) {
                // Generate shop inventory for this level
                const availableItems = shopItems.filter(
                  (item) => !item.levelRequirement || item.levelRequirement <= dungeonLevel,
                )

                // Add some randomness but keep it consistent for the level
                const levelSeed = dungeonLevel * 1000 + Math.floor(Math.random() * 1000)
                const pseudoRandom = (n: number) => ((levelSeed * n) % 10000) / 10000

                // Select 8-12 items for the shop
                const itemCount = 8 + Math.floor(pseudoRandom(1) * 5)
                const shopInventory: Item[] = []

                for (let i = 0; i < itemCount && availableItems.length > 0; i++) {
                  const index = Math.floor(pseudoRandom(i + 1) * availableItems.length)
                  shopInventory.push({
                    ...availableItems[index],
                    id: uuidv4(), // Ensure unique ID
                  })
                  availableItems.splice(index, 1)
                }

                // Store the inventory for this level
                setLevelShopInventory((prev) => {
                  const newMap = new Map(prev)
                  newMap.set(dungeonLevel, shopInventory)
                  return newMap
                })
              }

              // Open shop
              setShowShop(true)
            } else if (tileType === "wizard") {
              // Open wizard shop
              setShowWizardShop(true)
            } else if (tileType === "shrine") {
              // Heal player at shrine and convert to floor
              setPlayer((prev) => ({
                ...prev,
                health: prev.maxHealth,
                mana: prev.maxMana,
              }))

              // Convert shrine to floor
              setCurrentMap((prevMap) => {
                const updatedMap = [...prevMap]
                updatedMap[newY] = [...updatedMap[newY]]
                updatedMap[newY][newX] = {
                  type: "floor",
                  explored: true,
                }
                return updatedMap
              })
            } else if (tileType === "boss") {
              // Handle boss encounter
              const bossEnemy = enemies.find((e) => e.x === newX && e.y === newY && e.isBoss)
              if (bossEnemy) {
                // Mark this enemy type as discovered in the codex
                setCodexEntries((prevEntries) => markEnemyTypeDiscovered(prevEntries, bossEnemy.race))

                setInCombat(true)
                setActiveEnemy(bossEnemy)
              }
            } else if (tileType === "portal") {
              // Go to next level when stepping on portal
              goToNextLevel()
            }
          }
        }
      }
    },
    [
      player,
      currentMap,
      enemies,
      inCombat,
      gameOver,
      handleChest,
      setShowShop,
      setShowWizardShop,
      goToNextLevel,
      levelShopInventory,
      dungeonLevel,
      usedShrines,
    ],
  )

  // Add a function to handle enemy reset after fleeing
  // Reset enemy health when player moves away
  const resetEnemyHealth = useCallback((enemyId: number) => {
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.id === enemyId) {
          return { ...enemy, health: enemy.maxHealth }
        }
        return enemy
      }),
    )
  }, [])

  // Add function to close chest
  const closeChest = useCallback(() => {
    // Check if chest is empty
    const isChestEmpty =
      (!chestContents.contents.gold || chestContents.contents.gold <= 0) &&
      (!chestContents.contents.items || chestContents.contents.items.length === 0)

    // Only convert chest to floor if it's empty
    if (isChestEmpty) {
      setCurrentMap((prevMap) => {
        const updatedMap = [...prevMap]
        updatedMap[chestContents.y] = [...updatedMap[chestContents.y]]
        updatedMap[chestContents.y][chestContents.x] = { type: "floor", explored: true }
        return updatedMap
      })
    }

    // Close chest modal
    setChestContents((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [chestContents])

  // Add function to take gold from chest
  const takeGoldFromChest = useCallback(() => {
    if (chestContents.contents.gold) {
      addGold(chestContents.contents.gold)

      // Remove gold from chest in the map
      const positionKey = `${chestContents.x},${chestContents.y}`
      setChestContentsMap((prev) => {
        const newMap = new Map(prev)
        const currentContents = newMap.get(positionKey) || {}
        newMap.set(positionKey, {
          ...currentContents,
          gold: undefined,
        })
        return newMap
      })

      // Remove gold from current chest contents
      setChestContents((prev) => ({
        ...prev,
        contents: {
          ...prev.contents,
          gold: undefined,
        },
      }))
    }
  }, [chestContents, addGold])

  const addToInventory = useCallback(
    (item: Item) => {
      if (player.inventory.length >= 20) return false

      // Mark this item as discovered in the codex
      setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))

      setPlayer((prev) => {
        const newInventory = [...prev.inventory, item]
        return { ...prev, inventory: newInventory }
      })
      return true
    },
    [player.inventory.length],
  )

  const removeFromInventory = useCallback((item: Item) => {
    setPlayer((prev) => {
      // If item is equipped, unequip it first
      const newEquipment = { ...prev.equipment }
      if (item.type === "weapon" && prev.equipment.weapon?.id === item.id) {
        newEquipment.weapon = null
      } else if (item.type === "armor" && prev.equipment.armor?.id === item.id) {
        newEquipment.armor = null
      } else if (item.type === "accessory" && prev.equipment.accessory?.id === item.id) {
        newEquipment.accessory = null
      }

      const newInventory = prev.inventory.filter((i) => i.id !== item.id)
      return {
        ...prev,
        inventory: newInventory,
        equipment: newEquipment,
      }
    })
  }, [])

  // Fixed equipItem function
  const equipItem = useCallback(
    (item: Item) => {
      if (!canEquipItem(item, player)) return false

      // Mark this item as discovered in the codex
      setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))

      setPlayer((prev) => {
        // Create a copy of the equipment
        const newEquipment = { ...prev.equipment }

        // Set the new item in the appropriate slot
        if (item.type === "weapon") {
          newEquipment.weapon = item
        } else if (item.type === "armor") {
          newEquipment.armor = item
        } else if (item.type === "accessory") {
          newEquipment.accessory = item
        }

        // Calculate new stats with the equipment
        const stats = calculatePlayerStats({
          ...prev,
          equipment: newEquipment,
        })

        return {
          ...prev,
          equipment: newEquipment,
          attack: stats.attack,
          defense: stats.defense,
          magic: stats.magic,
          dodge: stats.dodge,
          criticalHit: stats.criticalHit,
          luck: stats.luck,
        }
      })

      return true
    },
    [player, calculatePlayerStats],
  )

  // Helper function to check if an item can be equipped
  const canEquipItem = (item: Item, player: Player) => {
    return (
      (item.type === "weapon" || item.type === "armor" || item.type === "accessory") &&
      (!item.classRestriction || item.classRestriction.includes(player.class)) &&
      (!item.levelRequirement || player.level >= item.levelRequirement)
    )
  }

  const useItem = useCallback(
    (item: Item) => {
      if (item.type === "potion") {
        // Mark this item as discovered in the codex
        setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))

        setPlayer((prev) => {
          // Create a new player object with updated stats
          const newPlayer = { ...prev }

          // Apply health and mana effects
          if (item.health) {
            newPlayer.health = Math.min(prev.maxHealth, prev.health + item.health)
          }

          if (item.mana) {
            newPlayer.mana = Math.min(prev.maxMana, prev.mana + item.mana)
          }

          // Apply temporary stat effects
          if (item.effect) {
            // Parse the effect string to determine what stats to modify
            if (item.effect.includes("Increases all stats")) {
              // For potions that increase all stats
              const amount = Number.parseInt(item.effect.match(/\d+/)?.[0] || "3")
              newPlayer.attack += amount
              newPlayer.defense += amount
              newPlayer.magic += amount
              newPlayer.dodge += amount
              newPlayer.criticalHit += amount
              newPlayer.luck += amount

              // Log the effect
              console.log(`Applied +${amount} to all stats from ${item.name}`)
            } else if (item.effect.includes("attack")) {
              // For potions that increase attack
              const match = item.effect.match(/Increases attack by (\d+)/)
              if (match && match[1]) {
                const amount = Number.parseInt(match[1])
                newPlayer.attack += amount
                console.log(`Applied +${amount} to attack from ${item.name}`)
              }
            } else if (item.effect.includes("defense")) {
              // For potions that increase defense
              const match = item.effect.match(/Increases defense by (\d+)/)
              if (match && match[1]) {
                const amount = Number.parseInt(match[1])
                newPlayer.defense += amount
                console.log(`Applied +${amount} to defense from ${item.name}`)
              }
            } else if (item.effect.includes("magic")) {
              // For potions that increase magic
              const match = item.effect.match(/Increases magic by (\d+)/)
              if (match && match[1]) {
                const amount = Number.parseInt(match[1])
                newPlayer.magic += amount
                console.log(`Applied +${amount} to magic from ${item.name}`)
              }
            } else if (item.effect.includes("dodge")) {
              // For potions that increase dodge
              const match = item.effect.match(/Increases dodge by (\d+)/)
              if (match && match[1]) {
                const amount = Number.parseInt(match[1])
                newPlayer.dodge += amount
                console.log(`Applied +${amount} to dodge from ${item.name}`)
              }
            }
            // Add more effect parsing as needed
          }

          return newPlayer
        })

        removeFromInventory(item)
        return true
      }
      return false
    },
    [removeFromInventory],
  )

  // Then find the addExperience function and update it:
  const addExperience = useCallback((amount: number) => {
    setPlayer((prev) => {
      let newExperience = prev.experience + amount
      let newLevel = prev.level
      let newSkillPoints = prev.skillPoints
      let didLevelUp = false

      while (newExperience >= getExperienceForLevel(newLevel)) {
        newExperience -= getExperienceForLevel(newLevel)
        newLevel++
        newSkillPoints++
        didLevelUp = true
      }

      // Play level up sound if player leveled up
      if (didLevelUp) {
        playLevelUpSound()
      }

      return { ...prev, experience: newExperience, level: newLevel, skillPoints: newSkillPoints }
    })
  }, [])

  const getExperienceForLevel = (level: number) => {
    return level * level * 50
  }

  // Update the learnSpell function to limit spells for non-mage classes
  const learnSpell = useCallback((spell: Spell) => {
    // Mark this spell as discovered in the codex
    setCodexEntries((prevEntries) => markSpellDiscovered(prevEntries, spell))

    setPlayer((prev) => {
      // For non-mage classes, limit to 2 spells
      if (prev.class !== "mage" && prev.knownSpells.length >= 2) {
        // If already at the limit, replace the oldest spell
        const newSpells = [...prev.knownSpells.slice(1), spell]
        return { ...prev, knownSpells: newSpells }
      } else {
        // For mages or if under the limit, just add the spell
        const newSpells = [...prev.knownSpells, spell]
        return { ...prev, knownSpells: newSpells }
      }
    })
    return true
  }, [])

  // Handle boss loot drops
  const handleBossLoot = useCallback(
    (enemy: Enemy) => {
      // Get boss loot based on dungeon level
      const bossLoot = getBossLoot(dungeonLevel, enemy.name)

      // Add special loot to player's inventory
      if (bossLoot && bossLoot.length > 0) {
        bossLoot.forEach((item) => {
          const added = addToInventory(item)
          if (!added) {
            // If inventory is full, drop the item at the boss's location
            // This could be implemented with a "dropped items" system in the future
            console.log("Inventory full, boss item not collected:", item.name)
          }
        })
      }

      // Add extra gold and experience for boss defeat
      const bossGoldBonus = dungeonLevel * 50
      const bossExpBonus = dungeonLevel * 75

      addGold(bossGoldBonus)
      addExperience(bossExpBonus)

      return bossLoot
    },
    [dungeonLevel, addToInventory, addGold, addExperience],
  )

  const damageEnemy = useCallback(
    (id: number, amount: number) => {
      setEnemies((prev) => {
        const updatedEnemies = prev.map((enemy) => {
          if (enemy.id === id) {
            const newHealth = Math.max(0, enemy.health - amount)

            // Check if this was a boss and it was defeated
            if (enemy.isBoss && newHealth <= 0) {
              // Handle boss loot drops
              handleBossLoot(enemy)

              // Create portal to next level
              const portalX = enemy.x
              const portalY = enemy.y

              // Update map to add portal
              setCurrentMap((currentMap) => {
                const updatedMap = [...currentMap]
                updatedMap[portalY] = [...updatedMap[portalY]]
                updatedMap[portalY][portalX] = { type: "portal", explored: true }
                return updatedMap
              })

              // Set boss as defeated
              setBossDefeated(true)
            }

            return { ...enemy, health: newHealth }
          }
          return enemy
        })

        return updatedEnemies
      })
    },
    [setBossDefeated, setCurrentMap, handleBossLoot],
  )

  const castSpell = useCallback(
    (spell: Spell, targetId?: number) => {
      // Mark this spell as discovered in the codex
      setCodexEntries((prevEntries) => markSpellDiscovered(prevEntries, spell))

      if (player.mana >= spell.manaCost) {
        setPlayer((prev) => ({ ...prev, mana: prev.mana - spell.manaCost }))

        if (spell.damage && targetId) {
          damageEnemy(targetId, spell.damage)
        }

        if (spell.healing) {
          setPlayer((prev) => ({
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + spell.healing),
          }))
        }

        return true
      }
      return false
    },
    [player.mana, damageEnemy],
  )

  const increaseAttribute = useCallback(
    (attribute: "health" | "attack" | "defense" | "magic" | "dodge" | "mana" | "criticalHit" | "luck") => {
      if (player.skillPoints <= 0) return false

      setPlayer((prev) => {
        // Create a copy with updated base stats
        const newPlayer = { ...prev, skillPoints: prev.skillPoints - 1 }

        // Update the appropriate attribute
        switch (attribute) {
          case "health":
            newPlayer.maxHealth = prev.maxHealth + 10
            newPlayer.health = prev.health + 10 // Also increase current health
            break
          case "attack":
            newPlayer.baseAttack = (prev.baseAttack || prev.attack) + 1
            newPlayer.attack = newPlayer.baseAttack
            break
          case "defense":
            newPlayer.baseDefense = (prev.baseDefense || prev.defense) + 1
            newPlayer.defense = newPlayer.baseDefense
            break
          case "magic":
            newPlayer.baseMagic = (prev.baseMagic || prev.magic) + 1
            newPlayer.magic = newPlayer.baseMagic
            break
          case "dodge":
            newPlayer.baseDodge = (prev.baseDodge || prev.dodge) + 1
            newPlayer.dodge = newPlayer.baseDodge
            break
          case "mana":
            newPlayer.maxMana = prev.maxMana + 10
            newPlayer.mana = prev.mana + 10 // Also increase current mana
            break
          case "criticalHit":
            newPlayer.baseCriticalHit = (prev.baseCriticalHit || prev.criticalHit) + 2
            newPlayer.criticalHit = newPlayer.baseCriticalHit
            break
          case "luck":
            newPlayer.baseLuck = (prev.baseLuck || prev.luck) + 2
            newPlayer.luck = newPlayer.baseLuck
            break
        }

        // Recalculate stats with equipment
        const stats = calculatePlayerStats(newPlayer)

        // Apply equipment bonuses
        newPlayer.attack = stats.attack
        newPlayer.defense = stats.defense
        newPlayer.magic = stats.magic
        newPlayer.dodge = stats.dodge
        newPlayer.criticalHit = stats.criticalHit
        newPlayer.luck = stats.luck

        return newPlayer
      })

      return true
    },
    [player.skillPoints, calculatePlayerStats],
  )

  // Add function to take item from chest
  const takeItemFromChest = useCallback(
    (item: Item) => {
      if (chestContents.contents.items) {
        // Mark this item as discovered in the codex
        setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))

        // Add item to inventory
        const added = addToInventory(item)

        if (added) {
          // Remove item from chest in the map
          const positionKey = `${chestContents.x},${chestContents.y}`
          setChestContentsMap((prev) => {
            const newMap = new Map(prev)
            const currentContents = newMap.get(positionKey) || {}
            newMap.set(positionKey, {
              ...currentContents,
              items: currentContents.items?.filter((i) => i.id !== item.id),
            })
            return newMap
          })

          // Remove item from current chest contents
          setChestContents((prev) => ({
            ...prev,
            contents: {
              ...prev.contents,
              items: prev.contents.items?.filter((i) => i.id !== item.id),
            },
          }))
        }
      }
    },
    [chestContents, addToInventory],
  )

  // Add a function to handle class selection
  const handleClassSelection = useCallback(
    (selectedClass: CharacterClass) => {
      setPlayerClass(selectedClass)
      setShowClassSelection(false)

      // Generate new player based on selected class
      setPlayer((prev) => {
        // Base stats for all classes
        let health = 50
        let maxHealth = 50
        let mana = 30
        let maxMana = 30
        let attack = 5
        let defense = 3
        let magic = 2
        const dodge = 1
        let startingItems: Item[] = []
        let knownSpells = [] as Spell[]

        // Class-specific adjustments
        if (selectedClass === "tank") {
          health = 70
          maxHealth = 70
          defense = 5
          attack = 4

          // Tank starting items
          startingItems = [
            {
              id: uuidv4(),
              name: "Tower Shield & Spear",
              type: "weapon",
              value: 100,
              rarity: "rare",
              attack: 8,
              defense: 4,
              description: "A massive shield paired with a spear",
              classRestriction: ["tank"],
            },
            {
              id: uuidv4(),
              name: "Heavy Iron Plate",
              type: "armor",
              value: 35,
              rarity: "common",
              defense: 6,
              description: "Exceptionally heavy iron armor",
              classRestriction: ["tank"],
            },
            {
              id: uuidv4(),
              name: "Health Potion",
              type: "potion",
              value: 10,
              rarity: "common",
              health: 20,
              description: "Restores 20 health points",
            },
            {
              id: uuidv4(),
              name: "Health Potion",
              type: "potion",
              value: 10,
              rarity: "common",
              health: 20,
              description: "Restores 20 health points",
            },
          ]
        } else if (selectedClass === "mage") {
          health = 40
          maxHealth = 40
          mana = 50
          maxMana = 50
          magic = 6
          defense = 2

          // Mage starting items
          startingItems = [
            {
              id: uuidv4(),
              name: "Apprentice Staff",
              type: "weapon",
              value: 25,
              rarity: "common",
              magic: 5,
              description: "A basic staff for apprentice mages",
              classRestriction: ["mage"],
            },
            {
              id: uuidv4(),
              name: "Apprentice Robes",
              type: "armor",
              value: 20,
              rarity: "common",
              defense: 2,
              magic: 3,
              description: "Simple robes worn by apprentice mages",
              classRestriction: ["mage"],
            },
            {
              id: uuidv4(),
              name: "Mana Potion",
              type: "potion",
              value: 10,
              rarity: "common",
              mana: 20,
              description: "Restores 20 mana points",
            },
            {
              id: uuidv4(),
              name: "Mana Potion",
              type: "potion",
              value: 10,
              rarity: "common",
              mana: 20,
              description: "Restores 20 mana points",
            },
          ]

          // Mage starts with 3 spells
          knownSpells = getSpellsForLevel("mage", 1)
        } else if (selectedClass === "warrior") {
          health = 60
          maxHealth = 60
          attack = 7

          // Warrior starting items
          startingItems = [
            {
              id: uuidv4(),
              name: "Steel Greatsword",
              type: "weapon",
              value: 50,
              rarity: "uncommon",
              attack: 8,
              description: "A heavy two-handed greatsword",
              classRestriction: ["warrior"],
            },
            {
              id: uuidv4(),
              name: "Steel Plate",
              type: "armor",
              value: 60,
              rarity: "uncommon",
              defense: 8,
              description: "Sturdy steel plate armor",
              classRestriction: ["warrior", "tank"],
            },
            {
              id: uuidv4(),
              name: "Health Potion",
              type: "potion",
              value: 10,
              rarity: "common",
              health: 20,
              description: "Restores 20 health points",
            },
          ]
        }

        // Mark starting items as discovered in the codex
        startingItems.forEach((item) => {
          setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))
        })

        // Mark starting spells as discovered in the codex
        const spellsToLearn = knownSpells.length > 0 ? knownSpells : getSpellsForLevel(selectedClass, 1)
        spellsToLearn.forEach((spell) => {
          setCodexEntries((prevEntries) => markSpellDiscovered(prevEntries, spell))
        })

        return {
          ...prev,
          class: selectedClass,
          health,
          maxHealth,
          mana,
          maxMana,
          attack,
          defense,
          magic,
          dodge,
          baseAttack: attack,
          baseDefense: defense,
          baseMagic: magic,
          baseDodge: dodge,
          baseCriticalHit: 5,
          baseLuck: 5,
          inventory: startingItems,
          knownSpells: spellsToLearn,
          equipment: {
            weapon: null,
            armor: null,
            accessory: null,
          },
        }
      })

      // After setting the player, apply any permanent upgrades from storage
      const savedData = loadGameData()
      if (savedData && savedData.upgrades) {
        // Use setTimeout to ensure this runs after the player state is updated
        setTimeout(() => {
          applyPermanentUpgrades(savedData.upgrades)
        }, 0)
      }
    },
    [applyPermanentUpgrades],
  )

  // Update the restartGame function to show class selection
  const restartGame = useCallback(() => {
    // Show class selection
    setShowClassSelection(true)

    // Generate new dungeon
    const newDungeonData = generateDungeon(40, 30, 1)

    // Reset all state
    setDungeonLevel(1)
    setDungeonData(newDungeonData)
    setCurrentMap(newDungeonData.map)
    setEnemies(newDungeonData.enemies)
    setGameOver(false)
    setBossDefeated(false)
    setInCombat(false)
    setActiveEnemy(null)
    setShowShop(false)
    setShowWizardShop(false)
    setChestContentsMap(new Map())
    setChestContents({
      x: 0,
      y: 0,
      contents: {},
      isOpen: false,
    })
    setUsedShrines(new Set())

    // Reset codex entries if starting a new game
    setCodexEntries(generateAllCodexEntries())

    // Ensure player is positioned at the valid starting position
    setPlayer((prev) => ({
      ...prev,
      x: newDungeonData.playerStart.x,
      y: newDungeonData.playerStart.y,
      level: 1,
      experience: 0,
      skillPoints: 0,
    }))

    // Update game state with new player position
    setGameState({
      dungeonLevel: 1,
      playerPosition: { x: newDungeonData.playerStart.x, y: newDungeonData.playerStart.y },
      cameraPosition: { x: newDungeonData.playerStart.x, y: newDungeonData.playerStart.y },
      visibleTiles: new Set<string>(),
    })
  }, [])

  // Then find the setInCombat function or add it if it doesn't exist:
  // This ensures enemies are reset when combat ends
  useEffect(() => {
    if (!inCombat && activeEnemy) {
      // Reset enemy health when combat ends
      resetEnemyHealth(activeEnemy.id)
      // Clear active enemy
      setActiveEnemy(null)
    }
  }, [inCombat, activeEnemy, resetEnemyHealth])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      player,
      currentMap,
      enemies,
      inCombat,
      activeEnemy,
      gameState,
      chestContents,
      showShop,
      showWizardShop,
      bossDefeated,
      gameOver,
      restartGame,
      showClassSelection,
      handleClassSelection,
      levelShopInventory,
      applyPermanentUpgrades,
      codexEntries,
      showCodex,
      setShowCodex,

      movePlayer,
      damagePlayer,
      damageEnemy,
      setInCombat,
      setActiveEnemy,
      addToInventory,
      removeFromInventory,
      equipItem,
      useItem,
      addGold,
      addExperience,
      learnSpell,
      castSpell,
      increaseAttribute,
      goToNextLevel,
      closeChest,
      takeGoldFromChest,
      takeItemFromChest,
      setShowShop,
      setShowWizardShop,
      sellItem: (item: Item) => {
        // Mark this item as discovered in the codex
        setCodexEntries((prevEntries) => markItemDiscovered(prevEntries, item))

        // Implement sellItem logic here
        const sellPrice = Math.floor(item.value * 0.7) // Sell for 70% of value
        addGold(sellPrice)
        removeFromInventory(item)
      },
    }),
    [
      player,
      currentMap,
      enemies,
      inCombat,
      activeEnemy,
      gameState,
      chestContents,
      showShop,
      showWizardShop,
      bossDefeated,
      gameOver,
      restartGame,
      showClassSelection,
      handleClassSelection,
      levelShopInventory,
      movePlayer,
      damagePlayer,
      damageEnemy,
      addToInventory,
      removeFromInventory,
      equipItem,
      useItem,
      addGold,
      addExperience,
      learnSpell,
      castSpell,
      increaseAttribute,
      goToNextLevel,
      closeChest,
      takeGoldFromChest,
      takeItemFromChest,
      setShowShop,
      setShowWizardShop,
      applyPermanentUpgrades,
      codexEntries,
      showCodex,
      setShowCodex,
    ],
  )

  return <GameStateContext.Provider value={contextValue}>{children}</GameStateContext.Provider>
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider")
  }
  return context
}

