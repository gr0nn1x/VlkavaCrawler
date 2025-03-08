"use client"

import { useState, useEffect, useCallback } from "react"
import { GameStateProvider, useGameState } from "@/lib/game-state"
import MainMenu from "./main-menu"
import { ClassSelection } from "./class-selection"
import { GameOver } from "./game-over"
import { AudioProvider } from "./audio-provider"
import { Codex } from "./codex"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { Inventory } from "./inventory"
import { SpellBook } from "./spell-book"
import { GameMap } from "./game-map"
import { SkillPoints } from "./skill-points"
import { PlayerStats } from "./player-stats"
import { TouchControls } from "./touch-controls"
import { Minimap } from "./minimap"
import { ChestLoot } from "./chest-loot"
import { Shop } from "./shop"
import { WizardShop } from "./wizard-shop"
import { AudioControls } from "./audio-controls"
import { Combat } from "./combat"
import SkillTree from "./skill-tree"
import { loadGameData, saveGameData, type GameData } from "@/lib/storage"

function GameContent() {
  const {
    showClassSelection,
    gameOver,
    player,
    restartGame,
    showCodex,
    inCombat,
    activeEnemy,
    chestContents,
    showShop,
    showWizardShop,
    applyPermanentUpgrades, // Add this line to get the function
  } = useGameState()
  const [showMainMenu, setShowMainMenu] = useState(true)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showSkillTree, setShowSkillTree] = useState(false)
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

  // Add a new useEffect after the one that loads game data to apply the upgrades
  // Add this after the "Load game data from local storage on initial render" useEffect
  // Apply permanent upgrades to player when game starts or returns from skill tree
  useEffect(() => {
    if (!showMainMenu && !showGameOver && !showSkillTree && gameData.upgrades) {
      // Apply the upgrades
      applyPermanentUpgrades(gameData.upgrades)
    }
  }, [showMainMenu, showGameOver, showSkillTree, gameData.upgrades, applyPermanentUpgrades])

  // Save game data whenever it changes
  useEffect(() => {
    saveGameData(gameData)
  }, [gameData])

  // Handle game over state
  useEffect(() => {
    if (gameOver) {
      setShowGameOver(true)

      // Save high score if current level is higher
      if (typeof window !== "undefined") {
        const currentHighScore = localStorage.getItem("highScore")
        const currentScore = player.level * 100 + player.experience

        if (!currentHighScore || currentScore > Number.parseInt(currentHighScore)) {
          localStorage.setItem("highScore", currentScore.toString())

          // Update game data with new high score
          setGameData((prev) => ({
            ...prev,
            maxScore: currentScore,
            skillPoints: prev.skillPoints + Math.floor(currentScore / 100) - Math.floor(prev.maxScore / 100),
          }))
        }
      }
    }
  }, [gameOver, player.level, player.experience])

  // Handle return to main menu from game over screen
  const handleReturnToMainMenu = useCallback(() => {
    setShowGameOver(false)
    setShowMainMenu(true)
  }, [])

  // Handle start game from main menu
  const handleStartGame = useCallback(() => {
    // Immediately hide the main menu when starting the game
    setShowMainMenu(false)
    setShowSkillTree(false)
  }, [])

  // Handle skill tree button click
  const handleSkillTree = useCallback(() => {
    setShowMainMenu(false)
    setShowSkillTree(true)
  }, [])

  // Handle back from skill tree
  const handleBackFromSkillTree = useCallback(() => {
    setShowSkillTree(false)
    setShowMainMenu(true)
  }, [])

  // Purchase upgrade
  const purchaseUpgrade = useCallback(
    (type: "health" | "attack" | "defense" | "magic" | "dodge" | "mana" | "criticalHit" | "luck") => {
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
    },
    [gameData.skillPoints],
  )

  // Handle ESC key to show main menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showMainMenu && !showClassSelection && !gameOver && !showCodex && !showSkillTree) {
        setShowMainMenu(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showMainMenu, showClassSelection, gameOver, showCodex, showSkillTree])

  // Render the appropriate UI based on game state
  if (showMainMenu) {
    return (
      <MainMenu
        onStartGame={handleStartGame}
        onSkillTree={handleSkillTree}
        maxScore={gameData.maxScore}
        skillPoints={gameData.skillPoints}
      />
    )
  }

  if (showSkillTree) {
    return (
      <SkillTree
        onBack={handleBackFromSkillTree}
        skillPoints={gameData.skillPoints}
        upgrades={gameData.upgrades}
        purchaseUpgrade={purchaseUpgrade}
      />
    )
  }

  if (showClassSelection) {
    return <ClassSelection />
  }

  if (showGameOver) {
    return <GameOver onReturnToMainMenu={handleReturnToMainMenu} />
  }

  if (showCodex) {
    return <Codex />
  }

  // Render the actual game UI directly
  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-center">Vlkava Dungeons</h1>
        <div className="flex items-center gap-2">
          <div className="text-yellow-400 font-mono">SCORE: {player.experience + player.level * 100}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMainMenu(true)}
            className="bg-red-900 hover:bg-red-800 border-red-700"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Left column - Inventory and SpellBook */}
        <div className="lg:w-1/3 space-y-4">
          <Inventory />
          {inCombat && activeEnemy ? <Combat /> : <SpellBook />}
        </div>

        {/* Middle column - Game Map (Dungeon Level) and Skill Points */}
        <div className="lg:w-1/3 space-y-4">
          <GameMap />
          {player.skillPoints > 0 && <SkillPoints className="mt-4" />}
        </div>

        {/* Right column - Player Stats, Controls */}
        <div className="lg:w-1/3 space-y-4">
          <PlayerStats />
          <div className="grid grid-cols-2 gap-4">
            <TouchControls />
            <Minimap />
          </div>
        </div>
      </div>

      {/* Chest Loot Modal */}
      {chestContents.isOpen && <ChestLoot />}

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-transparent max-w-4xl w-full">
            <Shop />
          </div>
        </div>
      )}

      {/* Wizard Shop Modal */}
      {showWizardShop && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-transparent max-w-4xl w-full">
            <WizardShop />
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <AudioControls />
    </div>
  )
}

export default function GameWrapper() {
  return (
    <AudioProvider>
      <GameStateProvider>
        <GameContent />
      </GameStateProvider>
    </AudioProvider>
  )
}

