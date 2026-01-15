"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { LandingPage } from "@/components/landing-page"
import { GameArena } from "@/components/game-arena"
import type { GameType } from "@/lib/game-types"

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [selectedGame, setSelectedGame] = useState<GameType>("chess")

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <LandingPage
            key="landing"
            onStartGame={(game) => {
              setSelectedGame(game)
              setGameStarted(true)
            }}
          />
        ) : (
          <GameArena key="arena" game={selectedGame} onBack={() => setGameStarted(false)} />
        )}
      </AnimatePresence>
    </main>
  )
}
