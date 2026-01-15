"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameState } from "@/lib/game-types"

interface LudoGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

type PlayerColor = "red" | "blue" | "green" | "yellow"

const COLORS: Record<PlayerColor, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
}

export function LudoGame({ gameState, setGameState }: LudoGameProps) {
  const [positions, setPositions] = useState<Record<PlayerColor, number[]>>({
    red: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
  })
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>("red")
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const [message, setMessage] = useState("Red's turn - Roll the dice!")

  useEffect(() => {
    setPositions({
      red: [-1, -1, -1, -1],
      blue: [-1, -1, -1, -1],
      green: [-1, -1, -1, -1],
      yellow: [-1, -1, -1, -1],
    })
    setCurrentPlayer("red")
    setDiceValue(null)
    setMessage("Red's turn - Roll the dice!")
    setGameState((prev) => ({
      ...prev,
      status: "playing",
      currentPlayer: "red",
    }))
  }, [setGameState])

  const rollDice = useCallback(() => {
    if (isRolling || diceValue !== null) return

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

        const canMove = positions[currentPlayer].some((pos) => {
          if (pos === -1 && finalValue === 6) return true
          if (pos >= 0 && pos + finalValue <= 56) return true
          return false
        })

        if (!canMove) {
          setMessage(`${currentPlayer} can't move. Next player's turn.`)
          setTimeout(() => {
            setDiceValue(null)
            const players: PlayerColor[] = ["red", "blue", "green", "yellow"]
            const nextIndex = (players.indexOf(currentPlayer) + 1) % 4
            setCurrentPlayer(players[nextIndex])
            setMessage(`${players[nextIndex]}'s turn - Roll the dice!`)
          }, 1500)
        } else {
          setMessage(`${currentPlayer} rolled ${finalValue}. Select a token to move.`)
        }
      }
    }, 100)
  }, [isRolling, diceValue, currentPlayer, positions])

  const moveToken = useCallback(
    (tokenIndex: number) => {
      if (diceValue === null) return

      const currentPos = positions[currentPlayer][tokenIndex]

      if (currentPos === -1 && diceValue !== 6) return
      if (currentPos >= 0 && currentPos + diceValue > 56) return

      const newPos = currentPos === -1 ? 0 : currentPos + diceValue
      const newPositions = { ...positions }
      newPositions[currentPlayer] = [...positions[currentPlayer]]
      newPositions[currentPlayer][tokenIndex] = newPos
      setPositions(newPositions)

      const won = newPositions[currentPlayer].every((p) => p === 56)

      if (won) {
        setGameState((prev) => ({
          ...prev,
          status: currentPlayer === "red" ? "win" : "lose",
        }))
        setMessage(`${currentPlayer} wins!`)
      } else {
        const players: PlayerColor[] = ["red", "blue", "green", "yellow"]
        const nextPlayer = diceValue === 6 ? currentPlayer : players[(players.indexOf(currentPlayer) + 1) % 4]
        setCurrentPlayer(nextPlayer)
        setDiceValue(null)
        setMessage(`${nextPlayer}'s turn - Roll the dice!`)

        if (nextPlayer !== "red" && gameState.status === "playing") {
          setTimeout(() => rollDice(), 1000)
        }
      }
    },
    [diceValue, positions, currentPlayer, setGameState, gameState.status, rollDice],
  )

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Status */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="px-4 py-2 rounded-lg bg-card border border-border">
          <span className="text-muted-foreground">Turn:</span>{" "}
          <span className="font-bold capitalize" style={{ color: COLORS[currentPlayer] }}>
            {currentPlayer}
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

      <p className="text-center text-muted-foreground text-sm">{message}</p>

      {/* Simplified Ludo Board */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-xl bg-card border-2 border-border overflow-hidden">
        {/* Corner bases */}
        {(["red", "blue", "green", "yellow"] as PlayerColor[]).map((color, i) => {
          const corners = [
            { top: "0", left: "0" },
            { top: "0", right: "0" },
            { bottom: "0", right: "0" },
            { bottom: "0", left: "0" },
          ]
          return (
            <div
              key={color}
              className="absolute w-[40%] h-[40%] rounded-lg flex flex-wrap items-center justify-center gap-2 p-4"
              style={{
                ...corners[i],
                backgroundColor: `${COLORS[color]}20`,
                border: `2px solid ${COLORS[color]}`,
              }}
            >
              {positions[color].map((pos, tokenIdx) => (
                <motion.button
                  key={tokenIdx}
                  onClick={() => color === "red" && diceValue !== null && moveToken(tokenIdx)}
                  disabled={color !== "red" || diceValue === null}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg transition-transform ${
                    color === "red" && diceValue !== null ? "cursor-pointer hover:scale-110" : ""
                  }`}
                  style={{
                    backgroundColor: COLORS[color],
                    opacity: pos === 56 ? 0.3 : 1,
                  }}
                  whileHover={color === "red" && diceValue !== null ? { scale: 1.1 } : {}}
                  whileTap={color === "red" && diceValue !== null ? { scale: 0.9 } : {}}
                >
                  {pos >= 0 && pos < 56 && (
                    <span className="text-[8px] sm:text-[10px] font-bold text-white">{pos}</span>
                  )}
                </motion.button>
              ))}
            </div>
          )
        })}

        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-linear-to-br from-primary/30 to-accent/30 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-primary">HOME</span>
        </div>
      </div>

      {/* Roll Button */}
      <Button
        size="lg"
        onClick={rollDice}
        disabled={isRolling || diceValue !== null || currentPlayer !== "red" || gameState.status !== "playing"}
        className="bg-linear-to-r from-primary to-accent"
      >
        <Dices className="w-5 h-5 mr-2" />
        {isRolling ? "Rolling..." : "Roll Dice"}
      </Button>
    </div>
  )
}
