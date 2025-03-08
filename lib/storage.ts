export interface GameData {
  maxScore: number
  skillPoints: number
  upgrades: {
    health: number
    attack: number
    defense: number
    magic: number
    dodge: number
    mana: number
    criticalHit: number
    luck: number
  }
}

const STORAGE_KEY = "vlkava-dungeons-data"

export function saveGameData(data: GameData): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save game data:", error)
    }
  }
}

export function loadGameData(): GameData | null {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data) as GameData
      }
    } catch (error) {
      console.error("Failed to load game data:", error)
    }
  }

  return null
}

export function clearGameData(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear game data:", error)
    }
  }
}

