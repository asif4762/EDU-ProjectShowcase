"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameState } from "@/lib/game-types"

interface SnakeLaddersGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const BOARD_SIZE = 10
const TOTAL_SQUARES = 100

const SNAKES: Record<number, number> = {
  99: 54,
  95: 75,
  87: 24,
  62: 19,
  48: 26,
  36: 6,
  16: 4,
}

const LADDERS: Record<number, number> = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  51: 67,
  71: 91,
  78: 98,
  80: 100,
}

export function SnakeLaddersGame({ gameState, setGameState }: SnakeLaddersGameProps) {
  const [positions, setPositions] = useState<Record<string, number>>({ player: 0, ai: 0 })
  const [currentTurn, setCurrentTurn] = useState<"player" | "ai">("player")
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [message, setMessage] = useState("Roll the dice to start!")

  useEffect(() => {
    setPositions({ player: 0, ai: 0 })
    setCurrentTurn("player")
    setDiceValue(null)
    setMessage("Roll the dice to start!")
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      playerPositions: { player: 0, ai: 0 },
    }))
  }, [setGameState])

  const rollDice = useCallback(() => {
    if (isRolling || gameState.status !== "playing") return

    setIsRolling(true)
    let rolls = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls >= 10) {
        clearInterval(rollInterval)
        const finalValue = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalValue)
        setIsRolling(false)

        const currentPos = positions[currentTurn]
        let newPos = currentPos + finalValue

        if (newPos > TOTAL_SQUARES) {
          setMessage(`${currentTurn === "player" ? "You" : "AI"} need exact number to win!`)
          setCurrentTurn(currentTurn === "player" ? "ai" : "player")
          if (currentTurn === "player") {
            setTimeout(() => rollDice(), 1500)
          }
          return
        }

        if (SNAKES[newPos]) {
          setMessage(
            `${currentTurn === "player" ? "You" : "AI"} hit a snake! Going down from ${newPos} to ${SNAKES[newPos]}`,
          )
          newPos = SNAKES[newPos]
        } else if (LADDERS[newPos]) {
          setMessage(
            `${currentTurn === "player" ? "You" : "AI"} found a ladder! Climbing from ${newPos} to ${LADDERS[newPos]}`,
          )
          newPos = LADDERS[newPos]
        } else {
          setMessage(`${currentTurn === "player" ? "You" : "AI"} moved to ${newPos}`)
        }

        const newPositions = { ...positions, [currentTurn]: newPos }
        setPositions(newPositions)

        if (newPos >= TOTAL_SQUARES) {
          setGameState((prev) => ({
            ...prev,
            status: currentTurn === "player" ? "win" : "lose",
            playerPositions: newPositions,
          }))
          setMessage(`${currentTurn === "player" ? "You" : "AI"} wins!`)
        } else {
          setGameState((prev) => ({
            ...prev,
            playerPositions: newPositions,
          }))

          const nextTurn = currentTurn === "player" ? "ai" : "player"
          setCurrentTurn(nextTurn)

          if (nextTurn === "ai") {
            setTimeout(() => rollDice(), 1500)
          }
        }
      }
    }, 100)
  }, [isRolling, gameState.status, positions, currentTurn, setGameState])

  const getSquareNumber = (row: number, col: number) => {
    const baseNum = (BOARD_SIZE - 1 - row) * BOARD_SIZE
    return row % 2 === BOARD_SIZE % 2 ? baseNum + col + 1 : baseNum + (BOARD_SIZE - col)
  }

  const getSquarePosition = (num: number) => {
    if (num === 0) return { row: BOARD_SIZE, col: -1 }
    const row = BOARD_SIZE - Math.ceil(num / BOARD_SIZE)
    const rowFromBottom = BOARD_SIZE - 1 - row
    const col = rowFromBottom % 2 === 0 ? (num - 1) % BOARD_SIZE : BOARD_SIZE - 1 - ((num - 1) % BOARD_SIZE)
    return { row, col }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="px-4 py-2 rounded-lg bg-card border border-border">
          <span className="text-muted-foreground">Turn:</span>{" "}
          <span className={`font-bold ${currentTurn === "player" ? "text-primary" : "text-accent"}`}>
            {currentTurn === "player" ? "Your Turn" : "AI Turn"}
          </span>
        </div>
        {diceValue && (
          <motion.div
            key={diceValue}
            initial={{ scale: 1.5, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-12 h-12 rounded-lg bg-white text-black flex items-center justify-center text-2xl font-bold shadow-lg"
          >
            {diceValue}
          </motion.div>
        )}
      </div>

      {/* Message */}
      <p className="text-center text-muted-foreground">{message}</p>

      {/* Board */}
      <div className="relative p-2 rounded-xl bg-card/50 backdrop-blur border border-border">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
          {Array.from({ length: BOARD_SIZE }).map((_, row) =>
            Array.from({ length: BOARD_SIZE }).map((_, col) => {
              const num = getSquareNumber(row, col)
              const isSnake = SNAKES[num]
              const isLadder = LADDERS[num]
              const playerPos = getSquarePosition(positions.player)
              const aiPos = getSquarePosition(positions.ai)
              const hasPlayer = playerPos.row === row && playerPos.col === col
              const hasAI = aiPos.row === row && aiPos.col === col

              return (
                <div
                  key={`${row}-${col}`}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-medium rounded relative
                    ${isSnake ? "bg-red-500/30" : isLadder ? "bg-green-500/30" : (row + col) % 2 === 0 ? "bg-card" : "bg-muted"}`}
                >
                  <span className="opacity-50">{num}</span>
                  {hasPlayer && (
                    <motion.div
                      layoutId="player"
                      className="absolute w-4 h-4 rounded-full bg-primary shadow-lg"
                      style={{ zIndex: 10 }}
                    />
                  )}
                  {hasAI && (
                    <motion.div
                      layoutId="ai"
                      className="absolute w-4 h-4 rounded-full bg-accent shadow-lg"
                      style={{ zIndex: 10, marginLeft: hasPlayer ? "8px" : 0 }}
                    />
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>You: {positions.player}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span>AI: {positions.ai}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500/30" />
          <span>Snake</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500/30" />
          <span>Ladder</span>
        </div>
      </div>

      {/* Roll Button */}
      <Button
        size="lg"
        onClick={rollDice}
        disabled={isRolling || currentTurn !== "player" || gameState.status !== "playing"}
        className="bg-gradient-to-r from-primary to-accent"
      >
        <Dices className="w-5 h-5 mr-2" />
        {isRolling ? "Rolling..." : "Roll Dice"}
      </Button>
    </div>
  )
}
