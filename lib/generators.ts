import type { MapTile, Enemy } from "./types"
import { generateEnemy } from "./enemies"

// Ensure the boss is properly placed on the map
export function generateDungeon(
  width = 40,
  height = 30,
  dungeonLevel = 1,
): {
  map: MapTile[][]
  enemies: Enemy[]
  playerStart: { x: number; y: number }
  bossPosition: { x: number; y: number }
} {
  // Initialize with walls
  const map: MapTile[][] = Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => ({ type: "wall", explored: false })),
    )

  // Create rooms
  const numRooms = 5 + Math.floor(Math.random() * 5) + Math.floor(dungeonLevel / 2) // More rooms at higher levels
  const rooms: { x: number; y: number; width: number; height: number }[] = []

  for (let i = 0; i < numRooms; i++) {
    const roomWidth = 4 + Math.floor(Math.random() * 6) // 4-9 tiles
    const roomHeight = 4 + Math.floor(Math.random() * 6) // 4-9 tiles
    const roomX = 1 + Math.floor(Math.random() * (width - roomWidth - 2))
    const roomY = 1 + Math.floor(Math.random() * (height - roomHeight - 2))

    // Check if room overlaps with existing rooms
    let overlaps = false
    for (const room of rooms) {
      if (
        roomX <= room.x + room.width + 1 &&
        roomX + roomWidth + 1 >= room.x &&
        roomY <= room.y + room.height + 1 &&
        roomY + roomHeight + 1 >= room.y
      ) {
        overlaps = true
        break
      }
    }

    if (!overlaps) {
      rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight })

      // Fill room with floor tiles
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          map[y][x] = { type: "floor", explored: false }
        }
      }
    }
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i]
    const roomB = rooms[i + 1]

    // Center points of rooms
    const pointA = {
      x: roomA.x + Math.floor(roomA.width / 2),
      y: roomA.y + Math.floor(roomA.height / 2),
    }
    const pointB = {
      x: roomB.x + Math.floor(roomB.width / 2),
      y: roomB.y + Math.floor(roomB.height / 2),
    }

    // Randomly decide whether to go horizontal first or vertical first
    if (Math.random() > 0.5) {
      // Horizontal then vertical
      for (let x = Math.min(pointA.x, pointB.x); x <= Math.max(pointA.x, pointB.x); x++) {
        map[pointA.y][x] = { type: "floor", explored: false }
      }
      for (let y = Math.min(pointA.y, pointB.y); y <= Math.max(pointA.y, pointB.y); y++) {
        map[y][pointB.x] = { type: "floor", explored: false }
      }
    } else {
      // Vertical then horizontal
      for (let y = Math.min(pointA.y, pointB.y); y <= Math.max(pointA.y, pointB.y); y++) {
        map[y][pointA.x] = { type: "floor", explored: false }
      }
      for (let x = Math.min(pointA.x, pointB.x); x <= Math.max(pointA.x, pointB.x); x++) {
        map[pointB.y][x] = { type: "floor", explored: false }
      }
    }
  }

  // Add doors between rooms and corridors
  for (const room of rooms) {
    // Try to place a door on each side of the room
    const sides = [
      { x: room.x + Math.floor(room.width / 2), y: room.y - 1 }, // Top
      { x: room.x + Math.floor(room.width / 2), y: room.y + room.height }, // Bottom
      { x: room.x - 1, y: room.y + Math.floor(room.height / 2) }, // Left
      { x: room.x + room.width, y: room.y + Math.floor(room.height / 2) }, // Right
    ]

    for (const side of sides) {
      if (
        side.x > 0 &&
        side.x < width - 1 &&
        side.y > 0 &&
        side.y < height - 1 &&
        map[side.y][side.x].type === "wall" &&
        ((map[side.y - 1][side.x].type === "floor" && map[side.y + 1][side.x].type === "floor") ||
          (map[side.y][side.x - 1].type === "floor" && map[side.y][side.x + 1].type === "floor"))
      ) {
        map[side.y][side.x] = { type: "door", explored: false }
      }
    }
  }

  // Add chests
  const numChests = 2 + Math.floor(Math.random() * 3) + Math.floor(dungeonLevel / 2) // More chests at higher levels
  for (let i = 0; i < numChests; i++) {
    const room = rooms[Math.floor(Math.random() * rooms.length)]
    const x = room.x + 1 + Math.floor(Math.random() * (room.width - 2))
    const y = room.y + 1 + Math.floor(Math.random() * (room.height - 2))

    if (map[y][x].type === "floor") {
      map[y][x] = { type: "chest", explored: false }
    }
  }

  // Add a 2x2 shop to a random room (not the first or last)
  if (rooms.length > 2) {
    const shopRoomIndex = 1 + Math.floor(Math.random() * (rooms.length - 2))
    const shopRoom = rooms[shopRoomIndex]

    // Make sure the room is big enough for a 2x2 shop
    if (shopRoom.width >= 4 && shopRoom.height >= 4) {
      // Find a corner for the shop that's not too close to the edges
      const shopX = shopRoom.x + 1 + Math.floor(Math.random() * (shopRoom.width - 3))
      const shopY = shopRoom.y + 1 + Math.floor(Math.random() * (shopRoom.height - 3))

      // Create a 2x2 shop
      for (let y = shopY; y < shopY + 2; y++) {
        for (let x = shopX; x < shopX + 2; x++) {
          if (map[y][x].type === "floor") {
            map[y][x] = { type: "shop", explored: false }
          }
        }
      }
    } else {
      // If room is too small, just place a single shop tile
      const shopX = shopRoom.x + 1 + Math.floor(Math.random() * (shopRoom.width - 2))
      const shopY = shopRoom.y + 1 + Math.floor(Math.random() * (shopRoom.height - 2))

      if (map[shopY][shopX].type === "floor") {
        map[shopY][shopX] = { type: "shop", explored: false }
      }
    }
  }

  // Add a wizard shop to a random room (not the first or last)
  if (rooms.length > 2) {
    const wizardRoomIndex = 1 + Math.floor(Math.random() * (rooms.length - 2))
    const wizardRoom = rooms[wizardRoomIndex]

    const wizardX = wizardRoom.x + 1 + Math.floor(Math.random() * (wizardRoom.width - 2))
    const wizardY = wizardRoom.y + 1 + Math.floor(Math.random() * (wizardRoom.height - 2))

    if (map[wizardY][wizardX].type === "floor") {
      map[wizardY][wizardX] = { type: "wizard", explored: false }
    }
  }

  // Add a shrine to a different random room
  const availableRooms = rooms.filter((_, index) => index !== 0 && index !== rooms.length - 1)
  if (availableRooms.length > 0) {
    const shrineRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)]
    const shrineX = shrineRoom.x + 1 + Math.floor(Math.random() * (shrineRoom.width - 2))
    const shrineY = shrineRoom.y + 1 + Math.floor(Math.random() * (shrineRoom.height - 2))

    if (map[shrineY][shrineX].type === "floor") {
      map[shrineY][shrineX] = { type: "shrine", explored: false }
    }
  }

  // Set player starting position (in the first room)
  const firstRoom = rooms[0]
  let playerStartX = firstRoom.x + Math.floor(firstRoom.width / 2)
  let playerStartY = firstRoom.y + Math.floor(firstRoom.height / 2)

  // Ensure the player starting position is a floor tile
  if (map[playerStartY][playerStartX].type !== "floor") {
    // If not a floor tile, find the nearest floor tile in the first room
    let found = false
    for (let y = firstRoom.y; y < firstRoom.y + firstRoom.height && !found; y++) {
      for (let x = firstRoom.x; x < firstRoom.x + firstRoom.width && !found; x++) {
        if (map[y][x].type === "floor") {
          // Found a floor tile, use this as the player start
          playerStartX = x
          playerStartY = y
          found = true
        }
      }
    }
  }

  // Track occupied positions
  const occupiedPositions = new Set<string>()
  occupiedPositions.add(`${playerStartX},${playerStartY}`)

  // Add boss to the last room
  const lastRoom = rooms[rooms.length - 1]
  const bossX = lastRoom.x + Math.floor(lastRoom.width / 2)
  const bossY = lastRoom.y + Math.floor(lastRoom.height / 2)

  // Ensure the boss tile is set
  if (map[bossY][bossX].type === "floor") {
    map[bossY][bossX] = { type: "floor", explored: false } // Keep as floor but mark the position
  }

  // Generate enemies
  const enemyCount = 5 + Math.floor(Math.random() * 5) + Math.floor(dungeonLevel / 2)
  const enemies = generateEnemies(dungeonLevel, enemyCount, map, occupiedPositions)

  // Generate boss enemy
  const bossEnemy = generateBossEnemy(dungeonLevel, bossX, bossY)
  enemies.push(bossEnemy)

  // Add additional validation to ensure the player never spawns in a wall
  // Add this to the generateDungeon function, right before returning the result

  // Final validation to ensure player never spawns in a wall
  if (map[playerStartY][playerStartX].type !== "floor") {
    // Force the tile to be a floor if somehow it's not
    map[playerStartY][playerStartX] = { type: "floor", explored: true }
    console.warn("Player was about to spawn in a non-floor tile. Forced to floor.")
  }

  return {
    map,
    enemies,
    playerStart: { x: playerStartX, y: playerStartY },
    bossPosition: { x: bossX, y: bossY },
  }
}

