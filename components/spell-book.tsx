"use client"

import { useState } from "react"
import { useGameState } from "@/lib/game-state"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wand, Flame } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SpellBook() {
  const { player } = useGameState()
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null)

  // Group spells by damage, healing, and utility
  const damageSpells = player.knownSpells.filter((spell) => spell.damage)
  const healingSpells = player.knownSpells.filter((spell) => spell.healing)
  const utilitySpells = player.knownSpells.filter((spell) => !spell.damage && !spell.healing)

  // Get the selected spell details
  const selectedSpell = player.knownSpells.find((spell) => spell.id === selectedSpellId)

  // Get spell type color
  const getSpellTypeColor = (spell: (typeof player.knownSpells)[0]) => {
    if (spell.damage) return "text-red-400"
    if (spell.healing) return "text-green-400"
    return "text-blue-400"
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wand className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold">Spellbook ({player.knownSpells.length})</h3>
        </div>
        {player.class !== "mage" && <span className="text-xs text-amber-400">Max 2 spells</span>}
      </div>

      {player.knownSpells.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No spells learned yet.</p>
      ) : (
        <div className="space-y-3">
          <ScrollArea className="h-28 rounded-md border border-gray-700 p-2">
            <div className="space-y-2">
              {damageSpells.length > 0 && (
                <div>
                  <p className="text-xs text-red-400 mb-1">Damage</p>
                  <div className="grid grid-cols-2 gap-1">
                    {damageSpells.map((spell) => (
                      <TooltipProvider key={spell.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1 w-full text-left ${
                                selectedSpellId === spell.id
                                  ? "bg-gray-700 border border-gray-500"
                                  : "bg-gray-800 hover:bg-gray-700"
                              }`}
                              onClick={() => setSelectedSpellId(spell.id)}
                            >
                              <Flame className="w-3 h-3 text-red-400 flex-shrink-0" />
                              <span className="truncate">{spell.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                            <div className="max-w-xs">
                              <p className="font-bold">{spell.name}</p>
                              <p className="text-xs text-blue-400">Mana Cost: {spell.manaCost}</p>
                              <p className="text-xs text-red-400">Damage: {spell.damage}</p>
                              <p className="text-xs mt-1">{spell.description}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}

              {healingSpells.length > 0 && (
                <div>
                  <p className="text-xs text-green-400 mb-1">Healing</p>
                  <div className="grid grid-cols-2 gap-1">
                    {healingSpells.map((spell) => (
                      <TooltipProvider key={spell.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1 w-full text-left ${
                                selectedSpellId === spell.id
                                  ? "bg-gray-700 border border-gray-500"
                                  : "bg-gray-800 hover:bg-gray-700"
                              }`}
                              onClick={() => setSelectedSpellId(spell.id)}
                            >
                              <Flame className="w-3 h-3 text-green-400 flex-shrink-0" />
                              <span className="truncate">{spell.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                            <div className="max-w-xs">
                              <p className="font-bold">{spell.name}</p>
                              <p className="text-xs text-blue-400">Mana Cost: {spell.manaCost}</p>
                              <p className="text-xs text-green-400">Healing: {spell.healing}</p>
                              <p className="text-xs mt-1">{spell.description}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}

              {utilitySpells.length > 0 && (
                <div>
                  <p className="text-xs text-blue-400 mb-1">Utility</p>
                  <div className="grid grid-cols-2 gap-1">
                    {utilitySpells.map((spell) => (
                      <TooltipProvider key={spell.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1 w-full text-left ${
                                selectedSpellId === spell.id
                                  ? "bg-gray-700 border border-gray-500"
                                  : "bg-gray-800 hover:bg-gray-700"
                              }`}
                              onClick={() => setSelectedSpellId(spell.id)}
                            >
                              <Flame className="w-3 h-3 text-blue-400 flex-shrink-0" />
                              <span className="truncate">{spell.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                            <div className="max-w-xs">
                              <p className="font-bold">{spell.name}</p>
                              <p className="text-xs text-blue-400">Mana Cost: {spell.manaCost}</p>
                              {spell.effect && <p className="text-xs text-purple-400">Effect: {spell.effect}</p>}
                              <p className="text-xs mt-1">{spell.description}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {selectedSpell && (
            <div className="bg-gray-800 p-2 rounded border border-gray-700">
              <div className="flex justify-between items-start">
                <h4 className={`font-bold text-sm ${getSpellTypeColor(selectedSpell)}`}>{selectedSpell.name}</h4>
                <span className="text-xs text-blue-400">Mana: {selectedSpell.manaCost}</span>
              </div>
              <p className="text-xs mt-1">{selectedSpell.description}</p>
              {selectedSpell.damage && <p className="text-xs text-red-400 mt-1">Damage: {selectedSpell.damage}</p>}
              {selectedSpell.healing && <p className="text-xs text-green-400 mt-1">Healing: {selectedSpell.healing}</p>}
              {selectedSpell.effect && <p className="text-xs text-purple-400 mt-1">Effect: {selectedSpell.effect}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

