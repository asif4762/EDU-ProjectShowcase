"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { GameState } from "@/lib/game-types"

interface MemoryGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎵", "🎹"]
const GRID_SIZE = 4

export function MemoryGame({ gameState, setGameState }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [canFlip, setCanFlip] = useState(true)

  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameState((prev) => ({
      ...prev,
      score: 0,
      status: "playing",
      flippedCards: [],
      matchedPairs: [],
    }))
  }, [setGameState])

  const handleCardClick = useCallback(
    (index: number) => {
      if (!canFlip || flipped.includes(index) || matched.includes(index)) return

      const newFlipped = [...flipped, index]
      setFlipped(newFlipped)

      if (newFlipped.length === 2) {
        setCanFlip(false)
        setMoves((m) => m + 1)

        if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
          const newMatched = [...matched, ...newFlipped]
          setMatched(newMatched)
          setFlipped([])
          setCanFlip(true)

          const score = newMatched.length * 10 - moves * 2
          setGameState((prev) => ({
            ...prev,
            score: Math.max(0, score),
            matchedPairs: newMatched,
            status: newMatched.length === cards.length ? "win" : "playing",
          }))
        } else {
          setTimeout(() => {
            setFlipped([])
            setCanFlip(true)
          }, 1000)
        }
      }
    },
    [canFlip, flipped, matched, cards, moves, setGameState],
  )

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8 text-lg">
        <div className="px-4 py-2 rounded-lg bg-card border border-border">
          <span className="text-muted-foreground">Moves:</span> <span className="font-bold text-primary">{moves}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-card border border-border">
          <span className="text-muted-foreground">Pairs:</span>{" "}
          <span className="font-bold text-primary">
            {matched.length / 2}/{EMOJIS.length}
          </span>
        </div>
      </div>

      <div
        className="grid gap-3 p-6 rounded-2xl bg-card/50 backdrop-blur border border-border"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)
          const isMatched = matched.includes(index)

          return (
            <motion.button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 ${
                isMatched
                  ? "bg-primary/20 border-2 border-primary"
                  : isFlipped
                    ? "bg-card border-2 border-accent"
                    : "bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: isFlipped ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isFlipped ? (
                  <motion.span
                    key="emoji"
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="question"
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-muted-foreground"
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