// Update boss generation to reduce difficulty by 15%
export function generateBossEnemy(dungeonLevel: number, x: number, y: number): Enemy {
  const baseStats = {
    health: 50 + dungeonLevel * 20,
    attack: 8 + dungeonLevel * 2,
    defense: 5 + dungeonLevel * 1.5,
    magic: 3 + dungeonLevel * 1.5,
  }

  const bosses = [
    {
      name: "Dark Knight",
      race: "boss",
      symbol: "K",
      multiplier: 1.2,
    },
    {
      name: "Ancient Lich",
      race: "boss",
      symbol: "L",
      multiplier: 1.3,
    },
    {
      name: "Dragon Lord",
      race: "boss",
      symbol: "D",
      multiplier: 1.4,
    },
    {
      name: "Demon Prince",
      race: "boss",
      symbol: "P",
      multiplier: 1.5,
    },
    {
      name: "Elder God",
      race: "boss",
      symbol: "G",
      multiplier: 2.0,
    },
  ]

  const bossIndex = Math.min(dungeonLevel - 1, bosses.length - 1)
  const boss = bosses[bossIndex]

  // Apply 15% reduction to boss multiplier
  const multiplier = boss.multiplier * 0.85

  return {
    id: 1000 + dungeonLevel,
    name: boss.name,
    race: boss.race,
    symbol: boss.symbol,
    level: dungeonLevel,
    health: Math.floor(baseStats.health * multiplier),
    maxHealth: Math.floor(baseStats.health * multiplier),
    attack: Math.floor(baseStats.attack * multiplier),
    defense: Math.floor(baseStats.defense * multiplier),
    magic: Math.floor(baseStats.magic * multiplier),
    x,
    y,
    goldValue: dungeonLevel * 100,
    expValue: dungeonLevel * 150,
    isBoss: true,
  }
}

// Update generateEnemies to check for valid floor tiles
export function generateEnemies(
  dungeonLevel: number,
  count: number,
  map: MapTile[][],
  occupiedPositions: Set<string>,
): Enemy[] {
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

