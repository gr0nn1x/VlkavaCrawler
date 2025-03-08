"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/lib/use-local-storage"
import { useAudio } from "@/components/audio-system"

interface SkillTreeProps {
  onBack: () => void
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
  purchaseUpgrade: (stat: keyof SkillTreeProps["upgrades"]) => void
}

export default function SkillTree({ onBack, skillPoints, upgrades, purchaseUpgrade }: SkillTreeProps) {
  const [maxScore, setMaxScore] = useLocalStorage("maxScore", 0)
  const [lastScore, setLastScore] = useState(0)
  const { playSound, audioAvailable } = useAudio()

  // Load the last score and calculate available skill points
  useEffect(() => {
    try {
      const storedLastScore = localStorage.getItem("lastScore")
      if (storedLastScore) {
        const parsedLastScore = Number.parseInt(storedLastScore, 10)
        setLastScore(parsedLastScore)

        // Calculate skill points based on the last score (1 point per 100 score)
        const earnedPoints = Math.floor(parsedLastScore / 100)
      }
    } catch (error) {
      console.error("Failed to load last score:", error)
    }
  }, [])

  const handleUpgrade = (stat: keyof SkillTreeProps["upgrades"]) => {
    if (skillPoints > 0) {
      if (audioAvailable) {
        playSound("buttonClick")
      }

      purchaseUpgrade(stat)
    }
  }

  const getStatDescription = (stat: string) => {
    switch (stat) {
      case "health":
        return "+10 Max Health"
      case "attack":
        return "+1 Attack"
      case "defense":
        return "+1 Defense"
      case "magic":
        return "+1 Magic"
      case "dodge":
        return "+1% Dodge Chance"
      case "mana":
        return "+10 Max Mana"
      case "criticalHit":
        return "+2% Critical Hit Chance"
      case "luck":
        return "+2% Luck"
      default:
        return ""
    }
  }

  const handleBackClick = () => {
    if (audioAvailable) {
      playSound("buttonClick")
    }
    onBack()
  }

  return (
    <div className="bg-gray-900 border border-purple-700 rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-300">Skill Tree</h2>
        <div className="text-right">
          <div className="text-purple-400 font-mono">HIGH SCORE: {maxScore}</div>
          <div className="text-purple-400 font-mono">LAST SCORE: {lastScore}</div>
          <div className="text-green-400 font-mono">SKILL POINTS: {skillPoints}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(upgrades).map(([stat, level]) => (
          <div key={stat} className="bg-black border border-purple-700 rounded-lg p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-1 capitalize text-purple-300">{stat.replace(/([A-Z])/g, " $1")}</h3>
            <div className="text-3xl font-bold mb-2 text-white">{level}</div>
            <div className="text-sm text-gray-400 mb-3">{getStatDescription(stat)}</div>
            <Button
              size="sm"
              className="w-full bg-purple-900 hover:bg-purple-800 border border-purple-700"
              disabled={skillPoints <= 0}
              onClick={() => handleUpgrade(stat as keyof SkillTreeProps["upgrades"])}
            >
              Upgrade
            </Button>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400 mb-4">
        <p>Permanent upgrades are applied to your character at the start of each run.</p>
        <p>Earn 1 skill point for every 100 score in your last run.</p>
      </div>

      <Button onClick={handleBackClick} className="bg-purple-900 hover:bg-purple-800 border border-purple-700">
        Back to Menu
      </Button>
    </div>
  )
}

