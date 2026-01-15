"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Flag, Bomb } from "lucide-react"
import type { GameState } from "@/lib/game-types"

interface MinesweeperGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const GRID_SIZE = 10
const MINE_COUNT = 15

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

export function MinesweeperGame({ gameState, setGameState }: MinesweeperGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [firstClick, setFirstClick] = useState(true)

  const initializeGrid = useCallback((excludeRow?: number, excludeCol?: number) => {
    const newGrid: Cell[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          })),
      )

    let minesPlaced = 0
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      if (!newGrid[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
        newGrid[row][col].isMine = true
        minesPlaced++
      }
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = row + dr
              const nc = col + dc
              if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                count++
              }
            }
          }
          newGrid[row][col].adjacentMines = count
        }
      }
    }

    return newGrid
  }, [])

  useEffect(() => {
    setGrid(initializeGrid())
    setGameOver(false)
    setFirstClick(true)
    setGameState((prev) => ({ ...prev, status: "playing", score: 0 }))
  }, [initializeGrid, setGameState])

  const revealCell = useCallback((row: number, col: number, currentGrid: Cell[][]) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return currentGrid
    if (currentGrid[row][col].isRevealed || currentGrid[row][col].isFlagged) return currentGrid

    const newGrid = currentGrid.map((r) => r.map((c) => ({ ...c })))
    newGrid[row][col].isRevealed = true

    if (newGrid[row][col].adjacentMines === 0 && !newGrid[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            const result = revealCell(row + dr, col + dc, newGrid)
            for (let i = 0; i < GRID_SIZE; i++) {
              for (let j = 0; j < GRID_SIZE; j++) {
                newGrid[i][j] = result[i][j]
              }
            }
          }
        }
      }
    }

    return newGrid
  }, [])

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (gameOver || grid[row][col].isRevealed || grid[row][col].isFlagged) return

      let currentGrid = grid

      if (firstClick) {
        currentGrid = initializeGrid(row, col)
        setFirstClick(false)
      }

      if (currentGrid[row][col].isMine) {
        const newGrid = currentGrid.map((r) => r.map((c) => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed })))
        setGrid(newGrid)
        setGameOver(true)
        setGameState((prev) => ({ ...prev, status: "lose" }))
        return
      }

      const newGrid = revealCell(row, col, currentGrid)
      setGrid(newGrid)

      const revealedCount = newGrid.flat().filter((c) => c.isRevealed).length
      const nonMineCount = GRID_SIZE * GRID_SIZE - MINE_COUNT

      setGameState((prev) => ({
        ...prev,
        score: revealedCount * 10,
        status: revealedCount === nonMineCount ? "win" : "playing",
      }))

      if (revealedCount === nonMineCount) {
        setGameOver(true)
      }
    },
    [grid, gameOver, firstClick, initializeGrid, revealCell, setGameState],
  )

  const handleRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault()
      if (gameOver || grid[row][col].isRevealed) return

      const newGrid = grid.map((r) => r.map((c) => ({ ...c })))
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged
      setGrid(newGrid)
    },
    [grid, gameOver],
  )

  const flagCount = grid.flat().filter((c) => c.isFlagged).length

  const getNumberColor = (num: number) => {
    const colors = [
      "",
      "text-blue-400",
      "text-green-400",
      "text-red-400",
      "text-purple-400",
      "text-yellow-400",
      "text-cyan-400",
      "text-pink-400",
      "text-white",
    ]
    return colors[num] || "text-white"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <div className="px-4 py-2 rounded-lg bg-card border border-border flex items-center gap-2">
          <Bomb className="w-4 h-4 text-destructive" />
          <span>{MINE_COUNT - flagCount}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-card border border-border flex items-center gap-2">
          <Flag className="w-4 h-4 text-primary" />
          <span>{flagCount}</span>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-card/50 backdrop-blur border border-border">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold rounded transition-all ${
                  cell.isRevealed
                    ? cell.isMine
                      ? "bg-destructive"
                      : "bg-muted"
                    : "bg-gradient-to-br from-primary/30 to-accent/30 hover:from-primary/40 hover:to-accent/40"
                }`}
                whileHover={{ scale: cell.isRevealed ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <Bomb className="w-4 h-4" />
                  ) : cell.adjacentMines > 0 ? (
                    <span className={getNumberColor(cell.adjacentMines)}>{cell.adjacentMines}</span>
                  ) : null
                ) : cell.isFlagged ? (
                  <Flag className="w-4 h-4 text-primary" />
                ) : null}
              </motion.button>
            )),
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Left click to reveal, right click to flag</p>
    </div>
  )
}
