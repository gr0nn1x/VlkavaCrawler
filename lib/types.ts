export interface MapTile {
  type: "wall" | "floor" | "door" | "chest" | "shop" | "wizard" | "shrine" | "boss" | "portal"
  explored: boolean
}

export type CharacterClass = "warrior" | "mage" | "tank"

export interface Player {
  name: string
  class: CharacterClass
  level: number
  experience: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  attack: number
  defense: number
  magic: number
  dodge: number // Changed from stealth to dodge
  // Add new stats for critical hit and luck
  criticalHit: number
  luck: number
  // Add base stats to track original values
  baseAttack?: number
  baseDefense?: number
  baseMagic?: number
  baseDodge?: number // Changed from baseStealth to baseDodge
  baseCriticalHit?: number
  baseLuck?: number
  x: number
  y: number
  inventory: Item[]
  gold: number
  skillPoints: number
  knownSpells: Spell[]
  equipment: {
    weapon: Item | null
    armor: Item | null
    accessory: Item | null
  }
}

export interface Enemy {
  id: number
  name: string
  race:
    | "dragon"
    | "skeleton"
    | "human"
    | "elf"
    | "dwarf"
    | "halfling"
    | "mimic"
    | "undead"
    | "boss"
    | "rat"
    | "wolf"
    | "bear"
    | "spider"
    | "goblin"
    | "troll"
    | "ogre"
    | "ghost"
  symbol: string
  level: number
  health: number
  maxHealth: number
  attack: number
  defense: number
  magic: number
  dodge?: number // Added dodge chance for enemies
  x: number
  y: number
  loot?: Item[]
  goldValue: number
  expValue: number
  isBoss?: boolean
}

export interface Item {
  id: string
  name: string
  type: "weapon" | "armor" | "potion" | "accessory" | "scroll" | "shield"
  value: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  attack?: number
  defense?: number
  magic?: number
  dodge?: number // Changed from stealth to dodge
  health?: number
  mana?: number
  criticalHit?: number
  luck?: number
  effect?: string
  description?: string
  classRestriction?: CharacterClass[]
  levelRequirement?: number
}

export interface Spell {
  id: string
  name: string
  manaCost: number
  damage?: number
  healing?: number
  effect?: string
  description: string
  classRestriction?: CharacterClass[]
  levelRequirement?: number
  price?: number
}

export interface GameState {
  dungeonLevel: number
  playerPosition: { x: number; y: number }
  cameraPosition: { x: number; y: number }
  visibleTiles: Set<string>
}

// Update GameStateContextType to include wizard shop and class selection
export interface GameStateContextType {
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
  handleClassSelection: (characterClass: CharacterClass) => void
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
  sellItem: (item: Item) => void // New function to sell items
  levelShopInventory: Map<number, Item[]> // Update to include levelShopInventory
}

