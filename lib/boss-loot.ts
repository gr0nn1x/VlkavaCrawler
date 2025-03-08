import type { Item } from "./types"
import { v4 as uuidv4 } from "uuid"

// Function to get special loot for bosses based on dungeon level and boss name
export function getBossLoot(dungeonLevel: number, bossName: string): Item[] {
  const loot: Item[] = []

  // Scale item power based on dungeon level
  const powerMultiplier = 1 + dungeonLevel * 0.2

  // Common boss loot pool
  const commonBossLoot: Item[] = [
    {
      id: uuidv4(),
      name: "Boss Essence",
      type: "potion",
      value: 100 * dungeonLevel,
      rarity: "rare",
      health: 50 * powerMultiplier,
      mana: 50 * powerMultiplier,
      description: "A powerful essence that restores health and mana",
    },
    {
      id: uuidv4(),
      name: "Soul Crystal",
      type: "accessory",
      value: 200 * dungeonLevel,
      rarity: "epic",
      magic: Math.floor(3 * powerMultiplier),
      mana: Math.floor(20 * powerMultiplier),
      description: "A crystal containing the essence of a powerful foe",
    },
  ]

  // Add common loot
  loot.push(commonBossLoot[Math.floor(Math.random() * commonBossLoot.length)])

  // Boss-specific loot
  switch (bossName) {
    case "Dark Knight":
      loot.push({
        id: uuidv4(),
        name: "Corrupted Blade",
        type: "weapon",
        value: 300 * dungeonLevel,
        rarity: "epic",
        attack: Math.floor(8 * powerMultiplier),
        description: "A blade corrupted by dark energy",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
      break

    case "Ancient Lich":
      loot.push({
        id: uuidv4(),
        name: "Phylactery Shard",
        type: "accessory",
        value: 350 * dungeonLevel,
        rarity: "epic",
        magic: Math.floor(6 * powerMultiplier),
        mana: Math.floor(30 * powerMultiplier),
        description: "A shard from a lich's phylactery, pulsing with arcane energy",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
      break

    case "Dragon Lord":
      loot.push({
        id: uuidv4(),
        name: "Dragonscale Armor",
        type: "armor",
        value: 400 * dungeonLevel,
        rarity: "epic",
        defense: Math.floor(10 * powerMultiplier),
        description: "Armor forged from the scales of a mighty dragon",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
      break

    case "Demon Prince":
      loot.push({
        id: uuidv4(),
        name: "Infernal Crown",
        type: "accessory",
        value: 450 * dungeonLevel,
        rarity: "legendary",
        attack: Math.floor(4 * powerMultiplier),
        magic: Math.floor(4 * powerMultiplier),
        criticalHit: Math.floor(10 * powerMultiplier),
        description: "A crown that burns with hellfire, increasing combat prowess",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
      break

    case "Elder God":
      loot.push({
        id: uuidv4(),
        name: "Cosmic Artifact",
        type: "accessory",
        value: 500 * dungeonLevel,
        rarity: "legendary",
        attack: Math.floor(5 * powerMultiplier),
        defense: Math.floor(5 * powerMultiplier),
        magic: Math.floor(5 * powerMultiplier),
        stealth: Math.floor(5 * powerMultiplier),
        criticalHit: Math.floor(5 * powerMultiplier),
        luck: Math.floor(5 * powerMultiplier),
        description: "An artifact of immense power from beyond the stars",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
      break

    default:
      // For any other boss, add a generic powerful item
      loot.push({
        id: uuidv4(),
        name: "Champion's Trophy",
        type: "accessory",
        value: 250 * dungeonLevel,
        rarity: "rare",
        attack: Math.floor(3 * powerMultiplier),
        defense: Math.floor(3 * powerMultiplier),
        description: "A trophy proving your victory over a powerful foe",
        levelRequirement: Math.max(1, dungeonLevel - 1),
      })
  }

  // For higher level bosses, add an extra legendary item
  if (dungeonLevel >= 5) {
    const legendaryItems: Item[] = [
      {
        id: uuidv4(),
        name: "Void Shard",
        type: "accessory",
        value: 600 * dungeonLevel,
        rarity: "legendary",
        magic: Math.floor(8 * powerMultiplier),
        criticalHit: Math.floor(15 * powerMultiplier),
        description: "A shard of the void that increases magical potency",
        levelRequirement: dungeonLevel,
      },
      {
        id: uuidv4(),
        name: "Ancient Hero's Blade",
        type: "weapon",
        value: 650 * dungeonLevel,
        rarity: "legendary",
        attack: Math.floor(12 * powerMultiplier),
        criticalHit: Math.floor(10 * powerMultiplier),
        description: "A legendary blade wielded by heroes of old",
        levelRequirement: dungeonLevel,
      },
      {
        id: uuidv4(),
        name: "Immortal's Cuirass",
        type: "armor",
        value: 700 * dungeonLevel,
        rarity: "legendary",
        defense: Math.floor(15 * powerMultiplier),
        health: Math.floor(50 * powerMultiplier),
        description: "Armor said to grant its wearer immortality",
        levelRequirement: dungeonLevel,
      },
    ]

    loot.push(legendaryItems[Math.floor(Math.random() * legendaryItems.length)])
  }

  return loot
}

