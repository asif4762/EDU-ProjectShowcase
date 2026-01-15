"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { GameState } from "@/lib/game-types"

interface Game2048Props {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const GRID_SIZE = 4

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-muted/30", text: "text-transparent" },
  2: { bg: "bg-amber-100", text: "text-amber-900" },
  4: { bg: "bg-amber-200", text: "text-amber-900" },
  8: { bg: "bg-orange-300", text: "text-white" },
  16: { bg: "bg-orange-400", text: "text-white" },
  32: { bg: "bg-orange-500", text: "text-white" },
  64: { bg: "bg-red-500", text: "text-white" },
  128: { bg: "bg-yellow-400", text: "text-white" },
  256: { bg: "bg-yellow-500", text: "text-white" },
  512: { bg: "bg-yellow-600", text: "text-white" },
  1024: { bg: "bg-yellow-700", text: "text-white" },
  2048: { bg: "bg-primary", text: "text-primary-foreground" },
}

export function Game2048({ gameState, setGameState }: Game2048Props) {
  const [grid, setGrid] = useState<number[][]>([])
  const [score, setScore] = useState(0)

  const addRandomTile = useCallback((grid: number[][]) => {
    const emptyCells: { row: number; col: number }[] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push({ row, col })
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      grid[row][col] = Math.random() < 0.9 ? 2 : 4
    }

    return grid
  }, [])

  const initializeGrid = useCallback(() => {
    let newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0))
    newGrid = addRandomTile(newGrid)
    newGrid = addRandomTile(newGrid)
    return newGrid
  }, [addRandomTile])

  useEffect(() => {
    const newGrid = initializeGrid()
    setGrid(newGrid)
    setScore(0)
    setGameState((prev) => ({ ...prev, status: "playing", score: 0 }))
  }, [initializeGrid, setGameState])

  const checkGameOver = useCallback((grid: number[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0) return false
        if (col < GRID_SIZE - 1 && grid[row][col] === grid[row][col + 1]) return false
        if (row < GRID_SIZE - 1 && grid[row][col] === grid[row + 1][col]) return false
      }
    }
    return true
  }, [])

  const checkWin = useCallback((grid: number[][]) => {
    return grid.some((row) => row.some((cell) => cell === 2048))
  }, [])

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameState.status !== "playing") return

      let newGrid = grid.map((row) => [...row])
      let moved = false
      let newScore = score

      const slide = (row: number[]) => {
        const filtered = row.filter((val) => val !== 0)
        const merged: number[] = []

        for (let i = 0; i < filtered.length; i++) {
          if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
            merged.push(filtered[i] * 2)
            newScore += filtered[i] * 2
            i++
          } else {
            merged.push(filtered[i])
          }
        }

        while (merged.length < GRID_SIZE) {
          merged.push(0)
        }

        return merged
      }

      if (direction === "left") {
        for (let row = 0; row < GRID_SIZE; row++) {
          const newRow = slide(newGrid[row])
          if (newRow.join() !== newGrid[row].join()) moved = true
          newGrid[row] = newRow
        }
      } else if (direction === "right") {
        for (let row = 0; row < GRID_SIZE; row++) {
          const newRow = slide([...newGrid[row]].reverse()).reverse()
          if (newRow.join() !== newGrid[row].join()) moved = true
          newGrid[row] = newRow
        }
      } else if (direction === "up") {
        for (let col = 0; col < GRID_SIZE; col++) {
          const column = newGrid.map((row) => row[col])
          const newCol = slide(column)
          if (newCol.join() !== column.join()) moved = true
          for (let row = 0; row < GRID_SIZE; row++) {
            newGrid[row][col] = newCol[row]
          }
        }
      } else if (direction === "down") {
        for (let col = 0; col < GRID_SIZE; col++) {
          const column = newGrid.map((row) => row[col])
          const newCol = slide([...column].reverse()).reverse()
          if (newCol.join() !== column.join()) moved = true
          for (let row = 0; row < GRID_SIZE; row++) {
            newGrid[row][col] = newCol[row]
          }
        }
      }

      if (moved) {
        newGrid = addRandomTile(newGrid)
        setGrid(newGrid)
        setScore(newScore)

        if (checkWin(newGrid)) {
          setGameState((prev) => ({ ...prev, status: "win", score: newScore }))
        } else if (checkGameOver(newGrid)) {
          setGameState((prev) => ({ ...prev, status: "lose", score: newScore }))
        } else {
          setGameState((prev) => ({ ...prev, score: newScore }))
        }
      }
    },
    [grid, score, gameState.status, addRandomTile, checkWin, checkGameOver, setGameState],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const direction = e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right"
        move(direction)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [move])

  const getTileStyle = (value: number) => {
    return TILE_COLORS[value] || TILE_COLORS[2048]
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <div className="px-6 py-3 rounded-lg bg-card border border-border">
          <span className="text-muted-foreground text-sm">Score</span>
          <div className="text-2xl font-bold text-primary">{score}</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-muted/50 backdrop-blur border border-border">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const style = getTileStyle(cell)
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-muted/30"
                >
                  <AnimatePresence mode="popLayout">
                    {cell !== 0 && (
                      <motion.div
                        key={`${cell}-${rowIndex}-${colIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`absolute inset-0 flex items-center justify-center rounded-lg font-bold ${style.bg} ${style.text} ${
                          cell >= 100
                            ? "text-lg sm:text-xl"
                            : cell >= 1000
                              ? "text-base sm:text-lg"
                              : "text-xl sm:text-2xl"
                        }`}
                      >
                        {cell}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }),
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Use arrow keys to move tiles</p>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button
            onClick={() => move("up")}
            className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => move("left")}
            className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => move("down")}
            className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            ↓
          </button>
          <button
            onClick={() => move("right")}
            className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
