"use client"

import { useEffect, useState } from "react"
import MainMenu from "@/components/main-menu"
import SkillTree from "@/components/skill-tree"
import { GameStateProvider } from "@/lib/game-state"
import { AudioProvider } from "@/components/audio-system"
import GameWrapper from "@/components/game-wrapper"
import { loadGameData, saveGameData, type GameData } from "@/lib/storage"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "game" | "skillTree">("menu")
  const [gameData, setGameData] = useState<GameData>({
    maxScore: 0,
    skillPoints: 0,
    upgrades: {
      health: 0,
      attack: 0,
      defense: 0,
      magic: 0,
      dodge: 0,
      mana: 0,
      criticalHit: 0,
      luck: 0,
    },
  })

  // Load game data from local storage on initial render
  useEffect(() => {
    const savedData = loadGameData()
    if (savedData) {
      setGameData(savedData)
    }
  }, [])

  // Save game data whenever it changes
  useEffect(() => {
    saveGameData(gameData)
  }, [gameData])

  // Fix the handleStartGame function to ensure it properly transitions to the game screen
  const handleStartGame = () => {
    // Ensure we're setting the screen state directly to "game"
    setCurrentScreen("game")
  }

  const updateMaxScore = (score: number) => {
    if (score > gameData.maxScore) {
      setGameData((prev) => ({
        ...prev,
        maxScore: score,
        skillPoints: prev.skillPoints + Math.floor(score / 100) - Math.floor(prev.maxScore / 100),
      }))
    }
  }

  // Add a useEffect to handle game over state and update maxScore
  useEffect(() => {
    // Listen for a custom event that could be dispatched when the game ends
    const handleGameOver = (event: CustomEvent) => {
      const score = event.detail?.score || 0
      updateMaxScore(score)
    }

    window.addEventListener("gameOver" as any, handleGameOver)

    return () => {
      window.removeEventListener("gameOver" as any, handleGameOver)
    }
  }, [])

  const purchaseUpgrade = (
    type: "health" | "attack" | "defense" | "magic" | "dodge" | "mana" | "criticalHit" | "luck",
  ) => {
    if (gameData.skillPoints > 0) {
      setGameData((prev) => ({
        ...prev,
        skillPoints: prev.skillPoints - 1,
        upgrades: {
          ...prev.upgrades,
          [type]: prev.upgrades[type] + 1,
        },
      }))
      return true
    }
    return false
  }

  return (
    <AudioProvider>
      <GameStateProvider>
        <main className="flex min-h-screen flex-col items-center justify-between p-2 bg-black text-white">
          {currentScreen === "menu" && (
            <MainMenu
              onStartGame={handleStartGame}
              onSkillTree={() => setCurrentScreen("skillTree")}
              maxScore={gameData.maxScore}
              skillPoints={gameData.skillPoints}
            />
          )}

          {currentScreen === "skillTree" && (
            <SkillTree
              onBack={() => setCurrentScreen("menu")}
              skillPoints={gameData.skillPoints}
              upgrades={gameData.upgrades}
              purchaseUpgrade={purchaseUpgrade}
            />
          )}

          {currentScreen === "game" && <GameWrapper />}
        </main>
      </GameStateProvider>
    </AudioProvider>
  )
}

