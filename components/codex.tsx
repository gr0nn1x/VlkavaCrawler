"use client"

import { useState, useMemo } from "react"
import { useGameState } from "@/lib/game-state"
import type { CodexEntry, CodexCategory } from "@/lib/codex-data"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"

export function Codex() {
  const { codexEntries, setShowCodex } = useGameState()
  const [selectedCategory, setSelectedCategory] = useState<CodexCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Count discovered entries by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; discovered: number }> = {
      all: { total: codexEntries.length, discovered: 0 },
      weapon: { total: 0, discovered: 0 },
      armor: { total: 0, discovered: 0 },
      accessory: { total: 0, discovered: 0 },
      potion: { total: 0, discovered: 0 },
      enemy: { total: 0, discovered: 0 },
      spell: { total: 0, discovered: 0 },
      location: { total: 0, discovered: 0 },
    }

    codexEntries.forEach((entry) => {
      counts[entry.category].total++
      if (entry.discovered) {
        counts[entry.category].discovered++
        counts.all.discovered++
      }
    })

    return counts
  }, [codexEntries])

  // Filter entries based on selected category and search query
  const filteredEntries = useMemo(() => {
    return codexEntries.filter((entry) => {
      // Filter by category
      if (selectedCategory !== "all" && entry.category !== selectedCategory) {
        return false
      }

      // Filter by search query
      if (searchQuery && !entry.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
  }, [codexEntries, selectedCategory, searchQuery])

  // Group entries by category for better organization
  const groupedEntries = useMemo(() => {
    const grouped: Record<string, CodexEntry[]> = {}

    filteredEntries.forEach((entry) => {
      if (!grouped[entry.category]) {
        grouped[entry.category] = []
      }
      grouped[entry.category].push(entry)
    })

    // Sort entries within each category
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => {
        // First sort by discovered status
        if (a.discovered && !b.discovered) return -1
        if (!a.discovered && b.discovered) return 1

        // Then sort alphabetically by name
        return a.name.localeCompare(b.name)
      })
    })

    return grouped
  }, [filteredEntries])

  // Get category display name
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      weapon: "Weapons",
      armor: "Armor",
      accessory: "Accessories",
      potion: "Potions",
      enemy: "Enemies",
      spell: "Spells",
      location: "Locations",
    }

    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Get rarity color class
  const getRarityColorClass = (rarity?: string): string => {
    if (!rarity) return "text-gray-400"

    const rarityColors: Record<string, string> = {
      common: "text-gray-200",
      uncommon: "text-green-400",
      rare: "text-blue-400",
      epic: "text-purple-400",
      legendary: "text-orange-400",
    }

    return rarityColors[rarity] || "text-gray-400"
  }

  const tabs = ["Items", "Enemies", "Spells"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-[95%] max-w-5xl h-[95%] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Codex</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Discovered: {categoryCounts.all.discovered} / {categoryCounts.all.total}
            </div>
            <Button variant="outline" onClick={() => setShowCodex(false)}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <div className="px-4 pt-2 border-b border-gray-700">
            <TabsList className="bg-gray-800">
              <TabsTrigger
                value="all"
                onClick={() => setSelectedCategory("all")}
                className="data-[state=active]:bg-gray-700"
              >
                All ({categoryCounts.all.discovered}/{categoryCounts.all.total})
              </TabsTrigger>
              <TabsTrigger
                value="weapon"
                onClick={() => setSelectedCategory("weapon")}
                className="data-[state=active]:bg-gray-700"
              >
                Weapons ({categoryCounts.weapon.discovered}/{categoryCounts.weapon.total})
              </TabsTrigger>
              <TabsTrigger
                value="armor"
                onClick={() => setSelectedCategory("armor")}
                className="data-[state=active]:bg-gray-700"
              >
                Armor ({categoryCounts.armor.discovered}/{categoryCounts.armor.total})
              </TabsTrigger>
              <TabsTrigger
                value="accessory"
                onClick={() => setSelectedCategory("accessory")}
                className="data-[state=active]:bg-gray-700"
              >
                Accessories ({categoryCounts.accessory.discovered}/{categoryCounts.accessory.total})
              </TabsTrigger>
              <TabsTrigger
                value="potion"
                onClick={() => setSelectedCategory("potion")}
                className="data-[state=active]:bg-gray-700"
              >
                Potions ({categoryCounts.potion.discovered}/{categoryCounts.potion.total})
              </TabsTrigger>
              <TabsTrigger
                value="enemy"
                onClick={() => setSelectedCategory("enemy")}
                className="data-[state=active]:bg-gray-700"
              >
                Enemies ({categoryCounts.enemy.discovered}/{categoryCounts.enemy.total})
              </TabsTrigger>
              <TabsTrigger
                value="spell"
                onClick={() => setSelectedCategory("spell")}
                className="data-[state=active]:bg-gray-700"
              >
                Spells ({categoryCounts.spell.discovered}/{categoryCounts.spell.total})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="flex-1 p-0 m-0 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="p-4 space-y-6">
                {Object.keys(groupedEntries).length > 0 ? (
                  Object.keys(groupedEntries).map((category) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
                        {getCategoryDisplayName(category)}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupedEntries[category].map((entry) => (
                          <div
                            key={entry.id}
                            className={`p-3 rounded-md ${entry.discovered ? "bg-gray-800" : "bg-gray-900"} border border-gray-700 overflow-hidden`}
                          >
                            {entry.discovered ? (
                              <>
                                <div className="flex justify-between items-start">
                                  <h4 className={`font-bold ${getRarityColorClass(entry.rarity)} truncate mr-2`}>
                                    {entry.name}
                                  </h4>
                                  {entry.rarity && (
                                    <Badge
                                      variant="outline"
                                      className={`${getRarityColorClass(entry.rarity)} shrink-0`}
                                    >
                                      {entry.rarity.charAt(0).toUpperCase() + entry.rarity.slice(1)}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm mt-1 break-words">{entry.description}</p>
                                {entry.levelRequirement && (
                                  <p className="text-gray-500 text-xs mt-1">Required Level: {entry.levelRequirement}</p>
                                )}
                                {entry.classRestriction && entry.classRestriction.length > 0 && (
                                  <p className="text-gray-500 text-xs mt-1 truncate">
                                    Classes: {entry.classRestriction.join(", ")}
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-gray-500">#{entry.id.slice(-4)}</p>
                                <p className="text-gray-600 text-xs">Not yet discovered</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">No entries found matching your search.</div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Individual category tabs - they all use the same content structure */}
          {["weapon", "armor", "accessory", "potion", "enemy", "spell"].map((category) => (
            <TabsContent key={category} value={category} className="flex-1 p-0 m-0 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="p-4">
                  {groupedEntries[category] && groupedEntries[category].length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedEntries[category].map((entry) => (
                        <div
                          key={entry.id}
                          className={`p-3 rounded-md ${entry.discovered ? "bg-gray-800" : "bg-gray-900"} border border-gray-700 overflow-hidden`}
                        >
                          {entry.discovered ? (
                            <>
                              <div className="flex justify-between items-start">
                                <h4 className={`font-bold ${getRarityColorClass(entry.rarity)} truncate mr-2`}>
                                  {entry.name}
                                </h4>
                                {entry.rarity && (
                                  <Badge variant="outline" className={`${getRarityColorClass(entry.rarity)} shrink-0`}>
                                    {entry.rarity.charAt(0).toUpperCase() + entry.rarity.slice(1)}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mt-1 break-words">{entry.description}</p>
                              {entry.levelRequirement && (
                                <p className="text-gray-500 text-xs mt-1">Required Level: {entry.levelRequirement}</p>
                              )}
                              {entry.classRestriction && entry.classRestriction.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1 truncate">
                                  Classes: {entry.classRestriction.join(", ")}
                                </p>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-2">
                              <p className="text-gray-500">#{entry.id.slice(-4)}</p>
                              <p className="text-gray-600 text-xs">Not yet discovered</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No entries found matching your search.</div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        <button onClick={() => setShowCodex(false)} className="absolute top-2 right-2 text-black hover:text-gray-700">
          Close
        </button>
      </div>
    </div>
  )
}

