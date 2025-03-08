import { getAllItems } from "./items"
import { getAllSpells } from "./spells"
import type { Item, Spell } from "./types"

export type CodexCategory = "weapon" | "armor" | "accessory" | "potion" | "enemy" | "spell" | "location"

export interface CodexEntry {
  id: string
  name: string
  description: string
  category: CodexCategory
  discovered: boolean
  rarity?: string
  levelRequirement?: number
  classRestriction?: string[]
}

// Generate codex entries for all items
export const generateItemCodexEntries = (): CodexEntry[] => {
  const allItems = getAllItems()

  return allItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || `A ${item.rarity} ${item.type}`,
    category: item.type as CodexCategory,
    discovered: false,
    rarity: item.rarity,
    levelRequirement: item.levelRequirement,
    classRestriction: item.classRestriction,
  }))
}

// Generate codex entries for all spells
export const generateSpellCodexEntries = (): CodexEntry[] => {
  const allSpells = getAllSpells()

  return allSpells.map((spell) => ({
    id: spell.id,
    name: spell.name,
    description: spell.description,
    category: "spell",
    discovered: false,
    levelRequirement: spell.levelRequirement,
    classRestriction: spell.classRestriction,
  }))
}

// Enemy types with descriptions
export const enemyDescriptions: Record<string, string> = {
  dragon: "Powerful winged creatures that breathe fire and hoard treasure.",
  skeleton: "Animated remains of the dead, often wielding rusty weapons.",
  human: "Regular human enemies, typically bandits or mercenaries.",
  elf: "Agile and magical forest dwellers with pointed ears.",
  dwarf: "Stout miners and craftsmen with a love for gold and ale.",
  halfling: "Small, nimble folk with a knack for stealth.",
  mimic: "Creatures that disguise themselves as treasure chests to ambush prey.",
  undead: "Reanimated corpses that hunger for the living.",
  boss: "Exceptionally powerful enemies that guard valuable treasures.",
  rat: "Small vermin that attack in groups.",
  wolf: "Predatory canines that hunt in packs.",
  bear: "Large, powerful mammals with sharp claws.",
  spider: "Eight-legged arachnids that spin webs and inject venom.",
  goblin: "Small, green-skinned creatures known for their mischief.",
  troll: "Large, regenerating monsters with incredible strength.",
  ogre: "Huge, brutish humanoids with limited intelligence but immense power.",
  ghost: "Spectral entities that can phase through solid objects.",
}

// Location types with descriptions
export const locationDescriptions: Record<string, string> = {
  wall: "Solid barriers that block movement and line of sight.",
  floor: "Open spaces where characters can move freely.",
  door: "Passages between rooms that can be opened and closed.",
  chest: "Containers that may hold valuable loot.",
  shop: "Places where items can be bought and sold.",
  wizard: "Magical vendors who sell spells and enchanted items.",
  shrine: "Sacred places that restore health and mana when visited.",
  boss: "Chambers where powerful enemies await.",
  portal: "Magical gateways to the next dungeon level.",
}

// Generate a template enemy codex entry
export const generateEnemyCodexTemplate = (): CodexEntry[] => {
  return Object.entries(enemyDescriptions).map(([race, description], index) => ({
    id: `enemy-${race}`,
    name: race.charAt(0).toUpperCase() + race.slice(1),
    description,
    category: "enemy",
    discovered: false,
  }))
}

// Generate location codex entries
export const generateLocationCodexEntries = (): CodexEntry[] => {
  return Object.entries(locationDescriptions).map(([type, description]) => ({
    id: `location-${type}`,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    description,
    category: "location",
    discovered: false,
  }))
}

// Generate all codex entries
export const generateAllCodexEntries = (): CodexEntry[] => {
  return [
    ...generateItemCodexEntries(),
    ...generateSpellCodexEntries(),
    ...generateEnemyCodexTemplate(),
    ...generateLocationCodexEntries(),
  ]
}

// Helper function to get codex entry by ID
export const getCodexEntryById = (entries: CodexEntry[], id: string): CodexEntry | undefined => {
  return entries.find((entry) => entry.id === id)
}

// Helper function to mark an item as discovered
export const markItemDiscovered = (entries: CodexEntry[], item: Item): CodexEntry[] => {
  return entries.map((entry) => {
    if (entry.id === item.id) {
      return { ...entry, discovered: true }
    }
    return entry
  })
}

// Helper function to mark an enemy type as discovered
export const markEnemyTypeDiscovered = (entries: CodexEntry[], enemyRace: string): CodexEntry[] => {
  return entries.map((entry) => {
    if (entry.id === `enemy-${enemyRace}`) {
      return { ...entry, discovered: true }
    }
    return entry
  })
}

// Helper function to mark a location type as discovered
export const markLocationDiscovered = (entries: CodexEntry[], locationType: string): CodexEntry[] => {
  return entries.map((entry) => {
    if (entry.id === `location-${locationType}`) {
      return { ...entry, discovered: true }
    }
    return entry
  })
}

// Helper function to mark a spell as discovered
export const markSpellDiscovered = (entries: CodexEntry[], spell: Spell): CodexEntry[] => {
  return entries.map((entry) => {
    if (entry.id === spell.id) {
      return { ...entry, discovered: true }
    }
    return entry
  })
}

