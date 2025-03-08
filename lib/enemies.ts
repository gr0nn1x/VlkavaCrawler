import type { Enemy } from "./types"
import { getAllItems } from "./items"
import type { MapTile } from "./types"

// Generate a random enemy based on dungeon level
export const generateEnemy = (dungeonLevel: number, x: number, y: number): Enemy => {
  const enemyTypes = [
    // Dragons (high level)
    {
      race: "dragon",
      names: ["Red Dragon", "Blue Dragon", "Green Dragon", "Black Dragon", "Gold Dragon"],
      symbols: ["D"],
      minLevel: 8,
      baseHealth: 80,
      baseAttack: 15,
      baseDefense: 12,
      baseMagic: 10,
      baseDodge: 5, // Dragons have some dodge chance
      goldMultiplier: 5,
      expMultiplier: 5,
    },
    // Skeletons (low-mid level)
    {
      race: "skeleton",
      names: ["Skeleton Warrior", "Skeleton Archer", "Skeleton Mage", "Bone Knight", "Skeletal Champion"],
      symbols: ["S"],
      minLevel: 2,
      baseHealth: 20,
      baseAttack: 5,
      baseDefense: 3,
      baseMagic: 2,
      baseDodge: 0, // Skeletons don't dodge
      goldMultiplier: 1,
      expMultiplier: 1,
    },
    // Humans (all levels)
    {
      race: "human",
      names: ["Bandit", "Mercenary", "Cultist", "Dark Knight", "Warlock"],
      symbols: ["H"],
      minLevel: 1,
      baseHealth: 25,
      baseAttack: 6,
      baseDefense: 4,
      baseMagic: 3,
      baseDodge: 8, // Humans are agile
      goldMultiplier: 2,
      expMultiplier: 1.5,
    },
    // Dwarfs (mid level)
    {
      race: "dwarf",
      names: ["Dwarf Fighter", "Dwarf Berserker", "Dwarf Smith", "Dwarf Guard", "Dwarf Champion"],
      symbols: ["D"],
      minLevel: 3,
      baseHealth: 30,
      baseAttack: 8,
      baseDefense: 6,
      baseMagic: 1,
      baseDodge: 3, // Dwarfs aren't very agile
      goldMultiplier: 3,
      expMultiplier: 1.7,
    },
    // Mimics (mid-high level)
    {
      race: "mimic",
      names: ["Chest Mimic", "Door Mimic", "Weapon Mimic", "Armor Mimic", "Gold Mimic"],
      symbols: ["M"],
      minLevel: 5,
      baseHealth: 35,
      baseAttack: 10,
      baseDefense: 8,
      baseMagic: 5,
      baseDodge: 0, // Mimics don't dodge
      goldMultiplier: 4,
      expMultiplier: 2.5,
    },
    // Undead (mid level)
    {
      race: "undead",
      names: ["Zombie", "Ghoul", "Wight", "Wraith", "Lich"],
      symbols: ["Z"],
      minLevel: 3,
      baseHealth: 25,
      baseAttack: 6,
      baseDefense: 4,
      baseMagic: 7,
      baseDodge: 2, // Most undead are slow
      goldMultiplier: 1.5,
      expMultiplier: 1.8,
    },
    // New enemy: Rats (low level)
    {
      race: "rat",
      names: ["Giant Rat", "Plague Rat", "Sewer Rat", "Dire Rat", "Mutant Rat"],
      symbols: ["r"],
      minLevel: 1,
      baseHealth: 10,
      baseAttack: 3,
      baseDefense: 1,
      baseMagic: 0,
      baseDodge: 15, // Rats are very agile
      goldMultiplier: 0.5,
      expMultiplier: 0.7,
    },
    // New enemy: Wolves (low-mid level)
    {
      race: "wolf",
      names: ["Timber Wolf", "Dire Wolf", "Shadow Wolf", "Winter Wolf", "Alpha Wolf"],
      symbols: ["w"],
      minLevel: 2,
      baseHealth: 22,
      baseAttack: 7,
      baseDefense: 2,
      baseMagic: 0,
      baseDodge: 12, // Wolves are quick
      goldMultiplier: 0.8,
      expMultiplier: 1.2,
    },
    // New enemy: Bears (mid level)
    {
      race: "bear",
      names: ["Brown Bear", "Black Bear", "Cave Bear", "Grizzly", "Dire Bear"],
      symbols: ["B"],
      minLevel: 4,
      baseHealth: 40,
      baseAttack: 9,
      baseDefense: 5,
      baseMagic: 0,
      baseDodge: 3, // Bears aren't very agile
      goldMultiplier: 1.2,
      expMultiplier: 1.5,
    },
    // New enemy: Spiders (low-mid level)
    {
      race: "spider",
      names: ["Giant Spider", "Venomous Spider", "Web Spinner", "Shadow Spider", "Cave Spider"],
      symbols: ["s"],
      minLevel: 2,
      baseHealth: 15,
      baseAttack: 5,
      baseDefense: 2,
      baseMagic: 1,
      baseDodge: 18, // Spiders are very agile
      goldMultiplier: 0.7,
      expMultiplier: 1.0,
    },
    // New enemy: Goblins (low-mid level)
    {
      race: "goblin",
      names: ["Goblin Scout", "Goblin Warrior", "Goblin Shaman", "Goblin Archer", "Goblin Chief"],
      symbols: ["g"],
      minLevel: 2,
      baseHealth: 18,
      baseAttack: 4,
      baseDefense: 2,
      baseMagic: 2,
      baseDodge: 10, // Goblins are quick
      goldMultiplier: 1.0,
      expMultiplier: 1.1,
    },
    // New enemy: Trolls (mid-high level)
    {
      race: "troll",
      names: ["Cave Troll", "Bridge Troll", "Swamp Troll", "Mountain Troll", "Elder Troll"],
      symbols: ["T"],
      minLevel: 6,
      baseHealth: 60,
      baseAttack: 12,
      baseDefense: 8,
      baseMagic: 1,
      baseDodge: 2, // Trolls are slow
      goldMultiplier: 2.0,
      expMultiplier: 2.2,
    },
    // New enemy: Ogres (mid-high level)
    {
      race: "ogre",
      names: ["Ogre Brute", "Ogre Mauler", "Ogre Chieftain", "Two-Headed Ogre", "Ogre Mage"],
      symbols: ["O"],
      minLevel: 5,
      baseHealth: 50,
      baseAttack: 10,
      baseDefense: 7,
      baseMagic: 2,
      baseDodge: 1, // Ogres are very slow
      goldMultiplier: 1.8,
      expMultiplier: 2.0,
    },
    // New enemy: Ghosts (mid level)
    {
      race: "ghost",
      names: ["Restless Spirit", "Phantom", "Specter", "Haunting Presence", "Vengeful Ghost"],
      symbols: ["G"],
      minLevel: 4,
      baseHealth: 20,
      baseAttack: 5,
      baseDefense: 3,
      baseMagic: 8,
      baseDodge: 20, // Ghosts are very hard to hit
      goldMultiplier: 1.0,
      expMultiplier: 1.6,
    },
  ]

  // Filter enemy types by dungeon level
  const availableTypes = enemyTypes.filter((type) => type.minLevel <= dungeonLevel)

  // If no enemies are available for this level, use the lowest level enemy
  const enemyType =
    availableTypes.length > 0
      ? availableTypes[Math.floor(Math.random() * availableTypes.length)]
      : enemyTypes.sort((a, b) => a.minLevel - b.minLevel)[0]

  // Calculate enemy level based on dungeon level
  // Enemies will be dungeon level -1 to dungeon level
  const minLevel = Math.max(1, dungeonLevel - 1)
  const maxLevel = dungeonLevel
  const level = minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1))

  // Calculate stats based on level with increased scaling
  const levelMultiplier = 1 + (level - 1) * 0.25 // Increased from 0.2 to 0.25 for better scaling
  const health = Math.floor(enemyType.baseHealth * levelMultiplier)
  const attack = Math.floor(enemyType.baseAttack * levelMultiplier)
  const defense = Math.floor(enemyType.baseDefense * levelMultiplier)
  const magic = Math.floor(enemyType.baseMagic * levelMultiplier)
  const dodge = Math.floor(enemyType.baseDodge * levelMultiplier) // Calculate dodge chance

  // Calculate gold and exp values with better scaling
  const goldValue = Math.floor(level * 8 * enemyType.goldMultiplier) // Increased from 5 to 8
  const expValue = Math.floor(level * 15 * enemyType.expMultiplier) // Increased from 10 to 15

  // Select a random name and symbol
  const nameIndex = Math.floor(Math.random() * enemyType.names.length)
  const name = enemyType.names[nameIndex]
  const symbol = enemyType.symbols[Math.floor(Math.random() * enemyType.symbols.length)]

  // Generate loot (30% chance)
  let loot: any[] = []
  if (Math.random() < 0.3) {
    const allItems = getAllItems()
    const availableItems = allItems.filter((item) => !item.levelRequirement || item.levelRequirement <= level)

    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)]
      loot = [randomItem]
    }
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    name,
    race: enemyType.race as any,
    symbol,
    level,
    health,
    maxHealth: health,
    attack,
    defense,
    magic,
    dodge, // Add dodge chance to enemy
    x,
    y,
    loot,
    goldValue,
    expValue,
  }
}

// Update generateEnemies to use the map parameter
export const generateEnemies = (
  dungeonLevel: number,
  count: number,
  map: MapTile[][],
  occupiedPositions: Set<string>,
): Enemy[] => {
  const enemies: Enemy[] = []
  const mapHeight = map.length
  const mapWidth = map[0].length

  for (let i = 0; i < count; i++) {
    let x, y
    let positionKey
    let attempts = 0
    const maxAttempts = 100 // Prevent infinite loops

    // Find an unoccupied position that is a floor tile
    do {
      x = Math.floor(Math.random() * mapWidth)
      y = Math.floor(Math.random() * mapHeight)
      positionKey = `${x},${y}`
      attempts++

      // Break if we can't find a valid position after many attempts
      if (attempts > maxAttempts) break
    } while (occupiedPositions.has(positionKey) || map[y][x].type !== "floor")

    // Skip this enemy if we couldn't find a valid position
    if (attempts > maxAttempts) continue

    // Mark position as occupied
    occupiedPositions.add(positionKey)

    // Generate enemy
    const enemy = generateEnemy(dungeonLevel, x, y)
    enemies.push(enemy)
  }

  return enemies
}

