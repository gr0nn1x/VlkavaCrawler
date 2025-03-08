import type { Item, CharacterClass } from "./types"
import { v4 as uuidv4 } from "uuid"

// Warrior Weapons
export const warriorWeapons: Item[] = [
  {
    id: uuidv4(),
    name: "Iron Sword",
    type: "weapon",
    value: 25,
    rarity: "common",
    attack: 5,
    description: "A basic iron sword",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 1,
  },
  {
    id: uuidv4(),
    name: "Steel Greatsword",
    type: "weapon",
    value: 50,
    rarity: "uncommon",
    attack: 8,
    description: "A heavy two-handed greatsword",
    classRestriction: ["warrior"],
    levelRequirement: 3,
  },
  {
    id: uuidv4(),
    name: "Mithril Axe",
    type: "weapon",
    value: 100,
    rarity: "rare",
    attack: 12,
    description: "A finely crafted axe made of mithril",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 5,
  },
  {
    id: uuidv4(),
    name: "Dragonbone Warhammer",
    type: "weapon",
    value: 200,
    rarity: "epic",
    attack: 15,
    description: "A massive warhammer made from dragon bones",
    classRestriction: ["warrior"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Excalibur",
    type: "weapon",
    value: 500,
    rarity: "legendary",
    attack: 20,
    magic: 5,
    description: "The legendary sword of kings",
    classRestriction: ["warrior"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Berserker's Axe",
    type: "weapon",
    value: 150,
    rarity: "rare",
    attack: 14,
    description: "An axe that increases in power as your health decreases",
    classRestriction: ["warrior"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Obsidian Cleaver",
    type: "weapon",
    value: 180,
    rarity: "rare",
    attack: 13,
    description: "A razor-sharp blade made of volcanic glass",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Runic Blade",
    type: "weapon",
    value: 220,
    rarity: "epic",
    attack: 14,
    magic: 3,
    description: "A sword inscribed with ancient runes of power",
    classRestriction: ["warrior"],
    levelRequirement: 9,
  },
  {
    id: uuidv4(),
    name: "Gladiator's Spear",
    type: "weapon",
    value: 120,
    rarity: "rare",
    attack: 11,
    description: "A well-balanced spear favored by arena fighters",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 5,
  },
  {
    id: uuidv4(),
    name: "Executioner's Blade",
    type: "weapon",
    value: 250,
    rarity: "epic",
    attack: 16,
    description: "A massive blade designed for swift executions",
    classRestriction: ["warrior"],
    levelRequirement: 8,
  },
]

// Mage Weapons
export const mageWeapons: Item[] = [
  {
    id: uuidv4(),
    name: "Apprentice Staff",
    type: "weapon",
    value: 25,
    rarity: "common",
    magic: 5,
    description: "A basic staff for apprentice mages",
    classRestriction: ["mage"],
    levelRequirement: 1,
  },
  {
    id: uuidv4(),
    name: "Crystal Wand",
    type: "weapon",
    value: 50,
    rarity: "uncommon",
    magic: 8,
    description: "A wand with a crystal focus",
    classRestriction: ["mage"],
    levelRequirement: 3,
  },
  {
    id: uuidv4(),
    name: "Arcane Scepter",
    type: "weapon",
    value: 100,
    rarity: "rare",
    magic: 12,
    description: "A scepter imbued with arcane energy",
    classRestriction: ["mage"],
    levelRequirement: 5,
  },
  {
    id: uuidv4(),
    name: "Staff of the Elements",
    type: "weapon",
    value: 200,
    rarity: "epic",
    magic: 15,
    description: "A staff that channels elemental magic",
    classRestriction: ["mage"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Merlin's Spellbook",
    type: "weapon",
    value: 500,
    rarity: "legendary",
    magic: 20,
    mana: 50,
    description: "The legendary spellbook of Merlin",
    classRestriction: ["mage"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Frost Orb",
    type: "weapon",
    value: 120,
    rarity: "rare",
    magic: 11,
    description: "A sphere of perpetual ice that enhances frost magic",
    classRestriction: ["mage"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Flameheart Rod",
    type: "weapon",
    value: 150,
    rarity: "rare",
    magic: 13,
    description: "A rod with a core of eternal flame",
    classRestriction: ["mage"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Void Staff",
    type: "weapon",
    value: 220,
    rarity: "epic",
    magic: 16,
    description: "A staff that draws power from the void between worlds",
    classRestriction: ["mage"],
    levelRequirement: 9,
  },
  {
    id: uuidv4(),
    name: "Astral Codex",
    type: "weapon",
    value: 180,
    rarity: "rare",
    magic: 14,
    mana: 20,
    description: "An ancient book containing the secrets of the stars",
    classRestriction: ["mage"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Mindweaver",
    type: "weapon",
    value: 250,
    rarity: "epic",
    magic: 17,
    description: "A staff that enhances mental magic and illusions",
    classRestriction: ["mage"],
    levelRequirement: 9,
  },
]

// Tank Weapons
export const tankWeapons: Item[] = [
  {
    id: uuidv4(),
    name: "Iron Mace",
    type: "weapon",
    value: 25,
    rarity: "common",
    attack: 4,
    defense: 1,
    description: "A heavy iron mace",
    classRestriction: ["tank", "warrior"],
    levelRequirement: 1,
  },
  {
    id: uuidv4(),
    name: "Steel Flail",
    type: "weapon",
    value: 50,
    rarity: "uncommon",
    attack: 6,
    defense: 2,
    description: "A flail with a spiked ball",
    classRestriction: ["tank"],
    levelRequirement: 3,
  },
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
    levelRequirement: 5,
  },
  {
    id: uuidv4(),
    name: "Dwarven Warhammer",
    type: "weapon",
    value: 200,
    rarity: "epic",
    attack: 10,
    defense: 5,
    description: "A mighty warhammer forged by dwarven smiths",
    classRestriction: ["tank", "warrior"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Aegis",
    type: "weapon",
    value: 500,
    rarity: "legendary",
    attack: 12,
    defense: 10,
    description: "The legendary shield of the gods",
    classRestriction: ["tank"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Bulwark Maul",
    type: "weapon",
    value: 150,
    rarity: "rare",
    attack: 9,
    defense: 3,
    description: "A heavy maul that can also be used defensively",
    classRestriction: ["tank"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Guardian's Halberd",
    type: "weapon",
    value: 180,
    rarity: "rare",
    attack: 11,
    defense: 4,
    description: "A versatile polearm used by elite guards",
    classRestriction: ["tank"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Sentinel's Bastion",
    type: "weapon",
    value: 220,
    rarity: "epic",
    attack: 9,
    defense: 7,
    description: "A shield with a built-in blade mechanism",
    classRestriction: ["tank"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Ironclad Mace",
    type: "weapon",
    value: 190,
    rarity: "rare",
    attack: 10,
    defense: 5,
    description: "A mace with defensive plating along the handle",
    classRestriction: ["tank", "warrior"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Titan's Fist",
    type: "weapon",
    value: 250,
    rarity: "epic",
    attack: 11,
    defense: 8,
    description: "A massive gauntlet weapon that doubles as a shield",
    classRestriction: ["tank"],
    levelRequirement: 9,
  },
]

// Warrior Armor
export const warriorArmor: Item[] = [
  {
    id: uuidv4(),
    name: "Iron Plate",
    type: "armor",
    value: 30,
    rarity: "common",
    defense: 5,
    description: "Basic iron plate armor",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 1,
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
    levelRequirement: 4,
  },
  {
    id: uuidv4(),
    name: "Mithril Plate",
    type: "armor",
    value: 120,
    rarity: "rare",
    defense: 12,
    description: "Lightweight yet strong mithril armor",
    classRestriction: ["warrior"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Dragonscale Armor",
    type: "armor",
    value: 250,
    rarity: "epic",
    defense: 15,
    attack: 3,
    description: "Armor forged from dragon scales",
    classRestriction: ["warrior"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Berserker's Harness",
    type: "armor",
    value: 150,
    rarity: "rare",
    defense: 10,
    attack: 5,
    description: "Light armor that enhances offensive capabilities",
    classRestriction: ["warrior"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Gladiator's Armor",
    type: "armor",
    value: 180,
    rarity: "rare",
    defense: 11,
    attack: 2,
    description: "Armor designed for mobility in arena combat",
    classRestriction: ["warrior"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Warlord's Plate",
    type: "armor",
    value: 220,
    rarity: "epic",
    defense: 14,
    attack: 4,
    description: "Imposing armor worn by battle commanders",
    classRestriction: ["warrior"],
    levelRequirement: 9,
  },
  {
    id: uuidv4(),
    name: "Volcanic Plate",
    type: "armor",
    value: 200,
    rarity: "epic",
    defense: 13,
    description: "Armor forged in volcanic heat, resistant to fire",
    classRestriction: ["warrior", "tank"],
    levelRequirement: 8,
  },
]

// Mage Armor
export const mageArmor: Item[] = [
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
    levelRequirement: 1,
  },
  {
    id: uuidv4(),
    name: "Enchanted Cloak",
    type: "armor",
    value: 45,
    rarity: "uncommon",
    defense: 3,
    magic: 5,
    description: "A cloak with minor enchantments",
    classRestriction: ["mage"],
    levelRequirement: 4,
  },
  {
    id: uuidv4(),
    name: "Archmage Vestments",
    type: "armor",
    value: 100,
    rarity: "rare",
    defense: 5,
    magic: 8,
    mana: 20,
    description: "Ornate vestments worn by archmages",
    classRestriction: ["mage"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Celestial Robes",
    type: "armor",
    value: 200,
    rarity: "epic",
    defense: 7,
    magic: 12,
    mana: 50,
    description: "Robes woven with threads of celestial energy",
    classRestriction: ["mage"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Astral Silk Garments",
    type: "armor",
    value: 150,
    rarity: "rare",
    defense: 4,
    magic: 10,
    mana: 30,
    description: "Garments made from silk infused with starlight",
    classRestriction: ["mage"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Void Walker's Shroud",
    type: "armor",
    value: 180,
    rarity: "rare",
    defense: 6,
    magic: 9,
    description: "A dark shroud that absorbs magical energy",
    classRestriction: ["mage"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Elemental Mantle",
    type: "armor",
    value: 220,
    rarity: "epic",
    defense: 6,
    magic: 11,
    mana: 40,
    description: "A mantle that shifts between elemental properties",
    classRestriction: ["mage"],
    levelRequirement: 9,
  },
  {
    id: uuidv4(),
    name: "Chronomancer's Attire",
    type: "armor",
    value: 250,
    rarity: "epic",
    defense: 8,
    magic: 13,
    description: "Robes that exist partially outside of normal time",
    classRestriction: ["mage"],
    levelRequirement: 10,
  },
]

// Tank Armor
export const tankArmor: Item[] = [
  {
    id: uuidv4(),
    name: "Heavy Iron Plate",
    type: "armor",
    value: 35,
    rarity: "common",
    defense: 6,
    description: "Exceptionally heavy iron armor",
    classRestriction: ["tank"],
    levelRequirement: 1,
  },
  {
    id: uuidv4(),
    name: "Reinforced Steel Plate",
    type: "armor",
    value: 70,
    rarity: "uncommon",
    defense: 10,
    description: "Steel plate with additional reinforcement",
    classRestriction: ["tank"],
    levelRequirement: 4,
  },
  {
    id: uuidv4(),
    name: "Dwarven Bulwark",
    type: "armor",
    value: 140,
    rarity: "rare",
    defense: 15,
    description: "Massive armor crafted by dwarven smiths",
    classRestriction: ["tank"],
    levelRequirement: 7,
  },
  {
    id: uuidv4(),
    name: "Adamantine Fortress",
    type: "armor",
    value: 280,
    rarity: "epic",
    defense: 20,
    description: "Nearly impenetrable armor made of adamantine",
    classRestriction: ["tank"],
    levelRequirement: 10,
  },
  {
    id: uuidv4(),
    name: "Juggernaut Plate",
    type: "armor",
    value: 160,
    rarity: "rare",
    defense: 17,
    description: "Extremely heavy armor that makes the wearer unstoppable",
    classRestriction: ["tank"],
    levelRequirement: 6,
  },
  {
    id: uuidv4(),
    name: "Stonehide Armor",
    type: "armor",
    value: 190,
    rarity: "rare",
    defense: 18,
    description: "Armor infused with earth magic for extra durability",
    classRestriction: ["tank"],
    levelRequirement: 8,
  },
  {
    id: uuidv4(),
    name: "Titan's Shell",
    type: "armor",
    value: 230,
    rarity: "epic",
    defense: 22,
    description: "Armor modeled after the legendary titans",
    classRestriction: ["tank"],
    levelRequirement: 9,
  },
  {
    id: uuidv4(),
    name: "Immortal's Aegis",
    type: "armor",
    value: 300,
    rarity: "epic",
    defense: 25,
    description: "Mythical armor said to grant immortality in battle",
    classRestriction: ["tank"],
    levelRequirement: 10,
  },
]

// Potions and Consumables
export const potions: Item[] = [
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
    name: "Greater Health Potion",
    type: "potion",
    value: 25,
    rarity: "uncommon",
    health: 50,
    description: "Restores 50 health points",
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
    name: "Greater Mana Potion",
    type: "potion",
    value: 25,
    rarity: "uncommon",
    mana: 50,
    description: "Restores 50 mana points",
  },
  {
    id: uuidv4(),
    name: "Elixir of Strength",
    type: "potion",
    value: 30,
    rarity: "rare",
    effect: "Increases attack by 5 for 3 turns",
    description: "Temporarily increases attack power",
  },
  {
    id: uuidv4(),
    name: "Elixir of Defense",
    type: "potion",
    value: 30,
    rarity: "rare",
    effect: "Increases defense by 5 for 3 turns",
    description: "Temporarily increases defense",
  },
  {
    id: uuidv4(),
    name: "Elixir of Magic",
    type: "potion",
    value: 30,
    rarity: "rare",
    effect: "Increases magic by 5 for 3 turns",
    description: "Temporarily increases magical power",
  },
  {
    id: uuidv4(),
    name: "Elixir of Dodge",
    type: "potion",
    value: 30,
    rarity: "rare",
    effect: "Increases dodge by 5 for 3 turns",
    description: "Temporarily increases dodge",
  },
  {
    id: uuidv4(),
    name: "Supreme Healing Elixir",
    type: "potion",
    value: 50,
    rarity: "epic",
    health: 100,
    description: "Restores 100 health points",
  },
  {
    id: uuidv4(),
    name: "Supreme Mana Elixir",
    type: "potion",
    value: 50,
    rarity: "epic",
    mana: 100,
    description: "Restores 100 mana points",
  },
  {
    id: uuidv4(),
    name: "Potion of Rejuvenation",
    type: "potion",
    value: 60,
    rarity: "epic",
    health: 50,
    mana: 50,
    description: "Restores 50 health and 50 mana points",
  },
  {
    id: uuidv4(),
    name: "Elixir of Heroes",
    type: "potion",
    value: 100,
    rarity: "legendary",
    effect: "Increases all stats by 3 for 5 turns",
    description: "A legendary elixir that enhances all abilities",
  },
  // New dodge potions
  {
    id: uuidv4(),
    name: "Potion of Evasion",
    type: "potion",
    value: 40,
    rarity: "rare",
    effect: "Increases dodge by 15% for 3 turns",
    description: "Makes you significantly harder to hit for a short time",
  },
  {
    id: uuidv4(),
    name: "Elixir of Shadows",
    type: "potion",
    value: 75,
    rarity: "epic",
    effect: "Increases dodge by 30% for 3 turns",
    description: "Your form becomes partially incorporeal, making attacks pass through you",
  },
]

// Accessories
export const accessories: Item[] = [
  {
    id: uuidv4(),
    name: "Ring of Health",
    type: "accessory",
    value: 50,
    rarity: "uncommon",
    health: 10,
    description: "Increases maximum health by 10",
  },
  {
    id: uuidv4(),
    name: "Amulet of Mana",
    type: "accessory",
    value: 50,
    rarity: "uncommon",
    mana: 10,
    description: "Increases maximum mana by 10",
  },
  {
    id: uuidv4(),
    name: "Warrior's Band",
    type: "accessory",
    value: 75,
    rarity: "rare",
    attack: 3,
    description: "Increases attack by 3",
    classRestriction: ["warrior", "tank"],
  },
  {
    id: uuidv4(),
    name: "Mage's Pendant",
    type: "accessory",
    value: 75,
    rarity: "rare",
    magic: 3,
    description: "Increases magic by 3",
    classRestriction: ["mage"],
  },
  {
    id: uuidv4(),
    name: "Agile Charm",
    type: "accessory",
    value: 75,
    rarity: "rare",
    attack: 2,
    dodge: 5,
    description: "Increases attack by 2 and dodge by 5%",
    classRestriction: ["warrior"],
  },
  {
    id: uuidv4(),
    name: "Evasive Locket",
    type: "accessory",
    value: 75,
    rarity: "rare",
    dodge: 8,
    description: "Increases dodge by 8%",
    classRestriction: ["mage", "warrior"],
  },
  {
    id: uuidv4(),
    name: "Guardian's Emblem",
    type: "accessory",
    value: 75,
    rarity: "rare",
    defense: 3,
    description: "Increases defense by 3",
    classRestriction: ["tank"],
  },
  {
    id: uuidv4(),
    name: "Ring of Vitality",
    type: "accessory",
    value: 100,
    rarity: "rare",
    health: 25,
    description: "Increases maximum health by 25",
  },
  {
    id: uuidv4(),
    name: "Arcane Circlet",
    type: "accessory",
    value: 100,
    rarity: "rare",
    mana: 25,
    description: "Increases maximum mana by 25",
  },
  {
    id: uuidv4(),
    name: "Berserker's Totem",
    type: "accessory",
    value: 150,
    rarity: "epic",
    attack: 5,
    health: -10,
    description: "Increases attack by 5 but reduces health by 10",
    classRestriction: ["warrior"],
  },
  {
    id: uuidv4(),
    name: "Sorcerer's Focus",
    type: "accessory",
    value: 150,
    rarity: "epic",
    magic: 5,
    mana: 15,
    description: "Increases magic by 5 and mana by 15",
    classRestriction: ["mage"],
  },
  {
    id: uuidv4(),
    name: "Nimble Talisman",
    type: "accessory",
    value: 150,
    rarity: "epic",
    attack: 4,
    dodge: 12,
    description: "Increases attack by 4 and dodge by 12%",
    classRestriction: ["warrior"],
  },
  {
    id: uuidv4(),
    name: "Shadow Talisman",
    type: "accessory",
    value: 150,
    rarity: "epic",
    dodge: 15,
    description: "Increases dodge by 15%",
    classRestriction: ["mage", "warrior"],
  },
  {
    id: uuidv4(),
    name: "Bulwark Medallion",
    type: "accessory",
    value: 150,
    rarity: "epic",
    defense: 6,
    description: "Increases defense by 6",
    classRestriction: ["tank"],
  },
  {
    id: uuidv4(),
    name: "Amulet of the Ancients",
    type: "accessory",
    value: 250,
    rarity: "legendary",
    health: 20,
    mana: 20,
    attack: 2,
    defense: 2,
    magic: 2,
    dodge: 5,
    description: "An ancient amulet that enhances all attributes",
  },
  {
    id: "acc-crit-1",
    name: "Lucky Charm",
    type: "accessory",
    value: 75,
    rarity: "uncommon",
    luck: 5,
    description: "A small charm that brings good fortune (+5% Luck)",
  },
  {
    id: "acc-crit-2",
    name: "Assassin's Mark",
    type: "accessory",
    value: 100,
    rarity: "rare",
    criticalHit: 8,
    description: "A symbol worn by elite assassins (+8% Critical Hit)",
    classRestriction: ["warrior", "tank"],
  },
  {
    id: "acc-crit-3",
    name: "Four-Leaf Clover",
    type: "accessory",
    value: 150,
    rarity: "rare",
    luck: 10,
    description: "A rare clover that brings exceptional luck (+10% Luck)",
  },
  {
    id: "acc-crit-4",
    name: "Precision Scope",
    type: "accessory",
    value: 200,
    rarity: "epic",
    criticalHit: 15,
    attack: 2,
    description: "A targeting device that helps find weak spots (+15% Critical Hit, +2 Attack)",
    classRestriction: ["warrior"],
  },
  {
    id: "acc-crit-5",
    name: "Golden Horseshoe",
    type: "accessory",
    value: 200,
    rarity: "epic",
    luck: 15,
    description: "A golden horseshoe that brings extraordinary luck (+15% Luck)",
  },
  {
    id: "acc-crit-6",
    name: "Executioner's Eye",
    type: "accessory",
    value: 250,
    rarity: "epic",
    criticalHit: 12,
    attack: 3,
    description: "Helps find the perfect spot for a killing blow (+12% Critical Hit, +3 Attack)",
    classRestriction: ["warrior", "tank"],
  },
  {
    id: "acc-crit-7",
    name: "Arcane Focus",
    type: "accessory",
    value: 250,
    rarity: "epic",
    criticalHit: 10,
    magic: 5,
    description: "Focuses magical energy for devastating spells (+10% Critical Hit, +5 Magic)",
    classRestriction: ["mage"],
  },
  {
    id: "acc-crit-8",
    name: "Gambler's Dice",
    type: "accessory",
    value: 300,
    rarity: "legendary",
    luck: 20,
    criticalHit: 5,
    description: "Enchanted dice that manipulate fate itself (+20% Luck, +5% Critical Hit)",
  },
  {
    id: "acc-crit-9",
    name: "Eye of the Dragon",
    type: "accessory",
    value: 500,
    rarity: "legendary",
    criticalHit: 25,
    attack: 5,
    description: "A dragon's eye that reveals every weakness (+25% Critical Hit, +5 Attack)",
    levelRequirement: 8,
  },
  {
    id: "acc-crit-10",
    name: "Fortune's Favor",
    type: "accessory",
    value: 500,
    rarity: "legendary",
    luck: 25,
    gold: 10,
    description: "The embodiment of good fortune (+25% Luck)",
    levelRequirement: 8,
  },
  // New dodge-focused accessories
  {
    id: uuidv4(),
    name: "Feather of Evasion",
    type: "accessory",
    value: 120,
    rarity: "rare",
    dodge: 10,
    description: "A magical feather that makes your movements lighter and quicker (+10% Dodge)",
    classRestriction: ["warrior", "mage"],
  },
  {
    id: uuidv4(),
    name: "Phantom Veil",
    type: "accessory",
    value: 180,
    rarity: "epic",
    dodge: 15,
    description: "A veil that makes your form partially incorporeal (+15% Dodge)",
    classRestriction: ["mage"],
  },
  {
    id: uuidv4(),
    name: "Shadowdancer's Boots",
    type: "accessory",
    value: 200,
    rarity: "epic",
    dodge: 18,
    description: "Enchanted boots that allow you to step between shadows (+18% Dodge)",
    classRestriction: ["warrior"],
  },
  {
    id: uuidv4(),
    name: "Amulet of Displacement",
    type: "accessory",
    value: 250,
    rarity: "epic",
    dodge: 20,
    description: "Makes your exact position difficult to determine (+20% Dodge)",
  },
  {
    id: uuidv4(),
    name: "Mirage Band",
    type: "accessory",
    value: 350,
    rarity: "legendary",
    dodge: 25,
    description: "Creates illusory duplicates that confuse enemies (+25% Dodge)",
    levelRequirement: 7,
  },
]

// Get all items
export const getAllItems = (): Item[] => {
  return [
    ...warriorWeapons,
    ...mageWeapons,
    ...tankWeapons,
    ...warriorArmor,
    ...mageArmor,
    ...tankArmor,
    ...potions,
    ...accessories,
  ]
}

// Get all weapons
export const getAllWeapons = (): Item[] => {
  return [...warriorWeapons, ...mageWeapons, ...tankWeapons]
}

// Get all armor
export const getAllArmor = (): Item[] => {
  return [...warriorArmor, ...mageArmor, ...tankArmor]
}

// Get all accessories
export const getAllAccessories = (): Item[] => {
  return [...accessories]
}

// Get items for a specific class
export const getItemsForClass = (characterClass: CharacterClass): Item[] => {
  return getAllItems().filter((item) => !item.classRestriction || item.classRestriction.includes(characterClass))
}

// Get items available at a specific level
export const getItemsForLevel = (characterClass: CharacterClass, level: number): Item[] => {
  return getItemsForClass(characterClass).filter((item) => !item.levelRequirement || item.levelRequirement <= level)
}

export const shopItems: Item[] = [
  {
    id: uuidv4(),
    name: "Minor Healing Potion",
    type: "potion",
    value: 20,
    rarity: "common",
    health: 30,
    description: "Restores 30 health points",
  },
  {
    id: uuidv4(),
    name: "Lesser Mana Potion",
    type: "potion",
    value: 20,
    rarity: "common",
    mana: 30,
    description: "Restores 30 mana points",
  },
  {
    id: uuidv4(),
    name: "Durable Shield",
    type: "armor",
    value: 80,
    rarity: "uncommon",
    defense: 7,
    description: "A sturdy shield that provides good protection",
    classRestriction: ["warrior", "tank"],
  },
  {
    id: uuidv4(),
    name: "Magic Amulet",
    type: "accessory",
    value: 120,
    rarity: "rare",
    magic: 6,
    description: "An amulet that enhances magical abilities",
    classRestriction: ["mage"],
  },
  {
    id: uuidv4(),
    name: "Swift Boots",
    type: "armor",
    value: 90,
    rarity: "uncommon",
    dodge: 8,
    description: "Boots that allow for quieter movement",
    classRestriction: ["warrior", "mage"],
  },
  {
    id: uuidv4(),
    name: "Sharpened Dagger",
    type: "weapon",
    value: 70,
    rarity: "uncommon",
    attack: 7,
    description: "A well-crafted dagger for swift attacks",
    classRestriction: ["warrior"],
  },
  {
    id: uuidv4(),
    name: "Reinforced Helm",
    type: "armor",
    value: 110,
    rarity: "rare",
    defense: 9,
    description: "A sturdy helm that protects the head",
    classRestriction: ["warrior", "tank"],
  },
  {
    id: uuidv4(),
    name: "Enchanted Bracers",
    type: "armor",
    value: 130,
    rarity: "rare",
    magic: 7,
    description: "Bracers that enhance magical power",
    classRestriction: ["mage"],
  },
  {
    id: uuidv4(),
    name: "Evasion Cloak",
    type: "armor",
    value: 140,
    rarity: "rare",
    dodge: 12,
    description: "A cloak that helps evade attacks",
    classRestriction: ["warrior", "mage"],
  },
  // New dodge-focused shop items
  {
    id: uuidv4(),
    name: "Nimble Gloves",
    type: "accessory",
    value: 100,
    rarity: "uncommon",
    dodge: 7,
    description: "Lightweight gloves that improve reflexes (+7% Dodge)",
  },
  {
    id: uuidv4(),
    name: "Elixir of Reflexes",
    type: "potion",
    value: 50,
    rarity: "rare",
    effect: "Increases dodge by 20% for 3 turns",
    description: "Enhances your reflexes to avoid attacks",
  },
]

