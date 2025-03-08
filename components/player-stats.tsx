"use client"

import { useGameState } from "@/lib/game-state"
import { Progress } from "@/components/ui/progress"

export function PlayerStats() {
  const { player, gameState } = useGameState()

  // Calculate experience percentage
  const experienceToLevel = player.level * player.level * 50
  const experiencePercentage = (player.experience / experienceToLevel) * 100

  // Get environment theme based on dungeon level
  const getThemeColors = () => {
    const level = gameState.dungeonLevel
    // Cycle through themes: forest (green), desert (yellow), cave (dark)
    switch (level % 3) {
      case 1:
        return {
          bg: "bg-green-950",
          accent: "bg-green-800",
          text: "text-green-100",
        }
      case 2:
        return {
          bg: "bg-yellow-900",
          accent: "bg-yellow-800",
          text: "text-yellow-100",
        }
      case 0:
        return {
          bg: "bg-slate-950",
          accent: "bg-slate-800",
          text: "text-blue-100",
        }
      default:
        return {
          bg: "bg-gray-900",
          accent: "bg-gray-800",
          text: "text-gray-100",
        }
    }
  }

  const theme = getThemeColors()

  // Get class emoji
  const getClassEmoji = () => {
    switch (player.class) {
      case "warrior":
        return "⚔️"
      case "mage":
        return "🧙"
      case "ranger":
        return "🏹"
      case "thief":
        return "🗡️"
      case "tank":
        return "🛡️"
      default:
        return "🧙"
    }
  }

  return (
    <div className={`border border-gray-700 rounded-lg p-3 ${theme.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{getClassEmoji()}</span>
        <h2 className={`text-xl font-bold ${theme.text}`}>
          {player.name} - Level {player.level} {player.class}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Health */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Health</span>
            <span>
              {player.health}/{player.maxHealth}
            </span>
          </div>
          <Progress value={(player.health / player.maxHealth) * 100} className="h-2 bg-gray-700" />
        </div>

        {/* Mana */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Mana</span>
            <span>
              {player.mana}/{player.maxMana}
            </span>
          </div>
          <Progress value={(player.mana / player.maxMana) * 100} className="h-2 bg-gray-700" />
        </div>

        {/* Experience */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Experience</span>
            <span>
              {player.experience}/{experienceToLevel}
            </span>
          </div>
          <Progress value={experiencePercentage} className="h-2 bg-gray-700" />
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm ${theme.accent} p-2 rounded-md`}>
          <div>Attack: {player.attack}</div>
          <div>Defense: {player.defense}</div>
          <div>Magic: {player.magic}</div>
          <div>
            Dodge: {player.dodge >= 80 ? <span className="text-green-400">80% (MAX)</span> : `${player.dodge}%`}
          </div>
          {/* New stats */}
          <div className="text-red-400">Critical: {player.criticalHit}%</div>
          <div className="text-yellow-300">Luck: {player.luck}%</div>
          <div className="col-span-2 text-yellow-400">Gold: {player.gold}</div>

          {player.skillPoints > 0 && (
            <div className="col-span-2 text-yellow-400 mt-1">Skill Points: {player.skillPoints}</div>
          )}
        </div>

        {/* Equipment Section */}
        <div className={`mt-2 pt-2 border-t border-gray-700`}>
          <h3 className="font-bold text-sm mb-2">Equipment</h3>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Weapon:</span>
              <span className="text-sm bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                {player.equipment.weapon ? <>⚔️ {player.equipment.weapon.name}</> : "None"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Armor:</span>
              <span className="text-sm bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                {player.equipment.armor ? <>🛡️ {player.equipment.armor.name}</> : "None"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Accessory:</span>
              <span className="text-sm bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                {player.equipment.accessory ? <>💍 {player.equipment.accessory.name}</> : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

