"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Sword, Wand } from "lucide-react"
import type { CharacterClass } from "@/lib/types"
import { useGameState } from "@/lib/game-state"

interface ClassSelectionProps {
  onSelectClass?: (characterClass: CharacterClass) => void
}

export function ClassSelection({ onSelectClass }: ClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)
  const { handleClassSelection } = useGameState()

  const handleSelectClass = (characterClass: CharacterClass) => {
    setSelectedClass(characterClass)
  }

  const handleConfirm = () => {
    if (selectedClass) {
      if (onSelectClass) {
        onSelectClass(selectedClass)
      } else {
        // Use the game state's handleClassSelection if no prop is provided
        handleClassSelection(selectedClass)
      }
    }
  }

  const classes: {
    id: CharacterClass
    name: string
    icon: React.ReactNode
    description: string
    stats: string[]
    startingItems: string[]
  }[] = [
    {
      id: "tank",
      name: "Tank",
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      description: "A sturdy defender with high health and defense.",
      stats: ["Health: 70 (+40% more)", "Defense: 5 (+66% more)", "Attack: 4", "Mana: 20"],
      startingItems: ["Tower Shield & Spear", "Heavy Iron Plate", "Health Potion (x2)"],
    },
    {
      id: "mage",
      name: "Mage",
      icon: <Wand className="w-12 h-12 text-purple-400" />,
      description: "A powerful spellcaster with high mana and magical abilities. Can learn unlimited spells.",
      stats: ["Health: 40", "Defense: 2", "Magic: 6 (+200% more)", "Mana: 50 (+66% more)"],
      startingItems: ["Apprentice Staff", "Apprentice Robes", "Mana Potion (x2)", "3 Starting Spells"],
    },
    {
      id: "warrior",
      name: "Warrior",
      icon: <Sword className="w-12 h-12 text-red-400" />,
      description: "A skilled fighter with high attack power and balanced stats.",
      stats: ["Health: 60 (+20% more)", "Defense: 3", "Attack: 7 (+40% more)", "Mana: 20"],
      startingItems: ["Steel Greatsword", "Steel Plate", "Health Potion"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Class</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {classes.map((classOption) => (
            <Card
              key={classOption.id}
              className={`p-4 cursor-pointer transition-all border-2 ${
                selectedClass === classOption.id
                  ? "border-yellow-500 bg-gray-800"
                  : "border-gray-700 bg-gray-800 hover:border-gray-500"
              }`}
              onClick={() => handleSelectClass(classOption.id)}
            >
              <div className="flex flex-col items-center mb-4">
                <div className="mb-2">{classOption.icon}</div>
                <h3 className="text-xl font-bold">{classOption.name}</h3>
              </div>

              <p className="text-sm text-gray-300 mb-4">{classOption.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold mb-1 text-sm">Stats:</h4>
                <ul className="text-sm text-gray-300">
                  {classOption.stats.map((stat, index) => (
                    <li key={index} className="mb-1">
                      • {stat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-1 text-sm">Starting Items:</h4>
                <ul className="text-sm text-gray-300">
                  {classOption.startingItems.map((item, index) => (
                    <li key={index} className="mb-1">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleConfirm} disabled={!selectedClass} className="px-8">
            Begin Adventure
          </Button>
        </div>
      </div>
    </div>
  )
}

