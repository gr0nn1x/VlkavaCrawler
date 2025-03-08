"use client"

import { useGameState } from "@/lib/game-state"
import { Button } from "@/components/ui/button"

export function SkillPoints({ className }: { className?: string }) {
  const { player, increaseAttribute } = useGameState()

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-2 text-yellow-400">Skill Points</h2>
      <p className="text-sm text-gray-400 mb-4">You have {player.skillPoints} skill points to spend.</p>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => increaseAttribute("health")} disabled={player.skillPoints <= 0}>
          Increase Health (+10)
        </Button>
        <Button onClick={() => increaseAttribute("attack")} disabled={player.skillPoints <= 0}>
          Increase Attack (+1)
        </Button>
        <Button onClick={() => increaseAttribute("defense")} disabled={player.skillPoints <= 0}>
          Increase Defense (+1)
        </Button>
        <Button onClick={() => increaseAttribute("magic")} disabled={player.skillPoints <= 0}>
          Increase Magic (+1)
        </Button>
        <Button onClick={() => increaseAttribute("dodge")} disabled={player.skillPoints <= 0}>
          Increase Dodge (+1%)
        </Button>
        <Button onClick={() => increaseAttribute("mana")} disabled={player.skillPoints <= 0}>
          Increase Mana (+10)
        </Button>
        <Button onClick={() => increaseAttribute("criticalHit")} disabled={player.skillPoints <= 0}>
          Increase Critical Hit (+2%)
        </Button>
        <Button onClick={() => increaseAttribute("luck")} disabled={player.skillPoints <= 0}>
          Increase Luck (+2%)
        </Button>
      </div>
    </div>
  )
}

